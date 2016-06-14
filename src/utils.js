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

/**
 * Numeric type check
 * @param  {Type}  type
 * @return {Boolean}
 */
export function isNumericType(type) {
  return (
    type === "Int" ||
    type === "Int8" ||
    type === "UInt8" ||
    type === "Int32" ||
    type === "UInt32" ||
    type === "Int64" ||
    type === "UInt64" ||
    type === "Double" ||
    type === "Float"
  );
}

export function getNumericType(n) {
  if (+n === n && !(n % 1)) {
    return ("Int");
  }
  if (+n === n && !(n % 1) && n < 0x80 && n >= -0x80) {
    return ("Int8");
  }
  if (+n === n && !(n % 1) && n < 0x8000 && n >= -0x8000) {
    return ("Int16");
  }
  if (+n === n && !(n % 1) && n < 0x80000000 && n >= -0x80000000) {
    return ("Int32");
  }
  if (+n === n && !(n % 1) && n >= 0) {
    return ("Uint");
  }
  if (+n === n && !(n % 1) && n < 0x100 && n >= 0) {
    return ("Uint8");
  }
  if (+n === n && !(n % 1) && n < 0x10000 && n >= 0) {
    return ("Uint16");
  }
  if (+n === n && !(n % 1) && n < 0x100000000 && n >= 0) {
    return ("Uint32");
  }
  if (+n === n && !(n % 1) && n < 0x100000000 && n >= 0) {
    return ("Uint32");
  }
  if (+n === n) {
    return ("Float");
  }
  if (+n === n && Math.abs(n) <= 3.4028234e+38) {
    return ("Float32");
  }
  if (+n === n && Math.abs(n) <= 1.7976931348623157e+308) {
    return ("Float64");
  }
}