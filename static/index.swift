func minMax(inout value:Int) -> (min:Int, max:Int, c:Int) {
  value = value * 2;
  let currentMin = value;
  let currentMax = value * value;
  return (currentMin, currentMax, value);
}

let (a1, b1, c1) = (2, 668, a1 * b1 + 1);

var c:Int = 1;

let e:Int = (minMax(&c).min + minMax(&c).max) * c;

let aa:Int = (15 + ((5 * 6) / 3));
let bb:Int = 5 + 25 * 7;
let cc:Int = aa * 10;

print(minMax(&c).min + rofl.minMax(&c).max);

print(minMax(&c).min + minMax(&c).max * minMax(&c).c);