# Reference

Terse and complete. Tutorial: [authoring.md](authoring.md).

## Required structure

```
body
└── main.dais[aria-label][tabindex=0]     the deck (scroll container)
    (add .dais-dots for slide dots, .dais-arrows for edge arrows)
    └── section.slide[id] (×N)            one per slide, direct children only
        ├── h1 (title slide, exactly one per deck) / h2 (all other slides)
        └── …any HTML…
```

## Optional structure

```
nav.dais-controls[aria-label]             fixed control cluster (top-right)
├── label > input[type=checkbox].dais-overview-toggle
├── label > input[type=checkbox].dais-notes-toggle
├── output.dais-counter                   filled with "n / N" by dais.js
└── output.dais-timer[data-dais-limit]    presenter clock, driven by dais.js

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

## Attributes on `<section>`

| Attribute | Effect |
|---|---|
| `data-dais-steps="N"` | Declare a stepped slide with `N` steps when no per-element `.step`/`[data-step]` markers carry the count (drive visuals off `--dais-step`) |
| `data-dais-step="k"` | Written by `dais.js` — the slide's current step (`0` = nothing active); mirror of `--dais-step` for attribute selectors |

## Classes inside a slide

| Class | Effect |
|---|---|
| `reveal` | Direct children appear one by one when the slide snaps in (see below) |
| `step` | Additive fragment: hidden until its step is reached (via Right/Space), then stays (see Step semantics) |
| `step-active` / `step-current` | Written by `dais.js` on step elements — order ≤ current / order == current; deck-authored styling hooks |
| `data-step="k"` (attribute) | Participate in stepping at order `k` with no built-in visual; for stationary elements (e.g. `<tr>`) that only change emphasis |
| `cols` | Equal-column grid; column count via `--cols` (default 2) |
| `stack` | Tight vertical flex group |
| `center` | Center a region's content |
| `spacer` | Flexible filler; pushes following content to the slide bottom |
| `card` | Surface-colored rounded panel |
| `num` (on `<th>`/`<td>`) | Right-align a numeric column |
| `line` (in `<pre>`) | One code line; combine with `hl`, `dim`, `add`, `del` |
| `hl` / `dim` / `add` / `del` | Call out / recede / diff-add / diff-remove |
| `tok-comment` `tok-keyword` `tok-string` `tok-number` `tok-fn` `tok-type` `tok-punct` | Syntax colors; author-time only, never applied at runtime |
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
| `--dais-tok-comment` | `#8792a2` | `.tok-comment` |
| `--dais-tok-keyword` | `#c792ea` | `.tok-keyword` |
| `--dais-tok-string` | `#a5d6a7` | `.tok-string` |
| `--dais-tok-number` | `#f2a071` | `.tok-number` |
| `--dais-tok-fn` | `#82aaff` | `.tok-fn` |
| `--dais-tok-type` | `#7fdbca` | `.tok-type` |
| `--dais-tok-punct` | `#99a3b3` | `.tok-punct` |
| `--dais-font` | system-ui stack | Body |
| `--dais-font-display` | `var(--dais-font)` | h1–h3 |
| `--dais-font-mono` | ui-monospace stack | code, kbd |
| `--dais-radius` | `0.5cqi` | Corners |
| `--dais-slide-padding` | `5% 7%` | Slide inset (% = width-relative) |
| `--dais-reveal-step` | `0.35s` | Reveal stagger; settable per `.reveal` element |
| `--dais-code-size` | `0.72em` | `<pre>` size; settable per block |
| `--dais-page-height` | `180mm` | Printed page height; width = height x `--dais-aspect` |
| `--cols` | `2` | Column count for `.cols`; set inline |
| `--dais-step` | `0` | Written by `dais.js` — current step on a stepped section |

## Type scale (all width-relative)

| Element | Size |
|---|---|
| `h1` | 6.4cqi |
| `h2` | 4.6cqi |
| `h3` | 3cqi |
| body | 2.4cqi |
| `.fit` | 8cqi |
| `pre` | `--dais-code-size` (0.72em of context) |
| `table` | 0.85em of context |
| `.small` | 0.7em of context |
| notes overlay | 1.8cqi |
| slide number | 1.4cqi |

`1cqi` = 1% of slide width (≈ 12.8px at 720p fullscreen, ≈ 19.2px at 1080p).

## Keyboard

| Key | Requires | Action |
|---|---|---|
| <kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd> <kbd>PgUp</kbd> <kbd>PgDn</kbd> <kbd>Home</kbd> <kbd>End</kbd> | nothing (deck focused) | native scroll navigation |
| same keys + <kbd>Space</kbd>, from anywhere | dais.js | previous/next/first/last; on a stepped slide, <kbd>→</kbd>/<kbd>Space</kbd> advances one step before leaving, <kbd>←</kbd> reverses |
| <kbd>O</kbd> | dais.js + controls | toggle overview |
| <kbd>S</kbd> | dais.js + controls | toggle notes |
| <kbd>T</kbd> | dais.js + `.dais-timer` | pause / resume the presenter timer |
| <kbd>Esc</kbd> | dais.js + controls | exit overview |

## Reveal semantics

- Hidden state only applies in browsers supporting
  `container-type: scroll-state`; others show content immediately.
- Items get `animation-delay: 0.3s + n × --dais-reveal-step` (n = 0-indexed
  child position, capped at 11).
- Forced fully visible in: print, overview mode, `prefers-reduced-motion`.
- Replays on each re-entry of the slide.

## Step semantics

- A slide is stepped when it holds `.step` / `[data-step]` elements, or declares
  `data-dais-steps="N"`. Step count = the largest order present (explicit
  `data-step`, else DOM order among step elements), or `N`.
- <kbd>→</kbd>/<kbd>Space</kbd> advances the current step; only when it passes
  the last step does it move to the next section. <kbd>←</kbd> reverses; below
  step 0 it moves to the previous section.
- `dais.js` sets `--dais-step` / `data-dais-step` on the section, and toggles
  `.step-active` (order ≤ current) and `.step-current` (order == current) on
  step elements. `.step` additionally hides until active (built-in visual);
  `[data-step]` without `.step` gets no built-in visual — style the hooks.
- Entering a slide forward (or by scroll/jump) opens it at step 0; stepping
  **back** into a slide opens it fully revealed.
- Progressive enhancement: the hidden state is gated on the `dais-js` class,
  which `dais.js` adds only when it runs. Without JS, every step is visible
  (composed final state) — in the no-CSS reading order, print, and to screen
  readers. Never encode meaning only in a step.
- Print & overview: `dais.js` expands each stepped slide into one page /
  thumbnail per step (frozen clones; the source is hidden while expanded).
  Without JS, a stepped slide is a single composed page.

## Framework-reserved internals

Do not restyle/repurpose these: the `dais-slide` and `dais-deck` container
names, the `--dais-scroller` timeline, the `--dais` anchor name, counter
`dais-slide`, keyframes `dais-reveal` / `dais-progress-grow`, and
`section::after` (slide number). Themes decorate with `section::before`.
Also framework-managed (set by `dais.js`, don't hand-author): the `dais-js`,
`dais-clone`, and `dais-step-source` classes, and `--dais-step` /
`data-dais-step`. `.step-active` / `.step-current` are yours to style but not
to toggle.

## dais.js behaviors (all optional)

1. Generates missing slide `id`s (`slide-1`, `slide-2`, …).
2. Global keyboard navigation (table above); never intercepts keys inside
   `input`/`textarea`/`select`/`contenteditable`, or with modifiers held.
3. Honors an incoming `#hash` on load; keeps the hash updated on scroll via
   `history.replaceState` (no history spam).
4. Fills `.dais-counter` with `n / N`.
5. Runs `.dais-timer`: auto-starts on the first move off slide 1, <kbd>T</kbd>
   or click toggles, `data-dais-limit="<minutes>"` adds `.is-warn` at 80% and
   `.is-over` at 100%. Reload resets it.
6. In overview: click a slide (or a step clone) to close overview and jump to
   the underlying section.
7. Drives stepped slides (see Step semantics): step navigation, and expanding
   each stepped slide into one page/thumbnail per step for print and overview.
