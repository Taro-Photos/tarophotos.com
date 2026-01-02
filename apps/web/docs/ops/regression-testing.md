# Regression Testing Playbook

## Overview

このリポジトリでは、UI リグレッションと問い合わせフローの回帰を検知するために、以下のテストレイヤーを追加しました。

- 単体テスト: `BookingForm` のバリデーション／送信フロー、`SiteHeader` のモバイルメニュー挙動と分析イベント、`FilterBar` のファセット変更イベント、`/api/booking` ルートのエラーハンドリングに加え、`SeriesGallery` のライトボックス制御と EXIF 表示、`FaqAccordion` の開閉挙動、`CtaLink` / `ContactChannelList` の分析イベント計測を Vitest + Testing Library で検証します。
- E2E テスト: Playwright でホーム／予約／作品ページに加え、About・Services・Clients・Journal 一覧／詳細・Legal・シリーズ詳細をモバイル／デスクトップ両ビューポートで走査し、CTA 動線、フィルタリング挙動、フォーム送信、主要ページのビジュアルスナップショットを監視します。

## カバレッジマトリクス

| レイヤー | 対象 | 観点 |
| --- | --- | --- |
| 単体テスト | BookingForm, SiteHeader, FilterBar, API `/api/booking`, SeriesGallery, FaqAccordion, CtaLink, ContactChannelList | バリデーション、DOM トグル、分析イベント、メール通知、ライトボックス操作 |
| E2E (Playwright) | Home, Booking, Works 一覧, Works 詳細, About, Services, Clients, Journal 一覧, Journal 詳細, Legal | 導線遷移、フォーム送信、フィルタ適用、主要セクションのレイアウトスナップショット |

## セットアップ

1. 依存関係をインストール
   ```bash
   npm install
   ```
2. Playwright ブラウザバイナリのセットアップ (初回のみ)
   ```bash
   npx playwright install
   ```

## テスト実行コマンド

| 用途 | コマンド |
| --- | --- |
| 単体テストを実行 | `npm run test` |
| 単体テストをウォッチ | `npm run test:watch` |
| E2E テストを実行 | `npm run test:e2e` |
| スナップショットを更新 | `npm run test:e2e:update` |

## スナップショット運用

- スナップショットは `tests/e2e/__screenshots__/{project}/` に保存されます (`desktop-chrome`, `mobile-safari` の2種類)。
- `tests/e2e/static-pages.spec.ts` で出力される各ページのレイアウトスナップショットもここに追記されます。命名は `Static-pages-...{name}.png` 形式です。
- 意図的なデザイン変更があった場合は、変更を確認しながら `npm run test:e2e:update` で新しいスナップショットを生成してください。
- 予期しない差分が出た場合は、`test-results/` ディレクトリにトレース/動画が出力されるので `npx playwright show-trace <path>` で詳しく確認できます。

## アーキテクチャ変更時のチェックリスト

1. `npm run lint` で静的解析を通す。
2. `npm run test` を実行し、Vitest の単体テスト (SeriesGallery / FaqAccordion / CTA 計測を含む) が通ることを確認する。
3. `npm run test:e2e` を実行し、ホーム／予約／作品／静的ページ一式のビジュアル差分が発生していないか Playwright レポートで確認する。
4. レイアウトに意図した変更がある場合は `npm run test:e2e:update` 後に差分スクリーンショットを目視確認し、PR で背景と確認結果を共有する。

## Booking フォームの回帰検知

- 単体テストでは、必須項目のバリデーション、正常送信、サーバーエラー時のエラーメッセージを網羅しています。
- E2E テストでは、フォーム送信時に API へのリクエストペイロードを検証し、モックレスポンスで成功メッセージが表示されることを確認しています。Resend への実送信は行いません。

## トラブルシューティング

- Playwright 実行時に Dev サーバが自動起動 (`npm run dev -- --hostname 127.0.0.1 --port 3000`) します。既に `npm run dev` を起動している場合は、そのセッションを利用するかポートを揃えてください。
- CI 実行では `NEXT_TELEMETRY_DISABLED=1` が自動で設定されます。
- スナップショット比較で微小差分が頻発する場合は、差分が発生するコンポーネントにより詳細なユニットテストを追加し、E2E 側では領域を絞ったスクリーンショットに切り替えることを検討してください。
