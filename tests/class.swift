class Earth {
  init() {}
}

class Human {
  var gender:String
}

class Person: Human {

  var firstName:String
  var lastName:String

  init(gender: String) {
    self.gender = "male"
  }

}