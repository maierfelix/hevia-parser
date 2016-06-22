import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import Node from "../../nodes";

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
  let node = null;

  while (true) {
    /** Call expression ??? */
    if (this.peek(TT.LPAREN)) {
      node = new Node.CallExpression();
      node.callee = base;
      node.arguments = this.parseParenthese() || [];
      base = node;
    }
    /** Ternary expression */
    else if (this.peek(TT.CONDITIONAL)) {
      node  = new Node.TernaryExpression();
      node.condition = base;
      this.expect(TT.CONDITIONAL);
      node.consequent = this.parseExpressionStatement();
      this.expect(TT.COLON);
      node.alternate = this.parseExpressionStatement();
      base = node;
    }
    /** Computed member expression */
    else if (this.peek(TT.LBRACK)) {
      console.log("LBRACK EXPR");
    }
    /** Uncomputed member expression */
    else if (this.eat(TT.PERIOD)) {
      node = new Node.MemberExpression();
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