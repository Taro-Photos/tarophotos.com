# Home（世界観の凝縮と分岐）

## ① 概要
代表シリーズを横断するトレーラーで世界観を提示し、Works / Services / About に分岐。ファーストビューで“依頼する”導線を明示。

## ② 目的
- 代表シリーズを横断するトレーラーで世界観を提示し、Works / Services / About に分岐 / ファーストビューで“依頼する”導線を明示

## ③ コンテンツ構成

- ヒーロー：代表 3 シリーズ × 各 3 枚のトレーラー（オート/ホバー再生）
- 下層導線：Works / Services / About（3 カラム）
- 最新シリーズのピックアップ（2–3 件）
- フッター：SNS・コピーライト・ポリシー


## ④ コンポーネント仕様

- `HeroTrailer`：LCP は最初の静止フレーム（画像1枚）を `priority`
- `SectionLinks`：3 カラム（container queries 対応）
- `SeriesTeaserList`：カード 2–3 件


## ⑤ SEO / 構造化データ

- `WebSite` + `CollectionPage` 相当のメタ
- OG 画像を固定化、メインキーワードを H1 に短く含める


## ⑥ 計測（GA4）

- `cta_click`（hero / services）
- `view_series`（teaser クリック）
- `scroll_75`


## ⑦ コピー草案（例）

- H1: **Move with the Moment. / 動く瞬間を、美しく。**
- サブ：街と自然の交差点で、心が動く一瞬を。
- ボタン：**依頼する** / 作品を見る
