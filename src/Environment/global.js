export function print() {
  console.log.apply(console, arguments);
}

export function pow(rx, pow) {
  return (
    Math.pow(rx, pow)
  );
}