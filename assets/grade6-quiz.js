const numeric = (value, expected) => {
  const normalized = value.trim().replace(/[−–]/g, '-').replaceAll(',', '.');
  const number = '[+-]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)';
  const match = normalized.match(new RegExp('^(' + number + ')(?:\\s*[/∶:]\\s*(' + number + '))?$'));
  if (!match || (match[2] != null && Number(match[2]) === 0)) return false;
  return Math.abs(Number(match[1]) / (match[2] == null ? 1 : Number(match[2])) - expected) < 1e-9;
};

export function mountQuiz(root, groups, { assessment = false } = {}) {
  const tagged = groups.map(group => group.tasks.map(task => ({ ...task, topic: group.title })));
  const all = assessment ? tagged.flat() : Array.from(
    { length: Math.max(...tagged.map(items => items.length)) },
    (_, i) => tagged.flatMap(items => items[i] ? [items[i]] : [])
  ).flat();
  let tasks = [];
  let drafts = [];
  let attempts = [];
  let index = 0;
  let reviewed = false;
  root.innerHTML = `
    <div class="controls"><label>Раздел <select></select></label>
    <button type="button" data-reset>Начать заново</button></div>
    <div class="exercise" style="margin-top:14px">
      <div class="quiz-meta"><span data-topic></span><span data-position></span></div>
      <form autocomplete="off"><div class="quiz-prompt" id="quiz-prompt" tabindex="-1"></div>
        <div class="quiz-body"></div>
        <div class="controls" style="justify-content:center;margin-top:12px">
          <button class="primary" type="submit">${assessment ? 'Записать ответ' : 'Проверить'}</button>
        </div><p class="feedback" role="status"></p>
      </form>
      <div class="quiz-nav">
        <button type="button" data-prev>← Предыдущее</button>
        <button type="button" data-next>Следующее →</button>
        ${assessment ? '<button type="button" data-finish>Завершить проверку</button>' : ''}
      </div>
      <div class="numbers" role="group" aria-label="Номера заданий"></div>
    </div>
    <div class="results" hidden></div>`;

  const find = selector => root.querySelector(selector);
  const select = find('select');
  const form = find('form');
  const prompt = find('.quiz-prompt');
  const body = find('.quiz-body');
  const feedback = find('.feedback');
  const numbers = find('.numbers');
  const result = find('.results');
  const submit = find('[type=submit]');
  const finish = find('[data-finish]');
  const next = find('[data-next]');
  const previous = find('[data-prev]');
  select.add(new Option(assessment ? 'Все темы' : 'Микс', 'all'));
  groups.forEach(({ title }, i) => select.add(new Option(title, i)));
  select.value = 'all';

  function render(focus = false) {
    const task = tasks[index];
    find('[data-topic]').textContent = task.topic;
    find('[data-position]').textContent = `Задание ${index + 1} из ${tasks.length}`;
    prompt.innerHTML = task.prompt;
    const values = drafts[index] || [];
    body.innerHTML = task.fields.map((field, i) => field.options
      ? `<fieldset><legend>${field.label}</legend><div class="choices">${field.options.map((option, j) =>
        `<label><input type="radio" name="answer${i}" value="${j}">${option}</label>`).join('')}</div></fieldset>`
      : `<label>${field.label} <input type="text" name="answer${i}" aria-describedby="quiz-prompt"></label>`).join('');
    for (const input of body.querySelectorAll('input')) {
      const value = values[Number(input.name.slice(6))];
      if (input.type === 'radio') input.checked = value === input.value;
      else input.value = value ?? '';
      input.disabled = reviewed;
    }
    previous.disabled = index === 0;
    next.disabled = index === tasks.length - 1;
    submit.hidden = reviewed;
    if (finish) finish.hidden = reviewed;
    paintStatus();
    if (focus) prompt.focus({ preventScroll: true });
  }

  function paintStatus() {
    const task = tasks[index];
    const attempt = attempts[index];
    delete feedback.dataset.state;
    feedback.textContent = '';
    if (reviewed) {
      feedback.dataset.state = attempt?.correct ? 'correct' : 'wrong';
      feedback.textContent = attempt?.correct ? 'Верно.' : (attempt ? 'Нужно повторить. ' : 'Ответ пропущен. ') + task.hint;
    } else if (attempt) {
      feedback.textContent = assessment ? 'Ответ записан.' : attempt.correct ? 'Верно.' : task.hint;
      if (!assessment) feedback.dataset.state = attempt.correct ? 'correct' : 'wrong';
    }
    numbers.innerHTML = tasks.map((_, i) => `<button type="button" data-index="${i}" aria-pressed="${i === index}" ${attempts[i] ? 'data-done' : ''} aria-label="Задание ${i + 1}${attempts[i] ? ', ответ записан' : ''}">${i + 1}</button>`).join('');
  }

  function read() {
    const current = new FormData(form);
    return tasks[index].fields.map((_, i) => String(current.get('answer' + i) ?? '').trim());
  }

  function reset() {
    tasks = select.value === 'all' ? all : tagged[Number(select.value)];
    drafts = [];
    attempts = [];
    index = 0;
    reviewed = false;
    result.hidden = true;
    render();
  }

  function go(i) {
    if (i < 0 || i >= tasks.length || i === index) return;
    if (!reviewed) drafts[index] = read();
    index = i;
    render(true);
  }

  form.addEventListener('input', () => {
    drafts[index] = read();
    attempts[index] = null;
    paintStatus();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (reviewed) return;
    const values = drafts[index] = read();
    if (values.some(value => !value)) {
      feedback.textContent = 'Заполни все поля задания.';
      return;
    }
    const correct = tasks[index].fields.every((field, i) => field.options ? String(field.answer) === values[i] : numeric(values[i], field.answer));
    attempts[index] = { correct };
    paintStatus();
  });
  previous.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  numbers.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (button) go(Number(button.dataset.index));
  });
  root.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.matches('input, select')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      go(index + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  select.addEventListener('change', reset);
  find('[data-reset]').addEventListener('click', reset);
  finish?.addEventListener('click', () => {
    if (attempts.filter(Boolean).length < tasks.length) {
      feedback.textContent = 'Сначала запиши ответ на каждое задание. Номера заданий с ответами отмечены рамкой.';
      return;
    }
    reviewed = true;
    const score = tasks.filter((_, i) => attempts[i]?.correct).length;
    const topics = [...new Set(tasks.map(task => task.topic))];
    result.innerHTML = `<h3 tabindex="-1">Итог · ${score} из ${tasks.length}</h3><ul>${topics.map(topic => {
      const indices = tasks.flatMap((t, i) => t.topic === topic ? [i] : []);
      const errors = indices.filter(i => !attempts[i].correct);
      return `<li>${topic} · ${indices.length - errors.length} из ${indices.length}${errors.length ? ' · повтори ' + errors.map(i => `<button type="button" data-review="${i}" aria-label="Разобрать задание ${i + 1}">№ ${i + 1}</button>`).join(' ') : ''}</li>`;
    }).join('')}</ul>`;
    result.hidden = false;
    render();
    result.querySelector('h3').focus();
  });
  result.addEventListener('click', event => {
    const button = event.target.closest('[data-review]');
    if (!button) return;
    go(Number(button.dataset.review));
    prompt.focus();
    prompt.scrollIntoView({ block: 'center' });
  });
  reset();
}

export const value = (label, answer) => ({ label, answer });
export const choice = (label, options, answer) => ({ label, options, answer });
export const dependency = answer => choice('Вид зависимости', ['Прямая', 'Обратная', 'Ни та ни другая'], answer);
export const task = (prompt, fields, hint) => ({ prompt, fields: Array.isArray(fields) ? fields : [fields], hint });
