import {
  Token,
  Types as Type,
  TokenList as TT
} from "./labels";

import Node from "./nodes";

import {
  getNameByLabel
} from "./utils";

/**
 * @class Scope
 * @export
 */
export default class Scope {

  /**
   * @param {Node} scope
   * @param {Node} parent
   * @constructor
   */
  constructor(scope, parent) {

    /**
     * Scope
     * @type {Node}
     */
    this.scope = scope;

    /**
     * Parent
     * @type {Node}
     */
    this.parent = parent;

    /**
     * Symbol table
     * @type {Object}
     */
    this.table = {};

  }

  /**
   * Get sth from table
   * @param  {String} name
   * @return {Node}
   */
  getLocal(name) {
    if (this.table[name] !== void 0) {
      return (this.table[name]);
    } else {
      if (this.parent !== void 0) {
        return (this.parent.getLocal(name));
      }
    }
  }

  /**
   * Get sth from scope by type
   * @param  {Number} type
   * @return {Node}
   */
  getByType(type) {
    if (this.scope && this.scope.kind === type) {
      return (this.scope);
    } else {
      if (this.parent !== void 0) {
        return (this.parent.getByType(type));
      }
    }
  }

  /**
   * Get name of node
   * @param {Node} node
   * @return {String}
   */
  getName(node) {
    return (
      node.value || node.raw || node.name || node.id || (node.init ? this.getName(node.init) : void 0)
    );
  }

  /**
   * Set sth into table
   * @param {Node} node
   * @param {String} name
   * @return {Boolean}
   */
  register(node, name) {
    name = name || this.getName(node);
    if (name) {
      if (this.parent !== void 0) {
        //console.log(`Registered ${name}->${this.getName(this.scope)}:${getNameByLabel(this.scope.kind)}`);
      }
      this.table[name] = node;
      return (true);
    }
    return (false);
  }

}