import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import Node from "../../nodes";

import {
  getNameByLabel,
  getLabelByNumber
} from "../../utils";

/**
 * @param {Node} node
 */
export function compileDeclaration(node) {

  switch (node.kind) {
    case Type.VariableDeclaration:
      this.compileVariableDeclaration(node);
    break;
    case Type.FunctionDeclaration:
      this.compileFunctionDeclaration(node);
    break;
  };

}

/**
 * @param {Node} node
 */
export function compileVariableDeclaration(node) {

  let index = 0;

  let init = null;
  let label = null;

  // Tuple
  if (
    node.declarations.length <= 1 &&
    node.init.length > node.declarations.length
  ) {
    this.scope.register(node, node.declarations[0].value);
    return void 0;
  }

  for (let key of node.declarations) {
    label = key.kind === Type.Parameter ? key.init : key;
    init = node.init ? node.init[index] : null;
    this.scope.register(key);
    index++;
    if (key.kind !== Type.Parameter && init) {
      label.resolvedType = this.inferenceExpression(init);
    } else {
      label.resolvedType = key.argument.type;
    }
  };

}

/**
 * @param {Node} node
 */
export function compileFunctionDeclaration(node) {

  this.scope.register(node);

  this.pushScope(node.body);

  this.compileArguments(node.arguments);

  this.compileBlock(node.body);

  this.popScope();

}

/**
 * @param {Node} node
 */
export function compileArguments(args) {

  for (let key in args) {
    this.scope.register(args[key]);
  };

}