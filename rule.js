function aux() {
rule = new Rule(
  [
    new Eval(
      new Nonempty([
        ["x", new Num(1)],
        ["f", new Closure("x", new Id("x"), new Empty())]
      ]),
      new Id("f"),
      new Closure("x", new Id("x"), new Empty())
    ),
    new Rule(
      [
        new Rule(
          [
            new In(
              "x", 
              new Nonempty([
                ["x", new Num(1)],
                ["f", new Closure("x", new Id("x"), new Empty())]
              ])
            )
          ],
          new Eval(
            new Nonempty([
              ["x", new Num(1)],
              ["f", new Closure("x", new Id("x"), new Empty())]
            ]),
            new Id("x"),
            new Num(1)
          ),
        ),
        new Eval(
          new Nonempty([
            ["x", new Num(1)],
            ["f", new Closure("x", new Id("x"), new Empty())]
          ]),
          new Num(2),
          new Num(2)
        )
      ],
      new Eval(
        new Nonempty([
          ["x", new Num(1)],
          ["f", new Closure("x", new Id("x"), new Empty())]
        ]),
        new Add(new Id("x"), new Num(2)),
        new Num(3)
      )
    )
  ],
  new Eval(
    new Nonempty([
      ["x", new Num(1)],
      ["f", new Closure("x", new Id("x"), new Empty())]
    ]),
    new App(
      new Id("f"),
      new Add(new Id("x"), new Num(2)),
    ),
    new Num(3)
  )
);
}
