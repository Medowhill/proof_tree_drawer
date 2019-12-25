const state = {
// current rule
  rule: undefined,
// old rules
  rules: [],
// object to be modified
  old: undefined,
  aux: undefined,
}

const offsetLeft = 20;
const offsetTop = 50;
const fontSize = 30;
const premiseMargin = 70;
const hlineHeight = 16;
const hlineSize = 2;
const adjustment = -6;

$(document).ready(() => {
  const canvas = $("canvas")[0];
  canvas.addEventListener('mousedown', click, false);
  state.rule = make('eval');
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  state.rule.draw(ctx, offsetLeft, offsetTop);
}

function setSize() {
  const canvas = $("canvas")[0];
  canvas.width = Math.max($(window).width() - 50, 10);
  canvas.height = Math.max($(window).height() - 200, 10);
}

function getWidth(ctx, str) {
  return ctx.measureText(str).width;
}

function click(e) {
  const x = event.pageX - canvas.offsetLeft - offsetLeft;
  const y = event.pageY - canvas.offsetTop - offsetTop;
  const obj = state.rule.click(canvas.getContext("2d"), x, y);
  if (obj) {
    state.old = obj;
    if (obj.isHole) newObj();
    else updateObj();
  }
}

function make(type) {
  if (type === 'eval')
    return new Rule(
      [],
      new Eval(
        new List(),
        new Hole('expr'),
        new Hole('val')
      )
    )
  else if (type === 'add')
    return new Add(new Hole('expr'), new Hole('expr'));
  else if (type === 'sub')
    return new Sub(new Hole('expr'), new Hole('expr'));
  else if (type === 'app')
    return new App(new Hole('expr'), new Hole('expr'));
}

function newPremise() {
  show('premise');
}

function addEval() {
  state.old = state.rule.find(state.old);
  update(state.old.add(make('eval')));
  hide();
}

function newObj() {
  show(state.old.type);
}

function newNum() {
  $('#i-num-num').val('');
  show('num');
}

function getNum() {
  return Number($('#i-num-num').val());
}

function updateNum() {
  update(new Num(getNum(), state.old.type));
  hide();
}

function newStr(aux) {
  state.aux = aux;
  $('#i-str-str').val('');
  show('str');
}

function getStr() {
  const str = $('#i-str-str').val();
  if (str) return str; else return 'x';
}

function updateStr() {
  if (state.aux === 'id')
    update(new Id(getStr()));
  else if (state.aux === 'fun')
    update(new Fun(getStr(), new Hole('expr')));
  else if (state.aux === 'closure')
    update(new Closure(getStr(), new Hole('expr'), new List()));
  else if (state.aux === 'envA')
    update(state.old.add(getStr()));
  else if (state.aux === 'envR')
    update(state.old.remove(getStr()));
  else if (state.aux === 'in') {
    state.old = state.rule.find(state.old);
    update(state.old.add(new Rule([], new In(getStr(), new List()))));
  }
  hide();
}

function updateObj() {
  if (state.old.type === 'env') show('env');
  else if (state.old.type === 'judgement') show('judgement');
  else show('update');
}

function changeObj() {
  show(state.old.type);
}

function removeObj() {
  hide();
  update(new Hole(state.old.type));
}

function updateSimple(n) {
  update(make(n));
  hide();
}

function update(n) {
  state.rules.push(state.rule);
  state.rule = state.rule.substitute(state.old, n);
  draw();
}

function removePremise() {
  state.rules.push(state.rule);
  state.rule = state.rule.remove(state.old);
  hide();
  draw();
}

function hide() {
  $('#judgement-modal')[0].style.display = 'none';
  $('#expr-modal')[0].style.display = 'none';
  $('#val-modal')[0].style.display = 'none';
  $('#env-modal')[0].style.display = 'none';
  $('#update-modal')[0].style.display = 'none';
  $('#num-modal')[0].style.display = 'none';
  $('#str-modal')[0].style.display = 'none';
  $('#premise-modal')[0].style.display = 'none';
}

function show(type) {
  hide();
  $(`#${type}-modal`)[0].style.display = 'block';
}