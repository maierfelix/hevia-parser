import { isNumericType } from "../utils";

/**
 * ArrayConstructor
 * @class ArrayConstructor
 * @export
 */
export class ArrayConstructor {

  /**
   * @param {Object} opts
   * @constructor
   */
  constructor(opts) {

    this.data = null;
    this.count = 0;

    this.init(opts);

  }

  /**
   * Initialise
   * @param {Object} opts
   */
  init(opts) {
    if (opts.count !== void 0) {
      this.data = Array.from(new Array(opts.count), () => 0);
      this.count = this.data.length;
    } else {
      this.data = [];
    }
    if (opts.repeatedValue !== void 0 && this.data.length > 0) {
      this.data.fill(opts.repeatedValue);
    }
  }

  /**
   * Append
   * @param {*} value
   */
  append(value) {
    this.data.push(value);
    this.count += 1;
  }

}

class Child {

  constructor(instance, type, name, value) {
    this.instance = instance;
    this.type = type;
    this.name = name;
    this.value = value;
  }

  get rawValue() {
    return (this.value);
  }

}

/**
 * Enumeration
 * @class Enumeration
 * @export
 */
export class Enumeration {

  /**
   * @param {Type} type
   * @param {Array} childs
   * @constructor
   */
  constructor(type, childs) {

    let value = null;
    let iterator = 0;

    childs.map((c) => {
      if (c.value !== void 0) {
        if (isNumericType(type)) {
          iterator = value = c.value;
        } else {
          value = c.value;
        }
      } else {
        value = iterator;
      }
      this[c.name] = new Child(this, type, c.name, value);
      ++iterator;
    });

  }

}