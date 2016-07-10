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
export function emitBinary(node) {

  if (node.kind === Type.BinaryExpression) {
    let op = getLabelByNumber(node.operator);
    /** Custom operator call */
    if (op in this.operators) {
      this.emitCustomOperator(node, op);
    /** Default binary expr */
    } else {
      if (node.isParenthised) this.write("(");
      this.emitStatement(node.left);
      op = op === "==" ? "===" : op === "!=" ? "!==" : op;
      this.write(op);
      this.emitStatement(node.right);
      if (node.isParenthised) this.write(")");
    }
  }
  else if (node.kind === Type.Literal) {
    this.emitLiteral(node);
  }

}

/**
 * @param {Node} node
 */
export function emitTernary(node) {

  this.emitStatement(node.condition);
  this.write("?");
  this.emitStatement(node.consequent);
  this.write(":");
  this.emitStatement(node.alternate);

}

/**
 * @param {Node} node
 */
export function emitUnary(node) {

  this.emitOperator(node.operator);
  this.emitStatement(node.argument);

}

/**
 * @param {String} operator
 */
export function emitOperator(operator) {

  let op = getLabelByNumber(operator);

  this.write(op);

}

/**
 * @param {Node} node
 */
export function emitMember(node) {

  if (node.object.kind === Type.Literal) {
    this.emitLiteral(node.object);
  } else {
    this.emitStatement(node.object);
  }

  if (node.isComputed) {
    this.write("[");
  } else {
    this.write(".");
  }

  if (node.property.kind === Type.Literal) {
    this.emitLiteral(node.property);
  } else {
    this.emitStatement(node.property);
  }

  if (node.isComputed) {
    this.write("]");
  }

}

/**
 * @param {Node} node
 */
export function emitCall(node) {

  this.emitStatement(node.callee);

  this.write("(");
  this.insideCall = true;
  this.emitArguments(node.arguments);
  this.insideCall = false;
  this.write(")");

}