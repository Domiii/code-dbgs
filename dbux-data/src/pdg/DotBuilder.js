import isEmpty from 'lodash/isEmpty';
import { isControlGroupTimelineNode, isRepeatedRefTimelineNode } from '@dbux/common/src/types/constants/PDGTimelineNodeType';
import EmptyArray from '@dbux/common/src/util/EmptyArray';
import { newLogger } from '@dbux/common/src/log/logger';
import UniqueRefId from '@dbux/common/src/types/constants/UniqueRefId';
import { truncateStringDefault } from '@dbux/common/src/util/stringUtil';
import pdgQueries from './pdgQueries';
import { PDGRootTimelineId } from './constants';
import PDGEdgeType from './PDGEdgeType';

/** @typedef {import('./pdgQueries').RenderState} RenderState */

// eslint-disable-next-line no-unused-vars
const { log, debug, warn, error: logError } = newLogger('DotBuilder');

const Verbose = 1;


/** ###########################################################################
 * Util
 * ##########################################################################*/

/**
 * @see https://stackoverflow.com/a/18750001
 */
function dotEncode(s) {
  return (s + '').replace(/[\u00A0-\u9999<>&|{}()[\]]/g, function (c) {
    return '&#' + c.charCodeAt(0) + ';';
  });
  // /**
  //  * @see https://stackoverflow.com/a/29482788
  //  */
  // converter.textContent = s;
  // return converter.innerHTML;
}

function fixProp(prop) {
  if (prop.includes(UniqueRefId)) {
    return '{}';
  }
  return prop;
}

function isConnected(node) {
  return node.connected; // ||
  // non-build nodes (summary nodes) are always connected
  // !node.og;
}

/** ###########################################################################
 * Colors + Cfg
 * ##########################################################################*/

// future-work: use theme colors via CSS vars (to make it prettier + also support light theme)
//    → (see: https://stackoverflow.com/a/56759634)
/**
 * NOTE: colors have RGBA support (e.g. `bg`)
 */
const Colors = {
  bg: '#0000001A',

  /**
   * Default text
   */
  text: 'white',

  edgeText: 'gray',
  line: 'white',
  nodeOutlineDefault: 'white',
  watchedNodeOutline: 'green',
  // edge: '#AAAAAA',
  // edge: '#6666FF', // blue/purple-ish
  edge: '#AAAAFF',
  groupBorder: 'gray',

  groupLabel: 'yellow',
  snapshotSeparator: 'gray',
  snapshotProp: 'gray',

  deleteValue: 'red',
  deleteEdge: 'red',

  value: 'lightblue',
};

const RenderSettings = {
  fontSize: 14
};

const RenderConfig = {
  /**
   * Applies this weight to the invisible edges for `extraVertical` mode.
   * @see https://graphviz.org/docs/attrs/weight/
   */
  extraVerticalWeight: 2
};


function trunc(s) {
  return truncateStringDefault(s, { length: 30 });
}

export default class DotBuilder {
  _indentLevel;
  fragments = [];

  /**
   * @param {RenderState} renderState 
   */
  constructor(renderState) {
    this.renderState = renderState;
  }

  /** ###########################################################################
   * getters + generators
   * ##########################################################################*/

  get pdg() {
    return this.renderState;
  }

  get root() {
    return this.renderState.timelineNodes?.[PDGRootTimelineId];
  }

  getNode(timelineId) {
    return this.renderState.timelineNodes[timelineId];
  }

  /**
   * @param {PDGTimelineNode} node 
   */
  isRootNode(node) {
    return this.root === node;
  }

  /**
   * @param {PDGTimelineNode} node 
   */
  makeNodeId(node) {
    if (node.parentNodeId) {
      // NOTE: this is required for RefSnapshot structure nodes to be addressable
      return `${node.parentNodeId}:${node.timelineId}`;
    }
    if (this.isPropRecordNode(node)) {
      // access the actual node via timelineId + prop
      return `${node.timelineId}:${node.varAccess.prop}`;
    }
    return node.timelineId;
  }

  wrapText(text) {
    text = trunc(text + '');
    return dotEncode(text);
  }

  makeLabel(text) {
    return `label="${this.wrapText(text)}"`;
  }

  /**
   * NOTE: this is pseudo (not real) HTML
   * @see https://graphviz.org/doc/info/shapes.html#html
   */
  makeLabelHtml(html) {
    return `label=<${html}>`;
  }

  nodeIdAttr(timelineId) {
    return `id=${timelineId}`;
  }

  nodeAttrs(timelineId, ...moreAttrs) {
    return [
      this.nodeIdAttr(timelineId),
      this.nodeOutlineColorAttr(timelineId),
      `fontsize="${RenderSettings.fontSize}"`,
      ...moreAttrs
    ]
      .filter(Boolean)
      .join(',');
  }

  nodeOutlineColor(timelineId) {
    const node = this.pdg.timelineNodes[timelineId];
    if (node.watched) {
      return `${Colors.watchedNodeOutline}`;
    }
    return null;
  }


  nodeOutlineColorAttr(timelineId) {
    const node = this.pdg.timelineNodes[timelineId];
    if (node.watched) {
      return `color="${Colors.watchedNodeOutline}"`;
    }
    return '';  // ignore → already taken care of
  }

  makeAttrs(...attrs) {
    return `[${attrs.filter(Boolean).join(',')}]`;
  }

  /** ###########################################################################
   * indent, lines + fragments
   * ##########################################################################*/

  get indentLevel() {
    return this._indentLevel;
  }

  set indentLevel(val) {
    this._indentLevel = val;
    this.indent = '  '.repeat(this.indentLevel);
  }

  compileFragments() {
    // const extra = this.buildPullDownStructure().join('\n');
    return /* extra + '\n' + */ this.fragments.join('\n');
  }

  fragment = (s) => {
    // Verbose && debug(`fragment`, s);
    this.fragments.push(this.indent + s);
  }

  command = (s) => {
    if (!s) {
      return;
    }
    this.fragment(s + ';');
  }

  label = s => {
    this.command(this.makeLabel(s));
  }

  /** ###########################################################################
   * summary stuff
   *  #########################################################################*/

  iSummary = 0;

  getRootShapeStyleOverride() {
    return this.iSummary ? 'shape=box3d,style="bold"' : null;
  }

  /** ###########################################################################
   * build
   * ##########################################################################*/

  build() {
    this.indentLevel = 0;
    this.buildRoot();
    return this.compileFragments();
  }

  /**
   * attrs that apply to graph and all subgraphs.
   */
  subgraphAttrs() {
    this.command(`color="${Colors.groupBorder}"`);
    this.command(`fontcolor="${Colors.groupLabel}"`);
  }

  buildRoot() {
    const { root, renderState: { edges } } = this;

    this.fragment('digraph {');
    this.indentLevel += 1;

    // global settings
    this.command(`bgcolor="#222222"`);
    // hackfix: inkscape does not like a different font size
    this.command(`fontsize="${RenderSettings.fontSize}"`);
    this.command(`node[color="${Colors.nodeOutlineDefault}", fontcolor="${Colors.text}"]`);
    this.command(`node [fontsize="${RenderSettings.fontSize}"]`);
    this.command(`edge[arrowsize=0.9, arrowhead="open", color="${Colors.edge}", fontcolor="${Colors.edgeText}"]`);
    this.command(`labeljust=l`); // graph/cluster label left justified
    this.subgraphAttrs();

    this.nodesByIds(root.children);

    // NOTE: edges should be placed after all nodes have been defined, else things will not get rendered in the right places/groups
    // const edgeIds = childNodes.flatMap(childNode => outEdgesByTimelineId[childNode.timelineId] || EmptyArray);
    // const edges = edgeIds
    //   .map(edgeId => {
    //     return edges[edgeId];
    //   });
    for (const edge of edges) {
      if (!edge) continue;
      this.edge(edge);
    }

    // extra stuff
    this.buildPullDownStructure();

    this.indentLevel -= 1;

    this.fragment('}');
  }

  nodesByIds(nodeIds) {
    const { timelineNodes } = this.renderState;
    for (const nodeId of nodeIds || EmptyArray) {
      const node = timelineNodes[nodeId];
      this.node(node);
    }
  }

  node(node, force = false) {
    const { pdg } = this;
    const show = force || pdgQueries.isVisible(pdg, node);
    // if (pdgQueries.isExpandedGroupNode(pdg, node)) {
    // if (isControlGroupTimelineNode(node.type)) {
    //   console.debug(`node "${node.label}" #${node.timelineId}, v=${show}, sum=${pdgQueries.isNodeSummarized(pdg, node)}, expgroup=${pdgQueries.isExpandedGroupNode(pdg, node)}`);
    // }
    if (pdgQueries.isNodeSummarized(pdg, node)) {
      this.nodeSummary(node);
    }
    else if (show) {
      if (pdgQueries.isExpandedGroupNode(pdg, node)) {
        this.controlGroup(node);
      }
      else if (pdgQueries.isSnapshot(pdg, node)) {
        this.refSnapshotRoot(node);
      }
      else if (pdgQueries.isDeleteNode(pdg, node)) {
        this.deleteNode(node);
      }
      else {
        this.valueNode(node);
      }
      this.addNodeToPullDownStructure(node);
    }
    else if (isControlGroupTimelineNode(node.type)) {
      // console.log(`Control group: ${node}, show=${show}, summary=${pdgQueries.getNodeSummaryMode(pdg, node)}`);
      // NOTE: this is to render Watched node inside of hidden groups
      this.nodesByIds(node.children);
    }
  }

  _groupAttrs(node) {
    // const { pdg } = this;
    const { timelineId, label } = node;
    this.command(this.nodeIdAttr(timelineId));
    // this.label(node.label || '');
    // NOTE: mode is hacked in in `decorateNode`

    // const mode = pdgQueries.getNodeSummaryMode(pdg, node);
    // const modeEl = makeSummaryLabel(pdg, mode);
    // ${modeEl}
    this.label(label || '()');
    this.subgraphAttrs();
  }

  /**
   * TODO: this is exactly the same as summaryGroup, but without rendering summaries
   */
  controlGroup(node) {
    const { timelineId } = node;

    this.fragment(`subgraph cluster_group_${timelineId} {`);
    this.indentLevel += 1;
    this._groupAttrs(node);

    if (!isEmpty(node.children)) {
      this.nodesByIds(node.children);
    }
    else {
      // TODO: this hackfix will not work because often times, the group has children, but the children are not rendered
      // hackfix: we need to render something, or else group is not shown
      // this.command(`${node.timelineId} ${this.nodeAttrs(node.timelineId)}`);
    }

    this.indentLevel -= 1;
    this.fragment(`}`);
  }

  nodeSummary(node) {
    const { pdg } = this;
    // if (pdgQueries.doesNodeHaveSummary(pdg, node)) {
    // render summary nodes
    this.summaryGroup(node);
    // }
    // else {
    //   // render node as-is
    //   this.valueNode(node);
    // }
  }

  summaryGroup(node) {
    const { pdg } = this;
    const { nodeSummaries } = pdg;

    const summary = nodeSummaries[node.timelineId];
    const roots = pdgQueries.getSummaryRoots(pdg, summary);
    const { timelineId } = node;
    this.fragment(`subgraph cluster_summary_${timelineId} {`);
    this.indentLevel += 1;
    this._groupAttrs(node);

    if (roots) {
      this.iSummary += 1;

      // render summary
      for (const root of roots) {
        this.node(root, true);
      }

      this.iSummary -= 1;
    }

    // also render non-summarized children of a summarized group node
    this.nodesByIds(node.children);

    this.indentLevel -= 1;
    this.fragment(`}`);
  }

  /**
   * A root of a snapshot
   */
  refSnapshotRoot(node, label = null) {
    const { pdg } = this;
    const { timelineId } = node;

    this.fragment(`subgraph cluster_ref_${timelineId} {`);
    this.indentLevel += 1;
    const isNesting = pdgQueries.isNestingSnapshot(pdg, node);
    const color = !isNesting ?
      'transparent' : // only root has outer border
      node.watched ?
        Colors.watchedNodeOutline :
        'gray';
    this.command(`color="${color}"`);
    this.command(`fontcolor="${Colors.groupLabel}"`);
    this.command(this.nodeIdAttr(timelineId));
    this.label(label || '');

    this.snapshotTable(node, !isNesting && node.watched ? Colors.watchedNodeOutline : null);

    this.indentLevel -= 1;
    this.fragment(`}`);
  }

  deleteNode(node) {
    if (!node.varAccess) {
      // this should never happen
      this.valueNode(node, 'red');
    }
    if (node.varAccess) {
      // simple label
      const attrs = [
        this.nodeAttrs(node.timelineId),
        `color="${Colors.deleteValue}"`,
        `fontcolor="${Colors.deleteValue}"`,
        this.makeLabelHtml(`<S>${this.wrapText(node.label)}</S>`)
      ].join(',');
      this.command(`${this.makeNodeId(node)} [${attrs}]`);
    }
  }

  valueNode(node, colorOverride) {
    if (this.isNodeRecordNode(node)) {
      // record
      this.nodeRecord(node);
    }
    else {
      // simple label
      const attrs = [
        this.nodeAttrs(node.timelineId),
        `fontcolor="${colorOverride || Colors.value}"`,
        `fontsize="${RenderSettings.fontSize}"`,
        this.makeLabel(node.label)
      ].join(',');
      this.command(`${this.makeNodeId(node)} [${attrs}]`);
    }
  }

  /**
   * Edge from nested reference DataNode to its own snapshot node.
   */
  snapshotEdge(node) {
    this.snapshotEdgeFromTo(this.makeNodeId(node), node.timelineId);
  }

  edgeAttrs(edgeId) {
    return `id=e${edgeId}`;
  }

  snapshotEdgeFromTo(from, to) {
    this.command(`${from} -> ${to} [arrowhead="odot", color="gray"]`);
  }

  edge(edge) {
    const from = this.makeNodeId(this.getNode(edge.from));
    const to = this.makeNodeId(this.getNode(edge.to));
    const colorOverride = edge.type === PDGEdgeType.Delete ? `color=${Colors.deleteEdge}` : '';
    // const debugAttrs = Verbose && `${this.makeLabel(edge.edgeId)}` || '';
    const debugAttrs = '';
    const attrs = this.makeAttrs(
      colorOverride,
      debugAttrs,
      this.edgeAttrs(edge.edgeId)
    );
    this.command(`${from} -> ${to} ${attrs}`);
  }

  /** ###########################################################################
   * values, records, tables, structs
   *  #########################################################################*/

  makeNestedRefValueString(node) {
    if (node.repeatedTimelineId) {
      // render original instead
      node = this.pdg.timelineNodes[node.repeatedTimelineId];
    }

    if (!node.children) {
      return '📦';
    }

    let s = Object.values(node.children)
      .map(childId => {
        const child = this.pdg.timelineNodes[childId];
        if (child.value !== undefined) {
          return child.value;
        }
        return null;
      })
      .filter(Boolean)
      .join(', ');

    s = Array.isArray(node.children) ? `[${s}]` : `{${s}}`;
    return s;
  }

  makeNodeValueString(node) {
    let s;
    if (pdgQueries.isSnapshot(this.pdg, node)) {
      s = this.makeNestedRefValueString(node);
    }
    else if (isRepeatedRefTimelineNode(node.type)) {
      const linkNode = this.pdg.timelineNodes[node.repeatedTimelineId];
      s = this.makeNestedRefValueString(linkNode) + node.label;
    }
    else if (node.refId) {
      s = '📦';  // ref value node but without snapshot
    }
    else if (node.value !== undefined) {
      s = JSON.stringify(node.value);
    }
    else {
      // s = node.label || '?';
      s = node.value + '';
    }
    return this.wrapText(s);
  }

  // makeRecordEntry(timelineId, label) {
  //   return `<${timelineId}> ${label}`;
  // }

  /**
   * @param {PDGTimelineNode} node
   */
  isNodeRecordNode(node) {
    return pdgQueries.isSnapshot(this.pdg, node) ?
      isEmpty(node.children) :
      (!!node.varAccess || node.value !== node.label); // hackfix heuristic;
  }

  /**
   * This is a hackfix to deal with node adding "itself" as a child record.
   */
  isPropRecordNode(node) {
    return this.isNodeRecordNode(node) && node.varAccess?.prop !== undefined;
  }

  nodeRecord(node) {
    const { timelineId, label, parentLabel, varAccess } = node;
    const prop = varAccess?.prop;
    const value = this.makeNodeValueString(node);

    let l, attrs = [
      this.nodeAttrs(node.timelineId)
    ];
    if (this.isPropRecordNode(node)) {
      // nested access
      // label0 | label/value
      // → has no ID itself. Child cell has ID instead.
      attrs.push(this.getRootShapeStyleOverride() || `shape=plaintext`); // NOTE: plaintext means no extra border
      l = `<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0">
  <TR>
    <TD ROWSPAN="2">${this.wrapText(parentLabel || ' ')}</TD>
    ${this.makePropValueCell(timelineId, prop, prop)}
  </TR>
</TABLE>`;
    }
    else {
      // non-nested access
      // label | value
      attrs.push(this.getRootShapeStyleOverride() || `shape=record`); // NOTE: `record` adds an outline to the table
      l = `
<TABLE BORDER="0" CELLBORDER="0" CELLSPACING="0">
  <TR>
    <TD BORDER="1" SIDES="R">${this.wrapText(label)}</TD>
    <TD ID="${timelineId}" TITLE="${timelineId}"><FONT COLOR="${Colors.value}">${value}</FONT></TD>
  </TR>
</TABLE>`;
    }
    attrs.push(this.makeLabelHtml(l));
    this.command(`${timelineId} ${this.makeAttrs(...attrs)}`);
  }

  // /**
  //  * @param {PDGTimelineNode} node 
  //  */
  // snapshotRecord(node) {
  //   let { timelineId, label, children } = node;
  //   // TODO: use table instead, so we can have key + val rows

  //   // 5 [label="arr|<6> arr|<7> 0|<8> 1"];
  //   label ||= 'arr';    // TODO: proper snapshot label (e.g. by first `declarationTid` of `ref`)
  //   const childrenItems = Object.entries(children)
  //     .map(([prop, nodeId]) => this.makeRecordEntry(nodeId, prop));
  //   const l = this.makeLabel(`${label}|${childrenItems.join('|')}`);
  //   this.command(`${timelineId} [${this.nodeIdAttr(timelineId)},${l}]`);
  // }

  /** ###########################################################################
   * snapshotTable
   *  #########################################################################*/

  /**
   * Whether given node is a build-time snapshot and it is not connected (we don't want to render those).
   * Summary nodes are exempted.
   */
  isDisconnectedSnapshot(node) {
    const { pdg } = this;
    return pdgQueries.isSnapshot(pdg, node) &&
      !isConnected(node);
  }

  /**
   * Produce snapshot table with prop and value for each entry.
   * @param {PDGTimelineNode} node
   * @see https://graphviz.org/doc/info/shapes.html#html-like-label-examples
   */
  snapshotTable(node, colorOverride) {
    const { pdg, pdg: { timelineNodes } } = this;

    const { timelineId, label, parentNodeId, children } = node;
    const hasLabel = !parentNodeId && label !== undefined;
    const childEntries = Object.entries(children);
    if (this.isNodeRecordNode(node)) {
      // render empty snapshot as ref data node
      this.nodeRecord(node);
    }
    else {
      // render snapshot
      let attrs = this.nodeIdAttr(timelineId);
      if (colorOverride) {
        attrs += `,color=${colorOverride}`;
      }
      const childrenCells = childEntries
        .map(([prop, childId]) => {
          const child = timelineNodes[childId];
          prop = fixProp(prop);
          if (pdgQueries.isDeleteNode(this.pdg, child)) {
            return this.makeSnapshotDeleteCell(childId, prop);
          }
          return this.makePropValueCell(childId, prop);
        })
        .join('');

      const shapeAndStyle = this.getRootShapeStyleOverride() || 'shape=plaintext';
      this.command(`${timelineId} [${attrs},${shapeAndStyle},label=<
<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0">
  <TR>
    ${hasLabel ? `<TD ROWSPAN="2">${this.wrapText(label)}</TD>` : ''}
    ${childrenCells}
  </TR>
</TABLE>
>]`);
      // add child snapshots separately
      for (const [prop, childId] of childEntries) {
        const child = timelineNodes[childId];
        if (pdgQueries.isSnapshot(pdg, child)) {
          if (
            // not empty
            isEmpty(child.children) ||
            // connected
            !isConnected(child) ||
            // has at least one child that is connected
            Object.values(child.children)
              .every(c => this.isDisconnectedSnapshot(timelineNodes[c]))
          ) {
            continue;
          }

          // add child snapshot
          this.snapshotTable(child);

          // add edge
          this.snapshotEdge(child);
        }
        // // NOTE: remove repeatedNode edges for performance reasons
        // else if (child.repeatedTimelineId) {
        //   const repeatedNode = timelineNodes[child.repeatedTimelineId];
        //   this.snapshotEdgeFromTo(this.makeNodeId(child), this.makeNodeId(repeatedNode));
        // }
      }

      // add snapshot root
      // this.addNodeToPullDownStructure(node);
    }
  }

  /**
   * Build a row of "column" cells containing tables.
   * We do this, so every node's column has a singular addressable PORT.
   */
  makePropValueCell(timelineId, prop, id = timelineId) {
    const { timelineNodes } = this.renderState;
    const node = timelineNodes[timelineId];
    // hide not-connected snapshot children
    const label = this.makeNodeValueString(node);
    return `<TD TITLE="${id}" ROWSPAN="2" PORT="${id}">
      <TABLE BORDER="0" CELLBORDER="0" CELLSPACING="0">
        <TR><TD BORDER="1" SIDES="B" COLOR="${Colors.snapshotSeparator}">\
<FONT COLOR="${Colors.snapshotProp}">${this.wrapText(prop)}</FONT></TD></TR>
        <TR><TD><FONT COLOR="${Colors.value}">${label}</FONT></TD></TR>
      </TABLE>
    </TD>`;
  }

  /**
   * Build a row of "column" cells containing tables.
   * We do this, so every node's column has a singular addressable PORT.
   */
  makeSnapshotDeleteCell(timelineId, prop) {
    // const { timelineNodes } = this.renderState;
    // const node = timelineNodes[timelineId];
    return `<TD ID="${timelineId}" TITLE="${timelineId}" ROWSPAN="2" PORT="${timelineId}">
      <TABLE BORDER="0" CELLBORDER="0" CELLSPACING="0">
        <TR><TD BORDER="1" COLOR="transparent">\
<FONT COLOR="${Colors.deleteValue}"><S>${prop}</S></FONT></TD></TR>
        <TR><TD><FONT COLOR="${Colors.deleteValue}"> </FONT></TD></TR>
      </TABLE>
    </TD>`;
  }

  /** ###########################################################################
   * add a "pull-down" effect, using virtual (hidden) nodes
   * ##########################################################################*/

  pullNodes = [];

  addNodeToPullDownStructure(node) {
    if (!this.pdg.settings.extraVertical) {
      return;
    }
    if (!isControlGroupTimelineNode(node.type)) {
      this.pullNodes.push(node);
    }
  }

  /**
   * Idea: simply add invisible edges between all data-like nodes.
   * NOTE: Edges have a vertical "pull down" effect.
   */
  buildPullDownStructure() {
    if (!this.pullNodes.length) {
      return;
    }

    const vertices = this.pullNodes.map(n => n.timelineId);
    this.command(vertices.join(' -> ') + this.makeAttrs(invisAttr(), `weight=${RenderConfig.extraVerticalWeight}`));
    // this.command(vertices.join(' -> ') + ' [color=blue]');
  }

  // /**
  //  * Old idea:
  //  * s1 -> s2 -> s3;
  //  * 1 -> s1 -> 2 -> s2 -> 3 -> s3;
  //  * 
  //  * Idea2:
  //  * s1 -> s2 -> s3;
  //  * {rank=same; s1, 1};
  //  * {rank=same; s2, 2};
  //  * {rank=same; s3, 3};
  //  */
  // buildPullDownStructure() {
  //   if (!this.pullNodes.length) {
  //     return;
  //   }
  // // ignore in-snapshot nodes
  // this.pullNodes.push(node.timelineId);

  // // place pull node and rank command in same subgraph (else `rank=same` breaks subgraphs)
  // this.command(makePullId(node.timelineId) + invisAttrs());
  // this.command(`{rank=same; ${node.timelineId}, ${makePullId(node.timelineId)}}`);
  //   this.command(
  //     this.pullNodes
  //       .map(id => makePullId(id))
  //       .join(' -> ') + invisAttrs()
  //     // this.pullNodes
  //     //   .map(id => `{rank=same; ${id}, ${makePullId(id)}}`)
  //     // this.pullNodes
  //     //   .flatMap(id => [id, makePullId(id)])
  //     //   .join(' -> ')
  //   );
  // }
}

function invisAttr() {
  return 'style=invis';
}

function invisAttrs() {
  return '[style=invis]';
}

function makePullId(id) {
  return 's' + id;
}

/** ###########################################################################
 * public
 *  #########################################################################*/

export function buildDot(pdg) {
  const dotBuilder = new DotBuilder(pdg);
  return dotBuilder.build();
}
