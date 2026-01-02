# 24 アクセシビリティ & パフォーマンス

- **Core Web Vitals** 目標: LCP ≤ 2.5s / CLS ≤ 0.1 / INP ≤ 200ms
- 代替テキスト、コントラスト、キーボード操作を必須チェック項目に
- `prefers-reduced-motion` への配慮、フォーカス可視化

## QA チェックリスト（リリース前に必ず実施）

### 1. グローバル
- `Tab`/`Shift+Tab` でサイト全体を巡回し、フォーカスリングが視認できることを確認（ヘッダー・フィルタ・カード・CTA）。
- スクリーンリーダー（VoiceOver / NVDA）でヘッダー → メイン → フッターのランドマークが正しく announce されることを確認。
- `prefers-reduced-motion: reduce` を OS で設定し、ヒーローのトレーラーやスクロール監視が止まることを確認。
- カラーパレットと CTA のコントラスト比（WCAG AA 4.5:1 以上）を `axe DevTools` でチェック。

### 2. フォーム（/booking）
- 必須項目を空で送信し、エラーメッセージが `aria-describedby` 経由で紐付いているか確認。
- Resend の認証情報が未設定の場合に 500 が返ること、および `.env.local` にサンドボックス用キーを入れた状態で送信が成功することを再検証。
- 送信成功後にフォームがリセットされ、成功メッセージが SR で読まれることを確認。

### 3. Works 一覧
- フィルタをキーボードだけで変更し、URL クエリに反映されることを確認。
- カード下部のタグリンクからフィルタが適用されること、および `filter_change` イベントが GA 計測に送出されることを確認。

### 4. Journal 詳細
- パンくずリンク（← Journal）とフッター CTA がフォーカス可能であること。
- JSON-LD（`BlogPosting`）がブラウザ DevTools > Elements で正しくインジェクトされていることを確認。

### 5. パフォーマンス計測
- `npm run build` 後、`npm run start` を用いてローカルで Lighthouse (Desktop + Mobile) を走らせ、CLS/INP を記録。
- Amplify デプロイ後に CloudFront キャッシュが残っていないか、`?cacheBust=` を付けて最新アセットを確認。
