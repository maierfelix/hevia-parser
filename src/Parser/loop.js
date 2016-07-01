import {
  Token,
  Types as Type,
  TokenList as TT
} from "../labels";

import Node from "../nodes";

import {
  getNameByLabel
} from "../utils";

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

  let init = null;

  this.expect(TT.FOR);

  this.eat(TT.LPAREN);

  if (!this.eat(TT.SEMICOLON)) {
    init = this.parseExpressionStatement();
  }

  /** for ex in ex */
  if (this.eat(TT.IN)) {
    node = new Node.ForInStatement();
    this.parseForInLoop(node);
  /** for ex;ex;ex */
  } else {
    this.parseDefaultForLoop(node);
  }

  node.init = init;

  this.eat(TT.RPAREN);

  this.expect(TT.LBRACE);
  node.body = this.parseBlock();
  this.expect(TT.RBRACE);

  return (node);

}

export function parseForInLoop(node) {

  node.expression = this.parseExpressionStatement();

}

export function parseDefaultForLoop(node) {

  node.test = this.parseExpressionStatement();
  this.expect(TT.SEMICOLON);
  node.update = this.parseExpressionStatement();

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

  this.expect(TT.LBRACE);
  node.body = this.parseBlock();
  this.expect(TT.RBRACE);

  return (node);

}

/**
 * @return {Node}
 */
export function parseRepeat() {

  let node = new Node.RepeatStatement();

  this.expect(TT.REPEAT);

  this.expect(TT.LBRACE);
  node.body = this.parseBlock();
  this.expect(TT.RBRACE);

  this.expect(TT.WHILE);

  this.eat(TT.LPAREN);
  node.test = this.parseExpressionStatement();
  this.eat(TT.RPAREN);

  return (node);

}