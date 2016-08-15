class Dog {
  var name = "Timmy"
}

var timmy = Dog()

extension Dog {
  func description() -> String {
    return "A dog named Timmy"
  }
}

expect(timmy.description() == "A dog named Timmy")