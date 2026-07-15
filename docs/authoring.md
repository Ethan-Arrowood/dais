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

  <main class="dais" aria-label="Talk title" tabindex="0">
    <!-- slides go here -->
  </main>

</body>
</html>
```

Rules that keep decks semantic and accessible:

- The deck container is a **`<main class="dais">`** with an `aria-label`
  naming the talk and `tabindex="0"` (so keyboard users in every browser can
  focus the scroller and use arrow keys).
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

## 4. Speaker notes

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

## 5. Presenting

| Action | Zero-JS | With dais.js |
|---|---|---|
| Next / previous | swipe, trackpad, scrollbar, dots, edge arrows; <kbd>Tab</kbd> to the deck then <kbd>←</kbd>/<kbd>→</kbd> | <kbd>←</kbd>/<kbd>→</kbd>/<kbd>Space</kbd>/<kbd>PgUp</kbd>/<kbd>PgDn</kbd> from anywhere |
| First / last slide | <kbd>Home</kbd>/<kbd>End</kbd> (deck focused) | <kbd>Home</kbd>/<kbd>End</kbd> anywhere |
| Overview grid | Overview checkbox | <kbd>O</kbd>; click a thumbnail to jump; <kbd>Esc</kbd> exits |
| Speaker notes | Notes checkbox | <kbd>S</kbd> |
| Jump to a slide | edit the URL hash | URL hash follows you as you present |
| Fullscreen | the browser's own key (<kbd>F11</kbd> / <kbd>⌃⌘F</kbd>) | same |

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

## 6. Printing and PDF export

1. Open the print dialog (<kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>P</kbd>).
2. Destination: **Save as PDF**. Margins: none/default. Background graphics:
   **on** (for themes).
3. Each slide becomes one 16:9 page. Reveal content is fully visible;
   controls, dots, and the progress bar disappear.
4. Add `class="dais-print-notes"` to `<body>` to print speaker notes on each
   slide.

Themes may re-tokenize for paper — the spooky theme, for instance, swaps its
midnight palette for an ink-friendly one under `@media print`.

## 7. Headings on visual slides

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

## 8. Custom styling

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
