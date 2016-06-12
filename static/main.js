let swift = new Swiftly();

let input = document.querySelector("#swift");

let files = [
  "./index.swift"
];

let init = () => {

  swift.readProject(files, (src) => {
    input.oninput = compile;
    run.onmousedown = compile;
    input.value = src;
    compile(src);
  });

};

let compile = () => {

  let stream = input.value;

  let compiled = swift.compile(stream);

  js.value = compiled;

  swift.run(compiled);

};

init();