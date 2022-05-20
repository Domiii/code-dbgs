import TraceType from '@dbux/common/src/types/constants/TraceType';
import BasePlugin from './BasePlugin';
import { LValHolderNode } from '../_types';
import { buildTraceWriteME } from '../../instrumentation/builders/me';
import { ZeroNode } from '../../instrumentation/builders/buildUtil';
import MemberExpression from '../MemberExpression';
import SyntaxType from '@dbux/common/src/types/constants/SyntaxType';

/**
 * @example
 * 
 * Two situations: "default" (d) and "simple object" (s)
 * 
 * Case d-1:
 * `a.b.c.prop = f(x)` ->
 * `twME(o = tme(a.b.c..., objectTid), p = 'prop', o[p] = te(f(x)..., rhsTid), tid, objectTid, rhsTid)`
 *
 * Case d-3:
 * `a.b.c[prop()] = f(x)` ->
 * `twME(tme(a.b.c..., objectTid), te(prop()...), te(f(x), rhsTid), tid, objectTid, rhsTid)`
 *
 * TODO: "simple object" NYI
 * Case s-1: 
 * `o.prop = f(x)` ->
 * `twME(te(o..., objectTid), p = 'prop', o[p] = te(f(x)..., rhsTid), tid, objectTid, rhsTid)`
 *
 * Case s-2: `super`
 * TODO: NYI! - Cannot pass `super` as individual argument; must trace `Object.getPrototypeOf(this.constructor.prototype)` for `super`.
 * `super.prop = f(x)` ->
 * `twME(te(TODO..., objectTid), p = 'prop', super[p] = te(f(x)..., rhsTid), tid, objectTid, rhsTid)`
 */
export default class AssignmentLValME extends BasePlugin {
  /**
   * @type {LValHolderNode}
   */
  node;

  /**
   * @type {MemberExpression}
   */
  get meNode() {
    const [meNode] = this.node.getChildNodes();
    return meNode;
  }

  exit1() {
    const { meNode } = this;

    meNode.handler = this;
  }

  exit() {
    this.wrapLVal();
  }

  wrapLVal() {
    if (this.meNode.shouldIgnoreThisLVal()) {
      return;
    }

    const { node } = this;
    const { Traces } = node;
    const [, valuePath] = node.getChildPaths();

    const data = this.meNode.makeMETraceData();

    // add actual WriteME trace
    const traceData = {
      staticTraceData: {
        type: TraceType.WriteME,
        syntax: SyntaxType.AssignmentLValME,
        dataNode: {
          isNew: node.isNewValue?.() || false
        }
      },
      data,
      meta: {
        // instrument: Traces.instrumentTraceWrite
        build: buildTraceWriteME
      }
    };

    node.decorateWriteTraceData(traceData);

    Traces.addTraceWithInputs(traceData, [valuePath]);
  }
}