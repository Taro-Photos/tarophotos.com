import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import { describe, it, expect } from "vitest";
import { glob } from "tinyglobby";

// 縦書き（writing-mode: vertical-*）を固定 height に依存して段組みさせると、
// ビューポートが縦に足りないモバイルで句の途中で改行される（2026-07-08 の
// 「余白に、想いが宿る」の不具合）。root-cause を静的に禁じるガード。
//
// 許容パターン: writing-mode: vertical-* を使うルールでは
//   - 固定 height（px/rem/em/vh 等の数値）を付けない、または
//   - white-space: nowrap を併記して句を割らせない
// のいずれかであること。

const here = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(here, "..");

type Rule = { selector: string; body: string };

// 極簡易な CSS ルール分割（@media 等のネストは中身のルールも個別にマッチする）。
function parseRules(css: string): Rule[] {
  const rules: Rule[] = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) {
    const selector = m[1].trim();
    const body = m[2];
    if (selector.startsWith("@")) continue; // at-rule のヘッダ行はスキップ（中身は別マッチ）
    rules.push({ selector, body });
  }
  return rules;
}

const FIXED_HEIGHT = /(?:^|[;{\s])(?:max-)?height\s*:\s*(-?[\d.]+)(px|rem|em|vh|vw|pt)\b/i;

describe("CSS conventions — vertical writing must not depend on a fixed height", () => {
  it("no writing-mode: vertical-* rule sets a fixed height without white-space: nowrap", async () => {
    const files = await glob("**/*.module.css", { cwd: srcRoot, absolute: true });
    const offenders: string[] = [];

    for (const file of files) {
      const css = readFileSync(file, "utf8");
      for (const { selector, body } of parseRules(css)) {
        if (!/writing-mode\s*:\s*vertical/i.test(body)) continue;
        const hasFixedHeight = FIXED_HEIGHT.test(body);
        const hasNowrap = /white-space\s*:\s*nowrap/i.test(body);
        if (hasFixedHeight && !hasNowrap) {
          offenders.push(`${relative(srcRoot, file)} { ${selector} }`);
        }
      }
    }

    expect(
      offenders,
      `縦書きルールが固定 height に依存しています（モバイルで句割れの原因）。` +
        `height を撤去するか white-space: nowrap を併記してください:\n` +
        offenders.map((o) => `  - ${o}`).join("\n"),
    ).toEqual([]);
  });

  // `word-break: keep-all` + `overflow-wrap: anywhere` の併用は、日本語の
  // ブラウザ標準禁則を無効化し、句読点終わりの文で「。」を行頭に孤立させる
  // （2026-07-08 About/Contact の句点孤立）。JA は line-break: strict のネイティブ
  // 禁則に任せ、1 行固定が必要な短句だけ white-space: nowrap を使う。
  it("no rule combines word-break: keep-all with overflow-wrap: anywhere (breaks JA kinsoku)", async () => {
    const files = await glob("**/*.module.css", { cwd: srcRoot, absolute: true });
    const offenders: string[] = [];

    for (const file of files) {
      const css = readFileSync(file, "utf8");
      for (const { selector, body } of parseRules(css)) {
        const keepAll = /word-break\s*:\s*keep-all/i.test(body);
        const anywhere = /overflow-wrap\s*:\s*anywhere/i.test(body);
        if (keepAll && anywhere) {
          offenders.push(`${relative(srcRoot, file)} { ${selector} }`);
        }
      }
    }

    expect(
      offenders,
      `keep-all + overflow-wrap:anywhere の併用は禁則を壊します。` +
        `折返す JA は指定を外して line-break:strict に任せ、1 行固定の短句のみ ` +
        `white-space: nowrap を使ってください:\n` + offenders.map((o) => `  - ${o}`).join("\n"),
    ).toEqual([]);
  });
});
