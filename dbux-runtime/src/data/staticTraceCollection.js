import Collection from './Collection';

/**
 * Keeps track of `StaticTrace` objects that contain static code information
 */
class StaticTraceCollection extends Collection {
  /**
   * @type {[]}
   */
  _staticTracesByProgram = [null];

  constructor() {
    super('staticTraces');
  }

  addEntries(programId, list) {
    // store static traces
    this._staticTracesByProgram[programId] = list;

    // console.warn(`staticTraceCollection.addEntries for #${programId} (${list.length})`);

    for (let i = 0; i < list.length; ++i) {
      const entry = list[i];

      // eslint-disable-next-line no-console
      console.assert(entry._traceId === i + 1);

      // global id over all programs
      entry.staticTraceId = this._all.length;
      // delete entry._traceId;
      
      this.push(entry);
    }

    // patch up linkage ids, then send out
    for (let i2 = 0; i2 < list.length; ++i2) {
      const other = list[i2];
      // if (other._callId) {
      //   const calleeTrace = this.getStaticTrace(programId, other._callId);
      //   other.callId = calleeTrace.staticTraceId;
      //   delete other._callId;
      // }
      // if (other._resultCallId) {
      //   const calleeTrace = this.getStaticTrace(programId, other._resultCallId);
      //   other.resultCallId = calleeTrace.staticTraceId;
      //   delete other._resultCallId;
      // }
      if (other.controlId) {
        other.controlId = this.getStaticTrace(programId, other.controlId).staticTraceId;
      }
    }

    // -> send out
    this._sendAll(list);
  }

  getStaticTraces(programId) {
    return this._staticTracesByProgram[programId];
  }

  getStaticTrace(programId, inProgramStaticTraceId) {
    const staticTraces = this.getStaticTraces(programId);
    if (!staticTraces) {
      this.logger.error("Invalid programId has no registered static traces:", programId);
      return null;
    }
    return staticTraces[inProgramStaticTraceId - 1];  // ids start at 1, array starts at 0
  }

  getStaticTraceId(programId, inProgramStaticTraceId) {
    const staticTrace = this.getStaticTrace(programId, inProgramStaticTraceId);
    if (!staticTrace) {
      debugger;
      // eslint-disable-next-line max-len
      throw new Error(`Could not lookup staticTrace - programId=${programId}, inProgramStaticTraceId=${inProgramStaticTraceId}}`);
    }
    return staticTrace.staticTraceId;
  }
}

const staticTraceCollection = new StaticTraceCollection();
export default staticTraceCollection;