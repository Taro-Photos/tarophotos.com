# TARO Design System — build conventions

A quiet, paper-on-ink editorial system for photography. **English-led, Japanese-accented.** One warm surface — there is **no dark mode**; never add a theme toggle.

## Setup

No provider or theme wrapper is needed. All styling ships in `styles.css` (design tokens as `:root` vars, Tailwind utilities, the `.ds-*` classes, and component CSS), which the render environment loads globally. Just render components — the paper background, ink text, and three typefaces apply on their own.

## Styling idiom — two layers, one set of tokens

**1. Tailwind utilities** for your own layout/glue. The tokens are exposed as utilities — use these names, don't invent hex values:

- Color: `bg-paper` `bg-paper-deep` `bg-ink` · `text-ink` `text-warm-grey` · `border-hair` (also `bg-warm-grey` `bg-hair`)
- Type family: `font-serif` (Cormorant Garamond — display & body), `font-mincho` (Shippori Mincho — Japanese only), `font-ui` (Inter — labels, nav, metadata)
- Type scale: `text-display` `text-title` `text-heading` `text-subhead` `text-lede` `text-body` `text-meta` `text-ui` `text-ui-sm`
- Tracking: `tracking-eyebrow` (widest, kickers) `tracking-nav` `tracking-wide` `tracking-wider` `tracking-mark`

**2. Primitives** for the recurring micro-typography — prefer these over re-styling raw text:

- `<Wrap>` — centered content column (max 1440px + responsive gutter). Every section sits inside one.
- `<Eyebrow>` — uppercase UI-sans kicker / section label.
- `<Num>` — tabular sequence number (`01 / 06`).
- `<Exif>` — smallest UI-sans capture-metadata line.
- `<Ja>` — Japanese accent in mincho (sets `lang="ja"` for you).
- `<Bi en="…" ja="…">` — EN-led bilingual pair (English primary; mincho JA appended — add a leading `　` for spacing).
- `<Hairline>` — 1px hair-toned divider.

The composed sections (`Hero` `About` `SeriesIndex` `WorksIndex` `SeriesDetail` `SiteHeader` `SiteFooter` `LegalPage` `ContactForm`) render on-brand content out of the box; `WorksIndex` / `SeriesDetail` / `ContactForm` take props — see each `<Name>.d.ts`. Images are plain `<img>`: pass a real `src` (a `data:`/`https:` URL); a bare `/…` path renders as a paper-toned placeholder frame.

## Bilingual rule

English leads; Japanese is a quiet accent set in `font-mincho` with `lang="ja"` — use `<Ja>` / `<Bi>` or the `font-mincho` utility. **Never set Japanese in the serif.**

## Japanese line-breaking (kinsoku)

Japanese wraps with the browser's native kinsoku — `[lang="ja"]` already sets `line-break: strict`, so a line never starts with `。、）」` or small kana. **Do not add `word-break: keep-all` together with `overflow-wrap: anywhere`** to Japanese text: that combo defeats kinsoku and orphans the closing `。` onto its own line at some widths (worse on iOS Safari/WebKit). Let JA text wrap natively; only add `white-space: nowrap` to a short label that must stay on one line. Never gate vertical text (`writing-mode: vertical-*`) on a fixed `height` — it wraps into extra columns on mobile.

## Where the truth lives

Read `styles.css` and its imports (tokens, utilities, `.ds-*`) before styling; read each component's `<Name>.d.ts` (props) and `<Name>.prompt.md` (usage).

## Idiomatic snippet

```tsx
<Wrap as="section" className="bg-paper text-ink">
  <Eyebrow>Selected Work</Eyebrow>
  <h2 className="font-serif text-heading">First Light Voyage</h2>
  <p className="font-mincho text-warm-grey text-subhead">夜明けの航跡</p>
  <p className="font-serif text-body">The harbor before anyone arrives; I waited.</p>
  <Hairline />
  <Exif>SONY α7R IV · 24mm · ƒ/8 · 30s · ISO 64</Exif>
</Wrap>
```
