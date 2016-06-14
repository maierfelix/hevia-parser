import { getNumericType } from "../utils";

import Node from "./nodes";
import { Types } from "./nodes";

import {
  TOKEN,
  precedence
} from "../Tokenize/tokens";

/**
 * Accept precedence state
 * @param  {String}  state
 * @return {Boolean}
 */
export function acceptPrecedenceState(state) {
  return (
    state !== void 0 &&
    this.current !== void 0 &&
    state.indexOf(this.current.kind) > -1
  );
}

/**
 * Tuple expr parsing
 * @return {Node}
 */
export function parseTupleExpressions() {

  let args = [];
  let node = null;

  for (;true;) {
    node = new Node.ObjectExpression();
    node.name = this.current.value;
    this.next();
    this.expect(TOKEN[":"]);
    node.init = this.parseExpression(0);
    args.push(node);
    if (this.peek(TOKEN[","])) {
      this.next();
    } else break;
  };

  return (args);

}

/**
 * Recursive operator precedence based
 * binary expression parsing
 * @param  {Number} id
 * @return {Object}
 */
export function parseExpression(id) {

  let state = null;
  let ast = null;
  let parent = null;
  let tmp = null;

  state = precedence[id];

  if (state === void 0) {
    ast = this.parseUnary();
  } else {
    ast = this.parseExpression(id + 1);
  }

  for (;this.acceptPrecedenceState(state);) {
    if (this.peek(TOKEN["."])) {
      parent = new Node.MemberExpression();
    } else {
      parent = new Node.BinaryExpression();
    }
    parent.operator = this.current.kind;
    parent.left = ast;
    this.next();
    tmp = (state === void 0 ? this.parseUnary() : this.parseExpression(id + 1));
    if (tmp === null) return (null);
    parent.right = tmp;
    ast = parent;
    this.eat(TOKEN[";"]);
  };

  return (ast);

}

/**
 * Parse unary
 * @return {Object}
 */
export function parseUnary() {

  let ast = null;
  let tmp = null;

  if (this.peek(TOKEN["-"]) === true) {
    ast = new Node.BinaryExpression();
    ast.operator = this.current.kind;
    tmp = new Node.Literal();
    tmp.name = "NUMBER";
    tmp.value = 0;
    ast.right = tmp;
    this.next();
    if ((tmp = this.parseBase()) === null) return (null);
    ast.left = tmp;
  }
  else if (this.peek(TOKEN["!"]) === true) {
    ast = new Node.UnaryExpression();
    ast.operator = this.current.kind;
    this.next();
    ast.init = this.parseExpression(0);
  }
  else {
    if (this.peek(TOKEN["+"]) === true) {
      this.next();
    }
    if (!(ast = this.parseBase())) return (null);
  }

  return (ast);

}

/**
 * Parse base
 * @return {Object}
 */
export function parseBase() {

  let ast = null;

  if (this.peek(TOKEN["self"])) {
    ast = new Node.Self();
    this.next();
  }

  else if (
    this.peek(TOKEN["true"]) ||
    this.peek(TOKEN["false"])
  ) {
    ast = new Node.Identifier();
    ast.name = this.current.value;
    this.next();
  }

  else if (this.peek(TOKEN["number"]) === true) {
    ast = new Node.Literal();
    ast.value = Number(this.current.value);
    let type = new Node.Type();
    type.type = getNumericType(ast.value);
    ast.type = type;
    this.next();
  }

  else if (this.peek(TOKEN["string"]) === true) {
    ast = new Node.Literal();
    ast.name = this.current.name;
    ast.value = this.current.value;
    this.next();
  }

  else if (this.peek(TOKEN["("]) === true) {
    this.next();
    ast = this.parseExpression(0);
    this.next();
  }

  else if (this.peek(TOKEN["&"]) === true) {
    this.next();
    if (this.peek(TOKEN["identifier"])) {
      ast = this.parseExpression(0);
    }
    ast.isPointer = true;
    let parent = this.scope.get(ast.name);
    if (parent.kind === Types.VariableDeclaration) {
      parent.isReference = true;
    }
  }

  else if (this.peek(TOKEN["identifier"]) === true) {
    ast = new Node.Identifier();
    ast.name = this.current.value;
    this.next();
    /** Call expression */
    if (this.peek(TOKEN["("])) {
      ast = this.parseCallExpression(ast);
    /** Member expression */
    } else if (this.peek(TOKEN[":"])) {
      this.back();
      return (
        this.parseTupleExpressions()
      );
    }
  }

  else if (this.eat(TOKEN["["])) {
    let type = this.parseType("*");
    if (type !== null) {
      ast = new Node.ArrayDeclaration();
      ast.types.push(type);
      if (this.eat(TOKEN["]"])) {
        if (this.peek(TOKEN["("])) {
          ast.param = this.parseExpressionParameters();
        }
        this.eat(TOKEN[";"]);
      }
    }
  }

  return (ast);

}