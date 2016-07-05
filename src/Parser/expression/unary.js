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

  if (this.isOperator(this.current.name)) {
    for (let key of Prefix) {
      if (key.op === getLabelByNumber(this.current.name)) return (true);
    }
  }

  return (false);

}

/**
 * @return {Node}
 */
export function parseUnaryExpression() {

  let node = new Node.UnaryExpression();

  node.operator = this.current.name;
  this.next();
  node.argument = this.parseLiteral();
  node.isPrefix = true;

  return (node);

}