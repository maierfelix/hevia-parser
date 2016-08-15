extension Int {
  var squared: Int {
    return(self * self)
  }
  func squaredFunc() -> Int {
    return(self * self)
  }
}

expect(3.squared == 9)
expect(3.squaredFunc() == 9)