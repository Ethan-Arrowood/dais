# Reference

Terse and complete. Tutorial: [authoring.md](authoring.md).

## Required structure

```
body
└── main.dais[aria-label][tabindex=0]     the deck (scroll container)
    └── section.slide[id] (×N)            one per slide, direct children only
        ├── h1 (title slide, exactly one per deck) / h2 (all other slides)
        └── …any HTML…
```

## Optional structure

```
nav.dais-controls[aria-label]             fixed control cluster (top-right)
├── label > input[type=checkbox].dais-overview-toggle
├── label > input[type=checkbox].dais-notes-toggle
└── output.dais-counter                   filled with "n / N" by dais.js

div.dais-progress[aria-hidden=true]       scroll-driven progress bar
section > aside.notes                     speaker notes (one per slide, last child)
body.dais-print-notes                     include notes when printing
```

## Classes on `<section>` (slide templates)

| Class | Effect |
|---|---|
| *(none)* | Column layout, heading top, content flows down |
| `title` | Centered hero; no slide number |
| `divider` | Inverted (accent bg) section break |
| `quote` | Vertically centered `<blockquote>` at display size |
| `media-full` | Zero padding; child `img`/`video` covers the slide; child `h2`/`figcaption` becomes a caption bar |
| `center` | Center content both axes |
| `no-number` | Suppress the slide number |

## Classes inside a slide

| Class | Effect |
|---|---|
| `reveal` | Direct children appear one by one when the slide snaps in (see below) |
| `cols` | Equal-column grid; column count via `--cols` (default 2) |
| `stack` | Tight vertical flex group |
| `center` | Center a region's content |
| `spacer` | Flexible filler; pushes following content to the slide bottom |
| `card` | Surface-colored rounded panel |
| `fit` | Giant statement type (8cqi, bold) |
| `muted` / `small` / `accent` / `accent-2` | Type color/size helpers |
| `notes` (on `<aside>`) | Speaker notes; hidden unless notes mode / printing with `dais-print-notes` |

## Custom properties

| Property | Default | Notes |
|---|---|---|
| `--dais-aspect` | `16 / 9` | Slide/deck aspect ratio |
| `--dais-stage` | `#14161a` | Letterbox color |
| `--dais-bg` | `#fdfdfc` | Slide background |
| `--dais-surface` | `#f1f2f4` | Cards, chips, notes |
| `--dais-text` | `#1d232b` | Body text |
| `--dais-muted` | `#5b6572` | Secondary text |
| `--dais-accent` | `#2451b2` | Headings, links, markers, divider bg |
| `--dais-accent-2` | `#b23524` | strong, mark, highlights |
| `--dais-code-bg` | `#14161a` | `<pre>` background |
| `--dais-code-text` | `#e8eaed` | `<pre>` text |
| `--dais-font` | system-ui stack | Body |
| `--dais-font-display` | `var(--dais-font)` | h1–h3 |
| `--dais-font-mono` | ui-monospace stack | code, kbd |
| `--dais-radius` | `0.5cqi` | Corners |
| `--dais-slide-padding` | `5% 7%` | Slide inset (% = width-relative) |
| `--dais-reveal-step` | `0.35s` | Reveal stagger; settable per `.reveal` element |
| `--cols` | `2` | Column count for `.cols`; set inline |

## Type scale (all width-relative)

| Element | Size |
|---|---|
| `h1` | 6.4cqi |
| `h2` | 4.6cqi |
| `h3` | 3cqi |
| body | 2.4cqi |
| `.fit` | 8cqi |
| `pre` | 0.72em of context |
| `.small` | 0.7em of context |
| notes overlay | 1.8cqi |
| slide number | 1.4cqi |

`1cqi` = 1% of slide width (≈ 12.8px at 720p fullscreen, ≈ 19.2px at 1080p).

## Keyboard

| Key | Requires | Action |
|---|---|---|
| <kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd> <kbd>PgUp</kbd> <kbd>PgDn</kbd> <kbd>Home</kbd> <kbd>End</kbd> | nothing (deck focused) | native scroll navigation |
| same keys + <kbd>Space</kbd>, from anywhere | dais.js | previous/next/first/last |
| <kbd>O</kbd> | dais.js + controls | toggle overview |
| <kbd>S</kbd> | dais.js + controls | toggle notes |
| <kbd>Esc</kbd> | dais.js + controls | exit overview |

## Reveal semantics

- Hidden state only applies in browsers supporting
  `container-type: scroll-state`; others show content immediately.
- Items get `animation-delay: 0.3s + n × --dais-reveal-step` (n = 0-indexed
  child position, capped at 11).
- Forced fully visible in: print, overview mode, `prefers-reduced-motion`.
- Replays on each re-entry of the slide.

## Framework-reserved internals

Do not restyle/repurpose these: the `dais-slide` and `dais-deck` container
names, the `--dais-scroller` timeline, the `--dais` anchor name, counter
`dais-slide`, keyframes `dais-reveal` / `dais-progress-grow`, and
`section::after` (slide number). Themes decorate with `section::before`.

## dais.js behaviors (all optional)

1. Generates missing slide `id`s (`slide-1`, `slide-2`, …).
2. Global keyboard navigation (table above); never intercepts keys inside
   `input`/`textarea`/`select`/`contenteditable`, or with modifiers held.
3. Honors an incoming `#hash` on load; keeps the hash updated on scroll via
   `history.replaceState` (no history spam).
4. Fills `.dais-counter` with `n / N`.
5. In overview: click a slide to close overview and jump to it.
