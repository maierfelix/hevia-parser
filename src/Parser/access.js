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

  let name = this.current.name;

  this.next();

  let node = this.parseStatement();

  switch (name) {
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

  node.isFinal = true;

  return (node);

}

/**
 * @return {Node}
 */
export function parseOverride() {

  this.expect(TT.OVERRIDE);

  let node = this.parseStatement();

  node.isOverride = true;

  return (node);

}

/**
 * @return {Node}
 */
export function parseStatic() {

  this.expect(TT.STATIC);

  let node = this.parseStatement();

  node.isStatic = true;

  return (node);

}