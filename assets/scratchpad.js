(() => {
  if (document.querySelector("math-scratchpad")) return;
  const host = document.createElement("math-scratchpad");
  host.hidden = true;
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = `
<aside id="lesson-scratchpad" aria-label="Черновик" hidden>
  <div class="scratchpad-heading">
    <h2 id="scratchpad-title"><button type="button" data-scratch-grip="move" aria-label="Переместить черновик" title="Потяни, чтобы переместить">Черновик</button></h2>
    <button type="button" data-scratch-clear>Стереть всё</button>
    <button type="button" data-scratch-close aria-label="Закрыть черновик" title="Закрыть"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
  </div>
  <div class="scratchpad-tools">
    <div role="group" aria-label="Инструмент">
      <button type="button" data-scratch-tool="pen" aria-pressed="true" aria-label="Ручка" title="Ручка"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 20 4.5-1 11-11a2.5 2.5 0 0 0-3.5-3.5l-11 11L4 20Z"/><path d="m14.5 6 3.5 3.5"/></svg></button>
      <button type="button" data-scratch-tool="eraser" aria-pressed="false" aria-label="Ластик" title="Ластик"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 20h10M7 20l-3-3a2 2 0 0 1 0-2.8l8.3-8.3a2 2 0 0 1 2.8 0l4 4a2 2 0 0 1 0 2.8L12 20H7Zm1-9 6 6"/></svg></button>
    </div>
    <div role="group" aria-label="Цвет ручки">
      <button type="button" data-scratch-color="#202024" style="--swatch:#202024" aria-pressed="true" aria-label="Чёрный" title="Чёрный"></button>
      <button type="button" data-scratch-color="#2456ad" style="--swatch:#2456ad" aria-pressed="false" aria-label="Синий" title="Синий"></button>
      <button type="button" data-scratch-color="#923e77" style="--swatch:#923e77" aria-pressed="false" aria-label="Малиновый" title="Малиновый"></button>
    </div>
    <select aria-label="Толщина ручки" title="Толщина ручки">
      <option value="2">Тонкая</option>
      <option value="4" selected>Средняя</option>
      <option value="7">Толстая</option>
    </select>
  </div>
  <div class="scratchpad-paper">
    <canvas aria-label="Лист в клетку для вычислений"></canvas>
  </div>
  <div data-scratch-grip="n" aria-hidden="true"></div>
  <div data-scratch-grip="e" aria-hidden="true"></div>
  <div data-scratch-grip="s" aria-hidden="true"></div>
  <div data-scratch-grip="w" aria-hidden="true"></div>
  <button type="button" data-scratch-grip="nw" aria-label="Изменить размер за верхний левый угол" title="Изменить размер"></button>
  <button type="button" data-scratch-grip="se" aria-label="Изменить размер за нижний правый угол" title="Изменить размер"></button>
</aside>
<button id="scratchpad-toggle" type="button" aria-controls="lesson-scratchpad" aria-expanded="false" aria-label="Открыть черновик" title="Открыть черновик"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 20 4.5-1 11-11a2.5 2.5 0 0 0-3.5-3.5l-11 11L4 20Z"/><path d="m14.5 6 3.5 3.5"/></svg></button>
  `;
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = new URL("scratchpad.css?v=3", document.currentScript.src).href;
  stylesheet.addEventListener("load", () => { host.hidden = false; }, { once: true });
  root.prepend(stylesheet);
  document.body.append(host);

  const panel = root.querySelector("#lesson-scratchpad");
  const toggle = root.querySelector("#scratchpad-toggle");
  const close = panel.querySelector("[data-scratch-close]");
  const clear = panel.querySelector("[data-scratch-clear]");
  const grips = panel.querySelectorAll("[data-scratch-grip]");
  const tools = [...panel.querySelectorAll("[data-scratch-tool]")];
  const colors = [...panel.querySelectorAll("[data-scratch-color]")];
  const thickness = panel.querySelector("select");
  const canvas = panel.querySelector("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    toggle.hidden = true;
    return;
  }

  // Store points in paper coordinates so resizing reveals more grid without stretching the writing.
  const strokes = [];
  let active = null;
  let gesture = null;
  let geometry = null;
  let tool = "pen";
  let color = colors[0].dataset.scratchColor;
  let width = 0;
  let height = 0;

  function paintSegment(stroke, from, to) {
    const { size, ink, erase } = stroke;
    context.globalCompositeOperation = erase ? "destination-out" : "source-over";
    context.strokeStyle = context.fillStyle = ink;
    context.lineWidth = size;
    context.lineCap = "round";
    context.beginPath();
    if (!from) {
      context.arc(to.x, to.y, size / 2, 0, Math.PI * 2);
      context.fill();
    } else {
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.stroke();
    }
  }

  function sizePaper() {
    if (panel.hidden) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const density = window.devicePixelRatio || 1;
    const pixelWidth = Math.round(rect.width * density);
    const pixelHeight = Math.round(rect.height * density);
    if (width === rect.width && height === rect.height &&
        canvas.width === pixelWidth && canvas.height === pixelHeight) return;

    width = rect.width;
    height = rect.height;
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
    context.setTransform(pixelWidth / width, 0, 0, pixelHeight / height, 0, 0);
    for (const stroke of strokes) {
      stroke.points.forEach((point, index) => paintSegment(stroke, stroke.points[index - 1], point));
    }
  }

  function clearPaper() {
    if (active && canvas.hasPointerCapture(active.id)) canvas.releasePointerCapture(active.id);
    active = null;
    strokes.length = 0;
    context.clearRect(0, 0, width, height);
  }

  const inset = 8;

  function bounds() {
    return {
      right: Math.max(inset, document.documentElement.clientWidth - inset),
      bottom: Math.max(inset, document.documentElement.clientHeight - inset)
    };
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
  }

  function showWindow({ x, y, w, h }) {
    Object.assign(panel.style, {
      left: x + "px",
      top: y + "px",
      width: w + "px",
      height: h + "px",
      right: "auto",
      bottom: "auto"
    });
  }

  function fitWindow() {
    if (!geometry || panel.hidden) return;
    const { right, bottom } = bounds();
    const w = Math.min(geometry.w, right - inset);
    const h = Math.min(geometry.h, bottom - inset);
    showWindow({
      x: clamp(geometry.x, inset, right - w),
      y: clamp(geometry.y, inset, bottom - h),
      w,
      h
    });
  }

  function shiftWindow(rect, mode, dx, dy) {
    const { right, bottom } = bounds();
    if (mode === "move") {
      geometry = {
        x: clamp(rect.left + dx, inset, right - rect.width),
        y: clamp(rect.top + dy, inset, bottom - rect.height),
        w: rect.width,
        h: rect.height
      };
    } else {
      const minWidth = Math.min(260, rect.width);
      const minHeight = Math.min(160, rect.height);
      const x = mode.includes("w") ? clamp(rect.left + dx, inset, rect.right - minWidth) : rect.left;
      const y = mode.includes("n") ? clamp(rect.top + dy, inset, rect.bottom - minHeight) : rect.top;
      const endX = mode.includes("e") ? clamp(rect.right + dx, x + minWidth, right) : rect.right;
      const endY = mode.includes("s") ? clamp(rect.bottom + dy, y + minHeight, bottom) : rect.bottom;
      geometry = { x, y, w: endX - x, h: endY - y };
    }
    showWindow(geometry);
  }

  function finishGesture(event) {
    if (!gesture || (event && event.pointerId !== gesture.id)) return;
    const { id, grip } = gesture;
    gesture = null;
    if (grip.hasPointerCapture(id)) grip.releasePointerCapture(id);
  }

  function setOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    const label = open ? "Закрыть черновик" : "Открыть черновик";
    toggle.setAttribute("aria-label", label);
    toggle.title = label;
    if (open) {
      fitWindow();
      sizePaper();
      close.focus({ preventScroll: true });
    } else {
      finishGesture();
      clearPaper();
      toggle.focus({ preventScroll: true });
    }
  }

  function setTool(next) {
    tool = next;
    panel.dataset.tool = next;
    for (const button of tools) {
      button.setAttribute("aria-pressed", String(button.dataset.scratchTool === next));
    }
  }

  function recordPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const point = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    const previous = active.points.at(-1);
    if (previous && previous.x === point.x && previous.y === point.y) return;
    active.points.push(point);
    paintSegment(active, previous, point);
  }

  toggle.addEventListener("click", () => setOpen(panel.hidden));
  close.addEventListener("click", () => setOpen(false));
  clear.addEventListener("click", clearPaper);
  panel.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !event.defaultPrevented) setOpen(false);
  });
  for (const button of tools) {
    button.addEventListener("click", () => setTool(button.dataset.scratchTool));
  }
  for (const button of colors) {
    button.addEventListener("click", () => {
      color = button.dataset.scratchColor;
      for (const choice of colors) choice.setAttribute("aria-pressed", String(choice === button));
      setTool("pen");
    });
  }

  const arrowSteps = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
  for (const grip of grips) {
    const mode = grip.dataset.scratchGrip;
    grip.addEventListener("pointerdown", (event) => {
      if (gesture || active || !event.isPrimary || event.button !== 0) return;
      event.preventDefault();
      gesture = {
        grip,
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        rect: panel.getBoundingClientRect()
      };
      grip.setPointerCapture(event.pointerId);
    });
    grip.addEventListener("pointermove", (event) => {
      if (gesture?.id !== event.pointerId) return;
      shiftWindow(gesture.rect, mode, event.clientX - gesture.startX, event.clientY - gesture.startY);
    });
    grip.addEventListener("pointerup", finishGesture);
    grip.addEventListener("pointercancel", finishGesture);
    grip.addEventListener("lostpointercapture", finishGesture);
    grip.addEventListener("keydown", (event) => {
      const step = arrowSteps[event.key];
      if (!step) return;
      event.preventDefault();
      shiftWindow(panel.getBoundingClientRect(), mode, step[0] * 12, step[1] * 12);
    });
  }

  canvas.addEventListener("pointerdown", (event) => {
    if (gesture || active || !event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    const erase = tool === "eraser";
    active = { id: event.pointerId, points: [], ink: color, size: erase ? 20 : Number(thickness.value), erase };
    strokes.push(active);
    canvas.setPointerCapture(event.pointerId);
    recordPoint(event);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (active?.id === event.pointerId) recordPoint(event);
  });
  canvas.addEventListener("pointerup", (event) => {
    if (active?.id !== event.pointerId) return;
    recordPoint(event);
    active = null;
  });
  for (const type of ["pointercancel", "lostpointercapture"]) {
    canvas.addEventListener(type, (event) => {
      if (active?.id === event.pointerId) active = null;
    });
  }

  new ResizeObserver(sizePaper).observe(canvas);
  window.addEventListener("resize", () => {
    finishGesture();
    fitWindow();
    sizePaper();
  });
})();
