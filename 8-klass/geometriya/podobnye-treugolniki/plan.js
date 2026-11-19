'use strict';

names[0] = 'Подобные фигуры';
heads[0] = 'Узнаём форму при изменении размера';
intros[0] = 'Сначала найди фигуры одной формы. Затем исследуй подобные треугольники в GeoGebra.';
heads[1] = 'Вспоминаем три признака равенства';
heads[5] = 'Равные и подобные: сравни на чертежах';

const currentContent = content;
const currentRender = render;

function shapePicture(kind, transform = '', label = '') {
  const shapes = {
    house: '<path d="M-35 35V-10L0-40L35-10V35Z"/>',
    tallHouse: '<path d="M-23 42V-16L0-45L23-16V42Z"/>',
    flatRoof: '<path d="M-35 35V-10L0-23L35-10V35Z"/>',
    square: '<rect x="-33" y="-33" width="66" height="66"/>',
    circle: '<circle r="34"/>',
    triangle: '<path d="M-35 32L0-38L35 32Z"/>'
  };
  return '<svg viewBox="0 0 180 140" role="img" aria-label="' + label + '"><g transform="translate(90 70) ' + transform + '" fill="#b9d8e8" stroke="#547fa9" stroke-width="2.5" stroke-linejoin="round">' + shapes[kind] + '</g></svg>';
}

function shapeFinder() {
  const figures = [
    ['house','scale(.75)',true],
    ['tallHouse','',false],
    ['square','rotate(20)',false],
    ['house','rotate(90) scale(.9)',true],
    ['flatRoof','',false],
    ['circle','',false],
    ['house','scale(-1.1 1.1)',true],
    ['triangle','rotate(-15)',false]
  ];
  return '<section class="card shape-finder"><h3>Найди все копии образца</h3><p>У копии можно изменить размер, повернуть её или отразить. Все длины должны меняться в одинаковое число раз.</p><div class="shape-reference">' + shapePicture('house','','Образец: пятиугольник в форме домика') + '<div><b>Образец</b><p>Выбери среди восьми фигур все подобные ему. Нажатие отмечает фигуру, повторное нажатие снимает выбор.</p></div></div><div class="shape-gallery">' + figures.map(([kind, transform, correct], index) => '<button class="shape-option" type="button" aria-pressed="false" data-shape="' + index + '" data-match="' + correct + '" aria-label="Фигура ' + (index+1) + '">' + shapePicture(kind,transform,'Фигура ' + (index+1)) + '<span>Фигура ' + (index+1) + '</span></button>').join('') + '</div><div class="controls"><button class="action primary" id="check-shapes">Проверить выбор</button><button class="action" id="clear-shapes">Снять выделение</button></div><p class="feedback" id="shapes-feedback" role="status"></p><details><summary>На что смотреть</summary><p>Сопоставь крышу, стены и основание. У подобной копии сохраняются углы и отношения длин. При растяжении только по вертикали форма меняется.</p></details></section>';
}

function equalityPicture(mode) {
  const sides = [3,4,5];
  const angles = mode === 0 ? [90] : mode === 1 ? [90,53.13] : [];
  const pictureMode = mode === 0 ? 'sas' : mode === 1 ? 'asa' : 'sides';
  return '<div class="pair-model">' +
    triangleTile(sides,'ABC',pictureMode,angles,['AB = 3, AC = 4, ∠A = 90°','AB = 3, ∠A = 90°, ∠B ≈ 53,13°','AB = 3, AC = 4, BC = 5'][mode]) +
    triangleTile(sides,'DEF',pictureMode,angles,['DE = 3, DF = 4, ∠D = 90°','DE = 3, ∠D = 90°, ∠E ≈ 53,13°','DE = 3, DF = 4, EF = 5'][mode]) + '</div>';
}

const equalityRules = [
  ['По двум сторонам и углу между ними','Если две стороны и угол между ними одного треугольника соответственно равны двум сторонам и углу между ними другого, то треугольники равны.','AB = DE = 3, AC = DF = 4, ∠A = ∠D = 90°. Угол лежит между выбранными сторонами.'],
  ['По стороне и двум прилежащим углам','Если сторона и два прилежащих к ней угла одного треугольника соответственно равны стороне и двум прилежащим к ней углам другого, то треугольники равны.','AB = DE = 3. У концов этих сторон равны углы A и D, B и E. На рисунке значения непрямых углов округлены.'],
  ['По трём сторонам','Если три стороны одного треугольника соответственно равны трём сторонам другого, то треугольники равны.','AB = DE = 3, AC = DF = 4, BC = EF = 5. Положение фигур на листе значения не имеет.']
];

function equalityLesson() {
  return '<section class="card"><h3>Каких данных достаточно?</h3><p>Равные треугольники можно совместить наложением. Одинаковыми будут и форма, и размер. Выбирай признак и смотри, какие элементы нужно сопоставить.</p><div class="tabs" id="equality-tabs">' + equalityRules.map((rule,index)=>'<button class="action" data-equality="' + index + '" aria-pressed="' + (index===0) + '">' + ['Две стороны и угол','Сторона и два угла','Три стороны'][index] + '</button>').join('') + '</div><div id="equality-example"></div></section><section class="card trainer"><h3>Докажи равенство</h3><p>Выбери признак, который следует из отмеченных данных. Затем объясни соответствие вершин.</p><div id="equality-question"></div></section>' + commonSideProblem();
}

function commonSideProblem() {
  return card('Задача с общей стороной',
    '<p>В четырёхугольнике ABCD известны AB = AD и BC = DC. Проведена диагональ AC. Докажи, что △ABC = △ADC, и найди ∠ADC, если ∠ABC = 70°.</p>' +
    '<svg class="common-diagram" viewBox="0 0 520 240" role="img" aria-label="Два треугольника с общей стороной AC. AB равно AD, BC равно DC. Угол ABC равен 70 градусам."><path d="M60 120L190 25L450 120L190 215Z" fill="#e5eef8" stroke="#547fa9" stroke-width="3"/><path d="M60 120H450" stroke="#a45e88" stroke-width="3"/><path d="M119 65l12 17M119 175l12-17M307 60l-5 16m14-12-5 16M307 180l-5-16m14 12-5-16" stroke="#547fa9" stroke-width="3"/><g fill="#27304a" font-size="18"><text x="35" y="126">A</text><text x="183" y="18">B</text><text x="460" y="126">C</text><text x="183" y="238">D</text><text x="180" y="61">70°</text><text x="180" y="188">?</text><text x="236" y="110">общая сторона</text></g></svg>' +
    '<div class="proof-steps"><div><b>Дано</b>Две пары равных сторон отмечены штрихами.</div><div><b>Найди третью пару</b>Какая сторона входит в оба треугольника?</div><div><b>Сделай вывод</b>Назови признак и соответственные углы.</div></div>' +
    details('Пошаговый разбор','AB = AD и BC = DC по условию. AC = AC — общая сторона. Поэтому △ABC = △ADC по трём сторонам. Вершине B соответствует D, значит, ∠ADC = ∠ABC = 70°.'));
}

const equalityQuestions = [
  {mode:0,title:'AB = DE, AC = DF, ∠A = ∠D. Что доказывает равенство?',answer:0},
  {mode:1,title:'AB = DE, ∠A = ∠D, ∠B = ∠E. Какой признак применим?',answer:1},
  {mode:2,title:'AB = DE, AC = DF, BC = EF. Какой признак применим?',answer:2}
];
let equalityIndex = 0;
function drawEqualityQuestion() {
  const task = equalityQuestions[equalityIndex];
  document.getElementById('equality-question').innerHTML = '<p>' + task.title + '</p>' + equalityPicture(task.mode) + '<div class="row">' + ['Две стороны и угол','Сторона и два угла','Три стороны'].map((label,index)=>'<button class="action" data-proof="' + index + '">' + label + '</button>').join('') + '<button class="action" id="next-equality">Следующий чертёж</button></div><p class="feedback" role="status"></p>';
  document.querySelectorAll('[data-proof]').forEach(button=>button.onclick=()=>{
    const correct = Number(button.dataset.proof) === task.answer;
    document.querySelector('#equality-question .feedback').textContent = correct ? 'Верно. Сопоставь A ↔ D, B ↔ E, C ↔ F и назови три использованных условия.' : 'Проверь, какие стороны и углы даны. Угол между сторонами и углы при стороне занимают разные места.';
  });
  document.getElementById('next-equality').onclick=()=>{
    equalityIndex=(equalityIndex+1)%equalityQuestions.length;
    drawEqualityQuestion();
  };
}

function comparisonLesson() {
  return card('Одна форма. А размер?',
    '<p>Рассмотри три треугольника. У всех сторон указаны длины. Определи, какие можно совместить движением, а какие — получить изменением масштаба.</p>' +
    '<div class="comparison-trio">' +
    triangleTile([3,4,5],'ABC','sides',[],'Оригинал · стороны 3, 4, 5') +
    triangleTile([3,4,5],'DEF','sides',[],'Копия 1 · стороны 3, 4, 5') +
    triangleTile([6,8,10],'KLM','sides',[],'Копия 2 · стороны 6, 8, 10') + '</div>' +
    '<div class="comparison-table"><table><thead><tr><th>Что сравниваем</th><th>Равные треугольники</th><th>Подобные треугольники</th></tr></thead><tbody><tr><th>Форма</th><td>Одинаковая</td><td>Одинаковая</td></tr><tr><th>Соответственные углы</th><td>Равны</td><td>Равны</td></tr><tr><th>Соответственные стороны</th><td>Равны</td><td>Пропорциональны</td></tr><tr><th>Коэффициент k</th><td>k = 1</td><td>Любое k &gt; 0</td></tr><tr><th>Периметры и площади</th><td>Совпадают</td><td>P₂/P₁ = k, S₂/S₁ = k²</td></tr></tbody></table></div>' +
    note('Каждая пара равных треугольников подобна с k = 1. Чтобы из подобия получить равенство, достаточно установить k = 1.')) +
    '<section class="card trainer"><h3>Сравни пары</h3><div id="comparison-question"></div></section>' +
    exercise(['Периметры равны. Что можно доказать?','Известно, что △ABC ∼ △DEF. P(ABC) = 30 см, P(DEF) = 30 см. Найди коэффициент перехода от ABC к DEF. Объясни, равны ли эти треугольники.','1','k = 30/30 = 1. Каждая пара соответственных сторон равна. Треугольники равны.']) +
    quiz('Можно ли доказать равенство только по одинаковой площади?',['Да','Данных недостаточно'],1,'Площадь не определяет форму треугольника. Например, разные основания и высоты могут давать одно и то же произведение.');
}

const comparisons = [
  [[3,4,5],[3,4,5],0,'Стороны попарно равны. Треугольники равны по трём сторонам и подобны с k = 1.'],
  [[3,4,5],[6,8,10],1,'Все стороны второго в 2 раза больше. Применим третий признак подобия, k = 2. Размеры различаются.'],
  [[3,4,5],[3,4,6],2,'Две стороны совпали, но третья различается. Все три отношения не равны.']
];
let comparisonIndex = 0;
function drawComparison() {
  const [a,b,answer,reason] = comparisons[comparisonIndex];
  document.getElementById('comparison-question').innerHTML = '<div class="pair-model">' + triangleTile(a,'ABC','sides',[],'Первый треугольник') + triangleTile(b,'DEF','sides',[],'Второй треугольник') + '</div><div class="row">' + ['Равны и подобны','Подобны, размеры различаются','Подобие отсутствует'].map((label,index)=>'<button class="action" data-compare-answer="' + index + '">' + label + '</button>').join('') + '<button class="action" id="next-comparison">Другая пара</button></div><p class="feedback" role="status"></p>';
  document.querySelectorAll('[data-compare-answer]').forEach(button=>button.onclick=()=>{
    const correct = Number(button.dataset.compareAnswer) === answer;
    document.querySelector('#comparison-question .feedback').textContent = correct ? 'Верно. ' + reason : 'Сравни все три пары сторон. Проверь, равны ли они и одинаковы ли их отношения.';
  });
  document.getElementById('next-comparison').onclick=()=>{
    comparisonIndex=(comparisonIndex+1)%comparisons.length;
    drawComparison();
  };
}

content = function(index) {
  if(index===0) return shapeFinder() + geoSection() +
    card('Переходим к треугольникам','<p>У подобных треугольников соответственные углы равны, а длины соответственных сторон изменяются в одно и то же число раз. Коэффициент перехода от ABC к DEF равен k = DE/AB.</p><div class="proof-steps"><div><b>0 &lt; k &lt; 1</b>Копия меньше оригинала.</div><div><b>k = 1</b>Одинаковые форма и размер.</div><div><b>k &gt; 1</b>Копия больше оригинала.</div></div>') +
    quiz('При масштабировании треугольника что сохраняется?',['Длины сторон','Величины углов','Площадь'],1,'Все длины меняются в k раз, а углы сохраняются.');
  if(index===1) return equalityLesson();
  if(index===5) return comparisonLesson();
  return currentContent(index);
};

function connectPlan() {
  if(page===0) {
    const feedback=document.getElementById('shapes-feedback');
    const options=[...document.querySelectorAll('[data-shape]')];
    options.forEach(button=>button.onclick=()=>{
      button.setAttribute('aria-pressed',button.getAttribute('aria-pressed')!=='true');
      feedback.textContent='';
    });
    document.getElementById('check-shapes').onclick=()=>{
      const selected=options.filter(button=>button.getAttribute('aria-pressed')==='true');
      if(!selected.length){feedback.textContent='Выбери фигуры перед проверкой.';return;}
      const correct=options.every(button=>(button.getAttribute('aria-pressed')==='true')===(button.dataset.match==='true'));
      feedback.textContent=correct?'Верно. Размер, поворот и отражение изменились, а форма сохранилась.':'Проверь наклон крыши и пропорции стен. Найди все копии образца.';
    };
    document.getElementById('clear-shapes').onclick=()=>{
      options.forEach(button=>button.setAttribute('aria-pressed','false'));
      feedback.textContent='';
    };
  }
  if(page===1) {
    function selectEquality(index) {
      const rule=equalityRules[index];
      document.getElementById('equality-example').innerHTML='<h3 style="margin-top:18px">'+rule[0]+'</h3><p>'+rule[1]+'</p>'+equalityPicture(index)+note(rule[2]);
      document.querySelectorAll('[data-equality]').forEach(button=>button.setAttribute('aria-pressed',Number(button.dataset.equality)===index));
    }
    document.querySelectorAll('[data-equality]').forEach(button=>button.onclick=()=>selectEquality(Number(button.dataset.equality)));
    selectEquality(0);
    drawEqualityQuestion();
  }
  if(page===5) drawComparison();
}
render=function(){currentRender();connectPlan();};
render();
