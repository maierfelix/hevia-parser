let clam = new Clam();

let input = document.querySelector("#swift");

let files = [
  "./index.swift"
];

let init = () => {

  clam.readProject(files, (src) => {
    input.oninput = compile;
    run.onmousedown = compile;
    input.value = src;
    compile(src);
  });

};

let compile = () => {

  let stream = input.value;

  let compiled = clam.compile(stream);

  js.value = compiled;

  clam.run(compiled);

};

init();