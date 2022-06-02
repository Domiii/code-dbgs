// import LayoutAlgorithmType from '@dbux/graph-common/src/ddg/types/LayoutAlgorithmType';

import DDGSummaryMode, { RootSummaryModes } from '@dbux/data/src/ddg/DDGSummaryMode';
import { RootTimelineId } from '@dbux/data/src/ddg/constants';
import { BootstrapBtnGroupSeparatorHtml, compileHtmlElement, decorateClasses } from '../util/domUtil';
import ClientComponentEndpoint from '../componentLib/ClientComponentEndpoint';
import { decorateSummaryModeButtons, makeSummaryButtons } from './ddgDomUtil';

let documentClickHandler;

/** @typedef { import("./DDGDocument").default } DDGDocument */

class Toolbar extends ClientComponentEndpoint {
  summaryRootButtons;

  createEl() {
    /**
          <button title="Hide subgraphs that are not affected any watched node" data-el="connectedOnlyModeBtn" class="toolbar-btn btn btn-info" href="#">
            con
          </button>
          <button title="Merge computation subgraphs" data-el="mergeComputationsBtn" class="toolbar-btn btn btn-info" href="#">
            ⚙
          </button>
     */
    const el = compileHtmlElement(/*html*/`
      <nav class="navbar sticky-top navbar-expand-lg no-padding" id="toolbar">
        <div class="btn-group btn-group-toggle" data-toggle="buttons">
          <button title="Rebuild" data-el="rebuildBtn" class="toolbar-btn btn btn-info" href="#">
            Rebuild 🔁
          </button>
          
          ${BootstrapBtnGroupSeparatorHtml}

        </div>
      </nav>
    `);

    // add root control buttons
    const btns = el.querySelector('.btn-group');
    const btnClass = 'toolbar-btn btn btn-info';
    const {
      el: summaryRootButtonDom,
      els: summaryRootButtons
    } = makeSummaryButtons(this.doc, RootTimelineId, btnClass, RootSummaryModes, true);
    btns.appendChild(summaryRootButtonDom);

    this.summaryRootButtons = summaryRootButtons;

    return el;
  }

  setupEl() {
    if (documentClickHandler) {
      document.removeEventListener('click', documentClickHandler);
    }
    document.addEventListener('click', documentClickHandler = this._onDocumentClick);
  }

  _onDocumentClick = (evt) => {
  };

  // ###########################################################################
  // update
  // ###########################################################################

  update = () => {
    this.decorateButtons();
    this.renderModes();
  }

  decorateButtons() {
    // const {
    //   // layoutType,
    //   connectedOnlyMode
    // } = this.parent.state;
    // decorateClasses(this.els.connectedOnlyModeBtn, {
    //   active: connectedOnlyMode
    // });
    
    decorateSummaryModeButtons(this.summaryRootButtons);
  }

  renderModes() {
  }

  /**
   * @type {DDGDocument}
   */
  get doc() {
    return this.context.doc;
  }


  on = {
    rebuildBtn: {
      async click(evt) {
        evt.preventDefault();
        this.doc.timeline.rebuildGraph();
      },

      focus(evt) { evt.target.blur(); }
    },

    // connectedOnlyModeBtn: {
    //   async click(evt) {
    //     evt.preventDefault();
    //     await this.remote.setGraphDocumentMode({
    //       connectedOnlyMode: !this.doc.state.connectedOnlyMode,
    //     });
    //   },

    //   focus(evt) { evt.target.blur(); }
    // },

    // mergeComputationsBtn: {
    //   async click(evt) {
    //     evt.preventDefault();
    //     await this.remote.setGraphDocumentMode({
    //       mergeComputesMode: !this.doc.state.mergeComputesMode
    //     });
    //   },

    //   focus(evt) { evt.target.blur(); }
    // },

    // layoutForceBtn: {
    //   async click(evt) {
    //     evt.preventDefault();
    //     if (!await this.remote.setLayoutAlgorithm(LayoutAlgorithmType.ForceLayout)) {
    //       this.doc.timeline.autoLayout();
    //     }
    //   },

    //   focus(evt) { evt.target.blur(); }
    // },

    // layoutAtlas2Btn: {
    //   async click(evt) {
    //     evt.preventDefault();
    //     if (!await this.remote.setLayoutAlgorithm(LayoutAlgorithmType.ForceAtlas2)) {
    //       this.doc.timeline.autoLayout();
    //     }
    //     // const { layoutType } = this.parent.state;
    //     // await this.remote.setLayoutAlgorithm(LayoutAlgorithmType.nextValue(layoutType));
    //   },

    //   focus(evt) { evt.target.blur(); }
    // }
  }
}

export default Toolbar;
