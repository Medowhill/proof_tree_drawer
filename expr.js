class Expr extends Obj {
  constructor() {
    super();
    this.typ = 'expr';
  }
}

class Num extends Obj {
  constructor(n, typ) {
    super();
    this.n = n;
    this.typ = typ;
  }

  objs() {
    return [String(this.n)];
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
    this.typ = 'val';
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
}
