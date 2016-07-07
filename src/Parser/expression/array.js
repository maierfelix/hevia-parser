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
export function parseArrayExpression() {

  let node = new Node.ArrayExpression();

  let args = [];

  this.expect(TT.LBRACK);

  while (true) {
    if (!this.peek(TT.RBRACK)) {
      args.push(this.parseBinaryExpression(0));
    }
    if (!this.eat(TT.COMMA)) break;
  };

  this.expect(TT.RBRACK);

  node.argument = args;

  return (node);

}