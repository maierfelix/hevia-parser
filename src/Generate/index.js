import {
  TOKEN
} from "../Tokenize/tokens";

import { Types } from "../Parse/nodes";

/**
 * Compiler
 * @class Compiler
 * @export
 */
export default class Compiler {

  /**
   * @constructor
   */
  constructor() {
    this.output = "";
    this.scope = null;
  }

  reset() {
    this.output = "";
  }

  write(str) {
    this.output += str;
  }

  /**
   * Enter new scope
   * @param {Scope} scope
   */
  pushScope(scope) {
    this.scope = scope;
  }

  /** Enter previous scope */
  popScope() {
    this.scope = this.scope.parent;
  }

  /**
   * Binexp eval
   * @param  {Number} l
   * @param  {Number} r
   * @param  {String} o
   * @return {Number}
   */
  evaluateBinaryExpression(l, r, o) {

    switch (o) {
      case "+":
        return (l + r);
      break;
      case "-":
        return (l - r);
      break;
      case "*":
        return (l * r);
      break;
      case "/":
        return (l / r);
      break;
      case ">":
        return (l > r);
      break;
      case "<":
        return (l < r);
      break;
      case "%":
        return (l < r);
      break;
      case "==":
        return (l === r);
      break;
    }

  }

  /**
   * Compile binexp
   * @param {Node} ast
   */
  compileBinaryExpression(ast) {
    this.write(this.compileBinary(ast));
  }

  /**
   * Numeric check
   * @param  {*}  value
   * @return {Boolean}
   */
  isNumber(value) {
    return (
      (Number(value) >= 0 || Number(value) < 0)
    );
  }

  /**
   * Compile binexp
   * @param  {Node} ast
   * @return {String}
   */
  compileBinary(ast) {

    if (ast.left && ast.right) {
      let op = this.compileOperand(ast.operator);
      let left = this.compileBinary(ast.left);
      let right = this.compileBinary(ast.right);
      if (this.isNumber(left) && this.isNumber(right)) {
        return (this.evaluateBinaryExpression(left, right, op));
      } else {
        return (left + op + right);
      }
    }

    return (this.compileIdentifier(ast));

  }

  /**
   * Compile identifier
   * @param  {Node} ast
   * @return {String}
   */
  compileIdentifier(ast) {

    let parent = null;

    if (ast.kind === Types.Identifier) {
      if ((parent = this.scope.get(ast.name, this.scope))) {
        /** Check if parent is a inout reference */
        if (parent.kind === Types.Parameter) {
          /** Declared as pointer */
          if (ast.isPointer) {
            return (ast.name);
          }
          /** Parent is a reference */
          if (!ast.isPointer && parent.reference) {
            return (`${ast.name}.value`);
          }
        } else {
          /** Pass into function as pointer */
          if (ast.isPointer) {
            return (ast.name);
          }
          if (parent.isReference) {
            return (`${ast.name}.value`);
          }
        }
      }
    } else if (
      ast.kind === Types.Literal ||
      ast.kind === Types.Parameter
    ) {
      return (ast.value);
    }

    return (ast.name);

  }

  /**
   * Compile operand
   * @param  {Number} op
   * @return {String}
   */
  compileOperand(op) {

    switch (op) {
      case TOKEN["*"]:
        return ("*");
      break;
      case TOKEN["/"]:
        return ("/");
      break;
      case TOKEN["+"]:
        return ("+");
      break;
      case TOKEN["-"]:
        return ("-");
      break;
      case TOKEN[">"]:
        return (">");
      break;
      case TOKEN["<"]:
        return ("<");
      break;
      case TOKEN["="]:
        return ("=");
      break;
      case TOKEN["%"]:
        return ("%");
      break;
      case TOKEN["=="]:
        return ("==");
      break;
      default:
        console.error("Unknown operand:", op);
    };

  }

}