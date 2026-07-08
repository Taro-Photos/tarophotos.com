import { test, expect } from "@playwright/test";

// 主要ルートを実描画し、応答レイアウトの健全性を検証する。
// mobile / desktop の両プロジェクトで各ルートを回す（playwright.config の projects）。
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

for (const route of ROUTES) {
  test(`no horizontal overflow: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });

    // ページ全体が横スクロールを生まない（レスポンシブ崩れの一次シグナル）。
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `page overflows horizontally by ${overflow}px`).toBeLessThanOrEqual(1);

    // 個別要素がビューポート幅を超えないこと（1px の丸め誤差は許容）。
    const wideEls = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const bad: string[] = [];
      for (const el of Array.from(document.body.querySelectorAll("*"))) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.right > vw + 1) {
          bad.push(`${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]}`);
        }
      }
      return Array.from(new Set(bad)).slice(0, 8);
    });
    expect(wideEls, `elements exceed viewport width: ${wideEls.join(", ")}`).toEqual([]);
  });
}

// 縦組みの回帰専用: ホームの「余白に、想いが宿る」が単一カラムに収まること
// （主句カラムの幅が過大＝段組み折返しでないこと）。2026-07-08 の不具合の直接ガード。
test("home vertical accent stays a single column", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const main = page.locator('[class*="tateMain"]').first();
  await expect(main).toBeVisible();
  const box = await main.boundingBox();
  expect(box).not.toBeNull();
  // 単一カラムなら幅は概ね 1 文字ぶん（font ≤ 22px + letter-spacing）。
  // 折返して2カラム以上になると幅が倍増するため、48px を上限に判定。
  expect(box!.width, `tateMain width ${box!.width}px suggests multi-column wrap`).toBeLessThan(48);
});
