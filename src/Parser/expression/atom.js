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
      base = this.parseCallExpression(base);
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

export function parseCallExpression(callee) {

  let node = new Node.CallExpression();

  node.callee = callee ? callee : this.parseBinaryExpression(0);
  node.arguments = this.parseParenthese() || [];

  /** Oh dear, it's a function */
  if (this.peek(TT.LBRACE)) {
    /** Transform into dirty func decl */
    let func = new Node.FunctionDeclaration();
    func.name = node.callee.value;
    func.arguments = node.arguments;
    func.body = this.parseFunctionBody(func, false);
    node = func;
  }

  return (node);

}