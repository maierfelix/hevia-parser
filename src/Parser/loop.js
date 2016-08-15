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
 * @return {Node}
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
    init = this.parseStatement();
  }

  // for (expr) in (expr)
  if (this.eat(TT.IN)) {
    node = new Node.ForInStatement();
    node.expression = this.parseCondition();
  // for (expr);(expr);(expr)
  } else {
    node.test = this.parseExpressionStatement();
    this.expect(TT.SEMICOLON);
    node.update = this.parseCondition();
  }

  node.init = init;

  this.expect(TT.LBRACE);
  node.body = this.parseBlock();
  this.expect(TT.RBRACE);

  return (node);

}

/**
 * @return {Node}
 */
export function parseWhile() {

  let node = new Node.WhileStatement();

  this.expect(TT.WHILE);

  node.test = this.parseCondition();

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

  node.test = this.parseCondition();

  return (node);

}