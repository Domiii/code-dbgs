import DataNodeType from '@dbux/common/src/types/constants/DataNodeType';
import SpecialDynamicTraceType from '@dbux/common/src/types/constants/SpecialDynamicTraceType';
import traceCollection from '../data/traceCollection';
import dataNodeCollection from '../data/dataNodeCollection';
import { getOrCreateRealArgumentDataNodeIds, peekBCEMatchCallee } from '../data/dataUtil';
import valueCollection from '../data/valueCollection';
import { monkeyPatchFunctionOverride, monkeyPatchHolderOverrideDefault, monkeyPatchMethod, monkeyPatchMethodOverrideDefault } from '../util/monkeyPatchUtil';
import { addPurpose } from './builtin-util';
import TracePurpose from '@dbux/common/src/types/constants/TracePurpose';


// ###########################################################################
// utility
// ###########################################################################

function getNodeIdFromRef(ref) {
  const { nodeId } = ref;
  return nodeId;
}

function wrapIndex(i, arr) {
  if (i >= 0) {
    return i;
  }
  else {
    return arr.length + i;
  }
}

const _isNaN = globalThis.isNaN;

function isNaN(x) {
  return x === undefined || _isNaN(x);
}

export default function patchArray() {
  // ###########################################################################
  // push
  // ###########################################################################

  monkeyPatchMethod(Array, 'push',
    (arr, args, originalFunction, patchedFunction) => {
      const ref = valueCollection.getRefByValue(arr);
      // TODO: get real args → see `getCallArgDataNodes`
      const bceTrace = ref && peekBCEMatchCallee(patchedFunction);
      if (!bceTrace?.data?.argTids) {
        return originalFunction.apply(arr, args);
      }

      const {
        traceId: callId,
        data: {
          argTids,
          spreadLengths
        }
      } = bceTrace;

      const inputNodeIds = getOrCreateRealArgumentDataNodeIds(bceTrace, args);

      const arrNodeId = getNodeIdFromRef(ref);

      let idx = arr.length;
      for (let i = 0; i < argTids.length; ++i) {
        // const argTid = argTids[i];
        // const targetTid = argTid || callId;
        const targetTid = callId;
        const spreadLen = spreadLengths[i];

        if (!spreadLen) {
          // default push
          const varAccess = {
            objectNodeId: arrNodeId,
            prop: idx
          };
          // console.debug(`[Array.push] #${traceId} ref ${ref.refId}, node ${nodeId}, arrNodeId ${arrNodeId}`);
          const inputs = [inputNodeIds[i]];
          dataNodeCollection.createDataNode(args[idx], targetTid, DataNodeType.Write, varAccess, inputs);
          idx++;
        }
        else {
          // spread push
          // Add one `DataNode` per spread argument
          for (let j = 0; j < spreadLen; j++) {
            const varAccess = {
              objectNodeId: inputNodeIds[i],
              prop: j
            };
            const readNode = dataNodeCollection.createDataNode(args[idx], targetTid, DataNodeType.Read, varAccess);

            const varAccessWrite = {
              objectNodeId: arrNodeId,
              prop: idx
            };
            dataNodeCollection.createWriteNodeFromReadNode(targetTid, readNode, varAccessWrite);
            idx++;
          }
        }
      }

      // [edit-after-send]
      bceTrace.data = bceTrace.data || {};
      bceTrace.data.monkey = {
        wireInputs: true
      };

      return originalFunction.apply(arr, args);
    }
  );

  // ###########################################################################
  // shift
  // ###########################################################################

  monkeyPatchMethod(Array, 'shift',
    (arr, args, originalFunction, patchedFunction) => {
      const ref = valueCollection.getRefByValue(arr);
      const bceTrace = ref && peekBCEMatchCallee(patchedFunction);
      if (!bceTrace) {
        return originalFunction.apply(arr, args);
      }

      const { traceId: callId } = bceTrace;
      const arrNodeId = getNodeIdFromRef(ref);

      // delete first
      const shiftVarAccess = {
        objectNodeId: arrNodeId,
        prop: 0
      };
      dataNodeCollection.createBCEOwnDataNode(undefined, callId, DataNodeType.Delete, shiftVarAccess);

      // move up all other elements
      for (let i = 1; i < arr.length; ++i) {
        const varAccessRead = {
          objectNodeId: arrNodeId,
          prop: i
        };
        const readNode = dataNodeCollection.createDataNode(arr[i], callId, DataNodeType.Read, varAccessRead);

        const varAccessWrite = {
          objectNodeId: arrNodeId,
          prop: i - 1
        };
        dataNodeCollection.createWriteNodeFromReadNode(callId, readNode, varAccessWrite);
      }

      // [edit-after-send]
      bceTrace.data = bceTrace.data || {};
      bceTrace.data.monkey = {
        wireInputs: true
      };

      return originalFunction.apply(arr, args);
    }
  );


  // ###########################################################################
  // slice
  // ###########################################################################

  monkeyPatchMethod(Array, 'slice',
    (arr, args, originalFunction, patchedFunction) => {
      let [start, end] = args;
      const ref = valueCollection.getRefByValue(arr);
      const bceTrace = ref && peekBCEMatchCallee(patchedFunction);
      const newArray = originalFunction.apply(arr, args);
      if (!bceTrace) {
        return newArray;
      }

      const { traceId: callId } = bceTrace;
      const arrNodeId = getNodeIdFromRef(ref);

      // let BCE hold DataNode of newArray
      // DataNodeType.Create
      const newArrayNode = dataNodeCollection.createBCEOwnDataNode(newArray, callId, DataNodeType.Compute);

      // console.log(`SLICE ${start}:${end} ${!isNaN(start)}`);
      // console.log(`SLICE BCE-owned DataNode #${bceTrace.nodeId} - ${JSON.stringify(bceTrace)} (${JSON.stringify(newArrayNode)})`);

      start = !isNaN(start) ? wrapIndex(start, arr) : 0;
      end = !isNaN(end) ? wrapIndex(end, arr) : arr.length;
      

      // record all DataNodes of copy operation
      for (let i = start; i < end; ++i) {
        const varAccessRead = {
          objectNodeId: arrNodeId,
          prop: i
        };

        const readNode = dataNodeCollection.createDataNode(arr[i], callId, DataNodeType.Read, varAccessRead);

        const varAccessWrite = {
          objectNodeId: newArrayNode.nodeId,
          prop: i - start
        };
        dataNodeCollection.createWriteNodeFromReadNode(callId, readNode, varAccessWrite);
      }


      addPurpose(bceTrace, {
        type: TracePurpose.CalleeInput
      });

      return newArray;
    }
  );

  /** ###########################################################################
   * built-in HOFs
   * ##########################################################################*/

  /**
   * These HOFs are called with a callback function, which will be called
   * once per array entry.
   */
  [
    "forEach",
    "filter",
    "map",
    "every",
    "some"
  ].forEach((m) => {
    monkeyPatchMethod(Array, m,
      (arr, args, originalFunction, patchedFunction) => {
        // let [cb] = args;
        const ref = valueCollection.getRefByValue(arr);
        const bceTrace = ref && peekBCEMatchCallee(patchedFunction);
        if (bceTrace) {
          const { traceId: callId } = bceTrace;

          // [edit-after-send]
          bceTrace.data = bceTrace.data || {};
          bceTrace.data.specialDynamicType = SpecialDynamicTraceType.ArrayHofCall;

          const arrNodeId = getNodeIdFromRef(ref);

          // record all DataNodes of copy operation
          for (let i = 0; i < arr.length; ++i) {
            const varAccessRead = {
              objectNodeId: arrNodeId,
              prop: i
            };

            // add new DataNodes to BCE
            /* const readNode = */
            dataNodeCollection.createDataNode(arr[i], callId, DataNodeType.Read, varAccessRead);
          }
        }
        const result = originalFunction.apply(arr, args);
        return result;
      }
    );
  });

  [
    "reduce",
    "reduceRight"
  ].forEach((m) => {
    // TODO
    monkeyPatchMethodOverrideDefault(Array, m);
  });


  /** ###########################################################################
   * other (make non-patchable for now)
   * ###########################################################################*/

  // var ign = new Set(['constructor', 'at']);
  // copy(Object.getOwnPropertyNames(Array.prototype).filter(f => Array.prototype[f] instanceof Function && 
  //  !ign.has(f)))
  [
    "concat",
    "copyWithin",
    "fill",
    "find",
    "findIndex",
    "lastIndexOf",
    "pop",
    "reverse",
    "unshift",
    "sort",
    "splice",
    "includes",
    "indexOf",
    "join",
    "keys",
    "entries",
    "values",
    "flat",
    "flatMap",
    "toLocaleString",
    "toString"
  ].forEach(m => monkeyPatchMethodOverrideDefault(Array, m));
}

[
  'isArray',
].forEach(m => monkeyPatchHolderOverrideDefault(Array, m));
