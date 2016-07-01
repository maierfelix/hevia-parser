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
  [x] name
  [x] pattern
  [x] block
  [x] getter-setter
  [x] willset-didset
  [x] expression
  [x] type annotation (opt)
  @return {Node}
 */
export function parseVariableDeclaration() {

  let declaration = null;
  let node = new Node.VariableDeclaration();

  node.symbol = this.current.name;
  this.next();

  this.parseVariable(node);

  return (node);

}

export function parseVariable(node) {

  node.declarations = this.parseVariableDeclarement();

  /** block */
  if (this.eat(TT.LBRACE)) {
    node.init = this.parseBlock();
    this.expect(TT.RBRACE);
  /** expression */
  } else {
    if (this.eat(TT.ASSIGN)) {
      node.init = this.parseStatement();
    }
  }

  if (this.eat(TT.COMMA)) {
    let loc = this.current.loc;
    throw new Error(`Comma seperated variable declarations - not supported yet (${loc.start.line}:${loc.start.column - 1})`);
  }

}

export function parseVariableDeclarement() {

  let args = null;

  if (this.peek(Token.Identifier)) {
    args = [this.parseLiteral()];
  } else if (this.peek(TT.LPAREN)) {
    args = this.parseParenthese(TT.LPAREN, TT.RPAREN);
  }

  return (args);

}