import TraceType from '@dbux/common/src/types/constants/TraceType';
import { buildTraceDeleteME } from '../../instrumentation/builders/me';
import BasePlugin from './BasePlugin';

/** @typedef { import("../MemberExpression").default } MemberExpression */

/**
 * 
 */
export default class Delete extends BasePlugin {
  exit1() {
    // make sure, `ME` itself is NOT traced
    const { node } = this;
    const [meNode] = node.getChildNodes();
    meNode.handler = this;
  }

  exit() {
    const { node } = this;
    const { path, Traces } = node;

    const [meNode] = node.getChildNodes();
    const [objectNode] = meNode.getChildNodes();

    // make sure, `object` is traced
    objectNode.addDefaultTrace();

    const objectTid = objectNode.traceCfg?.tidIdentifier;
    if (!objectTid) {
      this.warn(`objectNode did not have traceCfg.tidIdentifier in ${objectNode}`);
    }

    const objectVar = Traces.generateDeclaredUidIdentifier('o');
    const propertyVar = Traces.generateDeclaredUidIdentifier('p');

    // add delete trace
    const traceData = {
      path,
      node,
      staticTraceData: {
        type: TraceType.WriteME
      },
      data: {
        objectTid,
        objectVar,
        propertyVar
      },
      meta: {
        build: buildTraceDeleteME
      }
    };

    Traces.addTrace(traceData);
  }
}