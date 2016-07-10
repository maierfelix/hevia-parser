import {
  Token,
  Types as Type,
  TokenList as TT
} from "../labels";

import Node from "../nodes";

import {
  getNameByLabel
} from "../utils";

/**
 * @return {Node}
 */
export function parseStatement() {

  let node = null;

  switch (this.current.name) {
    /** Comment */
    case Token.BlockComment:
    case Token.LineComment:
      node = this.parseComment();
    break;
    /** Loop statement */
    case TT.FOR:
    case TT.WHILE:
    case TT.REPEAT:
      node = this.parseLoopStatement();
    break;
    /** Branch statement */
    case TT.IF:
    case TT.GUARD:
    case TT.SWITCH:
    case TT.GET:
    case TT.SET:
    case TT.WILLSET:
    case TT.DIDSET:
      node = this.parseBranchStatement();
    break;
    /** Defer statement */
    case TT.DEFER:
      node = this.parseDeferStatement();
    break;
    /** Return statement */
    case TT.RETURN:
      node = this.parseReturnStatement();
    break;
    /** Do statement */
    case TT.DO:
      node = this.parseDoStatement();
    break;
    /** Declaration statement */
    case TT.IMPORT:
    case TT.CONST:
    case TT.VAR:
    case TT.TYPEALIAS:
    case TT.FUNCTION:
    case TT.ENUM:
    case TT.STRUCT:
    case TT.INIT:
    case TT.PROTOCOL:
    case TT.EXTENSION:
    case TT.OPERATOR:
    case TT.POSTFIX:
    case TT.PREFIX:
    case TT.INFIX:
      node = this.parseDeclarationStatement();
    break;
    /** Class */
    case TT.CLASS:
      node = this.parseClass();
    break;
    /** Access control */
    case TT.PUBLIC:
    case TT.PRIVATE:
    case TT.INTERNAL:
      node = this.parseAccessControl();
    break;
    /** Override */
    case TT.OVERRIDE:
      node = this.parseOverride();
    break;
    /** Final */
    case TT.FINAL:
      node = this.parseFinal();
    break;
    case TT.STATIC:
      node = this.parseStatic();
    break;
    /** Expression statement */
    default:
      node = this.parseExpressionStatement();
    break;
  };

  this.eat(TT.SEMICOLON);

  return (node);

}

/**
 * @return {Node}
 */
export function parseFinal() {

  this.expect(TT.FINAL);

  let node = this.parseStatement();

  if (
    !node.hasOwnProperty("isFinal")
  ) {
    throw new Error("Can't attach final property to node!");
  }

  node.isFinal = true;

  return (node);

}

/**
 * @return {Node}
 */
export function parseOverride() {

  this.expect(TT.OVERRIDE);

  let node = this.parseStatement();

  if (
    !node.hasOwnProperty("isOverride")
  ) {
    throw new Error("Can't attach override property to node!");
  }

  node.isOverride = true;

  return (node);

}

/**
 * @return {Node}
 */
export function parseStatic() {

  this.expect(TT.STATIC);

  let node = this.parseStatement();

  if (
    !node.hasOwnProperty("isStatic")
  ) {
    throw new Error("Can't attach static property to node!");
  }

  node.isStatic = true;

  return (node);

}

/**
 * @return {Node}
 */
export function parseAccessControl() {

  let access = this.current;

  this.next();

  let node = this.parseStatement();

  if (
    !node.hasOwnProperty("isPublic") &&
    !node.hasOwnProperty("isPrivate") &&
    !node.hasOwnProperty("isInternal")
  ) {
    throw new Error("Can't attach access control to node!");
  }

  switch (access.name) {
    case TT.PUBLIC:
      node.isPublic = true;
    break;
    case TT.PRIVATE:
      node.isPrivate = true;
    break;
    case TT.INTERNAL:
      node.isInternal = true;
    break;
  };

  return (node);

}

/**
 * @return {Node}
 */
export function parseReturnStatement() {

  let node = new Node.ReturnStatement();

  this.expect(TT.RETURN);

  node.argument = this.parseExpressionStatement();

  return (node);

}