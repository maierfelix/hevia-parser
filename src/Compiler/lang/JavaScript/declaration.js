import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../../labels";

import Node from "../../../nodes";

import {
  getNameByLabel,
  getLabelByNumber
} from "../../../utils";

/**
 * @param {Node} node
 */
export function emitDeclaration(node) {

  switch (node.kind) {
    case Type.FunctionDeclaration:
      this.emitFunction(node);
    break;
    case Type.ExtensionDeclaration:
      this.emitExtension(node);
    break;
    case Type.VariableDeclaration:
      this.emitVariableDeclaration(node);
    break;
  }

}

/**
 * @param {Node} node
 */
export function emitVariableDeclaration(node) {

  let index = 0;
  for (let key of node.declarations) {
    let init = node.init[index] || node.init;
    let symbol = getNameByLabel(node.symbol).toLowerCase() + " ";
    if (key.kind === Type.ParameterExpression) {
      this.emitMultipleVariable(key, init, symbol);
    } else {
      this.write(symbol);
      if (key.kind === Type.Parameter) {
        this.emitStatement(key);
        this.write("=");
        this.emitStatement(init);
        this.write(";");
      } else {
        this.emitVariable(key, init);
      }
    }
    index++;
  };

}

/**
 * @param {Node} node
 */
export function emitVariable(node, init) {

  this.write(node.name || node.value);
  this.write("=");

  this.emitStatement(init);

  this.write(";");

}

export function emitMultipleVariable(node, init, symbol) {

  let index = 0;
  for (let key of node.arguments) {
    this.write(symbol);
    this.emitVariable(key.init, init.arguments[index]);
    index++;
  };

}

/**
 * @param {Node} node
 */
export function emitFunction(node) {

  this.write("function ");

  this.write(node.name);

  this.write("(");
  this.emitArguments(node.arguments);
  this.write(")");

  this.emitBlock(node.body);

  this.popScope();

}

/**
 * @param {Node} node
 */
export function emitReturn(node) {

  this.write("return ");

  this.emitStatement(node.argument);

}