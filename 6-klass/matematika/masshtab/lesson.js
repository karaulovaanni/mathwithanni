import {tasks, numberValue, equal, expectedProportion, checkProportion,points,mapCentimeters,groundKilometers} from './data.js?v=1';
const $=id=>document.getElementById(id);
const fmt=n=>n.toLocaleString('ru-RU',{maximumFractionDigits:6});
const frac=(a,b)=>`<span class="fraction"><span>${a}</span><span>${b}</span></span>`;
const formula=s=>`<div class="formula">${s}</div>`;
const label=s=>`<p class="step-label">${s}</p>`;
const examples={
 scale:{question:'Между Москвой и Владимиром 180 км. На карте — 72 мм. Какой масштаб?',content:
 label('Разные единицы нельзя сразу делить')+formula('<span class="map-color">72 мм</span> и <span class="real-color">180 км</span>')+
 label('Переводим настоящую длину в миллиметры')+formula('180 км = 180 000 000 мм')+
 label('Карта : местность — теперь в одинаковых единицах')+formula(frac('<span class="map-color">72</span>','<span class="real-color">180 000 000</span>')+' = '+frac('1','2 500 000'))+
 '<p class="explanation">Первое число — длина на карте, второе — соответствующая настоящая длина. Делим оба числа отношения на 72.</p><div class="answer-chip">Масштаб 1 : 2 500 000</div><p class="caption">В 1 мм карты — 2,5 км местности. А в 1 см карты — 25 км.</p>'},
 ground:{question:'На карте масштаба 1 : 10 000 000 отрезок равен 4 см. Какое расстояние на местности?',content:
 label('x — настоящее расстояние в сантиметрах')+formula(frac('<span class="map-color">4</span>','<span class="real-color">x</span>')+' = '+frac('1','10 000 000'))+
 label('Восстанавливаем настоящую длину')+formula('x = 4 · 10 000 000')+formula('x = 40 000 000 см')+
 label('Переводим сантиметры в километры')+formula('40 000 000 : 100 000 = 400')+'<div class="answer-chip">На местности 400 км</div><p class="caption">Настоящее расстояние больше отрезка на карте, поэтому умножаем на число масштаба.</p>'},
 paper:{question:'На местности 5,2 км. Какой отрезок получится на карте масштаба 1 : 1 000 000?',content:
 label('Сначала одинаковые единицы')+formula('5,2 км = 520 000 см')+
 label('x — длина на карте в сантиметрах')+formula(frac('<span class="map-color">x</span>','<span class="real-color">520 000</span>')+' = '+frac('1','1 000 000'))+
 label('Уменьшаем настоящую длину')+formula('x = 520 000 : 1 000 000')+'<div class="answer-chip">На карте 0,52 см</div><p class="caption">Нужна уменьшенная длина, поэтому делим на число масштаба.</p>'}
};
function showExample(kind){
 const e=examples[kind];$('worked').dataset.mode=kind;$('worked').innerHTML=`<h3>${e.question}</h3>${e.content}`;
 document.querySelectorAll('[data-example]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.example===kind)));
}
document.querySelectorAll('[data-example]').forEach(b=>b.addEventListener('click',()=>showExample(b.dataset.example)));
showExample('scale');
const links=[...document.querySelectorAll('nav a')];
function openTab(focus=false){
 const id=links.map(l=>l.hash.slice(1)).includes(location.hash.slice(1))?location.hash.slice(1):'meaning';
 links.forEach(l=>{const on=l.hash==='#'+id;$(l.hash.slice(1)).hidden=!on;if(on)l.setAttribute('aria-current','page');else l.removeAttribute('aria-current');});
 if(focus){$(id).focus({preventScroll:true});scrollTo(0,0);}
}
links.forEach(l=>l.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.altKey||e.shiftKey)return;e.preventDefault();if(location.hash!==l.hash)history.pushState(null,'',l.hash);openTab(true);}));
addEventListener('popstate',()=>openTab(true));addEventListener('hashchange',()=>openTab(true));addEventListener('pageshow',e=>{if(e.persisted)location.reload();});openTab();
// The virtual centimetre always equals 60 SVG units, independently of screen size.
let selected=[0,1];
function mapRender(){
 const n=+$('map-scale').value; const a=points[selected[0]],b=points[selected[1]];
 const segment=b?`<path d="M${a.x} ${a.y}L${b.x} ${b.y}" stroke="#ad4f77" stroke-width="5" stroke-dasharray="10 6" fill="none"/>`:'';
 $('map-scene').innerHTML=`<svg viewBox="0 0 600 450" aria-labelledby="map-svg-title" role="group"><title id="map-svg-title">Учебная карта. Выбери два пункта для измерения.</title><defs><pattern id="map-grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0v60" fill="none" stroke="#dfe7d8" stroke-width="1"/></pattern></defs><rect width="600" height="450" fill="url(#map-grid)"/><path d="M460 0q-95 65-15 140t-10 170q-80 55-30 140" fill="none" stroke="#badbe8" stroke-width="32"/><path d="M465 0q-95 65-15 140t-10 170q-80 55-30 140" fill="none" stroke="#e1f1f5" stroke-width="3"/><path d="m45 225 155-35 180 35 190-25M80 65l140 290" stroke="#e2d3ba" stroke-width="11" fill="none"/><path d="m45 225 155-35 180 35 190-25M80 65l140 290" stroke="white" stroke-width="3" fill="none"/><g fill="#d3e5c7"><ellipse cx="65" cy="345" rx="48" ry="43"/><ellipse cx="310" cy="50" rx="80" ry="30"/><ellipse cx="535" cy="325" rx="42" ry="63"/></g>${segment}${points.map((p,i)=>`<g role="button" tabindex="0" aria-label="${p.name}" aria-pressed="${selected.includes(i)}" data-point="${i}"><circle class="point-hit" cx="${p.x}" cy="${p.y}" r="26" fill="transparent"/><circle class="point" cx="${p.x}" cy="${p.y}" r="10" fill="#8555a2"/><text x="${p.x}" y="${p.y-27}" text-anchor="middle" font-size="22" font-weight="650" fill="#40364e" paint-order="stroke" stroke="#f8fbf5" stroke-width="5">${p.name}</text></g>`).join('')}<g transform="translate(40 390)"><rect width="180" height="12" fill="#fff" stroke="#6e5c80"/><rect width="60" height="12" fill="#9f87b9"/><rect x="120" width="60" height="12" fill="#9f87b9"/><g fill="#40364e" font-size="19"><text x="0" y="37">0</text><text x="60" y="37" text-anchor="middle">1</text><text x="120" y="37" text-anchor="middle">2</text><text x="180" y="37" text-anchor="middle">3 см</text></g></g></svg>`;
 $('map-pair').textContent=b?a.name+' — '+b.name:'Выбрано: '+a.name+'. Выбери второй пункт.';
 $('map-length').textContent=b?fmt(mapCentimeters(a,b))+' см на карте':'';
 $('map-key').textContent='Масштаб 1 : '+fmt(n)+': в 1 см карты — '+fmt(n/100000)+' км местности.';
 $('map-answer').value='';$('map-answer').disabled=!b;$('map-form').querySelector('button').disabled=!b;
 $('map-feedback').textContent='';delete $('map-feedback').dataset.state;
}
function choosePoint(i){if(selected.length===2)selected=[i];else if(selected[0]!==i)selected.push(i);mapRender();}
$('map-scene').addEventListener('click',e=>{const b=e.target.closest('[data-point]');if(b)choosePoint(+b.dataset.point);});
$('map-scene').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){const b=e.target.closest('[data-point]');if(b){e.preventDefault();const i=+b.dataset.point;choosePoint(i);$('map-scene').querySelector(`[data-point="${i}"]`).focus();}}});
$('map-scale').addEventListener('change',mapRender);$('map-reset').addEventListener('click',()=>{selected=[0];mapRender();});
$('map-form').addEventListener('submit',e=>{e.preventDefault();if(selected.length!==2)return;const actual=numberValue($('map-answer').value);const expected=groundKilometers(mapCentimeters(points[selected[0]],points[selected[1]]),+$('map-scale').value);const ok=equal(actual,expected);$('map-feedback').dataset.state=ok?'correct':'wrong';$('map-feedback').textContent=ok?'Верно. Расстояние найдено по масштабу.':!Number.isFinite(actual)?'Введи число. Можно использовать десятичную запятую.':'Посмотри, сколько километров приходится на 1 см карты. Умножь на длину выбранного отрезка.';});
$('map-answer').addEventListener('input',()=>{$('map-feedback').textContent='';delete $('map-feedback').dataset.state;});mapRender();
let activeTasks=tasks,index=0,draft={};
const titles={scale:'Найди масштаб',ground:'Расстояние на местности',paper:'Длина на карте'};
function keepDraft(){Object.assign(draft,Object.fromEntries(new FormData($('task-form'))));}
function renderTask(){
 const t=activeTasks[index];$('task-position').textContent=titles[t.kind]+' · '+(index+1)+' из '+activeTasks.length;$('task-question').textContent=t.prompt;
 const steps=$('show-steps').checked;
 $('task-fields').innerHTML=(steps?`<p class="steps-note">Обе длины запиши <strong>в сантиметрах</strong>. Неизвестную величину обозначь x. Справа — масштаб 1 : n.</p><div class="prop-input"><div class="fraction"><input type="text" name="map" aria-label="Длина на карте в сантиметрах или x"><input type="text" name="real" aria-label="Длина на местности в сантиметрах или x"></div><span>=</span><div class="fraction"><span>1</span><input type="text" name="scale" aria-label="Число масштаба n или x"></div></div>`:'')+`<label class="final-input">${t.kind==='scale'?'1 :':'Ответ'} <input type="text" inputmode="decimal" name="answer" aria-label="${t.kind==='scale'?'Число n в масштабе 1 к n':'Ответ задачи'}"> ${t.unit}</label>${t.kind==='scale'?'<p class="steps-note">Введи только число после двоеточия.</p>':''}`;
 for(const input of $('task-fields').querySelectorAll('input'))input.value=draft[input.name]||'';
 $('task-numbers').innerHTML=activeTasks.map((_,i)=>`<button type="button" data-task="${i}" aria-label="Задача ${i+1}" aria-pressed="${i===index}">${i+1}</button>`).join('');
 $('task-prev').disabled=index===0;$('task-next').disabled=index===activeTasks.length-1;$('task-feedback').textContent='';delete $('task-feedback').dataset.state;
}
function goTask(i){if(i<0||i>=activeTasks.length)return;index=i;draft={};renderTask();$('task-question').focus({preventScroll:true});}
$('task-mode').addEventListener('change',()=>{activeTasks=$('task-mode').value==='all'?tasks:tasks.filter(t=>t.kind===$('task-mode').value);goTask(0);});
$('task-reset').addEventListener('click',()=>goTask(0));$('task-prev').addEventListener('click',()=>goTask(index-1));$('task-next').addEventListener('click',()=>goTask(index+1));
$('task-numbers').addEventListener('click',e=>{const b=e.target.closest('[data-task]');if(b)goTask(+b.dataset.task);});$('show-steps').addEventListener('change',()=>{keepDraft();renderTask();});
$('task-form').addEventListener('input',()=>{$('task-feedback').textContent='';delete $('task-feedback').dataset.state;});
$('task-form').addEventListener('submit',e=>{
 e.preventDefault();const t=activeTasks[index],v=Object.fromEntries(new FormData(e.currentTarget));let message='',ok=false;
 if($('show-steps').checked&&!checkProportion([v.map,v.real,v.scale],t))message='Проверь пропорцию: сверху длина карты, снизу настоящая длина. Обе — в сантиметрах; неизвестное запиши как x.';
 else if(!Number.isFinite(numberValue(v.answer)))message='Запиши числовой ответ. Можно с запятой или точкой.';
 else if(!equal(numberValue(v.answer),t.answer))message=t.kind==='scale'?'Раздели настоящую длину на длину карты в одинаковых единицах. В поле нужно только n.':t.kind==='ground'?'Настоящая длина больше: умножь длину карты на n. Проверь, в каких единицах нужен ответ.':'Длина карты меньше: раздели настоящую длину на n. Перед этим переведи её в сантиметры.';
 else{ok=true;message=$('show-steps').checked?'Верно: пропорция и ответ согласованы.':'Верно.';}
 $('task-feedback').dataset.state=ok?'correct':'wrong';$('task-feedback').textContent=message;
});
renderTask();
