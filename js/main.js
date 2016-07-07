version.innerHTML = "v" + hevia.VERSION;
var src = 
`
for ;true; {
  print(a)
}

for var a:Int = 5; a < 10; {
  print(a)
}

for (var a:Int = 5; a < 10; a += 1) {
  print(a)
}

while 10 < 20 {
  print(1337)
}

repeat {
  print(1337)
  print(1338)
} while 10 < 20

`;

swift.innerHTML = src;

function execute() {
  hevia.evaluate(out.value);
}

function build(value) {
  let tokens = hevia.tokenize(value);
  let ast = hevia.parse(tokens);
  console.log(ast);
  return (hevia.generate(ast, "JS"));
  //return (JSON.stringify(ast));
}

function compile() {
  editor_js.setValue(build(editor_swift.getValue()));
}

run.addEventListener('click', execute, false);
com.addEventListener('click', function() {
  compile();
}, false);

out.innerHTML = build(swift.value);
execute();