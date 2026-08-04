# Agent instructions for Dais

Machine-oriented rules for AI agents authoring or modifying Dais decks.
Derived from `docs/` — when in doubt, `docs/authoring.md` and
`docs/reference.md` are authoritative.

## What this is

Dais = presentation framework. One deck = one self-contained HTML file
linking `dais.css` (+ optionally one `themes/*.css` AFTER it, + optionally
`dais.js` with `defer`). No build step, no server, no dependencies. Open the
HTML file in a browser to view.

## Deck contract (MUST follow exactly)

```html
<main class="dais" aria-label="{talk title}" tabindex="0">
  <section class="slide title" id="{kebab-id}">
    <h1>{talk title}</h1>
    <p>{speaker · event}</p>
  </section>
  <section class="slide" id="{kebab-id}">
    <h2>{slide heading}</h2>
    {content}
    <aside class="notes">{speaker notes, optional}</aside>
  </section>
  <!-- more sections -->
</main>
```

Hard rules:

- Slides are ONLY direct-child `<section class="slide">` of `main.dais`.
- Every slide has a unique, meaningful kebab-case `id`.
- Exactly one `<h1>` in the whole deck, on the `title` slide. Every other
  slide begins with `<h2>`. `<h3>` only for sub-structure within a slide.
- Valid, semantic HTML5: real `<ul>`/`<ol>` for lists, `<blockquote>` (+
  inner `<footer>` for attribution) on quote slides, `<figure>`/`<figcaption>`
  for captioned media, `alt` on every `<img>` (empty `alt=""` only if purely
  decorative), `<table>` with `<thead>`/`<th>` and a `<caption>` for data.
- `<aside class="notes">` goes LAST inside its slide.
- Do not add wrapper divs around slides or between `main.dais` and sections.
- Do not write inline `<script>` in slides unless the user asks for an
  interactive demo; the framework needs none.

Recommended boilerplate before `main.dais` (include unless told otherwise).
Set `data-dais-limit` to the talk's length in minutes if it is known:

```html
<nav class="dais-controls" aria-label="Presentation controls">
  <label><input type="checkbox" class="dais-overview-toggle"> Overview</label>
  <label><input type="checkbox" class="dais-notes-toggle"> Notes</label>
  <output class="dais-counter"></output>
  <output class="dais-timer" data-dais-limit="30"></output>
</nav>
<div class="dais-progress" aria-hidden="true"></div>
```

## Class vocabulary (complete — do not invent classes)

Section templates: `title` `divider` `quote` `media-full` `center` `no-number`
In-slide layout: `cols` (with `style="--cols: N"`) `stack` `center` `spacer` `card`
Type: `fit` `muted` `small` `accent` `accent-2`
Tables: `num` (on `th`/`td` → right-align a numeric column)
Code: `line` (one code line inside `pre`) + `hl` `dim` `add` `del`;
`tok-comment` `tok-keyword` `tok-string` `tok-number` `tok-fn` `tok-type`
`tok-punct` (author-time syntax colors — Dais never highlights at runtime)
Behavior: `reveal` (on a list/container → children appear sequentially)
Chrome: `dais-controls` `dais-overview-toggle` `dais-notes-toggle`
`dais-counter` `dais-timer` `dais-progress`

Anything else → write plain CSS in a `<style>` block after the framework
links, scoped to slide `id`s.

## Styling rules

- Customize via tokens first: override `--dais-bg --dais-text --dais-accent
  --dais-accent-2 --dais-surface --dais-muted --dais-stage --dais-code-bg
  --dais-code-text --dais-font --dais-font-display --dais-font-mono
  --dais-radius --dais-aspect --dais-slide-padding --dais-reveal-step
  --dais-code-size --dais-page-height --dais-tok-comment --dais-tok-keyword
  --dais-tok-string --dais-tok-number --dais-tok-fn --dais-tok-type
  --dais-tok-punct` on `:root`.
- Inside slides use `cqi` for font sizes (1cqi = 1% slide width; body text is
  2.4cqi, h2 4.6cqi), `em`/`%` for spacing. NEVER `px`/`vw`/`vh` for slide
  content — it breaks overview mode and print scaling.
- Keep text/background pairs ≥ 4.5:1 contrast (see docs/theming.md table).
- Custom animations must be wrapped in
  `@media (prefers-reduced-motion: no-preference)`.
- Decorative emoji/glyphs in pseudo-elements must use alt-text syntax:
  `content: "🎃" / "";`.
- Reserved internals — never redefine: container names `dais-slide`/`dais-deck`,
  timeline `--dais-scroller`, anchor `--dais`, counter `dais-slide`,
  keyframes `dais-reveal`/`dais-progress-grow`, and `section::after` (slide
  number). Theme decoration belongs on `section::before` or backgrounds.

## Content rules

- One idea per slide; target ≤ 6 bullets, ≤ ~12 words each. Prefer another
  slide over a denser slide.
- Tables: ≤ ~5 rows and ≤ 4 columns. Code blocks: ≤ ~10 lines; shrink with
  `--dais-code-size` rather than letting a block scroll.
- Never encode information only in a reveal animation, only in color, or
  only in an image without alt text — content must survive print, no-JS,
  no-CSS, and screen readers.
- `divider` slides: `<h2>` (+ optional one-liner `<p>`) only.
- `media-full` slides: media first, then `<h2>` (renders as caption bar).

## Verification checklist (run after writing/editing a deck)

1. HTML parses; every section has `id`; exactly one `h1`; h2 on all other
   slides.
2. Only vocabulary classes above (or classes defined in the deck's own
   `<style>`) are used.
3. Stylesheet order: `dais.css` → theme → deck styles; `dais.js` has `defer`.
4. If headless Chrome is available, smoke-test rendering:
   `chrome --headless --screenshot=out.png --window-size=1280,800 file://…/deck.html`
   (append `#some-slide-id` plus `--force-prefers-reduced-motion` to check a
   specific slide), and `chrome --headless --print-to-pdf=out.pdf
   --no-pdf-header-footer file://…/deck.html` for the print path.
5. Reading order sanity: strip the CSS mentally — the deck must read as a
   sensible document top-to-bottom.
