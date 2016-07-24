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
      // Turn into explicit comparison op
      op = op === "==" ? "===" : op === "!=" ? "!==" : op;
      if (node.isNumericMember) {
        this.write("[");
        this.emitStatement(node.left);
        this.write("]");
      } else {
        if (node.isParenthised) this.write("(");
        this.emitStatement(node.left);
      }
      this.write(op);
      this.emitStatement(node.right);
      if (!node.isNumericMember) {
        if (node.isParenthised) this.write(")");
      }
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

  let isComputed = node.isComputed;

  this.emitStatement(node.object);

  // Period followed by number is invalid in js,
  // but write [] instead of . is valid
  if (node.property.type === Token.NumericLiteral) {
    isComputed = true;
  }

  if (
    node.property.kind === Type.BinaryExpression &&
    node.property.left.type === Token.NumericLiteral
  ) {
    // Node has a numeric member, example: a.0
    node.property.isNumericMember = true;
  } else {
    if (isComputed) {
      this.write("[");
    } else {
      this.write(".");
    }
  }

  this.emitStatement(node.property);

  if (isComputed) {
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