import {
  Token,
  Types as Type,
  TokenList as TT
} from "../labels";

import Node from "../nodes";

import {
  getNameByLabel
} from "../utils";

import * as scan from "../Tokenizer/scanner";

/**
 * @return {Node}
 */
export function parseComment() {

  let node = new Node.Comment();
  let type = this.current.type;

  node.arguments = this.parseBlockComment(this.current.value);

  this.next();

  return (node);

}

/**
 * @return {Array}
 */
export function parseBlockComment(str) {

  let args = [];

  let ch = null;
  let cp = -1;
  let record = false;

  let index = 0;
  let length = str.length;

  let out = "";

  while (index < length) {
    ch = str[index];
    cp = ch.charCodeAt(0);
    if (record) {
      if (
        !scan.isWhiteSpace(cp) &&
        !scan.isLineTerminator(cp)
      ) {
        // Dont allow commas
        if (cp !== 44) {
          out += ch;
        }
        if (index + 1 >= length) {
          args.push(out);
          record = false;
        }
      }
      else {
        args.push(out);
        record = false;
      }
    }
    if (ch === "#") {
      out = "";
      record = true;
    }
    index++;
  };

  return (args);

}

/**
 * @return {Array}
 */
export function parseLineComment(str) {

  let args = [];

  return (args);

}