import {
  Token,
  Types as Type,
  TokenList as TT
} from "../labels";

import Node from "../nodes";

/**
  [x] parenthesed bin expr
  [x] parameter
  [x] tuple
  @return {Node}
 */
export function parseParenthese() {

  let node = new Node.ParameterExpression();
  let param = null;

  this.expect(TT.LPAREN);

  param = this.parseStatement();

  /** No parameter, abort */
  if (!this.peek(TT.COMMA)) {
    /** Dont forget to skip rparen */
    this.expect(TT.RPAREN);
    return (param);
  }

  while (true) {
    /** Nested parenthese */
    if (this.peek(TT.LPAREN)) {
      param = this.parseStatement();
    } else if (param === null) {
      param = new Node.Parameter();
      this.parseParameter(param);
    } else {
      let tmp = new Node.Parameter();
      tmp.init = param;
      param = tmp;
    }
    node.arguments.push(param);
    param = null;
    if (!this.eat(TT.COMMA)) break;
  };

  this.expect(TT.RPAREN);

  return (node);

}

export function parseParameter(node) {

  if (this.eat(TT.BIT_AND)) {
    node.isPointer = true;
  }
  node.init = this.parseStatement();
  /** Pointer target has to be single identifier */
  if (node.isPointer) {
    if (node.init.kind === Token.Identifier) {
      console.error(`Invalid parameter ${node.init}`);
    }
  }
  if (this.eat(TT.COLON)) {
    if (this.eat(TT.INOUT)) {
      node.isReference = true;
      this.back();
    }
    this.back();
    node.type = this.parseType();
  }

}