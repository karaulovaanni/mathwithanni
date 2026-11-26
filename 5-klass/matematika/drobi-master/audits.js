/* A check may already be correct. Decide first; correct only when necessary. */
window.FractionAudit={
 valid:i=>[1,4,5,9,12,14,17,20,21,23].includes(i%24),
 task:(statement,kind,answer,auditValid,extra={})=>({q:`Проверь запись. Если есть ошибка, исправь.<div class="task-expression audit-statement">${statement}</div>`,kind,answer,audit:true,auditValid,...extra}),
 types(){return Array.from({length:24},(_,i)=>{
  const d=[4,5,7,8,9,11][i%6],n=[d-1,d,d+2][i%3],valid=this.valid(i),correct=n<d?'Правильная':'Неправильная';
  if(i%4===0)return this.task(`${F(n,d)} — ${valid?correct:correct==='Правильная'?'Неправильная':'Правильная'} дробь`,'choice',n<d?0:1,valid,{options:['Правильная','Неправильная']});
  if(i%4===1){const sign=n<d?'<':n===d?'=':'>';return this.task(`${F(n,d)} ${valid?(sign==='<'?'&lt;':sign==='>'?'&gt;':'='):(sign==='<'?'&gt;':'&lt;')} 1`,'compare',sign,valid)}
  if(i%4===2)return this.task(`${n} : ${d} = ${F(valid?n:n===d?n+1:d,valid?d:n===d?d:n)}`,'fraction',[n,d],valid,{strict:true});
  return this.task(`Правильных дробей с натуральным числителем и знаменателем ${d}: ${valid?d-1:d}`,'number',d-1,valid);
 })}
};
