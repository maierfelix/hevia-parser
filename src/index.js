import Parser from "./Parser";
import Tokenizer from "./Tokenizer";

import "./build";

import { greet } from "./utils";
import { VERSION } from "./const";

import * as labels from "./labels";

const parse = (tokens) => {
  let parser = new Parser();
  return (parser.parse(tokens));
};

const tokenize = (code, opts) => {
  let tokenizer = new Tokenizer();
  return (tokenizer.scan(code, opts));
};

greet();

module.exports = {
  parse,
  tokenize,
  labels,
  VERSION
}

if (typeof window !== "undefined") {
  window.hevia = module.exports;
}