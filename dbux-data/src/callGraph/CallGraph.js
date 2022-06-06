import { newLogger } from '@dbux/common/src/log/logger';
import { binarySearchByKey } from '@dbux/common/src/util/arrayUtil';
import TraceType, { isTracePush, isTracePop, isDataOnlyTrace } from '@dbux/common/src/types/constants/TraceType';
import EmptyArray from '@dbux/common/src/util/EmptyArray';
import { hasCallId, isCallResult } from '@dbux/common/src/types/constants/traceCategorization';
import RuntimeDataProvider from '../RuntimeDataProvider';

// eslint-disable-next-line no-unused-vars
const { log, debug, warn, error: logError } = newLogger('CallGraph');

export default class CallGraph {
  /**
   * @param {RuntimeDataProvider} dp
   */
  constructor(dp) {
    this.dp = dp;
  }

  // ###########################################################################
  //  Public
  // ###########################################################################

  /**
   * Search algorithm ref.: https://github.com/Domiii/dbux#call-graph-navigation
   */

  getPreviousInContext(traceId, originId = null) {
    if (!originId) {
      originId = traceId;
    }
    const previousTrace = this._getPreviousInContext(traceId);
    if (this._isDataTrace(previousTrace)) {
      if (traceId === previousTrace.traceId) {
        // avoiding endless loop
        logError('Found same trace in `getPreviousInContext`');
        return null;
      }
      return this.getPreviousInContext(previousTrace.traceId, originId);
    }

    if (previousTrace && this._areTraceBCEAndResult(previousTrace.traceId, originId)) {
      return this.getPreviousInContext(previousTrace.traceId, originId);
    }

    return previousTrace;
  }

  getNextInContext(traceId, originId = null) {
    if (!originId) {
      originId = traceId;
    }
    const nextTrace = this._getNextInContext(traceId);
    if (this._isDataTrace(nextTrace)) {
      if (traceId === nextTrace.traceId) {
        // avoiding endless loop
        logError('Found same trace in `getNextInContext`');
        return null;
      }
      return this.getNextInContext(nextTrace.traceId, originId);
    }

    if (nextTrace && this._areTraceBCEAndResult(originId, nextTrace.traceId)) {
      return this.getNextInContext(nextTrace.traceId, originId);
    }

    return nextTrace;
  }

  getPreviousParentContext(traceId) {
    const trace = this.dp.collections.traces.getById(traceId);
    const { contextId } = trace;
    const realContextId = this.dp.util.getRealContextIdOfContext(contextId);
    const firstTraceInContext = this.dp.util.getFirstTraceOfContext(contextId); 
    const firstTraceInRealContext = this.dp.util.getFirstTraceOfRealContext(realContextId);

    if (
      trace !== firstTraceInRealContext &&
      !(trace === firstTraceInContext && this.dp.util.isFirstContextInParent(contextId))
    ) {
      return firstTraceInRealContext;
    }
    else {
      const realContext = this.dp.util.getRealContextOfContext(contextId);
      const parentTrace = this._getParentTraceByContextId(realContext.contextId);
      if (parentTrace) {
        const callerTrace = this.dp.util.getPreviousCallerTraceOfTrace(parentTrace.traceId);
        return callerTrace || null;
      }
      else {
        const fromAsyncEvent = this.dp.indexes.asyncEvents.to.getFirst(contextId);
        const fromRootContext = this.dp.collections.executionContexts.getById(fromAsyncEvent?.fromRootContextId);
        return this.dp.util.getFirstTraceOfContext(fromRootContext?.contextId) || null;
      }
    }
  }

  getNextParentContext(traceId) {
    const trace = this.dp.collections.traces.getById(traceId);
    const { contextId } = trace;
    const lastTrace = this.dp.util.getLastTraceOfContext(contextId);

    if (trace !== lastTrace) {
      return lastTrace;
    }
    else {
      const parentTrace = this._getParentTraceByContextId(contextId);
      if (parentTrace) {
        const callerTrace = this.dp.util.getPreviousCallerTraceOfTrace(parentTrace.traceId);
        if (callerTrace) {
          return this.dp.collections.traces.getById(callerTrace.resultId);
        }
      }
      return null;
    }
  }

  getPreviousChildContext(traceId) {
    const trace = this.dp.collections.traces.getById(traceId);

    // if trace has callId, `step in` to that call right away
    if (hasCallId(trace)) {
      const lastChild = this.dp.util.getLastTraceByCallerTrace(trace.callId);
      if (lastChild) {
        return lastChild;
      }
    }

    // otherwise find the previous child or return null
    const prevChild = this._getPreviousChildTrace(traceId);
    if (!prevChild) {
      // no nextChild
      return null;
    }
    else if (prevChild === trace) {
      // nextChild is itself(usually in getter/setter), return the first child inside
      const firstChild = this.dp.util.getFirstTraceByCallerTrace(traceId);
      if (firstChild) {
        return firstChild;
      }
      else {
        logError(`PreviousChildContext of traceId=${traceId} does not have any children`);
        return trace;
      }
    }
    else {
      return prevChild;
    }
  }

  getNextChildContext(traceId) {
    const trace = this.dp.collections.traces.getById(traceId);

    // if trace is call-related, `step in` to that call right away
    if (isCallResult(trace) || hasCallId(trace)) {
      const firstChild = this.dp.util.getFirstTraceByCallerTrace(trace.resultCallId || trace.callId);
      if (firstChild) {
        return firstChild;
      }
    }

    // otherwise find the next child or return null
    const nextChild = this._getNextChildTrace(traceId);
    if (!nextChild) {
      // no nextChild
      return null;
    }
    else if (nextChild === trace) {
      // nextChild is itself(usually in getter/setter), return the first child inside
      const firstChild = this.dp.util.getFirstTraceByCallerTrace(traceId);
      if (firstChild) {
        return firstChild;
      }
      else {
        logError(`NextChildContext of traceId=${traceId} does not have any children`);
        return trace;
      }
    }
    else {
      return nextChild;
    }
  }

  getPreviousByStaticTrace(traceId) {
    const trace = this.dp.collections.traces.getById(traceId);
    const traces = this.dp.indexes.traces.byStaticTrace.get(trace.staticTraceId);
    const index = binarySearchByKey(traces, trace, (t) => t.traceId);

    if (index !== null && index > 0) {
      return traces[index - 1];
    }
    else {
      return null;
    }
  }

  getNextByStaticTrace(traceId) {
    const trace = this.dp.collections.traces.getById(traceId);
    const traces = this.dp.indexes.traces.byStaticTrace.get(trace.staticTraceId);
    const index = binarySearchByKey(traces, trace, (t) => t.traceId);

    if (index !== null && index < traces.length - 1) {
      return traces[index + 1];
    }
    else {
      return null;
    }
  }

  // ###########################################################################
  //  Private
  // ###########################################################################
  _getPreviousInContext(traceId) {
    const trace = this.dp.collections.traces.getById(traceId);
    const traces = this.dp.util.getTracesOfRealContext(traceId);
    const index = binarySearchByKey(traces, trace, (t) => t.traceId);
    if (index === null) {
      logError('Trace not found in traces');
      return null;
    }
    const previousTraceById = this.dp.collections.traces.getById(traceId - 1);

    if (index !== 0) {
      return traces[index - 1];
    }
    // handle push/pop siblings
    else if (previousTraceById &&
      isTracePush(this.dp.util.getTraceType(traceId)) &&
      isTracePop(this.dp.util.getTraceType(previousTraceById.traceId))) {
      return previousTraceById;
    }
    else {
      return null;
    }
  }

  _getNextInContext(traceId) {
    const trace = this.dp.collections.traces.getById(traceId);
    const traces = this.dp.util.getTracesOfRealContext(traceId);
    const index = binarySearchByKey(traces, trace, (t) => t.traceId);
    if (index === null) {
      logError('Trace not found in traces:', traceId);
      return null;
    }
    const nextTraceById = this.dp.collections.traces.getById(traceId + 1);

    if (index !== traces.length - 1) {
      return traces[index + 1];
    }
    // handle push/pop siblings
    else if (nextTraceById &&
      isTracePop(this.dp.util.getTraceType(traceId)) &&
      isTracePush(this.dp.util.getTraceType(nextTraceById.traceId))) {
      return nextTraceById;
    }
    else {
      return null;
    }
  }

  _getPreviousChildTrace(traceId) {
    const trace = this.dp.collections.traces.getById(traceId);
    const realContextId = this.dp.util.getRealContextIdOfTrace(traceId);
    const parentTraces = this.dp.indexes.traces.parentsByRealContext.get(realContextId) || EmptyArray;

    const lowerIndex = this._binarySearchLowerIndexByKey(parentTraces, trace, (t) => t.traceId);

    if (lowerIndex === null) {
      return null;
    }
    else {
      return this.dp.util.getBCETraceOfTrace(parentTraces[lowerIndex].traceId);
    }
  }

  _getNextChildTrace(traceId) {
    const realContextId = this.dp.util.getRealContextIdOfTrace(traceId);
    const trace = this.dp.collections.traces.getById(traceId);
    const parentTraces = this.dp.indexes.traces.parentsByRealContext.get(realContextId) || EmptyArray;

    const upperIndex = this._binarySearchUpperIndexByKey(parentTraces, trace, (t) => t.traceId);

    if (upperIndex === null) {
      return null;
    }
    else {
      return this.dp.util.getBCETraceOfTrace(parentTraces[upperIndex].traceId);
    }
  }

  // ########################################
  //  Util
  // ########################################

  /**
   * Note: The array mapped by makeKey must be sorted.
   */
  _binarySearchUpperIndexByKey(arr, x, makeKey) {
    if (!arr.length) return null;
    if (makeKey) {
      arr = arr.map(makeKey);
      x = makeKey(x);
    }
    let start = 0;
    let end = arr.length - 1;
    let mid;

    if (arr[end] < x) return null;

    while (start < end) {
      mid = Math.floor((start + end) / 2);
      if (arr[mid] < x) start = mid + 1;
      else end = mid;
    }

    return start;
  }

  _binarySearchLowerIndexByKey(arr, x, makeKey) {
    if (!arr.length) return null;
    if (makeKey) {
      arr = arr.map(makeKey);
      x = makeKey(x);
    }
    let start = 0;
    let end = arr.length - 1;
    let mid;

    if (arr[start] > x) return null;

    while (start < end) {
      mid = Math.ceil((start + end) / 2);
      if (arr[mid] <= x) start = mid;
      else end = mid - 1;
    }

    return start;
  }

  _getParentTraceByContextId = (contextId) => {
    const { parentTraceId } = this.dp.collections.executionContexts.getById(contextId);
    return this.dp.collections.traces.getById(parentTraceId);
  }

  _getContextByTrace = (trace) => {
    return this.dp.collections.executionContexts.getById(trace.contextId);
  }

  _isDataTrace(trace) {
    if (trace && isDataOnlyTrace(this.dp.util.getTraceType(trace.traceId))) {
      return true;
    }
    else {
      return false;
    }
  }

  _areTraceBCEAndResult(traceId1, traceId2) {
    const type1 = this.dp.util.getTraceType(traceId1);
    if (TraceType.is.BeforeCallExpression(type1)) {
      const type2 = this.dp.util.getTraceType(traceId2);
      if (TraceType.is.CallExpressionResult(type2)) {
        const trace1 = this.dp.collections.traces.getById(traceId1);
        const trace2 = this.dp.collections.traces.getById(traceId2);
        if (trace1.callId === trace2.resultCallId) {
          return true;
        }
      }
    }
    return false;
  }
}