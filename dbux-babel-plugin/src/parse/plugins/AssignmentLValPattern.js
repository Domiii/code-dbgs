import * as t from '@babel/types';
import TraceType from '@dbux/common/src/types/constants/TraceType';
import { buildTraceExpressionNoInput } from '../../instrumentation/builders/misc';
import { PatternBuildConfig } from '../helpers/patterns';
import BasePlugin from './BasePlugin';



/**
 * Takes care of all patterns/pattern-likes.
 * 
 * @see https://babeljs.io/docs/en/babel-types#patternlike
 * @see https://tc39.es/ecma262/#prod-BindingPattern
 */
export default class AssignmentLValPattern extends BasePlugin {
  /**
   * @type {PatternBuildConfig}
   */
  patternCfg;

  /**
   * 
   */
  sequence;

  exit() {
    const { node } = this;
    const [lvalNode, rvalNode] = node.getChildNodes();
    const patternCfg = this.patternCfg = new PatternBuildConfig(this);

    // add rval trace
    const rvalTrace = rvalNode.addDefaultTrace();

    /**
     * PatternTree DSF traversal
     */
    lvalNode.addPatternNode(patternCfg, null);

    // add final trace
    node.Traces.addTrace({
      node,
      path: node.path,
      staticTraceData: {
        type: TraceType.PatternAssignment
      },
      meta: {
        build: buildTraceExpressionNoInput,
        traceCall: 'tracePattern',
        /**
         * Replace rval
         */
        targetPath: rvalNode.path,
        // targetNode() { return rvalNode.path.node; },

        moreTraceCallArgs() {
          // add `treeNodes` array
          const rvalTid = rvalTrace?.tidIdentifier;
          const treeNodes = t.arrayExpression(
            patternCfg.lvalTreeNodeBuilders.map(build => build())
          );
          return [
            rvalTid,
            treeNodes
          ];
        }
      }
    });
  }

  instrument1() {
    const { preInitNodeBuilders } = this.patternCfg;
    if (this.patternCfg.preInitNodeBuilders.length) {
      // Nested ME lvals need extra work done before the lval.
      // → Replace assignment with sequence → add assignment to end of sequence → replace self with sequence
      const sequenceNodes = preInitNodeBuilders.flatMap(fn => fn());
      sequenceNodes.push(this.node.path.node);
      this.sequence = t.sequenceExpression(sequenceNodes);
    }
  }

  /**
   * Build and insert preInit nodes before our actual nodes.
   * 
   * future-work: ensure correct stepping order:
   * 1. pre-init for lval -> 1b. (nothing else to do in lval) -> 2. rval -> 3. writes
   */
  instrument() {
    if (this.sequence) {
      this.node.path.replaceWith(this.sequence);
    }
  }
}
