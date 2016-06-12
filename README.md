# Swiftly.js - A Swift to ES6 Compiler

##Example

###Swift:
```Swift
func swap(inout c:Int,inout d:Int) {
  let temp:Int = c;
  c = d;
  d = temp;
}

var (a1, b1, c1) = (22, 33, 44);

print(a1, c1);
swap(&a1, &c1);
print(a1, c1);
```
###Output:
```JavaScript
(() => {
  let swift = new Swiftly();
  ((_global, _export, _runtime) => {
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
      value: 44
    };
    print(a1.value, c1.value);
    swap(a1, c1);
    print(a1.value, c1.value);
  })(
    swift.runtime.global,
    typeof exports !== 'undefined' ? exports : this,
    swift.runtime
  );
})();
```
###Console:
```
22 44
44 22
```
