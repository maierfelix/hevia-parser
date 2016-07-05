import {
  Token,
  Types as Type,
  TokenList as TT,
  Operators as OP
} from "../../labels";

import Node from "../../nodes";

import { PEX_PRECEDENCE as Prefix } from "../../precedence";

import {
  getNameByLabel,
  getLabelByNumber
} from "../../utils";

/**
 * @return {Boolean}
 */
export function isPrefixOperator() {

  if (this.current.name === Token.Identifier) {
    for (let key of Prefix) {
      if (key.op === this.current.value) return (true);
    }
  }

  return (false);

}

/**
 * @return {Node}
 */
export function parseUnaryExpression() {

  let node = new Node.UnaryExpression();

  node.operator = TT[this.extract(Token.Identifier).value];
  node.argument = this.parseLiteral();
  node.isPrefix = true;

  return (node);

}