import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import Node from "../../nodes";

import { Precedence } from "../../precedence";

import {
  getNameByLabel
} from "../../utils";

/**
  [x] parenthesed bin expr
  [x] parameter
  [x] tuple
  @return {Node}
 */
export function parseParenthese(left, right) {

  let node = null;
  let base = null;

  /** Empty parenthese */
  this.expect(left);
  if (this.eat(right)) return (null);

  base = this.parseExpressionStatement();

  if (this.eat(TT.COMMA)) {
    node = this.parseCommaSeperatedValues();
    node.unshift(base);
  } else {
    node = base;
  }

  this.expect(right);

  return (node);

}

/**
 * @return {Array}
 */
export function parseCommaSeperatedValues() {

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
export function parseArguments(args) {

  let argz = args === void 0 ? this.parseExpressionStatement() : args;

  /** Handle empty arguments */
  if (argz === null) {
    argz = [];
  }
  else if (!argz.length) {
    argz = [argz];
  }

  return (argz);

}