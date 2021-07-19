import ExecutionContext from '@dbux/common/src/types/ExecutionContext';
import EmptyObject from '@dbux/common/src/util/EmptyObject';
import dataNodeCollection from './dataNodeCollection';
import executionContextCollection from './executionContextCollection';
import staticTraceCollection from './staticTraceCollection';
import traceCollection from './traceCollection';
import valueCollection from './valueCollection';


// ###########################################################################
// BCE + callees
// ###########################################################################

/**
 * Looks up the latest BCE on the stack.
 * Returns the `staticContextId` of `BCE` -> `callee` -> `FunctionDefinition`.
 */
export function getCurrentCalleeStaticContextId() {
  const bceTrace = traceCollection.getLast();
  return bceTrace && getBCECalleeStaticContextId(bceTrace);
}

export function getFunctionStaticContextId(functionRef) {
  const functionNode = functionRef && dataNodeCollection.getById(functionRef.nodeId);
  const functionTrace = functionNode && traceCollection.getById(functionNode.traceId);
  const functionStaticTrace = functionTrace && staticTraceCollection.getById(functionTrace.staticTraceId);
  return functionStaticTrace?.data?.staticContextId;
}

export function getRefByTraceId(traceId) {
  const trace = traceCollection.getById(traceId);
  const calleeNode = trace && dataNodeCollection.getById(trace.nodeId);

  // lookup function data
  return calleeNode?.refId && valueCollection.getById(calleeNode.refId);
}

/**
 * @return {ValueRef} ValueRef of the function whose context is currently executing.
 */
export function getCurrentFunctionRef() {
  const context = executionContextCollection.getLastRealContext();
  return context && getFunctionRefByContext(context);
}

export function getFunctionRefByContext(context) {
  const functionTid = context?.definitionTid;
  return functionTid && getRefByTraceId(functionTid);
}

export function getBCECalleeStaticContextId(bceTrace) {
  const functionRef = getBCECalleeFunctionRef(bceTrace);
  return functionRef && getFunctionStaticContextId(functionRef);
}

export function getBCECalleeFunctionRef(bceTrace) {
  // lookup callee
  const { calleeTid } = bceTrace?.data || EmptyObject;
  const calleeTrace = calleeTid && traceCollection.getById(calleeTid);
  const calleeNode = calleeTrace && dataNodeCollection.getById(calleeTrace.nodeId);

  // lookup function data
  return calleeNode?.refId && valueCollection.getById(calleeNode.refId);
}

/**
 * @return {ExecutionContext} the context of the call of given `callId`, if it matches the BCE.
 */
export function peekBCEContextCheckCallee(callId) {
  const bceTrace = traceCollection.getById(callId);
  const context = executionContextCollection.getLastRealContext();

  const calleeRef = bceTrace && getBCECalleeFunctionRef(bceTrace);
  const contextFunctionRef = getFunctionRefByContext(context);
  return calleeRef && calleeRef === contextFunctionRef && context || null;
}

/**
 * WARNING: Only works when called from inside an instrumented function.
 * @returns {*} top bceTrace on stack, if its current function's callee's `staticContextId` matches that of the current context.
 */
export function peekBCECheckCallee() {
  const bceTrace = traceCollection.getLast();
  const calleeRef = bceTrace && getBCECalleeFunctionRef(bceTrace);
  const functionRef = getCurrentFunctionRef();
  return calleeRef && calleeRef === functionRef && bceTrace || null;
}


/// OLD:* @returns {*} top bceTrace on stack, if its callee's `staticContextId` matches that of the stack top.
/**
 * @returns {*} top bceTrace on stack, if its callee is `func`
 */
export function peekBCEMatchCallee(func) {
  const bceTrace = traceCollection.getLast();
  const calleeRef = bceTrace && getBCECalleeFunctionRef(bceTrace);
  const functionRef = calleeRef && valueCollection.getRefByValue(func);
  return calleeRef && calleeRef === functionRef && bceTrace || null;
}

// ###########################################################################
// ExecutionContexts
// ###########################################################################

export function isFirstContextInParent(contextId) {
  return executionContextCollection.isFirstContextInParent(contextId);
}

export function isRootContext(contextId) {
  return !executionContextCollection.getById(contextId).parentContextId;
}