'use strict';

const byId = id => document.getElementById(id);
const chapters = [...document.querySelectorAll('.chapter')];
const tabs = [...document.querySelectorAll('.topic-nav a')];

function openChapter(moveFocus) {
  const notebook = chapters.flatMap(item => [...item.querySelectorAll('.notebook')]).find(item => '#'+item.id === location.hash);
  const chapter = notebook?.closest('.chapter') ?? chapters.find(item => '#'+item.id === location.hash) ?? chapters[0];
  for (const item of chapters) item.hidden = item !== chapter;
  for (const link of tabs) {
    if (link.hash === '#' + chapter.id) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  if (notebook) notebook.scrollIntoView({block:'start'});
  else if (moveFocus) {
    chapter.focus({preventScroll: true});
    window.scrollTo({top: 0, behavior: 'instant'});
  }
}

openChapter(false);
history.scrollRestoration = 'manual';
document.querySelector('main').addEventListener('click', event => {
  const link = event.target.closest('.topic-nav a, .next-topic');
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (location.hash !== link.hash) history.pushState(null, '', link.hash);
  openChapter(true);
});
window.addEventListener('popstate', () => openChapter(true));
window.addEventListener('hashchange', () => openChapter(true));
window.addEventListener('pageshow', event => {
  if (event.persisted) location.reload();
});

const svg = (width, height, art) =>
  '<svg viewBox="0 0 '+width+' '+height+'" aria-hidden="true" focusable="false">'+art+'</svg>';
const fraction = (a,b) => '<math><mfrac><mn>'+a+'</mn><mn>'+b+'</mn></mfrac></math>';
const label = (x,y,text,cls='') =>
  '<text x="'+x+'" y="'+y+'" text-anchor="middle" class="'+cls+'">'+text+'</text>';
const number = n => n.toLocaleString('ru-RU',{maximumFractionDigits:2});
const gcd = (a,b) => b ? gcd(b,a%b) : a;

function renderDrink() {
  const portions = Number(byId('servings').value);
  const extra = Number(byId('extra-water').checked);
  const juice = 2*portions;
  const water = 3*portions + extra;
  byId('servings-value').value = portions;
  const cup = (x,y,kind) => '<g transform="translate('+x+' '+y+') scale(.88)"><path d="M0 0H28L24 27Q23 32 19 32H9Q5 32 4 27Z" fill="#fff" stroke="#786d86" stroke-width="1.3"/><path d="M4 13H24L22 27Q22 29 19 29H9Q6 29 6 27Z" class="'+kind+'"/><path d="M7 8h7m-6 10h5" stroke="#5b526e" opacity=".55"/></g>';
  const cups = (count,y,kind) => Array.from({length:count},(_,i)=>cup(18+i*27,y,kind)).join('');
  const surface = 163 - (juice+water)*7;
  const tint = 100 - Math.round(juice/(juice+water)*90);
  byId('drink').innerHTML = svg(510,226,
    '<defs><clipPath id="pitcher"><path d="M326 54H425L416 156Q414 173 400 173H345Q332 173 330 156L320 68L306 54Z"/></clipPath></defs>'+
    '<rect x="4" y="13" width="288" height="192" rx="18" fill="#fffcff"/>'+
    label(101,40,'Сок · '+juice+' мерок')+cups(juice,51,'berry-fill')+
    label(111,123,'Вода · '+water+' мерок')+cups(water,135,'water-fill')+
    '<path d="M420 81Q484 59 471 113Q466 134 418 139" fill="none" stroke="#796782" stroke-width="6"/>'+
    '<path d="M326 54H425L416 156Q414 173 400 173H345Q332 173 330 156L320 68L306 54Z" fill="#fff" stroke="#796782" stroke-width="3"/>'+
    '<path d="M308 '+surface+'Q351 '+(surface-6)+' 386 '+surface+'T437 '+surface+'V177H308Z" clip-path="url(#pitcher)" fill="hsl(333 45% '+tint+'%)"/>'+
    '<path d="M341 69l7 81m50-65h16m-18 20h16m-17 20h15" fill="none" stroke="#796782" opacity=".65"/>'+
    label(387,200,'Всего '+(juice+water)+' мерок'));
  const mode = byId('compare').selectedIndex;
  const [first,second] = [[juice,water],[water,juice],[juice,juice+water]][mode];
  const divisor = gcd(first,second);
  const explanation = extra ? 'Добавили воду только во вторую группу. Состав напитка изменился.' :
    portions>1 ? 'Увеличили оба количества в '+portions+' раза. Отношение сохранилось.' :
    'Первое число показывает, что сравниваем. Второе показывает, с чем сравниваем.';
  byId('ratio-result').innerHTML = '<p class="formula">'+first+' : '+second+' = '+fraction(first,second)+(divisor>1?' = '+fraction(first/divisor,second/divisor):'')+'</p><p>'+explanation+'</p>';
}

function renderPostcard() {
  const w = Number(byId('width').value);
  const locked = byId('keep-shape').checked;
  const h = locked ? w*2/3 : Number(byId('height').value);
  byId('width-value').value = w;
  byId('height-value').value = number(h);
  byId('height-option').hidden = locked;
  const picture = (x,y,width,height) => '<svg x="'+x+'" y="'+y+'" width="'+width+'" height="'+height+'" viewBox="0 0 120 80" preserveAspectRatio="none"><rect width="120" height="80" fill="#bcd3e6"/><circle cx="87" cy="24" r="12" fill="#fff4cd"/><path d="M0 65L25 31L57 67L82 49L120 69V80H0Z" fill="#8b8ab9"/><path d="M0 71Q28 53 59 69T120 64V80H0Z" fill="#699e96"/><path d="M74 64q-19 7-2 16h17q-15-9-3-16" fill="#efe0cf"/><rect x="1" y="1" width="118" height="78" fill="none" stroke="#fdf7ff" stroke-width="2"/></svg>';
  const equal = locked || 6*h === 4*w;
  byId('postcard').innerHTML = svg(500,235,'<rect x="6" y="7" width="488" height="196" rx="17" fill="#edf3fb"/>'+
    picture(23,74,96,64)+picture(160+(320-w*16)/2,7+(196-h*16)/2,w*16,h*16)+
    label(70,225,'Оригинал 6 × 4')+label(320,225,'Копия '+w+' × '+number(h)));
  byId('scale-result').innerHTML = '<p class="formula">6 : 4 '+(equal?'=':'≠')+' '+w+' : '+number(h)+'</p><p>'+
    (equal?'Отношение сторон сохранилось. Луна осталась круглой.':'Стороны изменились в разное число раз. Луна стала овальной.')+'</p>';
}

function crossDiagram(values, crossed) {
  const nodes = [[83,44],[83,119],[277,44],[277,119]];
  const lines = [
    '<path d="M83 44L277 119" stroke="#a65c38" stroke-width="4"/>',
    '<path d="M83 119L277 44" stroke="#7857a5" stroke-width="4"/>'
  ];
  return svg(360,165,crossed.map(i=>lines[i]).join('')+
    '<path d="M49 82H117M243 82H311" stroke="#4b3856" stroke-width="3"/>'+
    label(180,87,'=','svg-large')+
    nodes.map(([x,y],i)=>'<rect x="'+(x-33)+'" y="'+(y-19)+'" width="66" height="38" rx="10" fill="'+([0,3].includes(i)?'#f7d6ba':'#e8dcf5')+'"/>'+label(x,y+7,values[i],'svg-large')).join(''));
}

function renderProducts() {
  const middle = byId('product-choice').selectedIndex === 1;
  byId('products').innerHTML = crossDiagram([6,4,12,8],[middle?1:0]);
  byId('product-pair').textContent = middle ? 'Средние: 4 · 12 = 48' : 'Крайние: 6 · 8 = 48';
}

function renderDiagonalStep(step) {
  const descriptions = [
    ['9 и x — крайние','В записи 9 : 6 = 12 : x числа 9 и x стоят по краям. В записи дробями их соединяет одна диагональ.'],
    ['6 · 12 = 72','На другой диагонали оба числа известны. Их произведение равно произведению 9 · x.'],
    ['x = 72 : 9 = 8','В равенстве 9 · x = 72 ищем неизвестный множитель. Делим произведение на 9.'],
    ['9 · 8 = 6 · 12','Подставляем 8 в исходную пропорцию. Оба произведения равны 72.']
  ];
  byId('step-diagram').innerHTML = crossDiagram([9,6,12,step===3?8:'x'],step===0?[0]:[0,1]);
  const [equation,explanation]=descriptions[step];
  byId('diagonal-message').innerHTML = '<p class="formula">'+equation+'</p><p>'+explanation+'</p>';
}
byId('diagonal-steps').addEventListener('click', event=>{
  const btn=event.target.closest('button[data-step]');
  if (!btn) return;
  for(const sibling of byId('diagonal-steps').children) sibling.setAttribute('aria-pressed',sibling===btn);
  renderDiagonalStep(Number(btn.dataset.step));
});
renderDiagonalStep(0);

function renderFruit(id, grouped) {
  function mark(x,y,pear) {
    const fruit = pear ?
      '<path d="M-12 9Q-13 0 -5 -8Q-5 -17 1 -17Q9 -17 10 -5Q16 2 14 10Q11 17 1 17Q-10 17 -12 9Z" fill="#81ad61"/>' :
      '<path d="M0 -10C-20 -21 -18 7 -10 13Q-5 18 0 14Q9 19 15 6Q22 -16 0 -10Z" fill="#ce667d"/>';
    return '<g transform="translate('+x+' '+y+')">'+fruit+'<path d="M0 -11q-2 -9 5 -11M0 -16q-10 0 -11 -7q8 0 11 7" fill="#639865" stroke="#426c48" stroke-width="1.3"/></g>';
  }
  let drawing = grouped ?
    '<rect x="13" y="5" width="145" height="114" rx="14" fill="#f1e8f7"/><rect x="171" y="5" width="145" height="114" rx="14" fill="#f1e8f7"/>' :
    '<path d="M43 48v26m48-26v26" stroke="#8866a5" stroke-width="2" stroke-dasharray="4 3"/>';
  for (let i=0;i<6;i++) drawing+=mark(grouped?40+(i%3)*44+Math.floor(i/3)*158:43+i*48,34,false);
  for (const x of (grouped?[84,242]:[43,91])) drawing+=mark(x,96,true);
  byId(id).innerHTML=svg(335,125,drawing);
}
renderFruit('fruit-difference',false);
renderFruit('fruit-ratio',true);

function renderBeads(step) {
  const messages = [
    ['2 + 3 = 5 долей','Размечаем пять равных долей. Две будут коралловыми, три — мятными.'],
    ['60 : 5 = 12 бусин','Разделили все бусины поровну на пять долей. Размер каждой доли теперь известен.'],
    ['12 · 2 = 24, 12 · 3 = 36','Объединяем доли каждого цвета и находим два количества.']
  ];
  const art = Array.from({length:5},(_,i)=>{
    const x=17+i*94;
    const beads=Array.from({length:12},(_,j)=>{
      const cx=12+(j%4)*19, cy=16+Math.floor(j/4)*19;
      return '<circle cx="'+cx+'" cy="'+cy+'" r="7.3" class="'+(i<2?'berry-fill':'mint-fill')+'"/><circle cx="'+(cx-2)+'" cy="'+(cy-2)+'" r="2" fill="#fff" opacity=".7"/>';
    }).join('');
    return '<g transform="translate('+x+' 47)"><rect width="82" height="72" rx="11" fill="'+(i<2?'#fbe3e9':'#d9eee5')+'"/>'+
      (step===0?label(41,42,String(i+1),'svg-large'):beads)+label(41,93,step?'12 бусин':'Доля '+(i+1))+'</g>';
  }).join('');
  byId('beads').innerHTML = svg(500,174,label(250,25,'Весь браслет · 60 бусин')+art+
    (step===2?'<path d="M17 147v7h176v-7m12 0v7h270v-7" fill="none" stroke="#79678d" stroke-width="2"/>'+label(105,172,'Коралловые')+label(340,172,'Мятные'):''));
  byId('part-result').innerHTML='<p class="formula">'+messages[step][0]+'</p><p>'+messages[step][1]+'</p>';
}

byId('balance').innerHTML=svg(430,124,
  '<path d="M47 37Q215 106 382 37" fill="none" stroke="#ae7292" stroke-width="3"/>'+
  '<path d="M147 37Q215 74 282 37" fill="none" stroke="#688eab" stroke-width="3"/>'+
  [[47,'3','#f9dfea'],[147,'5','#e1ecf8'],[282,'12','#e1ecf8'],[382,'x','#f9dfea']].map(([x,t,c])=>'<circle cx="'+x+'" cy="25" r="21" fill="'+c+'"/>'+label(x,33,t,'svg-large')).join('')+
  label(97,33,':')+label(215,33,'=')+label(332,33,':')+label(215,108,'3 · x = 5 · 12'));

for (const id of ['servings','extra-water','compare']) byId(id).addEventListener('input',renderDrink);
for (const id of ['width','height']) byId(id).addEventListener('input',renderPostcard);
byId('keep-shape').addEventListener('change', () => {
  byId('height').value = Math.round(Number(byId('width').value)*2/3);
  renderPostcard();
});
byId('product-choice').addEventListener('change',renderProducts);
byId('part-steps').addEventListener('click',event=>{
  const button = event.target.closest('button[data-step]');
  if (!button) return;
  for(const child of byId('part-steps').children) child.setAttribute('aria-pressed',child===button);
  renderBeads(Number(button.dataset.step));
});
renderDrink();
renderPostcard();
renderProducts();
renderBeads(0);

const ratioTasks = [
  ['В корзине 8 яблок и 12 груш. Запиши отношение числа яблок ко всем фруктам.', ['8 яблок','12 груш','20 фруктов'], [0,2]],
  ['В группе 6 новичков и 9 опытных игроков. Запиши отношение числа опытных игроков к числу новичков.', ['6 новичков','9 опытных','15 игроков'], [1,0]],
  ['За 3 часа поезд проехал 210 км. Запиши отношение пути ко времени.', ['3 часа','210 км','70 км в час'], [1,0]]
];
const proportionTasks = [
  ['В одном пакете 2 красные и 3 синие бусины. В другом пакете 8 красных и 12 синих. Сравни красные с синими сначала в первом пакете, затем во втором.', ['12','2','8','3'], [1,3,2,0]],
  ['Для 3 листов нужно 6 наклеек, для 5 листов — 10. Сравни число листов с числом наклеек сначала в первой паре, затем во второй.', ['10','6','5','3'], [3,1,2,0]]
];
const splitTasks = [
  ['Раздели 96 бусин на две группы в отношении 3 : 5.', ['Разделить 96 на число равных долей','Проверить, что группы дают 96 и имеют отношение 3 : 5','Сложить 3 и 5','Размер доли умножить отдельно на 3 и на 5'], [2,0,3,1]],
  ['Распредели 72 жетона между тремя игроками в отношении 1 : 2 : 3.', ['Проверить сумму и отношение трёх групп','Умножить размер доли на 1, 2 и 3','Сложить 1, 2 и 3','Разделить 72 на число долей'], [2,3,1,0]]
];
const strategyTasks = [
  ['Для 4 одинаковых альбомов понадобилось 28 листов. Для 9 альбомов нужно x листов.', ['Найти x делением на 4','Записать 4 : 28 = 9 : x','Проверить подстановкой и записать единицу измерения','Приравнять 4 · x и 28 · 9'], [1,3,0,2]],
  ['На 6 порций нужно 450 г ягод. На 8 порций нужно x граммов.', ['Приравнять 6 · x и 450 · 8','Проверить подстановкой и записать единицу измерения','Найти x делением на 6','Записать 6 : 450 = 8 : x'], [3,0,2,1]],
  ['Увеличили рисунок шириной 8 см и высотой 5 см. Ширина копии 24 см, высота x см.', ['Проверить, что обе стороны увеличились в одинаковое число раз','Найти x делением на 8','Приравнять 8 · x и 5 · 24','Записать 8 : 5 = 24 : x'], [3,2,1,0]]
];

function mountBuilder(id, tasks, layout, options = {}) {
  const host = byId(id);
  host.innerHTML = '<p class="task-count"></p><p class="task-text"></p><div class="slots"></div>'+
    '<div class="bank" aria-label="Карточки"></div>'+
    '<div class="controls"><button type="button" class="primary" data-action="check">Проверить</button>'+
    '<button type="button" data-action="reset">Сбросить</button><button type="button" data-action="next">Другое условие →</button></div>'+
    '<p class="feedback" role="status"></p>'+(options.solve ? '<form class="value-form" hidden autocomplete="off"><label class="inline">Найди x <input name="value" inputmode="decimal" required></label> <button class="primary">Проверить x</button><p class="feedback" role="status"></p></form>' : '');
  const find = selector => host.querySelector(selector);
  const slots = find('.slots');
  const bank = find('.bank');
  slots.classList.add(layout);
  const feedback = find('.feedback');
  const valueForm = find('.value-form');
  let current = 0;
  let placed = [];
  let selected = null;

  function cardButton(attrs, text) {
    return '<button type="button" '+attrs+'>'+text+'</button>';
  }

  function paint(focusSelector) {
    const [question, cards, order] = tasks[current];
    find('.task-text').textContent = question;
    find('.task-count').textContent = 'Задание '+(current+1)+' из '+tasks.length;
    const slotsHtml = order.map((_,i)=>{
      const card = placed[i];
      const name = layout==='steps' ? 'Шаг '+(i+1) : 'Место '+(i+1);
      const attrs = 'data-slot="'+i+'" data-step-label="'+(i+1)+'. " aria-label="'+name+(card==null?', пусто':', '+cards[card])+'"';
      const slot = card==null ? cardButton(attrs,name) :
        cardButton(attrs+' draggable="true" data-card="'+card+'" aria-pressed="'+(selected===card)+'"',cards[card]);
      const separator = layout==='proportion' && i===2 ? '=' : (layout!=='steps' && i>0 ? ':' : '');
      return (separator?'<span aria-hidden="true">'+separator+'</span>':'')+slot;
    });
    slots.innerHTML = slotsHtml.join('');
    bank.innerHTML = cards.map((item,i)=>placed.includes(i)?'':
      cardButton('draggable="true" data-card="'+i+'" aria-pressed="'+(i===selected)+'"',item)).join('');
    if (focusSelector) find(focusSelector)?.focus({preventScroll:true});
  }

  function clearValue() {
    if (valueForm) {
      valueForm.hidden = true;
      valueForm.reset();
      valueForm.querySelector('[role=status]').textContent = '';
    }
  }

  function place(card, destination) {
    clearValue();
    const source = placed.indexOf(card);
    const previous = placed[destination];
    if (source>=0) placed[source]=previous;
    placed[destination]=card;
    selected=null;
    feedback.textContent='';
    paint('[data-slot="'+destination+'"]');
  }

  function start() {
    clearValue();
    placed = Array(tasks[current][2].length).fill(null);
    selected = null;
    feedback.textContent = '';
    paint();
  }

  host.addEventListener('click',event=>{
    const button = event.target.closest('button');
    if (!button) return;
    const {action, slot, card} = button.dataset;
    if (action==='next') {
      current = (current+1)%tasks.length;
      start();
    } else if (action==='reset') {
      start();
    } else if (action==='check') {
      const [,,order] = tasks[current];
      const correct = !placed.includes(null) && (options.accept ? options.accept(tasks[current][1], placed) : order.every((item,i)=>item===placed[i]));
      if (valueForm) valueForm.hidden = !correct;
      feedback.textContent = placed.includes(null) ? 'Заполни все окошки.' :
        correct ? 'Верно!' : 'Проверь порядок карточек и попробуй ещё раз.';
    } else if (slot!=null && selected!=null && Number(card)!==selected) {
      place(selected,Number(slot));
    } else if (card!=null) {
      selected = selected===Number(card) ? null : Number(card);
      feedback.textContent = selected==null ? '' : 'Теперь выбери окошко.';
      paint('[data-card="'+card+'"]');
    }
  });

  valueForm?.addEventListener('submit', event=>{
    event.preventDefault();
    const value = parseValue(valueForm.elements.value.value);
    valueForm.querySelector('[role=status]').textContent = value === tasks[current][3] ? 'Верно!' : 'Проверь произведения по диагоналям и деление.';
  });

  host.addEventListener('dragstart',event=>{
    const card = event.target.closest('[data-card]');
    if (!card) return;
    event.dataTransfer.setData('text/plain', id+':'+card.dataset.card);
    event.dataTransfer.effectAllowed='move';
  });
  host.addEventListener('dragover',event=>{
    if (event.target.closest('[data-slot], .bank')) event.preventDefault();
  });
  host.addEventListener('drop',event=>{
    const target = event.target.closest('[data-slot], .bank');
    if (!target) return;
    event.preventDefault();
    const [origin,key]=event.dataTransfer.getData('text/plain').split(':');
    if (origin!==id || !/^\d+$/.test(key) || Number(key)>=tasks[current][1].length) return;
    const card=Number(key);
    if (target.dataset.slot!=null) place(card,Number(target.dataset.slot));
    else {
      clearValue();
      const source=placed.indexOf(card);
      if(source>=0) placed[source]=null;
      selected=null;
      feedback.textContent='';
      paint('[data-card="'+card+'"]');
    }
  });
  start();
}

mountBuilder('ratio-builder',ratioTasks,'ratio');
mountBuilder('prop-builder',proportionTasks,'proportion');
mountBuilder('parts-builder',splitTasks,'steps');
mountBuilder('strategy-builder',strategyTasks,'steps');

const equations = [['x : 18 = 5 : 6',15],['2,4 : x = 6 : 15',6],['3 : 8 = x : 4',1.5],['5 : 7 = 15 : x',21]];
let equationIndex = 0;
const form = byId('unknown-form');
const message = form.querySelector('.feedback');
function renderEquation() {
  byId('unknown-equation').textContent = equations[equationIndex][0];
  form.reset();
  message.textContent='';
}
form.addEventListener('submit',event=>{
  event.preventDefault();
  const raw=form.elements.answer.value.trim().replace(',','.');
  message.textContent = !/^\d+(?:\.\d+)?$/.test(raw) ? 'Введи число.' :
    Number(raw)===equations[equationIndex][1] ? 'Верно!' : 'Проверь, какие члены нужно перемножить.';
});
form.addEventListener('input',()=>{message.textContent='';});
form.querySelector('[type=button]').addEventListener('click',()=>{
  equationIndex=(equationIndex+1)%equations.length;
  renderEquation();
  form.elements.answer.focus({preventScroll:true});
});
renderEquation();

function parseValue(text) {
  const normalized = text.trim().replace(',','.');
  return /^\d+(?:\.\d+)?$/.test(normalized) ? Number(normalized) : NaN;
}

mountBuilder('x-builder',[
  ['На 4 одинаковые гирлянды ушло 14 м ленты. Сколько метров нужно на 10 гирлянд? В каждом отношении запиши сначала количество гирлянд, затем длину ленты.',['14','x','10','4'],[3,0,2,1],35],
  ['В первый день мастер собрал 18 коробок. За 5 часов второго дня он собрал 30 коробок. Сколько часов заняла работа в первый день при той же скорости? Запиши сначала коробки, затем часы.',['5','18','x','30'],[1,2,3,0],3],
  ['На одну серию из одинаковых рамок ушло 24 м проволоки. На другую серию из 10 рамок ушло 40 м. Сколько рамок в первой серии? Запиши сначала число рамок, затем длину проволоки.',['40','24','x','10'],[2,1,3,0],6],
  ['Плакат шириной 8 см и высотой 5 см увеличили без искажений. Высота копии 15 см. Найди её ширину. Запиши сначала ширину, затем высоту.',['15','8','5','x'],[1,2,3,0],24]
],'proportion',{solve:true});

mountBuilder('four-numbers',[
  ['Используй числа 5, 8, 15 и 24, чтобы составить любое верное равенство двух отношений.',['8','5','24','15'],[1,0,3,2]],
  ['Составь пропорцию из чисел 7, 9, 14 и 18. Проверь её перекрёстным умножением.',['14','7','18','9'],[1,3,0,2]]
],'proportion',{accept:(cards,order)=>{
  const [a,b,c,d]=order.map(i=>Number(cards[i]));
  return a*d===b*c;
}});

function mountQuiz(id, questions) {
  const host=byId(id);
  host.innerHTML='<p class="task-count"></p><p class="task-text"></p><form autocomplete="off"><div class="quiz-fields"></div><div class="controls"><button class="primary">Проверить</button><button type="button">Другое задание →</button></div><p class="feedback" role="status"></p></form>';
  const quiz=host.querySelector('form');
  const fields=host.querySelector('.quiz-fields');
  const feedback=quiz.querySelector('[role=status]');
  let index=0;
  function render() {
    const [title,choices]=questions[index];
    host.querySelector('.task-count').textContent='Задание '+(index+1)+' из '+questions.length;
    host.querySelector('.task-text').textContent=title;
    fields.innerHTML=choices.map((choice,i)=>Array.isArray(questions[index][2]) ?
      '<label class="inline">'+choice+' <input aria-label="'+choice+'" name="entry" inputmode="numeric" required></label>' :
      '<label class="choice"><input type="radio" name="entry" value="'+i+'" required>'+choice+'</label>').join('');
    feedback.textContent='';
  }
  quiz.addEventListener('submit',event=>{
    event.preventDefault();
    const answer=questions[index][2];
    const correct=Array.isArray(answer) ?
      [...fields.querySelectorAll('input')].every((item,i)=>parseValue(item.value)===answer[i]) :
      Number(new FormData(quiz).get('entry'))===answer;
    feedback.textContent=correct?'Верно!':questions[index][3];
  });
  quiz.addEventListener('input',()=>{feedback.textContent='';});
  quiz.querySelector('[type=button]').addEventListener('click',()=>{index=(index+1)%questions.length;render();});
  render();
}
mountQuiz('ratio-quiz',[
 ['Как называется результат деления первого числа на второе?',['Сумма','Разность','Частное','Произведение'],2,'Вспомни, на какой вопрос отвечает отношение.'],
 ['Сократи отношение 84 : 12 до наименьших целых чисел.',['7 : 4','7 : 1','12 : 1','1 : 7'],1,'Раздели оба числа на один и тот же общий делитель.'],
 ['Какое отношение обратно к 9 : 4?',['9 : 5','4 : 9','5 : 4','18 : 8'],1,'В обратном отношении числа меняются местами.'],
 ['Как записать отношение 30 минут к двум часам в наименьших целых числах?',['15 : 1','1 : 2','1 : 4','4 : 1'],2,'Сначала вырази обе величины в минутах.']
]);
mountQuiz('prop-quiz',[
 ['Образуют ли отношения 4 : 10 и 14 : 35 пропорцию?',['Да','Нет'],0,'Сравни произведения чисел по диагоналям.'],
 ['Образуют ли отношения 8 : 12 и 18 : 9 пропорцию?',['Да','Нет'],1,'Проверь, какое число стоит в конце равенства.'],
 ['Назови средние члены пропорции 14 : 6 = 21 : 9.',['14 и 9','6 и 21','14 и 6','21 и 9'],1,'Посмотри на два внутренних места записи.'],
 ['В записи m : n = k : p какое равенство следует из основного свойства?',['m · n = k · p','m · k = n · p','m · p = n · k'],2,'Найди два крайних и два средних члена.']
]);
mountQuiz('split-quiz',[
 ['Для школьного праздника закупили 135 цветов. Розы и тюльпаны взяли в отношении 4 : 5. Сколько цветов каждого вида?',['Розы','Тюльпаны'],[60,75],'Проверь, что сумма равна 135, а отношение количеств равно 4 : 5.'],
 ['Разложи 84 жетона по трём конвертам в отношении 2 : 3 : 7.',['Первый','Второй','Третий'],[14,21,49],'Сначала найди, сколько жетонов приходится на одну долю.']
]);
