/**
 * @param {Object} cls
 * @param {Object} prot
 * @export
 */
export function inherit(cls, prot) {

  let key = null;

  for (key in prot) {
    if (prot[key] instanceof Function) {
      cls.prototype[key] = prot[key];
    }
  };

}

let hashIndex = -1;
let hashes = [];

/**
 * Generate a unique hash
 * @return {Number}
 * @export
 */
export function uHash() {

  let index = ++hashIndex;

  if (hashes.indexOf(index) > -1) return (this.uHash());

  hashes.push(index);

  return (index);

}

/**
 * Converts a string into corresponding type
 * @param {String} value
 * @return {*}
 */
export function parseString(value) {

  let isNumber  = Number(value) >= 0 || Number(value) < 0;
  let isBoolean = value === "true"   || value === "false";
  let isString  = !isNumber && !isBoolean;

  return ({
    isString: isString,
    isNumber:  isNumber,
    isBoolean: isBoolean
  });

}