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

const generate = (ast, opts) => {
  let compiler = new Compiler();
  return (compiler.compile(ast, opts));
};

let global = {};
for (let key in globals) {
  if (globals.hasOwnProperty(key)) {
    global[key] = globals[key];
  }
}

const compile = (src) => {

  var tokens = null;
  var ast = null;
  var code = null;

  console.time("Generated in");

  tokens = tokenize(src);
  ast = parse(tokens);
  code = generate(ast, "JS");

  console.timeEnd("Generated in");

  return (code);

};

const evaluate = (code) => {
  new Function("__global", code)(global);
};

greet();

export {
  parse,
  tokenize,
  generate,
  evaluate,
  compile,
  global,
  VERSION
}

if (typeof window !== "undefined") {
  window.hevia = {
    parse,
    tokenize,
    generate,
    global,
    evaluate,
    compile,
    VERSION
  };
}