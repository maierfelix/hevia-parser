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

  this.expect(TT.FUNCTION);

  this.pushScope(node);

  node.name = this.extract(Token.Identifier).value;
  node.body = this.parseFunctionBody(node, false);

  this.popScope();

  this.scope.register(node);

  return (node);

}

export function parseFunctionBody(node, isClosure) {

  node.isClosure = isClosure;

  if (this.peek(TT.LPAREN)) {
    node.arguments = this.parseStatement();
  }

  if (this.eat(TT.ARROW)) {
    if (this.isNativeType(this.current.name)) {
      node.type = this.current;
      this.next();
    }
  }

  if (this.peek(TT.LPAREN)) {
    node.returnTuple = this.parseStatement();
  }

  if (this.peek(TT.ARROW)) {
    node.body = this.parseFunctionBody(node, true);
  } else {
    this.expect(TT.LBRACE);
    node.body = this.parseBlock();
    this.expect(TT.RBRACE);
  }

  return (node.body);

}