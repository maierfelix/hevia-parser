import {
  Token,
  Types as Type,
  TokenList as TT,
  Operators as OP
} from "../../labels";

import Node from "../../nodes";

import {
  getNameByLabel
} from "../../utils";

/**
 * @return {Node}
 */
export function parseClosureExpression() {

  let node = new Node.ClosureExpression();

  this.expect(TT.LBRACE);

  node.signature = this.parseMaybeArguments();

  if (this.eat(TT.COMMA)) {
    let args = this.parseCommaSeperatedValues();
    args.unshift(node.signature.shift());
    node.signature = args;
  }

  if (this.peek(TT.ARROW)) {
    node.type = this.parseStrictType();
  }

  this.eat(TT.IN);

  node.body = this.parseBlock();

  this.expect(TT.RBRACE);

  return (node);

}