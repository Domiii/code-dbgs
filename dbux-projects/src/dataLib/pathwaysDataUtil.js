import last from 'lodash/last';
import EmptyArray from '@dbux/common/src/util/EmptyArray';
import allApplications from '@dbux/data/src/applications/allApplications';
import UserActionType from '@dbux/data/src/pathways/UserActionType';
import { shouldClumpTogether, getGroupTypeByActionType } from '@dbux/data/src/pathways/ActionGroupType';
import TestRun from './TestRun';

/** @typedef {import('../projectLib/Exercise').default} Exercise */
/** @typedef {import('./PathwaysDataProvider').default} PathwaysDataProvider */

export default {
  // ###########################################################################
  // status
  // ###########################################################################

  /**
   * @param {PathwaysDataProvider} pdp
   * @return {boolean}
   */
  hasSessionFinished(pdp) {
    const lastAction = pdp.collections.userActions.getLast();
    return lastAction && UserActionType.is.SessionFinished(lastAction.type);
  },

  getSessionEndTime(pdp) {
    if (pdp.util.hasSessionFinished()) {
      const lastAction = pdp.util.getLastAction();
      return lastAction.createdAt;
    }
    return null;
  },

  // ###########################################################################
  // get helper
  // ###########################################################################

  /**
   * @param {PathwaysDataProvider} pdp
   * @param {Exercise} exercise 
   */
  getTestRunsByExercise(pdp, exercise) {
    return pdp.indexes.testRuns.byExerciseId.get(exercise.id) || EmptyArray;
  },

  /**
   * @param {PathwaysDataProvider} pdp 
   * @param {TestRun} testRun 
   * @param {Exercise} exercise 
   */
  isTestRunOfBug(pdp, testRun, exercise) {
    return testRun.exerciseId === exercise.id;
  },

  isLastVisibleGroup(pdp, actionGroupId) {
    const actionGroup = pdp.collections.actionGroups.getById(actionGroupId);
    const visibleGroupsInStep = pdp.indexes.actionGroups.visiblesbyStepId.get(actionGroup.stepId);
    return last(visibleGroupsInStep) === actionGroup;
  },

  isLastStepOfStepGroup(pdp, stepId) {
    const step = pdp.collections.steps.getById(stepId);
    const stepsByGroup = pdp.indexes.steps.byGroup.get(step.stepGroupId);
    return last(stepsByGroup) === step;
  },

  // ###########################################################################
  // applications
  // ###########################################################################

  getApplication(pdp, actionId) {
    const action = pdp.collections.userActions.getById(actionId);
    return pdp.util.getActionApplication(action);
  },

  getActionApplication(pdp, action) {
    const { applicationId } = action;
    return allApplications.getById(applicationId) || null;
  },


  // ###########################################################################
  // actions
  // ###########################################################################

  getPreviousAction(pdp, actionId) {
    const previousAction = pdp.collections.userActions.getById(actionId - 1);
    return previousAction;
  },

  getNextAction(pdp, actionId) {
    const nextAction = pdp.collections.userActions.getById(actionId + 1);
    return nextAction;
  },

  getLastAction(pdp) {
    return pdp.collections.userActions.getLast();
  },

  getActionTimeSpent(pdp, actionId) {
    const action = pdp.collections.userActions.getById(actionId);
    const endTime = pdp.util.getActionEndTime(actionId);
    if (endTime) {
      return endTime - action.createdAt;
    }
    return Date.now() - action.createdAt;
  },

  getActionEndTime(pdp, actionId) {
    const nextAction = pdp.util.getNextAction(actionId);
    if (nextAction) {
      return nextAction.createdAt;
    }
    else if (pdp.util.hasSessionFinished()) {
      return pdp.util.getSessionEndTime();
    }
    return null;
  },

  // ###########################################################################
  // actionGroup
  // ###########################################################################

  getPreviousActionGroup(pdp, actionGroupId) {
    const previousActionGroup = pdp.collections.actionGroups.getById(actionGroupId - 1);
    return previousActionGroup;
  },

  getNextActionGroup(pdp, actionGroupId) {
    const nextActionGroup = pdp.collections.actionGroups.getById(actionGroupId + 1);
    return nextActionGroup;
  },

  getLastActionGroup(pdp) {
    return pdp.collections.actionGroups.getLast();
  },

  getActionGroupAction(pdp, actionGroupId) {
    return pdp.indexes.userActions.byGroup.getFirst(actionGroupId);
  },

  /** @param {PathwaysDataProvider} pdp */
  getActionTrace(pdp, action) {
    return action.trace || null;
  },

  getActionGroupTimeSpent(pdp, actionGroupId) {
    const actionGroup = pdp.collections.actionGroups.getById(actionGroupId);
    const endTime = pdp.util.getActionGroupEndTime(actionGroupId);
    if (endTime) {
      return endTime - actionGroup.createdAt;
    }
    return Date.now() - actionGroup.createdAt;
  },

  getActionGroupEndTime(pdp, actionGroupId) {
    const nextActionGroup = pdp.util.getNextActionGroup(actionGroupId);
    if (nextActionGroup) {
      return nextActionGroup.createdAt;
    }
    else if (pdp.util.hasSessionFinished()) {
      return pdp.util.getSessionEndTime();
    }
    return null;
  },

  shouldClumpNextActionIntoGroup(pdp, action, group) {
    const newGroupType = getGroupTypeByActionType(action.type);
    return shouldClumpTogether(group.type, newGroupType);
  },

  // ###########################################################################
  // steps
  // ###########################################################################

  getPreviousStep(pdp, stepId) {
    const previousStep = pdp.collections.steps.getById(stepId - 1);
    return previousStep;
  },

  getNextStep(pdp, stepId) {
    const nextStep = pdp.collections.steps.getById(stepId + 1);
    return nextStep;
  },

  getLastStep(pdp) {
    return pdp.collections.steps.getLast();
  },

  getStepAction(pdp, stepId) {
    return pdp.indexes.userActions.byStep.getFirst(stepId);
  },

  getStepTimeSpent(pdp, stepId) {
    const step = pdp.collections.steps.getById(stepId);
    const endTime = pdp.util.getStepEndTime(stepId);
    if (endTime) {
      return endTime - step.createdAt;
    }
    return Date.now() - step.createdAt;
  },

  getStepEndTime(pdp, stepId) {
    const nextStep = pdp.util.getNextStep(stepId);
    if (nextStep) {
      return nextStep.createdAt;
    }
    else if (pdp.util.hasSessionFinished()) {
      return pdp.util.getSessionEndTime();
    }
    return null;
  },

  // ###########################################################################
  // code chunks + functions
  // ###########################################################################

  // getCodeChunkId(pdp, actionId) {
  //   const action = pdp.collections.userActions.getById(actionId);
  //   return pdp.util.getActionCodeChunkId(action);
  // },

  // getActionCodeChunkId(pdp, action) {
  //   const dp = pdp.util.getActionApplication(action)?.dataProvider;
  //   if (!dp) {
  //     return null;
  //   }

  //   const { trace: { traceId } } = action;
  //   return dp.util.getCodeChunkId(traceId);
  // },

  /** @param {PathwaysDataProvider} pdp */
  getActionStaticContext(pdp, action) {
    const { staticContext } = action;
    return staticContext || null;
  },


  // ###########################################################################
  // Pathways analysis
  // ###########################################################################

  /**
   * All staticTraces that the user visited in this session.
   */
  getVisitedStaticTraces(pdp) {
    return pdp.indexes.userActions.visitedStaticTracesByFile.getAll();
  },

  /**
   * All staticTraces in given file that the user visited in this session.
   */
  getVisitedStaticTracesOfFile(pdp, fileName) {
    return pdp.indexes.userActions.visitedStaticTracesByFile.get(fileName);
  }
};