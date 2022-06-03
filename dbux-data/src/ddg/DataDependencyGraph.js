import EmptyArray from '@dbux/common/src/util/EmptyArray';
import Enum from '@dbux/common/src/util/Enum';
import { RootTimelineId } from './constants';
import BaseDDG from './BaseDDG';
import { EdgeState } from './DDGEdge';
import DDGSummaryMode, { isSummaryMode, isCollapsedMode, isShownMode } from './DDGSummaryMode';
import ddgQueries from './ddgQueries';
import DDGEdgeType from './DDGEdgeType';
import DDGNodeSummary from './DDGNodeSummary';
import { DDGTimelineNode } from './DDGTimelineNodes';

/** @typedef {import('@dbux/common/src/types/RefSnapshot').ISnapshotChildren} ISnapshotChildren */
/** @typedef { Map.<number, number> } SnapshotMap */

/** ###########################################################################
 * default config
 * ##########################################################################*/

// const RootDefaultSummaryMode = {
// };
const RootDefaultSummaryMode = DDGSummaryMode.SummarizeChildren;
// const RootDefaultSummaryMode = DDGSummaryMode.HideChildren;

/** ###########################################################################
 * {@link BuildStage}
 * ##########################################################################*/

const buildStageObj = {
  None: 0,
  /**
   * Building initial graph.
   */
  Building: 1,
  /**
   * Building a summarized graph from an already existing initial graph.
   */
  Summarizing: 2
};
const BuildStage = new Enum(buildStageObj);

/** ###########################################################################
 * utilities
 *  #########################################################################*/

class SummaryState {
  /**
   * From → To → summary state.
   * Indexed by `timelineId`.
   * 
   * @type {Map.<number, Map.<number, EdgeState>>}
   */
  visibleEdges = new Map();

  /**
   * This maps all nodes to the visible nodes that replace them.
   * Visible nodes are mapped to themselves.
   * Indexed by `timelineId`.
   * 
   * @type {Map.<number, Array.<DDGTimelineNode>}
   */
  nodeRouteMap = new Map();

  /**
   * Represents the currently collapsed ancestor.
   * All nested edges will be re-routed to it.
   */
  currentCollapsedAncestor = null;

  addEdge(from, to, type) {
    const { visibleEdges } = this;
    let edgeTargets = visibleEdges.get(from.timelineId);
    if (!edgeTargets) {
      visibleEdges.set(from.timelineId, edgeTargets = new Map());
    }
    let edgeState = edgeTargets.get(to.timelineId);
    if (!edgeState) {
      edgeTargets.set(to.timelineId, edgeState = new EdgeState());
    }
    edgeState.nByType[type] = (edgeState.nByType[type] || 0) + 1;
  }
}


/** ###########################################################################
 * {@link DataDependencyGraph}
 *  #########################################################################*/

/**
 * 
 */
export default class DataDependencyGraph extends BaseDDG {
  buildStage = BuildStage.None;

  /**
   * The complete base graph
   * @type {BaseDDG}
   */
  og;

  /**
   * @type {Object.<number, SummaryModeValue>}
   */
  summaryModes = {};

  /**
   * Summary data by `timelineId`.
   * NOTE: This is built lazily in `buildNodeSummary`.
   * 
   * @type {Object.<number, DDGNodeSummary>}
   */
  nodeSummaries = {};

  constructor(dp, graphId) {
    super(dp, graphId);
  }

  getRenderData() {
    const {
      // original node data
      og: {
        timelineNodes,
      },

      // summary data
      summaryModes,
      nodeSummaries,

      // current edge data
      edges,
      outEdgesByTimelineId,
      inEdgesByTimelineId
    } = this;

    return {
      timelineNodes,

      summaryModes,
      nodeSummaries,
      edges,
      outEdgesByTimelineId,
      inEdgesByTimelineId
    };
  }

  /**
   * The data that changes over time.
   */
  getChangingData() {
    const {
      summaryModes,
      edges,
      outEdgesByTimelineId,
      inEdgesByTimelineId
    } = this;

    return {
      summaryModes,
      edges,
      outEdgesByTimelineId,
      inEdgesByTimelineId
    };
  }

  /** ###########################################################################
   * getters
   * ##########################################################################*/

  get watchSet() {
    return this.og.watchSet;
  }

  get bounds() {
    return this.og.bounds;
  }

  get timelineNodes() {
    return this.og.timelineNodes;
  }

  get isBuilding() {
    return BuildStage.is.Building(this.buildStage);
  }

  get isSummarizing() {
    return BuildStage.is.Summarizing(this.buildStage);
  }

  /** ###########################################################################
   * public control methods
   *  #########################################################################*/

  setMergeComputes(on) {
    // TODO
  }

  setSummaryMode(timelineId, mode) {
    // update node modes
    this.#applyMode(timelineId, mode);

    // refresh the summarized graph
    this.#applySummarization();
  }

  /**
   * During initial build, not all details of every node are prepared.
   * When investigating a node's details, this function needs to run first.
   */
  #buildNodeSummary(timelineId) {
    this.#buildNodeSummarySnapshots(timelineId);
  }


  /** ###########################################################################
   * build
   * ##########################################################################*/

  /**
   * @param {number[]} watchTraceIds 
   */
  build(watchTraceIds) {
    if (!this.og) {
      this.og = new BaseDDG(this.dp, this.graphId);
    }
    this.buildStage = BuildStage.Building;
    try {
      this.og.build(watchTraceIds);
    }
    finally {
      this.buildStage = BuildStage.None;
    }

    this.buildStage = BuildStage.Summarizing;
    try {
      this.#initSummaryConfig();
      this.#applySummarization();
    }
    finally {
      this.buildStage = BuildStage.None;
    }
  }

  /** ###########################################################################
   * more reset + init stuff
   * ##########################################################################*/

  resetBuild() {
    this.resetEdges(); // only reset (set) edges
  }

  #initSummaryConfig() {
    this.summaryModes = {};

    // update node modes
    this.#applyMode(RootTimelineId, RootDefaultSummaryMode);
  }

  /**
   * @param {number} timelineId
   */
  #buildNodeSummarySnapshots(timelineId) {
    const { dp } = this;
    const node = this.timelineNodes[timelineId];
    if (!node.hasRefWriteNodes || this.nodeSummaries[timelineId]) {
      // already built or nothing to build
      return;
    }

    const lastModifyNodesByRefId = new Map();
    const varModifyDataNodes = new Map();
    const lastNestedDataNodeId = this.#collectNestedUniqueSummaryTrees(node, node, lastModifyNodesByRefId, varModifyDataNodes);

    // add ref snapshots
    /**
     * @type {SnapshotMap}
     */
    const snapshotsByRefId = new Map();
    for (const [refId, dataNodeId] of lastModifyNodesByRefId) {
      const lastDataNodeIdOfRef = this.og._lastAccessDataNodeIdByRefId[refId];
      if (lastDataNodeIdOfRef <= lastNestedDataNodeId) {
        // skip: this ref is only used internally (or before) this node. It is not accessed AFTER this node.
        continue;
      }
      if (snapshotsByRefId.has(refId)) {
        // skip: this ref was already added as a descendant of a previous ref
        continue;
      }
      const dataNode = dp.collections.dataNodes.getById(dataNodeId);
      this.og.addNewRefSnapshot(dataNode, refId, snapshotsByRefId, null);
    }

    // add var nodes
    const varNodesByDeclarationTid = new Map();
    for (const [declarationTid, varNodeTimelineId] of varModifyDataNodes) {
      varNodesByDeclarationTid.set(declarationTid, this.deepCloneNode(varNodeTimelineId));
    }

    const summaryRoots = (
      // ref roots
      Array.from(snapshotsByRefId.values())
        .filter(snapshotId => !this.timelineNodes[snapshotId].parentNodeId)
        .concat(
          // var roots
          Array.from(varNodesByDeclarationTid.values()).map(n => n.timelineId)
        ));

    this.nodeSummaries[timelineId] = new DDGNodeSummary(timelineId, snapshotsByRefId, varNodesByDeclarationTid, summaryRoots);
  }

  /**
   * Finds all nested modified `refId`s nested in the given node and its descendants.
   * 
   * @param {DDGTimelineNode} summarizingNode
   * @param {DDGTimelineNode} node
   * @param {Map.<number, number>} lastModifyNodesByRefId
   * @return {number} The `lastDataNodeId` of the entire node.
   */
  #collectNestedUniqueSummaryTrees(summarizingNode, node, lastModifyNodesByRefId, varModifyDataNodes) {
    const { dp } = this;
    let lastDataNodeId = node.dataNodeId;
    if (node.dataNodeId) {
      const refId = dp.util.getDataNodeModifyingRefId(node.dataNodeId);
      let varDeclarationTid;
      if (refId) {
        // Ref Write
        lastModifyNodesByRefId.set(refId, node.dataNodeId);
      }
      else if ((varDeclarationTid = dp.util.getDataNodeModifyingVarDeclarationTid(node.dataNodeId))) {
        // Variable Write
        if (!summarizingNode.pushTid || varDeclarationTid < summarizingNode.pushTid) {
          // store variable writes, if variable was declared before summarizingNode
          varModifyDataNodes.set(varDeclarationTid, node.timelineId);
        }
      }
    }
    if (node.children) {
      for (const childId of Object.values(node.children)) {
        const childNode = this.timelineNodes[childId];
        const lastChildDataNodeId = this.#collectNestedUniqueSummaryTrees(summarizingNode, childNode, lastModifyNodesByRefId, varModifyDataNodes);
        if (lastChildDataNodeId) {
          lastDataNodeId = lastChildDataNodeId;
        }
      }
    }
    return lastDataNodeId;
  }


  /** ###########################################################################
   * summarization propagation
   * ##########################################################################*/

  propagateSummaryMode = {
    [DDGSummaryMode.Show]: (timelineId) => {
      const { og } = this;
      const node = og.timelineNodes[timelineId];

      if (node.children) {
        // show all children
        for (const childId of Object.values(node.children)) {
          // const childNode = og.timelineNodes[childId];
          this.#applyMode(childId, DDGSummaryMode.Show);
        }
      }
    },
    [DDGSummaryMode.Hide]: (timelineId) => {
      const { og } = this;
      const node = og.timelineNodes[timelineId];

      if (node.children) {
        // hide all children
        for (const childId of Object.values(node.children)) {
          // const childNode = og.timelineNodes[childId];
          this.#applyMode(childId, DDGSummaryMode.Hide);
        }
      }
    },
    [DDGSummaryMode.Collapse]: (timelineId) => {
      const { og } = this;
      const node = og.timelineNodes[timelineId];

      // hide all children
      for (const childId of node.children) {
        // const childNode = og.timelineNodes[childId];
        this.#applyMode(childId, DDGSummaryMode.Hide);
      }
    },
    [DDGSummaryMode.CollapseSummary]: (timelineId) => {
      const { og } = this;
      const node = og.timelineNodes[timelineId];

      // hide all children
      for (const childId of node.children) {
        // const childNode = og.timelineNodes[childId];
        this.#applyMode(childId, DDGSummaryMode.Hide);
      }
    },
    [DDGSummaryMode.SummarizeChildren]: (timelineId) => {
      const { og } = this;
      const node = og.timelineNodes[timelineId];

      // hide all children
      for (const childId of node.children) {
        const childNode = og.timelineNodes[childId];
        const targetMode = ddgQueries.canApplySummaryMode(childNode, DDGSummaryMode.Collapse) ?
          DDGSummaryMode.CollapseSummary :
          DDGSummaryMode.Hide;
        this.#applyMode(childId, targetMode);
      }
    },
    [DDGSummaryMode.ExpandSelf]: (timelineId) => {
      const { og } = this;
      const node = og.timelineNodes[timelineId];

      // collapse all children
      for (const childId of node.children) {
        const childNode = og.timelineNodes[childId];
        const targetMode = ddgQueries.canApplySummaryMode(childNode, DDGSummaryMode.Collapse) ?
          DDGSummaryMode.CollapseSummary : // temporary hackfix
          DDGSummaryMode.Show;
        this.#applyMode(childId, targetMode);
      }
    },
    [DDGSummaryMode.ExpandSubgraph]: (timelineId) => {
      const { og } = this;
      const node = og.timelineNodes[timelineId];

      // expand all children and their children
      for (const childId of node.children) {
        const childNode = og.timelineNodes[childId];
        const targetMode = ddgQueries.canApplySummaryMode(childNode, DDGSummaryMode.Collapse) ?
          DDGSummaryMode.ExpandSubgraph :
          DDGSummaryMode.Show;
        this.#applyMode(childId, targetMode);
      }
    },
    [DDGSummaryMode.HideChildren]: (timelineId) => {
      const { og } = this;
      const node = og.timelineNodes[timelineId];

      // hide all children
      for (const childId of node.children) {
        this.#applyMode(childId, DDGSummaryMode.Hide);
      }
    }
  };

  #applyMode(timelineId, mode) {
    const { og } = this;
    const node = og.timelineNodes[timelineId];
    if (ddgQueries.canApplySummaryMode(node, mode)) {
      this.summaryModes[timelineId] = mode;
      this.propagateSummaryMode[mode](timelineId);
    }
  }

  /** ###########################################################################
   *  summarize algo
   * ##########################################################################*/

  #applySummarization() {
    const { og: { root } } = this;

    this.resetBuild();

    const summaryState = new SummaryState();
    this.#summarizeDFS(root, summaryState);

    // add all edges
    for (const [from, toMap] of summaryState.visibleEdges) {
      for (const [to, edgeState] of toMap) {
        // TODO: edgeType
        const edgeType = DDGEdgeType.Data;
        this.addEdge(edgeType, from, to, edgeState);
      }
    }
  }

  /**
   * 
   * @param {DDGTimelineNode} node 
   * @param {SummaryState} summaryState 
   */
  #summarizeDFS(node, summaryState) {
    const { dp } = this;
    let {
      nodeRouteMap,
      currentCollapsedAncestor
    } = summaryState;
    const { timelineId, dataNodeId, children } = node;

    let isVisible = !!currentCollapsedAncestor || ddgQueries.isVisible(this, node);
    const isCollapsed = !currentCollapsedAncestor && ddgQueries.isCollapsed(this, node);
    const needsSummaryData = !currentCollapsedAncestor && ddgQueries.isNodeSummarized(this, node);
    let targetNode = currentCollapsedAncestor || node;
    let isSummarized = ddgQueries.isNodeSummarized(this, targetNode);

    // prep
    if (needsSummaryData) {
      // build node summary (if not already built)
      this.#buildNodeSummary(timelineId);
    }

    // DFS recursion
    if (children) {
      // node has children
      if (isCollapsed) {
        summaryState.currentCollapsedAncestor = node;
      }
      for (const childId of Object.values(children)) {
        const childNode = this.og.timelineNodes[childId];
        this.#summarizeDFS(childNode, summaryState);
      }
      if (isCollapsed) {
        // reset collapsed ancestor
        summaryState.currentCollapsedAncestor = null;
      }
    }

    // prep summary
    let nodeSummary;
    if (isSummarized) {
      nodeSummary = this.nodeSummaries[targetNode.timelineId];
      isSummarized = !!nodeSummary?.summaryRoots?.length;
      if (isSummarized) {
        if (!dataNodeId) {
          // summarized nodes without `dataNodeId` (such as groups) are simply hidden
          targetNode = null;
          isVisible = false;
        }
        else {
          const dataNode = dp.collections.dataNodes.getById(dataNodeId); // dataNode must exist if summarized
          // link to summaryNode instead of `targetNode`
          targetNode = this.#lookupSummaryNode(dataNode, nodeSummary);
          if (!targetNode) {
            // NOTE: we simply "hide" nodes that are not in `summaryNodes`
            // → meaning, we "propagate" its edges
            isVisible = false;
          }
        }
      }
    }

    // add/merge incoming edges
    const incomingEdges = this.og.inEdgesByTimelineId[timelineId] || EmptyArray;

    if (isVisible) {
      // node is (1) shown, (2) collapsed into `currentCollapsedAncestor` or (3) summarized
      nodeRouteMap.set(timelineId, [targetNode]);

      for (const edgeId of incomingEdges) {
        const edge = this.og.edges[edgeId];
        const { from: fromOg, type } = edge;
        const allFrom = nodeRouteMap.get(fromOg);
        if (allFrom) {
          for (const from of allFrom) {
            if (from !== targetNode) {
              // TODO: deal w/ duplicate edges
              if (!targetNode) {
                throw new Error(`no targetNode`);
              }
              summaryState.addEdge(from, targetNode, type);
            }
          }
        }
      }
    }
    else {
      // node is hidden
      // → multicast all outgoing edges to all incoming edges
      // → to that end, add all `from`s to this node's `reroutes`
      let reroutes = [];
      for (const edgeId of incomingEdges) {
        const edge = this.og.edges[edgeId];
        const { from: fromOg, type } = edge;
        // TODO: summarize edge type correctly
        const allFrom = nodeRouteMap.get(fromOg);
        if (allFrom) {
          for (const from of allFrom) {
            reroutes.push(from);
          }
        }
      }
      if (reroutes) {
        nodeRouteMap.set(timelineId, reroutes);
      }
    }
  }

  /**
   * @param {DataNode} dataNode 
   * @param {DDGNodeSummary} nodeSummary
   * 
   * @return {DDGTimelineNode}
   */
  #lookupSummaryNode(dataNode, nodeSummary) {
    const refId = this.dp.util.getDataNodeAccessedRefId(dataNode.nodeId);
    if (refId) {
      const { prop } = dataNode.varAccess;
      const snapshotId = nodeSummary.snapshotsByRefId.get(refId);
      const snapshot = this.timelineNodes[snapshotId];
      const childId = snapshot.children[prop];
      return this.timelineNodes[childId];
    }
    const varTid = dataNode.varAccess?.declarationTid;
    if (varTid) {
      const varNodeId = nodeSummary.varNodesByDeclarationTid[varTid];
      return this.timelineNodes[varNodeId];
    }
    return null;
  }
}
