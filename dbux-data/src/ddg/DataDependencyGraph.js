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
import DDGSettings from './DDGSettings';
import TraceType from '@dbux/common/src/types/constants/TraceType';

/** @typedef {import('@dbux/common/src/types/RefSnapshot').ISnapshotChildren} ISnapshotChildren */
/** @typedef { Map.<number, number> } SnapshotMap */

// const VerboseSumm = 2;
const VerboseSumm = 0;

/** ###########################################################################
 * default config
 * ##########################################################################*/

// const RootDefaultSummaryMode = {
// };
// const RootDefaultSummaryMode = DDGSummaryMode.SummarizeChildren;
const RootDefaultSummaryMode = DDGSummaryMode.HideChildren;

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

  /**
   * @type {DDGSettings}
   */
  settings = new DDGSettings();

  // valueId = 105;

  constructor(dp, graphId) {
    super(dp, graphId);
  }

  getRenderData() {
    const {
      // original node data
      og: {
        timelineNodes,
      }
    } = this;

    return {
      timelineNodes,

      ...this.getChangingData()
    };
  }

  /**
   * This data changes over time and is sent back to client
   * on every update.
   */
  getChangingData() {
    const {
      settings,

      // summary data
      summaryModes,
      nodeSummaries,

      // current edge data
      edges,
      outEdgesByTimelineId,
      inEdgesByTimelineId
    } = this;

    return {
      settings,
      summaryModes,
      nodeSummaries,
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

  get timelineNodesByDataNodeId() {
    return this.og.timelineNodesByDataNodeId;
  }

  get timelineBuilder() {
    return this.og.timelineBuilder;
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

  /**
   * @param {DDGSettings} settings 
   */
  updateSettings(settings) {
    for (const name in settings) {
      if (!(name in this.settings)) {
        throw new Error(`invalid graph setting: ${name} (${JSON.stringify(settings)})`);
      }
    }
    this.settings = settings;

    this.#buildSummarizedGraph();
  }

  setSummaryMode(timelineId, mode) {
    // update node modes
    this.#applyMode(timelineId, mode);

    // refresh the summarized graph
    this.#buildSummarizedGraph();
  }

  /**
   * During initial build, not all details of every node are prepared.
   * When investigating a node's details, this function needs to run first.
   */
  #buildNodeSummary(timelineId) {
    return this.#buildNodeSummarySnapshotsAndVars(timelineId);
  }


  /** ###########################################################################
   * build
   * ##########################################################################*/

  /**
   * @param {number[]} watchTraceIds 
   */
  build(watched) {
    if (!this.og) {
      this.og = new BaseDDG(this.dp, this.graphId);
    }
    this.buildStage = BuildStage.Building;
    try {
      this.og.build(watched);
    }
    finally {
      this.buildStage = BuildStage.None;
    }

    this.buildStage = BuildStage.Summarizing;
    try {
      this.#initSummaryConfig();
      this.#buildSummarizedGraph();
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
   * @param {number} timelineId Summary group node
   */
  #buildNodeSummarySnapshotsAndVars(timelineId) {
    const { dp } = this;
    const node = this.timelineNodes[timelineId];
    if (!node.hasSummarizableWrites || this.nodeSummaries[timelineId]) {
      // already built or nothing to build
      return this.nodeSummaries[timelineId];
    }

    const lastModifyNodesByRefId = new Map();   // summary ref set
    const varModifyDataNodes = new Map();       // summary var set
    const lastNestedDataNodeId = this.#collectNestedUniqueSummaryTrees(node, node, lastModifyNodesByRefId, varModifyDataNodes);
    const summaryRefEntries = Array.from(lastModifyNodesByRefId.entries())
      .filter(([refId]) => {
        // skip if this ref is only used internally (or before) this summary group and is not accessed AFTERWARDS.
        const lastDataNodeIdOfRef = this.watchSet.lastDataNodeByWatchedRefs.get(refId);
        return lastDataNodeIdOfRef > lastNestedDataNodeId;
      });

    // add ref snapshots
    /**
     * @type {SnapshotMap}
     */
    const snapshotsByRefId = new Map();
    for (const [refId, dataNodeId] of summaryRefEntries) {
      if (snapshotsByRefId.has(refId)) {
        // skip if this ref was already added as a descendant of a previous ref
        continue;
      }
      const dataNode = dp.collections.dataNodes.getById(dataNodeId);
      this.og.addNewRefSnapshot(dataNode, refId, snapshotsByRefId, null);
    }

    // add var nodes
    const varNodesByDeclarationTid = new Map();
    for (const [declarationTid, varNodeTimelineId] of varModifyDataNodes) {
      const varNode = this.cloneNode(varNodeTimelineId);
      // override label to be the var name (if possible), since its more representative
      varNode.label = dp.util.getDataNodeDeclarationVarName(varNode.dataNodeId) || varNode.label;
      varNodesByDeclarationTid.set(declarationTid, varNode.timelineId);
    }

    const summaryRoots = (
      // ref roots
      Array.from(snapshotsByRefId.values())
        .filter(snapshotId => !this.timelineNodes[snapshotId].parentNodeId)
        .concat(
          // var roots
          Array.from(varNodesByDeclarationTid.values())
        ));

    return this.nodeSummaries[timelineId] = new DDGNodeSummary(timelineId, snapshotsByRefId, varNodesByDeclarationTid, summaryRoots);
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

    if (
      node.dataNodeId &&
      ddgQueries.checkNodeVisibilitySettings(this, node)
    ) {
      const refId = dp.util.getDataNodeModifyingRefId(node.dataNodeId);
      let varDeclarationTid;
      if (refId) {
        // Ref Write
        lastModifyNodesByRefId.set(refId, node.dataNodeId);
      }
      else {
        if ((varDeclarationTid = dp.util.getDataNodeModifyingVarDeclarationTid(node.dataNodeId))) {
          // Variable Write
          if (!summarizingNode.pushTid || varDeclarationTid < summarizingNode.pushTid) {
            // store variable writes, if variable was declared before summarizingNode
            varModifyDataNodes.set(varDeclarationTid, node.timelineId);
          }
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

  #buildSummarizedGraph() {
    const { og: { root } } = this;

    this.resetBuild();

    const summaryState = new SummaryState();
    this.#summarizeDFS(root, summaryState);

    // // NOTE: store SummaryState for debugging purposes
    // this.graphSummaryState = summaryState;

    // add all edges
    for (const [from, toMap] of summaryState.visibleEdges) {
      for (const [to, edgeState] of toMap) {
        const edgeType = this.getEdgeType(this.timelineNodes[from], this.timelineNodes[to]);
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
    const needsSummaryData = !currentCollapsedAncestor && ddgQueries.isNodeSummarizedMode(this, node);
    let targetNode = currentCollapsedAncestor || node;
    let isSummarized = ddgQueries.isNodeSummarized(this, targetNode);

    // prep
    if (needsSummaryData) {
      // build node summary (if not already built)
      this.#buildNodeSummary(timelineId);

      // if (!ddgQueries.doesNodeHaveSummary(this, node)) {
      //   // straight up ignore for now
      //   return;
      // }
    }

    // DFS recursion
    if (children) {
      const isCollapsed = !currentCollapsedAncestor &&
        ddgQueries.isCollapsed(this, node) &&
        ddgQueries.doesNodeHaveSummary(this, node);
      if (isCollapsed) {
        // node is collapsed and has summary data (if not, just hide children)
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

    // find summary targetNode (if it has any)
    if (isSummarized) {
      if (
        // summarized nodes without own `dataNodeId` (such as groups) are simply hidden
        !targetNode.dataNodeId ||
        // summarization is empty → hide it (for now)
        !ddgQueries.doesNodeHaveSummary(this, targetNode)
      ) {
        targetNode = null;
        isVisible = false;
      }
      else {
        const nodeSummary = this.nodeSummaries[targetNode.timelineId];
        const dataNode = dp.collections.dataNodes.getById(dataNodeId); // dataNode must exist if summarized
        // link to summaryNode instead of `targetNode`
        targetNode = this.#lookupSummaryNode(dataNode, nodeSummary);
        if (!targetNode) {
          // NOTE: we simply "hide" nodes that do not have a summarized representation (leads to its edges getting propagated)
          isVisible = false;
        }
      }
    }

    // add/merge incoming edges
    const incomingEdges = this.og.inEdgesByTimelineId[timelineId] || EmptyArray;

    const dataNode = dp.collections.dataNodes.getById(dataNodeId); // dataNode must exist if summarized
    if (VerboseSumm && (!this.valueId || dataNode?.valueId === this.valueId) &&
      (isVisible || isSummarized || incomingEdges?.length)) {
      // eslint-disable-next-line max-len
      this.logger.debug(`Summarizing ${timelineId}, t=${targetNode?.timelineId}, vis=${isVisible}, summarized=${isSummarized}, incoming=${incomingEdges?.join(',')}`);
    }

    if (isVisible) {
      // node is (1) shown, (2) collapsed into `currentCollapsedAncestor` or (3) summarized
      nodeRouteMap.set(timelineId, new Set([targetNode]));

      for (const edgeId of incomingEdges) {
        const edge = this.og.edges[edgeId];
        const { from: fromOg, type } = edge;
        const allFrom = nodeRouteMap.get(fromOg);
        if (allFrom) {
          for (const from of allFrom) {
            if (from !== targetNode) {
              summaryState.addEdge(from, targetNode, type);
              if (VerboseSumm && (!this.valueId || dataNode?.valueId === this.valueId)) {
                this.logger.debug(`SUMM at ${timelineId}, new edge: ${from.timelineId} -> ${targetNode.timelineId}`);
              }
            }
          }
        }
      }
    }
    else {
      // node is hidden
      // → multicast all outgoing edges to all incoming edges
      // → to that end, add all `from`s to this node's `reroutes`
      /**
       * @type {Set.<DDGTimelineNode>}
       */
      let reroutes = new Set();
      for (const edgeId of incomingEdges) {
        const edge = this.og.edges[edgeId];
        const { from: fromOg, type } = edge;
        // TODO: summarize edge type correctly
        const allFrom = nodeRouteMap.get(fromOg);
        if (allFrom) {
          for (const from of allFrom) {
            reroutes.add(from);
          }
        }
      }
      if (reroutes.size) {
        nodeRouteMap.set(timelineId, reroutes);
      }
      // eslint-disable-next-line max-len
      if (VerboseSumm && (!this.valueId || dataNode?.valueId === this.valueId)) {
        reroutes.size && this.logger.debug(`SUMM at ${timelineId}, added re-routes:\n  ${Array.from(reroutes).map(n => `${n.timelineId} (${n.label})`).join(',')}`);
        // VerboseSumm && this.logger.debug(`SUMM at ${timelineId}, nodeRouteMap:\n  ${Array.from(nodeRouteMap.entries())
        //   .map(([timelineId, reroutes]) =>
        //     `${timelineId} → ${Array.from(reroutes).map(n => `${n.timelineId} (${n.label})`).join(',')}`).join('\n  ')}`);
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
    let varTid;
    if (refId) {
      // node is summarized by snapshot child node
      const { prop } = dataNode.varAccess;
      const snapshotId = nodeSummary.snapshotsByRefId.get(refId);
      if (snapshotId) {
        const snapshot = this.timelineNodes[snapshotId];
        const childId = snapshot.children[prop];
        return this.timelineNodes[childId];
      }
    }
    else if ((varTid = dataNode.varAccess?.declarationTid)) {
      // node is summarized by variable node
      const varNodeId = nodeSummary.varNodesByDeclarationTid.get(varTid);
      if (varNodeId) {
        return this.timelineNodes[varNodeId];
      }
    }
    return null;
  }
}
