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

  let node = null;

  switch (this.current.name) {
    case TT.LBRACK:
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
      node = this.parseBinaryExpression(0);
    break;
    /** Operator things */
    case TT.ASSOCIATIVITY:
      node = this.parseAssociativityExpression();
    break;
    case TT.PRECEDENCE:
      node = this.parsePrecedenceExpression();
    break;
  };

  if (this.peek(TT.CONDITIONAL)) {
    node = this.parseTernaryExpression(node);
  }

  return (node);

}