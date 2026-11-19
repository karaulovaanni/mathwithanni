'use strict';

names[0] = 'Подобные фигуры';
heads[0] = 'Узнаём форму при изменении размера';
intros[0] = 'Сначала найди фигуры одной формы. Затем исследуй подобные треугольники в GeoGebra.';
heads[1] = 'Вспоминаем три признака равенства';
names[2] = 'Подобные треугольники';
heads[2] = 'Определение подобия и коэффициент';
intros[2] = 'Сопоставляем углы и сходственные стороны. Затем определяем коэффициент подобия.';
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
  const sides = mode === 1 ? [5,5,5] : mode === 2 ? [5,6,7] : [3,4,5];
  const angles = mode === 0 ? [90] : mode === 1 ? ['mark','mark'] : [];
  const pictureMode = ['proof-sas','proof-asa','proof-sss'][mode];
  return '<div class="pair-model">' +
    triangleTile(sides,'ABC',pictureMode,angles,'△ABC') +
    triangleTile(sides,'DEF',pictureMode,angles,'△DEF') + '</div>';
}

const equalityRules = [
  ['По двум сторонам и углу между ними','Если две стороны и угол между ними одного треугольника соответственно равны двум сторонам и углу между ними другого, то треугольники равны.','AB = DE = 3, AC = DF = 4, ∠A = ∠D = 90°. Угол лежит между выбранными сторонами.'],
  ['По стороне и двум прилежащим углам','Если сторона и два прилежащих к ней угла одного треугольника соответственно равны стороне и двум прилежащим к ней углам другого, то треугольники равны.','AB = DE. При этих сторонах равны прилежащие углы: ∠BAC = ∠EDF и ∠ABC = ∠DEF.'],
  ['По трём сторонам','Если три стороны одного треугольника соответственно равны трём сторонам другого, то треугольники равны.','AB = DE, AC = DF, BC = EF. Три пары сторон отмечены одним, двумя и тремя штрихами.']
];

function equalityLesson() {
  return card('Вспомни по чертежам','<p>Рассмотри каждый случай. Назови отмеченные равные элементы, объясни, почему треугольники равны, затем прочитай формулировку под чертежом.</p>') +
    equalityRules.map((rule,index)=>'<section class="card equality-case"><h3>Случай '+(index+1)+'</h3><p>Какие элементы отмечены? Достаточно ли их для равенства?</p>'+equalityPicture(index)+'<div class="theorem"><h4>'+rule[0]+'</h4><p>'+rule[1]+'</p><p class="hint">'+rule[2]+'</p></div></section>').join('') +
    '<section class="card trainer"><h3>Докажи равенство</h3><p>Рассмотри три чертежа выше. Для каждого запиши равенства отмеченных элементов и вывод △ABC = △DEF. Назови признак и объясни, почему угол находится между сторонами или прилежит к выбранной стороне.</p></section>' + commonSideProblem();
}

function commonSideProblem() {
  return card('Задача с общей стороной',
    '<p>В четырёхугольнике ABCD известны AB = AD и BC = DC. Проведена диагональ AC. Докажи, что △ABC = △ADC, и найди ∠ADC, если ∠ABC = 70°.</p>' +
    '<svg class="common-diagram" viewBox="0 0 520 240" role="img" aria-label="Два треугольника с общей стороной AC. AB равно AD, BC равно DC. Угол ABC равен 70 градусам."><path d="M60 120L190 25L450 120L190 215Z" fill="#e5eef8" stroke="#547fa9" stroke-width="3"/><path d="M60 120H450" stroke="#a45e88" stroke-width="3"/><path d="M119 65l12 17M119 175l12-17M307 60l-5 16m14-12-5 16M307 180l-5-16m14 12-5-16" stroke="#547fa9" stroke-width="3"/><g fill="#27304a" font-size="18"><text x="35" y="126">A</text><text x="183" y="18">B</text><text x="460" y="126">C</text><text x="183" y="238">D</text><text x="180" y="61">70°</text><text x="180" y="188">?</text><text x="236" y="110">общая сторона</text></g></svg>' +
    '<div class="proof-steps"><div><b>Дано</b>Две пары равных сторон отмечены штрихами.</div><div><b>Найди третью пару</b>Какая сторона входит в оба треугольника?</div><div><b>Сделай вывод</b>Назови признак и соответственные углы.</div></div>' +
    details('Пошаговый разбор','AB = AD и BC = DC по условию. AC = AC — общая сторона. Поэтому △ABC = △ADC по трём сторонам. Вершине B соответствует D, значит, ∠ADC = ∠ABC = 70°.'));
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
    card('Что удалось заметить?','<p>У подобных фигур сохраняется форма. Увеличение, уменьшение, поворот и отражение помогают узнавать одну форму в разных изображениях. В следующей теме вспомним равенство треугольников, затем дадим точное определение подобия.</p>');
  if(index===1) return equalityLesson();
  if(index===2) return similarityDefinition();
  if(index===3) return '<div id="sign"></div>' + geoSection() + proofPractice();
  if(index===6) return taskBank();
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
  if(page===5) drawComparison();
}
render=function(){if(geoApi){geoApi.remove();geoApi=null;}currentRender();connectPlan();typesetRelations();};

function fraction(top,bottom) {
  return '<math><mfrac><mtext>'+top+'</mtext><mtext>'+bottom+'</mtext></mfrac></math>';
}
function similarityDefinition() {
  return card('Определение подобных треугольников',
    '<p><b>Два треугольника называются подобными, если их углы соответственно равны, а сходственные стороны пропорциональны.</b> Сходственные стороны лежат против равных углов.</p><p class="formula">△ABC ∼ △DEF</p><div class="pair-model">'+triangleTile([3,4,5],'ABC','sides',[90],'△ABC')+triangleTile([6,8,10],'DEF','sides',[90],'△DEF')+'</div><p>Порядок букв в записи подобия указывает, какие углы и стороны являются соответственными.</p><div class="proof-steps"><div><b>Углы</b>∠BAC = ∠EDF<br>∠ABC = ∠DEF<br>∠ACB = ∠DFE</div><div><b>Сходственные стороны</b>AB и DE<br>AC и DF<br>BC и EF</div><div><b>Равные отношения</b>'+fraction('DE','AB')+' = '+fraction('DF','AC')+' = '+fraction('EF','BC')+'</div></div>')+
    card('Коэффициент подобия',
    '<p>При переходе от △ABC к △DEF <b>коэффициент подобия k</b> равен отношению стороны второго треугольника к сходственной стороне первого.</p><div class="formula">'+fraction('DE','AB')+' = '+fraction('DF','AC')+' = '+fraction('EF','BC')+' = k</div><div class="formula">k = '+fraction('6','3')+' = '+fraction('8','4')+' = '+fraction('10','5')+' = 2</div><p>Каждая сторона △DEF вдвое длиннее сходственной стороны △ABC. В обратном направлении коэффициент равен '+fraction('1','2')+'.</p><div class="proof-steps"><div><b>0 &lt; k &lt; 1</b>Получаем меньший треугольник.</div><div><b>k = 1</b>Подобные треугольники равны.</div><div><b>k &gt; 1</b>Получаем больший треугольник.</div></div>')+
    exercise(['Найди сходственную сторону','△ABC ∼ △DEF. AB = 8 см, DE = 12 см, AC = 10 см. Найди DF в сантиметрах.','15','k = DE/AB = 12/8 = 1,5. DF = AC · k = 10 · 1,5 = 15 см.'])+
    quiz('△ABC ∼ △DEF. Какая сторона сходственна стороне BC?',['DE','DF','EF'],2,'Стороны BC и EF лежат против равных углов BAC и EDF.');
}

showSign = function() {
  const examples = [cases[0],cases[2],cases[4]];
  const conditions = [
    '∠BAC = ∠EDF, ∠ABC = ∠DEF ⇒ △ABC ∼ △DEF.',
    fraction('DE','AB')+' = '+fraction('DF','AC')+' и ∠BAC = ∠EDF ⇒ △ABC ∼ △DEF. Углы заключены между указанными сторонами.',
    fraction('DE','AB')+' = '+fraction('DF','AC')+' = '+fraction('EF','BC')+' ⇒ △ABC ∼ △DEF.'
  ];
  document.getElementById('sign').innerHTML = examples.map((c,index)=>
    '<section class="card similarity-sign"><h3>'+['Первый признак · По двум углам','Второй признак · По двум сторонам и углу между ними','Третий признак · По трём сторонам'][index]+'</h3><p>'+theory[index]+'</p><div class="pair-model">'+triangleTile(c.a,'ABC',c.mode,c.aa,'△ABC')+triangleTile(c.b,'DEF',c.mode,c.ba,'△DEF')+'</div><div class="theorem formula">'+conditions[index]+'</div><h4>Применим ли этот признак?</h4><p>Сравни данные пары ниже. Объясни свой вывод.</p><div id="sign-task-'+index+'"></div></section>'
  ).join('');
  for(let index=0;index<3;index++)drawSignTask(index,0);
};
function drawSignTask(kind,variant) {
  const c=cases[kind*2+variant],box=document.getElementById('sign-task-'+kind);
  box.innerHTML='<div class="pair-model">'+triangleTile(c.a,'ABC',c.mode,c.aa,'△ABC')+triangleTile(c.b,'DEF',c.mode,c.ba,'△DEF')+'</div><div class="row"><button class="action" data-verdict="true">Да, условия выполнены</button><button class="action" data-verdict="false">Нет, условия не выполнены</button><button class="action next-sign-pair">Другая пара</button></div><p class="feedback" role="status"></p>';
  box.querySelectorAll('[data-verdict]').forEach(button=>button.onclick=()=>{
    const correct=(button.dataset.verdict==='true')===c.yes;
    box.querySelector('.feedback').textContent=correct?'Верно. '+c.reason:'Сверь отмеченные элементы с формулировкой признака.';
    typesetRelations();
  });
  box.querySelector('.next-sign-pair').onclick=()=>drawSignTask(kind,1-variant);
}

function proofPractice() {
  return card('Выбери основание для вывода',
    '<p>Для каждого пункта реши, доказано ли равенство, подобие или данных недостаточно. Запиши название признака.</p><ol class="notebook-list"><li>AB = DE, AC = DF, ∠BAC = ∠EDF.</li><li>∠BAC = ∠EDF, ∠ABC = ∠DEF. Длины сторон неизвестны.</li><li>AB = 4, AC = 6, DE = 8, DF = 12. Углы между этими сторонами равны.</li><li>Известна только одна пара равных углов.</li><li>Стороны двух треугольников равны 5, 6, 7 и 5, 6, 7.</li></ol><p class="hint">Для равных треугольников также верно подобие с k = 1. В обосновании укажи самый точный вывод из данных.</p>');
}

function taskBank() {
  const groups=[
    ['Определение и сходственные стороны',[0,1]],
    ['Три признака подобия',[2,3,4]],
    ['Параллельная прямая и подобие',[5]],
    ['Периметры и площади',[6,7,8]],
    ['Применение подобия',[9]]
  ];
  return card('Как оформить решение','<p>Выдели рассматриваемые треугольники, укажи равные углы или отношения сторон, назови признак. Запиши подобие с правильным порядком букв. Затем составь пропорцию и выполни вычисления.</p>')+
    groups.map(([title,indices])=>'<section class="card task-group"><h3>'+title+'</h3><ol class="task-list">'+indices.map(index=>'<li>'+exercise(practice[index])+'</li>').join('')+'</ol></section>').join('')+
    proofPractice();
}

// Render mathematical ratios as stacked fractions throughout lesson prose.
function typesetRelations() {
  const walker=document.createTreeWalker(main,NodeFilter.SHOW_TEXT);
  const nodes=[];
  while(walker.nextNode()){
    const node=walker.currentNode;
    if(node.parentElement.closest('svg,math,button,input,select'))continue;
    if(/[A-Za-zА-Яа-я0-9₁₂]\/[…A-Za-zА-Яа-я0-9₁₂]/.test(node.textContent))nodes.push(node);
  }
  for(const node of nodes){
    const expression=/([A-Za-zА-Яа-я0-9₁₂,]+)\s*\/\s*([A-Za-zА-Яа-я0-9₁₂,]+)/g;
    const source=node.textContent;
    const fragment=document.createDocumentFragment();
    let position=0, match;
    while((match=expression.exec(source))){
      fragment.append(document.createTextNode(source.slice(position,match.index)));
      const holder=document.createElement('span');
      holder.innerHTML=fraction(match[1],match[2]);
      fragment.append(...holder.childNodes);
      position=match.index+match[0].length;
    }
    fragment.append(document.createTextNode(source.slice(position)));
    node.replaceWith(fragment);
  }
}
render();
