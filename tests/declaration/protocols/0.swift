protocol Base {}
protocol Extended : Base {}

protocol Status {
  func visit(event: Lost)
  func visit(event: Changed)
}

protocol Event{
  var ts: Int64 { get set }
  func accept(visitor: Visitor)
}