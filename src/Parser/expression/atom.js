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
    /** Computed member expression */
    else if (this.peek(TT.LBRACK)) {
      console.log("LBRACK EXPR");
    }
    /** Uncomputed member expression */
    else if (this.eat(TT.PERIOD)) {
      let node = new Node.MemberExpression();
      node.object = base;
      node.property = this.parseBinaryExpression(0);
      base = node;
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