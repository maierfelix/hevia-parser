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