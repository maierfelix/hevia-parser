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
      node = this.parseExpressionStatement();
    // func () -> Type
    } else {
      node = this.parseType();
    }
  }

  if (
    node.argument &&
    node.argument.kind === Type.TypeAnnotation
  ) {
    node.argument.isReference = isInout;
  }

  return (node);

}

/**
 * @return {Node}
 */
export function parseType() {

  let node = this.parseLiteral();

  if (this.eat(TT.CONDITIONAL)) {
    node.isOptional = true;
  }
  else if (this.eat(TT.NOT)) {
    node.isUnwrap = true;
  }

  return (node);

}