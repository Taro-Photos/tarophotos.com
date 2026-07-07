// Pre-build for the TARO Design System.
//
// The DS is inline TSX inside the Next app (no library dist) and the app's
// tsconfig pins `jsx: "preserve"`, which esbuild maps to the classic runtime —
// but the source never imports React, so classic breaks. This build owns the
// transform (jsx: automatic), aliases next/image + next/link to render-safe
// shims, resolves the `@/` path alias, and extracts CSS-module styles. It
// emits a clean ESM dist that package-build.mjs re-wraps into the IIFE bundle.
//
// Output: .design-sync/dist/ds.mjs  (ESM, react/react-dom external)
//         .design-sync/dist/ds.css  (CSS-module styles, scoped class names)
//
// Usage: node .design-sync/build-ds.mjs <repo-root>

import { build } from "esbuild";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const isFile = (p) => existsSync(p) && statSync(p).isFile();

const REPO = resolve(process.argv[2] || ".");
const SRC = join(REPO, "apps/web/src");
const OUT = join(REPO, ".design-sync/dist");
mkdirSync(OUT, { recursive: true });

// Resolve `@/<x>` → apps/web/src/<x> (the app's only path alias).
const atAlias = {
  name: "at-alias",
  setup(b) {
    b.onResolve({ filter: /^@\// }, (args) => {
      const rest = args.path.slice(2);
      const exts = [".ts", ".tsx", ".js", ".jsx", ".json", "/index.ts", "/index.tsx", "/index.js", ""];
      for (const ext of exts) {
        const p = join(SRC, rest + ext);
        if (isFile(p)) return { path: p };
      }
      return undefined;
    });
  },
};

const result = await build({
  entryPoints: [join(REPO, ".design-sync/ds-entry.ts")],
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2020",
  jsx: "automatic",
  outfile: join(OUT, "ds.mjs"),
  // react-family stays external — package-build's reactShim binds it to
  // window.React at final-bundle time.
  external: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  alias: {
    "next/image": join(REPO, ".design-sync/shims/next-image.tsx"),
    "next/link": join(REPO, ".design-sync/shims/next-link.tsx"),
  },
  plugins: [atAlias],
  loader: {
    ".png": "dataurl",
    ".jpg": "dataurl",
    ".jpeg": "dataurl",
    ".webp": "dataurl",
    ".avif": "dataurl",
    ".svg": "dataurl",
    ".json": "json",
  },
  define: {
    "process.env.NODE_ENV": '"development"',
    // contact.ts reads this at module scope; bake a sane value so the render
    // env has no `process`. The trailing `process.env` → {} makes any other
    // NEXT_PUBLIC_* access resolve to undefined instead of crashing the IIFE.
    "process.env.NEXT_PUBLIC_PRIMARY_CONTACT_EMAIL": '"hello@tarophotos.com"',
    "process.env": "{}",
  },
  metafile: true,
  logLevel: "info",
});

const outs = Object.keys(result.metafile.outputs);
console.error("build-ds outputs:", outs.join(", "));
