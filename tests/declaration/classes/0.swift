class Simple {

  init() { print("initialise"); }

  class func one() { return 1 }

  class func two() { return 2 }

  static func staticOne() { return 10 }

  static func staticTwo()  { return 20 }

  final func yesFinal() -> String { return "yourmum" }

  static var myStaticVar = "static var in base";

  class myClassVar {
    init() {}
  }

}

var a = Simple();

class SomeClass{

  class var workaroundClassVariable: Int {
    get { return SubStruct.staticVariable }
    set { SubStruct.staticVariable = newValue }
  }

}

SomeClass.workaroundClassVariable = 1337;

print(SomeClass.workaroundClassVariable);