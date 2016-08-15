func type<AAA,BBB>(a:T, b:E) -> Void {
  if (a.type == b.dynamicType) {
    b = a
  }
  else {
    print("not same type")
  }
}

class BTree <T: Comparable> {

  var data: T? = nil
  var left: BTree<T>? = nil
  var right: BTree<T>? = nil

  func insert(newData: T) {
      if (self.data > newData) {
          // Insert into left subtree
      }
      else if (self.data < newData) {
          // Insert into right subtree
      }
      else if (self.data == nil) {
          self.data = newData
          return
      }
       
  }

}

class BaseCache<T: Equatable>: NSObject {
  var items: [T] = []

  func appendItems( items: [T]) {
    self.items += items
    didAppendItems()
  }

  func didAppendItems() {} // for overriding
}