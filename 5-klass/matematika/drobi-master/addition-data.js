/* Original practice, following Vilenkin §29 (pp.30–36), with no mixed-number operations. */
window.fractionOperationBanks=(()=>{
 const V=FractionOperations;
 const addCases=[[2,3,8],[3,5,8],[5,6,8],[0,4,7],[2,1,5],[4,3,7],[7,5,6],[1,1,4],[6,3,10],[5,5,5],[8,1,9],[3,4,6],[4,5,12],[7,4,11],[9,8,12],[2,2,3],[6,0,8],[4,9,15],[11,9,20],[13,5,25],[14,7,31],[17,12,35],[5,7,9],[18,3,10]];
 const subCases=[[7,3,8],[5,5,8],[8,3,8],[4,0,7],[3,1,5],[7,4,7],[12,5,6],[2,1,4],[9,6,10],[10,5,5],[9,8,9],[7,4,6],[9,4,12],[11,7,11],[17,8,12],[4,2,3],[6,0,8],[13,9,15],[20,11,20],[18,5,25],[21,7,31],[29,12,35],[12,7,9],[21,3,10]];
 const task=(a,b,d,op)=>({q:`<div class="task-expression">${V.expression(a,b,d,op)} = ?</div>`,kind:'fractionOrWhole',answer:[op==='+'?a+b:a-b,d],level:1,direction:op==='+'?'add':'subtract',operands:[a,b,d,op]});
 const add=addCases.map(p=>task(...p,'+')),subtract=subCases.map(p=>task(...p,'-'));
 const pictures=[...addCases.slice(0,12).map((p,i)=>({...task(...p,'+'),q:'Запиши результат сложения.',visual:V.picture(...p,'+',i%2?'bars':'pies')})),...subCases.slice(0,12).map((p,i)=>({...task(...p,'-'),q:'Запиши результат вычитания.',visual:V.picture(...p,'-',i%2?'pies':'bars')}))];
 // The question is about applying this lesson's rule directly, without changing denominators.
 const differentCases=[[1,1,2,3,'+'],[2,1,5,4,'+'],[3,2,8,7,'+'],[4,3,9,10,'+'],[1,3,6,8,'+'],[5,2,12,9,'+'],[3,1,4,5,'-'],[5,2,6,9,'-'],[4,1,7,8,'-'],[7,3,8,10,'-'],[5,2,9,11,'-'],[8,3,10,12,'-']];
 const eligibility=[...addCases.slice(0,6).map(([a,b,d])=>[a,b,d,d,'+']),...subCases.slice(0,6).map(([a,b,d])=>[a,b,d,d,'-']),...differentCases].map(([a,b,d,e,op])=>({q:`Можно сразу посчитать по правилу этой темы?<div class="task-expression">${V.frac(a,d)} <span>${op==='+'?'+':'−'}</span> ${V.frac(b,e,'b')}</div>`,kind:'eligibility',permitted:d===e,answer:d===e?[op==='+'?a+b:a-b,d]:null,level:1,operands:[a,b,d,e,op]}));
 const chains=Array.from({length:24},(_,i)=>{const d=[7,9,11,13,15,17,19,23][i%8],a=d-1,b=2+i%3,c=1+i%2,mode=i%4;const expression=mode===0?`${F(a,d)} + ${F(b,d)} − ${F(c,d)}`:mode===1?`${F(a,d)} − ${F(b,d)} + ${F(c,d)}`:mode===2?`${F(a,d)} − (${F(b,d)} + ${F(c,d)})`:`${F(a,d)} − (${F(b,d)} − ${F(c,d)})`;return {q:`<div class="task-expression">${expression}</div>`,kind:'fractionOrWhole',answer:[mode===0?a+b-c:mode===2?a-b-c:a-b+c,d],level:1,difficulty:mode<2?1:2,arithmetic:[a,b,c,d,mode]}});
 const gaps=[];
 for(let i=0;i<12;i++){
  const d=[9,11,13,15,17,19][i%6],a=2+i%3,b=a+2+i%4;let q,n,kind='fractionOrWhole';
  if(i%4===0){q=`x + ${F(a,d)} = ${F(b,d)}`;n=b-a}
  else if(i%4===1){q=`x − ${F(a,d)} = ${F(b,d)}`;n=a+b}
  else if(i%4===2){q=`${F(b,d)} − x = ${F(a,d)}`;n=b-a}
  else{q=`${F('□',d)} + ${F(a,d)} = ${F(b,d)}`;n=b-a;kind='number'}
  gaps.push({q:`${kind==='number'?'Найди пропущенный числитель.':'Найди x.'}<div class="task-expression">${q}</div>`,kind,answer:kind==='number'?n:[n,d],level:1});
 }
 for(let i=0;i<12;i++){
  const d=[11,13,17,19,23,29][i%6],a=6+i%3,b=3+i%2,c=1+i%2;let q,n,kind='fractionOrWhole';
  if(i%4===0){q=`x + ${F(a,d)} = ${F(b,d)} + ${F(a+c,d)}`;n=b+c}
  else if(i%4===1){q=`x − ${F(a,d)} = ${F(b,d)} − ${F(c,d)}`;n=a+b-c}
  else if(i%4===2){q=`${F(a,d)} − x = ${F(b,d)} − ${F(c,d)}`;n=a-b+c}
  else{q=`${F('□',d)} − ${F(a,d)} = ${F(b,d)} + ${F(c,d)}`;n=a+b+c;kind='number'}
  gaps.push({q:`${kind==='number'?'Найди пропущенный числитель.':'Найди x.'}<div class="task-expression">${q}</div>`,kind,answer:kind==='number'?n:[n,d],level:2});
 }
 const storyRows=[
  [`Для смеси взяли ${F(4,17)} кг орехов и ${F(7,17)} кг сухофруктов. Какова масса смеси в килограммах?`,[11,17],1,[4,7,17]],
  [`В кувшине было ${F(9,12)} л сока. Выпили ${F(4,12)} л. Сколько литров осталось?`,[5,12],1],
  [`Утром прошли ${F(5,18)} маршрута, днём — ещё ${F(7,18)} того же маршрута. Какую часть маршрута прошли?`,[12,18],1,[5,7,18]],
  [`Закрасили ${F(6,11)} плаката. Какая часть плаката осталась незакрашенной?`,[5,11],1],
  [`На зелёные флажки ушло ${F(7,15)} м ленты, на жёлтые — ${F(4,15)} м. На сколько метров больше ушло на зелёные?`,[3,15],1],
  [`Две клумбы занимают ${F(9,20)} участка. Первая занимает ${F(5,20)} участка. Какую часть участка занимает вторая?`,[4,20],1],
  [`За утро и день собрали ${F(8,14)} урожая. Какую часть урожая ещё нужно собрать?`,[6,14],1],
  [`Купили ${F(13,10)} кг крупы. Приготовили ${F(6,10)} кг. Сколько килограммов осталось?`,[7,10],1],
  [`От одной катушки отрезали ${F(8,9)} м шнура, от другой — ${F(5,9)} м. Какова общая длина отрезанных кусков в метрах?`,[13,9],1],
  [`На подносе было ${F(4,7)} пирога. Гости съели все эти кусочки. Сколько пирога осталось?`,[0,7],1],
  [`Первый ученик собрал ${F(4,13)} пазла, второй — оставшиеся ${F(9,13)}. Какую часть пазла они собрали вместе?`,[13,13],1,[4,9,13]],
  [`В первый день прочитали ${F(5,16)} книги, во второй — ещё ${F(8,16)}. Какую часть книги прочитали за два дня?`,[13,16],1,[5,8,16]],
  [`В первый день прочитали ${F(6,23)} книги, во второй — на ${F(2,23)} книги меньше. Какую часть книги прочитали за два дня?`,[10,23],2],
  [`Бак был заполнен на ${F(11,12)}. Из него израсходовали ${F(5,12)} вместимости и добавили ${F(3,12)} вместимости. Какая часть бака заполнена теперь?`,[9,12],2],
  [`В книге 96 страниц. В первый день прочитали ${F(3,16)} книги, во второй — ${F(5,16)}. Сколько страниц прочитали за два дня?`,48,2,[3,5,16]],
  [`Нужно перевезти 108 кг груза. Утром перевезли ${F(5,18)} груза, днём — ${F(7,18)}. Сколько килограммов осталось перевезти?`,36,2,[5,7,18]],
  [`Площадь сада 54 га. Яблони занимают ${F(2,9)} сада, груши — ${F(5,9)}. Сколько гектаров занимают яблони и груши вместе?`,42,2,[2,5,9]],
  [`Один ученик прочитал ${F(9,25)} книги, другой — ${F(14,25)} той же книги. Второй прочитал на 20 страниц больше. Сколько страниц в книге?`,100,2],
  [`За два дня прочитали ${F(8,15)} и ${F(4,15)} книги — всего 24 страницы. Сколько страниц в книге?`,30,2,[8,4,15]],
  [`Первая полоска длиной ${F(11,20)} м. Вторая на ${F(3,20)} м короче. Какова общая длина двух полосок в метрах?`,[19,20],2],
  [`Из 1 кг муки на печенье ушло ${F(5,14)} кг, а на булочки — ${F(4,14)} кг. Сколько килограммов муки осталось?`,[5,14],2,[5,4,14]],
  [`Длина маршрута 72 км. В первый день прошли ${F(7,24)}, во второй — ${F(9,24)} маршрута. Сколько километров осталось?`,24,2,[7,9,24]],
  [`Утром сделали ${F(5,18)} работы. К обеду было готово ${F(13,18)} всей работы, а вечером сделали ещё ${F(4,18)}. Какая часть работы выполнена за весь день?`,[17,18],2],
  [`Нужно решить 48 заданий. В первый день решили ${F(5,12)} всех заданий, во второй — ${F(3,12)}. Сколько заданий осталось?`,16,2,[5,3,12]]
 ];
 const stories=storyRows.map(([q,answer,level,scheme])=>({q,answer,level,kind:Array.isArray(answer)?'fractionOrWhole':'number',visual:scheme?V.storyScheme(...scheme):''}));
 const errors=Array.from({length:24},(_,i)=>{const d=[5,7,8,9,11,13,14,15,16,17,19,20,21,22,23,24,25,27,28,29,31,32,35,40][i],a=1+i%3,b=1+i%2,valid=FractionAudit.valid(i);let left,answer,wrong;
 if(i%4===0){left=`${F(a,d)} + ${F(b,d)}`;answer=[a+b,d];wrong=[a+b,2*d]}
 else if(i%4===1){left=`${F(a+b,d)} − ${F(b,d)}`;answer=[a,d];wrong=[a+2*b,d]}
 else if(i%4===2){left=`${F(a,d)} − ${F(a,d)}`;answer=[0,d];wrong=[1,d]}
 else{left=`${F(a,d)} + ${F(d-a,d)}`;answer=[d,d];wrong=[1,d]}
 return FractionAudit.task(left+' = '+F(...(valid?answer:wrong)),'fractionOrWhole',answer,valid,{level:1});
 });
 const review=[];
 [1,2].forEach(level=>{const take=(rows,skill)=>rows.slice(0,4).forEach(t=>review.push({...t,skill,level}));take(level===1?[...pictures.filter(t=>t.direction==='add'&&t.answer[0]<=t.answer[1]).slice(0,2),...pictures.filter(t=>t.direction==='subtract').slice(0,2)]:[...pictures.filter(t=>t.direction==='add'&&t.answer[0]>=t.answer[1]).slice(0,2),...pictures.filter(t=>t.direction==='subtract'&&t.operands[0]>=t.operands[2]).slice(0,2)],'По рисунку');take(level===1?[add[0],subtract[0],{...eligibility[1],skill:'По нашему правилу'},{...eligibility[12],skill:'По нашему правилу'}]:[add[14],subtract[14],{...eligibility[7],skill:'По нашему правилу'},{...eligibility[20],skill:'По нашему правилу'}],'Примеры');take(chains.filter(t=>t.difficulty===level),'Цепочки');take(gaps.filter(t=>t.level===level),'Пропуски');take(stories.filter(t=>t.level===level),'Задача');take(level===1?errors:errors.slice(12),'Проверь запись')});
 return {addCases,subCases,add,subtract,eligibility,pictures,chains,gaps,stories,errors,review};
})();
