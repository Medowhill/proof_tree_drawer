class Rule {
  constructor(premises, conclusion) {
    this.premises = premises;
    this.conclusion = conclusion;
  }

  premiseHeight() {
    if (this.premises.length === 0) return 0;
    else {
      const arr = this.premises.map(p => p.height());
      return Math.max(...arr);
    }
  }

  premiseWidth(ctx) {
    if (this.premises.length === 0) return 0;
    else {
      return this.premises.map(p => p.width(ctx))
        .reduce((a, b) => a + b + premiseMargin)
    }
  }

  height() {
    return (this.premises.length === 0) ?
           this.conclusion.height() :
           (this.premiseHeight() + this.conclusion.height() + hlineHeight);
  }

  width(ctx) {
    if (this.premises.length === 0) return this.conclusion.width(ctx);
    else
      return Math.max(
        this.conclusion.width(ctx),
        this.premiseWidth(ctx)
      );
  }

  draw(ctx, x, y) {
    if (this.premises.length === 0)
      return this.conclusion.draw(ctx, x, y);
    else {
      const ph = this.premiseHeight();
      const pw = this.premiseWidth(ctx);
      const cw = this.conclusion.width(ctx);
      const w = Math.max(pw, cw);

      // premises
      let nx = x + Math.max(0, (cw - pw) / 2);
      this.premises.forEach(p => {
        const h = p.height();
        nx = p.draw(ctx, nx, y + ph - h) + premiseMargin;
      });

      // hline
      ctx.fillRect(
        x, y + ph + (hlineHeight - hlineSize) / 2 - adjustment,
        w, hlineSize
      );

      //conclusion
      this.conclusion.draw(
        ctx,
        x + Math.max(0, (pw - cw) / 2),
        y + ph + hlineHeight
      )

      return x + w;
    }
  }

  click(ctx, x, y) {
    if (0 <= x && 0 <= y &&
      x < this.width(ctx) && y < this.height()) {

      const ph = this.premiseHeight();
      const pw = this.premiseWidth(ctx);
      const cw = this.conclusion.width(ctx);

      let nx = Math.max(0, (cw - pw) / 2);
      let i = 0;
      for (; i < this.premises.length; i++) {
        const p = this.premises[i];
        const w = p.width(ctx)
        const h = p.height();
        if (nx <= x && x < nx + w && ph - h <= y && y < ph)
          return p.click(ctx, x - nx, y - (ph - h))
        nx += p.width(ctx) + premiseMargin;
      }

      nx = Math.max(0, (pw - cw) / 2);
      if (nx <= x && x < nx + cw && ph + hlineHeight <= y)
        return this.conclusion.click(ctx, x - nx, y - (ph + hlineHeight));
    }
  }

  copy() {
    return new Rule(
      this.premises.map(p => p.copy()),
      this.conclusion.copy()
    );
  }

  substitute(o, n) {
    if (this === o) return n;
    else
      return new Rule(
        this.premises.map(p => p.substitute(o, n)),
        this.conclusion.substitute(o, n)
      );
  }

  add(p) {
    const npremises = this.premises.map(p => p.copy());
    npremises.push(p);
    return new Rule(npremises, this.conclusion.copy());
  }

  remove(p) {
    const npremises = this.premises
      .filter(p1 => p1.conclusion !== p)
      .map(p1 => p1.remove(p));
    return new Rule(npremises, this.conclusion.copy());
  }

  find(p) {
    if (this.conclusion === p) return this;
    else {
      let i = 0;
      for (; i < this.premises.length; i++) {
        const f = this.premises[i].find(p);
        if (f) return f;
      }
    }
  }
}

class Obj {
  constructor() {
    this.isHole = false;
  }

  width(ctx) {
    return this.objs().map(obj => {
      if (typeof(obj) === 'string')
        return getWidth(ctx, obj);
      else
        return obj.width(ctx);
    }).reduce((a, b) => a + b);
  }

  draw(ctx, x, y) {
    let nx = x;
    this.objs().forEach(obj => {
      if (typeof(obj) === 'string') {
        let w = getWidth(ctx, obj);
        ctx.fillText(obj, nx, y + fontSize);
        nx += w;
      } else
        nx = obj.draw(ctx, nx, y);
    });
    return nx;
  }

  click(ctx, x, y) {
    const objs = this.objs();
    let nx = 0;
    let i = 0;
    for (; i < objs.length; i++) {
      const obj = objs[i];
      if (typeof(obj) === 'string') {
        const w = getWidth(ctx, obj);
        if (nx <= x && x < nx + w) return this;
        nx += w;
      } else {
        const w = obj.width(ctx);
        if (nx <= x && x < nx + w)
          return obj.click(ctx, x - nx, y);
        nx += w;
      }
    }
  }

  copy() {
    const fields = this.objs()
      .filter(obj => typeof(obj) !== 'string')
      .map(obj => obj.copy());
    const obj = new this.constructor(...fields);
    obj.type = this.type;
    obj.isHole = this.isHole;
    return obj;
  }

  substitute(o, n) {
    if (this === o) return n;
    else {
      const fields = this.objs()
        .filter(obj => typeof(obj) !== 'string')
        .map(obj => obj.substitute(o, n));
      const obj = new this.constructor(...fields);
      obj.type = this.type;
      obj.isHole = this.isHole;
      return obj;
    }
  }
}

class Hole extends Obj {
  constructor(type) {
    super();
    this.type = type;
    this.isHole = true;
  }

  draw(ctx, x, y) {
    if (this.obj) return super.draw(ctx, x, y);
    else {
      const w = getWidth(ctx, '?');
      ctx.fillStyle = 'red';
      ctx.fillText('?', x, y + fontSize);
      ctx.fillStyle = 'black';
      return x + w;
    }
  }

  objs() { return ['?']; }

  height() { return fontSize; }

  copy() { return new Hole(this.type); }

  substitute(o, n) {
    if (this === o) return n;
    else return this.copy();
  }
}
