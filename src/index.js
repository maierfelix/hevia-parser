import Parser from "./Parser";
import Tokenizer from "./Tokenizer";

import "./build";

import { greet } from "./utils";
import { VERSION } from "./const";

const parse = (tokens) => {
  let parser = new Parser();
  return (parser.parse(tokens));
};

const tokenize = (code, opts) => {
  let tokenizer = new Tokenizer();
  return (tokenizer.scan(code, opts));
};

greet();

export default {
  parse,
  tokenize,
  VERSION
}

if (typeof window !== "undefined") {
  window.hevia = {
    parse,
    tokenize,
    VERSION
  };
}