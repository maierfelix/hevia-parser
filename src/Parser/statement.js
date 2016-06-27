import {
  Token,
  Types as Type,
  TokenList as TT
} from "../labels";

import Node from "../nodes";

/**
 * @return {Node}
 */
export function parseStatement() {

  let node = null;

  switch (this.current.name) {
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
    case TT.CLASS:
    case TT.PROTOCOL:
    case TT.EXTENSION:
    case TT.OPERATOR:
    case TT.POSTFIX:
    case TT.PREFIX:
    case TT.INFIX:
      node = this.parseDeclarationStatement();
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
export function parseReturnStatement() {

  let node = new Node.ReturnStatement();

  this.expect(TT.RETURN);

  if (this.peek(TT.LPAREN)) {
    node.argument = this.parseParenthese();
  } else {
    node.argument = this.parseExpressionStatement();
  }

  return (node);

}