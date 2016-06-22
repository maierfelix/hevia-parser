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
      this.table[name] = node;
    }
  }

}