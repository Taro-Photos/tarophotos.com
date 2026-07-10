import { test, expect } from "@playwright/test";

// 日本語の行頭禁則（kinsoku）検証。行頭に句読点・閉じ括弧・拗促音・長音などが
// 来る折り返し（例:「…迎えにいく」＋改行＋「。」の孤立）を実描画で検出する。
//
// 設計上の要点:
//  - orphan は「句読点直前までが1行にちょうど収まる」幅でだけ起きる＝幅依存。
//    単一幅では取りこぼすため、複数の代表幅をスイープする。
//  - 縦書き（writing-mode: vertical-*）は行の概念が異なるため除外（別ガードが担当）。
//  - DS の render-check（デスクトップ・分離コンポーネント）では届かない層。
const ROUTES = [
  "/",
  "/about",
  "/contact",
  "/concept",
  "/journal",
  "/journal/waiting-for-first-light",
  "/works",
  "/works/first-light-voyage",
  "/legal",
];

// orphan は狭い幅バンドでのみ起きるため、mobile〜小型タブレットを細かく刻む。
const WIDTHS: number[] = [];
for (let w = 320; w <= 520; w += 6) WIDTHS.push(w);
WIDTHS.push(600, 768);

// 行頭に置いてはいけない文字（行頭禁則）。閉じ括弧・句読点・小書き仮名・長音・中黒。
const FORBIDDEN_LEADING =
  "、。，．・：；！？)]｝）〕】》」』〉‐ー～ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮ";

// ルート単位に 1 テスト（各テストが独自の timeout 予算を持ち、worker 間で並列化。
// 全ルート×全幅を 1 テストに詰めると CI の WebKit で 30s を超えるため分割する）。
for (const route of ROUTES) {
  test(`JA line-head kinsoku — ${route}`, async ({ page }) => {
    const all: string[] = [];
    await page.goto(route, { waitUntil: "networkidle" });
    // フォントは幅で変わらないのでルート毎に一度だけ待つ。
    await page.evaluate(() => document.fonts.ready);

    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      const violations = await page.evaluate((forbidden) => {
        const isJa = (s: string) => /[぀-ヿ㐀-鿿]/.test(s);
        const out: { line: string; first: string; where: string }[] = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let n: Node | null;
        while ((n = walker.nextNode())) {
          const node = n as Text;
          const content = node.textContent ?? "";
          if (!content.trim() || !isJa(content)) continue;
          const el = node.parentElement;
          if (el) {
            const wm = getComputedStyle(el).writingMode;
            if (wm.startsWith("vertical")) continue; // 縦書きは別ガード
          }
          const range = document.createRange();
          const lines = new Map<number, string>();
          for (let i = 0; i < content.length; i++) {
            if (content[i] === "\n") continue;
            try {
              range.setStart(node, i);
              range.setEnd(node, i + 1);
            } catch {
              continue;
            }
            const rects = range.getClientRects();
            if (!rects.length) continue;
            const top = Math.round(rects[0].top);
            lines.set(top, (lines.get(top) ?? "") + content[i]);
          }
          const ordered = [...lines.entries()].sort((a, b) => a[0] - b[0]).map((e) => e[1]);
          for (let li = 1; li < ordered.length; li++) {
            const first = [...ordered[li]].find((c) => c.trim());
            if (first && forbidden.includes(first)) {
              const where = el
                ? `${el.tagName.toLowerCase()}.${(el.className || "").toString().trim().split(/\s+/)[0]}`
                : "?";
              out.push({ line: ordered[li], first, where });
            }
          }
        }
        return out;
      }, FORBIDDEN_LEADING);

      for (const v of violations) {
        all.push(`${route} @${width}px [${v.where}] 行頭"${v.first}" 行:"${v.line}"`);
      }
    }

    expect(
      Array.from(new Set(all)),
      `日本語の行頭禁則違反（行頭に句読点等）:\n${Array.from(new Set(all))
        .map((s) => `  - ${s}`)
        .join("\n")}`,
    ).toEqual([]);
  });
}
