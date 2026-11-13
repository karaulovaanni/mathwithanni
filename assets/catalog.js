(() => {
  'use strict';
  const key = 'mathwithanni.catalog.v1';
  const grades = [...document.querySelectorAll('.grade-category')];
  const navigation = performance.getEntriesByType('navigation')[0];
  let saved = null;
  try {
    if (navigation?.type === 'reload') sessionStorage.removeItem(key);
    else saved = JSON.parse(sessionStorage.getItem(key) || 'null');
  } catch (_) { /* Navigation also works with storage disabled. */ }
  grades.forEach((grade, i) => { grade.open = Boolean(saved?.open?.includes(i)); });
  const remember = () => {
    try {
      sessionStorage.setItem(key, JSON.stringify({
        open: grades.flatMap((grade, i) => grade.open ? [i] : []),
        scroll: window.scrollY
      }));
    } catch (_) {}
  };
  grades.forEach(grade => grade.addEventListener('toggle', remember));
  window.addEventListener('pagehide', remember);
  document.addEventListener('click', event => {
    if (event.target.closest('a[href]')) remember();
  });
  // Browser Back handles its own scroll position; a site's Home link needs ours.
  if (saved && navigation?.type === 'navigate') {
    requestAnimationFrame(() => window.scrollTo(0, saved.scroll || 0));
  }
  window.addEventListener('pageshow', event => {
    if (event.persisted) remember();
  });
  const dialog = document.getElementById('material-dialog');
  document.querySelectorAll('[data-preview]').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('preview-title').textContent = button.dataset.title;
      const image = document.getElementById('preview-image');
      image.src = button.dataset.preview;
      image.alt = 'Первая страница: ' + button.dataset.title;
      document.getElementById('preview-drive').href = button.dataset.drive;
      dialog.showModal();
    });
  });
  document.getElementById('close-preview').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    }
  });
})();
