import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import { uHash } from "../../utils";

import Node from "../../nodes";

import { registerOperator } from "../../precedence";

import {
  getNameByLabel
} from "../../utils";

/**
 * @return {Node}
 */
export function parseOperator() {

  let node = null;

  let type = TT[this.parseLiteralHead()];

  if (this.peek(TT.FUNCTION)) {
    node = this.parseFunction();
    if (type === TT.PREFIX) {
      node.isPrefix = true;
    }
    else if (type === TT.POSTFIX) {
      node.isPostfix = true;
    }
    else {
      throw new Error(`Operator parse error`);
    }
    registerOperator(
      node.name,
      -1,
      "none",
      node.name,
      type
    );
  } else {
    node = this.parseOperatorDeclaration(type);
  }

  return (node);

}

/**
 * @return {Node}
 */
export function parseOperatorDeclaration(type) {

  let node = new Node.OperatorDeclaration();

  this.expect(TT.OPERATOR);

  node.name = type;
  node.operator = this.parseLiteralHead();

  this.expect(TT.LBRACE);
  node.body = this.parseBlock();
  this.expect(TT.RBRACE);

  let associativity = this.getOperatorAssociativity(node.body.body);
  let precedence = this.getOperatorPrecedence(node.body.body);

  if (node.operator) {
    registerOperator(
      node.operator,
      precedence,
      associativity,
      node.operator,
      node.name
    );
  } else {
    // Seems already registered
  }

  return (node);

}

/**
 * @return {Node}
 */
export function parsePrecedenceExpression() {

  let node = new Node.PrecedenceExpression();

  this.expect(TT.PRECEDENCE);

  node.level = this.parseLiteral();

  return (node);

}

/**
 * @return {Node}
 */
export function parseAssociativityExpression() {

  let node = new Node.AssociativityExpression();

  this.expect(TT.ASSOCIATIVITY);

  node.associativity = this.parseLiteral();

  return (node);

}

/**
 * @param {Node}
 * @return {String}
 */
export function getOperatorAssociativity(body) {

  for (let node of body) {
    if (node.kind === Type.AssociativityExpression) {
      return (node.associativity.raw);
    }
  };

  return ("none");

}

/**
 * @param {Node}
 * @return {Number}
 */
export function getOperatorPrecedence(body) {

  for (let node of body) {
    if (node.kind === Type.PrecedenceExpression) {
      return (Number(node.level.raw));
    }
  };

  return (-1);

}