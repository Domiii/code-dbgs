import { pathResolve } from '@dbux/common-node/src/util/pathUtil';
import traceSelection from '@dbux/data/src/traceSelection/index';
import { makeContextLabel } from '@dbux/data/src/helpers/makeLabels';
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
    this.ddg && this.addDisposable(this.ddg.onUpdate(this.#handleGraphUpdate));
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

  shared() {
    return {
      context: {
        view: this
      }
    };
  }


  #handleGraphUpdate = async (ddg) => {
    // send update to remote
    this.doc.setState(ddg.getRenderData());
  }

  /** ###########################################################################
   * public
   * ##########################################################################*/

  _public = {
    /**
     * HACKFIX: we do this, so we can resolve `ddg` in here.
     *    → That is necessary b/c VSCode won't resolve the nesting class's prop.
     * @type {DataDependencyGraph}
     */
    get ddg() { return null; },

    selectNode(timelineId) {
      const { timelineNodes } = this.renderState;
      const node = timelineNodes[timelineId];
      if (node.dataNodeId) {
        let traceId;
        const { dp } = this.ddg;
        if (node.isPartial) {
          traceId = this.ddg.getPartialSnapshotTraceId(node);
        }
        else {
          const dataNode = dp.collections.dataNodes.getById(node.dataNodeId);
          traceId = dataNode.traceId;
        }
        const trace = dp.collections.traces.getById(traceId);
        if (trace) {
          traceSelection.selectTrace(trace, null, node.dataNodeId);
        }
      }
    },

    async toggleSummaryMode(cfg) {
      this.ddg.toggleSummaryMode(cfg.timelineId);
    },

    /**
     * Handle update graph request from client
     */
    async updateGraph(cfg) {
      const {
        timelineId, summaryMode, settings
      } = cfg;
      const { ddg } = this;

      if (settings) {
        ddg.updateSettings(settings);
      }
      if (summaryMode) {
        // update graph
        ddg.setSummaryMode(timelineId, summaryMode);
      }
    },
    async saveScreenshot(svgString) {
      const { dp, contextId } = this.ddg;
      const context = dp.collections.executionContexts.getById(contextId);
      const { application } = dp;
      const name = makeContextLabel(context, application);

      const defaultExportFolder = this.componentManager.externals.getDefaultExportDirectory();
      const exportPath = pathResolve(defaultExportFolder, 'screenshots', `${name}_${contextId}.svg`);
      await this.componentManager.externals.saveFile(exportPath, svgString);
    }
  };
  get public() {
    return this._public;
  }
  set public(value) {
    this._public = value;
  }
}
