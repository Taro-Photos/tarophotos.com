import { journalPagePosts } from "../../src/app/_content/journal";
import { seriesDetails } from "../../src/app/_content/series";

// e2e が回る対象ルート。journal はレジストリから動的導出（記事追加時の
// ハーネス手動更新漏れを防ぐ）。works はシリーズ数が多いため代表1件のみ
// （テンプレは共通・コンテンツはレジストリ由来のため代表で足りる）。
export const ROUTES: string[] = [
  "/",
  "/about",
  "/contact",
  "/concept",
  "/journal",
  ...journalPagePosts.map((post) => `/journal/${post.slug}`),
  "/works",
  `/works/${seriesDetails[0].slug}`,
  "/legal",
];
