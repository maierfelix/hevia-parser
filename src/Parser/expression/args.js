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
  [x] parenthesed bin expr
  [x] parameter
  [x] argument
  [x] tuple
  @return {Node}
 */
export function parseParenthese(left, right) {

  let node = null;
  let base = null;

  // Empty parenthese
  this.expect(left);
  if (this.eat(right)) return (null);

  node = this.parseCommaSeperatedValues();

  this.expect(right);

  return (node);

}

/**
 * @return {Array}
 */
export function parseCommaSeperatedValues() {

  let args = [];
  let stmt = null;

  while (true) {
    stmt = this.parseStatement();
    // Labeled literal
    if (this.peek(Token.Identifier)) {
      if (!this.isOperator(TT[this.current.value])) {
        let tmp = this.parseLiteral();
        tmp.label = stmt;
        stmt = tmp;
      }
    }
    args.push(stmt);
    if (!this.eat(TT.COMMA)) break;
  };

  return (args);

}

/**
 * @return {Array}
 */
export function parseArguments(args) {

  let argz = args === void 0 ? this.parseParenthese(TT.LPAREN, TT.RPAREN) : args;

  /** Handle empty arguments */
  if (argz === null) {
    argz = [];
  }
  else if (!argz.length) {
    argz = [argz];
  }

  return (argz);

}

/**
 * @return {Array}
 */
export function parseMaybeArguments() {

  let args = this.parseExpressionStatement();

  // Turn non-parenthised args into array
  if (!(args instanceof Array)) {
    if (args !== null) {
      args = [args];
    } else {
      args = [];
    }
  }

  return (args);

}