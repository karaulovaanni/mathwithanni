// Перестраиваем исходные упражнения по пяти темам и сохраняем активные тренажёры.
function moveChildren(fromId,toId){const from=document.getElementById(fromId),to=document.getElementById(toId);if(from&&to)to.append(...from.children)}
function lineFor(n,d,cls="fraction-line"){
  return `<div class="${cls}" aria-label="От 0 до 1" style="--ticks:${d+1}">${Array.from({length:d+1},(_,i)=>`<span class="${i===n?'mark':''}">${i===0?'0':i===d?'1':i===n?F(n,d):''}</span>`).join('')}</div>`;
}
function stripFor(n,d){return `<div class="strip" aria-label="${n} из ${d} равных частей">${Array.from({length:d},(_,i)=>`<span class="${i<n?'on':''}"></span>`).join('')}</div>`}
function circleModel(n,d){return `<svg viewBox="0 0 240 240" role="img" aria-label="Круг: ${n} выделенных долей из ${d}">${Array.from({length:d},(_,i)=>{const a=i*2*Math.PI/d-Math.PI/2,b=(i+1)*2*Math.PI/d-Math.PI/2;return `<path d="M120 120 L${120+108*Math.cos(a)} ${120+108*Math.sin(a)} A108 108 0 0 1 ${120+108*Math.cos(b)} ${120+108*Math.sin(b)} Z" fill="${i<n?'#987bc8':'#eee8f5'}" stroke="white" stroke-width="2"/>`}).join('')}</svg>`;}
document.getElementById('shareBasics').innerHTML=[['Половина',2],['Треть',3],['Четверть',4]].map(([name,d])=>`<article class="share-card"><h3>${name}</h3>${circleModel(1,d)}<div>${F(1,d)}</div></article>`).join('');
function taskPicture(id,html){const q=document.querySelector('#'+id+' > p');if(q)q.insertAdjacentHTML('afterend','<div class="task-visual">'+html+'</div>');}
taskPicture('lab1',circleModel(2,7));
taskPicture('lab2',stripFor(9,9));
taskPicture('equal1',stripFor(1,6));
taskPicture('equal2','<div class="strip unequal"><span></span><span></span><span></span><span></span><span></span></div>');
taskPicture('model1',stripFor(5,12));
taskPicture('model2','<div class="objects">🐢 🐢 🐢 🐢 <span style="opacity:.35">🐢 🐢 🐢 🐢 🐢 🐢</span></div>');
taskPicture('name3','<div class="mini-fractions">'+F(1,2)+' = '+F(2,4)+'</div>');
taskPicture('name4','<div class="mini-fractions">'+F(2,3)+' = '+F(4,6)+'</div>');
stories.forEach((s,i)=>taskPicture('story'+i,'<div class="token-grid">'+Array.from({length:s[3]},(_,j)=>'<span class="token '+(i<7&&j<s[2]?'chosen':'')+'">'+(i<7&&j<s[2]?s[0]:'●')+'</span>').join('')+'</div>'));
['cmp0','cmp1','cmp2','cmp3','photo9','photo10','photo11','photo12'].forEach(id=>{const fr=[...document.querySelectorAll('#'+id+' .big .frac')],ds=fr.map(f=>+f.lastElementChild.textContent);if(ds.length===2)taskPicture(id,'<div style="width:100%">'+stripFor(1,ds[0])+stripFor(1,ds[1])+'</div>');});

// Первый блок: доля, дробь, круг, полоска, набор предметов и числовая прямая.
moveChildren('equalTasks','wholeBank');
moveChildren('labTasks','wholeBank');
moveChildren('nameTasks','wholeBank');
moveChildren('modelTasks','wholeBank');
moveChildren('lineTasks','wholeBank');
for(let i=1;i<=4;i++){const c=document.getElementById('photo'+i);if(c)document.getElementById('wholeBank').append(c)}
const circleLab=document.getElementById('lab');
if(circleLab)document.getElementById('whole').insertBefore(circleLab,document.getElementById('chocolate').closest('.grid'));

// Задачи из жизни. В наборе остаются транспорт, книги, игры, билеты и другие сюжеты.
for(let i=5;i<=8;i++){const c=document.getElementById('photo'+i);if(c)document.getElementById('storyBank').append(c)}
moveChildren('storyTasks','storyBank');
const challenge=document.getElementById('challengeTasks');
if(challenge){[...challenge.children].forEach(c=>{if(c.id==='challenge4')document.getElementById('compareBank').append(c);else document.getElementById('storyBank').append(c)})}

// Сравнение дробей: используем задания с одинаковыми и разными знаменателями.
// Дополнительная практика по § 26. Все дроби в вопросах набираются в окошках.
function coordinateLineQuestion(n,d){
 const marks=Array.from({length:d+1},(_,i)=>`<span class="${i===n?'mark':''}">${i===0?'0':i===d?'1':''}</span>`).join('');
 return `<div class="task-visual"><div class="fraction-line" style="--ticks:${d+1}" aria-label="Единичный отрезок от нуля до единицы">${marks}</div></div>`;
}
const modelPractice=[
  {n:3,d:8,type:'strip',ask:'Закрашенная часть полоски.'},
  {n:5,d:9,type:'circle',ask:'Закрашенная часть круга.'},
  {n:4,d:7,type:'strip',ask:'Закрашенная часть полоски.'},
  {n:2,d:6,type:'circle',ask:'Закрашенная часть круга.'},
  {n:7,d:12,type:'strip',ask:'Закрашенная часть прямоугольника.'},
  {n:8,d:12,type:'strip',ask:'Незакрашенная часть полоски.',remaining:true},
  {n:3,d:10,type:'circle',ask:'Незакрашенная часть круга.',remaining:true}
];
modelPractice.forEach((x,i)=>{
 const n=x.remaining?x.d-x.n:x.n;
 const visual=x.type==='circle'?'<div class="task-visual compact-circle">'+circleModel(x.n,x.d)+'</div>':stripFor(x.n,x.d);
 fraction('wholeBank','wModel'+(i+1),'Модель',x.ask,n,x.d,'','',visual);
});
const coordinatePractice=[[2,5],[4,7],[7,10],[3,8],[8,12],[1,6],[5,9],[9,10],[11,12],[3,4]];
coordinatePractice.forEach(([n,d],i)=>fraction('wholeBank','wLine'+(i+1),'Координатная прямая','Запиши координату отмеченной точки.',n,d,'','',coordinateLineQuestion(n,d)));
[
 [5,9,'В дроби '+F(5,9)+' назови числитель.',5],
 [7,12,'В дроби '+F(7,12)+' назови знаменатель.',12],
 [3,10,'В дроби '+F(3,10)+' назови числитель.',3],
 [4,11,'В дроби '+F(4,11)+' назови знаменатель.',11]
].forEach((x,i)=>number('wholeBank','wName'+(i+1),'Числитель и знаменатель',x[2],x[3],''));
fraction('wholeBank','wUnit1','Доля величины','1 метр разделили на 100 равных сантиметров. Какую часть метра составляет 1 сантиметр?',1,100,'');
fraction('wholeBank','wUnit2','Доля величины','1 килограмм разделили на 1000 равных граммов. Какую часть килограмма составляет 1 грамм?',1,1000,'');
fraction('wholeBank','wUnit3','Доля величины','1 тонна равна 1000 килограммам. Какую часть тонны составляет 1 килограмм?',1,1000,'');

const extraSetTasks=[
 ['Компасы','В кружке юных туристов 24 участника. 7 взяли компас. Какая часть участников взяла компас?',7,24],
 ['Книги','В библиотеку привезли 36 книг. 11 из них — словари. Какую часть книг составляют словари?',11,36],
 ['Спорт','В команде 18 игроков. На тренировку пришли 15. Какую часть команды составляют пришедшие?',15,18],
 ['Роботы','На выставке 20 моделей, 6 из них собрали из конструктора. Какую часть моделей собрали из конструктора?',6,20],
 ['Билеты','В кассе было 50 билетов. Продали 32. Какую часть билетов продали?',32,50],
 ['Уроки','В расписании 30 уроков за неделю, 4 из них — музыка. Какую часть уроков составляет музыка?',4,30],
 ['Маршрут','Велосипедист проехал 9 км из маршрута длиной 14 км. Какую часть маршрута он проехал?',9,14],
 ['Пазл','В пазле 60 деталей, собраны 43. Какую часть пазла уже собрали?',43,60],
 ['Семена','Для опыта посадили 28 семян, проросли 19. Какую часть семян составляют проросшие?',19,28],
 ['Игра','В настольной игре 24 карточки, игрок использовал 9. Какую часть карточек он использовал?',9,24],
 ['Плавание','В бассейне 16 дорожек тренировались по расписанию, 5 были заняты. Какую часть дорожек занимали пловцы?',5,16],
 ['Музей','Группа из 27 человек разделилась: 12 пошли в зал истории, остальные — в зал техники. Какую часть группы составляют посетители зала техники?',15,27]
];
extraSetTasks.forEach((x,i)=>fraction('storyBank','storyExtra'+(i+1),'Задача',x[0]+'. '+x[1],x[2],x[3],''));
[
 ['Минуты','За четверть часа мастер собрал модель. Сколько это минут?',15],
 ['Часы','Треть суток — сколько это часов?',8],
 ['Лента','Лента длиной 42 см разделена на 6 равных частей. Какова длина одной части в сантиметрах?',7],
 ['Путь','Путь длиной 35 км разделили на 5 равных этапов. Сколько километров приходится на 2 этапа?',14],
 ['Тетрадь','В тетради 48 страниц. Прочитано 3 восьмых тетради. Сколько страниц прочитано?',18],
 ['Вода','В баке было 36 литров воды. Израсходовали 5 шестых запаса. Сколько литров израсходовали?',30]
].forEach((x,i)=>number('storyBank','storyPart'+(i+1),'Задача',''+x[0]+'. '+x[1],x[2],''));

// Письменная практика: задания без разборов и ответов.
const wholeNotebook=[
 'Начерти полосу из 12 равных клеток. Закрась 5 клеток и запиши закрашенную часть дробью.',
 'Нарисуй круг и раздели его на 8 равных секторов. Закрась 3 сектора. Запиши закрашенную и незакрашенную части.',
 'Начерти отрезок длиной 9 см. Раздели его на 6 равных частей. Выдели 4 части и запиши эту долю.',
 'Запиши дробью: 7 равных частей целого, из них взяли 3.',
 'Запиши дробью: 10 равных частей целого, из них взяли 1.',
 'В дроби '+F(4,9)+' укажи числитель и знаменатель.',
 'В дроби '+F(7,12)+' укажи числитель и знаменатель.',
 'Начерти единичный отрезок, раздели его на 8 равных частей и отметь точку с координатой '+F(3,8)+'.',
 'Начерти единичный отрезок и отметь на нём точки с координатами '+F(1,5)+', '+F(3,5)+' и '+F(4,5)+'.',
 'Отметь на единичном отрезке точки с координатами '+F(2,7)+' и '+F(6,7)+'.',
 'На полосе из 11 равных клеток закрась 8 клеток. Запиши дробью закрашенную и незакрашенную части.',
 'В квадрате 16 клеток закрашено 6. Запиши дробью закрашенную часть.',
 '1 сантиметр составляет какую часть метра?',
 '1 грамм составляет какую часть килограмма?',
 '1 килограмм составляет какую часть тонны?',
 'В отрезке 14 см отметили '+F(5,7)+' его длины. Сколько сантиметров отметили?',
 'Найди '+F(1,6)+' от 54 минут.',
 'Найди '+F(3,8)+' от 64 страниц.',
 'На координатной прямой единичный отрезок разделён на 10 равных частей. Запиши координату пятой отметки после нуля.',
 'На координатной прямой единичный отрезок разделён на 12 равных частей. Запиши координату девятой отметки после нуля.'
];
const storyNotebook=[
 'В поход отправились 32 человека. '+F(3,8)+' участников шли впереди группы. Сколько человек шли впереди?',
 'В библиотеке 45 новых книг. '+F(2,5)+' из них — книги о природе. Сколько книг о природе привезли?',
 'В наборе 28 цветных карандашей, 9 из них зелёные. Какую часть карандашей составляют зелёные?',
 'В школьном турнире участвовали 40 команд. До финала дошли 8. Какую часть команд составляют финалисты?',
 'В мастерской было 36 деталей. Использовали '+F(5,6)+' всех деталей. Сколько деталей использовали?',
 'Поезд прошёл '+F(3,7)+' пути длиной 56 км. Сколько километров прошёл поезд?',
 'В марафоне длиной 24 км бегун преодолел '+F(5,8)+' дистанции. Сколько километров осталось?',
 'В коробке 60 фишек. '+F(7,10)+' фишек синие, остальные красные. Сколько красных фишек?',
 'За день экскурсию посетили 48 человек. '+F(5,12)+' пришли утром. Сколько человек пришли утром?',
 'В баке было 42 литра воды. Для полива использовали '+F(2,3)+' воды. Сколько литров осталось?',
 'В оркестре 35 музыкантов. '+F(3,5)+' играют на струнных инструментах. Сколько струнников в оркестре?',
 'В коробках 72 детали. '+F(5,9)+' деталей использовали для сборки. Сколько деталей осталось?',
 'Мастер закончил '+F(4,7)+' работы за 28 минут. Сколько минут заняла выполненная часть?',
 'На складе 80 ламп, '+F(3,8)+' ламп установили. Сколько ламп осталось установить?',
 'Команда прошла '+F(5,6)+' трассы длиной 42 км. Сколько километров осталось пройти?',
 'В книге 96 страниц. За вечер прочитали '+F(3,8)+' книги. Сколько страниц осталось прочитать?'
];
function fillNotebook(id,items){document.getElementById(id).innerHTML=items.map(t=>'<li>'+t+'</li>').join('');}
fillNotebook('wholeNotebook',wholeNotebook);fillNotebook('storyNotebook',storyNotebook);
moveChildren('compareTasks','compareBank');
for(let i=9;i<=12;i++){const c=document.getElementById('photo'+i);if(c)document.getElementById('compareBank').append(c)}
document.getElementById('photo')?.remove();
document.getElementById('challenge')?.remove();
document.getElementById('equalTasks')?.remove();
document.getElementById('labTasks')?.remove();
document.getElementById('nameTasks')?.remove();
document.getElementById('modelTasks')?.remove();
document.getElementById('lineTasks')?.remove();
document.getElementById('storyTasks')?.remove();
document.getElementById('challengeTasks')?.remove();
document.getElementById('compareTasks')?.remove();

// Интерактив равных дробей: меняются числитель, знаменатель и число равных частей.
const eqN=document.getElementById('eqN'),eqD=document.getElementById('eqD'),eqK=document.getElementById('eqK');
function drawEquivalent(){
  const n=+eqN.value,d=+eqD.value,k=+eqK.value;
  document.getElementById('eqNVal').textContent=n;
  document.getElementById('eqDVal').textContent=d;
  document.getElementById('eqKVal').textContent=k;
  document.getElementById('eqFractions').innerHTML=F(n,d)+' = '+F(n*k,d*k);
  document.getElementById('eqBars').innerHTML=stripFor(n,d)+stripFor(n*k,d*k);
  document.getElementById('eqRule').innerHTML='Умножили числитель и знаменатель на одно и то же число <b>'+k+'</b>. Значение дроби не изменилось.';
}
[eqN,eqD,eqK].forEach(el=>el.addEventListener('input',drawEquivalent));drawEquivalent();
fraction('equalFractionBank','eqTask1','Равные дроби · 1','Запиши дробь, равную одной второй, со знаменателем 8.',4,8,'');
fraction('equalFractionBank','eqTask2','Равные дроби · 2','Запиши дробь, равную двум третьим, со знаменателем 12.',8,12,'');
fraction('equalFractionBank','eqTask3','Равные дроби · 3','Запиши дробь, равную трём пятым, со знаменателем 10.',6,10,'');
fraction('equalFractionBank','eqTask4','Равные дроби · 4','У дроби числитель и знаменатель умножили на 3. Получили 9 двенадцатых. Запиши исходную дробь.',3,4,'');
tasks.slice(-4).forEach(t=>t.strict=true);

// Сравнение дробей с равными знаменателями: два ползунка, две полоски и точки на прямой.
const sameD=document.getElementById('sameD'),sameA=document.getElementById('sameA'),sameB=document.getElementById('sameB');
function drawSameDen(){
  const d=+sameD.value,a=+sameA.value,b=+sameB.value;
  sameA.max=d;sameB.max=d;sameA.value=Math.min(a,d);sameB.value=Math.min(b,d);
  const x=+sameA.value,y=+sameB.value,sign=x===y?'=':x<y?'<':'>';
  document.getElementById('sameDVal').textContent=d;document.getElementById('sameAVal').textContent=x;document.getElementById('sameBVal').textContent=y;
  document.getElementById('sameFractions').innerHTML=F(x,d)+' '+sign+' '+F(y,d);
  document.getElementById('sameBars').innerHTML=stripFor(x,d)+stripFor(y,d);
  document.getElementById('sameLine').innerHTML=lineFor(x,d,'fraction-line')+lineFor(y,d,'fraction-line second-line');
  document.getElementById('sameRule').innerHTML='Знаменатели равны — сравниваем числители: '+F(x,d)+' '+sign+' '+F(y,d)+'.';
}
[sameD,sameA,sameB].forEach(el=>el.addEventListener('input',drawSameDen));drawSameDen();
function compareFractions(target,id,label,q,n1,d1,n2,d2,level=1){
 const answer=n1*d2===n2*d1?'=':n1*d2<n2*d1?'<':'>';
 add(target,{id,label,q:q||`Сравни дроби: <span class="big">${F(n1,d1)} ? ${F(n2,d2)}</span>`,kind:'compare',answer,hint:'',explain:'',level});
}
compareFractions('sameDenBank','sd1','Сравнение · 1','',3,8,5,8);
compareFractions('sameDenBank','sd2','Сравнение · 2','',7,12,4,12);
compareFractions('sameDenBank','sd3','Сравнение · 3','',2,5,2,5);
compareFractions('sameDenBank','sd4','Сравнение · 4','',5,9,7,9);
function sameDenVisual(id){
 const el=document.getElementById(id),fr=[...el.querySelectorAll('.big .frac')],nums=fr.map(x=>+x.firstElementChild.textContent),dens=fr.map(x=>+x.lastElementChild.textContent);
 if(fr.length===2)el.querySelector('p').insertAdjacentHTML('afterend','<div class="task-visual"><div style="width:100%">'+stripFor(nums[0],dens[0])+stripFor(nums[1],dens[1])+lineFor(nums[0],dens[0])+lineFor(nums[1],dens[1])+'</div></div>');
}
['sd1','sd2','sd3','sd4'].forEach(sameDenVisual);
compareFractions('compareBank','gc1','Сравнение · 5','',2,3,3,4,3);
compareFractions('compareBank','gc2','Сравнение · 6','',3,5,2,3,3);
compareFractions('compareBank','gc3','Сравнение · 7','',4,8,1,2,3);
compareFractions('compareBank','gc4','Сравнение · 8','',5,6,7,9,3);
['gc1','gc2','gc3','gc4'].forEach(id=>{
 const el=document.getElementById(id),fr=[...el.querySelectorAll('.big .frac')],nums=fr.map(x=>+x.firstElementChild.textContent),dens=fr.map(x=>+x.lastElementChild.textContent);
 el.querySelector('p').insertAdjacentHTML('afterend','<div class="task-visual"><div style="width:100%">'+stripFor(nums[0],dens[0])+stripFor(nums[1],dens[1])+'</div></div>');
});

// Сравнение по правилам без числовой прямой: одинаковый знаменатель,
// одинаковый числитель, сравнение с единицей и подбор общего знаменателя.
const compareByRule=[
 [4,9,7,9,1],[3,5,3,8,1],[1,11,1,7,1],[8,13,6,13,1],[2,3,2,9,1],[5,12,5,8,1],
 [5,6,1,1,2],[9,7,1,1,2],[2,3,4,6,2],[1,1,7,8,2],[3,5,5,8,2],[7,10,7,12,2],
 [5,12,3,8,3],[7,10,2,3,3],[5,9,4,7,3],[7,12,3,5,3],[11,15,7,10,3],[13,18,5,7,3]
];
compareByRule.forEach(([a,b,c,d,level],i)=>compareFractions('compareBank','ruleCmp'+(i+1),'Сравнение по правилу','',a,b,c,d,level));

// Модель для пятой темы: сравнение единичных долей на одинаковом целом.
const topicIds=['whole','stories','names','models','compare'],decks=[];
function makeDeck(bankId,title){
 const bank=document.getElementById(bankId);let cards=[...bank.children];if(!cards.length)return;
 function levelOf(id,explicit,index){
  if(explicit)return +explicit;
  if(bankId==='wholeBank'){
   if(/^(equal|name|photo[1-4]|wName)/.test(id))return 1;
   if(/^(line|wLine|wUnit)/.test(id))return 3;
   return 2;
  }
  if(bankId==='storyBank'){
   const story=id.match(/^story(\d+)$/),extra=id.match(/^storyExtra(\d+)$/),part=id.match(/^storyPart(\d+)$/),photo=id.match(/^photo(\d+)$/);
   if(photo&&+photo[1]<=8)return 1;
   if(story)return +story[1]<=2?1:+story[1]<=6?2:3;
   if(extra)return +extra[1]<=4?1:+extra[1]<=8?2:3;
   if(part)return +part[1]<=2?2:3;
   return id==='challenge3'?2:3;
  }
  if(bankId==='equalFractionBank')return index<3?1:2;
  if(bankId==='sameDenBank')return index<2?1:2;
  if(bankId==='compareBank'){
   if(/^ruleCmp([1-6])$/.test(id)||/^photo(9|10|11|12)$/.test(id)||/^cmp/.test(id))return 1;
   if(/^ruleCmp(7|8|9|10|11|12)$/.test(id)||id==='challenge4')return 2;
   return 3;
  }
  return 1;
 }
 cards.forEach((c,i)=>c.dataset.level=String(levelOf(c.id,c.dataset.level,i)));
 cards.sort((a,b)=>+a.dataset.level-+b.dataset.level);
 const deck=document.createElement('div');deck.className='task-deck';
 deck.innerHTML='<div class="deck-top"><h3>'+title+'</h3><span class="deck-position"></span></div><div class="deck-numbers" role="group" aria-label="Номера заданий"></div><div class="deck-body"></div><div class="deck-bottom"><button class="deck-prev">← Назад</button><button class="deck-next">Следующее задание →</button></div><div class="deck-complete" hidden>Все задания решены ✅</div>';
 bank.before(deck);const body=deck.querySelector('.deck-body');cards.forEach(c=>body.append(c));bank.remove();
 let active=0,timer;const numbers=deck.querySelector('.deck-numbers');
 for(let level=1;level<=3;level++){const group=document.createElement('div');group.className='deck-number-group';group.dataset.level=level;const labels=['Основа','Практика','Сложнее'];group.setAttribute('role','group');group.setAttribute('aria-label','Уровень '+level+' — '+labels[level-1]);const label=document.createElement('span');label.className='deck-level-label';label.innerHTML='<i>'+level+'</i> '+labels[level-1];group.append(label);cards.forEach((c,i)=>{if(+c.dataset.level!==level)return;const btn=document.createElement('button');btn.textContent=i+1;btn.dataset.level=level;btn.dataset.taskIndex=i;btn.setAttribute('aria-label','Задание '+(i+1)+', уровень '+level);btn.onclick=()=>show(i);group.append(btn)});if(group.children.length>1)numbers.append(group)}
 function refresh(){numbers.querySelectorAll('button[data-task-index]').forEach(b=>{const card=cards[+b.dataset.taskIndex];b.classList.toggle('solved',!!saved[card.id]?.done);b.setAttribute('aria-current',String(+b.dataset.taskIndex===active))});deck.querySelector('.deck-complete').hidden=!cards.every(c=>saved[c.id]?.done)}
 function show(i){clearTimeout(timer);active=i;cards.forEach((c,j)=>c.hidden=j!==i);deck.querySelector('.deck-position').textContent=`Задание ${i+1} из ${cards.length}`;deck.querySelector('.deck-prev').disabled=i===0;deck.querySelector('.deck-next').disabled=i===cards.length-1;refresh()}
 deck.querySelector('.deck-prev').onclick=()=>show(active-1);deck.querySelector('.deck-next').onclick=()=>show(active+1);
 cards.forEach((c,i)=>new MutationObserver(()=>{refresh();if(c.querySelector('.feedback').classList.contains('good')&&i<cards.length-1){clearTimeout(timer);timer=setTimeout(()=>{if(active===i)show(i+1)},1200)}}).observe(c.querySelector('.feedback'),{childList:true,subtree:true,characterData:true}));
 show(0);decks.push({reset:()=>show(0),stop:()=>clearTimeout(timer)});
}
makeDeck('wholeBank','Тренажёр');
makeDeck('storyBank','Задачи');
makeDeck('equalFractionBank','Тренажёр');
makeDeck('sameDenBank','Тренажёр');
makeDeck('compareBank','Тренажёр');
score();

const topicLinks=[...document.querySelectorAll('.topic-menu a')];
function openTopic(){
 decks.forEach(d=>d.stop());const id=location.hash.slice(1),index=topicIds.indexOf(id);
 topicIds.forEach(t=>document.getElementById(t).hidden=t!==id);
 document.querySelector('.topic-menu').hidden=index!==-1;
 document.getElementById('allTopics').hidden=index===-1;
 document.getElementById('topicCaption').textContent=index===-1?'':topicLinks[index].querySelector('b').textContent;
 document.querySelector('.hero').hidden=index!==-1;
 topicLinks.forEach((l,i)=>l.setAttribute('aria-current',String(i===index)));
 if(index!==-1)document.querySelector('.topic-toolbar').scrollIntoView({block:'start'});else window.scrollTo({top:0,behavior:'instant'});
}
document.getElementById('allTopics').onclick=()=>{history.pushState(null,'',location.pathname);openTopic()};
window.addEventListener('hashchange',openTopic);
const resetOriginal=document.getElementById('reset')?.onclick;
if(document.getElementById('reset'))document.getElementById('reset').onclick=()=>{resetOriginal?.();decks.forEach(d=>d.reset())};
openTopic();


