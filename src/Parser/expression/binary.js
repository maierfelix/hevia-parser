import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import Node from "../../nodes";

import { IFX_PRECEDENCE as Infix } from "../../precedence";

import {
  getNameByLabel
} from "../../utils";

/**
 * @param  {Number} index
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

  return (left);

}