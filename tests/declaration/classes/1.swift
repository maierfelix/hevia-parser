class A { }
class B { }
class Human: A {
  var gender:String
  init(gender:String) {
    self.gender = "undefined";
  }
  
  func numeric(a:Int) -> Int {
    return (a * 2);
  }

}

var a = Human(gender: "rofl");