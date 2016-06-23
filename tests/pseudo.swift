var x = 0;
var x:Int {
  set(a) {
    x = a / 2
  }
  get {
    return x * 2
  }
  willSet(b) {
    return 2;
  }
  didSet(c) {
    return (4 * 1);
  }
}