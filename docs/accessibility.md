# Accessibility

Dais treats accessibility as a structural property, not a feature flag. The
core idea: **a deck is a document**. If the HTML reads correctly as an
article — landmarks, heading outline, lists, alt text — then screen readers,
Reader Mode, keyboard users, and search engines all get a coherent
experience, because they're all consuming the same semantics the projector
audience sees.

## What the framework does

- **Landmark + outline navigation.** The deck is a `<main>`; each slide is a
  `<section>` with a heading (`<h1>` once, `<h2>` elsewhere). Screen-reader
  users can jump slide-to-slide with standard heading navigation — no custom
  keymap to learn.
- **Native scrolling = native accessibility.** Navigation is a real scroll
  container, not synthetic state. Focused links inside off-screen slides
  scroll them into view natively; browser find-in-page works; the scroller
  is keyboard-operable (the template's `tabindex="0"` guarantees focusability
  in all browsers, with a visible focus ring).
- **Pure-CSS controls are real controls.** The prev/next arrows and dots are
  browser-generated interactive pseudo-elements with accessible names
  (`content: "‹" / "Previous slide"`), focusable and keyboard-activatable.
  The notes/overview toggles are honest labelled checkboxes.
- **Decoration is silent.** All theme flourish glyphs (🐉, 🎃, ⚔, ❧…) are
  pseudo-element content with empty alt text (`content: "🐉" / ""`), so
  they are skipped by assistive tech.
- **Motion is optional.** `prefers-reduced-motion: reduce` disables smooth
  scrolling, reveal animation, and theme animations; reveal content is shown
  in full immediately. Reveals also never gate information behind interaction
  — the full content is always in the DOM, visible to assistive tech, print,
  and non-supporting browsers.
- **Contrast-safe defaults.** Default and bundled theme palettes keep body
  text near or above 7:1 and all meaningful pairs above 4.5:1 (see
  [theming.md](theming.md) for the pairs to check when you retheme).
- **Focus is never removed**, only restyled with `:focus-visible`.

## What remains the author's job

The framework can't write your content. The checklist:

1. **Alt text** on every informative image; `alt=""` on purely decorative
   ones. On `media-full` slides the image usually *is* the point — describe
   it.
2. **One `<h1>`, on the title slide only.** Don't skip heading levels; don't
   use headings for visual sizing (that's what `.fit` is for — on a `<p>`,
   with the real heading present, visually hidden if necessary; pattern in
   [authoring.md §7](authoring.md#7-headings-on-visual-slides)).
3. **Meaningful `id`s** (`#pricing`, not `#slide-7`) — they're your public
   deep-link API.
4. **Real lists for lists**, real `<blockquote>` for quotes, `<figure>` +
   `<figcaption>` for captioned media, `<table>` for tabular data.
5. **Don't rely on color alone** to distinguish series/states on charts and
   diagrams; projectors and color-blindness both erase hue distinctions.
6. **Link text** that names the destination — the deck doubles as a shareable
   document, where "click here" ages badly.
7. **Videos**: captions if there's speech; avoid autoplay with sound.
8. If you add your own animations, gate them behind
   `@media (prefers-reduced-motion: no-preference)` like the themes do.
9. **Language**: keep `lang` on `<html>` correct; mark inline language
   switches with `lang` attributes.

## Known limitations (prototype)

- The scroll-snap deck exposes slides as one long scrollable region; there's
  no `aria-roledescription="slide"` / "slide 3 of 12" announcement layer like
  reveal.js builds with JS. The heading outline substitutes for it, but if a
  future version adds richer announcements, it belongs in `dais.js` (e.g.,
  an `aria-live` region updated on scrollend) — never as a requirement for
  the core.
- `display: none` speaker notes are invisible to *everyone*, including
  screen-reader users in the audience who might benefit from them. Publishing
  a "notes visible" URL variant is a kind gesture.
- Overview mode's thumbnails are visual previews; slide text at thumbnail
  size is decorative in practice. The mode is a wayfinding aid, not the
  primary reading surface.
