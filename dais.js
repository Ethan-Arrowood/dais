/*!
 * dais.js — OPTIONAL progressive enhancement for Dais decks.
 *
 * The deck is fully usable without this file (scroll, swipe, scrollbar,
 * native keyboard scrolling, pure-CSS buttons/dots/toggles). This script
 * only adds presenter conveniences:
 *
 *   - Arrow / Space / PageUp / PageDown / Home / End navigation from
 *     anywhere on the page (no need to focus the scroller first)
 *   - "o" toggles overview mode, "s" toggles speaker notes,
 *     Escape exits overview
 *   - Click a slide in overview mode to jump to it
 *   - URL hash sync while scrolling, so reloads and shared links resume
 *     on the current slide
 *   - Fills any <output class="dais-counter"> with "n / N"
 *
 * No dependencies. ~2 KB unminified. Include with:
 *   <script src="dais.js" defer></script>
 */
(() => {
  "use strict";

  const deck = document.querySelector(".dais");
  if (!deck) return;

  const slides = [...deck.querySelectorAll(":scope > section")];
  if (slides.length === 0) return;

  // Ensure every slide has an id so hash sync and deep links work.
  slides.forEach((slide, i) => {
    if (!slide.id) slide.id = `slide-${i + 1}`;
  });

  const counter = document.querySelector(".dais-counter");
  const overviewToggle = document.querySelector(".dais-overview-toggle");
  const notesToggle = document.querySelector(".dais-notes-toggle");
  const inOverview = () => Boolean(overviewToggle && overviewToggle.checked);

  const currentIndex = () => {
    // The slide whose center is nearest the scrollport center.
    const mid = deck.scrollLeft + deck.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    slides.forEach((slide, i) => {
      const dist = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    return best;
  };

  const goTo = (i) => {
    const slide = slides[Math.max(0, Math.min(slides.length - 1, i))];
    slide.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  const sync = () => {
    const i = currentIndex();
    if (counter) counter.textContent = `${i + 1} / ${slides.length}`;
    // Update the hash without adding history entries or re-scrolling.
    history.replaceState(null, "", `#${slides[i].id}`);
  };

  // "scrollend" fires once snapping settles; fall back to debounced "scroll".
  if ("onscrollend" in window) {
    deck.addEventListener("scrollend", sync);
  } else {
    let t;
    deck.addEventListener("scroll", () => {
      clearTimeout(t);
      t = setTimeout(sync, 120);
    }, { passive: true });
  }
  sync();

  document.addEventListener("keydown", (event) => {
    // Never steal keys from form fields or editable content.
    if (event.target.closest("input, textarea, select, [contenteditable]")) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
      case "PageDown":
      case " ":
        if (!inOverview()) {
          event.preventDefault();
          goTo(currentIndex() + 1);
        }
        break;
      case "ArrowLeft":
      case "ArrowUp":
      case "PageUp":
        if (!inOverview()) {
          event.preventDefault();
          goTo(currentIndex() - 1);
        }
        break;
      case "Home":
        event.preventDefault();
        goTo(0);
        break;
      case "End":
        event.preventDefault();
        goTo(slides.length - 1);
        break;
      case "o":
        if (overviewToggle) overviewToggle.checked = !overviewToggle.checked;
        break;
      case "s":
        if (notesToggle) notesToggle.checked = !notesToggle.checked;
        break;
      case "Escape":
        if (overviewToggle) overviewToggle.checked = false;
        break;
    }
  });

  // In overview mode, clicking a slide exits the grid and jumps to it.
  deck.addEventListener("click", (event) => {
    if (!inOverview()) return;
    const slide = event.target.closest(".dais > section");
    if (!slide) return;
    overviewToggle.checked = false;
    // Wait a frame for the layout to switch back before scrolling.
    requestAnimationFrame(() => {
      slide.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" });
      sync();
    });
  });
})();
