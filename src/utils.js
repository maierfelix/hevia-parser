import {
  Token,
  Types as Type,
  TokenList as TT
} from "./labels";

import Node from "./nodes";

import {
  VERSION
} from "./const";

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
 * Debug helper
 */
export function getNameByLabel(name) {
  if (Token[name] !== void 0) {
    return (Token[name]);
  }
  else if (TT[name] !== void 0) {
    return (TT[name]);
  }
  else if (Type[name] !== void 0) {
    return (Type[name]);
  }
  return (null);
}

/**
 * @param {Number} n
 * @return {String}
 */
export function getLabelByNumber(n) {
  for (let key in TT) {
    if (TT[key] === n) {
      return (key);
    }
  };
  return (null);
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

/**
 * @param  {Node} node
 * @return {Boolean}
 */
export function isBoolean(node) {
  return (
    node.kind === Type.Literal &&
    (
      node.type === TT.TRUE ||
      node.type === TT.FALSE
    )
  );
}

/**
 * @param {Node}
 * @return {Boolean}
 */
export function isLiteral(name) {
  switch (name) {
    case TT.NULL:
    case TT.LPAREN:
    case TT.SELF:
    case TT.BIT_AND:
    case TT.UL:
    case TT.TRUE:
    case TT.FALSE:
    case Token.Identifier:
    case Token.NullLiteral:
    case Token.StringLiteral:
    case Token.NumericLiteral:
    case Token.BooleanLiteral:
      return (true);
    break;
  };
  return (false);
}

/**
 * @param {String} value
 * @return {Boolean}
 */
export function isNativeType(value) {
  switch (value) {
    case "Void":
    case "Int":
    case "Int8":
    case "Uint8":
    case "Int32":
    case "Int64":
    case "Uint64":
    case "Double":
    case "Float":
    case "Boolean":
    case "String":
    case "Character":
      return (true);
    break;
    default:
      return (false);
    break;
  };
}

/**
 * @param  {Number} n
 * @return {String}
 */
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
    return ("Double");
  }
}

export function greet() {

  if (
    typeof navigator !== "undefined" &&
    navigator.userAgent.toLowerCase().indexOf("chrome") > -1
  ) {
    var args = [
      `\n%c Hevia.js ${VERSION} %c %chttp://www.heviajs.com/ %c\n\n`,
      "color: #fff; background: #030307; padding:5px 0;",
      "color: #9598b9; background: #2d316b; padding:5px 0;",
      "color: #9598b9; background: #2d316b; padding:5px 0;",
      "color: #9598b9; background: #2d316b; padding:5px 0;"
    ];
    console.log.apply(console, args);
  } else {
    console.log("Hevia.js - " + VERSION + " - http://www.heviajs.com/\n");
  }

}