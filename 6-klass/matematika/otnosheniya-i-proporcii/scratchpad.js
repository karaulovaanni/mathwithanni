(() => {
  const panel = document.querySelector("#lesson-scratchpad");
  const toggle = document.querySelector("#scratchpad-toggle");
  const close = panel.querySelector("[data-scratch-close]");
  const tools = [...panel.querySelectorAll("[data-scratch-tool]")];
  const colors = [...panel.querySelectorAll("[data-scratch-color]")];
  const thickness = panel.querySelector("select");
  const canvas = panel.querySelector("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    toggle.hidden = true;
    return;
  }

  // Keep strokes in the current page so folding the draft or changing topics preserves it.
  const strokes = [];
  let active = null;
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
      context.arc(to.x * width, to.y * height, size / 2, 0, Math.PI * 2);
      context.fill();
    } else {
      context.moveTo(from.x * width, from.y * height);
      context.lineTo(to.x * width, to.y * height);
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

  function setOpen(open) {
    panel.hidden = !open;
    document.body.classList.toggle("scratchpad-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    const label = open ? "Свернуть черновик" : "Открыть черновик";
    toggle.setAttribute("aria-label", label);
    toggle.title = label;
    if (open) {
      sizePaper();
      close.focus({ preventScroll: true });
    } else {
      if (active && canvas.hasPointerCapture(active.id)) canvas.releasePointerCapture(active.id);
      active = null;
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
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height
    };
    const previous = active.points.at(-1);
    if (previous && previous.x === point.x && previous.y === point.y) return;
    active.points.push(point);
    paintSegment(active, previous, point);
  }

  toggle.addEventListener("click", () => setOpen(panel.hidden));
  close.addEventListener("click", () => setOpen(false));
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

  canvas.addEventListener("pointerdown", (event) => {
    if (active || !event.isPrimary || event.button !== 0) return;
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
  window.addEventListener("resize", sizePaper);
})();
