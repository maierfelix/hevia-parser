import Parser from "./Parser";
import Compiler from "./Compiler";
import Tokenizer from "./Tokenizer";

import "./build";

import { greet } from "./utils";
import { VERSION } from "./const";

let global = require("./Environment/global.swift");

let compiler = new Compiler();

const parse = (tokens) => {
  let parser = new Parser();
  return (parser.parse(tokens));
};

const tokenize = (code, opts) => {
  let tokenizer = new Tokenizer();
  return (tokenizer.scan(code, opts));
};

const generate = (ast, opts) => {
  return (compiler.compile(ast, opts));
};

const compile = (src) => {

  let tokens = null;
  let ast = null;
  let code = null;

  tokens = tokenize(src);
  ast = parse(tokens);
  code = generate(ast, "JS");

  return (code);

};

const evaluate = (code) => {
  code = global + code;
  new Function("__global", code)();
};

const setup = () => {

  let tokens = tokenize(global);
  let ast = parse(tokens);
  console.log(ast);

  return (compiler.compile(ast, "JS"));

};

global = setup();
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