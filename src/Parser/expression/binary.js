import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import Node from "../../nodes";

import {
  PEX_PRECEDENCE as Prefix,
  IFX_PRECEDENCE as Infix,
  POX_PRECEDENCE as Postfix
} from "../../precedence";

import {
  getNameByLabel,
  getLabelByNumber
} from "../../utils";

/**
 * @param {Number} index
 * @return {Node}
 */
export function parseBinaryExpression(index) {

  let tmp = null;
  let left = null;
  let node = null;

  let state = Infix[index];

  left = state ? this.parseBinaryExpression(index + 1) : this.parseAtom(this.parseLiteral());

  while (this.acceptPrecedence(state)) {
    node = new Node.BinaryExpression();
    node.operator = TT[state.op];
    this.next();
    node.left = left;
    tmp = state ? this.parseBinaryExpression(index + 1) : this.parseLiteral();
    node.right = tmp;
    node.isParenthised = this.peek(TT.RPAREN);
    left = node;
  };

  // No infix expression, so check if postfix
  if (state === void 0 && this.current !== void 0) {
    if (this.isPostfixOperator(this.current)) {
      return (this.parseUnaryExpression(left));
    }
    else if (this.eat(TT.CONDITIONAL)) {
      left.isOptional = true;
    }
    else if (this.eat(TT.NOT)) {
      left.isUnwrap = true;
    }
  }

  return (left);

}

/**
 * @param {Object} token
 * @return {Boolean}
 */
export function isPrefixOperator(token) {

  let op = this.getUnifiedOperator(token);

  return (this.opInArray(Prefix, op));

}

/**
 * @param {Object} token
 * @return {Boolean}
 */
export function isPostfixOperator(token) {

  let op = this.getUnifiedOperator(token);

  return (this.opInArray(Postfix, op));

}

/**
 * Parses an operator token, which is either
 * tokenized as a identifier (unknown) or a TT index
 * @return {String}
 */
export function getUnifiedOperator(token) {

  if (token.name === Token.Identifier) {
    return (token.value);
  } else {
    // Turn into op value
    return (
      getLabelByNumber(
        TT[getNameByLabel(token.name)]
      )
    );
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