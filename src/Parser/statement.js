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
    /** Final */
    case TT.FINAL:
      node = this.parseFinal();
    break;
    case TT.STATIC:
      node = this.parseStatic();
    break;
    /** Override */
    case TT.OVERRIDE:
      node = this.parseOverride();
    break;
    /** Operator things */
    case TT.ASSOCIATIVITY:
      node = this.parseAssociativityExpression();
    break;
    case TT.PRECEDENCE:
      node = this.parsePrecedenceExpression();
    break;
    /** Expression statement */
    default:
      node = this.parseAtom(this.parseExpressionStatement());
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

  node.argument = this.parseExpressionStatement();

  return (node);

}