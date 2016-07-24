import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import Node from "../../nodes";

import {
  isLiteral,
  getNameByLabel
} from "../../utils";

/**
 * @return {Node}
 */
export function parseExpressionStatement() {

  let node = null;

  switch (this.current.name) {
    /** Operator things */
    case TT.ASSOCIATIVITY:
      node = this.parseAssociativityExpression();
    break;
    case TT.PRECEDENCE:
      node = this.parsePrecedenceExpression();
    break;
    case TT.LBRACK:
      node = this.parseAtom(this.parseArrayExpression());
    break;
    default:
      if (isLiteral(this.current.name)) {
        node = this.parseBinaryExpression(0);
      }
      // Ups, expression starts with prefix operator
      // FIXME
      else if (this.isOperator(this.current.name)) {
        node = this.parseBinaryExpression(0);
      }
    break;
  };

  if (this.peek(TT.CONDITIONAL)) {
    if (this.current.isTernary) {
      node = this.parseTernaryExpression(node);
    }
    else {
      if (node !== null) {
        node.isOptional = true;
        this.next();
      }
    }
  }

  return (node);

}