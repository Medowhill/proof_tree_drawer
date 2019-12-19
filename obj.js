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
      let ph = this.premiseHeight();
      let pw = this.premiseWidth(ctx);
      let cw = this.conclusion.width(ctx);
      let w = Math.max(pw, cw);

      // premises
      let nx = x + Math.max(0, (cw - pw) / 2);
      this.premises.forEach(p => {
        let h = p.height();
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

      let ph = this.premiseHeight();
      let pw = this.premiseWidth(ctx);
      let cw = this.conclusion.width(ctx);

      let nx = Math.max(0, (cw - pw) / 2);
	  let i = 0;
	  for (; i < this.premises.length; i++) {
	    let p = this.premises[i];
		let w = p.width(ctx)
        let h = p.height();
        if (nx <= x && x < nx + w && ph - h <= y && y < ph)
		  return p.click(ctx, x - nx, y - (ph - h))
        nx = p.draw(ctx, nx, y + ph - h) + premiseMargin;
      }

      nx = Math.max(0, (pw - cw) / 2);
	  if (nx <= x && x < nx + cw && ph + hlineHeight <= y)
	    return this.conclusion.click(ctx, x - nx, y - (ph + hlineHeight));
	}
  }
}

class Obj {
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
    let nx = 0;
	let objs = this.objs();
	let i = 0;
    for (; i < objs.length; i++) {
	  let obj = objs[i];
      if (typeof(obj) === 'string') {
        let w = getWidth(ctx, obj);
        if (nx <= x && x < nx + w) return this;
		nx += w;
      } else {
        let w = obj.width(ctx);
        if (nx <= x && x < nx + w)
		  return obj.click(ctx, x - nx, y);
		nx += w;
	  }
    }
  }

  type() { return this.typ; }
}

class Unknown extends Obj {
  constructor(typ) {
    super();
    this.typ = typ;
  }

  draw(ctx, x, y) {
    let w = getWidth(ctx, '?');
    ctx.fillStyle = 'red';
    ctx.fillText('?', x, y + fontSize);
    ctx.fillStyle = 'black';
    return x + w;
  }

  objs() { return ['?']; }

  height() { return fontSize; }
}
