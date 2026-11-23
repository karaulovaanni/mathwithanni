/* Small expression grammar: arithmetic, powers and square roots; no eval. */
(() => {
'use strict';
function parse(source){
 const s=String(source).trim().replace(/,/g,'.').replace(/[−–]/g,'-').replace(/[×·]/g,'*').replace(/²/g,'^2').replace(/³/g,'^3').replace(/\s+/g,'');
 const tokens=s.match(/sqrt|\d+(?:\.\d+)?|[a-z]|[√()+\-*/^]/g)||[];
 if(tokens.join('')!==s||tokens.length>160)throw Error('Запиши выражение числами, знаками действий и корнями.');
 let i=0;const peek=()=>tokens[i],take=()=>tokens[i++];
 function atom(){let t=take();if(t===undefined)throw Error('Закончи выражение.');if(/^\d/.test(t))return {t:'n',v:Number(t)};if(t==='sqrt'||t==='√'){let a;if(peek()==='('){take();a=add();if(take()!==')')throw Error('Проверь скобки.');}else a=power();return {t:'sqrt',a};}if(t==='('){const a=add();if(take()!==')')throw Error('Проверь скобки.');return {t:'par',a};}if(/^[a-z]$/.test(t))return {t:'v',v:t};throw Error('Проверь запись выражения.');}
 function power(){let a=atom();if(peek()==='^'){take();a={t:'pow',a,b:unary()};}return a;}
 function unary(){if(peek()==='-'||peek()==='+'){const op=take();return {t:'sign',op,a:unary()};}return power();}
 function mul(){let a=unary();while(i<tokens.length){let op=peek(),implicit=false;if(op==='*'||op==='/')take();else if(op==='('||op==='sqrt'||op==='√'||/^\d|^[a-z]$/.test(op)){op='*';implicit=true;}else break;a={t:op==='/'?'div':'mul',a,b:unary(),implicit};}return a;}
 function add(){let a=mul();while(peek()==='+'||peek()==='-'){const op=take();a={t:'add',op,a,b:mul()};}return a;}
 const a=add();if(i!==tokens.length)throw Error('Проверь скобки.');return a;
}
function value(a,vars={}){let v;switch(a.t){case'n':return a.v;case'v':if(!(a.v in vars))throw Error('Неизвестная переменная.');return vars[a.v];case'par':return value(a.a,vars);case'sign':return (a.op==='-'?-1:1)*value(a.a,vars);case'sqrt':v=value(a.a,vars);if(v<0)throw Error('Корень из отрицательного числа.');return Math.sqrt(v);case'pow':return Math.pow(value(a.a,vars),value(a.b,vars));case'mul':return value(a.a,vars)*value(a.b,vars);case'div':v=value(a.b,vars);if(Math.abs(v)<1e-12)throw Error('Знаменатель равен нулю.');return value(a.a,vars)/v;case'add':return value(a.a,vars)+(a.op==='-'?-1:1)*value(a.b,vars);}}
const row=s=>`<mrow>${s}</mrow>`;
function markup(a){switch(a.t){case'n':return `<mn>${String(a.v).replace('.',',')}</mn>`;case'v':return `<mi>${a.v}</mi>`;case'par':return row('<mo>(</mo>'+markup(a.a)+'<mo>)</mo>');case'sign':return row(`<mo>${a.op==='-'?'−':'+'}</mo>`+markup(a.a));case'sqrt':return `<msqrt>${markup(a.a)}</msqrt>`;case'pow':return `<msup>${row(markup(a.a))}${row(markup(a.b))}</msup>`;case'div':return `<mfrac>${row(markup(a.a))}${row(markup(a.b))}</mfrac>`;case'mul':return row(markup(a.a)+(a.implicit?'':'<mo>·</mo>')+markup(a.b));case'add':return row(markup(a.a)+`<mo>${a.op==='-'?'−':'+'}</mo>`+markup(a.b));}}
function math(s){return `<math xmlns="http://www.w3.org/1998/Math/MathML">${markup(parse(s))}</math>`;}
function equal(actual,expected){try{const a=parse(actual),b=parse(expected),samples=[{x:2,y:3,a:7,b:2,c:11},{x:5,y:2,a:3,b:4,c:9},{x:11,y:7,a:13,b:6,c:2}];return samples.every(vars=>{const p=value(a,vars),q=value(b,vars);return Number.isFinite(p)&&Number.isFinite(q)&&Math.abs(p-q)<1e-9*Math.max(1,Math.abs(q));});}catch{return false;}}
window.RootMath={parse,value,math,equal};
})();
