export const precedence = [
  [28],
  [13],
  [14],
  [26, 27],
  [23, 22, 25, 24],
  [16, 17],
  [18, 19, 20]
];

/**
 * Tokens to match
 * @type {Object}
 */
export const TOKEN = {
  /** Punctuators */
  "(": 0,
  ")": 1,
  "[": 2,
  "]": 3,
  "{": 4,
  "}": 5,
  ":": 6,
  ";": 7,
  ".": 8,
  "?": 9,
  "$": 10,
  "@": 11,
  /** Logical operators */
  "!": 12,
  "||": 13,
  "&&": 14,
  /** Binary operators */
  ",": 15,
  "+": 16,
  "-": 17,
  "*": 18,
  "/": 19,
  "%": 20,
  "^": 21,
  /** Compare operators */
  "<": 22,
  "<=": 23,
  ">": 24,
  ">=": 25,
  "==": 26,
  "!=": 27,
  /** Assignment operators */
  "=": 28,
  /** Bitwise operators */
  "~": 29,
  "|": 30,
  "&": 31,
  /** Literals */
  "null": 32,
  "true": 33,
  "false": 34,
  /** Keywords */
  "if": 35,
  "else": 36,
  "while": 37,
  "do": 38,
  "for": 39,
  "func": 40,
  "let": 41,
  "let": 42,
  "const": 43,
  "return": 44,
  "import": 45,
  "export": 46,
  "inout": 47,
  "enum": 48,
  "->": 49,
  /** Types for lexer */
  "identifier": 50,
  "string": 51,
  "number": 52,
  /** Things to ignore */
  " ": 53,
  "\t": 54,
  "\n": 55,
  "\r": 56,
  "\f": 57,
  "\v": 58,
  /** Real data types */
  "Void": 59,
  "Int": 60,
  "Int8": 61,
  "UInt8": 62,
  "Int32": 63,
  "Int64": 64,
  "UInt64": 65,
  "Double": 66,
  "Float": 67,
  "Bool": 68,
  "String": 69,
  "Character": 70
};

/**
 * Tokens to ignore
 * @type {Array}
 */
export const IGNORE = [
  53, 54, 55, 56, 57, 58
];