const chapters = [...document.querySelectorAll('article')];
function showChapter() {
  const selected = location.hash === '#proportions' ? 'proportions' : 'ratios';
  for (const chapter of chapters) chapter.hidden = chapter.id !== selected;
  for (const link of document.querySelectorAll('nav a')) {
    if (link.hash === '#' + selected) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  }
}
showChapter();
window.addEventListener('hashchange', () => {
  showChapter();
  document.querySelector('nav').scrollIntoView();
});
const measure = document.querySelector('#measure');
function drawRecipe() {
  const juice = Number(measure.value) * 2;
  const water = Number(measure.value) * 3;
  document.querySelector('#juice').textContent = juice + ' мл';
  document.querySelector('#water').textContent = water + ' мл';
  document.querySelector('#mix').textContent = juice + ' : ' + water + ' = 2 : 3';
}
measure.addEventListener('change', drawRecipe);
window.addEventListener('pageshow', drawRecipe);
drawRecipe();