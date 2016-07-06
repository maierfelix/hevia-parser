class H {
  func f(_ x: Int) { }
  class func f(_ x: Int) { }
}

class HDerived : H {
  override func f(_ x: Int) { }
  override class func f(_ x: Int) { }
}