var src = 
`// **
infix operator ** {
  associativity left
  precedence 160
}
func ** (left: Double, right: Double) -> Double {
  return pow(left, right);
}

// %%
infix operator %% {
  associativity left
  precedence 2
}
func %%(a: Int, b: Int) -> Int {
  return (a * b);
}

var res1 = 2 ** 8;
expect(res1 == 256.0);

var res2 = 4 % 2 + 27 %% 123;
expect(res2 == 3321);
print(SomeClass.workaroundClassVariable);
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