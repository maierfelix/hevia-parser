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

  node.signature = this.parseExpressionStatement();

  this.eat(TT.IN);

  node.body = this.parseBlock();

  this.expect(TT.RBRACE);

  return (node);

}