// The timing controls are intentionally grouped here for quick edits in VS Code.
export const carouselSettings = {
  intervalMs: 2400,
  resetDelayMs: 650,
};

export function startCarousel(root = document) {
  const preview = root.querySelector(".course-preview");
  if (!preview) return () => {};
  const viewport = preview.querySelector(".preview-viewport");
  const track = preview.querySelector(".preview-track");
  const cards = [...track.querySelectorAll(".preview-card")];
  const cycleLength = Number(preview.dataset.cycleLength);
  let index = cycleLength * 2,
    resetTimer,
    intervalTimer,
    stopped = false;

  function center(instant = false) {
    track.classList.toggle("is-resetting", instant);
    cards.forEach((card, cardIndex) =>
      card.classList.toggle("is-active", cardIndex === index),
    );
    const card = cards[index];
    const offset = viewport.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2);
    track.style.transform = `translate3d(${offset}px, 0, 0)`;
    if (instant)
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (!stopped) track.classList.remove("is-resetting");
        }),
      );
  }

  center(true);
  const observer = new ResizeObserver(() => center(true));
  observer.observe(viewport);
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    intervalTimer = setInterval(() => {
      if (preview.hasAttribute("data-paused")) return;
      index -= 1;
      center();
      // Recenter on an identical copy only after the visible step finishes.
      if (index === cycleLength)
        resetTimer = setTimeout(() => {
          index = cycleLength * 2;
          center(true);
        }, carouselSettings.resetDelayMs);
    }, carouselSettings.intervalMs);
  }
  return () => {
    stopped = true;
    clearInterval(intervalTimer);
    clearTimeout(resetTimer);
    observer.disconnect();
  };
}

export function toggleCarousel(button) {
  const paused = button.closest(".course-preview").toggleAttribute("data-paused");
  const label = paused ? "Play animation" : "Pause animation";
  button.setAttribute("aria-pressed", String(paused));
  button.setAttribute("aria-label", label);
  button.title = label;
}
