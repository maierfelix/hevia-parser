import {
  Token,
  Types as Type,
  TokenList as TT
} from "../labels";

import Node from "../nodes";

/**
  Parse a parenthese, either
  a expr, tuple, parameter or argument
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

  /** No parameter, parse as expression */
  if (!this.peek(TT.COMMA)) {
    /** Dont forget to skip rparen */
    this.expect(TT.RPAREN);
    if (param !== null) {
      node.arguments.push(param);
    }
    return (node);
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

  node.init = this.parseStatement();

  /** Labeled parameter */
  if (this.peek(Token.Identifier)) {
    if (node.init.kind === Type.Literal) {
      node.label = node.init;
      this.parseParameter(node);
    }
  }

}