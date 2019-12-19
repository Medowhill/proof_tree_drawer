class Judgement extends Obj {
  constructor() {
    super();
    this.typ = 'judgement';
  }

  height() { return fontSize; }
}

class Eval extends Judgement {
  constructor(env, expr, res) {
    super();
    this.env = env;
    this.expr = expr;
    this.res = res;
  }

  objs() {
    return [this.env, ' ⊢ ', this.expr, ' ⇒ ', this.res];
  }
}

class In extends Judgement {
  constructor(x, env) {
    super();
    this.x = x;
    this.env = env;
  }

  objs() {
    return [this.x, ' ∈ Domain(', this.env, ')'];
  }
}
