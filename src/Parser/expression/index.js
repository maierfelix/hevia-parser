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
      return this.parseBinaryExpression(0);
    break;
    /** Operator things */
    case TT.ASSOCIATIVITY:
      return this.parseAssociativityExpression();
    break;
    case TT.PRECEDENCE:
      return this.parsePrecedenceExpression();
    break;
  };

  if (this.isNativeType(this.current.name)) {
    return (this.parseLiteral());
  }

  return (null);

}