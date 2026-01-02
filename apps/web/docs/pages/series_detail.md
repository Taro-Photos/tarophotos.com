# Series 詳細（/works/[series]）

## ① 概要
1 シリーズ＝1 つの物語。写真と最小限の言葉で“意図”を伝え、関連案件へのCTAを配置。

## ② 目的
- 1 シリーズ＝1 つの物語 / 写真と最小限の言葉で“意図”を伝え、関連案件へのCTAを配置

## ③ コンテンツ構成

- リード（80–120 文字）
- ギャラリー（縦横ミックス + ライトボックス）
- 撮影情報：場所/被写体/Exif 抜粋
- Behind the shot（技術・意図メモ）
- 関連案件 CTA（例：スポーツ撮影のご依頼）


## ④ コンポーネント仕様

- `SeriesHeader`（タイトル/年/場所）
- `SeriesGallery` + `Lightbox`
- `MetaBadge`（Location/Tags）
- `CTA`


## ⑤ SEO / 構造化データ

- `ImageObject` を各作品に付与（`contentUrl/creator/contentLocation/datePublished`）
- 見出しにシリーズ名（固有名詞）を含める


## ⑥ 計測（GA4）

- `lightbox_open` / `cta_click`（related-service）
- スクロール深度


## ⑦ コピー草案（例）

- H1: シリーズ名（例：**Between City & Forest**）
- リード：街の輪郭と森の匂いが交わる境界で、時間は少し伸びる。
