/* Lesson order and short independent practice beside each worked case. */
(()=>{
 const M=MixedModels,B=MixedBanks,V=FractionOperations,{frac:F,from:R,eq:E}=M;
 const expression=t=>`${R(t.meta.A,t.meta.d)} ${t.meta.sign} ${R(t.meta.B,t.meta.d)}`;
 function steps(t){const {A,B:b,d,sign,result}=t.meta,w=Math.floor(A/d),v=Math.floor(b/d),a=A%d,c=b%d;
  if(sign==='+')return E(expression(t),`(${w} + ${v}) + ${F(`${a} + ${c}`,d)}`,`${w+v} + ${F(a+c,d)}`,R(result,d));
  return a>=c?E(expression(t),`(${w} − ${v}) + ${F(`${a} − ${c}`,d)}`,R(result,d)):E(expression(t),`${w-1} + ${F(d+a,d)} − (${v} + ${F(c,d)})`,`(${w-1} − ${v}) + ${F(`${d+a} − ${c}`,d)}`,R(result,d));
 }
 function examples(rows,render,solution){return `<div class="case-practice"><h4>Попробуй самостоятельно</h4>${rows.map(t=>`<div class="case-exercise">${render(t)}<details><summary>Шаги</summary>${solution(t)}</details></div>`).join('')}</div>`}
 const panel=document.getElementById('mixedOperationsLesson'),plus=panel.querySelector('#mixedOperations-plusCases'),minus=panel.querySelector('#mixedOperations-minusCases');
 const plusRows=[...plus.querySelectorAll('.mx-case')],minusRows=[...minus.querySelectorAll('.mx-case')],all=[...plusRows,...minusRows];
 const directions=['add','carry','wholeResult','plusNatural','plusNatural','naturalPlusFraction','plusFraction','plusFraction','sub','borrow','minusNatural','naturalMinus','naturalFraction','minusFraction','minusFraction','wholeResult','zero'];
 all.forEach((row,i)=>{
  const pool=B.calculations.filter(t=>{if(t.direction!==directions[i])return false;const {A,B:b,d,sign}=t.meta;if(i===2)return sign==='+';if(i===15)return sign==='−';if(i===3)return A%d!==0;if(i===4)return A%d===0;if(i===5)return A%d===0;if(i===6)return A>=d&&b<d&&(A%d+b%d)<d;if(i===7)return A<d&&b>=d&&(A%d+b%d)>=d;if(i===13)return A%d>=b%d;if(i===14)return A%d<b%d;return true});
  row.insertAdjacentHTML('beforeend',examples(pool.slice(0,2),t=>E(expression(t)+' = ?'),steps));
 });
 const addSection=panel.querySelector('#mixedOperations-add'),subSection=panel.querySelector('#mixedOperations-subtract');
 addSection.querySelector('h2').textContent='Выделяем целое при сложении';addSection.dataset.nav='Выделение целого';addSection.classList.add('mx-stage-divider');
 subSection.querySelector('h2').textContent='Разменяем целое при вычитании';subSection.dataset.nav='Размен целого';subSection.classList.add('mx-stage-divider');
 [1,2,7].forEach(i=>addSection.append(plusRows[i]));[1,3,4,6].forEach(i=>subSection.append(minusRows[i]));
 plus.querySelector('h2').textContent='Сложение без выделения целого';plus.dataset.nav='Сначала: сложение';minus.querySelector('h2').textContent='Вычитание без размена';minus.dataset.nav='Сначала: вычитание';
 const intro=document.createElement('section');intro.id='mixedOperations-start';intro.dataset.nav='Начинаем';intro.innerHTML=`<span class="mx-stage-label">Сначала — без выделения и размена целого</span><h2>Целые — с целыми, доли — с долями</h2><div class="mx-join-row">${M.pies(15,7)}<b>+</b>${M.pies(10,7)}</div>${E(`${R(15,7)} + ${R(10,7)}`,`(2 + 1) + ${F('1 + 3',7)}`,R(25,7))}<p class="mx-beginner-note">Знаменатели одинаковые. Целые части складываем отдельно, дробные — отдельно.</p>`;
 panel.prepend(intro);intro.after(plus);plus.after(minus);
 const basic=B.calculations.filter(t=>{const {A,B:b,d,sign}=t.meta;return sign==='+'?A%d+b%d<d:A%d>=b%d});
 function balanced(rows,count=24){const groups=[...new Set(rows.map(t=>t.direction))].map(dir=>rows.filter(t=>t.direction===dir)),out=[];for(let i=0;out.length<count&&groups.some(g=>g.length>i);i++)for(const g of groups)if(g[i]&&out.length<count)out.push(g[i]);return out}
 const basicBank=['+','−'].flatMap(sign=>balanced(basic.filter(t=>t.meta.sign===sign)).map(t=>({...t,direction:sign==='+'?'add':'sub',skill:''})));
 const simple=document.createElement('section');simple.id='mixedOperations-basicPractice';simple.className='practice-panel';simple.dataset.nav='Первая практика';simple.innerHTML='<h2>Вычисли без выделения и размена целого</h2><div id="mxBasicModes"></div><div id="mxBasicDeck"></div>';minus.after(simple);
 typesMix(simple.querySelector('#mxBasicModes'),[['add','Сложение'],['sub','Вычитание']],basicBank,simple.querySelector('#mxBasicDeck'));
 simple.after(addSection);addSection.after(subSection);
 function advanced(section,sign,label){const tasks=B.calculations.filter(t=>{const {A,B:b,d}=t.meta;return t.meta.sign===sign&&(sign==='+'?A%d+b%d>=d:A%d<b%d)}).slice(0,24).map(t=>({...t,skill:''}));const box=document.createElement('div');box.className='practice-panel mx-mini-practice';box.innerHTML=`<h3>${label}</h3><div></div>`;section.append(box);typesPractice(box.lastElementChild,tasks)}
 advanced(addSection,'+','Собери новое целое: практика');advanced(subSection,'−','Разменяй целое: практика');
 // Keep the general practice after both later subtopics.
 panel.querySelector('#mixedOperations-practice h2').textContent='Все случаи: сложение, вычитание и микс';
 // Picture practice also starts with tasks that need neither carrying nor borrowing.
 typesPractice(document.getElementById('mixedOperations-modelsDeck'),basicBank.filter(t=>t.direction==='add').slice(0,12).concat(basicBank.filter(t=>t.direction==='sub').slice(0,12)).map(t=>({...t,q:'Вычисли по моделям.',visual:`<div class="mx-join-row"><div>${M.pies(t.meta.A,t.meta.d)}${E(R(t.meta.A,t.meta.d))}</div><b>${t.meta.sign}</b><div>${M.pies(t.meta.B,t.meta.d)}${E(R(t.meta.B,t.meta.d))}</div></div>`})));
 // Equal-denominator fraction cases: two unworked examples under every worked row.
 const fractionRows=[...document.querySelectorAll('#operations .op-rule-pair article'),...document.querySelectorAll('#operations-cases .op-case-row')];
 const specs=[[[1,2,7,'+'],[2,3,9,'+']],[[6,2,7,'-'],[8,3,9,'-']],[[1,3,7,'+'],[2,4,9,'+']],[[2,5,7,'+'],[5,4,9,'+']],[[5,4,7,'+'],[7,5,9,'+']],[[3,0,7,'+'],[5,0,9,'+']],[[6,2,7,'-'],[8,3,9,'-']],[[7,2,7,'-'],[9,4,9,'-']],[[4,4,7,'-'],[6,6,9,'-']],[[4,0,7,'-'],[6,0,9,'-']]];
 fractionRows.forEach((row,i)=>row.insertAdjacentHTML('beforeend',examples(specs[i],t=>`<div class="op-equation">${i===7?`1 − ${V.frac(t[1],t[2])}`:i===5||i===9?`${V.frac(t[0],t[2])} ${i===5?'+':'−'} 0`:V.expression(...t)} = ?</div>`,t=>(i===7?`<div class="op-equation">1 − ${V.frac(t[1],t[2])} = ${V.frac(t[2],t[2])} − ${V.frac(t[1],t[2])}</div>`:'')+V.equation(...t))));
 // Definitions of proper/improper fractions get the same short independent practice.
 document.querySelectorAll('#types-definition .type-rules article').forEach((row,i)=>row.insertAdjacentHTML('beforeend',examples(i?[[8,8],[11,8]]:[[3,8],[5,9]],([n,d])=>E(`${F(n,d)} — какая дробь?`),([n,d])=>`<p>${n} ${n<d?'меньше':n===d?'равно':'больше'} ${d}. Дробь ${n<d?'правильная':'неправильная'}.</p>`)));
 const parts=document.querySelector('#mixed-parts');parts.insertAdjacentHTML('afterbegin',`<div class="mx-part-zero">${E('4','4 + 0')}${E(F(3,7),`0 + ${F(3,7)}`)}<p>У натурального числа дробная часть — 0. У правильной дроби целая часть — 0.</p></div>`);parts.prepend(parts.querySelector('h2'));
 window.dispatchEvent(new Event('hashchange'));window.refreshFractionOutline?.();
})();
