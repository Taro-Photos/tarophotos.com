# Works Index（Series 索引）

## ① 概要
シリーズ単位で作品群を探せる索引ページ。フィルタで素早く絞り込み。

## ② 目的
- シリーズ単位で作品群を探せる索引ページ / フィルタで素早く絞り込み

## ③ コンテンツ構成

- フィルタ：Series / Year / Color–Mono / People / Motion
- グリッド：可変カード（サムネ + リード）


## ④ コンポーネント仕様

- `FilterBar`：ファセット（URL クエリと同期）
- `WorkCard`：container queries で比率/余白調整 + タグから直接フィルタに遷移
- `Pagination`：内部ページネーション URL を用意


## ⑤ SEO / 構造化データ

- `CollectionPage` メタ
- カテゴリ/タグを内部リンク化しクロール性を強化


## ⑥ 計測（GA4）

- `view_series`（カードクリック）
- `filter_change`
- `paginate`


## ⑦ コピー草案（例）

- H1: **Works**
- リード：都市と自然、動きと静謐のあいだ。
