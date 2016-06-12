func swap(inout a:Int,inout b:Int) {
  let tmp:Int = a;
  a = b;
  b = tmp;
}

var (a, b) = (42, 42 * 2.5);

print(a, b);
swap(&a, &b);
print(a, b);