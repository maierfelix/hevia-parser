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
 * Handles deep:
 * - CallExpr   ()
 * - MemberExpr []
 * - MemberExpr .
 * - TernaryExpr ?:
 * @return {Node}
 */
export function parseAtomicExpression() {

  let base = this.parseBinaryExpression(0);

  while (true) {
    if (this.peek(TT.CONDITIONAL)) {
      base = this.parseTernaryExpression(base);
    }
    /** Member expression */
    else if (
      this.peek(TT.LBRACK) ||
      this.peek(TT.PERIOD)
    ) {
      base = this.parseMemberExpression(base);
    /** Type casting */
    } else if (
      this.peek(TT.AS) ||
      this.peek(TT.IS)
    ) {
      base = this.parseCast(base);
    }
    else break;
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
  node.property = this.parseBinaryExpression(0);

  if (node.isComputed) {
    this.expect(TT.RBRACK);
  }

  return (node);

}

/**
 * @return {Node}
 */
export function parseCallExpression(callee) {

  let node = new Node.CallExpression();

  node.callee = callee;
  node.arguments = this.parseArguments();

  return (node);

}

/**
 * @return {Node}
 */
export function parseTernaryExpression(condition) {

  let node  = new Node.TernaryExpression();

  this.inTernary = true;

  node.condition = condition;

  this.expect(TT.CONDITIONAL);
  node.consequent = this.parseExpressionStatement();
  this.expect(TT.COLON);
  node.alternate = this.parseExpressionStatement();

  this.inTernary = false;

  return (node);

}