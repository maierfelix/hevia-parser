<h1 align="center">Hevia</h1>

<div align="center">
  <strong>A Swift to ES6 Compiler.</strong>
</div>

<div align="center">
  Compiles latest Swift 3.0 code into optimized ES6 code, running inside the Browser.<br>
In near future, the compiler will be rewritten into Swift, to get self-hosted (compiles itself).
</div>

<br/>

<div align="center">
  <a href="https://travis-ci.org/maierfelix/Hevia">
    <img src="https://img.shields.io/travis/maierfelix/Hevia/master.svg?style=flat-square" alt="Build Status" />
  </a>
  <a href="https://www.npmjs.com/package/hevia">
    <img src="https://img.shields.io/npm/v/hevia.svg?style=flat-square" alt="NPM Version" />
  </a>
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square" alt="API Stability" />
  </a>
</div>

##Example

### Swift:
```Swift
infix operator ** {
  associativity left
  precedence 160
}
func ** (left: Double, right: Double) -> Double {
  return pow(left, right);
}

print(2 ** 8);

extension Int {
  func square() -> Int {
    return (self * self);
  }
  func double() -> Int {
    return (self * 2);
  }
}

func swap(c: inout Int, d: inout Int) {
  let temp: Int = c;
  c = d;
  d = temp;
}

var (a1, b1, c1) = (22, 33, 8.square());

print(a1, c1.square());
swap(&a1, &c1);
print(a1, c1);
print(c1.square().double());
```
### Output:
```JavaScript
"use strict";
var __OP = {
  "**": function(left, right) {
    return (__global.pow(left, right));
  }
};

__global.print(__OP["**"](2, 8));

class Int {
  constructor() {}
  static square() {
    return (this * this);
  };
  static double() {
    return (this * 2);
  };
};
var swap = (c, d) => {
  const temp = c.value;
  c.value = d.value;
  d.value = temp;
};
var a1 = {
  value: 22
}
var b1 = 33;
var c1 = {
  value: Int.square.call(8)
};
_global.print(a1.value, Int.square.call(c1.value));
swap(a1, c1);
_global.print(a1.value, c1.value);
_global.print(Int.double.call(Int.square.call(c1.value)));
```
###
Console:
```
256
22 4096
64 22
968
```
