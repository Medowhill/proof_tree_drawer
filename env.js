class Env extends Obj {
  constructor() {
    super();
    this.typ = 'env';
  }
}

class Empty extends Env {
  objs() {
    return ['∅'];
  }
}

class Nonempty extends Env {
  constructor(vs) {
    super();
    this.vs = vs;
  }

  objs() {
    const res = this.vs.flatMap(v => [v[0], ' ↦ ', v[1], ', ']);
    res.unshift("[");
    res.pop();
    res.push("]");
    return res;
  }
}

//class Sigma extends Env {
//  constructor(subs) {
//    super();
//    this.subs = subs;
//  }
//
//  draw(ctx, x, y) {
//    let w = getWidth(ctx, 'σ');
//    ctx.fillText('σ', x, y);
//    return x + w;
//  }
//}
