var src = 
`var a = (*)(2, 3);

var y = a || b && c || d > e && f == g < h >= i + j * k;

infix operator °°°° {
  associativity left
  precedence 160
}
func °°°°(c:Int)->Int{
  return 1;
}

var a = (2°°°°7*7*(2/3));`;

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