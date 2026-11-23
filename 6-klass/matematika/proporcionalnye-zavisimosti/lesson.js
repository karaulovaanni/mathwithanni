import { mountQuiz, task, value, choice, dependency } from '../../../assets/grade6-quiz.js';

const get = id => document.getElementById(id);
const links = [...document.querySelectorAll('nav a')];
const panels = links.map(link => get(link.hash.slice(1)));

function openSection(moveFocus = false) {
  const panel = panels.find(item => '#' + item.id === location.hash) || panels[0];
  panels.forEach((item, i) => {
    item.hidden = item !== panel;
    if (item === panel) links[i].setAttribute('aria-current', 'page');
    else links[i].removeAttribute('aria-current');
  });
  if (moveFocus) {
    panel.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}
openSection();
window.addEventListener('hashchange', () => openSection(true));
links.forEach(link => link.addEventListener('click', event => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (location.hash !== link.hash) history.pushState(null, '', link.hash);
  openSection(true);
}));
window.addEventListener('popstate', () => openSection(true));
window.addEventListener('pageshow', event => { if (event.persisted) location.reload(); });

const format = n => n.toLocaleString('ru-RU', { maximumFractionDigits: 2 });
const svg = (content, title) => `<svg viewBox="0 0 460 216" role="img" aria-label="${title}" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
function grid(width, height, center, bottom, cell, fill) {
  const x = center - width * cell / 2;
  const y = bottom - height * cell;
  const path = [
    ...Array.from({ length: width - 1 }, (_, i) => `M${(i + 1) * cell} 0v${height * cell}`),
    ...Array.from({ length: height - 1 }, (_, i) => `M0 ${(i + 1) * cell}h${width * cell}`)
  ].join(' ');
  return `<g transform="translate(${x} ${y})"><rect width="${width * cell}" height="${height * cell}" fill="${fill}" stroke="#594579" stroke-width="2"/><path d="${path}" fill="none" stroke="#756493"/></g>`;
}
const label = (x, y, value) => `<text x="${x}" y="${y}" dominant-baseline="middle" text-anchor="middle" font-size="17" font-weight="650" fill="#35324c">${value}</text>`;

function renderSquare() {
  const side = Number(get('side').value);
  get('side').nextElementSibling.value = side;
  get('square-model').innerHTML = svg(grid(2, 2, 106, 168, 24, '#efe6fa') + grid(side, side, 335, 168, 24, '#ccbbeb') +
    label(106, 191, '2 см') + label(335, 191, side + ' см'), 'Квадраты со стороной 2 и ' + side + ' сантиметра');
  get('square-formula').textContent = `P = 4 · ${side} = ${side * 4} см`;
  get('square-side').textContent = side;
  get('square-perimeter').textContent = side * 4;
  get('square-caption').textContent = side === 2 ? 'Квадраты одинакового размера. Периметры равны.' :
    `Сторона и периметр ${side > 2 ? 'увеличились' : 'уменьшились'} в ${format(side > 2 ? side / 2 : 2 / side)} раза. На каждый сантиметр стороны приходится 4 см периметра.`;
}
get('side').addEventListener('input', renderSquare);
renderSquare();

const rectangleControls = get('rectangle-controls');
const sides = [1, 2, 3, 4, 6, 12];
for (const side of sides) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = side + ' см';
  button.dataset.side = side;
  button.addEventListener('click', () => renderRectangle(side));
  rectangleControls.append(button);
}
function renderRectangle(side) {
  const height = 12 / side;
  for (const button of rectangleControls.children) button.setAttribute('aria-pressed', String(Number(button.dataset.side) === side));
  get('rectangle-model').innerHTML = svg(grid(2, 6, 95, 180, 13, '#eef4fb') + grid(side, height, 320, 180, 13, '#bbd6ef') +
    label(95, 201, '2 × 6 см') + label(320, 201, side + ' × ' + height + ' см'), 'Два прямоугольника по 12 квадратных сантиметров');
  get('rectangle-formula').textContent = `S = ${side} · ${height} = 12 см²`;
  get('rectangle-side').textContent = side;
  get('rectangle-height').textContent = height;
  get('rectangle-caption').textContent = side === 2 ? 'Обе фигуры имеют стороны 2 см и 6 см.' :
    `Первая сторона ${side > 2 ? 'увеличилась' : 'уменьшилась'} в ${format(side > 2 ? side / 2 : 2 / side)} раза. Вторая ${side > 2 ? 'уменьшилась' : 'увеличилась'} во столько же раз. Площадь осталась 12 см².`;
}
renderRectangle(4);

mountQuiz(get('trainer'), [
  { title: 'Распознай зависимость', tasks: [
    task('Число порций и масса крупы, если рецепт один и тот же.', dependency(0), 'Подумай, сколько крупы приходится на каждую порцию.'),
    task('Число одинаковых принтеров и время печати одного тиража.', dependency(1), 'Тираж постоянен. При удвоении числа принтеров за минуту печатается вдвое больше.'),
    task('Сторона и площадь квадрата.', dependency(2), 'При удвоении стороны меняются сразу оба множителя площади.'),
    task('Скорость и путь за ровно 3 часа.', dependency(0), 'Во всех случаях умножаем скорость на одно и то же время.'),
    task('Цена упаковки и число упаковок на одну и ту же сумму. Сумма расходуется полностью.', dependency(1), 'Проверь произведение цены и количества.'),
    task('Количество взятых конфет и остаток в коробке из 36 конфет.', dependency(2), 'Сохраняется сумма, а не произведение.'),
    task('Определи вид зависимости по таблице.<table><tbody><tr><th scope="row">x</th><td>2</td><td>4</td><td>6</td></tr><tr><th scope="row">y</th><td>18</td><td>9</td><td>6</td></tr></tbody></table>', dependency(1), 'Проверь произведение x · y во всех столбцах.')
  ] },
  { title: 'Заполни пропуск', tasks: [
    task('Прямая зависимость. Заполни пропуск.<table><tbody><tr><th scope="row">x</th><td>4</td><td>9</td></tr><tr><th scope="row">y</th><td>14</td><td>?</td></tr></tbody></table>', value('y', 31.5), 'Раздели 14 на 4 и умножь частное на 9.'),
    task('Обратная зависимость. Заполни пропуск.<table><tbody><tr><th scope="row">x</th><td>8</td><td>12</td></tr><tr><th scope="row">y</th><td>15</td><td>?</td></tr></tbody></table>', value('y', 10), 'Произведение 8 · 15 должно совпасть с произведением 12 · y.'),
    task('Прямая зависимость. Заполни пропуск.<table><tbody><tr><th scope="row">x</th><td>2,5</td><td>?</td></tr><tr><th scope="row">y</th><td>10</td><td>36</td></tr></tbody></table>', value('x', 9), 'Сначала найди постоянное частное y : x.'),
    task('Обратная зависимость. Заполни пропуск.<table><tbody><tr><th scope="row">x</th><td>3</td><td>?</td></tr><tr><th scope="row">y</th><td>14</td><td>5,25</td></tr></tbody></table>', value('x', 8), 'Найди произведение по первому столбцу и раздели на 5,25.')
  ] },
  { title: 'Проверь рассуждение', tasks: [
    task('4 курьера развозят один заказ за 9 ч. Для 6 курьеров записали 4 : 6 = 9 : x.', choice('Какая запись верна?', ['4 : 6 = x : 9', '4 : 9 = 6 : x', '4 : 6 = 9 : x'], 0), 'При большем числе курьеров время меньше. Сохрани произведение 4 · 9.'),
    task('За 5 одинаковых рулонов заплатили 380 руб. Сколько стоят 8? Ученик записал 5 : 8 = x : 380.', choice('Какая запись верна?', ['5 : 8 = x : 380', '5 : 8 = 380 : x', '5 : x = 8 : 380'], 1), 'При постоянной цене оба отношения читаем в одном порядке.'),
    task('Даны пары (2, 8), (4, 16), (5, 21). Первые две пары подходят для прямой зависимости. Подходят ли все три?', choice('Выбери вывод', ['Да, достаточно двух пар', 'Да, все значения растут', 'Нет, частное в третьей паре другое'], 2), 'Проверь y : x для каждой пары.')
  ] },
  { title: 'Реши задачи', tasks: [
    task('За 3,2 м ленты заплатили 144 руб. Сколько стоят 5,5 м той же ленты?', [dependency(0), value('Рублей', 247.5)], 'Сначала найди стоимость одного метра.'),
    task('Велосипедист ехал 4 ч со скоростью 15 км/ч. За сколько часов он проедет тот же путь со скоростью 24 км/ч?', [dependency(1), value('Часов', 2.5)], 'Найди расстояние по первому случаю.'),
    task('5 одинаковых станков выполняют заказ за 36 минут. За сколько минут выполнят его 12 станков?', [dependency(1), value('Минут', 15)], 'При неизменном заказе произведение числа станков на время постоянно.'),
    task('В книге 180 страниц. Ученик прочитал 60 страниц, затем — ещё 30. Сколько осталось?', [dependency(2), value('Страниц', 90)], 'Сложи прочитанное и вычти его из всего объёма книги.'),
    task('На 8 порций нужно 600 г ягод. Сколько граммов нужно на 14 таких порций?', [dependency(0), value('Граммов', 1050)], 'Рецепт неизменен. Определи массу ягод на порцию.'),
    task('На 480 рублей можно купить несколько одинаковых блокнотов. Было 60 руб. за штуку, стало 40 руб. Сколько блокнотов теперь можно купить?', [dependency(1), value('Блокнотов', 12)], 'Цена меняется при одной и той же сумме покупки.')
  ] }
]);
