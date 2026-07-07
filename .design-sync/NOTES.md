# design-sync notes — TARO Design System

The DS is **inline in the Next app** (`apps/web/src/design-system/` + `apps/web/src/components/`), not a standalone package. There is no `dist/`, so this sync gives it a purpose-built pre-build. Read this before any re-sync.

## Shape & wiring

- `cfg.pkg = "@taro/design-system"` is a **label only** (no such node_modules package). `--entry` points at the pre-built `.design-sync/dist/ds.mjs`, so `PKG_DIR` resolves to the **repo root**; `componentSrcMap` paths and `cfg.srcDir` are therefore repo-relative (`apps/web/src/...`).
- `--node-modules ./node_modules` = **repo root** (pnpm hoists react/react-dom/@types/react there; they are NOT in `apps/web/node_modules`).
- Global: `window.TaroDS`. 16 components in 7 groups (design-system / home / site / contact / works / series / legal).

## Build pipeline (one command: `bash .design-sync/build-assets.sh`)

1. `fetch-fonts.mjs` (only if `fonts-src/fonts.css` absent) — self-hosts the 3 Google families.
2. `build-ds.mjs` — esbuild pre-build of `ds-entry.ts` → `dist/ds.mjs` (ESM) + `dist/ds.css` (CSS-module styles). This exists to solve three things the converter can't:
   - **jsx**: the app tsconfig pins `jsx: "preserve"`, which esbuild maps to the classic runtime — but the source never imports React, so it breaks. The pre-build forces `jsx: "automatic"`.
   - **next/**: `next/image` + `next/link` are aliased to `.design-sync/shims/` (plain `<img>`/`<a>`).
   - **@/**: resolved to `apps/web/src` by a small esbuild plugin; CSS-modules extracted to `ds.css`.
3. Tailwind v4 CLI compiles `tw-entry.css` → `dist/tailwind.css` (tokens `:root` + `.ds-*` + utilities).
4. `cat tailwind.css ds.css > dist/cssentry.css` → `cfg.cssEntry`.

Then: `package-build.mjs` (bundles `ds.mjs`, copies `cssentry.css` into `_ds_bundle.css`, ships fonts) → `package-validate.mjs`.

## Gotchas (each cost a debug cycle)

- **`process.env.NEXT_PUBLIC_PRIMARY_CONTACT_EMAIL`** in `_content/contact.ts` crashes the IIFE (`process is not defined`) and kills `window.TaroDS`. `build-ds.mjs` `define`s it + `process.env → {}`. Any new `process.env.*` at module scope needs the same.
- **Shim edits fail silently**: `build-assets.sh` has `set -e`; if `build-ds.mjs` throws (e.g. a duplicate `const` name colliding with a stripped next/image prop like `placeholder`), the script aborts and `package-build` reuses a **stale `ds.mjs`**. Always confirm `build-ds` printed its outputs before trusting a rebuild.
- **Images**: every composed component references photos by runtime `/…` paths the design env doesn't serve. The `next/image` shim swaps any non-`data:`/`https:` src for a paper-toned placeholder frame so cards read clean. Real photos never ship.
- **Tailwind is on-demand**: `tw-entry.css` uses `@source inline(...)` to eagerly emit the FULL token-utility surface (all color/font/scale/tracking/leading utilities), or the agent's on-brand utilities that the app doesn't currently use would be missing.
- **Render check**: no Playwright chromium installed — drive the system Chrome via `DS_CHROMIUM_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"` (playwright pkg installed without browsers). Set it for `package-validate.mjs` AND `package-capture.mjs`.

## Known render warns

None outstanding. `[GRID_OVERFLOW]` for the full-width sections is resolved via `cfg.overrides.<Name>.cardMode = "column"` (Hero/About/SeriesIndex/SiteHeader/SiteFooter/LegalPage/WorksIndex/SeriesDetail).

## Re-sync risks (watch-list)

- **Fonts are network-fetched** (`fonts-src/` gitignored, ~8 MB, 260 woff2 — mostly Shippori Mincho Japanese, lazy-loaded per unicode-range at runtime). A fresh clone re-fetches from Google; if Google's css2 output changes, `@font-face` set changes.
- **Preview data for `WorksIndex` / `SeriesDetail`** is realistic **mock data inlined** in `.design-sync/previews/*.tsx` (not imported from `@/app/_content`), so it can drift from the real content type shapes. If those types change, update the mocks.
- **`build-ds.mjs` re-bundles the app source** — if the composed components gain a new external dep, a new `next/*` import, or a new module-scope `process.env`/`window` access, `build-ds` needs a matching alias/define.
- **Component API contracts** (`.d.ts`) come from ts-morph over the real source; complex `@/`-typed props may need `cfg.dtsPropsFor` if extraction weakens.
- All 16 previews are authored + graded good; grades live in gitignored `.cache/` and carry forward via the uploaded `_ds_sync.json`.
