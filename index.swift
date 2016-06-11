func minMax(inout value:Int) -> (min: Int, max: Int) {
  value = value * 2;
  let currentMin = value;
  let currentMax = value * value;
  return (currentMin, currentMax);
}

let c:Int = 10;

print(minMax(&c).min);

export enum Week {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
}

let auto = 7 * 7;

let a:Int = (15 + ((5 * 6) / 3));
let b:Int = 5 + 25 * 7;
let c:Int = a * 10;

func main(inout a:Int,inout b:Int) {
  func swap(inout c:Int,inout d:Int)->Int {
    let temp:Int = c;
    c = d;
    d = temp;
  }
  swap(&a, &b);
}

let (a1, b1, c1) = (2, 668, a1 * b1 + 1);

print(a1, c1);
main(&a1, &c1);
print(a1, c1);

func add(inout ii:Int)->Int {
  if (ii < (max / 2)) {
    ii = ii + step;
    add(&ii);
  }
}

let result:Int = 0;
let max:Int = 50;
let step:Int = 2;

print(result);
add(&result, 2, 100);
print(result);

let d = [Int](count: c1, repeatedValue: 2.0);
d.append(1337);
print(d);