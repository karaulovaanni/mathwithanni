(()=>{
const banks={types:[],comparison:[],operations:window.fractionOperationBanks?.review||[],mixed:window.MixedBanks.review,mixedOperations:window.MixedBanks.operationsReview};
const push=(topic,level,skill,task)=>banks[topic].push({...task,level,skill,instant:false});
const cmp=(a,b,c,d)=>a*d<c*b?'<':a*d===c*b?'=':'>';
function compareTask(a,b,c,d){return {q:`Сравни дроби.<div class="task-expression">${F(a,b)} <span class="sign-placeholder">?</span> ${F(c,d)}</div>`,kind:'compare',answer:cmp(a,b,c,d)}}
[1,2].forEach(level=>{
 const add=(skill,task)=>push('types',level,skill,task);
 const modelPairs=level===1?[[2,3],[4,4],[5,4]]:[[11,4],[13,6],[17,8]];
 modelPairs.forEach(([n,d])=>add('На рисунке',{q:'Запиши закрашенную часть дробью и определи её вид.',kind:'fraction',answer:[n,d],strict:true,requireKind:true,visual:reviewModel(n,d)}));
 if(level===1){
  [[3,8],[8,8]].forEach(([n,d])=>add('Вид дроби',{q:`Определи вид ${F(n,d)}.`,kind:'choice',answer:n<d?0:1,options:['Правильная','Неправильная']}));
  add('Сравнение с 1',{q:`Сравни ${F(9,5)} с 1.`,kind:'compare',answer:'>'});
 }else{
  add('Вид дроби',{q:`Какой наименьший натуральный числитель сделает ${F('□',9)} неправильной дробью?`,kind:'number',answer:9});
  add('Вид дроби',{q:`Какой наименьший натуральный знаменатель сделает ${F(12,'□')} правильной дробью?`,kind:'number',answer:13});
  add('Сравнение с 1',{q:`Какой наибольший натуральный числитель можно поставить в ${F('□',11)}, чтобы дробь была меньше 1?`,kind:'number',answer:10});
 }
 (level===1?[[1,2],[2,3],[5,4]]:[[9,4],[11,6],[13,5]]).forEach(([n,d])=>add('На прямой',{q:'Запиши координату точки и определи вид дроби.',kind:'fraction',answer:[n,d],strict:true,unitDen:d,requireKind:true,visual:reviewRay(n,d)}));
 if(level===1){
  [[3,7],[8,3]].forEach(([n,d])=>add('Деление и дробь',{q:`Запиши ${n} : ${d} дробью.`,kind:'fraction',answer:[n,d],strict:true}));
  [[5,6],[9,4]].forEach(([n,d])=>add('Деление и дробь',{q:`Запиши ${F(n,d)} делением.`,kind:'division',answer:[n,d]}));
 }else{
  add('Деление и дробь',{q:`Дополни запись: ${F('□',4)} = 3.`,kind:'number',answer:12});
  add('Деление и дробь',{q:`Дополни запись: ${F(15,'□')} = 3.`,kind:'number',answer:5});
  add('Деление и дробь',{q:'Запиши 17 : 8 дробью.',kind:'fraction',answer:[17,8],strict:true});
  add('Деление и дробь',{q:`Запиши ${F(25,6)} делением.`,kind:'division',answer:[25,6]});
 }
 if(level===1)[[1,7],[7,1]].forEach(([n,d])=>add('Число и дробь',{q:`Запиши ${n} дробью со знаменателем ${d}.`,kind:'fraction',answer:[n*d,d],strict:true}));
 else{add('Число и дробь',{q:`Дополни равенство: 7 = ${F(28,'□')}.`,kind:'number',answer:4});add('Число и дробь',{q:'Запиши 3 дробью со знаменателем 4.',kind:'fraction',answer:[12,4],strict:true})}
 const stories=level===1?[
  [`Планировали собрать 60 кг ягод, а собрали ${F(6,5)} плана. Сколько килограммов собрали?`,72,'number'],
  ['В одной коробке 6 карандашей. Взяли 17 карандашей. Запиши количество в долях одной коробки.',[17,6],'fraction'],
  [`Изготовили 84 детали — ${F(6,5)} нормы. Сколько деталей составляет норма?`,70,'number'],
  ['Один пирог разделён на 4 доли. Нужно 13 долей. Сколько целых пирогов надо приготовить?',4,'number']
 ]:[
  [`Планировали собрать 80 кг ягод, а собрали ${F(7,5)} плана. На сколько килограммов превысили план?`,32,'number'],
  [`В первый день прошли 18 км — ${F(3,2)} пути второго дня. Сколько километров прошли за два дня?`,30,'number'],
  [`Изготовили 96 деталей — ${F(8,5)} нормы. На сколько деталей превысили норму?`,36,'number'],
  ['Один пирог разделён на 6 долей. Нужно 19 долей. Приготовили минимальное число целых пирогов. Сколько долей останется?',5,'number']
 ];stories.forEach(([q,answer,kind])=>add('Задача',{q,answer,kind}));
 if(level===1){
  add('Исправь ошибку',{q:`«${F(6,6)} — правильная дробь». Выбери верное исправление.`,kind:'choice',answer:1,options:['Правильная, меньше 1','Неправильная, равна 1','Неправильная, больше 1']});
  add('Исправь ошибку',{q:`Ученик записал 8 : 3 как ${F(3,8)}. Запиши верную дробь.`,kind:'fraction',answer:[8,3],strict:true});
  add('По условию',{q:'Числитель 4. Знаменатель на 3 больше. Запиши дробь.',kind:'fraction',answer:[4,7],strict:true});
  add('По условию',{q:'Знаменатель 5. Числитель в 3 раза больше. Запиши дробь.',kind:'fraction',answer:[15,5],strict:true});
 }else{
  add('Исправь ошибку',{q:'«Каждая неправильная дробь больше 1». Какая дробь опровергает это утверждение?',kind:'choice',answer:1,options:[F(7,5),F(5,5),F(4,5)]});
  add('Исправь ошибку',{q:`Каждый из трёх пирогов разделили на 5 долей. Взяли 11 долей. Ученик записал ${F(11,15)} пирога. Запиши верную дробь.`,kind:'fraction',answer:[11,5],strict:true});
  add('По условию',{q:`Дробь ${F('n',5)} неправильная, а n меньше 8. Какое наибольшее натуральное n подходит?`,kind:'number',answer:7});
  add('По условию',{q:`Дробь ${F('n',9)} правильная, а n больше 6. Сколько натуральных значений n подходит?`,kind:'number',answer:2});
 }
 const chains=level===1?[[F(2,5),F(5,5),F(8,5)],[F(8,5),F(5,5),F(2,5)]]:[[F(5,6),F(4,3),F(3,2)],[F(4,3),F(5,6),F(3,2)]];
 add('Порядок дробей',{q:'Выбери цепочку по возрастанию.',kind:'choice',answer:0,options:chains.map(c=>c.join(' &lt; '))});
});
[1,2].forEach(level=>{
 const add=(skill,t)=>push('comparison',level,skill,t);
 const modelPairs=level===1?[[2,6,5,6],[2,3,2,6],[1,2,2,4],[3,5,3,8]]:[[3,4,4,6],[4,5,5,6],[5,8,3,4],[3,6,4,8]];
 modelPairs.forEach(([a,b,c,d])=>add('По рисунку',{q:'Сравни закрашенные части одинаковых лент: левую и правую.',kind:'compare',answer:cmp(a,b,c,d),visual:`<div class="mixer-pair">${reviewBars(a,b)}${reviewBars(c,d,'#daa9b8')}</div>`}));
 if(level===1){[[3,7,5,7],[6,9,4,9],[2,3,2,5],[3,8,3,4],[1,2,3,4],[2,3,4,6]].forEach(p=>add('Сравни дроби',compareTask(...p)))}
 else{
  add('Сравни дроби',{q:`Какой наибольший натуральный числитель подходит: ${F('□',9)} &lt; ${F(5,9)}?`,kind:'number',answer:4});
  add('Сравни дроби',{q:`Какой наименьший натуральный числитель подходит: ${F('□',11)} &gt; ${F(7,11)}?`,kind:'number',answer:8});
  [[5,8,5,7],[7,12,7,15],[5,6,7,9],[7,10,5,7]].forEach(p=>add('Сравни дроби',compareTask(...p)));
 }
 (level===1?[[1,4],[2,3]]:[[7,12],[5,8]]).forEach(([n,d])=>add('На прямой',{q:'Запиши координату отмеченной точки.',kind:'fraction',answer:[n,d],strict:true,unitDen:d,visual:reviewRay(n,d,1)}));
 const storyPairs=level===1?[[3,8,5,8],[2,3,2,5],[3,4,5,8],[4,6,2,3]]:[[3,5,5,6],[5,8,3,4],[7,10,4,5],[5,6,7,9]];
 storyPairs.forEach(([a,b,c,d],i)=>{
  if(level===1)add('Задача',{q:`Два одинаковых маршрута прошли на ${F(a,b)} и ${F(c,d)}. Сравни пройденные расстояния: первое и второе.`,kind:'compare',answer:cmp(a,b,c,d)});
  else{const whole1=[40,48,60,54][i],whole2=[36,40,45,36][i],count1=whole1*a/b,count2=whole2*c/d;add('Задача',{q:`В первой книге ${whole1} страниц, во второй ${whole2}. Прочитали ${F(a,b)} первой и ${F(c,d)} второй книги. В какой книге прочитали больше страниц?`,kind:'choice',answer:count1>count2?0:count1<count2?1:2,options:['В первой','Во второй','Поровну']})}
 });
 const errorPairs=level===1?[[2,7,5,7],[3,4,3,8],[1,2,2,4],[3,5,5,8]]:[[5,12,7,18],[4,9,3,7],[5,6,10,12],[7,8,6,7]];
 errorPairs.forEach(([a,b,c,d])=>{const correct=cmp(a,b,c,d),wrong=correct==='<'?'>':'<';add('Исправь ошибку',{q:`Исправь знак: ${F(a,b)} ${wrong==='<'?'&lt;':'&gt;'} ${F(c,d)}.`,kind:'compare',answer:correct})});
 if(level===1){[[2,3,12,4],[3,4,20,5],[5,6,18,3],[3,5,20,4]].forEach(([n,d,D,k])=>add('Домножение',{q:`На какое число нужно умножить и числитель, и знаменатель ${F(n,d)}, чтобы знаменатель стал ${D}?`,kind:'number',answer:k}))}
 else{[[3,4,5,6,12,1],[2,3,5,6,12,2],[1,5,7,10,10,5],[3,8,2,3,24,7]].forEach(([a,b,c,d,D,answer])=>add('Домножение',{q:`Приведи ${F(a,b)} и ${F(c,d)} к знаменателю ${D}. На сколько новый числитель второй дроби больше нового числителя первой?`,kind:'number',answer}))}
});
banks.types=banks.types.map((t,i)=>t.skill==='Исправь ошибку'?{...FractionAudit.types()[i%24],level:t.level,skill:'Проверь запись'}:t);
window.reviewBanks=banks;
const requested=new URLSearchParams(location.search).get('topic');const topic=['comparison','operations','mixed','mixedOperations'].includes(requested)?requested:'types';
$('#reviewTopic').textContent={types:'Правильные и неправильные дроби',comparison:'Сравнение дробей',operations:'Сложение и вычитание дробей',mixed:'Смешанные числа',mixedOperations:'Сложение и вычитание смешанных чисел'}[topic];
$('#reviewBack').href='index.html?v=nov23a#'+topic;
document.title='Всё ли усвоено? · '+$('#reviewTopic').textContent;
typesPractice($('#reviewDeck'),shuffleFractions(banks[topic]));
})();
