import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import Node from "../../nodes";

/**
 * @return {Node}
 */
export function parseTypeAlias() {

  let node = new Node.TypeAliasDeclaration();

  this.expect(TT.TYPEALIAS);

  if (this.peek(Token.Identifier)) {
    node.name = this.parseLiteral().value;
  }

  this.expect(TT.ASSIGN);

  node.argument = this.parseExpressionStatement();

  return (node);

}