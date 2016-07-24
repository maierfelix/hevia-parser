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
export function parseStrictType(base) {

  let node = new Node.Parameter();

  let isInout = false;

  if (this.eat(TT.COLON)) {
    isInout = this.eat(TT.INOUT);
    node.init = base;
    node.argument = this.parseType();
  }
  else if (this.eat(TT.ARROW)) {
    // func () -> (Tuple)
    if (this.peek(TT.LPAREN)) {
      node = this.parseStatement();
    // func () -> Type
    } else {
      node = this.parseType();
    }
  }

  // Catched a wild function parameter
  // TODO: Support deepness
  if (this.eat(TT.ARROW)) {
    let tmp = new Node.FunctionExpression();
    tmp.arguments = node.argument;
    tmp.type = this.parseType();
    node.argument = tmp;
  }

  if (isInout && node.kind === Type.Parameter) {
    node.isReference = true;
  }

  return (node);

}

/**
 * @return {Node}
 */
export function parseType() {

  let node = null;

  if (this.peek(TT.LBRACK)) {
    node = this.parseArrayExpression();
  }
  else if (this.peek(TT.LPAREN)) {
    node = this.parseArguments();
  }
  else {
    node = this.parseLiteral();
  }

  return (node);

}