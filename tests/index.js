var fs = require("fs");
var swift = require("../dist/swiftly.js");

var dir = __dirname + "/";
var sources = [];

fs.readdirSync(dir).forEach(function(entry) {
  if (/\.swift$/.test(entry)) {
    var src = {
      name: entry,
      src: fs.readFileSync(dir + "/" + entry, "utf8"),
    };
    sources.push(src);
  }
});

sources.map((src) => {
  var tokens = swift.tokenize(src);

  for (let key in tokens) {
    //console.log(pp.getNameByLabel(tokens[key].name));
  };

  var ast = swift.parse(tokens);
  console.log(ast);
});