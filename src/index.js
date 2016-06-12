import Lexer from "./Tokenize";
import Parser from "./Parse";
import Runtime from "./Runtime";
import Semantic from "./Semantic";
import JavaScript from "./Generate/JavaScript";

import beautify from "js-beautify";

(() => {

  /**
   * Swiftly
   * @class Swiftly
   */
  class Swiftly {

    /** @constructor */
    constructor() {

      this.lexer = new Lexer();
      this.parser = new Parser();
      this.runtime = new Runtime();
      this.semantic = new Semantic();
      this.compiler = new JavaScript();

    }

    readProject(files, resolve) {
      let ii = 0;
      let out = "";
      files.map((file) => {
        this.fetch(file, (src) => {
          ++ii;
          out += src;
          if (ii >= files.length) resolve(out);
        });
      });
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
      this.semantic.analyze(ast);
      let jsResult = this.compiler.compile(ast, this);

      return (beautify(jsResult, {indent_size: 2}));

    }

    run(compiled) {
      this.compiler.run(compiled);
    }

  }(() => window.Swiftly = exports.Swiftly = Swiftly)();

})();