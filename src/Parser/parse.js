import {
  Token,
  Types as Type,
  TokenList as TT
} from "../labels";

import Node from "../nodes";
import Scope from "../scope";

/**
 * Enter new scope
 * @param {Node} node
 */
export function pushScope(node) {
  node.context = new Scope(node, this.scope);
  this.scope = node.context;
}

/** Leave current scope */
export function popScope() {
  this.scope = this.scope.parent;
}

/**
 * Extract
 * @param  {Number} kind
 * @return {Boolean}
 */
export function extract(kind) {
  let tmp = null;
  if (this.peek(kind)) {
    tmp = this.current;
    this.expect(kind);
    return (tmp);
  }
  return (tmp);
}

/**
 * Eat
 * @param  {Number} kind
 * @return {Boolean}
 */
export function eat(kind) {
  if (this.peek(kind)) {
    this.next();
    return (true);
  }
  return (false);
}

/**
 * Peek
 * @param  {Number} name
 * @return {Boolean}
 */
export function peek(name) {
  return (
    this.current !== void 0 &&
    this.current.name === name
  );
}

/**
 * Next token
 * @return {Boolean}
 */
export function next() {
  if (this.index < this.tokens.length) {
    this.index++;
    this.previous = this.current;
    this.current = this.tokens[this.index];
    return (true);
  }
  return (false);
}

/**
 * Previous token
 * @return {Boolean}
 */
export function back() {
  if (this.index < this.tokens.length) {
    this.index--;
    this.previous = this.current;
    this.current = this.tokens[this.index];
    return (true);
  }
  return (false);
}

/**
 * Expect token
 * @param  {Number} kind
 * @return {Boolean}
 */
export function expect(kind) {
  if (!this.peek(kind)) {
    if (this.current !== void 0) {
      let loc = this.current.loc;
      console.error(`Expected ${this.getNameByLabel(kind)} but got ${this.getNameByLabel(this.current.name)} in ${loc.start.line}:${loc.end.column}`);
    }
    return (false);
  }
  this.next();
  return (true);
}

/**
 * Reset
 * @param {Array} tokens
 */
export function reset(tokens) {
  this.index = 0;
  this.tokens = tokens;
  this.scopes = {};
  this.previous = this.current = this.tokens[this.index];
}

/**
 * Debug helper
 */
export function getNameByLabel(label) {
  if (Token[label] !== void 0) {
    return (Token[label]);
  }
  else if (TT[label] !== void 0) {
    return (TT[label]);
  }
  else if (Type[label] !== void 0) {
    return (Type[label]);
  }
  return (null);
}

/**
 * @return {Node}
 */
export function parseProgram() {

  let node = new Node.Program();

  this.scope = void 0;
  this.pushScope(node);

  node.body = this.parseBlock();

  return (node);

}

/**
 * @return {Node}
 */
export function parseBlock() {

  let node = new Node.BlockStatement();
  let statement = null;

  while ((statement = this.parseStatement()) !== null) {
    node.body.push(statement);
    if (this.current === void 0) break;
  };

  return (node);

}

/**
 * @return {Node}
 */
export function parse(tokens) {
  this.reset(tokens);
  return (this.parseProgram());
}