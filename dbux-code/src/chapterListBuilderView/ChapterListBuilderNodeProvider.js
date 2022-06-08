import BaseTreeViewNodeProvider from '../codeUtil/treeView/BaseTreeViewNodeProvider';
import ToolRootNode from './ToolNodes';
import ChapterListNode from './ChapterListNode';

/** @typedef {import('./ChapterListBuilderViewController').default} ChapterListBuilderViewController */

export default class ChapterListBuilderNodeProvider extends BaseTreeViewNodeProvider {
  /**
   * 
   * @param {ChapterListBuilderViewController} treeViewController 
   */
  constructor(treeViewController) {
    super('dbuxChapterListBuilderView');
    this.controller = treeViewController;
  }

  get manager() {
    return this.controller.manager;
  }

  buildRoots() {
    const roots = [];

    roots.push(this.buildNode(ToolRootNode));

    if (this.controller.chapters) {
      roots.push(this.buildNode(ChapterListNode, this.controller.chapters, null));
    }

    return roots;
  }
}
