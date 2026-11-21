/* Large, focused tasks for the fifth lesson. All answers use ordinary inputs. */
window.typesPractice = function(host, bank) {
 const levels = [1,2,3].filter(l => bank.some(t => (t.level || 1) === l));
 let level = levels[0], index = 0, list = [], solved = new Set();
 host.classList.add('types-trainer');
 host.innerHTML = '<div class="focus-levels tap-choices"></div><div class="focus-numbers numbers" aria-label="Номера заданий"></div><div class="focus-task"></div><div class="practice-navigation"><button class="focus-prev">Назад</button><span class="focus-count"></span><button class="focus-next">Следующее</button></div>';
 const levelBox=host.querySelector('.focus-levels');
 levelBox.innerHTML=levels.map(l=>`<button data-level="${l}" aria-pressed="${l===level}">${['','База','Сложнее','Повышенный'][l]}</button>`).join('');
 levelBox.hidden=levels.length<2;
 const fractionFields=(name,label)=>`<label class="fraction-entry"><span>${label}</span><span class="frac"><span><input data-field="${name}-n" type="number" min="0" inputmode="numeric" aria-label="${label}: числитель"></span><span><input data-field="${name}-d" type="number" min="1" inputmode="numeric" aria-label="${label}: знаменатель"></span></span></label>`;
 function draw(){
  const t=list[index], box=host.querySelector('.focus-task'); let picked='', kind='';
  host.querySelector('.focus-numbers').innerHTML=list.map((_,i)=>`<button data-task-number="${i}" aria-current="${i===index?'step':'false'}" class="${solved.has(level+':'+i)?'task-solved':''}" aria-label="Задание ${i+1}${solved.has(level+':'+i)?', выполнено':''}">${i+1}</button>`).join('');
  host.querySelectorAll('[data-task-number]').forEach(b=>b.onclick=()=>{index=+b.dataset.taskNumber;draw()});
  box.innerHTML=`${t.skill?`<p class="recap-skill">${t.skill}</p>`:''}<div class="practice-question">${t.q}</div>${t.visual?`<div class="practice-visual">${t.visual}</div>`:''}<div class="focus-input"></div><button class="primary focus-check">Проверить</button><p class="feedback" aria-live="polite"></p>`;
  const input=box.querySelector('.focus-input');
  if(t.kind==='fraction')input.innerHTML=`<div class="fraction-entries">${t.unitDen?fractionFields('unit','Одно деление'):''}${fractionFields('answer',t.unitDen?'Координата точки':'Дробь')}</div>`;
  else if(t.kind==='division')input.innerHTML='<div class="division-entry"><input type="number" min="0" data-field="dividend" aria-label="Делимое"><span>:</span><input type="number" min="1" data-field="divisor" aria-label="Делитель"></div>';
  else if(t.kind==='choice'||t.kind==='compare')fractionChoices(input,t.kind==='choice'?t.options.map((x,i)=>[i,x]):[['<','&lt;'],['=','='],['>','&gt;']],v=>{picked=v;clear();if(instant)check()});
  else input.innerHTML='<input type="number" min="0" step="any" aria-label="Ответ" data-field="number">';
  if(t.requireKind){input.insertAdjacentHTML('beforeend','<div class="kind-answer"><span>Вид дроби</span><div class="kind-buttons"></div></div>');fractionChoices(input.querySelector('.kind-buttons'),[['proper','Правильная'],['improper','Неправильная']],v=>{kind=v;clear()})}
  const instant=!!t.instant&&!t.requireKind;
  const checkButton=box.querySelector('.focus-check'); if(instant)checkButton.hidden=true;
  function clear(){box.querySelector('.feedback').textContent=''}
  function value(name){const el=input.querySelector(`[data-field="${name}"]`);return el&&el.value.trim()!==''?Number(el.value):NaN}
  function pairOK(name,expected,strict){const n=value(name+'-n'),d=value(name+'-d');return Number.isInteger(n)&&Number.isInteger(d)&&n>=0&&d>0&&(strict?n===expected[0]&&d===expected[1]:n*expected[1]===d*expected[0])}
  function check(){
   let ok=false;
   if(t.kind==='choice'||t.kind==='compare')ok=picked!==''&&picked===String(t.answer);
   else if(t.kind==='fraction')ok=pairOK('answer',t.answer,!!t.strict)&&(!t.unitDen||pairOK('unit',[1,t.unitDen],true));
   else if(t.kind==='division')ok=value('dividend')===t.answer[0]&&value('divisor')===t.answer[1];
   else ok=Number.isFinite(value('number'))&&Math.abs(value('number')-t.answer)<1e-9;
   if(t.requireKind)ok=ok&&kind===(t.answer[0]<t.answer[1]?'proper':'improper');
   feedback(box.querySelector('.feedback'),ok);
   if(ok){solved.add(level+':'+index);const number=host.querySelector(`[data-task-number="${index}"]`);number.classList.add('task-solved');number.setAttribute('aria-label',`Задание ${index+1}, выполнено`)}
   host.querySelector('.focus-next').disabled=index===list.length-1||(instant&&!ok);
   progress();
   if(ok&&solved.size===list.length&&levels.length===1)box.querySelector('.feedback').textContent='Все задания выполнены!';
  }
  checkButton.onclick=check;
  input.addEventListener('input',clear);input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();check()}});
  host.querySelector('.focus-prev').disabled=index===0;host.querySelector('.focus-next').disabled=index===list.length-1||instant;
  host.querySelector('.focus-count').textContent=`${index+1} из ${list.length}`;
  progress();
 }
 function progress(){if(host.id!=='reviewDeck')return;let el=host.querySelector('.review-progress');if(!el){el=document.createElement('p');el.className='review-progress';el.setAttribute('aria-live','polite');host.append(el)}const count=[...solved].filter(key=>key.startsWith(level+':')).length;el.textContent=count===list.length?'Все '+list.length+' задания выполнены верно.':`Выполнено верно: ${count} из ${list.length}`}
 function choose(){list=bank.filter(t=>(t.level||1)===level);index=0;draw()}
 levelBox.querySelectorAll('button').forEach(b=>b.onclick=()=>{level=+b.dataset.level;levelBox.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));choose()});
 host.querySelector('.focus-prev').onclick=()=>{if(index){index--;draw()}};host.querySelector('.focus-next').onclick=()=>{if(index<list.length-1){index++;draw()}};choose();
};

window.typesMix = function(host, options, bank, deck, limit=24) {
 const selected=new Set([options[0][0]]);
 host.classList.add('tap-choices');host.setAttribute('aria-label','Выбор типов заданий');
 host.innerHTML=options.map(([v,label])=>`<button data-format="${v}" aria-pressed="${selected.has(v)}">${label}</button>`).join('')+'<button data-mix aria-pressed="false">Микс</button>';
 function update(){host.querySelectorAll('[data-format]').forEach(b=>b.setAttribute('aria-pressed',String(selected.has(b.dataset.format))));host.querySelector('[data-mix]').setAttribute('aria-pressed',String(selected.size===options.length));const tasks=bank.filter(t=>selected.has(t.direction));const result=[];[1,2,3].forEach(level=>{const queues=[...selected].map(direction=>shuffleFractions(tasks.filter(t=>(t.level||1)===level&&t.direction===direction)));let added=0;while(added<limit&&queues.some(q=>q.length)){for(const q of queues){if(q.length&&added<limit){result.push(q.shift());added++}}}});typesPractice(deck,shuffleFractions(result))}
 host.querySelectorAll('[data-format]').forEach(b=>b.onclick=()=>{const v=b.dataset.format;if(selected.has(v)){if(selected.size===1)return;selected.delete(v)}else selected.add(v);update()});
 host.querySelector('[data-mix]').onclick=()=>{options.forEach(([v])=>selected.add(v));update()};update();
};
