import Lexer from "./Tokenize";
import Parser from "./Parse";
import Runtime from "./Runtime";
import JavaScript from "./Generate/JavaScript";

import beautify from "js-beautify";

(() => {

  /**
   * Clam
   * @class Clam
   */
  class Clam {

    /** @constructor */
    constructor() {

      this.lexer = new Lexer();
      this.parser = new Parser();
      this.runtime = new Runtime();
      this.compiler = new JavaScript();

    }

    fetch(url, resolve) {

      let opts = { method: "get" };

      fetch(url, opts).then((resp) => {
        return (resp.text());
      }).then((txt) => { 
        resolve(txt);
      });

    }

    compile(stream) {

      let tokens = this.lexer.lex(stream);
      let ast = this.parser.parse(tokens);
      let jsResult = this.compiler.compile(ast, this);

      return (beautify(jsResult, {indent_size: 2}));

    }

    run(compiled) {
      this.compiler.run(compiled);
    }

  }(() => window.Clam = exports.Clam = Clam)();

})();