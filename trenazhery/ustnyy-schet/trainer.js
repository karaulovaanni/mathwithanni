'use strict';

const grade = document.querySelector('#grade');
const level = document.querySelector('#level');
const topics = document.querySelector('#topics');
const settings = document.querySelector('#settings');
const start = document.querySelector('#start');
const practice = document.querySelector('#practice');
const exercise = document.querySelector('#exercise');
const example = document.querySelector('#example');
const answer = document.querySelector('#answer');
const hint = document.querySelector('#hint');
const history = document.querySelector('#history');
const score = document.querySelector('#score');
const finish = document.querySelector('#finish');

const random = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const pick = values => values[random(0, values.length - 1)];
const format = value => String(value).replace('-', '−').replace('.', ',');
const question = (left, sign, right, correct) => ({
  expression: format(left) + ' ' + sign + ' ' + format(right),
  correct
});

const generators = {
  add: ['Сложение', 1, (n) => {
    const a = random(1, n - 1);
    const b = random(1, n - a);
    return question(a, '+', b, a + b);
  }],
  subtract: ['Вычитание', 1, (n) => {
    const a = random(2, n);
    const b = random(1, a);
    return question(a, '−', b, a - b);
  }],
  multiply: ['Умножение', 2, (_, factor) => {
    const a = random(2, factor);
    const b = random(2, factor);
    return question(a, '×', b, a * b);
  }],
  divide: ['Деление', 2, (_, factor) => {
    const a = random(2, factor);
    const b = random(2, factor);
    return question(a * b, '÷', b, a);
  }],
  order: ['Порядок действий', 3, (_, factor, difficulty) => {
    const a = random(2, factor);
    const b = random(2, factor);
    const c = random(2, factor);
    return difficulty === 2
      ? { expression: '(' + a + ' + ' + b + ') × ' + c, correct: (a + b) * c }
      : { expression: a + ' + ' + b + ' × ' + c, correct: a + b * c };
  }],
  powers: ['Степени', 5, (_, factor, difficulty) => {
    const cube = difficulty > 0 && random(0, 1) === 1;
    const base = random(2, cube ? Math.min(factor, 6) : factor);
    return { expression: base + (cube ? '³' : '²'), correct: base ** (cube ? 3 : 2) };
  }],
  decimals: ['Десятичные дроби', 5, (n, _, difficulty) => {
    const scale = difficulty === 2 ? 100 : 10;
    const a = random(2, n);
    const b = random(1, a);
    return random(0, 1)
      ? question(a / scale, '+', b / scale, (a + b) / scale)
      : question(a / scale, '−', b / scale, (a - b) / scale);
  }],
  fractions: ['Обыкновенные дроби', 5, (_, factor, difficulty) => {
    const d = random(4, Math.max(4, factor));
    const a = random(2, d - 1);
    const b = random(1, Math.min(a, d - a));
    const subtract = difficulty > 0 && random(0, 1) === 1;
    return question(a + '/' + d, subtract ? '−' : '+', b + '/' + d,
      (subtract ? a - b : a + b) / d);
  }],
  negatives: ['Отрицательные числа', 6, (n, _, difficulty) => {
    const a = random(1, Math.min(n, 50));
    const b = random(2, difficulty === 2 ? 40 : 20);
    return random(0, 1)
      ? question(-a, '+', b, b - a)
      : question(-a, '−', '(' + format(-b) + ')', b - a);
  }],
  percents: ['Проценты', 6, (_, factor, difficulty) => {
    const percent = pick(difficulty === 0 ? [10, 50] : [5, 10, 20, 25, 50, 75]);
    const whole = 20 * random(2, factor);
    return { expression: percent + '% от ' + whole, correct: percent * whole / 100 };
  }],
  roots: ['Квадратные корни', 8, (_, factor, difficulty) => {
    const root = random(2, factor + difficulty);
    return { expression: '√' + root ** 2, correct: root };
  }]
};

for (let number = 1; number <= 11; number += 1) {
  grade.add(new Option(number + ' класс', number));
}
grade.value = '5';

function renderTopics() {
  const currentGrade = Number(grade.value);
  const difficulty = level.selectedIndex;
  topics.replaceChildren();
  for (const [key, [name, minimumGrade]] of Object.entries(generators)) {
    if (minimumGrade > currentGrade) continue;
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = key;
    checkbox.checked = minimumGrade <= 2 || difficulty > 0 || minimumGrade === currentGrade;
    label.append(checkbox, ' ' + name);
    topics.append(label);
  }
  updateStart();
}

function updateStart() {
  start.disabled = !topics.querySelector(':checked');
}

let session;
let current;
let total = 0;
let correct = 0;

function next() {
  const previous = current?.expression;
  let candidate;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    if (!session.queue.length) session.queue = [...session.keys];
    const index = random(0, session.queue.length - 1);
    const key = session.queue.splice(index, 1)[0];
    candidate = generators[key][2](session.limit, session.factor, session.difficulty);
    if (candidate.expression !== previous) break;
    session.queue.push(key);
  }
  current = candidate;
  example.textContent = current.expression + ' = ?';
  answer.value = '';
  hint.textContent = '';
  answer.focus();
}

function updateScore() {
  score.textContent = 'Верно: ' + correct + ' из ' + total;
}

function parseAnswer(value) {
  const normalized = value.trim().replaceAll('−', '-').replaceAll(',', '.');
  if (/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(normalized)) return Number(normalized);
  const fraction = normalized.match(/^([+-]?\d+)\s*\/\s*(\d+)$/);
  return fraction && Number(fraction[2]) !== 0 ? Number(fraction[1]) / Number(fraction[2]) : NaN;
}

function displayCorrect(problem) {
  if (!problem.expression.includes('/')) return format(problem.correct);
  const denominator = Number(problem.expression.split('/').at(-1));
  let numerator = Math.round(problem.correct * denominator);
  let divisor = denominator;
  while (divisor > 1 && (numerator % divisor !== 0 || denominator % divisor !== 0)) divisor -= 1;
  numerator /= divisor;
  return denominator === divisor ? String(numerator) : numerator + '/' + denominator / divisor;
}

grade.addEventListener('change', renderTopics);
level.addEventListener('change', renderTopics);
topics.addEventListener('change', updateStart);

start.addEventListener('click', () => {
  const selectedGrade = Number(grade.value);
  const difficulty = level.selectedIndex;
  const keys = [...topics.querySelectorAll(':checked')].map(input => input.value);
  session = {
    keys, queue: [], difficulty,
    limit: selectedGrade === 1 ? [10, 15, 20][difficulty] :
      selectedGrade === 2 ? [20, 50, 100][difficulty] : [30, 60, 100][difficulty],
    factor: Math.min(15, selectedGrade + 3 + 2 * difficulty)
  };
  current = undefined;
  total = 0;
  correct = 0;
  history.replaceChildren();
  updateScore();
  practice.hidden = false;
  exercise.hidden = false;
  finish.hidden = false;
  settings.open = false;
  start.textContent = 'Начать заново';
  next();
});

exercise.addEventListener('submit', event => {
  event.preventDefault();
  const value = parseAnswer(answer.value);
  if (!Number.isFinite(value)) {
    hint.textContent = 'Введи число. Дробь можно записать как 1/2.';
    return;
  }
  const isCorrect = Math.abs(value - current.correct) < 1e-9;
  total += 1;
  correct += Number(isCorrect);
  const item = document.createElement('li');
  item.className = isCorrect ? 'correct' : 'incorrect';
  item.textContent = current.expression + ' = ' + answer.value.trim() +
    (isCorrect ? ' ✓' : ' · верный ответ ' + displayCorrect(current));
  history.prepend(item);
  updateScore();
  next();
});

finish.addEventListener('click', () => {
  exercise.hidden = true;
  finish.hidden = true;
  settings.open = true;
  start.focus();
});

renderTopics();
