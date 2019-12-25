class Env extends Obj {
  constructor() {
    super();
    this.type = 'env';
  }
}

class List extends Env {
  constructor(vs) {
    super();
    if (vs) this.vs = vs;
    else this.vs = [];
  }

  objs() {
    if (this.vs.length === 0) return ['∅'];
    else {
      const res = this.vs.flatMap(v => [v[0], ' ↦ ', v[1], ', ']);
      res.unshift("[");
      res.pop();
      res.push("]");
      return res;
    }
  }

  copy() {
    return new List(this.vs.map(
      v => [v[0], v[1].copy()]
    ));
  }

  substitute(o, n) {
    if (this === o) return n;
    else
      return new List(this.vs.map(
        v => [v[0], v[1].substitute(o, n)]
      ));
  }

  add(x) {
    const nvs = this.vs.map(
      v => [v[0], v[1].copy()]
    );
    nvs.push([x, new Hole('val')]);
    return new List(nvs);
  }

  remove(x) {
    return new List(this.vs.filter(
      v => v[0] !== x
    ).map(
      v => [v[0], v[1].copy()]
    ));
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
