'use strict';

mountPractice('#decimalToFractionPractice',['decimalToFraction'],{title:'Запиши обыкновенной дробью'});
mountPractice('#fractionToDecimalPractice',['fractionToDecimal'],{title:'Запиши десятичной дробью'});

// The whole numerical readout can be hidden while the SVG and level controls remain usable.
let cupMetricsHidden=false;
function applyCupMask(){
 $('#cupResult').hidden=cupMetricsHidden;$('#cupPercent').hidden=cupMetricsHidden;$('#cupMaskMessage').hidden=!cupMetricsHidden;
 $('#cupMetricToggle').textContent=cupMetricsHidden?'Показать числовую плашку':'Скрыть числовую плашку';$('#cupMetricToggle').setAttribute('aria-expanded',String(!cupMetricsHidden));
 $('#cup').setAttribute('aria-label',cupMetricsHidden?'Стакан с жидкостью, числовые подписи скрыты':'Стакан наполнен на '+cupPercent+' процентов, вместимость '+cupCapacity+' миллилитров');
 $('#cupRange').setAttribute('aria-label',cupMetricsHidden?'Изменить уровень жидкости':'Изменить процент заполнения стакана');
}
const drawCupOriginal=drawCup;
drawCup=function(){drawCupOriginal();applyCupMask();$('#cupGuess').value='';clearFeedback($('#cupGuessFeedback'))};
$('#cupMetricToggle').onclick=()=>{cupMetricsHidden=!cupMetricsHidden;applyCupMask()};
$('#checkCupGuess').onclick=()=>{const value=number($('#cupGuess').value);feedback($('#cupGuessFeedback'),value!==null&&Math.abs(value-cupPercent)<1e-8)};
$('#cupGuess').oninput=()=>clearFeedback($('#cupGuessFeedback'));applyCupMask();

function beforeTopicEnd(panel,section){const next=panel.querySelector(':scope > .next-topic');panel.insertBefore(section,next||null)}
function storyArt(kind){const images={
 books:'<path d="M20 23h28v72H20z" fill="#e6b9a4"/><path d="M50 15h26v80H50z" fill="#a8c7dd"/><path d="M81 28l21-5 15 68-21 5z" fill="#acd0bb"/><path d="M25 39h18m-18 42h18m13-48h14m-14 47h14m19-40 12-3" stroke="#fff8" stroke-width="4"/><path d="M14 99h108" stroke="#839cac" stroke-width="4" stroke-linecap="round"/>',
 boxes:'<path d="M20 45l38-19 38 19-38 20z" fill="#ecd3b0"/><path d="M20 45v45l38 20V65z" fill="#d9b98e"/><path d="M58 65v45l38-20V45z" fill="#e7c99f"/><path d="M39 36l38 19v27l-19 10V65" fill="#f7e6cc"/><path d="M19 44l39 21 39-21M58 65v46" stroke="#b99b73" stroke-width="2" fill="none"/>',
 bottle:'<rect x="48" y="13" width="28" height="15" rx="4" fill="#84b2a1"/><path d="M48 29v14L35 56v48q0 9 10 9h34q10 0 10-9V56L76 43V29z" fill="#f3d4a2" stroke="#bd9c72" stroke-width="2"/><path d="M43 63h38v34H43z" fill="#fff4d8"/><path d="M49 35v13l-7 9v44" stroke="#fff9" stroke-width="5" fill="none"/><circle cx="62" cy="80" r="10" fill="#e9b167"/>',
 tree:'<path d="M57 73h12v40H57z" fill="#b39b7c"/><path d="M33 79C4 65 19 39 39 42 28 7 83 4 86 38c37-1 34 48 6 46z" fill="#a3c9ab"/><circle cx="37" cy="58" r="7" fill="#d99680"/><circle cx="73" cy="36" r="7" fill="#d99680"/><circle cx="87" cy="67" r="7" fill="#d99680"/><path d="M35 113h56" stroke="#ccd9be" stroke-width="6" stroke-linecap="round"/>',
 school:'<path d="M22 43h82v69H22z" fill="#e8cfb0"/><path d="M15 44l48-30 48 30z" fill="#9dbecf"/><path d="M53 78h22v34H53z" fill="#9ab5bf"/><path d="M34 59h15v15H34zm45 0h15v15H79z" fill="#fff8e8"/><circle cx="63" cy="38" r="10" fill="#fff9eb"/><path d="M63 31v8h7" stroke="#8ba6ae" stroke-width="2" fill="none"/>',
 art:'<rect x="21" y="17" width="89" height="81" rx="6" fill="#c7b494"/><rect x="28" y="24" width="75" height="67" fill="#edf4ef"/><path d="M29 81l24-32 19 19 13-16 18 29" fill="#a1c1aa"/><circle cx="84" cy="40" r="9" fill="#edcf87"/><path d="M65 99v17m-25 0h50" stroke="#a38c70" stroke-width="4" stroke-linecap="round"/>'
};return `<svg viewBox="0 0 130 125" aria-hidden="true">${images[kind]||images.books}</svg>`}

function mountStories(topic,modes){
 const section=document.createElement('section');section.className='story-workshop';section.innerHTML='<h2>Сюжетные задачи с таблицей</h2><p>Прочитай условие. Заполни промежуточную строку и найди неизвестное.</p><div class="story-box"></div>';beforeTopicEnd($('#'+topic),section);
 const root=section.querySelector('.story-box');let mode=modes[0],index=0;
 function draw(){const tasks=WORD_STORIES[mode],t=tasks[index],whole=mode==='whole'?t.part/t.percent*100:t.whole,part=mode==='part'?t.whole*t.percent/100:t.part,p=part/whole*100;
  const rows=mode==='part'?[[fmt(whole),'100%'],['input','1%'],['input',fmt(t.percent)+'%']]:mode==='whole'?[[fmt(part),fmt(t.percent)+'%'],['input','1%'],['input','100%']]:[[fmt(whole),'100%'],['input','1%'],[fmt(part),'inputPercent']];
  let inputIndex=0;
  root.innerHTML=(modes.length>1?'<div class="story-mode-tabs">'+modes.map(m=>`<button data-story-mode="${m}" aria-pressed="${m===mode}">${m==='whole'?'Найти целое':'Найти процент'}</button>`).join('')+'</div>':'')+`<div class="story-heading">${storyArt(t.art)}<p>${t.q}</p></div><table class="story-table"><thead><tr><th>${t.unit}</th><th>Проценты</th></tr></thead><tbody>${rows.map(row=>'<tr>'+row.map(value=>`<td>${value==='input'||value==='inputPercent'?`<input inputmode="decimal" data-story-input="${inputIndex++}" aria-label="${value==='inputPercent'?'Неизвестный процент':'Неизвестное количество'}">${value==='inputPercent'?' %':''}`:value}</td>`).join('')+'</tr>').join('')}</tbody></table>`+
   `<div class="story-bars"><p><span>${mode==='whole'?'Всё количество':'Всё количество'}</span><span>${mode==='whole'?'?':fmt(whole)} ${t.unit} — 100%</span></p><div class="story-bar" style="width:${whole/Math.max(whole,part)*100}%"></div><p><span>Часть</span><span>${mode==='part'?'?':fmt(part)} ${t.unit} — ${mode==='ratio'?'?':fmt(t.percent)}%</span></p><div class="story-bar part-bar" style="width:${part/Math.max(whole,part)*100}%"></div></div><div class="answer-row"><button class="primary story-check">Проверить таблицу</button><button class="story-clear">Очистить</button><button class="story-next">Следующая задача →</button></div><p class="feedback" aria-live="polite"></p><div class="story-number-nav">${tasks.map((_,i)=>`<button data-story-index="${i}" aria-current="${i===index}">${i+1}</button>`).join('')}</div>`;
  const expected=mode==='part'?[whole/100,part]:mode==='whole'?[part/t.percent,whole]:[whole/100,p];
  root.querySelector('.story-check').onclick=()=>{let all=true;root.querySelectorAll('[data-story-input]').forEach((input,i)=>{const value=number(input.value),ok=value!==null&&Math.abs(value-expected[i])<1e-7;input.closest('td').classList.toggle('correct',ok);input.closest('td').classList.toggle('incorrect',!ok);input.setAttribute('aria-invalid',String(!ok));all=all&&ok});feedback(root.querySelector('.feedback'),all,'Таблица заполнена верно.','Проверь выделенные клетки.')};
  root.querySelectorAll('[data-story-input]').forEach(input=>{input.oninput=()=>{input.closest('td').classList.remove('correct','incorrect');input.removeAttribute('aria-invalid');clearFeedback(root.querySelector('.feedback'))};input.onkeydown=e=>{if(e.key==='Enter')root.querySelector('.story-check').click()}});
  root.querySelector('.story-clear').onclick=draw;root.querySelector('.story-next').onclick=()=>{index=(index+1)%tasks.length;draw()};root.querySelectorAll('[data-story-index]').forEach(b=>b.onclick=()=>{index=+b.dataset.storyIndex;draw()});root.querySelectorAll('[data-story-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.storyMode;index=0;draw()});
 }
 draw();
}
mountStories('part',['part']);mountStories('whole',['whole','ratio']);

function mountTopicChecks(topic,data){
 const section=document.createElement('section');section.className='topic-check';section.innerHTML='<h2>Верно или нет? Исправь ошибку</h2><p>Оцени утверждение. Если оно неверно, запиши правильный ответ.</p><div class="check-content"></div>';beforeTopicEnd($('#'+topic),section);const root=section.querySelector('.check-content');let index=0,choice=null;
 function draw(){const t=data[index];choice=null;root.innerHTML=`<div class="statement-numbers">${data.map((_,i)=>`<button data-statement="${i}" aria-pressed="${i===index}">${i+1}</button>`).join('')}</div><p class="check-question">${t.q}</p><div class="error-choices"><button data-choice="true">Верно</button><button data-choice="false">Неверно</button></div><div class="correction-row" hidden><p>${t.prompt||'Запиши правильный ответ.'}</p>${t.kind==='fraction'?'<span class="frac"><span><input class="correction-n" type="number" inputmode="numeric" aria-label="Числитель исправленного ответа"></span><span><input class="correction-d" type="number" inputmode="numeric" aria-label="Знаменатель исправленного ответа"></span></span>':'<input class="correction-value" inputmode="decimal" aria-label="Исправленный ответ">'}</div><div class="answer-row"><button class="primary check-statement">Проверить</button><button class="next-statement">Следующее →</button><span class="feedback" aria-live="polite"></span></div>`;hydrate(root);
  root.querySelectorAll('[data-statement]').forEach(b=>b.onclick=()=>{index=+b.dataset.statement;draw()});root.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{choice=b.dataset.choice==='true';root.querySelectorAll('[data-choice]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));root.querySelector('.correction-row').hidden=choice||t.valid;clearFeedback(root.querySelector('.feedback'))});
  root.querySelector('.check-statement').onclick=()=>{if(choice===null){feedback(root.querySelector('.feedback'),false,'','Сначала выбери «верно» или «неверно».');return}let corrected=t.valid;if(!t.valid){if(t.kind==='fraction'){const n=number(root.querySelector('.correction-n').value),d=number(root.querySelector('.correction-d').value);corrected=n!==null&&d!==null&&Number.isInteger(n)&&Number.isInteger(d)&&d>0&&n*t.answer[1]===d*t.answer[0]}else{const n=number(root.querySelector('.correction-value').value);corrected=n!==null&&Math.abs(n-t.answer)<1e-7}}feedback(root.querySelector('.feedback'),choice===t.valid&&corrected)};root.querySelector('.next-statement').onclick=()=>{index=(index+1)%data.length;draw()};
 }
 draw();
}
Object.entries(TOPIC_CHECKS).forEach(([topic,data])=>mountTopicChecks(topic,data));
Object.entries(TOPIC_NOTEBOOK).forEach(([topic,items])=>{if(!items.length)return;const section=document.createElement('section');section.className='topic-notebook';section.innerHTML='<p class="section-label">Самостоятельная работа</p><h2>В тетрадь · '+({meaning:'смысл процента',fractions:'проценты и дроби',decimals:'перевод дробей',part:'процент от числа',whole:'целое и его процент',life:'задачи из жизни',practice:'закрепление'}[topic])+'</h2><p>Запиши решение и ответ. В текстовых задачах укажи, что принято за целое.</p>'+[1,2,3].filter(l=>items.some(t=>t.level===l)).map(l=>`<div class="notebook-group" data-level="${l}"><h3><span class="level-dot level-${l}"></span>Уровень ${l}</h3><ol class="notebook-list">${items.filter(t=>t.level===l).map(t=>`<li>${t.q}</li>`).join('')}</ol></div>`).join('');hydrate(section);beforeTopicEnd($('#'+topic),section)});
