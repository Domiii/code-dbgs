/** @typedef { import("./DDGTimelineNodes").RefSnapshotTimelineNode } RefSnapshotTimelineNode */
/** @typedef { Map.<number, number> } SnapshotMap */

export default class DDGNodeSummary {
  timelineId;

  /**
   * @type {SnapshotMap}
   */
  snapshotsByRefId;

  /**
   * Set of `timelineId`s of {@link RefSnapshotTimelineNode} 
   * @type {Array.<number>}
   */
  summaryRoots;

  constructor(timelineId, snapshotsByRefId, summaryRoots) {
    this.timelineId = timelineId;
    this.snapshotsByRefId = snapshotsByRefId;
    this.summaryRoots = summaryRoots;
  }
}