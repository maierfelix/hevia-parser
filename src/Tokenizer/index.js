import { tokenize } from "./scanner";

export default class Tokenizer {

  /** @constructor */
  constructor() {}

  scan(code, opts) {
    return tokenize(code, { loc:true });
  }

}