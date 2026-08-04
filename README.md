# Dais

**Slides are just a web page.** Dais is a presentation framework that is one
CSS file and an HTML convention: write real, semantic HTML, link `dais.css`,
and you have a PowerPoint-style deck that runs in any modern browser — with
navigation, incremental reveals, speaker notes, an overview grid, and
print-to-PDF, all **without JavaScript**.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My talk</title>
  <link rel="stylesheet" href="dais.css">
  <script src="dais.js" defer></script> <!-- optional niceties -->
</head>
<body>
  <main class="dais" aria-label="My talk" tabindex="0">

    <section class="slide title" id="intro">
      <h1>My talk</h1>
      <p>Me · Some conference</p>
    </section>

    <section class="slide" id="one-idea">
      <h2>Every slide is a &lt;section&gt; with a heading</h2>
      <ul class="reveal">
        <li>Bullets can appear one by one</li>
        <li>With zero JavaScript</li>
      </ul>
      <aside class="notes">Speaker notes go here. The audience never sees them.</aside>
    </section>

  </main>
</body>
</html>
```

That is a complete, working presentation.

## Install

Dais is distributed as plain files — there is no runtime dependency and nothing
to compile. Take it from npm:

```
npm install @arrowood.dev/dais
```

```html
<link rel="stylesheet" href="node_modules/@arrowood.dev/dais/dais.css">
<link rel="stylesheet" href="node_modules/@arrowood.dev/dais/themes/midnight.css">
<script src="node_modules/@arrowood.dev/dais/dais.js" defer></script>
```

Bundlers and import maps can resolve the same files through the package's
`exports` (`@arrowood.dev/dais/dais.css`, `.../themes/midnight.css`, …).

Or just **copy `dais.css` into your project and commit it.** A deck you present
next year should not depend on a package resolving next year — vendoring is a
first-class way to use Dais, not a workaround.

Either way, `dais-serve` gives you a local preview of whatever directory you
run it in:

```
npx dais-serve      # -> http://localhost:4321
```

## Try it

Open any of the examples straight from disk — no server, no build:

- [examples/default.html](examples/default.html) — the kitchen sink, and a
  self-documenting tour of every feature
- [examples/fantasy.html](examples/fantasy.html) — the 🏰 **fantasy** theme
  (parchment, gold, dragons)
- [examples/spooky.html](examples/spooky.html) — the 👻 **spooky** theme
  (midnight purple, pumpkins, one tasteful cobweb)
- [examples/midnight.html](examples/midnight.html) — the **midnight** theme:
  a restrained dark deck for technical talks, with syntax-highlighted code,
  line callouts, a benchmark table, and the presenter timer

Or serve the directory and browse from a landing page:

```
node serve.mjs      # -> http://localhost:4321
```

## What you get

| Feature | How | JS needed? |
|---|---|---|
| Slide navigation | Scroll snapping: swipe, trackpad, scrollbar, keyboard; pure-CSS arrows & dots | No |
| Deep links | Every slide has an `id`; `talk.html#that-slide` just works | No |
| Incremental reveals | `class="reveal"` on a list; items animate in when the slide snaps into view | No |
| Speaker notes | `<aside class="notes">`, toggled with a checkbox (or press <kbd>S</kbd>) | No |
| Overview grid | Checkbox toggle (or press <kbd>O</kbd>) re-lays the deck as thumbnails | No |
| Print / PDF | <kbd>⌘P</kbd> → Save as PDF; one 16:9 page per slide | No |
| Progress bar | Optional element driven by a scroll timeline | No |
| Presenter timer | `<output class="dais-timer" data-dais-limit="30">` — auto-starts, warns at 80% of your slot | Yes |
| Arrow keys from anywhere, `n / N` counter, URL hash sync, click-a-thumbnail | `dais.js` (dependency-free, optional) | Yes |

Because slides are semantic HTML (`<main>` → `<section>` → headings, lists,
figures), the deck is also a readable document: with CSS off, in a screen
reader, in Reader Mode, or in a search index.

## Files

```
dais.css            the framework (engine + templates + utilities + print)
dais.js             optional progressive enhancement
themes/midnight.css drop-in theme: restrained dark, built for code
themes/fantasy.css  drop-in theme: dragons & castles
themes/spooky.css   drop-in theme: Halloween
examples/           four complete decks
index.html          landing page linking the examples and docs
serve.mjs           zero-dependency static server (also the dais-serve bin)
docs/               human documentation (start with authoring.md)
AGENTS.md           condensed rules for AI coding agents
DESIGN.md           research notes and architectural rationale
```

## Documentation

- **[docs/authoring.md](docs/authoring.md)** — writing a deck: skeleton,
  slide templates, reveals, notes, overview, printing, keyboard controls
- **[docs/theming.md](docs/theming.md)** — the design tokens and how to build
  a theme (or restyle a single deck)
- **[docs/reference.md](docs/reference.md)** — every class, element
  convention, custom property, and keyboard shortcut
- **[docs/accessibility.md](docs/accessibility.md)** — what Dais does for
  you and what remains your job as an author

## Browser support

Dais targets **current evergreen browsers** and degrades gracefully:

- Core presenting (scroll-snap slides, templates, notes, overview, print):
  all current Chrome, Edge, Firefox, Safari.
- Pure-CSS arrows and dots (`::scroll-button` / `::scroll-marker`) and
  snap-triggered reveals (`scroll-state()` queries): Chromium 135+ today;
  other browsers simply don't show the extras — scrolling, deep links, and
  (with `dais.js`) arrow keys still navigate, and reveal content shows
  immediately instead of animating.
- The progress bar (scroll-driven animations): Chromium and Firefox today.

No polyfills, by design. The deck you write today gets better as browsers
ship the remaining pieces.

## Philosophy

1. **HTML and CSS are enough.** JavaScript is an optional garnish, never a
   requirement to show your slides.
2. **Semantics are the framework.** If your deck wouldn't read sensibly as a
   plain document, Dais considers that a bug in the deck.
3. **Not a design system.** A handful of templates and utilities; for
   everything else, write CSS. Dais stays out of your way.

## License

[MIT](LICENSE) © Ethan Arrowood
