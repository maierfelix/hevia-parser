var (a, b, c) = ((1, 2), (3, 4), (5, 6, 7));

expect(a.0 == 1);
expect(a.1 == 2);

expect(b.0 == 3);
expect(b.1 == 4);

expect(c.0 == 5);
expect(c.1 == 6);
expect(c.2 == 7);