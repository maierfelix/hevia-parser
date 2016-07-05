var src = 
`
var a = ~2 * !1 ** 7 && 1 != 2;
`;

swift.innerHTML = src;

function execute() {
  hevia.evaluate(out.value);
}

function build(value) {
  let tokens = hevia.tokenize(value);
  console.log(tokens);
  let ast = hevia.parse(tokens);
  console.log(ast);
  return (hevia.generate(ast, "JS"));
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