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
    let init = node.init ? node.init[index] : node.init;
    let symbol = getNameByLabel(node.symbol).toLowerCase() + " ";
    let name = key.value || key.init.value;
    if (key.resolvedType === Token.Tuple) {
      this.write(symbol);
      this.write(name);
      this.write("=");
      this.emitTuple(init instanceof Array ? init : node.init);
      index++;
      continue;
    }
    if (key.kind === Type.ParameterExpression) {
      this.emitMultipleVariable(key, init, symbol);
    } else {
      this.write(symbol);
      this.emitVariable(key, init);
    }
    index++;
  };

}

/**
 * @param {Node} node
 */
export function emitVariable(node, init) {

  if (node.kind === Type.Parameter) {
    this.write(node.init.value);
  } else {
    this.write(node.name || node.value);
  }
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

  this.returnTuple = node.type instanceof Array;
  this.emitBlock(node.body);
  this.returnTuple = false;

  this.popScope();

}

/**
 * @param {Node} node
 */
export function emitReturn(node) {

  this.write("return ");

  if (this.returnTuple && node.argument instanceof Array) {
    this.emitTuple(node.argument);
  } else {
    this.emitStatement(node.argument);
  }

}

/**
 * @param {Array} node
 */
export function emitTuple(args) {

  let ii = 0;
  let length = args.length;

  this.write("{");
  for (;ii < length; ++ii) {
    this.write(`${ii}:`);
    this.emitStatement(args[ii]);
    if (ii + 1 < length) this.write(",");
  };
  this.write("}\n");

}