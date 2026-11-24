const norm = s => String(s).trim().toLowerCase().replaceAll('х','x').replaceAll(',','.');
export function numberValue(s) {
 const m=norm(s).match(/^([+-]?(?:\d+(?:\.\d+)?|\.\d+))(?:\s*[/∶:]\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)))?$/);
 if(!m || m[2] && +m[2]===0) return NaN;
 return +m[1]/(m[2]===undefined?1:+m[2]);
}
const equal=(a,b)=>Number.isFinite(a)&&Math.abs(a-b)<1e-8;
const f=n=>String(n).replace('.',',');
export function validProportion(values,t) {
 if(t.kind===2 || values.length!==4) return false;
 const tokens=values.map(s=>norm(s)==='x'?'x':numberValue(s));
 const needed=[t.a,t.b,t.c,'x'];
 for(const token of tokens){
  const i=needed.findIndex(v=>v==='x'?token==='x':equal(token,v));
  if(i===-1) return false;
  needed.splice(i,1);
 }
 // Check both the symbolic structure and the value, so using x in an
 // identity or omitting a datum cannot pass accidentally.
 const product=(a,b)=>({power:Number(a==='x')+Number(b==='x'),coefficient:(a==='x'?1:a)*(b==='x'?1:b)});
 const left=product(tokens[0],tokens[3]),right=product(tokens[1],tokens[2]);
 return left.power!==right.power && equal(left.coefficient*(left.power?t.answer:1),right.coefficient*(right.power?t.answer:1));
}
export function mountStoryTrainer(root, bank, {steps=false,fixed=false}={}) {
 let tasks=bank, index=0, drafts=new Map(), checked=new Map();
 root.classList.add('story-trainer'); const promptId=root.id+'-question';
 root.innerHTML=`<div class="story-settings">${fixed?'':`<label>Зависимость <select data-kind><option value="all">Все виды</option><option value="0">Прямая</option><option value="1">Обратная</option><option value="2">Ни та ни другая</option></select></label><label>Сложность <select data-level><option value="all">Все задания</option><option value="1">База</option><option value="2">Сложнее</option></select></label><label class="step-toggle"><input type="checkbox" data-steps ${steps?'checked':''}> Составлять таблицу и пропорцию</label>`}<button type="button" data-reset>Начать заново</button></div><div class="story-card"><p class="story-count"></p><h3 class="story-question" id="${promptId}" tabindex="-1"></h3><form autocomplete="off" novalidate><div class="story-fields"></div><button class="primary" type="submit">Проверить решение</button><p class="feedback" role="status"></p></form><div class="story-nav"><button type="button" data-prev>Назад</button><span data-position></span><button type="button" data-next>Следующее</button></div><div class="numbers" role="group" aria-label="Выбери задачу"></div></div>`;
 const $=s=>root.querySelector(s), question=$('.story-question'),form=$('form'), fields=$('.story-fields'),feedback=$('.feedback');
 const useSteps=()=>fixed||$('[data-steps]').checked;
 const input=(name,label)=>`<input name="${name}" type="text" aria-label="${label}" aria-describedby="${promptId}" spellcheck="false" inputmode="text">`;
 const get=()=>Object.fromEntries(new FormData(form));
 function save(){drafts.set(tasks[index],get());}
 function render(focus=false){
  const t=tasks[index],d=drafts.get(t)||{};
  $('.story-count').textContent=`${t.level===1?'База':'Сложнее'} · ${index+1} из ${tasks.length}`;
  question.textContent=t.prompt;
  fields.innerHTML=`${fixed?'':`<fieldset><legend>Какая зависимость?</legend><div class="choices">${['Прямая','Обратная','Ни та ни другая'].map((v,i)=>`<label><input type="radio" name="kind" value="${i}">${v}</label>`).join('')}</div></fieldset>`}
   ${t.kind!==2&&useSteps()?`<div class="solution-stage"><h4>Выпиши данные в таблицу</h4><p class="caption">Первый случай — верхняя строка, второй — нижняя. Неизвестное обозначь x.</p><table class="entry-table"><thead><tr>${t.columns.map(c=>`<th scope="col">${c}</th>`).join('')}</tr></thead><tbody><tr><td>${input('t0','Таблица: первый случай, первая величина')}</td><td>${input('t1','Таблица: первый случай, вторая величина')}</td></tr><tr><td>${input('t2','Таблица: второй случай, первая величина')}</td><td>${input('t3','Таблица: второй случай, вторая величина')}</td></tr></tbody></table></div>
   <div class="solution-stage"><h4>Составь пропорцию</h4><p class="caption">Используй три числа из таблицы и x, каждое по одному разу. Порядок выбери сам.</p><div class="proportion-entry"><div class="fraction">${input('p0','Левая дробь: числитель')}${input('p1','Левая дробь: знаменатель')}</div><span>=</span><div class="fraction">${input('p2','Правая дробь: числитель')}${input('p3','Правая дробь: знаменатель')}</div></div></div>`:''}
   <div class="solution-stage final-answer"><label>${t.kind===2?'Ответ':'x ='} ${input('result','Ответ задачи')} <span>${t.unit}</span></label></div>`;
  for(const el of fields.querySelectorAll('input')){if(el.type==='radio')el.checked=d[el.name]===el.value;else el.value=d[el.name]||'';}
  $('[data-prev]').disabled=index===0; $('[data-next]').disabled=index===tasks.length-1;
  $('[data-position]').textContent=`${index+1} / ${tasks.length}`;
  $('.numbers').innerHTML=tasks.map((task,i)=>`<button type="button" data-index="${i}" aria-label="Задача ${i+1}" aria-pressed="${index===i}" ${checked.get(task)?'data-done':''}>${i+1}</button>`).join('');
  feedback.textContent=''; delete feedback.dataset.state;
  if(focus) question.focus({preventScroll:true});
 }
 function go(i){if(i<0||i>=tasks.length)return;save();index=i;render(true);}
 function reset(){drafts=new Map();checked=new Map();index=0;render();}
 function filter(){const kind=$('[data-kind]').value,level=$('[data-level]').value;tasks=bank.filter(t=>(kind==='all'||t.kind===+kind)&&(level==='all'||t.level===+level));index=0;render();}
 function fail(message,name){feedback.dataset.state='wrong';feedback.textContent=message;if(name)form.elements.namedItem(name)?.focus({preventScroll:true});}
 form.addEventListener('input',()=>{save();checked.delete(tasks[index]);$('.numbers').querySelector(`[data-index="${index}"]`)?.removeAttribute('data-done');feedback.textContent='';delete feedback.dataset.state;});
 form.addEventListener('submit',e=>{
  e.preventDefault();save();const t=tasks[index],v=get();
  if(!fixed&&v.kind===undefined)return fail('Сначала выбери вид зависимости.');
  if(!fixed&&+v.kind!==t.kind)return fail(t.kind===2?t.hint:'Проверь, что остаётся постоянным: частное двух величин или их произведение.');
  if(t.kind!==2&&useSteps()){
   const expected=[t.a,t.b,t.c,'x'];
   for(let i=0;i<4;i++){
    if(!v['t'+i]?.trim())return fail('Заполни все четыре ячейки таблицы.','t'+i);
    if(expected[i]==='x'?norm(v['t'+i])!=='x':!equal(numberValue(v['t'+i]),expected[i]))return fail('Проверь таблицу: одинаковые величины стоят друг под другом. Неизвестное обозначь x.','t'+i);
   }
   if([0,1,2,3].some(i=>!v['p'+i]?.trim()))return fail('Заполни числители и знаменатели обеих дробей.');
   if(!validProportion([v.p0,v.p1,v.p2,v.p3],t))return fail(t.kind===0?'Проверь соответствие: для прямой зависимости сравни значения в одинаковом порядке.':'Проверь соответствие: при обратной зависимости одно отношение нужно перевернуть.');
  }
  if(!v.result?.trim())return fail('Теперь вычисли x и запиши ответ.','result');
  if(!equal(numberValue(v.result),t.answer))return fail(t.kind===2?t.hint:'Вид зависимости выбран верно. Проверь вычисления и единицы ответа.','result');
  checked.set(t,true);feedback.dataset.state='correct';feedback.textContent=t.kind===2?'Верно. Пропорциональная зависимость здесь не подходит.':useSteps()?'Верно: таблица, пропорция и ответ согласованы.':'Верно: вид зависимости и ответ.';
  $('.numbers').querySelector(`[data-index="${index}"]`).setAttribute('data-done','');
 });
 $('[data-prev]').addEventListener('click',()=>go(index-1));$('[data-next]').addEventListener('click',()=>go(index+1));
 $('.numbers').addEventListener('click',e=>{const b=e.target.closest('[data-index]');if(b)go(+b.dataset.index);});
 $('[data-reset]').addEventListener('click',reset);
 if(!fixed){$('[data-kind]').addEventListener('change',()=>{save();filter();});$('[data-level]').addEventListener('change',()=>{save();filter();});$('[data-steps]').addEventListener('change',()=>{save();checked.delete(tasks[index]);render();});}
 render();
}
