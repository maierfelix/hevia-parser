import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import Node from "../../nodes";

import {
  getNameByLabel
} from "../../utils";

/**
 * @return {Node}
 */
export function parseExpressionStatement() {

  switch (this.current.name) {
    case TT.LPAREN:
    case TT.SELF:
    case TT.BIT_AND:
    case TT.UL:
    case TT.TRUE:
    case TT.FALSE:
    case Token.Identifier:
    case Token.NullLiteral:
    case Token.StringLiteral:
    case Token.NumericLiteral:
    case Token.BooleanLiteral:
      return this.parseAtomicExpression();
    break;
    /** Operator things */
    case TT.ASSOCIATIVITY:
      return this.parseAssociativityExpression();
    break;
    case TT.PRECEDENCE:
      return this.parsePrecedenceExpression();
    break;
  };

  return (null);

}

/**
  [x] parenthesed bin expr
  [x] parameter
  [x] tuple
  @return {Node}
 */
export function parseParenthese() {

  let node = null;
  let base = null;

  /** Empty parenthese */
  this.expect(TT.LPAREN);
  if (this.eat(TT.RPAREN)) return (null);

  base = this.parseExpressionStatement();

  if (this.eat(TT.COMMA)) {
    node = this.parseComplexParenthese();
    node.unshift(base);
  } else {
    node = base;
  }

  this.expect(TT.RPAREN);

  return (node);

}

/**
 * @return {Array}
 */
export function parseComplexParenthese() {

  let args = [];

  while (true) {
    args.push(this.parseExpressionStatement());
    if (!this.eat(TT.COMMA)) break;
  };

  return (args);

}

/**
 * @return {Array}
 */
export function parseArguments() {

  let args = this.parseExpressionStatement();

  /** Handle empty arguments */
  if (args === null) {
    args = [];
  }
  else if (!args.length) {
    args = [args];
  }

  return (args);

}