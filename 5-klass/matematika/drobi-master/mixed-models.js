/* A whole always has the same size. Exact integer counts of equal pieces. */
window.MixedModels=(()=>{
 const C={whole:'#9274b7',part:'#d78aa6',den:'#397e88',empty:'#f3eef5'};
 const frac=(n,d)=>`<span class="frac mx-frac"><span style="color:${C.part}">${n}</span><span style="color:${C.den}">${d}</span></span>`;
 const whole=w=>`<strong class="mx-whole">${w}</strong>`;
 const mixed=(w,n,d)=>n?`<span class="mx-number">${w?whole(w):''}${frac(n,d)}</span>`:whole(w);
 const from=(n,d)=>mixed(Math.floor(n/d),n%d,d);
 const eq=(...parts)=>`<div class="mx-equation">${parts.join('<span class="mx-equals">=</span>')}</div>`;
 function wedge(i,d,r=56){const a=-Math.PI/2+2*Math.PI*i/d,b=a+2*Math.PI/d;return `M0 0L${r*Math.cos(a)} ${r*Math.sin(a)}A${r} ${r} 0 ${2*Math.PI/d>Math.PI?1:0} 1 ${r*Math.cos(b)} ${r*Math.sin(b)}Z`}
 function pies(n,d,shape='pies',opts={}){
  const count=Math.max(1,Math.ceil(n/d)),buttons=opts.interactive;
  return `<div class="mx-models">${Array.from({length:count},(_,j)=>{
   const filled=Math.max(0,Math.min(d,n-j*d));
   const pieces=Array.from({length:d},(_,i)=>{
    const k=j*d+i,removed=(opts.removed||[]).includes(k),fill=i<filled?(j<Math.floor(n/d)?C.whole:C.part):C.empty;
    const attr=buttons&&i<filled?`data-mx-piece="${k}" role="button" tabindex="0" aria-pressed="${removed}" aria-label="${removed?'Вернуть':'Убрать'} долю ${k+1}"`:'';
    const path=shape==='pies'?`<path d="${wedge(i,d)}" fill="${removed?C.empty:fill}" stroke="#fff9ef" stroke-width="2"/>`:`<rect x="${8+i*120/d}" y="27" width="${120/d}" height="74" rx="2" fill="${removed?C.empty:fill}" stroke="white" stroke-width="2"/>`;
    return `<g ${attr} class="${removed?'mx-removed':''}">${path}</g>`;
   }).join('');
   return `<svg viewBox="0 0 136 136" role="${buttons?'group':'img'}" aria-label="${filled} из ${d} долей одного целого">${shape==='pies'?'<g transform="translate(68 66)"><circle r="61" fill="#f9dfb7" stroke="#c9a67f" stroke-width="2"/>'+pieces+'</g>':pieces}</svg>`;
  }).join('')}</div>`;
 }
 function ray(n,d,units=4,interactive=false,ghost=false){
  const x=k=>54+900*k/(units*d);let body=`<path d="M54 90H970l-12 -7m12 7l-12 7" stroke="#80718e" fill="none" stroke-width="2"/>`;
  for(let k=0;k<=units*d;k++)body+=`<g ${interactive?`data-mx-tick="${k}" tabindex="0" role="button" aria-label="${k} долей по одной ${d}-й"`:''}><rect x="${x(k)-10}" y="50" width="20" height="75" fill="transparent"/><path d="M${x(k)} ${k%d?81:73}V${k%d?99:107}" stroke="#80718e" stroke-width="${k%d?1.5:3}"/>${k%d?'':`<text x="${x(k)}" y="142" text-anchor="middle">${k/d}</text>`}</g>`;
  if(!ghost&&n!==null)body+=`<circle cx="${x(n)}" cy="65" r="8" fill="${C.part}"/><path d="M${x(n)} 73V90" stroke="${C.part}" stroke-width="3"/>`;
  return `<svg class="mx-ray" viewBox="0 0 1010 170" role="${interactive?'group':'img'}" aria-label="Числовая прямая от нуля до ${units}; единица разделена на ${d} равных частей">${body}</svg>`;
 }
 function strip(n,d,color=C.part,label=''){
  const units=Math.max(1,Math.ceil(n/d)),width=600/units;
  let body='';for(let k=0;k<units*d;k++)body+=`<rect x="${10+k*width/d}" y="18" width="${width/d}" height="44" fill="${k<n?color:C.empty}" stroke="white" stroke-width="2"/>`;
  return `<svg class="mx-strip" viewBox="0 0 620 85" role="img" aria-label="${label||n+' долей со знаменателем '+d}">${body}<text x="310" y="81" text-anchor="middle">${label}</text></svg>`;
 }
 return {C,frac,whole,mixed,from,eq,pies,ray,strip};
})();
