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

  if (this.peek(TT.COLON)) {
    node.extend = this.parseTypeInheritance();
  }

  if (this.eat(TT.LBRACE)) {
    node.body = this.parseBlock();
    this.expect(TT.RBRACE);
  }

  return (node);

}