import { v4 as uuidv4 } from 'uuid';
import { newLogger } from '@dbux/common/src/log/logger';
import allApplications from '@dbux/data/src/applications/allApplications';
import PathwaysDataProvider from '../dataLib/PathwaysDataProvider';
import { emitSessionFinishedEvent } from '../userEvents';
import PracticeSessionState, { isStateFinishedType, isStateStoppedType } from './PracticeSessionState';

// eslint-disable-next-line no-unused-vars
const { log, debug, warn, error: logError } = newLogger('PathwaysSession');

/** @typedef {import('../ProjectsManager').default} ProjectsManager */
/** @typedef {import('./PracticeSessionData').default} PracticeSessionData */

export default class PathwaysSession {
  /**
   * A PracticeSession contains the information that user solving a bug.
   * @param {ProjectsManager} manager
   * @param {string} [sessionId]
   * @param {number} [createdAt]
   * @param {number} [state]
   * @param {string} [customLogFilePath]
   */
  constructor(manager, sessionId, createdAt, state, customLogFilePath) {
    this.manager = manager;
    this.sessionId = sessionId || uuidv4();
    this.createdAt = createdAt || Date.now();
    this.state = state || PracticeSessionState.Solving;
    this._logFilePath = customLogFilePath;
    this.lastAnnotation = '';

    this.pathwaysDataProvider = new PathwaysDataProvider(this);
  }

  get bdp() {
    return this.manager.bdp;
  }

  get pdp() {
    return this.pathwaysDataProvider;
  }

  /**
   * @return {string}
   */
  get logFilePath() {
    return this._logFilePath || this.getDefaultLogFilePath();
  }

  async init() {
    await this.pdp.init();
  }

  isStopped() {
    return isStateStoppedType(this.state);
  }

  /**
   * @return {bool}
   */
  isFinished() {
    // // hackfix: use last `userAction` to check if session has finished
    // return this.pdp.util.hasSessionFinished();
    return isStateFinishedType(this.state);
  }

  setState(state) {
    if (this.state !== state) {
      this.state = state;
      this.manager._notifyPracticeSessionStateChanged();
    }
  }

  get confirmStopMessage() {
    return `This will stop recording all pathways events, are you sure?`;
  }

  /**
   * Ask and stop the session but not quit, so user could see their pathways logs.
   */
  async confirmStop() {
    if (this.isFinished()) {
      return true;
    }

    // TOTRANSLATE
    if (!await this.manager.externals.confirm(this.confirmStopMessage)) {
      return false;
    }

    await this.handleStop?.();

    emitSessionFinishedEvent(this.state);
    this.setState(PracticeSessionState.Stopped);
    await this.save();

    return true;
  }


  /**
   * Ask and quit the session.
   */
  async confirmExit() {
    // TOTRANSLATE
    if (!await this.manager.externals.confirm(`Do you want to exit the practice session?`)) {
      return false;
    }

    await this.handleExit?.();

    allApplications.clear();

    return true;
  }

  /** ###########################################################################
   *  save/load
   *  #########################################################################*/

  /**
   * @returns {PracticeSessionData}
   */
  serialize() {
    const {
      sessionId,
      createdAt,
      logFilePath,
      state,
    } = this;

    return {
      sessionId,
      createdAt,
      logFilePath,
      state,
    };
  }

  /**
   * @param {ProjectsManager} manager
   * @param {PracticeSessionData} sessionData
   * @returns 
   */
  static from(manager, sessionData) {
    const {
      sessionId,
      createdAt,
      logFilePath,
      state,
      applicationUUIDs,
    } = sessionData;
    return new this(manager, sessionId, createdAt, state, logFilePath, applicationUUIDs);
  }

  // ###########################################################################
  // utils
  // ###########################################################################

  getDefaultLogFilePath() {
    return this.manager.getPathwaysLogFilePath(this.sessionId);
  }

  getApplicationFilePath(uuid) {
    return this.manager.getApplicationFilePath(uuid);
  }

  getExerciseIndexFilePath(exercise) {
    return this.manager.getExerciseIndexFilePath(exercise);
  }

  maybeRecordApplications(apps) {
    const newApps = apps.filter(app => !this.pdp.collections.applications.isApplicationAdded(app));
    this.pdp.addApplications(newApps);
  }

  async save() {
    try {
      await this.manager.saveSession();
    }
    catch (err) {
      logError('Error when saving practiceSession:', err);
    }
  }
}