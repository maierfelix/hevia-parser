let clam = new Clam();

let input = document.querySelector("#swift");

let init = () => {

  clam.fetch("./index.swift", function(src) {
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