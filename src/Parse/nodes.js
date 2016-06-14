/**
 * Numeric node types
 * @type {Object}
 */
export let Types = {
  Program: 0,
  Block: 1,
  ReturnStatement: 2,
  Literal: 3,
  Identifier: 4,
  IfStatement: 5,
  BinaryExpression: 6,
  MemberExpression: 7,
  CallExpression: 8,
  AssignmentExpression: 9,
  FunctionDeclaration: 10,
  Type: 11,
  Statement: 12,
  VariableDeclaration: 13,
  ImportStatement: 14,
  Enumeration: 15,
  Parameter: 16,
  MemberExpression: 17,
  MultipleVariableDeclaration: 18,
  ArrayDeclaration: 19,
  ObjectExpression: 20,
  EnumParameter: 21,
  ExtensionExpression: 22,
  Self: 23
};

/**
 * Node
 * @class Node
 * @export
 */
export default class Node {

  constructor() {}

  static get ExtensionExpression() {
    return (
      class ExtensionExpression {
        constructor() {
          this.kind = Types.ExtensionExpression;
          this.type = null;
          this.body = [];
        }
      }
    );
  }

  static get ArrayDeclaration() {
    return (
      class ArrayDeclaration {
        constructor() {
          this.kind = Types.ArrayDeclaration;
          this.types = [];
          this.param = [];
        }
      }
    );
  }

  static get ObjectExpression() {
    return (
      class ObjectExpression {
        constructor() {
          this.kind = Types.ObjectExpression;
          this.name = null;
          this.init = null;
        }
      }
    );
  }

  static get MemberExpression() {
    return (
      class MemberExpression {
        constructor() {
          this.kind = Types.MemberExpression;
          this.left   = null;
          this.right = null;
        }
      }
    );
  }

  static get Enumeration() {
    return (
      class Enumeration {
        constructor() {
          this.kind = Types.Enumeration;
          this.body = [];
        }
      }
    );
  }

  static get Parameter() {
    return (
      class Parameter {
        constructor() {
          this.kind = Types.Parameter;
          this.name = null;
          this.type = null;
          this.isReference = false;
        }
      }
    );
  }

  static get EnumParameter() {
    return (
      class EnumParameter extends this.Parameter {
        constructor() {
          super(null);
          this.kind = Types.EnumParameter;
          this.name = null;
          this.type = null;
          this.argument = null;
        }
      }
    );
  }

  static get Self() {
    return (
      class Self {
        constructor() {
          this.kind = Types.Self;
        }
      }
    );
  }

  static get Type() {
    return (
      class Type {
        constructor() {
          this.kind = Types.Type;
          this.type = null;
        }
      }
    );
  }

  static get FunctionDeclaration() {
    return (
      class FunctionDeclaration {
        constructor() {
          this.kind = Types.FunctionDeclaration;
          this.name = null;
          this.type = null;
          this.param = [];
          this.body = [];
          this.returns = [];
          this.isStatic = false;
        }
      }
    );
  }

  static get Program() {
    return (
      class Program {
        constructor() {
          this.kind = Types.Program;
          this.body = [];
        }
      }
    );
  }

  static get Statement() {
    return (
      class Statement {
        constructor() {
          this.kind = Types.Statement;
          this.body = null;
          this.export = false;
        }
      }
    );
  }

  static get Body() {
    return (
      class Body {
        constructor() {
          this.kind = Types.Body;
          this.body = [];
        }
      }
    );
  }

  static get Block() {
    return (
      class Block {
        constructor() {
          this.kind = Types.Block;
          this.body = [];
        }
      }
    );
  }

  static get ReturnStatement() {
    return (
      class ReturnStatement {
        constructor() {
          this.kind = Types.ReturnStatement;
          this.argument = null;
        }
      }
    );
  }

  static get ImportStatement() {
    return (
      class ImportStatement {
        constructor() {
          this.kind = Types.ImportStatement;
          this.body = [];
        }
      }
    );
  }

  static get VariableDeclaration() {
    return (
      class VariableDeclaration {
        constructor() {
          this.kind = Types.VariableDeclaration;
          this.type = null;
          this.id = null;
          this.init = null;
          this.isReference = false;
          this.isMutable = false;
        }
      }
    );
  }

  static get MultipleVariableDeclaration() {
    return (
      class MultipleVariableDeclaration {
        constructor() {
          this.kind = Types.MultipleVariableDeclaration;
          this.body = [];
        }
      }
    );
  }

  static get Literal() {
    return (
      class Literal {
        constructor() {
          this.kind = Types.Literal;
          this.value = null;
          this.type = null;
        }
      }
    );
  }

  static get Identifier() {
    return (
      class Identifier {
        constructor() {
          this.kind = Types.Identifier;
          this.name = null;
          this.isPointer = false;
        }
      }
    );
  }

  static get IfStatement() {
    return (
      class IfStatement {
        constructor() {
          this.kind = Types.IfStatement;
          this.test  = null;
          this.consequent = null;
          this.alternate  = null;
        }
      }
    );
  }

  static get BinaryExpression() {
    return (
      class BinaryExpression {
        constructor() {
          this.kind = Types.BinaryExpression;
          this.operator = null;
          this.left  = null;
          this.right = null;
        }
      }
    );
  }

  static get CallExpression() {
    return (
      class CallExpression {
        constructor() {
          this.kind = Types.CallExpression;
          this.callee = null;
          this.arguments = [];
        }
      }
    );
  }

  static get AssignmentExpression() {
    return (
      class AssignmentExpression extends BinaryExpression {
        constructor() {
          super(null);
          this.kind = Types.AssignmentExpression;
        }
      }
    );
  }

}