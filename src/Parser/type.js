import {
  Token,
  Types as Type,
  TokenList as TT
} from "../labels";

import Node from "../nodes";

/*
  [x] tuple
  [ ] function arguments
*/
export function parseType() {

  let node = new Node.TypeAnnotation();

  if (this.eat(TT.COLON)) {
    this.eat(TT.INOUT);
    /** id:(type,type) */
    if (this.peek(TT.LPAREN)) {
      node.type = this.parseTupleType();
    /** id:type */
    } else {
      if (this.isNativeType(this.current.name)) {
        node.type = this.current.name;
        this.next();
      } else {
        console.error("Unknown type", this.current);
      }
    }
  } else if (this.peek(TT.ASSIGN)) {
    node.type = -1;
  }

  return (node);

}

/**
 * @param  {Number}  type
 * @return {Boolean}
 */
export function isNativeType(type) {
  switch (type) {
    case TT.VOID:
    case TT.INT:
    case TT.INT8:
    case TT.UINT8:
    case TT.INT32:
    case TT.INT64:
    case TT.UINT64:
    case TT.DOUBLE:
    case TT.FLOAT:
    case TT.BOOLEAN:
    case TT.STRING:
    case TT.CHARACTER:
      return (true);
    break;
    default:
      return (false);
    break;
  };
}