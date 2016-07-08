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
    if (this.isNativeType(this.current.name)) {
      node.argument = this.parseType();
    } else {
      node.argument = this.parseExpressionStatement();
    }
  }
  else if (this.eat(TT.ARROW)) {
    // func () -> ()
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

  let node = new Node.TypeAnnotation();

  node.type = this.current.name;

  this.next();

  if (this.eat(TT.CONDITIONAL)) {
    node.isOptional = true;
  }
  else if (
    this.current !== void 0 &&
    this.current.value === "!"
  ) {
    node.isUnwrap = true;
    this.next();
  }

  return (node);

}

/**
 * @param {Number}  type
 * @return {Boolean}
 */
export function isNativeType(type) {
  switch (type) {
    case TT.VOID:
    case TT.INT:
    case TT.INT8:
    case TT.UINT8:
    case TT.INT32:
    case TT.INT64:
    case TT.UINT64:
    case TT.DOUBLE:
    case TT.FLOAT:
    case TT.BOOLEAN:
    case TT.STRING:
    case TT.CHARACTER:
      return (true);
    break;
    default:
      return (false);
    break;
  };
}