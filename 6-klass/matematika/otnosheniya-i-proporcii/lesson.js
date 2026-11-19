'use strict';

const byId = id => document.getElementById(id);
const nav = document.querySelector('.topic-nav');
const chapters = [...document.querySelectorAll('article')];
const chapterLinks = [...nav.querySelectorAll('a')];

function showChapter() {
  const target = chapters.find(chapter => '#' + chapter.id === location.hash) ?? chapters[0];
  for (const chapter of chapters) chapter.hidden = chapter !== target;
  for (const link of chapterLinks) {
    if (link.hash === '#' + target.id) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  return target;
}

showChapter();
window.addEventListener('hashchange', () => {
  const target = showChapter();
  if (document.activeElement.closest('.next-topic') || document.activeElement === document.body) {
    const heading = target.querySelector('h2');
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
  nav.scrollIntoView();
});

function bindChoices(id, key, change) {
  const group = byId(id);
  group.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    for (const member of group.querySelectorAll('button')) {
      member.setAttribute('aria-pressed', member === button);
    }
    change(button.dataset[key]);
  });
}

function gcd(a, b) {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

function simplify(a, b) {
  const divisor = gcd(a, b);
  return (a / divisor) + ' : ' + (b / divisor);
}

const cup = `<svg class="cup" viewBox="0 0 34 40" aria-hidden="true">
  <path class="glass" d="M3 4h28l-3.5 30q-.4 3-3.5 3H10q-3.1 0-3.5-3Z"/>
  <path class="liquid" d="M6.2 14h21.6l-2.3 19q-.2 2-2.3 2H10.8q-2.1 0-2.3-2Z"/>
  <path class="marks" d="M5.4 12h8M6.5 20h6M7.5 28h5"/>
</svg>`;

let servings = 1;
let extraWater = false;
const compare = byId('compare');
const extra = byId('extra-water');

function drawRecipe() {
  const juice = 2 * servings;
  const water = 3 * servings + Number(extraWater);
  byId('juice-cups').innerHTML = cup.repeat(juice);
  byId('water-cups').innerHTML = cup.repeat(water);
  byId('juice-amount').textContent = 100 * juice + ' мл';
  byId('water-amount').textContent = 100 * water + ' мл';

  byId('jLevel').setAttribute('y',160-12*juice);
  byId('wLevel').setAttribute('y',160-12*water);
  byId('jugLevel').setAttribute('y',159-7*(juice+water));
  const tint = [0,1,2].map(i => Math.round(([178,65,110][i]*juice+[191,225,235][i]*water)/(juice+water)));
  byId('jugLevel').setAttribute('fill','rgb('+tint.join(',')+')');
  const comparisons = {
    'juice-water': [juice, water, `Мерки сока (${juice}) сравниваем с мерками воды (${water}).`],
    'water-juice': [water, juice, `Сначала мерки воды (${water}), затем мерки сока (${juice}).`],
    'juice-all': [juice, juice + water, `Всего мерок ${juice} + ${water} = ${juice + water}. Из них ${juice} — сок.`]
  };
  const [first, second, description] = comparisons[compare.value];
  const reduced = simplify(first, second);
  const equation = first + ' : ' + second;
  byId('recipe-equation').textContent = equation === reduced ? equation : equation + ' = ' + reduced;
  const note = extraWater ? ' Добавили воду, поэтому рецепт изменился.' :
    servings > 1 ? ' Увеличили оба количества одинаково, поэтому отношение сохранилось.' : '';
  byId('recipe-message').textContent = description + note;
}

bindChoices('recipe-buttons', 'recipe', value => {
  servings = Number(value);
  drawRecipe();
});
extra.addEventListener('click', () => {
  extraWater = !extraWater;
  extra.setAttribute('aria-pressed', extraWater);
  drawRecipe();
});
compare.addEventListener('change', drawRecipe);

function strips(juice, water) {
  return '<div class="strip juice">' + '<i></i>'.repeat(juice) +
    '</div><div class="strip water">' + '<i></i>'.repeat(water) + '</div>';
}

const tryJuice = byId('try-juice');
const tryWater = byId('try-water');
byId('base-strip').innerHTML = strips(2, 3);

function drawScale() {
  const juice = tryJuice.valueAsNumber;
  const water = tryWater.valueAsNumber;
  const match = 3 * juice === 2 * water;
  byId('try-juice-count').textContent = juice;
  byId('try-water-count').textContent = water;
  byId('try-strip').innerHTML = strips(juice, water);
  byId('scale-equation').textContent = `2 : 3 ${match ? '=' : '≠'} ${juice} : ${water}`;
  byId('scale-message').textContent = match && juice === 2
    ? 'Взяли столько же сока и воды. Отношения равны — получилась пропорция.'
    : match ? `Сока и воды стало в ${juice / 2} раза больше. Отношения равны — получилась пропорция.`
    : `В твоём рецепте отношение ${simplify(juice, water)}. Для того же вкуса нужно 2 : 3.`;
}

tryJuice.addEventListener('input', drawScale);
tryWater.addEventListener('input', drawScale);

const division = [
  ['Сколько всего равных частей?', '2 + 3 = 5', 'Две части сока и три части воды. Отметим на схеме все пять.'],
  ['Сколько в одной части?', '750 : 5 = 150 мл', 'Разделили весь напиток на пять равных частей и узнали объём одной части.'],
  ['Сколько сока и воды?', '300 мл и 450 мл', 'Для сока берём 2 · 150 = 300 мл, для воды — 3 · 150 = 450 мл. Проверка: 300 + 450 = 750 мл.']
];

function drawDivision(step) {
  byId('ribbon').replaceChildren(...Array.from({ length: 5 }, (_, index) => {
    const part = document.createElement('span');
    part.className = index < 2 ? 'juice' : 'water';
    const highlight = step === 2 || (step === 1 && index === 0);
    part.classList.toggle('highlight', highlight);
    part.textContent = highlight ? '150 мл' : String(index + 1);
    return part;
  }));
  byId('ribbon-juice').textContent = step === 2 ? 'Сок · 300 мл' : 'Ягодный сок';
  byId('ribbon-water').textContent = step === 2 ? 'Вода · 450 мл' : 'Вода';
  const [title, equation, message] = division[step];
  byId('divide-title').textContent = title;
  byId('divide-equation').textContent = equation;
  byId('divide-message').textContent = message;
}
bindChoices('divide-buttons', 'step', value => drawDivision(Number(value)));
drawDivision(0);

function readNumber(input) {
  const value = input.value.trim().replace(',', '.');
  return /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(value) ? Number(value) : NaN;
}

function showFeedback(form, correct, message) {
  const feedback = form.querySelector('.feedback');
  feedback.dataset.correct = correct;
  feedback.textContent = message;
}

const partsForm = byId('parts-form');
partsForm.addEventListener('submit', event => {
  event.preventDefault();
  const first = readNumber(partsForm.elements.first);
  const second = readNumber(partsForm.elements.second);
  const correct = first === 36 && second === 60;
  const totalCorrect = first + second === 96;
  showFeedback(partsForm, correct, correct ? 'Верно. 36 + 60 = 96, а 36 : 60 = 3 : 5.'
    : totalCorrect ? 'Сумма равна 96. Проверь ещё и отношение первой группы ко второй.'
    : 'Проверь, что в двух группах вместе ровно 96 бусин.');
});

const problems = [
  ['x : 18 = 5 : 6', 15, '15 · 6 = 18 · 5 = 90.'],
  ['2,4 : x = 6 : 15', 6, '2,4 · 15 = 6 · 6 = 36.'],
  ['3 : 8 = x : 4', 1.5, '3 · 4 = 8 · 1,5 = 12.'],
  ['5 : 7 = 15 : x', 21, '5 · 21 = 7 · 15 = 105.']
];
let problem = 0;
const unknownForm = byId('unknown-form');

unknownForm.addEventListener('submit', event => {
  event.preventDefault();
  const [, answer, check] = problems[problem];
  const correct = readNumber(unknownForm.elements.answer) === answer;
  showFeedback(unknownForm, correct, correct ? 'Верно. ' + check
    : 'Приравняй произведения крайних и средних членов и найди неизвестный множитель.');
});

byId('next-problem').addEventListener('click', () => {
  problem = (problem + 1) % problems.length;
  byId('unknown-equation').textContent = problems[problem][0];
  unknownForm.reset();
  showFeedback(unknownForm, false, '');
  unknownForm.elements.answer.focus();
});

for (const form of [partsForm, unknownForm]) {
  form.addEventListener('input', () => showFeedback(form, false, ''));
}

bindChoices('practice-buttons', 'practice', value => {
  byId('ratio-practice').hidden = value !== 'ratio';
  byId('proportion-practice').hidden = value !== 'proportion';
});

drawRecipe();
drawScale();
window.addEventListener('pageshow', () => {
  drawRecipe();
  drawScale();
});

function threadBeads() {
  const n = +byId('links').value;
  byId('linksCount').value = n;
  let drawing = '';
  for(let group=0;group<n;group++) {
    const x = 240 + (group-(n-1)/2)*89;
    drawing += '<path d="M'+(x-42)+' 81q42 18 84 0" fill="none" stroke="#76634f" stroke-width="3"/>';
    for(let bead=0;bead<5;bead++) {
      const bx = x+(bead-2)*16, by = 82+7*Math.cos((bead-2)*0.65);
      drawing += '<circle cx="'+bx+'" cy="'+by+'" r="8.7" fill="'+(bead<2?'#d27f86':'#69ac9b')+'" stroke="#596963"/><circle cx="'+(bx-2.7)+'" cy="'+(by-3)+'" r="2.1" fill="#fffa"/>';
    }
    drawing += '<path d="M'+(x-38)+' 108v6h76v-6" fill="none" stroke="#8caaa1"/><text x="'+x+'" y="136" text-anchor="middle">'+(group+1)+'</text>';
  }
  byId('beads').innerHTML = drawing;
  byId('beadRead').textContent = 'Коралловые и мятные: '+(2*n)+' : '+(3*n)+'. Всего '+(5*n)+' бусин.';
}
function printPhoto() {
  const width = +byId('wide').value, locked=byId('locked').checked;
  const height = locked ? width*2/3 : +byId('high').value;
  if (locked) byId('high').value = height;
  const format = n => Number.isInteger(n) ? String(n) : new Intl.NumberFormat('ru',{maximumFractionDigits:2}).format(n);
  byId('wideN').value = width+' см';
  byId('highN').value = format(height)+' см';
  byId('heightControl').hidden = locked;
  const picture = byId('print');
  for(const [name,value] of Object.entries({width:width*15,height:height*15,x:(350-width*15)/2,y:(195-height*15)/2})) picture.setAttribute(name,value);
  const equal=width*4===height*6;
  byId('printRead').textContent = '6 : 4 '+(equal?'=':'≠')+' '+width+' : '+format(height)+'. '+(equal?'Форма сохранилась.':'Отношение сторон изменилось.');
}
byId('links').addEventListener('input',threadBeads);
for (const id of ['wide','high','locked']) byId(id).addEventListener('input',printPhoto);
function renderModels(){ threadBeads(); printPhoto(); }
renderModels();
window.addEventListener('pageshow',renderModels);
for(const form of document.querySelectorAll('.quick')) {
  const input=form.querySelector('input'), feedback=form.querySelector('output');
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const value=input.value.trim().replace(',','.');
    feedback.textContent = !/^\d+(\.\d+)?$/.test(value) ? 'Введи число.' : Number(value)===Number(form.dataset.value) ? 'Верно!' : 'Проверь, какие величины ты сравниваешь, и попробуй ещё раз.';
  });
  input.addEventListener('input',()=>feedback.textContent='');
}
