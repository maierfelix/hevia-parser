let clam = new Clam();

console.log(clam, files);

files.map((file) => {
  clam.fetch(`./files/${file}`, (src) => {
    console.log(src);
  });
});