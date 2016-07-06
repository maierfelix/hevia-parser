export function print() {
  console.log.apply(console, arguments);
}

export function expect(truth) {
  if (!truth) {
    throw new Error("Expection error!");
  }
}

func print() {
  console.log.apply(console, arguments);
}

func expect(truth:Bool)->Void {
  if (!truth) {
    throw new Error("Expection error!");
  }
}