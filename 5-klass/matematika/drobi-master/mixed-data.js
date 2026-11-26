/* Banks use integer counts of denominator-sized pieces; no floating-point answers. */
window.MixedBanks=(()=>{
 const M=MixedModels,{frac:F,mixed:S,from:R,whole:W,eq:E}=M;
 const task=(q,n,d,extra={})=>({q,kind:'mixed',answer:[n,d],...extra});
 const specimens=Array.from({length:24},(_,i)=>{const d=[3,4,5,6,8,10][i%6],w=1+Math.floor(i/6),n=1+(i*3+1)%(d-1);return{w,n,d,N:w*d+n}});
 const pictures=specimens.map(({w,n,d,N},i)=>task('Запиши закрашенное количество смешанным числом.',N,d,{visual:M.pies(N,d,i%3===1?'bars':'pies'),strict:true}));
 const parts=specimens.map(({w,n,d},i)=>i%2?{q:`Запиши дробную часть числа.${E(S(w,n,d))}`,kind:'fractionOrWhole',answer:[n,d],strict:true}:{q:`Назови целую часть числа.${E(S(w,n,d))}`,kind:'number',answer:w});
 parts[0]={q:`Назови дробную часть числа.${E(W(4))}`,kind:'number',answer:0};
 parts[3]={q:`Назови целую часть числа.${E(F(3,7))}`,kind:'number',answer:0};
 parts[4]={q:`Назови дробную часть числа.${E(W(6))}`,kind:'number',answer:0};
 const toMixed=specimens.map(({N,d},i)=>task(`Выдели целую часть.${E(F(i%8===7?N-N%d:N,d))}`,i%8===7?N-N%d:N,d));
 const toFraction=specimens.map(({w,n,d,N})=>({q:`Запиши неправильной дробью.${E(S(w,n,d))}`,kind:'fraction',answer:[N,d],strict:true}));
 const line=specimens.map(({w,n,d,N},i)=>task('Запиши координату точки смешанным числом.',N,d,{strict:true,visual:M.ray(N,d,Math.max(3,w+1))}));
 const units=['л','кг','м','км'];
 function story(i,op=false){
  const {w,n,d,N}=specimens[i],level=i<12?1:2,u=units[i%4],other=d+1+(i%2);
  if(op){const A=(w+2)*d+n,B=d+(i%2?d-1:1),add=i%3===0,answer=add?A+B:A-B;
   const contexts=[`В кувшине было ${R(A,d)} л сока. Долили ещё ${R(B,d)} л. Сколько литров сока стало?`,`От ленты длиной ${R(A,d)} м отрезали ${R(B,d)} м. Сколько метров осталось?`,`За день прошли ${R(A,d)} км, из них до привала ${R(B,d)} км. Сколько километров прошли после привала?`,`Для подарков было ${R(A,d)} кг орехов. Докупили ${R(B,d)} кг. Сколько килограммов орехов стало?`,`В сосуде было ${R(A,d)} л воды. Отлили ${R(B,d)} л. Сколько литров осталось?`,`Кусок ткани имел длину ${R(A,d)} м. На костюм ушло ${R(B,d)} м. Какова длина остатка?`];
   if(level===2){const C=1+i%2;const text=[`В первый день прошли ${R(A,d)} км, во второй — ${R(B,d)} км. Из всего пути ${C} км прошли по мосту. Сколько километров прошли вне моста?`,`Для подарков приготовили ${R(A,d)} м ленты, затем добавили ${R(B,d)} м. На одну коробку ушло ${C} м. Сколько метров ленты осталось?`,`В канистре было ${R(A,d)} л воды. Долили ${R(B,d)} л, затем отлили ${C} л. Сколько литров осталось?`,`Собрали ${R(A,d)} кг ягод утром и ${R(B,d)} кг вечером. Для варенья взяли ${C} кг. Сколько килограммов ягод осталось?`][i%4];return task(text,A+B-C*d,d,{level,skill:'Задача',visual:storyIcon(i)})}
   return task(contexts[i%6],answer,d,{level,skill:'Задача',visual:storyIcon(i)});
  }
  const qs=[`В ${N} одинаковых бутылочках по ${F(1,d)} л воды. Сколько всего литров воды? Запиши смешанным числом.`,`Ленту разрезали на ${N} кусочков по ${F(1,d)} м. Какова общая длина ленты в метрах?`,`В коробке ${N} порций по ${F(1,d)} кг. Какова масса всех порций в килограммах?`,`На ${d} одинаковых костюмов поровну израсходовали ${N} м ткани. Сколько метров ткани ушло на один костюм?`,`На ${d} дней поровну распределили ${N} л воды. Сколько литров приходится на один день?`,`Из ${N} одинаковых долек собрали пироги. В целом пироге ${d} долек. Сколько пирогов получилось, считая неполный?`,`Маршрут состоит из ${N} участков по ${F(1,d)} км. Какова длина маршрута в километрах?`,`За ${d} одинаковых пакетов крупы заплатили ${N} условных единиц. Какова цена одного пакета?`];
  if(level===2){const k=2+i%3;if(i%3===0)return {q:`В баке ${S(w,n,d)} л воды. Сколько мерок по ${F(1,d)} л можно наполнить?`,kind:'number',answer:N,level,skill:'Задача',visual:storyIcon(i)};if(i%3===1)return {q:`Лента длиной ${S(w,n,d)} м состоит из кусочков по ${F(1,d)} м. Сколько таких кусочков?`,kind:'number',answer:N,level,skill:'Задача',visual:storyIcon(i)};return task(`В ${k} полных коробках по ${d} одинаковых пакетиков. Рядом ещё ${n} таких пакетиков. Каждый пакетик содержит ${F(1,d)} кг. Сколько всего килограммов?`,k*d+n,d,{level,skill:'Задача',visual:storyIcon(i)})}
  return task(qs[i%8],N,d,{level,skill:'Задача',visual:storyIcon(i)});
 }
 function storyIcon(i){return `<div class="mx-story-icon"><svg viewBox="0 0 460 90" role="img" aria-label="${i%2?'Лента из равных частей':'Сосуды с водой'}">${i%2?Array.from({length:8},(_,j)=>`<rect x="${35+j*48}" y="28" width="46" height="38" rx="4" fill="${j%2?'#dba1b6':'#b8a2d0'}"/>`).join(''):Array.from({length:4},(_,j)=>`<g transform="translate(${65+j*90} 0)"><path d="M-11 9h22v16l10 10v42h-42V35l10-10Z" fill="#edf5f6" stroke="#8cb6be" stroke-width="2"/><path d="M-19 45h38v30h-38Z" fill="#a8ced4"/><rect x="-13" y="5" width="26" height="8" rx="2" fill="#9a83b9"/></g>`).join('')}</svg></div>`}
 const stories=specimens.map((_,i)=>story(i));
 const errors=specimens.map(({w,n,d,N},i)=>{const valid=FractionAudit.valid(i);return i%2===0?FractionAudit.task(`${F(N,d)} = ${S(valid?w:w+1,n,d)}`,'mixed',[N,d],valid):FractionAudit.task(`${S(w,n,d)} = ${F(valid?N:w+n,d)}`,'fraction',[N,d],valid,{strict:true})});
 const categories=[['add','Без перехода через целое'],['carry','Выделяем целое'],['sub','Без размена'],['borrow','Разменяем целое'],['plusNatural','С натуральным: +'],['minusNatural','С натуральным: −'],['naturalMinus','Натуральное − смешанное'],['naturalFraction','Натуральное − дробь'],['plusFraction','Прибавляем дробь'],['minusFraction','Вычитаем дробь'],['wholeResult','Получается целое'],['zero','Получается ноль'],['naturalPlusFraction','Натуральное + дробь']];
 const calculations=[];
 categories.forEach(([direction,label],c)=>{for(let i=0;i<24;i++){
  const d=[3,4,5,6,8,10][i%6],w=2+Math.floor(i/6),v=1+i%2,a=1+i%(d-1),b=1+(i+1)%(d-1);let A=w*d+a,B=v*d+b,sign='+',result;
  if(direction==='add'){A=w*d+1;B=v*d+1}
  if(direction==='carry'){A=w*d+d-1;B=v*d+d-1}
  if(direction==='sub'){sign='−';A=(w+1)*d+d-1;B=v*d+1}
  if(direction==='borrow'){sign='−';A=(w+2)*d+1;B=v*d+d-1}
  if(direction==='plusNatural'){B=v*d;if(i%2)[A,B]=[B,A]}
  if(direction==='naturalPlusFraction'){A=w*d;B=a;if(i%2)[A,B]=[B,A]}
  if(direction==='minusNatural'){sign='−';B=v*d}
  if(direction==='naturalMinus'){sign='−';A=(w+2)*d;B=v*d+a}
  if(direction==='naturalFraction'){sign='−';A=w*d;B=a}
  if(direction==='plusFraction'){B=b;if(i%2)[A,B]=[B,A]}
  if(direction==='minusFraction'){sign='−';A=w*d+(i%2?1:d-1);B=i%2?d-1:1}
  if(direction==='wholeResult'){if(i%2){sign='−';A=(w+2)*d+a;B=v*d+a}else{A=w*d+a;B=v*d+(d-a)}}
  if(direction==='zero'){sign='−';B=A}
  result=sign==='+'?A+B:A-B;
  calculations.push(task(`Вычисли.${E(R(A,d)+(sign==='+'?' + ':' − ')+R(B,d))}`,result,d,{direction,skill:label,meta:{A,B,d,sign,result}}));
 }});
 const opStories=specimens.map((_,i)=>story(i,true));
 const opErrors=Array.from({length:24},(_,i)=>{const t=calculations[(i%12)*24+i],{A,B,d,sign,result}=t.meta,valid=FractionAudit.valid(i),wrong=i%3===0?R(result+d,d):i%3===1?F(result||1,d+1):R(result+2*d,d);return FractionAudit.task(`${R(A,d)} ${sign} ${R(B,d)} = ${valid?R(result,d):wrong}`,'mixed',[result,d],valid,{skill:'Проверь запись'})});
 const chains=Array.from({length:24},(_,i)=>{const d=[3,4,5,6,8,10][i%6],A=(3+Math.floor(i/6))*d+1,B=d+d-1,C=d+2;return task(`Вычисли по порядку.${E(`${R(A,d)} + ${R(B,d)} − ${R(C,d)}`)}`,A+B-C,d,{skill:'Два действия',meta:{A,B,C,d,result:A+B-C}})});
 const gaps=Array.from({length:24},(_,i)=>{const d=3+i%6,w=2+Math.floor(i/6),a=1+i%(d-1);return i%2?{q:`Какой числитель пропущен после размена целого?${E(S(w,a,d),`${w-1} + ${F('□',d)}`)}`,kind:'number',answer:d+a}:{q:`Сколько целых получится из дробной части?${E(`${w} + ${F(d+a,d)}`,`${w} + □ + ${F(a,d)}`)}`,kind:'number',answer:1}});
 function review(level,ops){
  const candidates=ops?[...calculations.filter((t,i)=>i%24===(level===1?0:13)&&t.direction!=='naturalPlusFraction'),...gaps.slice(level===1?0:12,level===1?6:18),...opStories.filter(t=>t.level===level).slice(0,3),...opErrors.slice(level===1?0:12,level===1?3:15)]:[...pictures.slice(0,3),...parts.slice(0,3),...line.slice(0,3),...toMixed.slice(0,4),...toFraction.slice(0,4),...stories.filter(t=>t.level===level).slice(0,4),...errors.slice(0,3)];
  if(!ops&&level===2){return candidates.map((t,i)=>{if(i<3){const {w,n,d,N}=specimens[12+i];return {...task(`К закрашенной части добавили ещё один целый пирог. Сколько стало?`,N+d,d),visual:M.pies(N,d),level,skill:'Модель'}}if(i>=3&&i<6){const {w,n,d,N}=specimens[12+i];return{q:`Какая неправильная дробь равна числу ${S(w,n,d)}?`,kind:'fraction',answer:[N,d],strict:true,level,skill:'Перевод'}}if(i>=6&&i<9){const {w,n,d,N}=specimens[12+i];return task('Точка сдвинулась вправо на одно деление. Запиши её новую координату.',N+1,d,{visual:M.ray(N,d,w+2),level,skill:'Прямая'})}return {...t,level}})}
  if(ops&&level===2)return candidates.map((t,i)=>{if(t.meta){const {A,B,d,sign,result}=t.meta;return task(`Найди пропущенное число.${E(`${R(A,d)} ${sign==='+'?'+':'−'} □`,R(result,d))}`,B,d,{level,skill:t.skill})}return {...t,level}});
  return candidates.map(t=>({...t,level}));
 }
 return {specimens,pictures,parts,toMixed,toFraction,line,stories,errors,categories,calculations,opStories,opErrors,gaps,chains,review:[...review(1,false),...review(2,false)],operationsReview:[...review(1,true),...review(2,true)]};
})();
