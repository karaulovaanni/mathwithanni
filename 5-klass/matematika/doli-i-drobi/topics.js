// Перестраиваем исходные упражнения по пяти темам и сохраняем активные тренажёры.
function moveChildren(fromId,toId){const from=document.getElementById(fromId),to=document.getElementById(toId);if(from&&to)to.append(...from.children)}
function lineFor(n,d,cls="fraction-line"){
  return `<div class="${cls}" aria-label="От 0 до 1" style="--ticks:${d+1}">${Array.from({length:d+1},(_,i)=>`<span class="${i===n?'mark':''}">${i===0?'0':i===d?'1':i===n?F(n,d):''}</span>`).join('')}</div>`;
}
function stripFor(n,d){return `<div class="strip" aria-label="${n} из ${d} равных частей">${Array.from({length:d},(_,i)=>`<span class="${i<n?'on':''}"></span>`).join('')}</div>`}
function circleModel(n,d){return `<svg viewBox="0 0 240 240" role="img" aria-label="Круг: ${n} выделенных долей из ${d}">${Array.from({length:d},(_,i)=>{const a=i*2*Math.PI/d-Math.PI/2,b=(i+1)*2*Math.PI/d-Math.PI/2;return `<path d="M120 120 L${120+108*Math.cos(a)} ${120+108*Math.sin(a)} A108 108 0 0 1 ${120+108*Math.cos(b)} ${120+108*Math.sin(b)} Z" fill="${i<n?'#987bc8':'#eee8f5'}" stroke="white" stroke-width="2"/>`}).join('')}</svg>`;}
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
if(circleLab)document.getElementById('whole').insertBefore(circleLab,document.getElementById('wholeBank'));

// Задачи из жизни. В наборе остаются транспорт, книги, игры, билеты и другие сюжеты.
for(let i=5;i<=8;i++){const c=document.getElementById('photo'+i);if(c)document.getElementById('storyBank').append(c)}
moveChildren('storyTasks','storyBank');
const challenge=document.getElementById('challengeTasks');
if(challenge){[...challenge.children].forEach(c=>{if(c.id==='challenge4')document.getElementById('compareBank').append(c);else document.getElementById('storyBank').append(c)})}

// Сравнение дробей: используем задания с одинаковыми и разными знаменателями.
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
function compareFractions(target,id,label,q,n1,d1,n2,d2){
 const answer=n1*d2===n2*d1?'=':n1*d2<n2*d1?'<':'>';
 add(target,{id,label,q:q||`Сравни дроби: <span class="big">${F(n1,d1)} ? ${F(n2,d2)}</span>`,kind:'compare',answer,hint:'',explain:''});
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

// Модель для пятой темы: сравнение единичных долей на одинаковом целом.
const topicIds=['whole','stories','names','models','compare'],decks=[];
function makeDeck(bankId,title){
 const bank=document.getElementById(bankId),cards=[...bank.children];if(!cards.length)return;
 const deck=document.createElement('div');deck.className='task-deck';
 deck.innerHTML='<div class="deck-top"><h3>'+title+'</h3><span class="deck-position"></span></div><div class="deck-numbers" role="group" aria-label="Номера заданий"></div><div class="deck-body"></div><div class="deck-bottom"><button class="deck-prev">← Назад</button><button class="deck-next">Следующее задание →</button></div><div class="deck-complete" hidden>Все задания решены ✅</div>';
 bank.before(deck);const body=deck.querySelector('.deck-body');cards.forEach(c=>body.append(c));bank.remove();
 let active=0,timer;const numbers=deck.querySelector('.deck-numbers');
 cards.forEach((c,i)=>{const btn=document.createElement('button');btn.textContent=i+1;btn.setAttribute('aria-label','Задание '+(i+1));btn.onclick=()=>show(i);numbers.append(btn)});
 function refresh(){[...numbers.children].forEach((b,i)=>{b.classList.toggle('solved',!!saved[cards[i].id]?.done);b.setAttribute('aria-current',String(i===active))});deck.querySelector('.deck-complete').hidden=!cards.every(c=>saved[c.id]?.done)}
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

