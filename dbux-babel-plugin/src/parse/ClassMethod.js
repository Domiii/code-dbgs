// import { instrumentMethodKey } from '../instrumentation/builders/classes';
import BaseNode from './BaseNode';
import FunctionPlugin from './plugins/Function';

/**
 * 
 */
export default class ClassMethod extends BaseNode {
  static children = [
    'key',
    'params',
    'body'
  ];
  static plugins = [
    'Function',
    'StaticContext'
  ];

  get name() {
    return this.path.get('key').toString();
  }

  get isPublic() {
    return true;
  }

  addTrace() {
    const { path, Traces } = this;
    const [keyPath] = this.getChildPaths();
    const [keyNode] = this.getChildNodes();

    const { computed } = path.node;

    const contextNode = this.getExistingParent().peekContextNode();

    let propertyVar;
    if (computed) {
      // only assign `propertyVar` if computed
      // NOTE: this can work because private properties do not support dynamic access.
      // see: https://github.com/tc39/proposal-private-fields/issues/94
      keyNode?.addDefaultTrace();
      propertyVar = contextNode.Traces.generateDeclaredUidIdentifier('m');
    }

    /**
     * @type {FunctionPlugin}
     */
    const Function = this.getPlugin('Function');
    const traceCfg = Traces.addTrace({
      path,
      node: this,
      scope: contextNode.path.scope, // prevent adding `tid` variable to own body
      staticTraceData: Function.createStaticTraceData(keyPath),
      data: {
        propertyVar
      },
      meta: { 
        instrument: null
      }
    });
    
    Function.setFunctionTraceCfg(traceCfg);

    return traceCfg;
  }
}