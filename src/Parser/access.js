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