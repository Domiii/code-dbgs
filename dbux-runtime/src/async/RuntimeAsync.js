import { newLogger } from '@dbux/common/src/log/logger';
import isThenable from '@dbux/common/src/util/isThenable';
import PromiseLinkType from '@dbux/common/src/types/constants/PromiseLinkType';
import { getAsyncFunctionCallerPromiseId, peekBCEContextCheckCallee, } from '../data/dataUtil';
import ThenRef from '../data/ThenRef';
// eslint-disable-next-line max-len
import { getPromiseData, getPromiseId } from './promisePatcher';
import asyncEventUpdateCollection from '../data/asyncEventUpdateCollection';
import executionContextCollection from '../data/executionContextCollection';
import nestedPromiseCollection from '../data/promiseLinkCollection';
// import { isPostEventUpdate, isPreEventUpdate } from '@dbux/common/src/types/constants/AsyncEventUpdateType';

/** @typedef { import("../Runtime").default } Runtime */

export default class RuntimeAsync {
  logger = newLogger('Async');

  /**
   * Stores key = realContextId, value = { resumeContextId, rootId } for
   * connecting `preAwait` and `postAwait` events.
   */
  lastAwaitByRealContext = new Map();

  /**
   * @type {Runtime}
   */
  _runtime;

  constructor(runtime) {
    this._runtime = runtime;
  }

  // getCurrentRunId() {
  //   return this._runtime.getCurrentRunId();
  // }
  getCurrentVirtualRootContextId() {
    return this._runtime.getCurrentVirtualRootContextId();
  }

  setAsyncContextPromise(context, promiseId) {
    // NOTE: this branch should always execute
    // [edit-after-execute]
    context.data = context.data || {};
    context.data.callerPromiseId = promiseId;
  }

  /**
   * We use this to associate `contextId` of an async function `f`, with its returned `promise`,
   * in the SPECIAL CASE of `then(f)`.
   * @deprecated
   */
  setAsyncContextIdPromise(contextId, promise) {
    const promiseId = getPromiseId(promise);

    // if (!promiseId) {

    // }

    const context = executionContextCollection.getById(contextId);
    if (context) {
      this.setAsyncContextPromise(context, promiseId);
    }

    // old version
    // TODO: remove the following part → this does not work if async function has no await!
    const lastAwaitData = this.lastAwaitByRealContext.get(contextId);

    // eslint-disable-next-line max-len
    // this.logger.warn(`[traceCallPromiseResult] trace=${traceCollection.makeTraceInfo(trace.traceId)}, lastContextId=${executionContextCollection.getLastRealContext(this._runtime.getLastPoppedContextId())?.contextId}`, calledContext?.contextId,
    //   lastAwaitData);

    if (lastAwaitData) {
      lastAwaitData.asyncFunctionPromiseId = promiseId;

      // NOTE: the function has already returned -> the first `preAwait` was already executed (but not sent yet)
      // [edit-after-send]
      const lastUpdate = asyncEventUpdateCollection.getById(lastAwaitData.updateId);
      lastUpdate.promiseId = promiseId;
    }
    return lastAwaitData;
  }

  /**
   * Track any created promise (that is the return value of a function or ctor call).
   */
  traceCallPromiseResult(parentContextId, callResultTrace, promise) {
    //   const currentRootId = this.getCurrentVirtualRootContextId();
    //   if (!isNewPromise(promise, currentRootId)) {
    //     // this.logger.warn('have seen promise before', currentRootId, promise._dbux_);
    //     return;
    //   }

    const callId = callResultTrace.resultCallId;
    const lastContextId = this._runtime.getLastPoppedContextId();
    const calledRealContext = lastContextId && peekBCEContextCheckCallee(callId, lastContextId) || null;

    if (calledRealContext) {
      const calledContextId = calledRealContext.contextId;
      this.setAsyncContextIdPromise(calledContextId, promise);
    }
  }

  // ###########################################################################
  // preAwait
  // ###########################################################################

  preAwait(awaitArgument, resumeContextId, realContextId, schedulerTraceId) {
    const currentRootId = this.getCurrentVirtualRootContextId();
    const currentRunId = this._runtime.getCurrentRunId();
    // const awaitData = this.lastAwaitByRealContext.get(realContextId) || EmptyObject;
    // const { asyncFunctionPromiseId } = awaitData;
    /**
     * WARNING: sometimes `promiseId` is not set and serves as placeholder (e.g. in case of async thenCb).
     * Will be patched up in post.
     */
    const promiseId = getAsyncFunctionCallerPromiseId(realContextId);

    // store update
    const update = asyncEventUpdateCollection.addPreAwaitUpdate({
      runId: currentRunId,
      rootId: currentRootId,
      contextId: resumeContextId,
      schedulerTraceId, // preAwaitTid
      realContextId,
      promiseId,
      nestedPromiseId: isThenable(awaitArgument) ? getPromiseId(awaitArgument) : 0
    });

    // TODO: add sync edge
    //    * if nested and promise already has `lastAsyncNode`
    //      -> add an edge from `preEvent` `AsyncNode` to promise's `lastAsyncNode`
    const isFirstAwait = resumeContextId === realContextId;

    // if (isRootContext(resumeContextId)) {
    //   // NOTE: this check is only necessary in case of a top-level `await`.
    //   //    -> since else: `!isFirstAwait` and `postAwait` just occured.
    //   // make sure that we have a valid threadId
    //   this.getOrAssignRootThreadId(resumeContextId);
    // }

    this.updateLastAwaitByRealContext(realContextId, {
      resumeContextId,
      preAwaitRootId: currentRootId,
      isFirstAwait,
      schedulerTraceId,
      updateId: update.updateId
      // awaitArgument
    });

    // NOTE: debug via `RuntimeMonitor` instead
    // this.logger.debug(`[preAwait] ${resumeContextId}, ${realContextId}, ${isFirstAwait}`);

    const isNested = isThenable(awaitArgument);
    if (!isNested) {
      return;
    }

    // /**
    //  * If `awaitArgument` is return value of `async` function, `nestedPromiseAsyncData` is its lastAwaitData
    //  */
    // const nestedPromiseAsyncData = this.getPromiseLastAwait(awaitArgument);
    // if (!nestedPromiseAsyncData) {
    //   // invalid data
    //   return;
    // }

    // if (!nestedPromiseAsyncData.firstAwaitingAsyncFunctionContextId) {
    //   // first nesting caller is part of the CHAIN
    //   nestedPromiseAsyncData.firstAwaitingAsyncFunctionContextId = realContextId;
    // }

    this._preNestPromise(awaitArgument, currentRootId, schedulerTraceId);

    // this.logger.debug('this promise', promise, 'first await', isFirstAwait, 'is root', this.isRootContext(parentContextId));
    // if (!isFirstAwait || isRootContext(parentContextId)) {
    //   const threadId = this.getRootThreadId(currentRootId);
    //   this.setupPromise(awaitArgument, currentRootId, threadId, true);
    // }
  }

  /**
   * @deprecated
   */
  _preNestPromise(promise, currentRootId, tid) {
    const {
      rootId: nestedRootId,
      firstEventRootId,
      firstNestingTraceId
    } = getPromiseData(promise);
    if (nestedRootId === currentRootId && !firstNestingTraceId) {
      setPromiseData(promise, {
        firstNestingTraceId: tid
      });
    }

    // later callers add SYNC edges to first root of `awaitArgument`
    if (!firstEventRootId) {
      // promise has not resolved its first event yet, so we add this context as pending
      // pushPromisePendingRootId(promise, currentRootId);
    }
    else {
      // this.addSyncEdge(currentRootId, firstEventRootId, AsyncEdgeType.SyncOut);
    }
  }

  /** ###########################################################################
   * runtime basics
   *  #########################################################################*/

  virtualRootStarted(rootId) {
    const context = executionContextCollection.getById(rootId);
    if (context) {
      // [edit-after-send]
      context.isVirtualRoot = true;

      // WARNING: `new Error().stack` might internally call functions that are instrumented by user code

      // future-work: make this configurable, as it is extremely bad for performance, especially if source maps are enabled
      // context.stackTrace = valueCollection._readProperty(new Error(), 'stack');
    }

    // // NOTE: add all unassigned roots to thread#1
    // this.setRootThreadId(rootId, 1);
  }


  // ###########################################################################
  // postAwait
  // ###########################################################################

  /**
   * TODO: also add a similar (but not the same) logic to `return` value of `async` functions.
   */
  postAwait(/* awaitContextId, */ realContextId, postEventContextId, awaitArgument) {
    const asyncData = this.lastAwaitByRealContext.get(realContextId);
    /**
     * WARNING: sometimes `promiseId` is not set and serves as placeholder (e.g. in case of async thenCb).
     * Will be patched up in post.
     */
    const promiseId = getAsyncFunctionCallerPromiseId(realContextId);

    let {
      // preEventThreadId,
      schedulerTraceId
    } = asyncData;

    const postEventRootId = this.getCurrentVirtualRootContextId();
    const postEventRunId = this._runtime.getCurrentRunId();
    // preEventThreadId = preEventThreadId || this.getOrAssignRootThreadId(preEventRootId);

    // store update
    asyncEventUpdateCollection.addPostAwaitUpdate({
      runId: postEventRunId,
      rootId: postEventRootId,
      contextId: postEventContextId,
      schedulerTraceId,
      realContextId,
      promiseId
      // nestedPromiseId: isThenable(awaitArgument) ? getPromiseId(awaitArgument) : 0
    });
  }


  // ###########################################################################
  // Promises: preThen
  // ###########################################################################

  /**
   * Event: New promise (`postEventPromise`) has been scheduled.
   * @param {ThenRef} thenRef
   */
  preThen(thenRef) {
    const {
      preEventPromise,
      postEventPromise,
      schedulerTraceId
    } = thenRef;

    const runId = this._runtime.getCurrentRunId();
    const preEventRootId = this.getCurrentVirtualRootContextId();
    const contextId = this._runtime.peekCurrentContextId();
    const promiseId = getPromiseId(preEventPromise);
    const postEventPromiseId = getPromiseId(postEventPromise);

    // store update
    asyncEventUpdateCollection.addPreThenUpdate({
      runId,
      rootId: preEventRootId,
      contextId: contextId,
      schedulerTraceId,
      promiseId,
      postEventPromiseId
    });

    // const rootId = this.getCurrentVirtualRootContextId();
    // this.logger.debug(`[preThen] #${rootId} ${getPromiseId(preEventPromise)} -> ${getPromiseId(postEventPromise)} (tid=${schedulerTraceId})`);
  }

  // ###########################################################################
  // Promises: postThen
  // ###########################################################################

  /**
   * Event: Promise has been settled.
   * 
   * @param {ThenRef} thenRef
   */
  postThen(thenRef, returnValue, cbContext) {
    const {
      postEventPromise,
      schedulerTraceId
    } = thenRef;

    const runId = this._runtime.getCurrentRunId();
    const postEventRootId = this.getCurrentVirtualRootContextId();
    // const contextId = this._runtime.peekCurrentContextId();
    const contextId = cbContext?.contextId;

    if (!postEventRootId) {
      this.logger.trace(`postThen`, getPromiseId(postEventPromise), thenRef, { runId, postEventRootId });
    }

    const nestedPromiseId = isThenable(returnValue) ? getPromiseId(returnValue) : 0;
    const postEventPromiseId = getPromiseId(postEventPromise);

    if (nestedPromiseId) {
      nestedPromiseCollection.addLink(PromiseLinkType.ThenNested, nestedPromiseId, postEventPromiseId, schedulerTraceId, postEventRootId);
    }

    // store update
    asyncEventUpdateCollection.addPostThenUpdate({
      runId,
      rootId: postEventRootId,

      // NOTE: should have rootId === contextId
      contextId,

      schedulerTraceId,
      promiseId: getPromiseId(postEventPromise),
      nestedPromiseId
    });
  }

  // ###########################################################################
  // Promises: promiseConstructorCalled
  // ###########################################################################

  // // NOTE: this hackfix should not be necessary anymore
  // promiseCtorCalled(promiseId, previousLastUpdateId) {
  //   const lastUpdateId = asyncEventUpdateCollection.getLastId();
  //   for (let i = previousLastUpdateId + 1; i < lastUpdateId; ++i) {
  //     const update = asyncEventUpdateCollection.getById(i);
  //     if (!isPostEventUpdate(update.type)) {
  //       // [edit-after-send]
  //       update.promiseCtorId = promiseId;
  //     }
  //     else {
  //       // NOTE: Post events should not happen during promise ctor anyway
  //     }
  //   }
  // }

  // ###########################################################################
  // non-events
  // ###########################################################################

  /**
   * 
   */
  promisifyPromise(from, promisifyPromiseVirtualRef) {
    const to = 0; // will be filled in via `promisifyPromiseVirtualRef`
    const traceId = 0; // will be resolved in post (PromiseLinkCollection)
    const rootId = this.getCurrentVirtualRootContextId();
    const link = nestedPromiseCollection.addLink(PromiseLinkType.PromisifiedPromise, from, to, traceId, rootId);

    // [edit-after-send]
    promisifyPromiseVirtualRef?.add(link, 'to');
  }

  /**
   * A promise ctor's executor callback's `resolve` or `reject` call.
   */
  resolve(inner, outer, rootId, promiseLinkType, traceId, asyncPromisifyPromiseId) {
    // const rootId = this.getCurrentVirtualRootContextId();
    const from = getPromiseId(inner);
    const to = getPromiseId(outer);
    // if (!from || !to) {
    //   this.logger.error(`resolve link failed: promise did not have an id, from=${from}, to=${to}, trace=${traceCollection.makeTraceInfo(traceId)}`);
    // }
    // else {
    return nestedPromiseCollection.addLink(promiseLinkType, from, to, traceId, rootId, asyncPromisifyPromiseId);
  }

  /**
   * NOTE: we add one link for each settled promise.
   */
  all(inner, outer, traceId) {
    // NOTE: `reject` does not settle nested promises!
    const rootId = this.getCurrentVirtualRootContextId();
    const from = inner.map(p => getPromiseId(p)).filter(Boolean);
    // const from = getPromiseId(inner);
    const to = getPromiseId(outer);
    // if (!from || !to) {
    //   this.logger.error(`resolve link failed: promise did not have an id, from=${from}, to=${to}, trace=${traceCollection.makeTraceInfo(traceId)}`);
    // }
    // else {
    return nestedPromiseCollection.addLink(PromiseLinkType.All, from, to, traceId, rootId);
  }

  race(inner, outer, traceId) {
    const rootId = this.getCurrentVirtualRootContextId();
    const from = getPromiseId(inner);
    const to = getPromiseId(outer);
    // if (!from || !to) {
    //   this.logger.error(`resolve link failed: promise did not have an id, from=${from}, to=${to}, trace=${traceCollection.makeTraceInfo(traceId)}`);
    // }
    // else {
    return nestedPromiseCollection.addLink(PromiseLinkType.Race, from, to, traceId, rootId);
  }

  any(inner, outer, traceId) {
    const rootId = this.getCurrentVirtualRootContextId();
    const from = getPromiseId(inner);
    const to = getPromiseId(outer);
    // if (!from || !to) {
    //   this.logger.error(`resolve link failed: promise did not have an id, from=${from}, to=${to}, trace=${traceCollection.makeTraceInfo(traceId)}`);
    // }
    // else {
    return nestedPromiseCollection.addLink(PromiseLinkType.Any, from, to, traceId, rootId);
  }

  /**
   * Async function returning given `promise`.
   * NOTE: Only called if returned value is thenable.
   */
  returnAsync(promise, traceId) {
    const rootId = this.getCurrentVirtualRootContextId();
    /**
     * NOTE: toPromiseId is just a placeholder, 
     *    since we don't necessarily know the `to` promiseId yet (if async function did not `await` yet).
     * -> is fixed up in `PromiseLinkCollection.postAdd*`.
     */
    const to = 0;
    return nestedPromiseCollection.addLink(PromiseLinkType.AsyncReturn, getPromiseId(promise), to, traceId, rootId);
  }

  // ###########################################################################
  // preCallback
  // ###########################################################################

  /**
   * Event: New callback (`postEventPromise`) has been scheduled.
   */
  preCallback(schedulerTraceId, isEventListener, promisifyPromiseVirtualRef) {
    const runId = this._runtime.getCurrentRunId();
    const preEventRootId = this.getCurrentVirtualRootContextId();
    const contextId = this._runtime.peekCurrentContextId();

    // store update
    const upd = asyncEventUpdateCollection.addPreCallbackUpdate({
      runId,
      rootId: preEventRootId,
      contextId: contextId,
      schedulerTraceId,
      isEventListener
    });

    // link to promise (if promisified)
    promisifyPromiseVirtualRef?.add(upd, 'promiseId');

    // const rootId = this.getCurrentVirtualRootContextId();
    // this.logger.debug(`[preCallback] #${rootId} ${getPromiseId(preEventPromise)} -> ${getPromiseId(postEventPromise)} (tid=${schedulerTraceId})`);
  }

  // ###########################################################################
  // postCallback
  // ###########################################################################

  /**
   * Event: Asynchronously scheduled callback is executed.
   * 
   * @param {CallbackRef} thenRef
   */
  postCallback(schedulerTraceId, runId, postEventRootId, contextId, promisifyPromiseVirtualRef) {
    // store update
    asyncEventUpdateCollection.addPostCallbackUpdate({
      runId,
      rootId: postEventRootId,
      promiseId: promisifyPromiseVirtualRef?.refId || 0,

      // NOTE: the last active root SHOULD also be the `context` of the callback
      contextId,
      schedulerTraceId
    });
  }




  // ###########################################################################
  // bookkeeping utilities
  // ###########################################################################

  updateLastAwaitByRealContext(realContextId, data) {
    const previousData = this.lastAwaitByRealContext.get(realContextId);
    data = {
      ...previousData,
      ...data
    };
    // if (!previousData) {
    //   this.logger.debug(`updateLastAwaitByRealContext (first await)`, realContextId, data);
    // }
    this.lastAwaitByRealContext.set(realContextId, data);
    return data;
  }

  // /**
  //  * Used for debugging purposes.
  //  */
  // debugGetAllRootIdsOfThread(threadId) {
  //   return Array.from(this.threadsByRoot.entries())
  //     .filter(([, t]) => t === threadId)
  //     .map(([r]) => r);
  // }

  // /**
  //  * Maintain `threadsByRoot` map.
  //  * Called by `addEdge`.
  //  * 
  //  * @param {number} runId 
  //  * @param {number} threadId 
  //  */
  // setRootThreadId(rootId, threadId, schedulerTraceId) {
  //   // const threadLastRun = Math.max(runId, this.lastRootContextByThread.get(threadId) || 0);
  //   // this.logger.debug(`[${threadId}] set runId=${runId}, threadLastRun=${threadLastRun}`);

  //   this.threadsByRoot.set(rootId, threadId);

  //   // TODO: remove all this
  //   // asyncNodeCollection.addAsyncNode(rootId, threadId, schedulerTraceId);
  //   // this.lastRootContextByThread.set(threadId, threadLastRun);
  // }

  // getRootThreadId(rootId) {
  //   return this.threadsByRoot.get(rootId);
  // }

  // hasEdgesFrom(fromRootId) {
  //   return !!this.outEdges[fromRootId];
  // }

  // hasChainFrom(fromRootId) {
  //   const edges = this.outEdges[fromRootId];
  //   const fromThreadId = this.getRootThreadId(fromRootId);
  //   return edges && some(edges.values(), (toRootId) => fromThreadId === this.getRootThreadId(toRootId)) || false;
  // }

  // hasEdgeFromTo(fromRootId, firstEventRootId) {
  //   return !!this.outEdges[fromRootId]?.get(firstEventRootId);
  // }

  // /**
  //  * @return The new thread id
  //  */
  // newThreadId() {
  //   // this.logger.debug("assign run new thread id", runId);
  //   ++this._maxThreadId;
  //   // eslint-disable-next-line no-console
  //   // this.logger.debug('[newThreadId]', this._maxThreadId);
  //   // console.trace('[newThreadId]', this._maxThreadId);
  //   return this._maxThreadId;
  // }

  /**
   * If given root was started by a recorded async event, threadId is already assigned.
   * If not, we assume a FORK, and assign a new threadId.
   * 
   * TODO: move to `postRun` or `postRoot`?
   */
  // getOrAssignRootThreadId(rootId) {
  //   let threadId = this.getRootThreadId(rootId);
  //   if (!threadId) {
  //     // NOTE: this can happen, if a root executed that was not connected to any previous asynchronous events
  //     //    (e.g. initial root, or caused by unrecorded asynchronous events)
  //     // this.logger.warn(`Tried to add edge from root ${fromRootId} but it did not have a threadId`);
  //     // return 0;
  //     this.setRootThreadId(rootId, threadId = this.newThreadId());
  //   }
  //   return threadId;
  // }

  // ###########################################################################
  // addEdge
  // ###########################################################################

  // addSyncEdge(fromRootId, firstEventRootId, edgeType) {
  //   // eslint-disable-next-line max-len
  //   // this.logger.debug(`[add${AsyncEdgeType.nameFromForce(edgeType)}Edge] ${fromRootId}->${firstEventRootId}`);
  //   this.addEdge(fromRootId, firstEventRootId, edgeType);
  // }

  // /**
  //  * Add an edge between `fromRootId` and `toRootId`
  //  * @param {number} fromRootId 
  //  * @param {number} toRootId 
  //  */
  // addEventEdge(fromRootId, firstEventRootId, fromThreadId, toThreadId, schedulerTraceId, isNested) {
  //   // const previousFromThreadId = this.getOrAssignRootThreadId(fromRootId);
  //   const previousToThreadId = this.getRootThreadId(firstEventRootId);

  //   const isFork = !toThreadId ||
  //     // check if this is CHAIN and fromRoot already has an out-going CHAIN
  //     // NOTE: this can happen, e.g. when the same promise's `then` was called multiple times.
  //     (fromThreadId === toThreadId && this.hasChainFrom(fromRootId));

  //   if (isFork) {
  //     // fork!
  //     toThreadId = this.newThreadId();
  //   }

  //   if (!previousToThreadId) {
  //     // toRootId was not assigned to any thread yet
  //     this.setRootThreadId(firstEventRootId, toThreadId, schedulerTraceId);
  //   }

  //   // add edge
  //   const edgeType = fromThreadId !== toThreadId ? AsyncEdgeType.Fork : AsyncEdgeType.Chain;
  //   if (!this.addEdge(fromRootId, firstEventRootId, edgeType)) {
  //     return 0;
  //   }

  //   // eslint-disable-next-line max-len
  //   // this.logger.debug(`[add${AsyncEdgeType.nameFromForce(edgeType)}] [${fromThreadId !== toThreadId ? `${fromThreadId}->` : ''}${toThreadId}] Roots: ${fromRootId}->${firstEventRootId} (tid=${schedulerTraceId}${isNested ? `, nested` : ''})`);

  //   return toThreadId;
  // }

  // addEdge(fromRootId, firstEventRootId, edgeType) {
  //   if (!fromRootId || !firstEventRootId) {
  //     this.logger.error(new Error(
  //       `Tried to add invalid ${AsyncEdgeType.nameFromForce(edgeType)} edge, from root ${fromRootId} to ${firstEventRootId}`
  //     ).stack); // (t = ${previousFromThreadId} => ${fromThreadId}) to ${toRootId} (t = ${previousToThreadId} => $
  //     return false;
  //   }
  //   if (this.hasEdgeFromTo(fromRootId, firstEventRootId)) {
  //     this.logger.error(new Error(
  //       `Tried to add ${AsyncEdgeType.nameFromForce(edgeType)} edge, but there already was one, from ${fromRootId} to ${firstEventRootId}`
  //     ).stack); // (t = ${previousFromThreadId} => ${fromThreadId}) to ${toRootId} (t = ${previousToThreadId} => ${toThreadId})`);
  //     return false;
  //   }

  //   if (!this.outEdges[fromRootId]) {
  //     this.outEdges[fromRootId] = new Map();
  //   }
  //   if (!this.inEdges[firstEventRootId]) {
  //     this.inEdges[firstEventRootId] = new Map();
  //   }
  //   this.outEdges[fromRootId].set(firstEventRootId, 1);
  //   this.inEdges[firstEventRootId].set(fromRootId, 1);

  //   // TODO: get rid of all of this
  //   // asyncEventCollection.addEdge(fromRootId, firstEventRootId, edgeType);
  //   return true;
  // }

  // /**
  //  * Get last run of the thread, by `threadLastRun` map
  //  * @param {number} threadId 
  //  * @return {number} The last run id of the thread
  //  */
  // getLastRootContextOfThread(threadId) {
  //   // this.logger.debug("get last run of thread", threadId, "returns", this.threadLastRun.get(threadId));
  //   return this.lastRootContextByThread.get(threadId);
  // }
}
