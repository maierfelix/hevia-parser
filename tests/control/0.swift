class Simple {

  init() {}

  class func one() {}

  class func two() {}

  static func staticOne() {}

  static func staticTwo() {}

  final func yesFinal() {}

  static var myStaticVar = "static var"

}

class SubSimple: Simple {

  override class func one() {
    print("subClass - one()")
  }

  override class func two() {
    print("subClass - two()")
  }

  override static func staticOne() {

  }

  override final func yesFinal() {

  }

}