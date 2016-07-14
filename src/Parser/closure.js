import {
  Token,
  Types as Type,
  TokenList as TT
} from "../labels";

import Node from "../nodes";

import {
  getNameByLabel
} from "../utils";

/**
 * @return {Node}
 */
export function parseClosure() {

  let node = new Node.Closure();

  let braced = this.eat(TT.LBRACE);

  node.body = this.parseBlock();

  if (braced) this.expect(TT.RBRACE);

  return (node);

}