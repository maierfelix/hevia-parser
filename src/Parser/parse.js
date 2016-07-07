import {
  Token,
  Types as Type,
  TokenList as TT,
  Operators as OP
} from "../labels";

import Node from "../nodes";

import {
  getNameByLabel
} from "../utils";

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
      throw new Error(`Expected ${getNameByLabel(kind)} but got ${getNameByLabel(this.current.name)} in ${loc.start.line}:${loc.end.column}`);
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
  this.previous = this.current = this.tokens[this.index];
}

/**
 * @return {Node}
 */
export function parseProgram() {

  let node = new Node.Program();

  if (this.current === void 0) return (node);

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
  for (let key of tokens) {
    //console.log(getNameByLabel(key.name), key.value);
  };
  return (this.parseProgram());
}

/**
 * Accept precedence
 * @param  {Object}  token
 * @param  {Number}  state
 * @return {Boolean}
 */
export function acceptPrecedence(state) {
  if (state !== void 0 && this.current) {
    // Custom infix operator
    if (getNameByLabel(this.current.name) === "Identifier") {
      return (TT[state.op] === TT[this.current.value]);
    }
    return (TT[state.op] === this.current.name);
  }
  return (false);
}

/**
 * @param  {Number}  name
 * @return {Boolean}
 */
export function isOperator(name) {
  return (
    getNameByLabel(name) in OP
  );
}