(()=>{
 const M=MixedModels,B=MixedBanks,{frac:F,mixed:S,from:R,whole:W,eq:E}=M;
 const sec=(id,title,nav,body,practice=false)=>`<section id="${id}" data-nav="${nav}"${practice?' class="practice-panel"':''}><h2>${title}</h2>${body}</section>`;
 const deck=(id,title,nav)=>sec(id,title,nav,`<div id="${id}Deck"></div>`,true);
 const source=(ops=false)=>`<p class="source-note">По учебнику Виленкина, Жохова и Чеснокова, 5 класс, часть 2: §${ops?'32':'31'}. Дополнительно: <a href="https://fraction.slonum.ru/lesson/${ops?'6':'5'}" target="_blank" rel="noopener">СлонУм</a> · <a href="https://obrazavr.ru/matematika/5-klass-matematika/drobnye-chisla/smeshannye-chisla/${ops?'slozhenie-i-vychitanie-smeshannyh-chisel':'smeshannye-chisla'}/" target="_blank" rel="noopener">Образавр</a>.</p>`;
 const mixed=document.getElementById('mixedLesson'),operations=document.getElementById('mixedOperationsLesson');
 mixed.classList.add('mx-lesson');operations.classList.add('mx-lesson');
 mixed.innerHTML=sec('mixed-meaning','Целые и ещё часть','Смешанное число',`${E(S(2,3,5),`${W(2)} + ${F(3,5)}`)}<div class="mx-part-labels"><span><b class="mx-whole">2</b>целая часть</span><span><b>${F(3,5)}</b>дробная часть</span></div><p>Смешанное число — сумма целой части и правильной дроби. Читаем: «две целых три пятых». Между частями подразумевается <b>плюс</b>.</p><div class="mx-lab"><div class="mx-controls"><label>Целых <input id="mxW" type="range" min="1" max="4" value="2"><output id="mxWOut">2</output></label><label>Долей <input id="mxN" type="range" min="1" max="4" value="3"><output id="mxNOut">3</output></label><label>В целом <select id="mxD" aria-label="Знаменатель модели"><option>3</option><option>4</option><option selected>5</option><option>6</option><option>8</option></select> долей</label></div><div id="mxMeaningPicture"></div><div id="mxMeaningEquation" aria-live="polite"></div><p>Все пироги одинакового размера. Дробная часть меньше одного пирога.</p></div>${source()}`)
 +deck('mixed-pictures','Какое количество на рисунке?','Рисунки')
 +deck('mixed-parts','Целая и дробная части','Части числа')
 +sec('mixed-conversion','Из неправильной дроби — в смешанное число','Выделяем целое',`<div class="mx-lab"><div class="mx-controls"><label>Пример <select id="mxConvertExample"><option value="0">17 пятых</option><option value="1">11 четвертых</option><option value="2">23 шестых</option><option value="3">18 шестых</option></select></label></div><div id="mxConversionView"></div><div class="mx-actions"><button id="mxConvertBack">Назад</button><button id="mxConvertStep" class="primary">Собрать целые</button><button id="mxConvertReset">Сначала</button></div></div>`)
 +deck('mixed-extract','Выделяем целую часть','В смешанное')
 +sec('mixed-improper','Из смешанного числа — в неправильную дробь','В неправильную',`${E(S(3,2,5),`${W(3)} + ${F(2,5)}`)}<div class="mx-lab" id="mxReverseLab"><div id="mxReverseView"></div><div class="mx-actions"><button id="mxReverseStep" class="primary">Разделить целые на пятые</button><button id="mxReverseReset">Сначала</button></div></div><p>В каждом целом — 5 пятых. В трёх целых — 3 · 5 пятых. Прибавляем ещё 2 пятых. Знаменатель остаётся прежним.</p>`)
 +deck('mixed-pack','Запиши неправильной дробью','Перевод: практика')
 +sec('mixed-ray','Смешанные числа на прямой','Прямая',`${E(S(2,3,5),`${W(2)} + ${F(3,5)}`)}<div class="mx-ray-scroll">${M.ray(13,5,4)}</div><p>От нуля проходим 2 целых единичных отрезка, затем ещё 3 деления по ${F(1,5)}. Точка лежит между 2 и 3.</p><div class="tap-choices" id="mxRayModes"></div><div id="mixed-rayDeck"></div>`)
 +deck('mixed-stories','Задачи','Задачи')
 +deck('mixed-errors','Исправь ошибку','Ошибки')
 +sec('mixed-notebook','Реши в тетради','В тетрадь',`<ol class="notebook">${[
 `Изобрази ${S(2,3,4)} пирога. Подпиши целую и дробную части.`,
 `Запиши суммой: ${S(3,2,7)}; ${S(5,4,9)}; ${S(1,5,8)}.`,
 `Выдели целую часть: ${F(19,6)}; ${F(29,8)}; ${F(37,10)}.`,
 `Запиши неправильными дробями: ${S(4,2,5)}; ${S(2,3,8)}; ${S(6,1,7)}.`,
 `Найди натуральные числа: ${F(24,6)}; ${F(28,7)}; ${F(35,5)}.`,
 `Отметь на прямой ${S(1,1,4)}, ${S(2,3,4)}, ${F(7,4)}. Единичный отрезок — 8 клеток.`,
 `Какие две соседние натуральные отметки окружают ${S(4,2,3)}?`,
 `На 6 одинаковых костюмов поровну израсходовали 17 м ткани. Сколько метров ткани ушло на один костюм?`,
 `В 19 бутылочках по ${F(1,4)} л. Сколько всего литров?`,
 `Ленту длиной ${S(3,2,5)} м нарезали на кусочки по ${F(1,5)} м. Сколько кусочков получилось?`,
 `Запиши три разных смешанных числа между 5 и 6.`,
 `У числа целая часть 4, знаменатель 9, числитель дробной части на 2 меньше знаменателя. Запиши это число и равную ему неправильную дробь.`
 ].map(x=>`<li>${x}</li>`).join('')}</ol>`);
 function init(id,bank){typesPractice(document.getElementById(id+'Deck'),bank)}
 init('mixed-pictures',B.pictures);init('mixed-parts',B.parts);init('mixed-extract',B.toMixed);init('mixed-pack',B.toFraction);init('mixed-stories',B.stories);init('mixed-errors',B.errors);
 const by=id=>document.getElementById(id);
 function loose(n,d,interactive=false,removed=[]){return `<div class="mx-loose-pieces">${Array.from({length:n},(_,i)=>`<${interactive?'button':'span'} ${interactive?`data-loose="${i}" aria-pressed="${removed.includes(i)}" aria-label="${removed.includes(i)?'Вернуть':'Убрать'} долю ${i+1}"`:''} class="${removed.includes(i)?'mx-removed':''}"><svg viewBox="0 0 75 75" aria-hidden="true"><path d="M10 66L10 10A56 56 0 0 1 ${10+56*Math.sin(2*Math.PI/d)} ${66-56*Math.cos(2*Math.PI/d)}Z" fill="${M.C.part}" stroke="#f5d6b2" stroke-width="3"/></svg>${F(1,d)}</${interactive?'button':'span'}>`).join('')}</div>`}
 
 function meaning(){const w=+by('mxW').value,d=+by('mxD').value;by('mxN').max=d-1;if(+by('mxN').value>=d)by('mxN').value=d-1;const n=+by('mxN').value;by('mxWOut').value=w;by('mxNOut').value=n;by('mxMeaningPicture').innerHTML=M.pies(w*d+n,d);by('mxMeaningEquation').innerHTML=E(S(w,n,d),`${W(w)} + ${F(n,d)}`)}
 ['mxW','mxD','mxN'].forEach(id=>by(id).oninput=meaning);meaning();
 let conversionStep=0;
 function conversion(){const [n,d]=[[17,5],[11,4],[23,6],[18,6]][+by('mxConvertExample').value],w=Math.floor(n/d),r=n%d;
 by('mxConversionView').innerHTML=E(F(n,d),conversionStep?R(n,d):'?')+(conversionStep?M.pies(n,d):loose(n,d))+(conversionStep?`<div class="mx-conversion-steps"><span>${n} : ${d} = <b class="mx-whole">${w}</b><small>целая часть</small></span><span>Остаток <b style="color:${M.C.part}">${r}</b><small>${r?'числитель дробной части':'нет дробной части'}</small></span></div>`:'<p>Сколько полных пирогов можно собрать из этих долей?</p>')+(conversionStep===2?E(`${n} = ${W(w)} · ${d} + ${r}`,F(n,d)+' = '+R(n,d))+`<p>${r?'Остаток меньше знаменателя — дробная часть правильная.':'Остаток равен нулю: получилось натуральное число.'}</p>`:'');by('mxConvertBack').disabled=!conversionStep;by('mxConvertStep').disabled=conversionStep===2;by('mxConvertStep').textContent=conversionStep?'Проверить перевод':'Собрать целые';}
 by('mxConvertBack').onclick=()=>{conversionStep--;conversion()};by('mxConvertStep').onclick=()=>{conversionStep++;conversion()};by('mxConvertReset').onclick=()=>{conversionStep=0;conversion()};by('mxConvertExample').onchange=()=>{conversionStep=0;conversion()};conversion();
 let reverseStep=0;
 function reverse(){by('mxReverseView').innerHTML=(reverseStep?loose(17,5):M.pies(17,5))+(reverseStep===0?E(S(3,2,5),`${W(3)} + ${F(2,5)}`):reverseStep===1?E(`${W(3)} + ${F(2,5)}`,`${F('3 · 5',5)} + ${F(2,5)}`):E(S(3,2,5),F('3 · 5 + 2',5),F(17,5)));by('mxReverseStep').textContent=reverseStep?'Сосчитать все пятые':'Разделить целые на пятые';by('mxReverseStep').disabled=reverseStep===2}
 by('mxReverseStep').onclick=()=>{reverseStep++;reverse()};by('mxReverseReset').onclick=()=>{reverseStep=0;reverse()};reverse();
 fractionChoices(by('mxRayModes'),[['read','Напиши число'],['place','Поставь точку']],v=>{if(v==='read')init('mixed-ray',B.line);else rayPlace()});by('mxRayModes').querySelector('button').setAttribute('aria-pressed','true');init('mixed-ray',B.line);
 function rayPlace(){let idx=0,chosen=null;const host=by('mixed-rayDeck');host.classList.add('types-trainer');
 function draw(){const t=B.specimens[idx],units=Math.max(3,t.w+1);host.innerHTML=`<div class="focus-numbers numbers">${B.specimens.map((_,i)=>`<button data-task-number="${i}" aria-current="${i===idx?'step':'false'}">${i+1}</button>`).join('')}</div><div class="practice-question">Поставь точку.${E(S(t.w,t.n,t.d))}</div><div class="mx-ray-scroll">${M.ray(chosen,t.d,units,true,chosen===null)}</div><button class="primary mx-place-check">Проверить</button><p class="feedback" aria-live="polite"></p><div class="practice-navigation"><button class="focus-prev"${idx===0?' disabled':''}>Назад</button><span>${idx+1} из 24</span><button class="focus-next"${idx===23?' disabled':''}>Следующее</button></div>`;
 host.querySelectorAll('[data-task-number]').forEach(b=>b.onclick=()=>{idx=+b.dataset.taskNumber;chosen=null;draw()});host.querySelectorAll('[data-mx-tick]').forEach(el=>{const choose=()=>{const k=+el.dataset.mxTick;chosen=chosen===k?null:k;draw()};el.onclick=choose;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose()}}});host.querySelector('.mx-place-check').onclick=()=>feedback(host.querySelector('.feedback'),chosen===t.N);host.querySelector('.focus-prev').onclick=()=>{if(idx){idx--;chosen=null;draw()}};host.querySelector('.focus-next').onclick=()=>{if(idx<23){idx++;chosen=null;draw()}};
 }draw()}
 const caseRow=(title,...steps)=>`<article class="mx-case"><h3>${title}</h3>${E(...steps)}</article>`;
 const plusCases=caseRow('Целые — с целыми, доли — с долями',`${S(2,1,7)} + ${S(3,4,7)}`,`(2 + 3) + ${F('1 + 4',7)}`,S(5,5,7))
 +caseRow('Из дробной части получается ещё одно целое',`${S(2,4,5)} + ${S(1,3,5)}`,`3 + ${F(7,5)}`,`3 + 1 + ${F(2,5)}`,S(4,2,5))
 +caseRow('Получается натуральное число',`${S(2,2,5)} + ${S(1,3,5)}`,`3 + ${F(5,5)}`,W(4))
 +caseRow('Смешанное + натуральное',`${S(2,3,7)} + 4`,`(2 + 4) + ${F(3,7)}`,S(6,3,7))
 +caseRow('Натуральное + смешанное',`4 + ${S(2,3,7)}`,`(4 + 2) + ${F(3,7)}`,S(6,3,7))
 +caseRow('Натуральное + правильная дробь',`3 + ${F(2,7)}`,S(3,2,7))
 +caseRow('Смешанное + правильная дробь',`${S(2,1,5)} + ${F(2,5)}`,`2 + ${F('1 + 2',5)}`,S(2,3,5))
 +caseRow('Прибавляем дробь с переходом через целое',`${F(4,5)} + ${S(2,3,5)}`,`2 + ${F(7,5)}`,S(3,2,5));
 const minusCases=caseRow('Долей хватает — вычитаем отдельно',`${S(5,6,7)} − ${S(2,4,7)}`,`(5 − 2) + ${F('6 − 4',7)}`,S(3,2,7))
 +caseRow('Долей не хватает — разменяем одно целое',`${S(4,1,5)} − ${S(2,3,5)}`,`3 + ${F(6,5)} − 2 − ${F(3,5)}`,S(1,3,5))
 +caseRow('Смешанное − натуральное',`${S(5,3,7)} − 2`,`(5 − 2) + ${F(3,7)}`,S(3,3,7))
 +caseRow('Натуральное − смешанное',`6 − ${S(2,3,5)}`,`5 + ${F(5,5)} − 2 − ${F(3,5)}`,S(3,2,5))
 +caseRow('Натуральное − правильная дробь',`4 − ${F(2,5)}`,`3 + ${F(5,5)} − ${F(2,5)}`,S(3,3,5))
 +caseRow('Смешанное − дробь: долей хватает',`${S(3,4,7)} − ${F(2,7)}`,`3 + ${F('4 − 2',7)}`,S(3,2,7))
 +caseRow('Смешанное − дробь: разменяем целое',`${S(3,1,5)} − ${F(4,5)}`,`2 + ${F(6,5)} − ${F(4,5)}`,S(2,2,5))
 +caseRow('Одинаковые дробные части исчезают',`${S(5,2,7)} − ${S(3,2,7)}`,`(5 − 3) + ${F(0,7)}`,W(2))
 +caseRow('Равные числа дают ноль',`${S(3,4,5)} − ${S(3,4,5)}`,W(0));
 operations.innerHTML=sec('mixedOperations-add','Складываем смешанные числа','Сложение',`<span class="mx-badge">Доли одного размера: знаменатели одинаковые</span>${E(`${S(2,4,5)} + ${S(1,3,5)}`,`3 + ${F(7,5)}`,S(4,2,5))}<div class="mx-lab"><div id="mxAdditionView"></div><div class="mx-actions"><button id="mxAdditionBack">Назад</button><button class="primary" id="mxAdditionStep">Объединить порции</button><button id="mxAdditionReset">Сначала</button></div></div>${source(true)}`)
 +sec('mixedOperations-plusCases','Как складываем: все случаи','Случаи: +',`<div class="mx-case-list">${plusCases}</div>`)
 +sec('mixedOperations-subtract','Вычитаем и разменяем целое','Вычитание',`<div class="mx-lab"><div id="mxSubtractView"></div><div class="mx-actions"><button id="mxSubtractBack">Назад</button><button class="primary" id="mxSubtractStep">Разменять одно целое</button><button id="mxSubtractReset">Сначала</button></div></div>`)
 +sec('mixedOperations-minusCases','Как вычитаем: все случаи','Случаи: −',`<div class="mx-case-list">${minusCases}</div>`)
 +sec('mixedOperations-models','Посчитай по рисунку','Рисунки',`<div id="mixedOperations-modelsDeck"></div>`,true)
 +sec('mixedOperations-practice','Вычисли','Примеры',`<div id="mxOperationModes"></div><div id="mixedOperations-practiceDeck"></div>`,true)
 +deck('mixedOperations-exchange','Выделяем и разменяем целое','Размен целого')
 +deck('mixedOperations-chains','Два действия','Два действия')
 +deck('mixedOperations-stories','Задачи','Задачи')
 +deck('mixedOperations-errors','Исправь ошибку','Ошибки')
 +sec('mixedOperations-notebook','Реши в тетради','В тетрадь',`<ol class="notebook">${[
 `Вычисли: ${S(2,1,9)} + ${S(4,5,9)}; ${S(3,2,7)} + ${S(1,3,7)}.`,
 `Выдели целое в ответе: ${S(2,5,6)} + ${S(1,4,6)}; ${S(4,7,8)} + ${S(2,3,8)}.`,
 `Найди суммы: 6 + ${S(2,3,5)}; ${S(3,2,7)} + 4; ${F(5,6)} + ${S(2,4,6)}.`,
 `Вычисли: ${S(7,8,9)} − ${S(3,5,9)}; ${S(5,4,7)} − 3.`,
 `Разменяй целое и вычисли: ${S(6,1,8)} − ${S(2,5,8)}; ${S(4,2,9)} − ${F(7,9)}.`,
 `Вычисли: 8 − ${S(3,2,7)}; 5 − ${F(4,9)}; 1 − ${F(3,8)}.`,
 `Найди натуральные ответы: ${S(3,2,7)} + ${S(1,5,7)}; ${S(6,4,9)} − ${S(2,4,9)}.`,
 `Вычисли: ${S(4,3,5)} − ${S(4,3,5)}; ${S(2,3,8)} − ${F(3,8)}.`,
 `Найди неизвестное: x + ${S(2,4,7)} = ${S(5,1,7)}.`,
 `От ленты длиной ${S(6,1,5)} м отрезали ${S(2,4,5)} м. Какова длина остатка?`,
 `В первый день прошли ${S(4,5,6)} км, во второй — ${S(3,4,6)} км. Сколько прошли за два дня?`,
 `В кувшине 4 л сока. Разлили ${S(1,3,8)} л. Сколько осталось?`,
 `Было ${S(7,2,9)} кг крупы. Использовали ${S(2,5,9)} кг, затем ещё 1 кг. Сколько осталось?`,
 `Нарисуй модель к примеру 3 − ${S(1,2,5)}. Покажи размен одного целого.`,
 `Вычисли: ${S(5,1,7)} − (${S(1,4,7)} + ${S(2,5,7)}).`
 ].map(x=>`<li>${x}</li>`).join('')}</ol>`);
 init('mixedOperations-models',Array.from({length:24},(_,i)=>{const t=B.calculations[(i%4)*24+i],{A,B:b,d,sign}=t.meta;return {...t,skill:'',q:'Вычисли по моделям.',visual:`<div class="mx-join-row"><div>${M.pies(A,d,i%2?'bars':'pies')}${E(R(A,d))}</div><b class="mx-arrow">${sign}</b><div>${M.pies(b,d,i%2?'bars':'pies')}${E(R(b,d))}</div></div>`}}));
 typesMix(by('mxOperationModes'),B.categories,B.calculations,by('mixedOperations-practiceDeck'),24);
 init('mixedOperations-exchange',B.gaps);init('mixedOperations-chains',B.chains);init('mixedOperations-stories',B.opStories);init('mixedOperations-errors',B.opErrors);
 let addStep=0;
 function addition(){by('mxAdditionView').innerHTML=addStep===0?`<div class="mx-join-row"><div>${M.pies(14,5)}${E(S(2,4,5))}</div><b class="mx-arrow">+</b><div>${M.pies(8,5)}${E(S(1,3,5))}</div></div>`:addStep===1?`<p>Целые собрали вместе. Доли пока отдельно.</p>${M.pies(15,5)}<div class="mx-join-row">${M.pies(4,5)}<b>+</b>${M.pies(3,5)}</div>${E(`(2 + 1) + ${F('4 + 3',5)}`,`3 + ${F(7,5)}`)}`:`<p>Из 7 пятых собрали целый пирог. Остались ещё 2 пятых.</p><div class="mx-join-row">${M.pies(5,5)}<b class="mx-arrow">+</b>${M.pies(2,5)}</div>${E(`3 + ${F(7,5)}`,`3 + ${W(1)} + ${F(2,5)}`,S(4,2,5))}${M.pies(22,5)}`;by('mxAdditionStep').textContent=addStep?'Собрать ещё целый пирог':'Объединить порции';by('mxAdditionStep').disabled=addStep===2;by('mxAdditionBack').disabled=!addStep}
 by('mxAdditionStep').onclick=()=>{addStep++;addition()};by('mxAdditionBack').onclick=()=>{addStep--;addition()};by('mxAdditionReset').onclick=()=>{addStep=0;addition()};addition();
 let subStep=0,removed=[];
 function subtraction(){
 by('mxSubtractView').innerHTML=subStep===0?`${E(`${S(3,1,5)} − ${S(1,3,5)}`)}${M.pies(16,5)}<p>Одной пятой не хватит, чтобы вычесть три пятых. Разменяем один целый пирог на 5 пятых.</p>`:subStep===1?`${E(S(3,1,5),`2 + ${F(5,5)} + ${F(1,5)}`,`2 + ${F(6,5)}`)}<div class="mx-join-row"><div>${M.pies(10,5)}<p>2 целых</p></div><b>+</b><div>${loose(6,5)}<p>6 отдельных пятых</p></div></div><p>Количество прежнее: целых стало на один меньше, пятых — на пять больше.</p>`:`${E(`2 + ${F(6,5)} − 1 − ${F(3,5)}`,`1 + ${F('6 − 3',5)}`,removed.length===3?S(1,3,5):'?')}<p>Один целый пирог уже убрали. Теперь убери 3 отдельные доли: нажимай на них.</p>${M.pies(5,5)}${loose(6,5,true,removed)}<p aria-live="polite">Убрано долей: ${removed.length} из 3.${removed.length===3?' Осталось 1 целое и 3 пятых.':''}</p>`;
 by('mxSubtractView').querySelectorAll('[data-loose]').forEach(b=>b.onclick=()=>{const i=+b.dataset.loose;if(removed.includes(i))removed=removed.filter(x=>x!==i);else if(removed.length<3)removed.push(i);subtraction()});by('mxSubtractBack').disabled=!subStep;by('mxSubtractStep').disabled=subStep===2;by('mxSubtractStep').textContent=subStep?'Вычесть целую часть':'Разменять одно целое';
 }
 by('mxSubtractStep').onclick=()=>{subStep++;subtraction()};by('mxSubtractBack').onclick=()=>{subStep--;removed=[];subtraction()};by('mxSubtractReset').onclick=()=>{subStep=0;removed=[];subtraction()};subtraction();
 window.refreshFractionOutline?.();
})();
