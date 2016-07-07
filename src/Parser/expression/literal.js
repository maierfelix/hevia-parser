import {
  Token,
  Types as Type,
  TokenList as TT,
  Operators as OP
} from "../../labels";

import Node from "../../nodes";

import {
  getNameByLabel
} from "../../utils";

/**
 * @return {Node}
 */
export function parseLiteral() {

  // Unary pex expression
  if (this.isPrefixOperator(this.current)) {
    return this.parseUnaryExpression(void 0);
  }

  if (this.peek(TT.LPAREN)) {
    this.expect(TT.LPAREN);
    let tmp = this.parseExpressionStatement();
    // Seems like a standalone operator
    if (tmp === null) {
      tmp = this.parseLiteral();
    }
    // Seems like a tuple o.O
    if (this.eat(TT.COMMA)) {
      // Parse all folowing tuple parameters
      let args = this.parseCommaSeperatedValues();
      args.unshift(tmp);
      tmp = args;
    }
    this.expect(TT.RPAREN);
    return (tmp);
  }

  let node = new Node.Literal();
  let isExplicit = this.eat(TT.UL);

  // Literal passed as pointer
  if (this.eat(TT.BIT_AND)) {
    node.isPointer = true;
  }

  if (isExplicit && this.peek(TT.COLON)) {
    // Explicit only parameter
  } else {
    node.type = this.current.name;
    node.value = this.current.value;
    node.raw = this.current.value;
    this.next();
  }

  // Labeled literal
  if (this.peek(Token.Identifier)) {
    if (!this.isOperator(TT[this.current.value])) {
      let tmp = this.parseLiteral();
      tmp.label = node;
      node = tmp;
    }
  }

  // Dont parse colon as argument, if in ternary expression
  if (!this.inTernary) {
    if (this.peek(TT.COLON)) {
      node = this.parseStrictType(node);
      if (
        node.argument &&
        node.argument.kind === Type.TypeAnnotation
      ) {
        node.argument.isExplicit = isExplicit;
      }
    }
  }

  return (node);

}

/**
 * Parse a literal head,
 * supports functions names
 * which are operators
 * @return {String}
 */
export function parseLiteralHead() {

  let str = TT[this.current.name];

  // Custom operator
  if (str) {
    this.next();
    return str;
  }

  // Default literal
  return this.extract(Token.Identifier).value;

}

/**
 * @return {Node}
 */
export function parseArrayExpression() {

  let node = new Node.ArrayExpression();

  let args = [];

  this.expect(TT.LBRACK);

  while (true) {
    if (!this.peek(TT.RBRACK)) {
      args.push(this.parseBinaryExpression(0));
    }
    if (!this.eat(TT.COMMA)) break;
  };

  this.expect(TT.RBRACK);

  node.argument = args;

  return (node);

}