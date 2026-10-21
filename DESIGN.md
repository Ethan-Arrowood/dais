# Dais — design document

**Dais** (a *dais* is the raised platform a speaker stands on) is a web-native
presentation framework: a small set of CSS files and an HTML authoring
convention for building PowerPoint-style decks directly in the browser.

This document records the research, goals, and architectural decisions behind
the prototype. Authoring documentation lives in [`docs/`](docs/); this file is
about *why*, not *how*.

## Goals

1. **HTML + CSS first.** The entire presentation experience — navigation,
   transitions, incremental reveals, overview mode, speaker notes, printing —
   works with JavaScript disabled. A tiny optional script (~2 KB) adds
   presenter conveniences (arrow keys anywhere, `n / N` counter, URL hash
   sync) as progressive enhancement.
2. **Semantics first.** A deck is a real document: `<main>` containing
   `<section>` slides, each with a heading. With the stylesheet removed, the
   deck reads top-to-bottom as a sensible article. Screen readers get
   headings, landmarks, and lists — not a div soup.
3. **Not a design system.** A slide engine, a small set of slide templates,
   and a handful of utilities. Everything else is plain CSS the author writes.
   All visual decisions flow through ~20 custom properties so themes are
   small token files, and per-deck overrides are one `:root` block away. Printed page size derives
   from `--dais-aspect` too, so a re-shaped deck exports correctly without a
   second knob.
4. **Evergreen CSS.** Target current Chrome/Firefox/Safari. Use modern
   features (scroll snap, `:has()`, container queries, scroll-state queries,
   CSS carousel pseudo-elements, scroll-driven animations) with graceful
   degradation where support is still uneven.

## Prior art researched

- **Una Kravets** ([una.im](https://una.im/), [github.com/una](https://github.com/una)) —
  her recent decks (e.g. [`little-big-things-modern-web-ui-patterns-03-26`](https://github.com/una/little-big-things-modern-web-ui-patterns-03-26),
  [`better-faster-stronger-web-ui`](https://github.com/una/better-faster-stronger-web-ui))
  are plain `index.html` + ~6 CSS files. The engine is a horizontal
  scroll-snap "slider" (`display: flex; scroll-snap-type: x mandatory`) with
  the new pure-CSS carousel features: `::scroll-button(left/right)` for
  prev/next arrows and `::scroll-marker` / `::scroll-marker-group` for the
  dot navigation, anchored with CSS anchor positioning. JS appears only as
  per-slide exceptions for bespoke demos. Not published as a reusable
  framework — each talk repo vendors the CSS. Slides are `<div class="slide">`,
  so semantics are one place Dais deliberately improves on the inspiration.
- **Daniel Roe** ([roe.dev](https://roe.dev/)) — his slides are integrated
  into his Nuxt personal site (`danielroe/roe.dev`) rather than published as
  a standalone tool; useful as a data point that "slides as a web page you
  own" is a real workflow, but no framework to borrow from.
- **Ecosystem**: reveal.js (JS-heavy, the de-facto standard, good ARIA
  patterns worth borrowing), Slidev (markdown + Vue, build step), Shower,
  big.js, and Lea Verou's Inspire.js (closest in spirit — one HTML file,
  CSS-driven). Dais differentiates by being CSS-only at its core with no
  build step and no required runtime.

## Architecture

```
dais.css              core engine + templates + utilities + print (one file, no build)
themes/midnight.css   token overrides (restrained dark, tuned for code)
themes/fantasy.css    token overrides + flourishes (dragons & castles)
themes/spooky.css     token overrides + flourishes (Halloween)
dais.js               optional progressive enhancement (no dependencies)
serve.mjs             static server for local preview (no dependencies)
```

A deck is one HTML page:

```html
<link rel="stylesheet" href="dais.css">
<link rel="stylesheet" href="themes/fantasy.css"> <!-- optional -->
<script src="dais.js" defer></script>             <!-- optional -->

<main class="dais" aria-label="Talk title" tabindex="0">
  <section class="slide title" id="intro">
    <h1>Talk title</h1>
    <p>Speaker · Event</p>
  </section>
  <section class="slide" id="point-one">
    <h2>First point</h2>
    <ul class="reveal"> … </ul>
    <aside class="notes">Speaker notes…</aside>
  </section>
</main>
```

### The engine (how navigation works without JS)

- `.dais` is a full-viewport, letterboxed, horizontally scrolling flex row
  with `scroll-snap-type: x mandatory`. Swipe, trackpad, scrollbar, and —
  because scrollable regions are keyboard-focusable in modern browsers —
  arrow/PageUp/PageDown/Home/End keys all navigate natively.
- `::scroll-button(inline-start/end)` renders real, accessible prev/next
  buttons; `::scroll-marker` renders clickable per-slide dots with
  `:target-current` styling. Pure CSS (Chrome 135+); other browsers simply
  don't render them and navigation still works.
- Every slide has an `id`, so `#slide-id` deep links work natively, and the
  optional JS keeps the hash in sync while scrolling.
- Slide geometry: the deck letterboxes to `--dais-aspect` (default 16 / 9)
  inside the viewport. Each slide is a **size container**, and all slide
  typography is set in `cqi` units — so text scales perfectly with slide
  size in fullscreen, overview mode, embeds, and print, with zero JS
  measurement.

### Feature decisions

| Feature | Mechanism | Degradation |
|---|---|---|
| Incremental reveals | `.reveal` children animate in, staggered, when their slide matches `@container scroll-state(snapped: x)` | Wrapped in `@supports`: unsupported browsers show items immediately. `prefers-reduced-motion` shows instantly. Forced visible in print & overview. |
| Steps / fragments | `dais.js` tracks a current step per slide (Right/Space advance); toggles `.step-active`/`.step-current` on `.step`/`[data-step]` elements. Hidden state gated on a JS-added `dais-js` class. Print/overview expand each stepped slide into one frozen clone per step. | No JS → no `dais-js` → every step visible (composed final state) in reading order, print, and screen readers. `prefers-reduced-motion` keeps stepping but drops the transition. |
| Speaker notes | `<aside class="notes">`, hidden; toggled by a checkbox in `.dais-controls` via `body:has(:checked)` | Visible in the no-CSS document reading order; opt-in printing via `dais-print-notes` body class |
| Overview grid | Checkbox toggle re-lays the deck as a CSS grid; `cqi` typography auto-shrinks each slide | None needed — pure layout change |
| Print / PDF | `@page { size: 320mm 180mm; margin: 0 }`, one slide per page via `break-after: page` | Standard print CSS |
| Progress bar | Optional element animated with `animation-timeline: scroll()` | Simply invisible where unsupported |
| Slide numbers | CSS counters on `.dais > section` | JS upgrades an optional counter element to `n / N` |
| Syntax highlighting | A `.tok-*` class vocabulary authors write by hand or emit from a highlighter at author time | None needed — Dais never highlights at runtime, so there is no runtime to lose |
| Presenter timer | `dais.js` drives an optional `<output class="dais-timer">`; starts on the first slide change | Element stays empty and `:empty`-hidden without JS |

### Accessibility commitments

- Document semantics: `<main>` landmark, one `<h1>` (title slide), `<h2>` per
  slide, real lists, `<aside>` for notes, `<figure>`/`<blockquote>` where apt.
- Deck scroller carries `tabindex="0"` + `aria-label` so keyboard users can
  focus and scroll it in every browser.
- All decorative pseudo-element content uses the `content: "…" / ""` alt-text
  syntax so screen readers skip it.
- `prefers-reduced-motion` disables smooth scrolling, reveal animation, and
  theme flourish animations.
- Themes keep text/background pairs at WCAG AA contrast.
- Focus styles are never removed, only restyled.

### Theming model

`dais.css` defines the default theme — clean, professional, light-on-white
with a restrained accent — entirely through custom properties (`--dais-bg`,
`--dais-surface`, `--dais-text`, `--dais-muted`, `--dais-accent`,
`--dais-accent-2`, `--dais-font`, `--dais-font-display`, `--dais-font-mono`,
`--dais-radius`, …). A theme file overrides tokens on `:root` and may add
flourishes (borders, list markers, keyframe accents); linking the theme file
after `dais.css` is all it takes to activate it. Three themes ship with
the prototype: **midnight** (a restrained dark theme built for code-heavy
technical talks — the one to copy for real work), plus **fantasy** (parchment,
gold, dragons and castles) and **spooky** (midnight purple, pumpkin orange,
ghosts) to prove the token surface is expressive enough for decoration.

## Non-goals (for the prototype)

- Markdown/MDX authoring pipeline, build tooling. The package is published to
  npm as `@arrowood.dev/dais`, but only as *file distribution* — an `exports`
  map over the same CSS and JS you would copy in by hand, plus a `dais-serve`
  bin for local preview. There is no build step on either side, and vendoring
  the files remains fully supported.
- Presenter view with synced second window (requires nontrivial JS)
- Vertical/nested slide stacks
- Broad browser-compat fallbacks beyond the graceful-degradation table above
