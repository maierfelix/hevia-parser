import {
  Token,
  Types as Type,
  TokenList as TT,
  Operators as OP
} from "../../labels";

import Node from "../../nodes";

import {
  isLiteral,
  getNameByLabel
} from "../../utils";

/**
 * @return {Node}
 */
export function parseLiteral() {

  let node = new Node.Literal();

  // Enum access
  if (this.eat(TT.PERIOD)) {
    node = this.parseLiteral();
    node.isEnumLink = true;
    return (node);
  }

  // Unary pex expression
  if (this.isPrefixOperator(this.current)) {
    return this.parseUnaryExpression(null);
  }

  // Call expression
  if (this.eat(TT.LPAREN)) {
    // Empty
    if (this.eat(TT.RPAREN)) {
      return (null);
    }
    let tmp = this.parseStatement();
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

  let isExplicit = this.eat(TT.UL);

  // Literal passed as pointer
  if (this.eat(TT.BIT_AND)) {
    node.isPointer = true;
  }

  if (isExplicit && this.peek(TT.COLON) && !this.inTernary) {
    // Explicit only parameter
  } else {
    // Parse literal
    if (isLiteral(this.current.name)) {
      node.type = this.current.name;
      node.value = this.current.value;
      node.raw = this.current.value;
      this.next();
    }
    // No literal to parse
    else {
      // Assignment to underscore
      if (isExplicit && this.isOperator(this.current.name)) {
        this.back();
        node = this.parseSpecialLiteral();
      }
      else {
        node = this.parseStatement();
      }
    }
  }

  // Dont parse colon as argument, if in ternary expression
  if (!this.inTernary && this.peek(TT.COLON)) {
    node = this.parseType(node);
    if (isExplicit) {
      node.isExplicit = true;
    }
  }

  // Shorthand
  if (
    node !== null &&
    node.value !== void 0 &&
    node.value !== null
  ) {
    if (node.value.charAt(0) === "$") {
      node.isShorthand = true;
      // Delete $ sign
      node.value = node.value.slice(1);
    }
  }

  this.parseChaining(node);

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
    return (str);
  }

  // Default literal
  return this.extract(Token.Identifier).value;

}

/**
 * Parse as literal, don't
 * care what it really is
 * @return {Node}
 */
export function parseSpecialLiteral() {

  let node = new Node.Literal();

  node.type = this.current.name;
  node.value = this.current.value;
  node.raw = this.current.value;
  this.next();

  return (node);

}