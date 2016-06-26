import Parser from "./Parser";
import Compiler from "./Compiler";
import Tokenizer from "./Tokenizer";

import * as globals from "./Environment/global";

import {
  VERSION
} from "./const";

import {
  greet
} from "./utils";

const parse = (tokens) => {
  let parser = new Parser();
  return (parser.parse(tokens));
};

const tokenize = (code, opts) => {
  let tokenizer = new Tokenizer();
  return (tokenizer.scan(code, opts));
};

const compile = (ast, opts) => {
  let compiler = new Compiler();
  return (compiler.compile(ast, opts));
};

let global = {};
for (let key in globals) {
  if (globals.hasOwnProperty(key)) {
    global[key] = globals[key];
  }
}

greet();

export {
  parse,
  tokenize,
  compile,
  global,
  VERSION
}

if (typeof window !== "undefined") {
  window.hevia = {
    parse,
    tokenize,
    compile,
    global,
    VERSION
  };
}