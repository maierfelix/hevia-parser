import Parser from "./Parser";
import Tokenizer from "./Tokenizer";

const parse = (tokens) => {

  let parser = new Parser();

  return (
    parser.parse(tokens)
  );

};

const tokenize = (code, opts) => {

  let tokenizer = new Tokenizer();

  return (tokenizer.scan(code, opts));

};

const version = "0.0.1";

export {
  parse,
  tokenize,
  version
}

if (typeof window !== "undefined") {
  window.swiftly = {
    parse,
    tokenize,
    version
  };
}