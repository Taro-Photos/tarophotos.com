// Self-host the DS's Google Fonts. Fetches the exact css2 URL the DS ships
// (GOOGLE_FONTS_HREF), downloads every referenced woff2, rewrites url()s to
// local ./ paths, and writes fonts.css. cfg.extraFonts points at that file;
// package-build's extractFonts copies the woff2 into fonts/ and ships them.
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const HREF =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&family=Shippori+Mincho:wght@400;500&display=swap";

const OUT = resolve(process.argv[2] || ".design-sync/fonts-src");
mkdirSync(OUT, { recursive: true });

// A modern Chrome UA → Google returns woff2 (smallest, universally supported).
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

const css = await (await fetch(HREF, { headers: { "User-Agent": UA } })).text();

// Split into @font-face blocks so we can name files per family+weight+style.
const blocks = [...css.matchAll(/\/\*[^*]*\*\/\s*@font-face\s*\{[^}]*\}|@font-face\s*\{[^}]*\}/g)].map(
  (m) => m[0],
);

let out = "";
let idx = 0;
let total = 0;
let dropped = 0;
const seen = new Map();
for (const block of blocks) {
  const fam = /font-family:\s*['"]([^'"]+)['"]/.exec(block)?.[1] ?? "font";
  const weight = /font-weight:\s*(\d+)/.exec(block)?.[1] ?? "400";
  const style = /font-style:\s*italic/.test(block) ? "i" : "n";
  const subset = /\/\*\s*([^*]+?)\s*\*\//.exec(block)?.[1] ?? "";
  // The Latin families (Cormorant Garamond, Inter) only ever set EN copy here —
  // keep latin/latin-ext, drop cyrillic/greek/vietnamese. Shippori Mincho
  // (the 和字 accent) keeps every Japanese subset.
  const isLatinFam = /Cormorant|Inter/i.test(fam);
  if (isLatinFam && !/latin/i.test(subset)) {
    dropped++;
    continue;
  }
  let rewritten = block;
  for (const m of block.matchAll(/url\((https:\/\/[^)]+\.woff2)\)/g)) {
    const url = m[1];
    const slug = `${fam.replace(/[^A-Za-z0-9]+/g, "")}-${weight}${style}-${idx++}.woff2`;
    const buf = Buffer.from(await (await fetch(url, { headers: { "User-Agent": UA } })).arrayBuffer());
    writeFileSync(join(OUT, slug), buf);
    total += buf.length;
    const perFam = (seen.get(fam) || 0) + buf.length;
    seen.set(fam, perFam);
    rewritten = rewritten.split(url).join(`./${slug}`);
  }
  out += rewritten.trim() + "\n";
}

writeFileSync(join(OUT, "fonts.css"), out);
console.error(`fonts: ${idx} woff2 files, ${(total / 1024).toFixed(0)} KB total (dropped ${dropped} non-latin subset blocks)`);
for (const [fam, bytes] of seen) console.error(`  ${fam}: ${(bytes / 1024).toFixed(0)} KB`);
