import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import Node from "../../nodes";

/**
 * @return {Node}
 */
export function parseExpressionStatement() {

  switch (this.current.name) {
    case TT.UL:
    case TT.TRUE:
    case TT.FALSE:
    case Token.Identifier:
    case Token.NullLiteral:
    case Token.StringLiteral:
    case Token.NumericLiteral:
    case Token.BooleanLiteral:
      return this.parseAtomicExpression();
    break;
    /** Parenthised expression */
    case TT.LPAREN:
      return this.parseParenthese();
    break;
  };

  return (null);

}

/**
 * Accept precedence
 * @param  {Object}  token
 * @param  {Number}  state
 * @return {Boolean}
 */
export function acceptPrecedence(state) {
  return (
    state !== void 0 &&
    this.current !== void 0 &&
    state.indexOf(this.current.name) > -1
  );
}

/**
 * @param  {Number}  name
 * @return {Boolean}
 */
export function isOperator(name) {
  switch (name) {
    case TT.OR:
    case TT.AND:
    case TT.ADD:
    case TT.SUB:
    case TT.MUL:
    case TT.DIV:
    case TT.MOD:
    case TT.LT:
    case TT.LE:
    case TT.GT:
    case TT.GE:
    case TT.EQ:
    case TT.NEQ:
    case TT.CMP_ADD:
    case TT.CMP_SUB:
    case TT.CMP_MUL:
    case TT.CMP_DIV:
    case TT.BIT_XOR:
    case TT.BIT_NOT:
    case TT.BIT_OR:
    case TT.BIT_AND:
      return (true);
    break;
    default:
      return (false);
    break;
  };
}