import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import { uHash } from "../../utils";

import Node from "../../nodes";

import { registerOperator } from "../../precedence";

/**
 * @return {Node}
 */
export function parseOperatorDeclaration() {

  let node = new Node.OperatorDeclaration();

  node.name = this.current.name;

  this.next();
  this.expect(TT.OPERATOR);

  node.operator = this.parseLiteral();

  this.expect(TT.LBRACE);
  node.body = this.parseBlock();
  this.expect(TT.RBRACE);

  let associativity = this.getOperatorAssociativity(node.body.body);
  let precedence = this.getOperatorPrecedence(node.body.body);

  let symbol = (
    node.name === TT.INFIX ? "IFX" :
    node.name === TT.PREFIX ? "PEX" :
    node.name === TT.POSTFIX ? "POX" : ""
  ) + `::${node.operator.raw}`;

  registerOperator(node.operator.raw, precedence, associativity, symbol);

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