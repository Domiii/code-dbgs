import AsyncEvent from '@dbux/common/src/types/AsyncEvent';
import Collection from '../Collection';

/**
 * @extends {Collection<AsyncEvent>}
 */
export default class AsyncEventCollection extends Collection {
  constructor(dp) {
    super('asyncEvents', dp, { hasNoRuntime: true });

    // NOTE: this collection is not populated by `runtime`
    this._all.push(null);
  }

  addEdge(fromRootContextId, toRootContextId, edgeType, syncPromiseIds) {
    const entry = new AsyncEvent();

    entry.asyncEventId = entry._id = this._all.length;
    entry.fromRootContextId = fromRootContextId;
    entry.toRootContextId = toRootContextId;
    entry.edgeType = edgeType;
    entry.syncPromiseIds = syncPromiseIds;

    this.addEntryPostAdd(entry);

    return entry;
  }
}