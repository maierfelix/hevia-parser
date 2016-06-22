import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import Node from "../../nodes";

/**
 * @return {Node}
 */
export function parseFunction() {

  let node = new Node.FunctionDeclaration();

  this.pushScope(node);

  this.expect(TT.FUNCTION);

  node.name = this.current.value;

  this.expect(Token.Identifier);

  node.body = this.parseFunctionBody(node);

  this.popScope();

  this.scope.register(node);

  return (node);

}

export function parseFunctionBody(node) {

  if (this.peek(TT.LPAREN)) {
    node.arguments = this.parseStatement();
  }

  if (this.eat(TT.ARROW)) {
    if (this.validateType(this.current.name)) {
      node.type = this.current;
      this.next();
    }
  }

  if (this.peek(TT.LPAREN)) {
    node.returnTuple = this.parseStatement();
  }

  if (this.peek(TT.ARROW)) {
    node.body = this.parseFunctionBody(node);
  } else {
    this.expect(TT.LBRACE);
    node.body = this.parseBlock();
    this.expect(TT.RBRACE);
  }

  return (node.body);

}