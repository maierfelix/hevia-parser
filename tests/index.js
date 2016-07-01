var fs = require("fs");
var hevia = require("../dist/hevia.js");

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

var failures = 0;

sources.map((src) => {
  var tokens = null;
  var ast = null;
  var code = null;
  var success = false;
  var error = null;
  var name = src.name;
  try {
    //hevia.evaluate(hevia.compile(src.src))
    hevia.parse(hevia.tokenize(src.src));
    success = true;
  } catch(e) {
    error  = e;
    success = false;
  }
  if (!success) {
    failures++;
  }
  // super duper dirty
  console.log(`[${success ? "PASSED" : "FAILED"}]::${name + (!success ? " => " + error : "")}`);
});

if (failures) {
  console.log(`\n${failures} ${failures === 1 ? "FAILURE" : "FAILURES"}!`);
} else {
  console.log("\nSTABLE!");
}