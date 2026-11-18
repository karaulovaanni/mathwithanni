/* MathLive fraction prompts, with ordinary numeric fields during library loading. */
window.fractionMathInput=function(container){
 const fallback=container.querySelector('.frac');
 let field=null;
 function integerPrompt(name){const v=field.getPromptValue(name).trim();return /^\d+$/.test(v)?v:''}
 const read=()=>field?['numerator','denominator'].map(integerPrompt):[...container.querySelectorAll('input')].map(x=>x.value.trim());
 customElements.whenDefined('math-field').then(()=>{
  if(!container.isConnected||!fallback)return;
  const previous=[...fallback.querySelectorAll('input')].map(x=>x.value.trim());
  const mf=document.createElement('math-field');mf.setAttribute('aria-label','Ответ дробью: числитель и знаменатель');mf.setAttribute('readonly','');mf.className='fraction-mathfield';
  mf.value=String.raw`\frac{\placeholder[numerator]{${previous[0]}}}{\placeholder[denominator]{${previous[1]}}}`;
  container.append(mf);fallback.style.display='none';field=mf;
 });
 return {read};
};
