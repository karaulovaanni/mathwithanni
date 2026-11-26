export const tasks = [
 {kind:'scale',prompt:'Между городами 180 км. На карте это расстояние равно 45 мм. Найди масштаб карты.',l:4.5,L:18000000,n:4000000,answer:4000000,unit:''},
 {kind:'ground',prompt:'На карте масштаба 1 : 100 000 расстояние между посёлками равно 6,5 см. Найди расстояние на местности в километрах.',l:6.5,L:650000,n:100000,answer:6.5,unit:'км'},
 {kind:'paper',prompt:'Расстояние на местности — 5,2 км. Какой длины будет отрезок на карте масштаба 1 : 1 000 000? Ответ дай в сантиметрах.',l:.52,L:520000,n:1000000,answer:.52,unit:'см'},
 {kind:'scale',prompt:'Между пунктами 120 км, а на карте — 6 см. Найди масштаб карты.',l:6,L:12000000,n:2000000,answer:2000000,unit:''},
 {kind:'ground',prompt:'На карте масштаба 1 : 250 000 между пунктами 32 мм. Сколько это километров на местности?',l:3.2,L:800000,n:250000,answer:8,unit:'км'},
 {kind:'paper',prompt:'Расстояние между городами — 180 км. Сколько сантиметров между ними на карте масштаба 1 : 1 500 000?',l:12,L:18000000,n:1500000,answer:12,unit:'см'},
 {kind:'scale',prompt:'В действительности расстояние равно 24 км, а на карте — 80 мм. Найди масштаб.',l:8,L:2400000,n:300000,answer:300000,unit:''},
 {kind:'ground',prompt:'На плане масштаба 1 : 150 длина детали водопровода равна 8 см. Найди настоящую длину в метрах.',l:8,L:1200,n:150,answer:12,unit:'м'},
 {kind:'paper',prompt:'Магистраль длиной 4 324 км изображают в масштабе 1 : 20 000 000. Найди длину линии на карте в сантиметрах.',l:21.62,L:432400000,n:20000000,answer:21.62,unit:'см'}
];
export const numberValue = v => {
 const s=String(v).trim().replaceAll(/\s/g,'').replace(',','.');
 if(!/^\d+(?:\.\d+)?$/.test(s))return NaN;
 return Number(s);
};
export const equal = (a,b)=>Number.isFinite(a)&&Math.abs(a-b)<1e-8;
export const expectedProportion = t => [t.kind==='paper'?'x':t.l,t.kind==='ground'?'x':t.L,t.kind==='scale'?'x':t.n];
export function checkProportion(values,t){
 return expectedProportion(t).every((e,i)=> e==='x'?String(values[i]).trim().toLowerCase().replace('х','x')==='x':equal(numberValue(values[i]),e));
}
export const points = [
 {name:'Лесное',x:140,y:310}, {name:'Ягодное',x:380,y:310},
 {name:'Озёрное',x:380,y:130}, {name:'Сосновка',x:140,y:130}
];
export const mapCentimeters = (a,b)=>Math.hypot(a.x-b.x,a.y-b.y)/60;
export const groundKilometers = (cm,n)=>cm*n/100000;
