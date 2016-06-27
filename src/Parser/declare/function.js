import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import Node from "../../nodes";

import {
  getNameByLabel
} from "../../utils";

/**
 * @return {Node}
 */
export function parseFunction() {

  let node = new Node.FunctionDeclaration();

  /** Optional, so dont expect */
  this.eat(TT.FUNCTION);

  node.name = this.extract(Token.Identifier).value;
  node.body = this.parseFunctionBody(node, false);

  return (node);

}

export function parseFunctionBody(node) {

  if (this.peek(TT.LPAREN)) {
    node.arguments = this.parseStatement();
  }

  if (this.peek(TT.ARROW)) {
    this.parseFunctionReturn(node);
  }

  this.expect(TT.LBRACE);
  node.body = this.parseBlock();
  this.expect(TT.RBRACE);

  return (node.body);

}

export function parseFunctionReturn(node) {

  this.expect(TT.ARROW);

  node.type = this.parseStatement();

}