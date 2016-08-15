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
 * @param {Node} node
 * @return {Node}
 */
export function parseAtom(node) {

  while (true) {
    /** Un/computed member expression */
    if (
      this.peek(TT.LBRACK) ||
      this.peek(TT.PERIOD)
    ) {
      node = this.parseMemberExpression(node);
    }
    /** Call expression */
    else if (this.peek(TT.LPAREN)) {
      node = this.parseCallExpression(node);
    }
    else {
      break;
    }
  };

  this.parseChaining(node);

  return (node);

}

/**
 * @param {Node}
 */
export function parseChaining(node) {

  if (this.eat(TT.NOT)) {
    node.isUnwrapped = true;
  }
  else if (this.peek(TT.CONDITIONAL)) {
    if (!this.current.isTernary) {
      this.next();
      node.isOptional = true;
    }
  }

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

  this.parseChaining(node);

  return (node);

}

/**
 * @return {Node}
 */
export function parseCallExpression(base) {

  let node = new Node.CallExpression();

  node.callee = base;
  node.arguments = this.parseArguments();

  return (node);

}

/**
 * @return {Node}
 */
export function parseTernaryExpression(base) {

  let node  = new Node.TernaryExpression();

  node.test = base;

  this.inTernary = true;

  this.expect(TT.CONDITIONAL);
  node.consequent = this.parseExpressionStatement();
  this.expect(TT.COLON);
  node.alternate = this.parseExpressionStatement();

  this.inTernary = false;

  return (node);

}