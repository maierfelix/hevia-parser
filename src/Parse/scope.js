import { uHash } from "../utils";
import { Types } from "./nodes";

/**
 * Scope
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

    /**
     * Extension table
     * @type {Object}
     */
    this.extensions = {};

  }

  /**
   * Get sth from table
   * @param  {String} name
   * @return {Node}
   */
  get(name) {
    if (this.table[name] !== void 0) {
      return (this.table[name]);
    } else {
      if (this.parent !== void 0) {
        return (this.parent.get(name));
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
   * Set sth into table
   * @param {Node} node
   */
  register(node) {
    let name = node.value || node.name || node.id;
    if (
      name !== void 0 &&
      name !== null
    ) {
      /** Mark function or variable as global */
      //if (this.scope.kind === Types.Program) node.isGlobal = true;
      this.table[name] = node;
    }
  }

  /**
   * Set sth into table
   * on absolute top
   * @param {Node} node
   */
  registerExtension(node) {
    if (this.parent !== void 0) {
      return (this.parent.registerExtension(node));
    } else {
      let name = node.type.type;
      if (this.extensions[name] === void 0) {
        this.extensions[name] = node;
      /** Already registered */
      } else {
        for (let key of node.body.body) {
          this.extensions[name].body.body.push(key);
        };
      }
    }
  }

  /**
   * Get extension from table
   * @param  {String} name
   * @return {Node}
   */
  getExtension(name) {
    if (this.extensions[name] !== void 0) {
      return (this.extensions[name]);
    } else {
      if (this.parent !== void 0) {
        return (this.parent.getExtension(name));
      }
    }
  }

}