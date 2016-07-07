import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import Node from "../../nodes";

/**
 * @return {Node}
 */
export function parseStruct() {

  let node = new Node.StructureDeclaration();

  this.expect(TT.STRUCT);

  if (this.peek(Token.Identifier)) {
    node.name = this.extract(Token.Identifier).value;
  }

  if (this.eat(TT.COLON)) {
    node.extend = this.parseCommaSeperatedValues() || [];
  }

  this.expect(TT.LBRACE);
  node.body = this.parseBlock();
  this.expect(TT.RBRACE);

  return (node);

}