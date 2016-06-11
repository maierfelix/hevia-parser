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
 * Object expr parsing
 * @return {Node}
 */
export function parseObjectExpressions() {

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
 * Recursive memberexpr parsing
 * @return {Node}
 */
export function parseMemberExpression(ast) {

  let tmp = null;
  let parent = null;

  for (;this.eat(TOKEN["."]);) {
    parent = new Node.MemberExpression();
    parent.object = ast.body;
    tmp = this.parseMemberExpression(ast);
    parent.property = this.parseStatement().body;
    ast = parent;
  };

  return (ast);

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

  ast = state === void 0 ? this.parseUnary() : this.parseExpression(id + 1);

  for (;this.acceptPrecedenceState(state) === true;) {
    parent = new Node.BinaryExpression();
    parent.operator = this.current.kind;
    parent.left = ast;
    this.next();
    tmp = (state === void 0 ? this.parseUnary() : this.parseExpression(id + 1));
    if (tmp === null) return (null);
    parent.right = tmp;
    ast = parent;
    if (this.peek(TOKEN[";"])) {
      this.next();
    }
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

  if (
    this.peek(TOKEN["true"])  === true ||
    this.peek(TOKEN["false"]) === true
  ) {
    ast = new Node.Identifier();
    ast.name = this.current.value;
    this.next();
    return (ast);
  }

  if (this.peek(TOKEN["number"]) === true) {
    ast = new Node.Literal();
    ast.name = this.current.name;
    ast.value = Number(this.current.value);
    this.next();
    return (ast);
  }

  if (this.peek(TOKEN["string"]) === true) {
    ast = new Node.Literal();
    ast.name = this.current.name;
    ast.value = this.current.value;
    this.next();
    return (ast);
  }

  if (this.peek(TOKEN["("]) === true) {
    this.next();
    ast = this.parseExpression(0);
    this.next();
    return (ast);
  }

  if (this.peek(TOKEN["&"]) === true) {
    this.next();
    if (this.peek(TOKEN["identifier"])) {
      ast = this.parseExpression(0);
    }
    ast.isPointer = true;
    let parent = this.scope.get(ast.name);
    if (parent.kind === Types.VariableDeclaration) {
      parent.isReference = true;
    }
    return (ast);
  }

  if (this.peek(TOKEN["identifier"]) === true) {
    ast = new Node.Identifier();
    ast.name = this.current.value;
    this.next();
    /** Call expression */
    if (this.peek(TOKEN["("])) {
      return (
        this.parseCallExpression(ast)
      );
    }
    /** Member expression */
    if (this.peek(TOKEN[":"])) {
      this.back();
      return (
        this.parseObjectExpressions()
      );
    }
    return (ast);
  }

  if (this.eat(TOKEN["["])) {
    let type = this.parseType(this.current, "*");
    if (type !== null) {
      ast = new Node.ArrayDeclaration();
      ast.types.push(type);
      if (this.eat(TOKEN["]"])) {
        if (this.peek(TOKEN["("])) {
          ast.param = this.parseExpressionParameters();
        }
        this.eat(TOKEN[";"]);
        return (ast);
      }
    }
    return (ast); 
  }

  return (ast);

}