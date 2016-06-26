import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import Node from "../../nodes";

import {
  getNameByLabel
} from "../../utils";

/*
  [ ] import
  [x] constant
  [x] variable
  [ ] typealias
  [ ] function
  [ ] enum
  [ ] struct
  [ ] class
  [ ] protocol
  [ ] initializer
  [ ] deinitializer
  [ ] extension
  [ ] subscript
  [ ] operator
  @return {Node}
*/
export function parseDeclarationStatement() {

  let node = null;

  switch (this.current.name) {
    case TT.IMPORT:
      node = this.parseImport();
    break;
    case TT.VAR:
    case TT.CONST:
      node = this.parseVariable();
    break;
    case TT.TYPEALIAS:
      //
    break;
    case TT.FUNCTION:
      node = this.parseFunction();
    break;
    case TT.ENUM:
      node = this.parseEnum();
    break;
    case TT.STRUCT:
      node = this.parseStruct();
    break;
    case TT.CLASS:
      node = this.parseClass();
    break;
    case TT.PROTOCOL:
      node = this.parseProtocol();
    break;
    case TT.EXTENSION:
      node = this.parseExtension();
    break;
    case TT.POSTFIX:
    case TT.PREFIX:
    case TT.INFIX:
      node = this.parseOperatorDeclaration();
    break;
  };

  this.eat(TT.SEMICOLON);

  return (node);

}