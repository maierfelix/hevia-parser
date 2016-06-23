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
  var ast = swift.parse(swift.tokenize(src));
  console.log(ast);
});