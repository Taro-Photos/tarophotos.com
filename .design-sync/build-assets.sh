#!/usr/bin/env bash
# Regenerate the three design-sync build inputs, in order. Deterministic — safe
# to re-run before every package-build / resync.
#   1. ds.mjs  + ds.css   (pre-built ESM bundle + CSS-module styles)
#   2. tailwind.css       (compiled Tailwind v4: tokens + base + utilities)
#   3. cssentry.css       (tailwind.css ++ ds.css) → cfg.cssEntry
set -euo pipefail
R="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$R"

# Self-hosted fonts are network-fetched; skip if already present (fonts-src/ is
# gitignored, so a fresh clone re-fetches).
if [ ! -f .design-sync/fonts-src/fonts.css ]; then
  node .design-sync/fetch-fonts.mjs .design-sync/fonts-src
fi

node .design-sync/build-ds.mjs "$R"
node .ds-sync/node_modules/@tailwindcss/cli/dist/index.mjs \
  -i .design-sync/tw-entry.css -o .design-sync/dist/tailwind.css

# Tailwind first (tokens/:root, base, utilities — layered), then the CSS-module
# styles (unlayered → win over utilities, exactly as Next serves them).
cat .design-sync/dist/tailwind.css .design-sync/dist/ds.css > .design-sync/dist/cssentry.css
echo "cssentry.css: $(wc -c < .design-sync/dist/cssentry.css) bytes"
