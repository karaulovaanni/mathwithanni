const variants = [
  [
    {
      "prompt": "Найди <math><mfrac><mn>5</mn><mn>8</mn></mfrac></math> от 144.",
      "fields": [
        {
          "label": "Ответ",
          "answer": 90
        }
      ],
      "hint": "Сначала найди одну восьмую, затем возьми пять таких частей."
    },
    {
      "prompt": "Найди число, <math><mfrac><mn>3</mn><mn>5</mn></mfrac></math> которого равны 42.",
      "fields": [
        {
          "label": "Число",
          "answer": 70
        }
      ],
      "hint": "Раздели 42 на число известных долей и собери пять долей."
    },
    {
      "prompt": "Вырази <math><mfrac><mn>7</mn><mn>20</mn></mfrac></math> в процентах.",
      "fields": [
        {
          "label": "Процентов",
          "answer": 35
        }
      ],
      "hint": "Приведи дробь к знаменателю 100."
    },
    {
      "prompt": "Найди 17% от 320.",
      "fields": [
        {
          "label": "Ответ",
          "answer": 54.4
        }
      ],
      "hint": "Найди 1% от 320 и умножь на 17."
    },
    {
      "prompt": "30% числа равны 54. Найди это число.",
      "fields": [
        {
          "label": "Число",
          "answer": 180
        }
      ],
      "hint": "54 — это часть целого. Найди 1%, затем 100%."
    },
    {
      "prompt": "Из 240 ламп 18 оказались неисправны. Сколько процентов ламп исправны?",
      "fields": [
        {
          "label": "Процентов",
          "answer": 92.5
        }
      ],
      "hint": "Подели число исправных ламп на общее число и вырази частное в процентах."
    },
    {
      "prompt": "Цена была 1250 руб. Её повысили на 20%, затем снизили на 20%. Сколько рублей стоит товар теперь?",
      "fields": [
        {
          "label": "Рублей",
          "answer": 1200
        }
      ],
      "hint": "У второго изменения новая база. Сначала умножь на 1,2, затем на 0,8."
    },
    {
      "prompt": "Какое отношение равно отношению 1,2 м к 45 см?",
      "fields": [
        {
          "label": "Выбери сокращённое отношение",
          "options": [
            "2 : 75",
            "8 : 3",
            "3 : 8"
          ],
          "answer": 1
        }
      ],
      "hint": "Переведи 1,2 м в сантиметры и сократи 120 : 45."
    },
    {
      "prompt": "Раздели 156 жетонов в отношении 5 : 7. Сколько жетонов в меньшей части?",
      "fields": [
        {
          "label": "Жетонов",
          "answer": 65
        }
      ],
      "hint": "Сначала раздели общее число на сумму долей."
    },
    {
      "prompt": "Образуют ли отношения 3,6 : 1,5 и 7,2 : 3 пропорцию?",
      "fields": [
        {
          "label": "Выбери ответ",
          "options": [
            "Да",
            "Нет"
          ],
          "answer": 0
        }
      ],
      "hint": "Сравни произведения крайних и средних членов."
    },
    {
      "prompt": "Реши пропорцию 3,5 : x = 7 : 12.",
      "fields": [
        {
          "label": "x",
          "answer": 6
        }
      ],
      "hint": "Приравняй произведения крайних и средних членов."
    },
    {
      "prompt": "Время движения и пройденный путь при постоянной скорости.",
      "fields": [
        {
          "label": "Вид зависимости",
          "options": [
            "Прямая",
            "Обратная",
            "Ни та ни другая"
          ],
          "answer": 0
        }
      ],
      "hint": "Скорость показывает, сколько километров прибавляется за один час."
    },
    {
      "prompt": "Из 2,4 кг сырья получилось 1,8 кг продукта. Сколько продукта получится из 6 кг при том же выходе?",
      "fields": [
        {
          "label": "Вид зависимости",
          "options": [
            "Прямая",
            "Обратная",
            "Ни та ни другая"
          ],
          "answer": 0
        },
        {
          "label": "Килограммов",
          "answer": 4.5
        }
      ],
      "hint": "Найди выход из одного килограмма сырья."
    },
    {
      "prompt": "Запиши 0,375 обыкновенной дробью. Используй запись через косую черту.",
      "fields": [
        {
          "label": "Дробь",
          "answer": 0.375
        }
      ],
      "hint": "Запиши сначала тысячные, затем сократи дробь."
    },
    {
      "prompt": "Вырази 0,065 в процентах.",
      "fields": [
        {
          "label": "Процентов",
          "answer": 6.5
        }
      ],
      "hint": "Умножь десятичную дробь на 100."
    },
    {
      "prompt": "Цена снизилась с 800 до 680 руб. На сколько процентов она снизилась?",
      "fields": [
        {
          "label": "Процентов",
          "answer": 15
        }
      ],
      "hint": "Сравни разность цен с первоначальной ценой."
    },
    {
      "prompt": "Реши пропорцию 2,4 : (x + 0,4) = 6 : 3.",
      "fields": [
        {
          "label": "x",
          "answer": 0.8
        }
      ],
      "hint": "Сначала найди значение всего выражения в скобках."
    },
    {
      "prompt": "120 км проехали за 2,5 ч. Сколько километров проедут за 4 ч при той же средней скорости?",
      "fields": [
        {
          "label": "Вид зависимости",
          "options": [
            "Прямая",
            "Обратная",
            "Ни та ни другая"
          ],
          "answer": 0
        },
        {
          "label": "Километров",
          "answer": 192
        }
      ],
      "hint": "Сравни время и путь при неизменной скорости."
    }
  ],
  [
    {
      "prompt": "В коробке было 84 фишки. Взяли <math><mfrac><mn>3</mn><mn>7</mn></mfrac></math> всех фишек. Сколько фишек осталось?",
      "fields": [
        {
          "label": "Фишек",
          "answer": 48
        }
      ],
      "hint": "От всей коробки вычти взятую часть или сразу найди 4/7."
    },
    {
      "prompt": "Из бака вылили <math><mfrac><mn>2</mn><mn>9</mn></mfrac></math> воды. В баке осталось 35 л. Сколько воды было сначала?",
      "fields": [
        {
          "label": "Литров",
          "answer": 45
        }
      ],
      "hint": "Остаток составляет семь девятых первоначального количества."
    },
    {
      "prompt": "Запиши 135% в виде десятичной дроби.",
      "fields": [
        {
          "label": "Десятичная дробь",
          "answer": 1.35
        }
      ],
      "hint": "Раздели 135 на 100. Доля больше единицы."
    },
    {
      "prompt": "При сушке овощи теряют 68% массы. Сколько килограммов получится из 25 кг?",
      "fields": [
        {
          "label": "Килограммов",
          "answer": 8
        }
      ],
      "hint": "Нужно найти массу, которая осталась после потери 68%."
    },
    {
      "prompt": "На мероприятие пришли 88% участников, а 6 человек отсутствовали. Сколько всего было записано?",
      "fields": [
        {
          "label": "Человек",
          "answer": 50
        }
      ],
      "hint": "Сначала найди процент отсутствовавших."
    },
    {
      "prompt": "Команда выиграла 14 из 35 матчей. Какой процент матчей она выиграла?",
      "fields": [
        {
          "label": "Процентов",
          "answer": 40
        }
      ],
      "hint": "Раздели число побед на число всех матчей."
    },
    {
      "prompt": "После скидки 15% куртка стоит 3400 руб. Сколько она стоила до скидки?",
      "fields": [
        {
          "label": "Рублей",
          "answer": 4000
        }
      ],
      "hint": "Новая цена составляет 85% первоначальной."
    },
    {
      "prompt": "Скорость 150 км за 2,5 ч. Чему равно отношение пути ко времени?",
      "fields": [
        {
          "label": "Км/ч",
          "answer": 60
        }
      ],
      "hint": "У пути и времени разные единицы. Частное даёт скорость."
    },
    {
      "prompt": "Длина ленты 108 см. Её разделили в отношении 2 : 3 : 4. Найди каждую часть в указанном порядке.",
      "fields": [
        {
          "label": "1-я, см",
          "answer": 24
        },
        {
          "label": "2-я, см",
          "answer": 36
        },
        {
          "label": "3-я, см",
          "answer": 48
        }
      ],
      "hint": "Найди длину одной доли и умножь на число долей каждой части."
    },
    {
      "prompt": "Какую пропорцию можно составить из равенства 8 · 15 = 10 · 12?",
      "fields": [
        {
          "label": "Выбери запись",
          "options": [
            "8 : 15 = 10 : 12",
            "8 : 10 = 15 : 12",
            "8 : 10 = 12 : 15"
          ],
          "answer": 2
        }
      ],
      "hint": "Сохрани пары множителей при перемножении крайних и средних."
    },
    {
      "prompt": "Реши пропорцию 5 : 8 = 2,5 : 3x.",
      "fields": [
        {
          "label": "x",
          "answer": 1.3333333333333333
        }
      ],
      "hint": "Сначала найди 3x, затем раздели на 3. Подойдёт точная дробь."
    },
    {
      "prompt": "Стороны прямоугольника площадью 24 см².",
      "fields": [
        {
          "label": "Вид зависимости",
          "options": [
            "Прямая",
            "Обратная",
            "Ни та ни другая"
          ],
          "answer": 1
        }
      ],
      "hint": "Площадь — произведение двух сторон."
    },
    {
      "prompt": "8 одинаковых станков выполняют заказ за 45 минут. За сколько минут справятся 12 станков?",
      "fields": [
        {
          "label": "Вид зависимости",
          "options": [
            "Прямая",
            "Обратная",
            "Ни та ни другая"
          ],
          "answer": 1
        },
        {
          "label": "Минут",
          "answer": 30
        }
      ],
      "hint": "Заказ постоянен, значит, сохраняется произведение числа станков на время."
    },
    {
      "prompt": "Запиши 42% обыкновенной дробью. Используй запись через косую черту.",
      "fields": [
        {
          "label": "Дробь",
          "answer": 0.42
        }
      ],
      "hint": "Запиши 42 сотых и сократи."
    },
    {
      "prompt": "Запиши <math><mfrac><mn>7</mn><mn>16</mn></mfrac></math> десятичной дробью.",
      "fields": [
        {
          "label": "Десятичная дробь",
          "answer": 0.4375
        }
      ],
      "hint": "Раздели числитель на знаменатель."
    },
    {
      "prompt": "В букете 9 ирисов и 15 тюльпанов. Запиши отношение числа тюльпанов к числу ирисов.",
      "fields": [
        {
          "label": "Отношение",
          "answer": 1.6666666666666667
        }
      ],
      "hint": "Первым в записи идёт число тюльпанов. Можно ввести отношение через двоеточие."
    },
    {
      "prompt": "Стоимость доставки и километраж, если есть фиксированная плата за подачу и отдельная плата за километр.",
      "fields": [
        {
          "label": "Вид зависимости",
          "options": [
            "Прямая",
            "Обратная",
            "Ни та ни другая"
          ],
          "answer": 2
        }
      ],
      "hint": "При удвоении километража плата за подачу не удваивается."
    },
    {
      "prompt": "4 одинаковых принтера за 6 мин напечатали 240 страниц. Сколько времени нужно 6 таким принтерам для 420 страниц?",
      "fields": [
        {
          "label": "Минут",
          "answer": 7
        }
      ],
      "hint": "Найди, сколько один принтер печатает за минуту. Затем учти новое число принтеров и новый объём."
    }
  ]
];

const root = document.getElementById('assessment');
let current=0;
let drafts=[{},{}];
let finished=[false,false];
function valid(value, expected){
 const match=String(value).trim().replaceAll(',','.').match(/^([+-]?(?:\d+(?:\.\d+)?|\.\d+))(?:\s*[/∶:]\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)))?$/);
 if(!match || (match[2]!=null && Number(match[2])===0))return false;
 return Math.abs(Number(match[1])/(match[2]==null?1:Number(match[2]))-expected)<1e-9;
}
function save(){
 for(const input of root.querySelectorAll('input')){
  if(input.type!=='radio' || input.checked) drafts[current][input.name]=input.value;
 }
}
function render(){
 const tasks=variants[current];
 root.innerHTML='<div class="controls" role="group" aria-label="Вариант работы">'+[0,1].map(i=>'<button type="button" data-variant="'+i+'" aria-pressed="'+(i===current)+'">Вариант '+(i+1)+'</button>').join('')+'<button type="button" data-reset>Начать вариант заново</button></div><form autocomplete="off"><ol class="task-list" role="list">'+tasks.map((task,i)=>'<li><div class="paper-prompt">'+task.prompt+'</div><div class="paper-answer">'+task.fields.map((field,j)=>{
 const name='q'+i+'f'+j;
 return field.options?'<fieldset><legend>'+field.label+'</legend><div class="choices">'+field.options.map((option,n)=>'<label><input type="radio" name="'+name+'" value="'+n+'">'+option+'</label>').join('')+'</div></fieldset>':'<label>'+field.label+' <input name="'+name+'" type="text"></label>';
 }).join('')+'</div><p class="feedback" data-result="'+i+'"></p></li>').join('')+'</ol><div class="controls" style="justify-content:center;margin-top:28px"><button type="submit" class="primary">Завершить работу</button></div><p role="status" class="paper-status"></p></form>';
 for(const input of root.querySelectorAll('input')){
  if(input.type==='radio')input.checked=drafts[current][input.name]===input.value;
  else input.value=drafts[current][input.name]??'';
  input.disabled=finished[current];
 }
 if(finished[current]) grade();
 root.querySelector('form').addEventListener('input',save);
 root.querySelector('form').addEventListener('submit',event=>{
  event.preventDefault();save();
  const missing=tasks.flatMap((t,i)=>t.fields.some((_,j)=>!drafts[current]['q'+i+'f'+j])?[i+1]:[]);
  if(missing.length){root.querySelector('.paper-status').textContent='Заполни задания '+missing.join(', ')+'.';return;}
  finished[current]=true;render();
  root.querySelector('.paper-status').scrollIntoView({block:'center'});
 });
}
function grade(){
 let score=0;
 variants[current].forEach((task,i)=>{
  const correct=task.fields.every((field,j)=>field.options?String(field.answer)===drafts[current]['q'+i+'f'+j]:valid(drafts[current]['q'+i+'f'+j],field.answer));
  if(correct)score++;
  const feedback=root.querySelector('[data-result="'+i+'"]');
  feedback.textContent=correct?'Верно.':'Нужно повторить. '+task.hint;
  feedback.dataset.state=correct?'correct':'wrong';
 });
 root.querySelector('.paper-status').textContent='Вариант '+(current+1)+' · верно '+score+' из 18. Посмотри отмеченные задания и вернись к объяснениям нужного урока.';
 root.querySelector('[type="submit"]').hidden=true;
}
root.addEventListener('click',event=>{
 const variant=event.target.closest('[data-variant]');
 if(variant){save();current=Number(variant.dataset.variant);render();}
 if(event.target.closest('[data-reset]')){drafts[current]={};finished[current]=false;render();}
});
render();
window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
