/* Arrow keys change the task in the trainer being used. */
(()=>{
 const containers='.focused-trainer,.types-trainer,.practice-deck,.mixed-deck,.mini-trainer,.common-practice,#types-game';
 let active=null;
 function remember(e){const el=e.target.closest?.(containers);if(el)active=el}
 document.addEventListener('pointerdown',remember);document.addEventListener('focusin',remember);
 document.addEventListener('keydown',e=>{
  if(e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey||!['ArrowLeft','ArrowRight'].includes(e.key))return;
  if(e.target.closest?.('textarea,[contenteditable="true"],input[type="range"],select,[role="tablist"]'))return;
  let host=e.target.closest?.(containers)||active;
  if(!host?.isConnected||host.closest('[hidden]'))host=null;
  if(!host){const candidates=[...document.querySelectorAll(containers)].filter(el=>!el.closest('[hidden]'));host=candidates.filter(el=>{const r=el.getBoundingClientRect();return r.height>0&&r.top<innerHeight*.8&&r.bottom>innerHeight*.2}).sort((a,b)=>Math.abs(a.getBoundingClientRect().top-innerHeight*.3)-Math.abs(b.getBoundingClientRect().top-innerHeight*.3))[0]}
  if(!host)return;
  const step=e.key==='ArrowRight'?1:-1;
  const numbers=[...host.querySelectorAll('.focus-numbers button,.deck-numbers button,.numbers button,#practiceNumbers button')];
  const current=numbers.findIndex(b=>['step','true'].includes(b.getAttribute('aria-current'))||b.classList.contains('active'));
  if(current>=0){e.preventDefault();active=host;const next=numbers[current+step];if(next){next.click();const focused=host.querySelector('[aria-current="step"],[aria-current="true"],.numbers .active');focused?.focus({preventScroll:true})}return}
  const button=host.querySelector(step>0?'.mixed-next,.deck-next,.focus-next,#practiceNext,#typeGameNext':'.mixed-prev,.deck-prev,.focus-prev,#practicePrev,#typeGamePrev');
  if(button){e.preventDefault();active=host;if(!button.disabled)button.click()}
 });
})();
