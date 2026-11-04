# Lighthouse の計測（本番・2026-11-04 の基準値）

- 計測: 2026-11-04 12:22〜12:30 JST・evo-x2・Lighthouse 12.8.2（`npx lighthouse@12.8.2`）・Google Chrome（headless）
- 条件: mobile は既定（スロットリングを模擬・Moto G 相当の画面）、desktop は `--preset=desktop`。**各 1 回だけ**の計測なので、点数は数点ぶれる。比べる時は同じ条件で 3 回の中央値を取る
- 対象: 本番 `https://tarophotos.com`（`main` 5f45a91 のデプロイ）の 6 ページ。シリーズの代表は最新の `first-light-voyage`
- 生の JSON は端末の作業場所に置いた（リポには入れていない）。測り直しは下のコマンドで

```bash
npx -y lighthouse@12.8.2 https://tarophotos.com/ --chrome-flags="--headless=new" \
  --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=home.mobile.json
# desktop は --preset=desktop を足す
```

## 結果

| ページ | 端末 | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT | FCP |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `/` | mobile | **59** | 100 | 96 | 100 | 7.5 s | 0 | 0 ms | 7.5 s |
| `/` | desktop | 100 | 100 | 100 | 100 | 0.6 s | 0.001 | 0 ms | 0.6 s |
| `/works` | mobile | **73** | 100 | 100 | 100 | 8.9 s | 0 | 50 ms | 2.2 s |
| `/works` | desktop | 87 | 100 | 100 | 100 | 2.4 s | 0.001 | 0 ms | 0.7 s |
| `/works/first-light-voyage` | mobile | **56** | 100 | 100 | 100 | 9.4 s | 0 | 0 ms | 9.3 s |
| `/works/first-light-voyage` | desktop | 86 | 100 | 100 | 100 | 2.5 s | 0 | 0 ms | 0.6 s |
| `/journal` | mobile | **62** | 100 | 100 | 100 | 6.4 s | 0.001 | 0 ms | 6.0 s |
| `/journal` | desktop | 99 | 100 | 100 | 100 | 1.0 s | 0 | 0 ms | 0.6 s |
| `/about` | mobile | **65** | 100 | 100 | 100 | 5.7 s | 0 | 0 ms | 5.6 s |
| `/about` | desktop | 96 | 100 | 100 | 100 | 1.3 s | 0.003 | 0 ms | 0.6 s |
| `/contact` | mobile | **67** | 100 | 96 | 100 | 5.4 s | 0 | 0 ms | 5.1 s |
| `/contact` | desktop | 99 | 100 | 100 | 100 | 0.8 s | 0 | 0 ms | 0.8 s |

- INP は実際の操作が要るので、Lighthouse（実験室の計測）では出ない。代わりに TBT を載せた（全ページ 0〜50 ms で問題なし）。実際の利用者の INP は計測（GA4 か CrUX）を入れてから見る
- 読み方: **desktop は良い（86〜100）。mobile の表示の速さだけが悪い（56〜73・LCP 5.4〜9.4 s、目安は 2.5 s 以下）**。Accessibility と SEO は全ページ 100、CLS（表示中のずれ）はほぼ 0

## 改善が要る点（優先度つき・ここでは直さない）

原因は Lighthouse の監査項目から読んだ**候補**。直す前に、1 つずつ外して測り直して確かめる。

| 優先 | 何が | 根拠（監査項目） | 直し方の候補 |
|---|---|---|---|
| **高** | mobile で最初の表示（FCP）が 5〜9 s。文字も写真も同時に遅れて出る | FCP と LCP がほぼ同じ時刻。`unused-css-rules` の筆頭が Google Fonts の外部 CSS（Cormorant Garamond・Shippori Mincho、未使用 約 60 KiB）。外部の CSS は描画を止める（`apps/web/src/design-system/fonts.ts` が `fonts.googleapis.com/css2` を読み込んでいる） | 書体を `next/font` で自前配信に切り替え、和文は使う文字だけに絞る。書体はデザインの刷新（提案書 §5）で変わる見込みなので、刷新と一緒に直す |
| **高** | mobile でトップの写真（LCP の要素）の読み込みに 約 3.0 s | `lcp-breakdown-insight`（読み込み 2,966 ms）・`image-delivery-insight`（約 241 KiB 削れる）・`uses-responsive-images`（約 139 KiB） | 最初の 1 枚に `priority` と画面幅に合った `sizes` を確かめる。AVIF の配信・品質の見直し。一覧の写真（`w=750`）を画面幅に合わせる |
| 中 | シリーズのページで写真が届いてから表示まで 約 0.8 s 待つ | `lcp-breakdown-insight`（表示の待ち 779 ms） | 上の書体の直しで減るかを先に測る |
| 中 | 小さすぎる文字（Best Practices 96 の原因） | `font-size`: 読める大きさの文字が 59%。対象はトップの撮影データ（`SeriesIndex` の `exif`・`eyebrow`）とフッター（`SiteFooter` の `base`） | 12px 以上にする。デザインの刷新で文字の大きさを決め直す |
| 中 | ヘッダーのロゴのリンクの名前が、見える文字と違う | `label-content-name-mismatch`（`aria-label="Taro Shirai — home"` と見える文字「TARO SHIRAI 白井 悠太郎」がずれる） | `aria-label` に見える文字を含める（名義の決定＝提案書 問 4 の後に） |
| 低 | 古いブラウザ向けの JavaScript・使っていない JavaScript | `legacy-javascript-insight`（約 14 KiB）・`unused-javascript`（約 28 KiB） | browserslist の見直し。効果は小さい |

## 次に測る時

- デザインの刷新の前と後で、同じ 6 ページ×2 端末を 3 回ずつ測って中央値で比べる
- 計測（GA4）を入れた後は、実際の利用者の LCP・INP・CLS（Core Web Vitals）を見る。Lighthouse の値は実験室の値で、利用者の体験とは別物
