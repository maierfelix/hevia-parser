import {
  inherit
} from "../utils";

import Scope from "../scope";

import * as pack from "./lang";
import * as inference from "./inference";
import * as globals from "../Environment/global";

import * as compile from "./compile";
import * as statement from "./compile/statement";
import * as expression from "./compile/expression";
import * as declaration from "./compile/declaration";

/**
 * @class Compiler
 * @export
 */
export default class Compiler {

  /** @constructor */
  constructor() {

    /**
     * Scope
     * @type {Scope}
     */
    this.scope = null;

    /**
     * Extensions
     * @type {Object}
     */
    this.extensions = {};

    /**
     * Operators
     * @type {Object}
     */
    this.operators = {};

    /**
     * Global objects
     * @type {Object}
     */
    this.global = globals;

    /**
     * Compiled output
     * @type {String}
     */
    this.output = "";

  }

  reset() {
    this.scope = void 0;
    this.output = "";
    this.operators = {};
    this.extensions = {};
  }

  /** 
   * Write
   * @param {String} str
   */
  write(str) {
    this.output += str;
  }

  /**
   * Enter scope
   * @param {Node} node
   */
  pushScope(node) {
    node.context = new Scope(node, this.scope);
    this.scope = node.context;
  }

  /** Leave scope */
  popScope() {
    this.scope = this.scope.parent;
  }

  /**
   * Literal contains type only
   * @param  {Node}  ast
   * @return {Boolean}
   */
  isPureType(node) {
    return (
      node.value === void 0 &&
      node.raw === void 0 &&
      node.type >= 0 ||
      node.type <= 0
    );
  }

  /**
   * @param {Node} ast
   * @param {String} lang
   * @return {String}
   */
  compile(ast, lang) {
    this.reset();
    this.scope = void 0;
    this.pushScope(ast.body);
    this.compileProgram(ast.body);
    this.initLanguage(lang);
    this.emitProgram(ast.body);
    return (this.output);
  }

  /**
   * @param {String} lang
   */
  initLanguage(lang) {

    switch (lang) {
      case "JS":
        lang = "JavaScript";
        inherit(Compiler, pack.JavaScript);
      break;
      case "JAVA":
        lang = "Java";
        inherit(Compiler, pack.Java);
      break;
      default:
        console.error(`Unknown target language.`);
      break;
    }

    //console.log(`Compiling to ${lang}`);

  }

  /**
   * Check if the passed in string
   * can be used as a variable head
   * @param  {String} str
   * @return {Boolean}
   */
  validName(str) {
    if (typeof str !== "string") return (false);
    try {
      new Function("var " + str)();
    } catch (e) {
      return (false);
    }
    return (true);
  }

}

inherit(Compiler, inference);

inherit(Compiler, compile);
inherit(Compiler, statement);
inherit(Compiler, expression);
inherit(Compiler, declaration);