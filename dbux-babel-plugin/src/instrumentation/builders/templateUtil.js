import * as t from '@babel/types';
import template from '@babel/template';
import NestedError from '@dbux/common/src/NestedError';
import { addMoreTraceCallArgs } from './buildUtil';


/**
 * @throws
 */
function buildFail(varFn, err) {
  throw new NestedError(`Build function "${varFn.name}" failed.`, err);
}

export function buildTraceCall(templateString, varFn) {
  const templ = template(templateString);
  return (...args) => {
    try {
      const vars = varFn(...args);
      let newNode = templ(vars);
      const cfg = args[args.length - 1];
      const shouldBeStatement = cfg?.meta?.isStatement;
      const isStatement = newNode.type === 'ExpressionStatement';
      if (shouldBeStatement !== isStatement) {
        if (!shouldBeStatement) {
          // we wanted an expression, not a statement
          newNode = newNode.expression;
        }
        // else {  // not necessary
        //   newNode = t.expressionStatement(newNode);
        // }
      }

      addMoreTraceCallArgs(newNode.arguments, cfg);
      return newNode;
    }
    catch (err) {
      buildFail(varFn, err);
    }
  };
}

export function bindExpressionTemplate(templateString, varFn) {
  const templ = template(templateString);
  return (...args) => {
    try {
      const vars = varFn(...args);
      let newNode = templ(vars);
      if (newNode.type === 'ExpressionStatement') {
        // we wanted an expression, not a statement
        newNode = newNode.expression;
      }
      return newNode;
    }
    catch (err) {
      buildFail(varFn, err);
    }
  };
}

export function bindTemplate(templateString, varFn) {
  const templ = template(templateString);
  return (...args) => {
    try {
      const vars = varFn(...args);
      let newNode = templ(vars);
      return newNode;
    }
    catch (err) {
      buildFail(varFn, err);
    }
  };
}
