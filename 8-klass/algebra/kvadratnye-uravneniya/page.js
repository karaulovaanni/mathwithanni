(() => {
'use strict';
function expression(s){return RootMath.math(s.replace(/D_1/g,'d').replace(/D/g,'z').replace(/x_1/g,'r').replace(/x_2/g,'s')).replace(/<mi>r<\/mi>/g,'<msub><mi>x</mi><mn>1</mn></msub>').replace(/<mi>s<\/mi>/g,'<msub><mi>x</mi><mn>2</mn></msub>').replace(/<mi>d<\/mi>/g,'<msub><mi>D</mi><mn>1</mn></msub>').replace(/<mi>z<\/mi>/g,'<mi>D</mi>');}
document.querySelectorAll('[data-formula]').forEach(el=>{el.innerHTML=el.dataset.formula.split('=').map(expression).join(' <span class="equals">=</span> ');});
const range=document.getElementById('cRange'), graph=document.getElementById('graph');
function draw(){const c=Number(range.value),D=16-4*c; document.getElementById('cOut').textContent=c;
const X=x=>60+(x+2)*72,Y=y=>390-(y+6)*23;let s='';
for(let x=-2;x<=6;x++)s+=`<path d="M${X(x)},22 V390" stroke="#e9e4ef"/><text x="${X(x)}" y="${Y(0)+22}" text-anchor="middle" font-size="13">${x}</text>`;
for(let y=-6;y<=10;y+=2)s+=`<path d="M60,${Y(y)} H636" stroke="#e9e4ef"/><text x="${X(0)-12}" y="${Y(y)+4}" text-anchor="end" font-size="13">${y}</text>`;
s+=`<path d="M60,${Y(0)} H650 M${X(0)},400 V15" stroke="#72647e" stroke-width="2"/><text x="653" y="${Y(0)-9}">x</text><text x="${X(0)+9}" y="18">y</text>`;
let path='';for(let x=-2;x<=6;x+=.025){const y=x*x-4*x+c;path+=(path?'L':'M')+X(x)+','+Y(y);}
s+=`<defs><clipPath id="plotClip"><rect x="60" y="22" width="576" height="368"/></clipPath></defs><path d="${path}" clip-path="url(#plotClip)" fill="none" stroke="#9470b8" stroke-width="4"/>`;
const fmt=x=>Number(x.toFixed(2)).toString().replace('.',',');let result=`D = ${D}. `;
if(D>=0){const roots=D===0?[2]:[2-Math.sqrt(D)/2,2+Math.sqrt(D)/2];for(const r of roots)s+=`<circle cx="${X(r)}" cy="${Y(0)}" r="6" fill="#df8f76"/>`;result+=D===0?'Одна точка касания: x = 2. Один различный корень.':`Две точки пересечения: x ≈ ${fmt(roots[0])} и x ≈ ${fmt(roots[1])}.`;}else result+='Пересечений с осью Ox нет. Действительных корней нет.';
graph.innerHTML=`<svg viewBox="0 0 700 420" role="img" aria-label="Парабола y равен x в квадрате минус 4x плюс c; корни отмечены на оси x">${s}</svg>`;document.getElementById('graphResult').textContent=result;
}range.addEventListener('input',draw);draw();
document.getElementById('printLesson')?.addEventListener('click',()=>window.print());
})();
