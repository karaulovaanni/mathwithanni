'use strict';

// Each side keeps the same colour in both triangles.
const colours = ['#547fa9', '#a45e88', '#5e9076'];
function triangleTile(sides, letters, mode = 'sides', angles = [], caption = '') {
  const [ab, ac, bc] = sides;
  const cx = (ab * ab + ac * ac - bc * bc) / (2 * ab);
  const cy = Math.sqrt(Math.max(0, ac * ac - cx * cx));
  const unit = 140 / Math.max(ab, ac, cy);
  const points = [[48, 171], [48 + ab * unit, 171], [48 + cx * unit, 171 - cy * unit]];
  const edges = [[0,1,ab],[0,2,ac],[1,2,bc]];
  const path = points.map(p => p.join(',')).join(' ');
  const labels = points.map(([x,y], i) => '<text x="' + (x + (i === 0 ? -14 : i === 1 ? 12 : 0)) + '" y="' + (y + (i === 2 ? -13 : 22)) + '" text-anchor="middle">' + letters[i] + '</text>').join('');
  const lines = edges.map(([a,b,length], i) => {
    const p = points[a], q = points[b];
    const dx = q[0] - p[0], dy = q[1] - p[1];
    const midX = (p[0] + q[0]) / 2, midY = (p[1] + q[1]) / 2;
    const offsetX = i === 0 ? 0 : i === 1 ? -16 : 17;
    const offsetY = i === 0 ? 24 : -5;
    const label = mode === 'sides' || (mode === 'sas' && i < 2)
      ? '<text x="' + (midX + offsetX) + '" y="' + (midY + offsetY) + '" text-anchor="middle" paint-order="stroke" stroke="#fff" stroke-width="5">' + ru(length) + '</text>' : '';
    return '<path d="M' + p.join(' ') + 'L' + q.join(' ') + '" stroke="' + colours[i] + '" stroke-width="3.5"/>' + label;
  }).join('');
  const angleMarks = angles.map((angle, i) => {
    if (angle === null) return '';
    const p = points[i];
    const neighbours = points.filter((_, j) => j !== i);
    const start = neighbours[0].map((v,j) => p[j] + (v - p[j]) * 18 / Math.hypot(neighbours[0][0]-p[0],neighbours[0][1]-p[1]));
    const end = neighbours[1].map((v,j) => p[j] + (v - p[j]) * 18 / Math.hypot(neighbours[1][0]-p[0],neighbours[1][1]-p[1]));
    const centre = [(start[0]+end[0])/2-p[0],(start[1]+end[1])/2-p[1]];
    const factor = 38 / Math.hypot(...centre);
    return '<path d="M' + start.join(' ') + 'Q' + p.join(' ') + ' ' + end.join(' ') + '" fill="none" stroke="' + colours[i] + '" stroke-width="2"/><text x="' + (p[0]+centre[0]*factor) + '" y="' + (p[1]+centre[1]*factor) + '" text-anchor="middle" font-size="12">' + angle + '°</text>';
  }).join('');
  return '<div class="tri-tile"><svg viewBox="0 0 260 225" role="img" aria-label="Треугольник ' + letters + '. ' + caption + '"><polygon points="' + path + '" fill="#c8dced" fill-opacity=".45"/>' + lines + angleMarks + labels + '</svg><div class="data">' + caption + '</div></div>';
}

const oldContent = content;
lab = function(area = false) {
  return '<section class="card visual-lab"><h3>' + (area ? 'Почему площадь меняется в k² раз?' : 'Увеличь, поверни, сравни') + '</h3><p>Синий треугольник — оригинал. Розовый — его подобная копия. Меняй размер и поворот копии.</p><div class="lab-grid"><div class="board"><svg id="drawing" viewBox="0 0 650 300" role="img" aria-label="Исходный треугольник и его подобная копия"></svg></div><div class="lab-panel"><label for="scale">Коэффициент от ABC к DEF <output id="scaleValue"></output></label><input type="range" id="scale" min=".5" max="2" step=".25" value="1.5"><label for="rotation">Поворот копии <output id="rotationValue">0°</output></label><input id="rotation" type="range" min="-90" max="90" step="15" value="0"><div class="controls"><button class="action" id="overlay" aria-pressed="false">Наложить вершины A и D</button></div><p class="hint">Поворот и перенос сохраняют длины и углы. Масштаб меняет все длины в одно и то же число раз.</p></div></div><div id="lab-readouts" class="readouts"></div><p id="measure" class="formula"></p></section>';
};
let overlay = false;
draw = function() {
  const input = document.getElementById('scale');
  if (!input) return;
  const k = Number(input.value), rotation = Number(document.getElementById('rotation').value);
  const triangle = (x,y,s,angle,fill,letters) => '<g transform="translate(' + x + ' ' + y + ') rotate(' + angle + ')"><path d="M0 0L' + 72*s + ' 0L0 ' + -54*s + 'Z" fill="' + fill + '" fill-opacity=".28" stroke="' + fill + '" stroke-width="3"/><path d="M12 0V-12H0" fill="none" stroke="' + fill + '" stroke-width="2"/><g fill="#27304a" font-size="16" font-family="Nunito,sans-serif"><text x="-20" y="18">' + letters[0] + '</text><text x="' + (72*s+7) + '" y="15">' + letters[1] + '</text><text x="-9" y="' + (-54*s-10) + '">' + letters[2] + '</text><text x="' + 28*s + '" y="23">' + ru(4*s) + '</text><text x="-29" y="' + -22*s + '">' + ru(3*s) + '</text><text x="' + 38*s + '" y="' + -30*s + '">' + ru(5*s) + '</text></g></g>';
  document.getElementById('drawing').innerHTML = triangle(120,195,1,0,'#547fa9','ABC') + triangle(overlay?120:400,195,k,rotation,'#b46e99','DEF');
  document.getElementById('scaleValue').textContent = 'k = ' + ru(k);
  document.getElementById('rotationValue').textContent = rotation + '°';
  document.getElementById('measure').textContent = 'DE / AB = DF / AC = EF / BC = ' + ru(k);
  document.getElementById('lab-readouts').innerHTML = '<div>Соответственные стороны<b>× ' + ru(k) + '</b>3 → ' + ru(3*k) + ' · 4 → ' + ru(4*k) + '</div><div>Периметр<b>12 → ' + ru(12*k) + '</b>Увеличился в ' + ru(k) + ' раза</div><div>Площадь<b>6 → ' + ru(6*k*k) + '</b>Множитель k² = ' + ru(k*k) + '</div>';
};
function connectLab() {
  for (const id of ['scale','rotation']) document.getElementById(id)?.addEventListener('input',draw);
  document.getElementById('overlay')?.addEventListener('click',event=>{
    overlay=!overlay;event.target.setAttribute('aria-pressed',overlay);draw();
  });
}

const cases = [
  {kind:0, a:[5,5,5],b:[8,8,8], aa:[60,60], ba:[60,60], mode:'angles',yes:true,reason:'Две пары углов равны: 60° = 60° и 60° = 60°. Применим первый признак.'},
  {kind:0, a:[5,5,5],b:[5,5,5], aa:[60,null],ba:[60,null],mode:'angles',yes:false,reason:'Отмечена только одна пара равных углов. Для первого признака нужны две пары. По внешнему виду чертежа вывод делать нельзя.'},
  {kind:1,a:[4,6,Math.sqrt(28)],b:[6,9,Math.sqrt(63)],aa:[60],ba:[60],mode:'sas',yes:true,reason:'6/4 = 9/6 = 1,5. Углы 60° между указанными сторонами равны. Применим второй признак.'},
  {kind:1,a:[4,6,Math.sqrt(28)],b:[6,12,Math.sqrt(108)],aa:[60],ba:[60],mode:'sas',yes:false,reason:'6/4 = 1,5, а 12/6 = 2. Отношения выбранных сторон различаются.'},
  {kind:2,a:[3,4,5],b:[6,8,10],aa:[],ba:[],mode:'sides',yes:true,reason:'6/3 = 8/4 = 10/5 = 2. Все три пары сторон пропорциональны. Применим третий признак.'},
  {kind:2,a:[3,4,5],b:[6,8,9],aa:[],ba:[],mode:'sides',yes:false,reason:'6/3 = 8/4 = 2, но 9/5 = 1,8. Для третьего признака должны совпасть все три отношения.'}
];
let signCase = 0;
function renderCase(index) {
  signCase=index;
  const c=cases[index], box=document.getElementById('visual-question');
  box.innerHTML='<p class="question-count">Пара ' + (index%2+1) + ' из 2</p><h3>Достаточно ли отмеченных данных для подобия?</h3><p>Используй только подписи и отметки. Назови признак и объясни свой выбор.</p><div class="pair-model">' + triangleTile(c.a,'ABC',c.mode,c.aa,c.mode==='angles'?'Отмеченные углы △ABC':'Данные △ABC')+triangleTile(c.b,'DEF',c.mode,c.ba,c.mode==='angles'?'Отмеченные углы △DEF':'Данные △DEF')+'</div><div class="row"><button class="action primary" data-choice="yes">Да, подобие доказано</button><button class="action" data-choice="no">Данных недостаточно</button><button class="action" id="another-pair">Другая пара</button></div><p class="feedback" role="status"></p>';
  box.querySelectorAll('[data-choice]').forEach(button=>button.addEventListener('click',()=>{
    const correct=(button.dataset.choice==='yes')===c.yes;
    box.querySelector('.feedback').textContent=(correct?'Верно. ':'Проверь ещё раз. ')+ (correct?c.reason:'Сопоставь отмеченные данные с условиями выбранного признака.');
  }));
  box.querySelector('#another-pair').onclick=()=>renderCase(index%2===0?index+1:index-1);
}
showSign = function(index) {
  const examples=[
    [cases[0], '∠A = ∠D, ∠B = ∠E ⇒ △ABC ∼ △DEF. Третий угол равен 180° − 60° − 60° = 60°.'],
    [cases[2], 'DE/AB = 6/4 = 1,5 и DF/AC = 9/6 = 1,5. Общий для этих сторон угол в каждом треугольнике равен 60°.'],
    [cases[4], 'DE/AB = 6/3 = 2, DF/AC = 8/4 = 2, EF/BC = 10/5 = 2.']
  ];
  const [c, explanation]=examples[index];
  document.getElementById('sign').innerHTML=controls(signs,index,'showSign')+'<h3 style="margin-top:20px">'+signs[index]+'</h3><p>'+theory[index]+'</p><div class="pair-model">'+triangleTile(c.a,'ABC',c.mode,c.aa,'Первый треугольник')+triangleTile(c.b,'DEF',c.mode,c.ba,'Второй треугольник')+'</div>'+note(explanation)+'<div class="trainer card" id="visual-question"></div>';
  renderCase(index*2);
};

content = function(index) {
  if(index===0) return lab()+card('Что означает подобие?','<p><b>Подобные треугольники имеют одинаковую форму.</b> Их соответственные углы равны, а соответственные стороны пропорциональны. Размер и положение на плоскости могут различаться.</p><div class="proof-steps"><div><b>Уменьшение</b>0 &lt; k &lt; 1. Все стороны копии короче.</div><div><b>Тот же размер</b>k = 1. Подобные треугольники равны.</div><div><b>Увеличение</b>k &gt; 1. Все стороны копии длиннее.</div></div>')+quiz('Что сохраняется при изменении масштаба?',['Длины сторон','Величины углов','Площадь'],1,'Углы одинаковы, а стороны умножаются на k.')+geoSection();
  if(index===2) return card('Порядок букв задаёт соответствие','<p class="formula">△ABC ∼ △FDE</p><div class="pair-model">'+triangleTile([3,4,5],'ABC','sides',[],'AB = 3, AC = 4, BC = 5')+triangleTile([6,8,10],'FDE','sides',[],'FD = 6, FE = 8, DE = 10')+'</div><div class="proof-steps"><div><b>A ↔ F</b>AB ↔ FD</div><div><b>B ↔ D</b>BC ↔ DE</div><div><b>C ↔ E</b>AC ↔ FE</div></div>'+note('От ABC к FDE: k = FD/AB = DE/BC = FE/AC = 2. В обратном направлении коэффициент равен 1/2.'))+exercise(['Найди сторону','△ABC ∼ △FDE. AB = 8 см, FD = 12 см, AC = 10 см. Найди FE.','15','k = FD/AB = 12/8 = 1,5. FE = 10 · 1,5 = 15 см.']);
  if(index===4) return oldContent(index)+card('Проведи три опыта','<ol class="experiment-questions"><li>Поставь k = 2. Сравни периметры и площади. Почему множители различаются?</li><li>Поставь k = 0,5. Во сколько раз уменьшились стороны? А площадь?</li><li>Поверни копию. Изменились ли периметр и площадь?</li></ol>')+details('Разбор опыта','При k = 2 периметр увеличился в 2 раза, площадь — в 4. При k = 0,5 стороны уменьшились в 2 раза, площадь — в 4. Поворот сохраняет длины и площади.');
  return oldContent(index);
};
function geoSection() {
  return '<section class="card"><h3>Построй свой пример в GeoGebra</h3><p>Нажми «Открыть лабораторию». Перетаскивай A, B и C. Синий треугольник меняет форму, розовая копия остаётся ему подобной. Ползунок k управляет размером копии.</p><button class="action primary" id="load-geo">Открыть лабораторию GeoGebra</button><p class="geo-status" role="status" id="geo-status"></p><div id="geogebra" class="geo-host" hidden></div><details><summary>Что исследовать</summary><ol><li>Измени положение вершины C. Сравни два треугольника.</li><li>Установи k = 2, затем k = 0,5. Что меняется?</li><li>Можно ли при k = 1 получить равные треугольники?</li></ol></details></section>';
}
function connectGeo() {
  const button=document.getElementById('load-geo');
  if(!button)return;
  button.onclick=()=>{
    button.disabled=true;
    const status=document.getElementById('geo-status');
    status.textContent='Загружается GeoGebra…';
    const start=()=>{
      if(!document.getElementById('geogebra'))return;
      const host=document.getElementById('geogebra');host.hidden=false;
      const applet=new GGBApplet({appName:'geometry',width:1000,height:470,scaleContainerClass:'geo-host',showToolBar:false,showMenuBar:false,showAlgebraInput:false,enableShiftDragZoom:false,appletOnLoad(api){
        api.evalCommand('A=(0,0)\nB=(4,0)\nC=(1,3)\nk=Slider(0.5,2,0.25,1,160,false,true,false,false)\nO=(6,0)\nD=O+k*A\nE=O+k*B\nF=O+k*C\nt1=Polygon(A,B,C)\nt2=Polygon(D,E,F)');
        api.setValue('k',1.5);api.setVisible('O',false);
        api.setColor('t1',84,127,169);api.setColor('t2',180,110,153);
        api.setFilling('t1',.25);api.setFilling('t2',.25);
        api.setCoordSystem(-2,16,-2,8);
        status.textContent='Лаборатория готова. Двигай синие вершины и ползунок k.';
        button.hidden=true;
      }},true);applet.inject('geogebra');
    };
    if(window.GGBApplet){start();return;}
    const script=document.createElement('script');script.src='https://www.geogebra.org/apps/deployggb.js';script.onload=start;script.onerror=()=>{status.textContent='GeoGebra не загрузилась. Проверь соединение и попробуй снова. SVG-лаборатория выше работает независимо.';button.disabled=false;};document.head.append(script);
  };
}
const baseRender=render;
render=function(){overlay=false;baseRender();connectLab();connectGeo();};
render();
