import UserActionType from '@dbux/data/src/pathways/UserActionType';
import GraphNodeMode from '@dbux/graph-common/src/shared/GraphNodeMode';
import HostComponentEndpoint from '../../componentLib/HostComponentEndpoint';

const getNewChildrenCount = {
  [GraphNodeMode.Collapsed]: () => 0,
  [GraphNodeMode.ExpandChildren]: (node) => node.getChildrenCount(),
  [GraphNodeMode.ExpandSubgraph]: (node) => node.getSubGraphChildrenCount(),
};

export default class GraphNode extends HostComponentEndpoint {
  /**
   * Owner requirements:
   *  property `childrenBuilt`
   *  method `buildChildNodes`
   */
  init() {
    const parent = this.owner.parent?.controllers.getComponent(GraphNode);

    if (!this.state.mode) {
      if (parent) {
        this.state.mode = parent.getChildMode();
      }
      else {
        this.state.mode = GraphNodeMode.Collapsed;
      }
    }
  }

  getChildMode() {
    const { mode } = this.state;
    switch (mode) {
      case GraphNodeMode.ExpandSubgraph:
        return GraphNodeMode.ExpandSubgraph;
      case GraphNodeMode.ExpandChildren:
      case GraphNodeMode.Collapsed:
      default:
        return GraphNodeMode.Collapsed;
    }
  }

  setOwnMode(mode) {
    if (mode !== GraphNodeMode.Collapsed && this.owner.childrenBuilt === false) {
      this.owner.context.graphRoot.buildContextNodeChildren(this.owner);
    }

    this.setState({ mode });
  }

  /**
   * NOTE: setMode might takes a long time to expand ContextNodes. If setMode is called by user, we confirm before expand it.
   */
  async setModeUser(mode) {
    const nThreshold = 1e4;
    const newChildrenCount = getNewChildrenCount[mode](this.owner);
    const confirmMessage = `This would expand ${newChildrenCount} ContextNodes. Are you sure?`;
    if (newChildrenCount > nThreshold && !await this.componentManager.externals.confirm(confirmMessage, true)) {
      return;
    }
    this.setMode(mode);
  }

  setMode(mode, force = false) {
    if (!force && this.state.mode === mode) {
      // nothing left to do
      return;
    }

    this.setOwnMode(mode);

    // propagate mode to sub graph
    const childMode = this.getChildMode();
    for (const child of this.owner.children) {
      if (!hasGraphNode(child)) {
        // this.logger.warn(`Cannot setMode for some child node. ${this.owner.debugTag}'s child ${child.debugTag} does not have GraphNode`);
      }
      else {
        child.controllers.getComponent(GraphNode).setMode(childMode, force);
      }
    }
  }

  /**
   * Sets ascendants' `GraphNodeMode` to `ExpandChildren`
   * @param {boolean} expandItself if true, also expands the node
   */
  async reveal(expandItself = false) {
    const { parent } = this.owner;
    if (parent && hasGraphNode(parent)) {
      const parentGraphNode = parent.controllers.getComponent(GraphNode);
      if (parentGraphNode.state.mode === GraphNodeMode.Collapsed) {
        await parentGraphNode.reveal(true);
      }
    }
    if (expandItself && GraphNodeMode.is.Collapsed(this.state.mode)) {
      this.setOwnMode(GraphNodeMode.ExpandChildren);
      await this.waitForUpdate();
    }
  }

  getPreviousMode() {
    let mode = GraphNodeMode.previousValue(this.state.mode);
    // if (mode === GraphNodeMode.ExpandSubgraph && this.owner.children.computeMaxDepth() <= 1) {
    //   // skip "ExpandSubgraph" if there is only one level
    //   mode = GraphNodeMode.previousValue(mode);
    // }
    return mode;
  }

  getNextMode() {
    let mode = GraphNodeMode.nextValue(this.state.mode);
    // if (mode === GraphNodeMode.ExpandSubgraph && this.owner.children.computeMaxDepth() <= 1) {
    //   // skip "ExpandSubgraph" if there is only one level
    //   mode = GraphNodeMode.nextValue(mode);
    // }
    return mode;
  }

  public = {
    previousMode: () => {
      const mode = this.getPreviousMode();
      const { firstTrace: trace } = this.owner;
      const { context } = this.owner.state;
      this.setModeUser(mode);
      this.componentManager.externals.emitCallGraphTraceAction(UserActionType.CallGraphNodeCollapseChange, trace, { mode, context });
    },
    nextMode: () => {
      const mode = this.getNextMode();
      const { firstTrace: trace } = this.owner;
      const { context } = this.owner.state;
      this.setModeUser(mode);
      this.componentManager.externals.emitCallGraphTraceAction(UserActionType.CallGraphNodeCollapseChange, trace, { mode, context });
    },
    reveal: this.reveal
  }
}

function hasGraphNode(comp) {
  return !!comp.controllers.getComponent(GraphNode);
}