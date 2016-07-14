import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import Node from "../../nodes";

/**
 * @return {Node}
 */
export function parseProtocol() {

  let node = new Node.ProtocolDeclaration();

  this.expect(TT.PROTOCOL);

  if (this.peek(Token.Identifier)) {
    node.name = this.extract(Token.Identifier).value;
  }

  if (this.eat(TT.COLON)) {
    node.extend = this.parseCommaSeperatedValues() || [];
  }

  if (this.eat(TT.LBRACE)) {
    node.body = this.parseBlock();
    this.expect(TT.RBRACE);
  }

  return (node);

}