import difference from 'lodash/difference';
import allApplications from '@dbux/data/src/applications/allApplications';
import traceSelection from '@dbux/data/src/traceSelection/index';
import HostComponentEndpoint from '../componentLib/HostComponentEndpoint';

/** @typedef { import("@dbux/data/src/ddg/DataDependencyGraph").default } DataDependencyGraph */
/** @typedef { import("./DDGDocument").default } DDGDocument */

export default class DDGTimelineView extends HostComponentEndpoint {
  /**
   * @type {DDGDocument}
   */
  get doc() {
    return this.context.doc;
  }

  /**
   * @type {DataDependencyGraph}
   */
  get ddg() {
    return this.context.doc.ddg;
  }

  get renderState() {
    return this.context.doc.state;
  }

  get mergeComputesMode() {
    return this.renderState.mergeComputesMode;
  }

  init() {
    this.addDisposable(
      this.doc.onMergeComputesModeChanged(this.handleMergeComputesModeChanged)
    );
  }

  update() {

  }

  // async handleRefresh() {
  //   let trace = traceSelection.selected;
  //   if (trace) {
  //     const { applicationId, contextId } = trace;
  //     const dp = allApplications.getById(applicationId).dataProvider;
  //     // const context = dp.collections.executionContexts.getById(contextId);
  //     const ddgArgs = { applicationId, contextId };
  //     const failureReason = dp.ddgs.getCreateDDGFailureReason(ddgArgs);
  //     if (failureReason) {
  //       this.setFailure(failureReason);
  //     }
  //     else {
  //       const ddg = dp.ddgs.getOrCreateDDGForContext(ddgArgs);
  //       this.setGraph(ddg);
  //     }
  //   }
  //   else {
  //     const failureReason = 'DDG is empty';
  //     this.setFailure(failureReason);
  //   }
  // }

  // setGraph(ddg) {
  //   this.ddg = ddg;

  //   // reset status message
  //   const failureReason = null;
  //   const { applicationId } = ddg.dp.application;

  //   this.setState({ failureReason, applicationId, ...ddg.getRenderData() });
  // }

  // setFailure(failureReason) {
  //   // reset graph
  //   this.setState({ failureReason, timelineNodes: EmptyArray, edges: EmptyArray });
  // }

  handleMergeComputesModeChanged = () => {
    this.ddg?.setMergeComputes(this.mergeComputesMode);
  };

  shared() {
    return {
      context: {
        view: this
      }
    };
  }

  public = {
    /**
     * HACKFIX: we do this, so we can resolve `ddg` in here.
     *    → That is necessary b/c VSCode won't resolve the nesting class's prop.
     * @type {DataDependencyGraph}
     */
    get ddg() { return null; },

    selectNode(timelineId) {
      const { timelineNodes, applicationId } = this.renderState;
      const node = timelineNodes[timelineId];
      if (node.dataNodeId) {
        const dp = allApplications.getById(applicationId).dataProvider;
        const dataNode = dp.collections.dataNodes.getById(node.dataNodeId);
        const trace = dp.collections.traces.getById(dataNode.traceId);
        if (trace) {
          traceSelection.selectTrace(trace, null, node.dataNodeId);
        }
      }
    },

    setSummaryMode(timelineId, mode) {
      const { ddg } = this;

      const origTimelineNodesLength = ddg.timelineNodes.length;
      const origNodeSummaryKeys = Object.keys(ddg.nodeSummaries);

      // update graph
      ddg.setSummaryMode(timelineId, mode);

      // state delta: new nodes
      const newNodes = ddg.timelineNodes.slice(origTimelineNodesLength);
      // state delta: added summaries
      const newSummaryKeys = Object.keys(ddg.nodeSummaries);
      const addedSummaryKeys = difference(newSummaryKeys, origNodeSummaryKeys);
      const addedSummaries = TODO;

      // state delta: new nodes

      // call setState
      this.doc.setState(ddg.getChangingData(), {
        arrayAdd: {
          timelineNodes: newNodes
        },
        objectMerge: {

        }
      });
    }
  }
}
