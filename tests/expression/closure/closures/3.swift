func takeFunc(_ f: (Int) -> Int) -> Int {}
func takeValueAndFunc(_ value: Int, _ f: (Int) -> Int) {}
func takeTwoFuncs(_ f: (Int) -> Int, _ g: (Int) -> Int) {}
func takeFuncWithDefault(f : ((Int) -> Int)? = nil) {}
func takeTwoFuncsWithDefaults(f1 : ((Int) -> Int)? = nil, f2 : ((String) -> String)? = nil) {}

struct X {
  func takeFunc(_ f: (Int) -> Int) {}
  func takeValueAndFunc(_ value: Int, f: (Int) -> Int) {}
  func takeTwoFuncs(_ f: (Int) -> Int, g: (Int) -> Int) {}
}

func addToMemberCalls(_ x: X) {
  x.takeFunc() { x in x }
  x.takeFunc() { $0 }
  x.takeValueAndFunc(1) { x in x }
  x.takeTwoFuncs({ x in x }) { y in y }
}

func addToCalls() {
  takeFunc() { x in x }
  takeFunc() { $0 }
  takeValueAndFunc(1) { x in x }
  takeTwoFuncs({ x in x }) { y in y }
}

func makeCalls() {
  takeFunc { x in x }
  takeFunc { $0 }
  takeTwoFuncs ({ x in x }) { y in y }
}

func notPostfix() {
  _ = 1 + takeFunc { $0 }
}

class C {
  func map(_ x: (Int) -> Int) -> C { return self }
  func filter(_ x: (Int) -> Bool) -> C { return self }
}

var a = C().map {$0 + 1}.filter {$0 % 3 == 0}

var b = C().map {$0 + 1}.filter {$0 % 3 == 0}

var c = C().map {
  $0 + 1
}