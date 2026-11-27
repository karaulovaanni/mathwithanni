'use strict';
const F=(a,b)=>`<span class="frac"><span>${a}</span><span>${b}</span></span>`;
const line=(a,b,cls='')=>`<path class="${cls}" d="M${a}L${b}"/>`;
const label=(p,t,dx=0,dy=0)=>`<text x="${p[0]+dx}" y="${p[1]+dy}" text-anchor="middle">${t}</text>`;
function seglabel(a,b,t,offset=15){let dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy);return label([(a[0]+b[0])/2+dy/d*offset,(a[1]+b[1])/2-dx/d*offset],t,0,4)}
function arc(a,b,c,t='',r=18){let u=Math.atan2(a[1]-b[1],a[0]-b[0]),v=Math.atan2(c[1]-b[1],c[0]-b[0]),d=(v-u+Math.PI*3)%(Math.PI*2)-Math.PI;let pts=Array.from({length:21},(_,i)=>[b[0]+r*Math.cos(u+d*i/20),b[1]+r*Math.sin(u+d*i/20)]);let mid=u+d/2;return `<path class="angle" d="M${pts.map(p=>p.join(',')).join('L')}"/>`+(t?label([b[0]+(r+15)*Math.cos(mid),b[1]+(r+15)*Math.sin(mid)],t,0,4):'')}
function right(a,b,c){let u=a.map((v,i)=>(v-b[i])/Math.hypot(a[0]-b[0],a[1]-b[1])*12),v=c.map((n,i)=>(n-b[i])/Math.hypot(c[0]-b[0],c[1]-b[1])*12);return `<path class="angle" d="M${b.map((n,i)=>n+u[i])}l${v}l${u.map(n=>-n)}"/>`}
function wrapSVG(body,desc='Геометрический чертёж'){return `<svg class="math-scene" viewBox="0 0 650 290" role="img" aria-label="${desc}">${body}</svg>`}
function polygon(p,names,side=[],angles=[]){let body=`<polygon points="${p.map(a=>a.join(',')).join(' ')}"/>`;const cen=[0,1].map(i=>p.reduce((s,a)=>s+a[i],0)/3);p.forEach((a,i)=>{let dx=a[0]-cen[0],dy=a[1]-cen[1],d=Math.hypot(dx,dy);body+=label(a,names[i],dx/d*19,dy/d*19+4)});[[0,1],[0,2],[1,2]].forEach(([i,j],k)=>{if(side[k]!=null){let a=p[i],b=p[j],mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,nx=b[1]-a[1],ny=a[0]-b[0];let offset=((mx-cen[0])*nx+(my-cen[1])*ny)>=0?18:-18;body+=seglabel(a,b,side[k],offset)}});angles.forEach((v,i)=>{if(v!=null)body+=arc(p[(i+1)%3],p[i],p[(i+2)%3],(typeof v==='number'?v+'°':v))});return body}
function ptsSides(s,x,y,size=130,rot=0,mirror=false){const [ab,ac,bc]=s,cx=(ab*ab+ac*ac-bc*bc)/(2*ab),cy=Math.sqrt(Math.max(0,ac*ac-cx*cx));let p=[[0,0],[ab,0],[cx,-cy]],cent=[p.reduce((a,b)=>a+b[0],0)/3,p.reduce((a,b)=>a+b[1],0)/3];let unit=size/Math.max(...s);let a=rot*Math.PI/180;return p.map(q=>{let xx=(q[0]-cent[0])*unit*(mirror?-1:1),yy=(q[1]-cent[1])*unit;return[x+xx*Math.cos(a)-yy*Math.sin(a),y+xx*Math.sin(a)+yy*Math.cos(a)]})}
function sidesAngles(A,B,size=6){let C=180-A-B;return[size,size*Math.sin(B*Math.PI/180)/Math.sin(C*Math.PI/180),size*Math.sin(A*Math.PI/180)/Math.sin(C*Math.PI/180)]}
function pairScene(cfg={}){let a=cfg.a||[3,4,5],b=cfg.b||a.map(x=>x*1.5),p=ptsSides(a,175,155,135,cfg.rot1||0),q=ptsSides(b,475,155,185,cfg.rot2||0,cfg.flip);return wrapSVG(`<g class="first">${polygon(p,'ABC',cfg.la||[],cfg.aa||[])}</g><g class="second">${polygon(q,'KLM',cfg.lb||[],cfg.ba||[])}</g>`)}
function nestedScene(o={}){let A=[100,48],B=[40,235],C=[335,235],t=o.t||.45,M=A.map((v,i)=>v+(B[i]-v)*t),N=A.map((v,i)=>v+(C[i]-v)*t);return wrapSVG(`<g>${polygon([A,B,C],'ABC')}${line(M,N,'parallel')}${label(M,'M',-17,0)}${label(N,'N',17,-2)}${label([395,70],o.parallel===false?'Параллельность не дана':'MN ∥ BC')}${(o.parts||[]).map(([key,t])=>{let pairs={AM:[A,M],MB:[M,B],AN:[A,N],NC:[N,C],MN:[M,N],BC:[B,C],AB:[A,B],AC:[A,C]};return seglabel(...pairs[key],t,key==='AN'||key==='NC'?-19:19)}).join('')}</g>`)}
function bowScene(o={}){let A=[110,45],B=[285,45],C=[60,245],D=[335,245],O=[197.5,122.78];return wrapSVG(`<g>${line(A,B,'parallel')}${line(C,D,'parallel')}${line(A,D)}${line(B,C)}${label(A,'A',-14,-10)}${label(B,'B',14,-10)}${label(C,'C',-15,15)}${label(D,'D',15,15)}${label(O,'O',18,0)}${label([490,65],o.parallel===false?'AB ∥ CD не дано':'AB ∥ CD')}${(o.parts||[]).map(([key,t])=>{let pairs={AO:[A,O],OD:[O,D],BO:[B,O],OC:[O,C],AB:[A,B],CD:[C,D]};return seglabel(...pairs[key],t,key==='BO'||key==='OC'?-17:17)}).join('')}</g>`)}
function interceptScene(o={}){let O=[60,240],vals=Object.fromEntries(o.parts||[]),ab=Number(vals.AB)||4,bc=Number(vals.BC)||6,oa=Number(vals.OA)||ab,total=oa+ab+bc,xs=[oa,oa+ab,total].map(v=>60+400*v/total),top=xs.map(x=>[x,240-(x-60)*205/400]),bottom=xs.map(x=>[x,240]);let names=['A','B','C'],low=['P','Q','R'];let body=line(O,[500,14])+line(O,[540,240])+label(O,'O',-18,14);top.forEach((a,i)=>{let b=bottom[i];if(o.broken&&i===1)b=[320,240];body+=line(a,b,'parallel')+label(a,names[i],-9,-14)+label(b,low[i],0,24)});let pairs={AB:[top[0],top[1]],BC:[top[1],top[2]],PQ:[bottom[0],bottom[1]],QR:[bottom[1],bottom[2]],OA:[O,top[0]],OP:[O,bottom[0]]};(o.parts||[]).forEach(([k,v])=>{body+=seglabel(...pairs[k],v,k==='PQ'||k==='QR'||k==='OP'?-18:17)});body+=label([325,22],o.broken?'Параллельность не дана':'AP ∥ BQ ∥ CR')+'';return wrapSVG(`<g>${body}</g>`)}
function orthoScene(){let A=[75,140],B=[75,230],E=[255,230],D=[360,230],C=[360,20];return wrapSVG(`<g>${line(A,B)}${line(B,D)}${line(D,C)}${line(A,E)}${line(E,C)}${right(A,B,E)}${right(E,D,C)}${right(A,E,C)}${label(A,'A',-18,0)}${label(B,'B',-16,17)}${label(E,'E',0,26)}${label(D,'D',17,17)}${label(C,'C',10,-12)}</g>`)}
function trapScene(){let A=[90,245],B=[145,55],C=[320,55],D=[415,245],O=[231,162]; // compute intersection accurately
 let t=(B[1]-A[1]+(D[1]-B[1])*(A[0]-B[0])/(D[0]-B[0]))/((C[1]-A[1])-(D[1]-B[1])*(C[0]-A[0])/(D[0]-B[0]));O=A.map((v,i)=>v+t*(C[i]-v));return wrapSVG(`<g>${line(A,B)}${line(B,C,'parallel')}${line(C,D)}${line(D,A,'parallel')}${line(A,C)}${line(B,D)}${[[A,'A',-16,15],[B,'B',-10,-14],[C,'C',10,-14],[D,'D',16,15],[O,'O',18,2]].map(([p,n,x,y])=>label(p,n,x,y)).join('')}${label([535,95],'AD ∥ BC')}</g>`)}
function proportionalLesson(){return card('Вспомним Фалеса',`<p>Параллельные прямые отсекают на одной стороне угла равные отрезки. Тогда на другой стороне отрезки тоже равны <b>между собой</b>.</p><div class="scene">${interceptScene({parts:[['AB','3'],['BC','3'],['PQ','5'],['QR','5']]})}</div><div class="big-equation">AB = BC &emsp; PQ = QR</div><p class="hint">Отрезки на разных сторонах угла не обязаны быть равны: здесь 3 ≠ 5.</p>`)+card('От равенства к отношению',`<p>Теперь объединим одинаковые части: две в первый отрезок, три — во второй. На другой стороне получатся такие же группы: две и три части.</p><div class="step-buttons"><button class="action" data-step="equal">Равные части</button><button class="action" data-step="groups">Группы 2 : 3</button><button class="action" data-step="whole">От вершины угла</button></div><div id="parts-model"></div><p id="parts-explain" class="big-equation"></p>`)+card('Теорема о пропорциональных отрезках',`<p class="theorem">Параллельные прямые, пересекающие стороны угла, отсекают на них пропорциональные отрезки.</p><div class="big-equation">${F('AB','BC')} = ${F('PQ','QR')}</div><p>Это <b>обобщённая теорема Фалеса</b>. Обычная теорема Фалеса получается, когда отношение равно 1: соседние отрезки на каждой стороне равны.</p><div class="proof-steps"><div><b>Условие</b>Есть параллельные прямые и две секущие.</div><div><b>Что сопоставляем</b>Отрезки между одними и теми же параллельными прямыми.</div><div><b>Что получаем</b>Равенство отношений, а не равенство всех длин.</div></div><p class="hint">Модель с общей мерой объясняет рациональные отношения. Для произвольных длин общее доказательство требует ещё предельного перехода или другого строгого обоснования.</p>`)+card('Теперь видим два треугольника',`<div class="scene">${nestedScene({parts:[['AM','3'],['MB','6'],['AN','5'],['NC','10']]})}</div><div class="big-equation">${F('AM','MB')} = ${F('AN','NC')} &emsp; ${F('3','6')} = ${F('5','10')}</div><p>Если сравнить отрезки от общей вершины A до параллельных прямых, получим:</p><div class="big-equation">${F('AM','AB')} = ${F('AN','AC')} = ${F('3','9')} = ${F('5','15')}</div><p>У △AMN и △ABC общий угол A. Углы при M и B, N и C равны при параллельных прямых. Поэтому треугольники подобны по двум углам. Позже это станет первым признаком подобия.</p><p class="hint">Отношение MN к BC появляется из подобия треугольников; его не подставляем вместо отношения отрезков секущих без обоснования.</p>`)+card('Как доказать параллельность?',`<p>Обратное утверждение удобно для точек на сторонах одного угла. Если M лежит на AB, N — на AC и</p><div class="big-equation">${F('AM','AB')} = ${F('AN','AC')},</div><p>то MN ∥ BC. Здесь важны общий угол, порядок точек и сравнение отрезков <b>от вершины</b>.</p><p>Одной красивой пропорции на произвольных пересекающихся прямых недостаточно. Сначала проверь расположение точек.</p>`)+taskCard({title:'Сначала составь отношение',level:1,svg:interceptScene({parts:[['AB','4'],['BC','10'],['PQ','6'],['QR','x']]}),text:'Найди QR. Выпиши пары соответствующих отрезков, составь пропорцию и объясни, где используется параллельность.'})+`<p class="source-note">По материалам <a href="https://obrazavr.ru/geometriya/8-klass-geometriya/podobnye-treugolniki/teorema-falesa-i-proporczionalnye-otrezki/delenie-otrezka-na-ravnye-chasti/" target="_blank" rel="noopener">Образавра</a>. Формулировки и модели адаптированы для занятия.</p>`}
function connectParts(){document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>drawParts(b.dataset.step));drawParts('equal')}
function drawParts(mode){
 const O=[65,226],end=[465,46],low=[565,226];
 const upper=[O],lower=[O];
 for(let i=1;i<=5;i++){upper.push(O.map((v,j)=>v+(end[j]-v)*i/5));lower.push(O.map((v,j)=>v+(low[j]-v)*i/5));}
 let body=line(O,end)+line(O,low)+label(O,'O',-18,17);
 for(let i=1;i<=5;i++){
  body+=line(upper[i],lower[i],'parallel')+label(upper[i],'A'+i,-5,-16)+label(lower[i],'B'+i,0,25);
  if(mode==='equal')body+=seglabel(upper[i-1],upper[i],'2',17)+seglabel(lower[i-1],lower[i],'3',-15);
 }
 if(mode!=='equal'){
  [[upper,'#5486ab'],[lower,'#5486ab']].forEach(([ps,col])=>{body+=`<path d="M${ps[0]}L${ps[2]}" style="stroke:${col};stroke-width:5;fill:none"/>`});
  const start=mode==='groups'?2:0;
  [[upper,'#aa6897'],[lower,'#aa6897']].forEach(([ps,col])=>{body+=`<path d="M${ps[start]}L${ps[5]}" style="stroke:${col};stroke-width:3;fill:none;stroke-dasharray:${mode==='whole'?'7 5':'none'}"/>`});
  body+=seglabel(upper[0],upper[2],'4',38)+seglabel(lower[0],lower[2],'6',-37);
  if(mode==='groups')body+=seglabel(upper[2],upper[5],'6',18)+seglabel(lower[2],lower[5],'9',-17);
  else body+=label([510,75],'OA5 = 10')+label([510,104],'OB5 = 15');
 }
 document.getElementById('parts-model').innerHTML=wrapSVG(`<g>${body}</g>`);
 document.getElementById('parts-explain').innerHTML=mode==='equal'?'Пять шагов по 2 сверху; пять шагов по 3 снизу.':mode==='groups'?`${F('OA2','A2A5')} = ${F('OB2','B2B5')} &emsp; ${F('4','6')} = ${F('6','9')} = ${F('2','3')}`:`${F('OA2','OA5')} = ${F('OB2','OB5')} &emsp; ${F('4','10')} = ${F('6','15')} = ${F('2','5')}`;
 document.querySelectorAll('[data-step]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.step===mode));
}
const diagramTasks=[
{title:'Соответствующие углы',level:1,svg:pairScene({a:[6,10,8],b:[9,15,12],la:['6',null,'8'],lb:['9',null,'x'],aa:['α','β'],ba:['α','β'],rot2:150}),text:'По отметкам на чертеже установи подобие. Найди x, если AB = 6, BC = 8, KL = 9, LM = x. Чертёж схематический.'},
{title:'Стороны и общий угол',level:1,svg:pairScene({a:[3,4,5],b:[6,8,10],la:['3','4','x'],lb:['6','8','10'],aa:[90],ba:[90],rot2:-60}),text:'Найди x. Назови признак подобия, сформулируй его и составь пропорцию.'},
{title:'Отрезки на секущих',level:1,svg:interceptScene({parts:[['AB','6'],['BC','9'],['PQ','8'],['QR','x']]}),text:'Найди QR и PR. Объясни, какие отрезки сравниваешь в пропорции.'},
{title:'Часть и целая сторона',level:2,svg:nestedScene({parts:[['AM','4'],['MB','6'],['AN','5'],['MN','x']]}),text:'Дано: MN ∥ BC, BC = 15 см. Найди AC, NC и MN. Сначала найди длину AB.'},
{title:'Диагонали трапеции',level:2,svg:trapScene(),text:'ABCD — трапеция, AD ∥ BC. BC = 12 см, AO : OC = 5 : 3. Диагонали пересекаются в O. Найди AD. Выпиши подобные треугольники в соответствующем порядке.'},
{title:'Два прямоугольных треугольника',level:2,svg:orthoScene(),text:'B, E, D лежат на одной прямой. AB ⟂ BD, CD ⟂ BD, AE ⟂ EC. AB = 4 см, BE = 8 см, ED = 5 см. Найди CD. Обоснуй, какие острые углы равны.'},
{title:'Отношение отрезков стороны',level:2,svg:nestedScene({parts:[['MN','21']]}),text:'MN ∥ BC, AB : AM = 9 : 2. Найди BC. Не перепутай AM и MB: в отношении названа длина всей стороны AB.'},
{title:'Площадь малого треугольника',level:2,svg:nestedScene({t:.5,parts:[['AM','5'],['MB','5']]}),text:'MN ∥ BC, AM = MB. Площадь △AMN равна 15 см². Найди площадь △ABC. Сначала определи отношение сходственных сторон.'},
{title:'Перекрёстная конфигурация',level:2,svg:bowScene({parts:[['AO','6'],['OD','9'],['AB','8'],['CD','x']]}),text:'Найди CD. Какие углы вертикальные? Какие равны при параллельных прямых? Составь пропорцию.'},
{title:'Докажи параллельность',level:2,svg:nestedScene({parallel:false,parts:[['AM','6'],['MB','9'],['AN','8'],['NC','12']]}),text:'M лежит на AB, N — на AC. Докажи, что MN ∥ BC. Выпиши отношения отрезков от вершины A.'},
{title:'Найди неизвестную часть',level:3,svg:interceptScene({parts:[['AB','4'],['BC','10'],['PQ','2x − 1'],['QR','4x + 3']]}),text:'Найди x. Составь уравнение по теореме о пропорциональных отрезках. Проверь, что найденные длины положительны.'},
{title:'Два неизвестных',level:3,svg:pairScene({a:[15,30,25],b:[3,6,5],la:['15','y','25'],lb:['x','6','5'],rot2:80,flip:true}),text:'Дано: △ABC ∼ △KLM. AB = 15, AC = y, BC = 25; KL = x, KM = 6, LM = 5. Найди x + y. Чертёж схематический.'},
{title:'Известен большой периметр',level:3,svg:nestedScene({parts:[['AM','3'],['MB','6']]}),text:'MN ∥ BC. Периметр △ABC равен 54 см. Найди периметр △AMN. Объясни, почему периметры относятся так же, как сходственные стороны.'},
{title:'Несколько параллельных прямых',level:3,svg:interceptScene({parts:[['OA','2'],['AB','3'],['BC','5'],['OP','6'],['PQ','x'],['QR','y']]}),text:'Найди x, y и OR. Запиши равенство трёх отношений соответствующих отрезков на секущих.'},
{title:'Найди нужные треугольники',level:3,svg:orthoScene(),text:'B, E, D лежат на одной прямой, AB ⟂ BD, CD ⟂ BD, AE ⟂ EC. AB = 3 см, ED = 6 см, CD = 12 см. Найди BE. Сначала запиши подобие в правильном порядке.'},
{title:'Отношение частей и отношение целых',level:3,svg:bowScene({parts:[['BO','8'],['OC','12']]}),text:'AB ∥ CD. AD = 25 см. Найди AO и OD. Объясни, почему нельзя сразу записать AO = 25 · 8 / 12.'}
];
[0,2,3,4,6,8,10,12,14,15].forEach((taskIndex,i)=>diagramTasks[taskIndex].textPracticeIndex=i);
function rhombusScene(){
 const A=[70,235],B=[190,27.15],C=[430,235],M=[142,110.29],K=[214,235],N=[286,110.29];
 return wrapSVG(`<g>${polygon([A,B,C],'ABC')}${line(M,N,'parallel')}${line(N,K,'parallel')}${label(M,'M',-20,0)}${label(N,'N',17,-5)}${label(K,'K',0,25)}${label([485,100],'AMNK — ромб')}</g>`);
}
function squareScene(){
 const A=[170,235],B=[170,45],C=[360,45],D=[360,235],K=[265,235],P=[233.33,171.67];
 return wrapSVG(`<g>${line(A,B)}${line(B,C)}${line(C,D)}${line(D,A)}${line(A,C)}${line(B,K)}${label(A,'A',-17,17)}${label(B,'B',-17,-10)}${label(C,'C',17,-10)}${label(D,'D',17,17)}${label(K,'K',0,25)}${label(P,'P',17,3)}${seglabel(C,D,'6',-18)}${label([493,100],'AK = KD')}</g>`);
}
function heightsScene(){
 const A=[80,235],B=[200,75],D=[380,235],C=[500,75],K=[B[0],235];
 const v=C.map((x,i)=>x-D[i]),t=B.reduce((z,x,i)=>z+(x-D[i])*v[i],0)/(v[0]*v[0]+v[1]*v[1]);const H=D.map((x,i)=>x+t*v[i]);
 return wrapSVG(`<g>${line(A,B)}${line(B,C)}${line(C,D)}${line(D,A)}${line(B,K)}${line(B,H)}${right(B,K,D)}${right(B,H,C)}${label(A,'A',-18,15)}${label(B,'B',-12,-17)}${label(C,'C',17,-12)}${label(D,'D',16,19)}${label(K,'K',0,25)}${label(H,'F',19,4)}${seglabel(B,K,'8',17)}${seglabel(B,H,'12',17)}</g>`);
}
function threeAngleScene(){
 return wrapSVG([[[56,56],'ABC',125],[[62,56],'KLM',325],[[62,62],'PQR',525]].map(([angles,n,x])=>`<g>${polygon(ptsSides(sidesAngles(...angles),x,155,120),n,[],angles)}</g>`).join(''));
}
diagramTasks.unshift(
 {title:'Составь все отношения сходственных сторон',level:1,svg:pairScene({rot2:110,flip:true}),text:'Дано: △ABC ∼ △KLM. Ничего не вычисляя, выпиши три пары сходственных сторон. Запиши равенство трёх отношений: в числителях — стороны △ABC, в знаменателях — стороны △KLM. Затем запиши обратные отношения. Объясни, почему отношения равны.'},
 {title:'Подставь числа в пропорцию',level:1,svg:pairScene({a:[3,4,5],b:[6,8,10],la:[3,4,5],lb:[6,8,10],rot2:-70}),text:'△ABC ∼ △KLM. Сначала запиши равенство отношений буквами, затем подставь длины. Составь две пропорции: для сторон AB и AC; для сторон AB и BC. Вычислять неизвестную сторону не требуется.'},
 {title:'Найди пару по углам',level:1,svg:threeAngleScene(),text:'Среди △ABC, △KLM и △PQR выбери подобную пару. Вычисли третьи углы и запиши соответствие вершин. Назови признак подобия.'},
 {title:'Отношение части к части и части к целому',level:1,svg:nestedScene({t:.4,parts:[['AM','4'],['MB','6'],['AN','8'],['NC','12']]}),text:'Запиши три пропорции: AM : MB = AN : …; AM : AB = AN : …; AM : AN = AB : …. Подставь числа, не смешивая отношения части к части и части к целому.'}
);
diagramTasks.push(
 {title:'Ромб внутри треугольника',level:3,svg:rhombusScene(),text:'В △ABC вписан ромб AMNK: M лежит на AB, N — на BC, K — на AC. AB = 4 см, AC = 6 см. Найди периметр ромба. Обозначь его сторону через x, вырази BM через x, найди подобные треугольники и составь пропорцию.'},
 {title:'Квадрат, диагональ и середина стороны',level:3,svg:squareScene(),text:'ABCD — квадрат со стороной 6 см. K — середина AD, P — точка пересечения BK и AC. Найди AP : PC и BP : PK. Затем найди BP. Укажи пары параллельных сторон и запиши подобие.'},
 {title:'Параллелограмм и две высоты',level:3,svg:heightsScene(),text:'ABCD — параллелограмм, BK ⟂ AD, BF ⟂ CD. BK = 8 см, BF = 12 см, периметр ABCD равен 50 см. Найди стороны параллелограмма и его площадь. Найди подобные прямоугольные треугольники и получи отношение сторон через отношение высот.'},
 {title:'Три равные части боковой стороны',level:3,svg:'',text:'В трапеции основания равны 7 см и 34 см. Боковую сторону разделили на три равные части. Через точки деления провели отрезки, параллельные основаниям, до второй боковой стороны. Построй чертёж и найди длины двух отрезков. Проведи вспомогательную прямую, чтобы применить теорему о пропорциональных отрезках.'},
 {title:'Отношение площадей и отношение отрезков',level:3,svg:nestedScene({parts:[['AM','x'],['MB','6']]}),text:'MN ∥ BC. Площади △AMN и △ABC относятся как 4 : 25. Найди AM, если MB = 6 см. Сначала найди отношение сходственных сторон, затем составь пропорцию, учитывая AB = AM + MB.'}
);
function taskCard(t,i=''){return `<section class="card drawing-task level-${t.level}"><div class="task-heading"><span class="level-label">Уровень ${t.level}</span><h3>${i?i+'. ':''}${t.title}</h3></div>${t.svg?`<div class="scene">${t.svg}</div>`:''}<p>${t.text}</p><p class="hint">Решение и обоснование запиши в тетради.</p></section>`}
function drawingPractice(){return `<div class="filter-row"><label>Сложность <select id="task-level"><option value="0">Все уровни</option><option value="1">1 · Начало</option><option value="2">2 · Применение</option><option value="3">3 · Несколько шагов</option></select></label></div><div id="drawing-bank"></div>`}
function drawTaskBank(level=0){let result='',j=0;diagramTasks.forEach((t,i)=>{if(level&&level!==t.level)return;result+=taskCard(t,++j);if(t.textPracticeIndex!=null){let old=practice[t.textPracticeIndex];result+=taskCard({title:'По условию: построй свой чертёж',level:t.level,text:old[1]},++j)}});document.getElementById('drawing-bank').innerHTML=result}
const gameTriangleCases=[
{title:'Поворот не меняет углы',svg:pairScene({a:sidesAngles(40,80),b:sidesAngles(40,80,9),aa:[40,80],ba:[40,80],rot2:120}),answer:'aa'},
{title:'Найди третий угол',svg:pairScene({a:sidesAngles(50,70),b:sidesAngles(50,70,8),aa:[50,70],ba:[50,null,60],rot2:-80,flip:true}),answer:'aa'},
{title:'Одна отмеченная пара',svg:pairScene({a:[5,5,5],b:[7,7,7],aa:[60],ba:[60],rot2:150}),answer:'missing'},
{title:'Проверь все отношения',svg:pairScene({a:[3,4,5],b:[6,8,10],la:[3,4,5],lb:[6,8,10],rot1:35,rot2:-110}),answer:'sss'},
{title:'Два совпадения ещё не всё',svg:pairScene({a:[3,4,5],b:[6,8,9],la:[3,4,5],lb:[6,8,9],rot2:65,flip:true}),answer:'no'},
{title:'Между какими сторонами угол?',svg:pairScene({a:[4,6,Math.sqrt(28)],b:[6,9,Math.sqrt(63)],la:[4,6,null],lb:[6,9,null],aa:[60],ba:[60],rot2:180}),answer:'sas'},
{title:'Угол между указанными сторонами',svg:pairScene({a:[4,6,Math.sqrt(28)],b:[6,12,Math.sqrt(108)],la:[4,6,null],lb:[6,12,null],aa:[60],ba:[60],rot2:70}),answer:'no'},
{title:'Две стороны, но без угла',svg:pairScene({a:[5,7,8],b:[10,14,18],la:[5,7,null],lb:[10,14,null],rot2:-120}),answer:'missing'},
{title:'Стороны в другом порядке',svg:pairScene({a:[5,6,7],b:[10,12,14],la:[5,6,7],lb:[10,12,14],rot1:70,rot2:200,flip:true}),answer:'sss'},
{title:'Вложенные треугольники',svg:nestedScene(),text:'Рассмотри △AMN и △ABC. Других данных нет.',answer:'aa'},
{title:'Общая вершина',svg:nestedScene({parallel:false,parts:[['AM','4'],['MB','6'],['AN','6'],['NC','9']]}),text:'Рассмотри △AMN и △ABC. Параллельность не дана; угол A общий.',answer:'sas'},
{title:'Перекрёстная конфигурация',svg:bowScene(),text:'Сравни △AOB и △DOC. Не забудь вертикальные углы.',answer:'aa'},
{title:'Только вертикальные углы',svg:bowScene({parallel:false}),text:'Сравни △AOB и △DOC. Параллельность и длины не заданы.',answer:'missing'},
{title:'Разные наборы углов',svg:pairScene({a:sidesAngles(40,60),b:sidesAngles(40,70,8),aa:[40,60],ba:[40,70],rot2:100}),answer:'no'},
{title:'Размер одинаковый — подобие возможно?',svg:pairScene({a:[5,7,8],b:[5,7,8],la:[5,7,8],lb:[5,7,8],rot2:-130,flip:true}),answer:'sss'},
{title:'Вне угла между сторонами',svg:pairScene({a:[6,4,6*Math.cos(Math.PI/6)+Math.sqrt(7)],b:[9,6,9*Math.cos(Math.PI/6)-Math.sqrt(15.75)],la:[6,4,null],lb:[9,6,null],aa:[null,30],ba:[null,30],rot2:90}),answer:'missing'}
];
const gameSegmentCases=[
{title:'Отрезки между параллельными',svg:interceptScene({parts:[['AB','4'],['BC','6'],['PQ','8'],['QR','12']]}),text:`Следует ли ${F('AB','BC')} = ${F('PQ','QR')} из условий теоремы?`,answer:'direct'},
{title:'Равные шаги',svg:interceptScene({parts:[['AB','3'],['BC','3'],['PQ','5'],['QR','x']]}),text:'Можно ли заключить, что QR = 5?',answer:'direct'},
{title:'Не дано параллельности',svg:interceptScene({broken:true,parts:[['AB','4'],['BC','6'],['PQ','8']]}),text:`Доказано ли ${F('AB','BC')} = ${F('PQ','QR')}?`,answer:'missing'},
{title:'Перепутали порядок',svg:interceptScene({parts:[['AB','4'],['BC','6'],['PQ','8'],['QR','12']]}),text:`Верна ли запись ${F('AB','BC')} = ${F('QR','PQ')}?`,answer:'no'},
{title:'Равенство на разных лучах',svg:interceptScene({parts:[['AB','3'],['BC','3'],['PQ','5'],['QR','5']]}),text:'Следует ли из теоремы Фалеса, что AB = PQ?',answer:'no'},
{title:'Часть к части',svg:nestedScene(),text:`Верно ли ${F('AM','MB')} = ${F('AN','NC')}?`,answer:'direct'},
{title:'Часть к целому',svg:nestedScene(),text:`Верно ли ${F('AM','AB')} = ${F('AN','AC')}?`,answer:'direct'},
{title:'Разные типы отношений',svg:nestedScene({parts:[['AM','4'],['MB','6'],['AN','6'],['NC','9']]}),text:`Верно ли ${F('AM','MB')} = ${F('AN','AC')}?`,answer:'no'},
{title:'Обратная теорема',svg:nestedScene({parallel:false,parts:[['AM','4'],['MB','6'],['AN','6'],['NC','9']]}),text:'Можно ли доказать, что MN ∥ BC? M лежит на AB, N — на AC.',answer:'converse'},
{title:'Одного отношения мало',svg:nestedScene({parallel:false,parts:[['AM','4'],['MB','6'],['AN','6']]}),text:'Можно ли доказать, что MN ∥ BC? Длина NC неизвестна.',answer:'missing'},
{title:'Пропорция не выполняется',svg:nestedScene({parallel:false,parts:[['AM','4'],['MB','6'],['AN','6'],['NC','8']]}),text:'Могут ли MN и BC быть параллельны при указанных длинах?',answer:'no'},
{title:'От вершины, а не от случайной точки',svg:interceptScene({parts:[['OA','2'],['AB','3'],['BC','5'],['OP','6'],['PQ','9'],['QR','15']]}),text:`Верно ли ${F('OA','OB')} = ${F('OP','OQ')}?`,answer:'direct'}
];
intros[6]='Выбери сложность. Решай по готовым чертежам и по текстовым условиям: назови признак, запиши пропорцию и обоснуй каждый шаг.';
let gameMode='triangles',gameOrder=[],gamePos=0;
function gamesContent(){return `<div class="tabs"><button class="action" id="game-triangles">Подобие треугольников · 16 ситуаций</button><button class="action" id="game-segments">Пропорциональные отрезки · 12 ситуаций</button></div><section class="card trainer"><div id="game-stage"></div></section>`}
function startGame(mode,shuffle=false){
 gameMode=mode;document.getElementById('game-triangles')?.setAttribute('aria-pressed',mode==='triangles');document.getElementById('game-segments')?.setAttribute('aria-pressed',mode==='segments');
 gameOrder=Array.from({length:(mode==='triangles'?gameTriangleCases:gameSegmentCases).length},(_,i)=>i);
 if(shuffle)for(let i=gameOrder.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[gameOrder[i],gameOrder[j]]=[gameOrder[j],gameOrder[i]]}
 gamePos=0;drawGame();
}
function drawGame(){
 const bank=gameMode==='triangles'?gameTriangleCases:gameSegmentCases,q=bank[gameOrder[gamePos]],host=document.getElementById('game-stage');
 host.innerHTML=`<div class="oral-controls"><button class="action" id="prev-game">Предыдущая ситуация</button><label>Ситуация <select id="game-select" aria-label="Номер ситуации">${gameOrder.map((_,i)=>`<option value="${i}" ${i===gamePos?'selected':''}>${i+1} из ${gameOrder.length}</option>`).join('')}</select></label><button class="action primary" id="next-game">Следующая ситуация</button><button class="action" id="shuffle-game">Перемешать</button></div><h3>${q.title}</h3><p>${q.text||(gameMode==='triangles'?'Можно ли доказать подобие △ABC и △KLM по отмеченным данным? Назови признак и объясни его условия. Если данных недостаточно, скажи, чего не хватает.':'Объясни, применима ли теорема по данным чертежа.')}</p><div class="scene">${q.svg}</div><p class="hint">Обсудите устно. Используйте подписи и условия, а не измерения или внешнее сходство.</p>`;
 document.getElementById('prev-game').onclick=()=>{gamePos=(gamePos-1+gameOrder.length)%gameOrder.length;drawGame()};
 document.getElementById('next-game').onclick=()=>{gamePos=(gamePos+1)%gameOrder.length;drawGame()};
 document.getElementById('game-select').onchange=e=>{gamePos=Number(e.target.value);drawGame()};
 document.getElementById('shuffle-game').onclick=()=>startGame(gameMode,true);
}
const priorContent=content;
content=function(i){let body=priorContent(i);if(i===0)body=card('От Фалеса к подобию',`<p>Равные отрезки — частный случай пропорциональных. На вкладке «Пропорциональные отрезки» вспомним Фалеса и увидим, как параллельная прямая выделяет подобный треугольник.</p><button class="action" onclick="location.hash='segments'">Открыть пропорциональные отрезки</button>`)+body;if(i===6)body=drawingPractice();return body};
const priorRender=render;
function appendNavigation(){const first=document.createElement('button');first.textContent='Фалес и пропорциональные отрезки';first.onclick=()=>location.hash='segments';nav.prepend(first);const last=document.createElement('button');last.textContent='Мини-игры · Найди обоснование';last.onclick=()=>location.hash='games';nav.append(last);nav.querySelectorAll('button').forEach(b=>{if(b.textContent.includes('Практикум'))b.textContent='Задачи по чертежам и условию'});if(location.hash==='#segments')first.className='active';if(location.hash==='#games')last.className='active'}
render=function(){const key=location.hash.slice(1);if(key==='segments'||key==='games'){if(typeof geoApi!=='undefined'&&geoApi){geoApi.remove();geoApi=null;}nav.innerHTML=names.map((n,i)=>`<button onclick="go(${i})">${n}</button>`).join('');appendNavigation();main.innerHTML=`<div class="kicker">Геометрия · 8 класс</div><h2>${key==='segments'?'От Фалеса к подобным треугольникам':'Найди признак и объясни'}</h2>${key==='segments'?proportionalLesson():gamesContent()}`;if(key==='segments')connectParts();else{document.getElementById('game-triangles').onclick=()=>startGame('triangles');document.getElementById('game-segments').onclick=()=>startGame('segments');startGame('triangles')}}else{priorRender();appendNavigation();if(page===6){document.getElementById('task-level').onchange=e=>drawTaskBank(+e.target.value);drawTaskBank()}}};
// The practicum's existing text questions are retained, interleaved with diagrams.
chooseTask=function(i){const host=document.getElementById('problem');if(host)host.innerHTML=exercise(practice[i])};
if(!location.hash)history.replaceState(null,'','#segments');
render();
