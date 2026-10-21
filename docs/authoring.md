# Authoring a deck

This guide walks through writing a presentation with Dais, from empty file to
printed PDF. For a terse lookup table of every class and token, see
[reference.md](reference.md).

## 1. The skeleton

A deck is one HTML page. The contract is small and strict:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Talk title</title>
  <link rel="stylesheet" href="dais.css">
  <!-- optional theme, AFTER dais.css: -->
  <!-- <link rel="stylesheet" href="themes/fantasy.css"> -->
  <!-- optional enhancement layer: -->
  <script src="dais.js" defer></script>
</head>
<body>

  <!-- optional presenter controls (recommended) -->
  <nav class="dais-controls" aria-label="Presentation controls">
    <label><input type="checkbox" class="dais-overview-toggle"> Overview</label>
    <label><input type="checkbox" class="dais-notes-toggle"> Notes</label>
    <output class="dais-counter"></output>
  </nav>

  <!-- optional progress bar -->
  <div class="dais-progress" aria-hidden="true"></div>

  <!-- add `dais-dots` for slide dots, `dais-arrows` for edge arrows -->
  <main class="dais dais-dots dais-arrows" aria-label="Talk title" tabindex="0">
    <!-- slides go here -->
  </main>

</body>
</html>
```

Rules that keep decks semantic and accessible:

- The deck container is a **`<main class="dais">`** with an `aria-label`
  naming the talk and `tabindex="0"` (so keyboard users in every browser can
  focus the scroller and use arrow keys). By default the deck shows only the
  slides; add **`dais-dots`** for the slide dots along the bottom edge and
  **`dais-arrows`** for the prev/next edge arrows
  (`<main class="dais dais-dots dais-arrows">`). Both are pure CSS.
- Every slide is a **direct child `<section class="slide">`** of the deck.
- Every slide has an **`id`** (deep links, dots, and hash sync depend on it;
  `dais.js` will generate missing ones, but don't rely on that).
- Exactly one slide — the title slide — contains the page's only **`<h1>`**.
  Every other slide starts with an **`<h2>`** (use `<h3>` for sub-points
  *within* a slide). Screen-reader users navigate your deck by this outline.
- Slides that are purely visual (a full-bleed image, a giant statement) still
  need a heading for the outline; see "Headings on visual slides" below.

## 2. Everyday slides

Inside a slide, write ordinary HTML: paragraphs, lists, `<figure>`,
`<blockquote>`, `<pre><code>`, tables, whatever. The base template lays a
slide out as a column with comfortable spacing:

```html
<section class="slide" id="pricing">
  <h2>What it costs</h2>
  <p>Three tiers, no surprises.</p>
  <ul>
    <li>Hobby — free</li>
    <li>Team — $10/seat</li>
    <li>Enterprise — a phone call and a mild ordeal</li>
  </ul>
</section>
```

### Slide templates

Add one class to the `<section>` to switch template:

| Class | Use for | Notes |
|---|---|---|
| `title` | The opening (and optionally closing) slide | Centered; holds the `<h1>`; hides the slide number |
| `divider` | Section breaks | Inverted colors, one big centered `<h2>` |
| `quote` | A single `<blockquote>` | Give attribution in a `<footer>` inside the blockquote |
| `media-full` | Edge-to-edge image or video | Put the `<h2>` after the media; it renders as a caption bar |
| `center` | Anything you want dead-center | Also available on inner elements |

Example media slide:

```html
<section class="slide media-full" id="architecture">
  <img src="img/diagram.png" alt="Three services behind a load balancer, sharing one queue.">
  <h2>The whole architecture fits on one slide</h2>
</section>
```

### Layout inside a slide

Dais ships exactly five layout utilities — beyond these, write your own CSS:

- **`.cols`** — a grid of equal columns. Two by default; set more inline:
  `<div class="cols" style="--cols: 3">`.
- **`.stack`** — a tight vertical group.
- **`.center`** — center content (on the section or an inner wrapper).
- **`.spacer`** — an empty flexible element that pushes what follows to the
  bottom of the slide.
- **`.card`** — a soft surface for grouping content.

Type helpers: `.fit` (giant statement text), `.muted`, `.small`, `.accent`,
`.accent-2`.

### Tables

Write an ordinary `<table>`. Dais styles it for a projector: an accent header
rule, hairline row separators, and `font-variant-numeric: tabular-nums` so
digits line up in a column. Add `class="num"` to numeric cells and headers to
right-align them, and put the units in a `<caption>` rather than in every row:

```html
<table>
  <caption>p99 latency, 10k requests</caption>
  <thead>
    <tr><th>Change</th><th class="num">p50</th><th class="num">p99</th></tr>
  </thead>
  <tbody>
    <tr><td>Baseline</td><td class="num">18 ms</td><td class="num">240 ms</td></tr>
    <tr><td>Batched writes</td><td class="num">11 ms</td><td class="num">58 ms</td></tr>
  </tbody>
</table>
```

A slide-sized table is about **5 rows and 4 columns**. Past that, cut rows or
show a chart — a table nobody can read from row 15 is a handout, not a slide.

### Code

`<pre><code>` is styled for you: a dark inset panel at `--dais-code-size`
(`0.72em` of the slide's body text). Shrink it per-deck or per-block for a long
snippet — `style="--dais-code-size: 0.6em"` — rather than letting the block
scroll, because a scrollbar mid-talk is a dead end.

Dais never highlights code at runtime. Instead there's a small class
vocabulary you can write by hand or emit from a highlighter (Shiki,
highlight.js) at author time:

| Class | For |
|---|---|
| `tok-comment` | comments (rendered italic) |
| `tok-keyword` | keywords and operators |
| `tok-string` | string and template literals |
| `tok-number` | numeric and boolean literals |
| `tok-fn` | function and method names |
| `tok-type` | types, classes, constructors |
| `tok-punct` | brackets, separators |

```html
<pre><code><span class="tok-keyword">const</span> rows = <span
class="tok-keyword">await</span> db.<span class="tok-fn">getMany</span>(<span
class="tok-string">'users'</span>, ids);</code></pre>
```

Each color clears WCAG AA against `--dais-code-bg`; retune them with the
`--dais-tok-*` tokens if you retheme, and re-check contrast when you do.

To talk through a block line by line, wrap each line in `<span class="line">`
and add:

- **`hl`** — call this line out (accent wash plus an edge bar)
- **`dim`** — push a line back to 40% opacity as context
- **`add`** / **`del`** — diff-style green/red line backgrounds

```html
<pre><code><span class="line dim">const ids = req.query.ids.split(',');</span>
<span class="line hl">const rows = await db.getMany('users', ids);</span>
<span class="line dim">const results = rows.map(shape);</span></code></pre>
```

`<mark>` works inside code too, and `.dim` works on any inline span, not just
whole lines. Because `add`/`del` and `hl` are color-only signals, don't let
them carry meaning your narration doesn't also state.

### Sizing rule of thumb

Slide typography is defined in `cqi` units (1cqi = 1% of the slide's width),
so everything scales together — fullscreen, in the overview grid, and on
paper. When you write custom CSS for slide content, prefer `cqi` for font
sizes and `em`/`%` for spacing, and it will scale the same way. Avoid `px`
and `vw` inside slides.

## 3. Incremental reveals

Add `class="reveal"` to any container (usually a list); its direct children
appear one by one, automatically, when the slide snaps into view:

```html
<ul class="reveal">
  <li>Shown first…</li>
  <li>…then this…</li>
  <li>…then this.</li>
</ul>
```

- Timing: items start ~0.3s after the slide arrives, one every 0.35s. Adjust
  the pace per-deck with `--dais-reveal-step`, or per-list inline:
  `<ul class="reveal" style="--dais-reveal-step: 0.6s">`.
- The first 12 children get individual delays; later ones share the 12th's.
- Reveals **replay** each time you return to the slide.
- Degradation is built in: browsers without `scroll-state()` queries,
  `prefers-reduced-motion` users, print, and overview mode all show every
  item immediately. Never put information in the *animation* itself.

## 4. Stepped slides

Where a reveal plays automatically on arrival, a **step** waits for you.
<kbd>→</kbd>/<kbd>Space</kbd> advances one step within the slide before moving
on to the next section; <kbd>←</kbd> reverses. Two flavors, and you can mix them.

**Additive bullets** — reveal one at a time as you talk. Add `class="step"`:

```html
<ul>
  <li class="step">First point.</li>
  <li class="step">Second point — the first stays visible.</li>
  <li class="step">Third point.</li>
</ul>
```

**A stationary table** — show the whole table, then walk a highlight down it
without the table shifting. Tag the rows with `data-step` (they stay visible;
only the emphasis moves) and style the hooks in your deck's `<style>`:

```html
<style>
  #results tr.step-current { background: color-mix(in srgb, var(--dais-accent) 25%, transparent); }
  #results tr.step-active:not(.step-current) { color: var(--dais-muted); }
</style>

<section class="slide" id="results">
  <h2>Median duration</h2>
  <table><tbody>
    <tr data-step="1"><td>1</td><td class="num">9,939</td></tr>
    <tr data-step="2"><td>2</td><td class="num">5,776</td></tr>
    <tr data-step="3"><td>4</td><td class="num">3,904</td></tr>
    <tr data-step="4"><td>7</td><td class="num">3,468</td></tr>
  </tbody></table>
</section>
```

- `dais.js` toggles `.step-current` (the step you're on) and `.step-active`
  (that step and every earlier one). `.step` also hides itself until active;
  `[data-step]` alone does not — it's for elements that stay put.
- Order comes from `data-step`, or from DOM order among `.step` elements. A
  slide with no per-element markers can still declare a count with
  `data-dais-steps="N"` and drive visuals off the `--dais-step` property.
- Entering a slide forward starts at step 0 (nothing revealed); stepping back
  into it opens it fully revealed.
- **Print and overview expand each stepped slide into one page/thumbnail per
  step**, so a handout shows the whole build-up.
- Degradation, same rule as reveals: **without JavaScript every step is simply
  visible** (the finished slide), so the deck still reads and prints. Never put
  information only in a step.

## 5. Speaker notes

Put notes at the end of a slide in an `<aside class="notes">`:

```html
<aside class="notes">
  Mention the outage war story here. Skip if running long.
</aside>
```

- Hidden from the audience by default.
- Toggle them with the **Notes** checkbox in `.dais-controls` (or <kbd>S</kbd>
  with `dais.js`); they overlay the bottom of each slide.
- Notes are real content in the document flow — a screen reader reading the
  page top-to-bottom will encounter them, which is usually desirable for a
  published deck. Delete them before publishing if not.
- To include notes when printing, add `class="dais-print-notes"` to `<body>`.

## 6. Presenting

| Action | Zero-JS | With dais.js |
|---|---|---|
| Next / previous | swipe, trackpad, scrollbar, dots, edge arrows; <kbd>Tab</kbd> to the deck then <kbd>←</kbd>/<kbd>→</kbd> | <kbd>←</kbd>/<kbd>→</kbd>/<kbd>Space</kbd>/<kbd>PgUp</kbd>/<kbd>PgDn</kbd> from anywhere |
| First / last slide | <kbd>Home</kbd>/<kbd>End</kbd> (deck focused) | <kbd>Home</kbd>/<kbd>End</kbd> anywhere |
| Overview grid | Overview checkbox | <kbd>O</kbd>; click a thumbnail to jump; <kbd>Esc</kbd> exits |
| Speaker notes | Notes checkbox | <kbd>S</kbd> |
| Jump to a slide | edit the URL hash | URL hash follows you as you present |
| Presenter timer | — | <kbd>T</kbd> pauses/resumes (see below) |
| Fullscreen | the browser's own key (<kbd>F11</kbd> / <kbd>⌃⌘F</kbd>) | same |

### The presenter timer

Add an `<output class="dais-timer">` to `.dais-controls` and `dais.js` runs it
as a talk clock:

```html
<output class="dais-timer" data-dais-limit="30"></output>
```

- It **starts by itself** when you first advance off the opening slide — the
  moment you actually start talking — so there's no button to forget.
- <kbd>T</kbd> or a click pauses and resumes it. Reloading resets it.
- `data-dais-limit` is your slot in minutes. The clock turns amber at 80% of
  it and red when you're over. Omit the attribute for a plain stopwatch.
- Without `dais.js` the element stays empty and hidden, so it never leaves a
  gap in the control bar.

Practical presenting notes:

- **Resolution independence:** the deck letterboxes to a 16:9 area of
  whatever screen it's on. Change shape per-deck with
  `:root { --dais-aspect: 4 / 3 }`.
- **Resuming:** with `dais.js`, reloading the page (projector hiccup,
  accidental navigation) returns you to the slide in the URL.
- **A second screen for notes** isn't built in (that genuinely needs JS and a
  second window). The pragmatic pattern: open the deck twice — audience copy
  fullscreen, your copy with Notes toggled on, and advance both, or print
  the notes view to paper like it's 1997. It rules.

## 7. Printing and PDF export

1. Open the print dialog (<kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>P</kbd>).
2. Destination: **Save as PDF**. Margins: none/default. Background graphics:
   **on** (for themes).
3. Each slide becomes one page, sized from `--dais-aspect` — 320 × 180 mm at
   the default 16:9, 240 × 180 mm if you set `4 / 3`. Reveal content is fully
   visible; a stepped slide expands to one page per step (§4); controls, dots,
   and the progress bar disappear.
4. Add `class="dais-print-notes"` to `<body>` to print speaker notes on each
   slide.

Page height comes from `--dais-page-height` (`180mm`); the width is always
derived from it and the aspect ratio, so you never set the two independently.

Themes may re-tokenize for paper — the spooky theme, for instance, swaps its
midnight palette for an ink-friendly one under `@media print`.

## 8. Headings on visual slides

Every slide needs a heading for the document outline, but some slides are
visually just an image or a word. Two good options:

- Use the `media-full` template — its `<h2>` doubles as the caption bar.
- Keep the heading but make your own CSS hide it visually. If you do, hide it
  accessibly (position off-canvas), never with `display: none`:

```css
.visually-hidden {
  position: absolute;
  width: 1px; height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
```

## 9. Custom styling

Dais deliberately covers little. To style one deck, add a `<style>` block (or
another stylesheet) after the framework and write normal CSS:

```css
/* This deck only: chunkier headings, brand accent */
:root {
  --dais-accent: #7c3aed;
  --dais-font-display: "Recursive", var(--dais-font);
}

#pricing table td { font-variant-numeric: tabular-nums; }
```

To restyle *every* deck you make, that same block is the start of a theme —
see [theming.md](theming.md).
