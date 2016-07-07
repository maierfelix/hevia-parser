struct Mercedes : Vehicle {
  var model: String
  var color: String
  let horsePower: Double
  init(a:Int) {}
}

struct TimeEvent : Event {

  var ts: Int64
  var time: Int64

  func accept(visitor: Visitor){
    visitor.visit(self)
  }

}