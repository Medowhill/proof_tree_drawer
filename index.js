var rule = undefined;

const offsetLeft = 20;
const offsetTop = 50;
const fontSize = 30;
const premiseMargin = 70;
const hlineHeight = 16;
const hlineSize = 2;
const adjustment = -6;

$(document).ready(() => {
  const canvas = $("canvas")[0];
  canvas.addEventListener(
    'mousedown',
    e => {
	  let x = event.pageX - canvas.offsetLeft - offsetLeft;
	  let y = event.pageY - canvas.offsetTop - offsetTop;
	  console.log(rule.click(canvas.getContext("2d"), x, y));
    },
    false
  )
  rule = newRule('eval');
  //aux();
  setSize();
  draw();
});

$(window).resize(() => {
  setSize();
  draw();
});

function draw() {
  const canvas = $("canvas")[0];
  const ctx = canvas.getContext("2d");
  ctx.font = fontSize + "px 'Computer Modern'";
  rule.draw(ctx, offsetLeft, offsetTop);
}

function setSize() {
  const canvas = $("canvas")[0];
  canvas.width = Math.max($(window).width() - 50, 10);
  canvas.height = Math.max($(window).height() - 50, 10);
}

function getWidth(ctx, str) {
  return ctx.measureText(str).width;
}

function newRule(typ) {
  if (typ === 'eval')
    return new Rule(
      [],
      new Eval(
        new Unknown('env'),
        new Unknown('expr'),
        new Unknown('val')
      )
    )
  else if (typ === 'in')
    return new Rule(
      [],
      new In(
        new Unknown('str'),
        new Unknown('env')
      )
    )
}
