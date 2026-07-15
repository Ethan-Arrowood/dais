# Theming

A Dais theme is a CSS file linked **after** `dais.css`. At minimum it
re-declares design tokens on `:root`; it may also add flourishes with
ordinary selectors. No classes, attributes, or JS hooks are involved.

```html
<link rel="stylesheet" href="dais.css">
<link rel="stylesheet" href="themes/spooky.css">
```

## The tokens

| Token | Controls | Default |
|---|---|---|
| `--dais-aspect` | Slide aspect ratio | `16 / 9` |
| `--dais-stage` | The letterbox area around the deck | near-black |
| `--dais-bg` | Slide background | warm white |
| `--dais-surface` | Cards, inline code chips, note panels | light gray |
| `--dais-text` | Body text | near-black |
| `--dais-muted` | Secondary text, slide numbers, captions | gray |
| `--dais-accent` | Headings, links, markers, active dot, divider bg | blue |
| `--dais-accent-2` | `<strong>`, `<mark>`, secondary highlights | red |
| `--dais-code-bg` / `--dais-code-text` | Code blocks | dark / light |
| `--dais-font` | Body font stack | system-ui stack |
| `--dais-font-display` | Headings | inherits `--dais-font` |
| `--dais-font-mono` | Code | ui-monospace stack |
| `--dais-radius` | Corner rounding | `0.5cqi` |
| `--dais-slide-padding` | Slide inset | `5% 7%` |
| `--dais-reveal-step` | Delay between reveal items | `0.35s` |

A complete, respectable theme can be nothing but a `:root` block overriding
six colors and a font.

## Contrast requirements

Keep these pairs at **WCAG AA for large text (3:1) or better — aim for
4.5:1**:

- `--dais-text` on `--dais-bg` (aim ≥ 7:1; it's a projector)
- `--dais-accent` on `--dais-bg` (headings)
- `--dais-bg` on `--dais-accent` (divider slides invert)
- `--dais-muted` on `--dais-bg` (≥ 4.5:1; it's still content)
- `--dais-code-text` on `--dais-code-bg`

Projectors crush contrast dramatically — if a pairing looks marginal on your
laptop, it is unreadable on stage.

## Flourishes

Beyond tokens, themes may style Dais's stable selectors. The bundled themes
are the reference examples:

- [`themes/fantasy.css`](../themes/fantasy.css) — parchment texture
  (layered gradients), a gilded double-rule frame (`section::before`),
  small-caps headings with a fleuron, ⚔ list markers, a castle over the
  title, crenellated banner dividers, illuminated drop caps on quotes.
- [`themes/spooky.css`](../themes/spooky.css) — midnight palette, ground
  fog and a gradient-drawn cobweb, glowing headings, 🎃 list markers, a
  drifting ghost over the title, a flicker-on title animation, and an
  ink-friendly palette swap under `@media print`.

Conventions that keep a theme well-behaved:

1. **Override tokens first**; add selectors only for what tokens can't express.
2. **Scope everything to `.dais`** so a theme never leaks into surrounding
   page content (decks embedded in other pages).
3. **Decorative pseudo-element text/emoji must use alt-text syntax** —
   `content: "🐉" / "";` — so screen readers skip it.
4. **Gate animation** behind `@media (prefers-reduced-motion: no-preference)`.
5. **Reserve `section::before` for theme decoration** (the framework uses
   `section::after` for slide numbers). If you need both, decorate a heading
   or use extra gradients on the section background instead.
6. **Check print.** Dark themes should re-tokenize under `@media print` like
   spooky does; nobody wants to toner-bomb a midnight-purple handout.
7. **Fonts:** prefer system font stacks or self-hosted files. If you point at
   a webfont service, leave the `@import` commented with instructions, like
   the bundled themes do — decks should work from a USB stick in airplane
   mode.

## Per-deck overrides vs. themes

The mechanism is identical — CSS after `dais.css`. Put it in a `<style>`
block for a one-off deck; promote it to a file in `themes/` when a second
deck wants it.
