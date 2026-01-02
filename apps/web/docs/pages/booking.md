# Booking（相談・見積）

## ① 概要
不安を解消する設問と所要時間の見える化で、送信ハードルを下げる。

## ② 目的
- 不安を解消する設問と所要時間の見える化で、送信ハードルを下げる

## ③ コンテンツ構成

- フォーム（撮影相談モード）：お名前/メールアドレス/依頼種別/用途/発注形態/希望日程（第2希望まで）/場所/想定カット/納期/予算レンジ/参考URL/備考
- フォーム（お問い合わせモード）：お問い合わせ種別/お名前/メールアドレス/所属/お問い合わせ内容/同意チェック
- 日程調整：カレンダー連携（任意）
- 送信後：自動返信（到着確認・目安返信時刻）


## ④ コンポーネント仕様

- `Form`：フィールドバリデーション/必須・任意の明示
- `Form`：Resend の認証情報（`RESEND_API_KEY` / `RESEND_FROM_EMAIL`）と通知先メール（`BOOKING_NOTIFICATION_EMAIL` / `CONTACT_NOTIFICATION_EMAIL`）は Amplify と `.env.local` の両方で管理
- `Form`：Resend の認証情報（`RESEND_API_KEY` / `RESEND_FROM_EMAIL`）と通知先メール（`BOOKING_NOTIFICATION_EMAIL` / `CONTACT_NOTIFICATION_EMAIL`）は Amplify と `.env.local` の両方で管理。送信者にも自動返信メールを返して受付完了を伝える。
- `CalendarConnect`（任意）
- `PrivacyNotice`（個人情報の取り扱い）


## ⑤ SEO / 構造化データ

- `WebPage` + `BreadcrumbList`
- フォーム確認画面を用意し、エラー復帰を優しく


## ⑥ 計測（GA4）

- `contact_submit`（service, budget）
- `error_form`


## ⑦ コピー草案（例）

- H1: **Booking**
- リード：撮影相談も、その他のお問い合わせもこのフォームから。
- ボタン：**相談/見積もりを送る**
