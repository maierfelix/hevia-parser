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
  [x] ?:
  [x] .
  [x] []
  [x] AS|IS
  [x] ()
  @param {Node} base
  @return {Node}
 */
export function parseAtom(base) {

  while (true) {
    /** Un/computed member expression */
    if (
      this.peek(TT.LBRACK) ||
      this.peek(TT.PERIOD)
    ) {
      base = this.parseMemberExpression(base);
    }
    /** Call expression */
    else if (this.peek(TT.LPAREN)) {
      base = this.parseCallExpression(base);
    }
    else {
      break;
    }
  };

  return (base);

}

/**
 * @return {Node}
 */
export function parseMemberExpression(base) {

  let node = new Node.MemberExpression();

  node.isComputed = this.peek(TT.LBRACK);

  this.next();

  node.object = base;
  node.property = node.isComputed ? this.parseExpressionStatement() : this.parseLiteral();

  // Be careful with []
  if (node.isComputed && this.eat(TT.COMMA)) {
    let args = this.parseCommaSeperatedValues();
    args.unshift(node.property);
    let tmp = new Node.ArrayExpression();
    tmp.argument = args;
    node.property = tmp;
  }

  if (node.isComputed) {
    this.expect(TT.RBRACK);
  }

  return (node);

}

/**
 * @return {Node}
 */
export function parseCallExpression(base) {

  let node = new Node.CallExpression();

  node.callee = base;
  node.arguments = this.parseArguments();

  // Trailing closure
  if (this.peek(TT.LBRACE) && !this.inIfCondition) {
    node.arguments.push(this.parseStatement());
  }

  return (node);

}

/**
 * @return {Node}
 */
export function parseTernaryExpression(base) {

  let node  = new Node.TernaryExpression();

  node.condition = base;

  this.inTernary = true;

  this.expect(TT.CONDITIONAL);
  node.consequent = this.parseExpressionStatement();
  this.expect(TT.COLON);
  node.alternate = this.parseExpressionStatement();

  this.inTernary = false;

  return (node);

}