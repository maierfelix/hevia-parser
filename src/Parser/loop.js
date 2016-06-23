import {
  Token,
  Types as Type,
  TokenList as TT
} from "../labels";

import Node from "../nodes";

/*
  [ ] for
  [ ] while
  [ ] repeat
  @return {Node}
*/
export function parseLoopStatement() {

  switch (this.current.name) {
    case TT.FOR:
      return this.parseFor();
    break;
    case TT.WHILE:
      return this.parseWhile();
    break;
    case TT.REPEAT:
      return this.parseRepeat();
    break;
  };

  return (null);

}

/**
 * @return {Node}
 */
export function parseFor() {

  let node = new Node.ForStatement();

  this.expect(TT.FOR);

  this.eat(TT.LPAREN);

  if (!this.eat(TT.SEMICOLON)) {
    node.init = this.parseVariable();
  }
  node.test = this.parseExpressionStatement();
  this.expect(TT.SEMICOLON);
  node.update = this.parseExpressionStatement();

  this.eat(TT.RPAREN);

  this.pushScope(node);

  this.expect(TT.LBRACE);
  node.body = this.parseBlock();
  this.expect(TT.RBRACE);

  this.popScope();

  return (node);

}

/**
 * @return {Node}
 */
export function parseWhile() {

  let node = new Node.WhileStatement();

  this.expect(TT.WHILE);

  this.eat(TT.LPAREN);
  node.test = this.parseExpressionStatement();
  this.eat(TT.RPAREN);

  this.pushScope(node);

  this.expect(TT.LBRACE);
  node.body = this.parseBlock();
  this.expect(TT.RBRACE);

  this.popScope();

  return (node);

}

/**
 * @return {Node}
 */
export function parseRepeat() {

  let node = new Node.RepeatStatement();

  this.expect(TT.REPEAT);

  this.pushScope(node);

  this.expect(TT.LBRACE);
  node.body = this.parseBlock();
  this.expect(TT.RBRACE);

  this.popScope();

  this.expect(TT.WHILE);

  this.eat(TT.LPAREN);
  node.test = this.parseExpressionStatement();
  this.eat(TT.RPAREN);

  return (node);

}