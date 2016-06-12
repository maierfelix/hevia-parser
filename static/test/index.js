let swift = new Swiftly();

console.log(swift, files);

files.map((file) => {
  swift.fetch(`./files/${file}`, (src) => {
    console.log(src);
  });
});