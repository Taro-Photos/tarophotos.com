# コンテンツ運用ガイド

Journal（随筆・お知らせ）と Works（シリーズ）の追加手順の正本は、各レジストリの先頭コメントです。ここには手順を写しません（写すと古くなります）。

- Journal: [`src/app/_content/journal.ts`](../src/app/_content/journal.ts)（`journalIndex` に 1 件足し、必要なら `src/app/journal/<slug>/page.tsx` を作る）
- Works: [`src/app/_content/series.ts`](../src/app/_content/series.ts)（写真のメタデータは `content/series-assets/`）

一覧・sitemap・前後ナビ・JSON-LD は、いずれもレジストリから自動で作られます。main へのマージで Cloud Run へ自動デプロイされます（`.github/workflows/deploy-gcp.yml`）。

> 2026-11-09: 旧版（1 記事 1 ファイル＋`index.ts`・`published` / `isDraft` フラグ・Mac のローカルパスへのリンク）は現行の構成と合わないため削除した。経緯は git 履歴を参照。
