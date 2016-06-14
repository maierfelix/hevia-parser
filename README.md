#
Swiftly.js - A Swift to ES6 Compiler

Compiles latest Swift 3.0 code into optimized ES6 code, running inside the Browser.<br>
In near future, the compiler will be rewritten into Swift, to get self-hosted (compiles itself).

##Example

### Swift:
```Swift
extension Int {
  func square() -> Int {
    return (self * self);
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
```
### Output:
```JavaScript
(() => {
  let swift = new Swiftly();
  ((_global, _export, _runtime) => {
    class Int {
      constructor() {}
      static square() {
        return (this * this);
      };
    };
    var swap = (c, d) => {
      const temp = c.value;
      c.value = d.value;
      d.value = temp;
    };
    var a1 = {
      value: 22
    };
    var b1 = 33;
    var c1 = {
      value: Int.square.call(8)
    };
    print(a1.value, Int.square.call(c1.value));
    swap(a1, c1);
    print(a1.value, c1.value);
  })(
    swift.runtime.global,
    typeof exports !== 'undefined' ? exports : this,
    swift.runtime
  );
})();
```
###
Console:
```
22 4096
64 22
```
