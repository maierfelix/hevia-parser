func funcdecl1(_ a: Int, _ y: Int) {}
func funcdecl3() -> Int {}
func funcdecl4(_ a: ((Int) -> Int), _ b: Int) {}


func unlabeledClosureArgument() {

  func add(_ x: Int, y: Int) -> Int { return x + y }

  func6a({$0 + $1}) // single closure argument
  func6a(add)
  func6b(1, {$0 + $1}) // second arg is closure
  func6b(1, add)
  func6c({$0 + $1}) // second arg is default int
  func6c(add)

}


class SomeClass {
  var field : SomeClass?
  func foo() -> Int {}
}

var closure1 : () -> Int = { return 4 }
var closure2 : (Int,Int) -> Int = { a, b in return 4 }

var closure3a : () -> () -> (Int,Int) = {{ (4, 2) }}
var closure4 : (Int,Int) -> Int = { $0 + $1 }