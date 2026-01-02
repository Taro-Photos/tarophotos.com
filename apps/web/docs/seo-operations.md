# SEO運用メモ

## 環境変数の設定
- 本番・ステージング・ローカルそれぞれで `NEXT_PUBLIC_SITE_URL` を設定してください。
  - 例: `.env.local` に `NEXT_PUBLIC_SITE_URL=https://taro.photos` を記載。
  - 環境変数が未設定の場合は `https://taro.photos` でフォールバックします。
- Vercel などのホスティングでは環境ごとの Environment Variables セクションに同値を登録します。

## サイトマップとクローラー対策
- `/sitemap.xml` は `src/app/sitemap.ts` で動的生成されます。新しいページやシリーズを追加した際は公開後に Search Console で「インデックス登録をリクエスト」を実行してください。
- `/robots.txt` (`src/app/robots.ts`) は API や静的アセットのみクローラーから除外しています。公開停止済みの `/clients` ルートはサイト外からアクセスできないため追加設定は不要です。

## 構造化データとOG画像
- 作品シリーズページとジャーナル記事には `BreadcrumbList` を付与済みです。新規テンプレートを追加する際は同様のパンくずスキーマを忘れずに実装します。
- 共通OG画像は `public/og/default-og.png` (1200×630 PNG)。今後シリーズや記事ごとに専用OGを用意する場合は同じ比率・フォーマットで `/public/og/<slug>.png` を配置し、対応する `metadata` で差し替えてください。

## コンテンツ運用
- ジャーナル記事はロケ地名・機材名など検索ニーズのある語句を含め、月1本以上の更新を目標にしてください。
- 新規記事公開後は Search Console の URL 検査 → インデックス登録申請と、主要SNSでのシェアを行いバックリンク獲得を促進します。

## 確認タスク
- デプロイ後に `npm run lint` をローカルで実行し、メタデータ周りの型エラーがないか確認。
- PageSpeed Insights でシリーズページの LCP/CLS を計測し、必要があれば `SeriesGallery` の `sizes` や画像圧縮を調整します。
