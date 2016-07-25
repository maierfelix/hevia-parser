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

  // if no body found, turn body into signature
  if (!node.body.body.length && node.signature.length === 1) {
    node.body.body.push(node.signature.shift());
  }

  this.expect(TT.RBRACE);

  return (node);

}