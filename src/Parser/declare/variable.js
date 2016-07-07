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

  if (
    this.peek(TT.VAR) || this.peek(TT.CONST)
  ) {
    node.symbol = this.current.name;
    this.next();
  }

  this.parseVariable(node);

  return (node);

}

/**
 * @return {Node}
 */
export function parseVariable(node) {

  node.declarations = this.parseVariableDeclarement();

  // Block
  if (this.eat(TT.LBRACE)) {
    node.init = this.parseBlock();
    this.expect(TT.RBRACE);
  // Expression
  } else {
    if (this.eat(TT.ASSIGN)) {
      if (this.peek(TT.LPAREN) && node.declarations.length > 1) {
        node.init = this.parseArguments();
      } else {
        node.init = this.parseStatement();
      }
    }
  }

  if (node.init && !node.init.length) {
    node.init = [node.init];
  }

  if (this.eat(TT.COMMA)) {
    while (true) {
      let tmp = this.parseVariableDeclaration();
      tmp.symbol = node.symbol;
      node.declarations = node.declarations.concat(tmp.declarations);
      node.init = node.init.concat(tmp.init);
      if (!this.peek(TT.COMMA)) break;
    };
  }

}

/**
 * @return {Array}
 */
export function parseVariableDeclarement() {

  let args = null;

  if (this.peek(Token.Identifier)) {
    args = [this.parseLiteral()];
  } else if (this.peek(TT.LPAREN)) {
    args = this.parseArguments();
  }

  return (args);

}