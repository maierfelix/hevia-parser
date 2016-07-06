import {
  Token,
  Types as Type,
  TokenList as TT,
  Operators as OP
} from "../../labels";

import Node from "../../nodes";

import {
  PEX_PRECEDENCE as Prefix,
  POX_PRECEDENCE as Postfix
} from "../../precedence";

import {
  getNameByLabel,
  getLabelByNumber
} from "../../utils";

/**
 * @return {Boolean}
 */
export function isPrefixOperator() {

  let op = this.getUnifiedOperator(this.current);

  return (this.opInArray(Prefix, op));

}

/**
 * @return {Boolean}
 */
export function isPostfixOperator() {

  let op = this.getUnifiedOperator(this.current);

  return (this.opInArray(Postfix, op));

}

/**
 * @return {String}
 */
export function getUnifiedOperator(token) {

  if (token.name === Token.Identifier) {
    return (token.value);
  } else {
    return (
      getLabelByNumber(
        TT[getNameByLabel(token.name)]
      )
    ); // turn into op value
  }

}

/**
 * @return {Boolean}
 */
export function opInArray(array, op) {
  for (let key of array) {
    if (key.op === op) return (true);
  };
  return (false);
}

/**
 * @return {Node}
 */
export function parseUnaryExpression(base) {

  let node = new Node.UnaryExpression();

  node.isPrefix = this.isPrefixOperator();
  node.operator = TT[this.parseLiteralHead()];
  node.argument = base || this.parseBinaryExpression(0);

  return (node);

}