var fs = require("fs");
var hevia = require("../dist/hevia.js");

var dir = __dirname + "/";
var ignore = ["unreached", "index.js"];
var sources = [];

function readFile(entry) {
  if (/\.swift$/.test(entry)) {
    var src = {
      name: entry,
      src: fs.readFileSync(entry, "utf8"),
    };
    sources.push(src);
  }
}

function readDir(dir) {
  fs.readdirSync(dir).forEach(function(entry) {
    if (ignore.indexOf(entry) > -1) return void 0;
    var file = dir + '/' + entry;
    var stat = fs.statSync(file);
    if (stat.isDirectory()) {
      readDir(file);
    } else {
      readFile(file);
    }
  });
}

readDir(dir);

var failures = 0;

sources.map((src) => {
  var tokens = null;
  var ast = null;
  var code = null;
  var success = false;
  var error = null;
  var name = src.name.replace(dir, "").slice(1, src.name.length);
  try {
    tokens = hevia.tokenize(src.src);
    ast = hevia.parse(tokens);
    //code = hevia.generate(ast, "JS");
    //hevia.evaluate(code);
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