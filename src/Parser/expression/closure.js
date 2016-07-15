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
 * @param  {Node} base
 * @return {Node}
 */
export function parseClosureExpression(base) {

  let node = new Node.ClosureExpression();

  this.expect(TT.LBRACE);

  let type = null;
  let body = null;
  let args = null;
  let callee = null;

  if (this.peek(TT.LPAREN)) {
    args = this.parseExpressionStatement();
  }

  if (!(args instanceof Array)) args = [args];

  if (this.peek(TT.ARROW)) {
    type = this.parseStrictType();
  }

  this.eat(TT.IN);

  body = this.parseBlock();

  // Is dat ok?!
  if (base) callee = base;

  node.type = type;
  node.body = body;
  node.arguments = args;
  node.callee = callee;

  this.expect(TT.RBRACE);

  return (node);

}