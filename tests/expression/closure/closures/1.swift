// Closures with variadic argument lists
func variadic() {
  var f = {(start: Int, rest: Int) -> Int in
    var result = start
    for (x in rest) {
      result += x
    }
    return result
  }
}

// Closures with attributes in the parameter list.
func attrs() {
  _ = {(z: inout Int) -> Int in z }
}

// Closures with argument and parameter names.
func argAndParamNames() -> Int {
  let f1: (x: Int, y: Int) -> Int = { (x, y) in x + y }
  _ = f1(x: 1, y: 2)
  return f1(x: 1, y: 2)
}