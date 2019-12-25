class Expr extends Obj {
  constructor() {
    super();
    this.type = 'expr';
  }
}

class Num extends Obj {
  constructor(n, type) {
    super();
    this.n = n;
    this.type = type;
  }

  objs() {
    return [String(this.n)];
  }

  copy() {
    return new Num(this.n, this.type);
  }

  substitute(o, n) {
    if (this === o) return n;
    else return this.copy();
  }
}

class Id extends Expr {
  constructor(x) {
    super();
    this.x = x;
  }

  objs() {
    return [this.x];
  }

  copy() {
    return new Id(this.x);
  }

  substitute(o, n) {
    if (this === o) return n;
    else return this.copy();
  }
}

class Add extends Expr {
  constructor(l, r) {
    super();
    this.l = l;
    this.r = r;
  }

  objs() {
    return ['{+ ', this.l, ' ', this.r, '}'];
  }
}

class Sub extends Expr {
  constructor(l, r) {
    super();
    this.l = l;
    this.r = r;
  }

  objs() {
    return ['{- ', this.l, ' ', this.r, '}'];
  }
}

class Fun extends Expr {
  constructor(p, b) {
    super();
    this.p = p;
    this.b = b;
  }

  objs() {
    return ['{fun {', this.p, '} ', this.b, '}'];
  }

  copy() {
    return new Fun(this.p, this.b.copy());
  }

  substitute(o, n) {
    if (this === o) return n;
    else return new Fun(this.p, this.b.substitute(o, n));
  }
}

class App extends Expr {
  constructor(f, a) {
    super();
    this.f = f;
    this.a = a;
  }

  objs() {
    return ['{', this.f, ' ', this.a, '}'];
  }
}

class Val extends Obj {
  constructor() {
    super();
    this.type = 'val';
  }
}

class Closure extends Val {
  constructor(p, b, env) {
    super();
    this.p = p;
    this.b = b;
    this.env = env;
  }

  objs() {
    return ['⟨λ', this.p, '.', this.b, ', ', this.env, '⟩'];
  }

  copy() {
    return new Closure(this.p, this.b.copy(), this.env.copy());
  }

  substitute(o, n) {
    if (this === o) return n;
    else return new Closure(
      this.p,
      this.b.substitute(o, n),
      this.env.substitute(o, n)
    );
  }
}
