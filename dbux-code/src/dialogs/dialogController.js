import { newLogger } from '@dbux/common/src/log/logger';
import dialogGraphs from './_dialogRegistry';
import { Dialog } from './Dialog';
import { getProjectManager } from '../projectViews/projectControl';
import { getInstallId } from '../installId';
import { setDialogControllerForDefaultHelp } from '../help';

// eslint-disable-next-line no-unused-vars
const { log, debug, warn, error: logError } = newLogger('DialogController');

export class DialogController {
  constructor() {
    this.graphs = new Map(Object.entries(dialogGraphs));
    this.dialogs = new Map();

    setDialogControllerForDefaultHelp(this);
  }

  /**
   * Start a dialog, will create one if not exist
   * @param {string} dialogName 
   * @param {string} [startState] start dialog with the given state
   */
  async startDialog(dialogName, startState) {
    let dialog = this.getDialog(dialogName);
    await dialog.start(startState);
  }

  /**
   * @param {string} dialogName 
   * @return {Dialog}
   */
  getDialog(dialogName) {
    let dialog = this.dialogs.get(dialogName);
    if (!dialog) {
      dialog = new Dialog(this, this.graphs.get(dialogName));
      this.dialogs.set(dialogName, dialog);
    }
    return dialog;
  }

  // ###########################################################################
  // serialization + recording
  // ###########################################################################

  async serializeSurveyResult() {
    // get install id (random uuid that we generate and store in memento on first activate)
    const installId = getInstallId();

    // get survey result
    const surveyResult = this.getDialog('survey1').getRecordedData();

    // get tutorial result
    const tutorialResult = this.getDialog('tutorial').getRecordedData();

    // get first bug result
    const projectsManager = getProjectManager();
    const firstBug = projectsManager.projects.getByName('express').exercises.getAt(1);
    const exercise1Progress = projectsManager.exerciseDataProvider.getExerciseProgress(firstBug.id);
    // const bug1Tries = projectsManager.pathwayDataProvider.util.getTestRunsByExercise(firstBug);
    // const bug1Status = null;

    return {
      installId,
      surveyResult,
      tutorialResult,
      exercise1Progress,
      // bug1Tries
    };
  }
}

/**
 * @type {DialogController}
 */
let dialogController;

export function initDialogController() {
  dialogController = new DialogController();
  return dialogController;
}
