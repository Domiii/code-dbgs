import template from '@babel/template';
// import * as t from '@babel/types';


export function buildTraceCall(templateString, varFn) {
  const templ = template(templateString);
  return (...args) => {
    const vars = varFn(...args);
    const cfg = args[args.length - 1];
    let newNode = templ(vars);
    if (!cfg?.meta?.keepStatement && newNode.type === 'ExpressionStatement') {
      // we wanted an expression, not a statement
      newNode = newNode.expression;
    }
    const moreTraceCallArgs = cfg?.meta?.moreTraceCallArgs;
    if (moreTraceCallArgs) {
      newNode.arguments.push(...moreTraceCallArgs);
    }
    return newNode;
  };
}

export function bindExpressionTemplate(templateString, varFn) {
  const templ = template(templateString);
  return (...args) => {
    const vars = varFn(...args);
    let newNode = templ(vars);
    if (newNode.type === 'ExpressionStatement') {
      // we wanted an expression, not a statement
      newNode = newNode.expression;
    }
    return newNode;
  };
}

export function bindTemplate(templateString, fn) {
  const templ = template(templateString);
  return (...args) => {
    const vars = fn(...args);
    let newNode = templ(vars);
    return newNode;
  };
}