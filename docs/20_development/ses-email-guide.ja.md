# AWS SES メール機能ガイド

[English](ses-email-guide.md)

このドキュメントでは、tarophotos.com の問い合わせフォームが AWS SES（Simple Email Service）でメールを送信する仕組みについて説明します。

> **最終更新**: 2026-09-23
>
> 本番は **Google Cloud Run** で稼働しています（AWS Amplify ではありません。Amplify は 2026-09-01 に削除済み）。SES は **鍵レスの federation**（Google OIDC → AWS `AssumeRoleWithWebIdentity`）で呼び出し、静的 IAM キーは使いません。

---

## 📋 目次

- [概要](#-概要)
- [セットアップ](#-セットアップ)
- [使用方法](#-使用方法)
- [API リファレンス](#-api-リファレンス)
- [SES サンドボックスモード](#-ses-サンドボックスモード)
- [料金](#-料金)
- [トラブルシューティング](#-トラブルシューティング)

---

## 📋 概要

### 機能

- **Next.js Route Handler**（`POST /api/contact`）によるサーバーサイドでのメール送信
- **AWS SDK v3**（`@aws-sdk/client-ses` / `SendEmailCommand`）による SES 連携
- 本番は **鍵レス認証**: Cloud Run ランタイム SA の Google ID トークンを AWS の一時クレデンシャルに交換（`@aws-sdk/credential-providers` の `fromWebToken`）
- `apps/web/docs/forms/contact_form_fields.json` に基づく必須項目・メール形式のバリデーション
- スパム対策: honeypot・時間ゲート（3 秒）・IP 単位のレート制限（10 分に 5 回・インスタンスごとのインメモリ）
- 1 回の送信で HTML + テキストのメールを 2 通送信: `SES_TO_EMAIL` への通知（Reply-To = 送信者）と、送信者への自動返信

### アーキテクチャ

```
┌──────────────┐ POST ┌─────────────────────────┐ ID token ┌──────────────────┐
│  問い合わせ   │──────│  Next.js on Cloud Run   │──────────│  GCP metadata    │
│  フォーム     │      │  /api/contact           │          │  server          │
│  (Client)    │      │  (runtime SA)           │          └──────────────────┘
└──────────────┘      └─────────────────────────┘
                                   │ AssumeRoleWithWebIdentity
                                   ▼
                      ┌─────────────────────────┐          ┌──────────────────┐
                      │  AWS STS                │─────────▶│  AWS SES         │
                      │  role:                  │ SendEmail│  Email           │
                      │  tarophotos-ses-        │          │                  │
                      │  federation             │          │                  │
                      └─────────────────────────┘          └──────────────────┘
```

1. ランタイム SA（`tarophotos-runtime@iwillink-web.iam.gserviceaccount.com`）が metadata server から Google 署名の ID トークン（audience `sts.amazonaws.com`）を取得
2. そのトークンで `SES_AWS_ROLE_ARN` のロール（`tarophotos-ses-federation`）に `AssumeRoleWithWebIdentity`
3. 得た一時クレデンシャルで `ses:SendEmail`

AWS 側ロールの台帳は [willink-infra の `docs/aws-federation`](https://github.com/i-Willink-LLC/willink-infra/tree/main/docs/aws-federation/tarophotos-ses-federation) にあります。

### クレデンシャルの解決順序

`apps/web/src/app/api/_lib/process-form-submission.ts` の `getSesClient()` は次の順で認証情報を選びます。

| 順位 | 条件 | 認証情報 |
|-----|------|---------|
| 1 | `SES_AWS_ROLE_ARN` が設定されている | GCP metadata server 経由の federation（GCP 上 = Cloud Run などでのみ動作） |
| 2 | `SES_AWS_ACCESS_KEY_ID` / `SES_AWS_SECRET_ACCESS_KEY` が設定されている | 静的キー — Amplify 時代の後方互換コードの残り。**使用しない** |
| 3 | どちらもない | AWS SDK の既定の認証情報チェーン（例: `AWS_PROFILE` で指定した SSO プロファイル） |

---

## 🔧 セットアップ

### 前提条件

| 項目 | 必須 | 説明 |
|-----|------|------|
| AWS アカウント | ✅ | SES を利用するため |
| SES の検証済み ID | ✅ | `SES_FROM_EMAIL`（またはそのドメイン）が SES で検証済みであること |
| federation ロール | ✅（本番） | `tarophotos-ses-federation`。Cloud Run ランタイム SA を信頼（willink-infra で管理） |
| AWS CLI（SSO） | ローカルで実送信する場合のみ | `aws sso login` による一時クレデンシャル |

> [!IMPORTANT]
> **ドメイン検証 vs メールアドレス検証**
>
> - **メールアドレス検証**: 特定のメールアドレスのみ送信元として使用可能
> - **ドメイン検証**: ドメイン配下の全メールアドレスを送信元として使用可能（推奨）

### 1. 環境変数の設定

| 変数名 | 必須 | 説明 |
|-------|------|------|
| `SES_FROM_EMAIL` | ✅ | 送信元アドレス。未設定時は `CONTACT_FROM_EMAIL` を参照。両方ないと `/api/contact` は 500 |
| `SES_TO_EMAIL` | ✅ | 通知の送信先。未設定時は `CONTACT_NOTIFICATION_EMAIL` を参照。両方ないと `/api/contact` は 500 |
| `SES_REGION` | - | SES のリージョン（デフォルト: `ap-northeast-1`） |
| `SES_AWS_ROLE_ARN` | 本番のみ | federation ロールの ARN。**ローカルでは設定しない**（GCP metadata server が無いため） |

#### ローカル開発環境

「送信をスキップする」「ログ出力のみ」といったモードはありません。`/api/contact` は常に SES を呼び出します。

- **画面の確認だけしたい場合**: `SES_FROM_EMAIL` を設定しないでください。送信すると 500（`Email delivery is not configured.`）が返り、何も送信されません。
- **実際に送信したい場合**: `apps/web/.env.local` を作成して（`apps/web/.env.local.example` 参照）SES のアドレスを設定し、一時クレデンシャルの AWS プロファイルで開発サーバーを起動します。静的アクセスキーはファイルに書かないでください。

```bash
# apps/web/.env.local
SES_FROM_EMAIL=noreply@yourdomain.com
SES_TO_EMAIL=contact@yourdomain.com
# SES_REGION=ap-northeast-1
# SES_AWS_ROLE_ARN はローカルでは設定しない
```

```bash
aws sso login --profile your-profile
AWS_PROFILE=your-profile pnpm dev
```

プロファイルには送信元 ID に対する `ses:SendEmail` 権限が必要です。また SES のサンドボックス制限を受けます（[SES サンドボックスモード](#-ses-サンドボックスモード) 参照）。

#### 本番環境（Cloud Run）

実行時の環境変数は GitHub の **repository variables**（secrets ではない）で管理します: **Settings → Secrets and variables → Actions → Variables**

| Repository variable | 説明 |
|---------------------|------|
| `SES_REGION` | SES のリージョン |
| `SES_FROM_EMAIL` | 送信元アドレス |
| `SES_TO_EMAIL` | 通知の送信先 |
| `SES_AWS_ROLE_ARN` | `tarophotos-ses-federation` の ARN |

`.github/workflows/deploy-gcp.yml` が `gcloud run deploy --update-env-vars` で Cloud Run に渡すため、変更は次回のデプロイ（`main` への push またはワークフローの手動実行）で反映されます。

> ⚠️ `SES_AWS_ROLE_ARN` が未設定だとデプロイは **fail-closed で止まります**（静的キーへの無言フォールバックはしません）。

### 2. SES ドメイン検証（推奨）

ドメイン検証を行うと、そのドメイン配下の全メールアドレスから送信可能になります。

#### 方法A: CDK（`infra/`）

`infra/lib/ses-stack.ts` は SES ID（`SesStack`）を定義し、`ROUTE53_HOSTED_ZONE_ID` を設定すると Route53 に DKIM の CNAME レコードも作成します。**CI からは適用せず**、現状は手元からも deploy してはいけません（下記の警告参照）。

> [!WARNING]
> stack 名 `SesStack` は同一 AWS アカウント・リージョンの i-willink.com の stack（同サイトの本番 SES ID を保持）と衝突します（`.github/workflows/ci.yml` 末尾のコメント参照）。`cdk deploy` するとそれを上書きしてしまいます。名前の衝突を解消するまで `SesStack` は deploy せず、それまでは方法B またはコンソール / CLI の手順を使ってください。

```bash
# infra/.env（infra/.env.example 参照）
SES_DOMAIN=yourdomain.com
ROUTE53_HOSTED_ZONE_ID=Z0123456789ABCDEFGHIJ
```

```bash
cd infra
npx cdk synth
```

`ROUTE53_HOSTED_ZONE_ID` を設定しない場合は、stack が DKIM トークン 3 つを出力するので手動で追加します（方法B の手順 3）。

#### 方法B: 手動で DNS レコードを設定

1. **ドメイン ID を作成**（AWS コンソール → SES → Verified identities → Create identity → Domain）

2. **DKIM トークンを確認**
   ID に表示される 3 つの DKIM トークンを確認します。

3. **DNS に CNAME レコードを追加**

   `tarophotos.com` のゾーンは Route53 にあります。各トークンについて以下の形式で CNAME レコードを追加:

   | 名前 | タイプ | 値 |
   |-----|-------|-----|
   | `{token1}._domainkey.yourdomain.com` | CNAME | `{token1}.dkim.amazonses.com` |
   | `{token2}._domainkey.yourdomain.com` | CNAME | `{token2}.dkim.amazonses.com` |
   | `{token3}._domainkey.yourdomain.com` | CNAME | `{token3}.dkim.amazonses.com` |

4. **検証完了を確認**
   ```bash
   aws sesv2 get-email-identity --email-identity yourdomain.com --query "DkimAttributes.Status"
   # "SUCCESS" と表示されれば完了
   ```

### 3. SES メールアドレス検証（シンプル）

特定のメールアドレスのみを検証する場合:

#### AWS コンソールで検証する場合

1. AWS コンソール → SES → Verified identities
2. 「Create identity」→「Email address」を選択
3. 送信元メールアドレスを入力
4. 届いた確認メールのリンクをクリック

#### CLI で検証する場合

```bash
aws sesv2 create-email-identity --email-identity noreply@yourdomain.com --region ap-northeast-1
# メールが届くので、確認リンクをクリック
```

---

## 📧 使用方法

### 問い合わせページ

- **URL**: `/contact`
- **ページ**: `apps/web/src/app/contact/page.tsx`
- **フォームコンポーネント**: `apps/web/src/components/contact/ContactForm.tsx`

```bash
pnpm dev
# http://localhost:3000/contact にアクセス
```

### フォームを追加する場合

`apps/web/src/app/api/_lib/process-form-submission.ts` の `processFormSubmission()` は共通処理です。新しい Route Handler から `formKey`・`notificationEmail`・`fieldDefinitions`・`subject`・（任意で）`autoResponse` を渡して呼び出します（完全な例は `apps/web/src/app/api/contact/route.ts`）。

---

## 📖 API リファレンス

### POST /api/contact

問い合わせフォームからメールを送信する API エンドポイントです。

#### リクエスト

```json
{
  "fields": {
    "category": "General Inquiry",
    "name": "山田太郎",
    "email": "yamada@example.com",
    "company": "",
    "message": "お問い合わせ内容をここに記載します。",
    "agree": "同意する"
  },
  "website": "",
  "elapsedMs": 8000
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|-----|------|
| `fields` | object | ✅ | フォームの値。キー・ラベル・必須フラグは `apps/web/docs/forms/contact_form_fields.json` で定義（`category` / `name` / `email` / `message` / `agree` が必須。`email` はメール形式であること） |
| `website` | string | - | honeypot。空であること |
| `elapsedMs` | number | ✅ | フォーム表示から送信までのミリ秒。欠落または 3000 未満は bot 扱い |

> `website` と `elapsedMs` は通知メールに載らないよう、`fields` の外（トップレベル）で送ります。

#### レスポンス

レスポンスはすべて `message` フィールドを持つ JSON です。

| ステータス | `message` | 意味 |
|-----------|-----------|------|
| 200 | `Contact request received.` | 送信成功。**スパム判定（honeypot / 時間ゲート）で静かに破棄した場合も同じ応答** |
| 400 | `Invalid JSON body` | ボディが JSON でない |
| 400 | `Missing required field: <label>` | 必須項目が空 |
| 400 | `Invalid email format: <label>` | メール形式が不正 |
| 429 | `Too many requests. Please try again later.` | 同一 IP から 10 分間に 5 回を超える送信 |
| 500 | `Email delivery is not configured.` | `SES_FROM_EMAIL` が未設定 |
| 500 | `Contact notification email is not configured.` | `SES_TO_EMAIL` が未設定 |
| 500 | `Email delivery failed: ...` / `Failed to send email.` | SES・認証情報のエラー（詳細は `error`） |

---

## ⚠️ SES サンドボックスモード

### サンドボックスモードとは

**新規 AWS アカウントでは、SES はサンドボックスモードで動作します。**

サンドボックスモードでは以下の制限があります：

| 制限 | 内容 |
|-----|------|
| 送信先 | **検証済みのメールアドレスのみ**に送信可能 |
| 送信数 | 1日あたり最大 200 通 |
| 送信レート | 1秒あたり最大 1 通 |

> サンドボックスでは、送信者のアドレスが検証済みでない限り、送信者への自動返信は失敗します。

### サンドボックスを解除する方法

本番環境でメール機能を使用するには、本番アクセスのリクエストが必要です。

1. AWS コンソール → SES → Account dashboard
2. 「Request production access」をクリック
3. 以下の情報を入力:
   - **Mail type**: Transactional
   - **Website URL**: あなたのウェブサイト URL
   - **Use case description**: 使用目的の説明
     - 例: "Contact form notification emails from our website"
4. 送信後、AWS からの承認を待つ（通常 24〜48 時間）

### 開発時の対処

サンドボックスモードでも開発・テストは可能です：

1. **送信元メールアドレスを検証**
   - SES → Verified identities → Create identity
   - 確認メールのリンクをクリック

2. **送信先メールアドレスも検証**
   - 開発中は受信先アドレスも検証が必要
   - 同様に SES で検証

3. **検証済みメールアドレス間でテスト**
   - 送信元・送信先ともに検証済みであればメール送信可能

---

## 💰 料金

AWS SES の料金は非常に低コストです。詳細は公式の料金ページをご確認ください。

📌 **[AWS SES 料金ページ](https://aws.amazon.com/jp/ses/pricing/)**

### 料金の概要

| 項目 | 料金 |
|-----|------|
| 送信 | $0.10/1,000通 |
| 添付ファイル | $0.12/GB |

> **Note**: 上記は概算です。無料枠の条件は変更されることがあるため、最新の正確な料金は [公式料金ページ](https://aws.amazon.com/jp/ses/pricing/) をご確認ください。

### コスト試算例

問い合わせ 1 件につき **2 通**（通知 + 自動返信）を送信します。

| ユースケース | 月間問い合わせ数 | 月間送信数 | 概算コスト |
|------------|---------------|----------|----------|
| 通常 | 50件 | 100通 | 約 $0.01 |
| 繁忙期 | 2,500件 | 5,000通 | 約 $0.50 |

---

## 🔍 トラブルシューティング

### よくあるエラー

#### 「Email delivery is not configured.」

**原因**: `SES_FROM_EMAIL`（および `CONTACT_FROM_EMAIL`）が未設定

**解決方法**:
1. ローカル: `apps/web/.env.local` に設定して `pnpm dev` を再起動
2. 本番: repository variable `SES_FROM_EMAIL` を確認して再デプロイ

#### 「Contact notification email is not configured.」

**原因**: `SES_TO_EMAIL`（および `CONTACT_NOTIFICATION_EMAIL`）が未設定

**解決方法**: 上記と同様に `SES_TO_EMAIL` を設定

#### 「Email delivery failed: Address not verified or spam detected.」

**原因**: SES の `MessageRejected` — 送信元（サンドボックスでは送信先も）が未検証

**解決方法**:
1. SES コンソールで ID を検証
2. `SES_FROM_EMAIL` を確認
3. サンドボックスでは送信先も検証するか、本番アクセスをリクエスト

#### 「Email delivery failed: Access denied. Check IAM permissions.」

**原因**: 引き受けたロール（ローカルではプロファイル）に送信元 ID への `ses:SendEmail` 権限がない

**解決方法**: willink-infra で `tarophotos-ses-federation` の権限を確認（ローカルでは SSO プロファイルの権限を確認）

#### 「Failed to send email.」（認証情報のエラー）

| `error` / ログの内容 | 原因 | 解決方法 |
|---------------------|------|---------|
| `GCP metadata identity token fetch failed: ...` または `metadata.google.internal` への fetch エラー | GCP 外（ローカルなど）で `SES_AWS_ROLE_ARN` を設定している、またはランタイム SA が ID トークンを発行できない | ローカルでは `SES_AWS_ROLE_ARN` を外す。本番では Cloud Run のランタイム SA を確認 |
| `Not authorized to perform sts:AssumeRoleWithWebIdentity` など | `tarophotos-ses-federation` の信頼ポリシーがトークン（audience / subject）と一致しない | willink-infra の `docs/aws-federation` でロールを確認 |
| `Could not load credentials from any providers` | ローカルでロール ARN も AWS プロファイル・認証情報もない | `aws sso login` して `AWS_PROFILE` 付きで起動 |

#### 送信成功と表示されるのにメールが届かない

**原因**: スパム判定で静かに破棄された（意図的に 200 を返す）

**解決方法**: サーバーログで `[forms:contact] submission dropped: honeypot` または `too_fast` を確認。API を直接呼ぶ場合は `elapsedMs` を 3000 以上にする。

### ログの確認

送信成功時は `[forms:contact] email sent to ...`、失敗時は `contact email send failed` と `SES Error Name: ...` がログに出力されます。

```bash
# 開発時
pnpm dev
# コンソールでエラーメッセージを確認

# 本番（Cloud Run）
gcloud logging read \
  'resource.type="cloud_run_revision" AND resource.labels.service_name="tarophotos"' \
  --project=iwillink-web --limit=50
# または Google Cloud コンソール → Cloud Run → tarophotos → ログ
```

---

## 📁 関連ファイル

| ファイル | 説明 |
|---------|------|
| `apps/web/src/app/api/_lib/process-form-submission.ts` | SES クライアント・認証情報の解決・バリデーション・メール生成 |
| `apps/web/src/app/api/_lib/spam-guard.ts` | honeypot / 時間ゲート / レート制限 |
| `apps/web/src/app/api/contact/route.ts` | 問い合わせ API エンドポイント |
| `apps/web/src/components/contact/ContactForm.tsx` | 問い合わせフォーム（クライアント） |
| `apps/web/docs/forms/contact_form_fields.json` | 問い合わせフォームの項目定義 |
| `apps/web/.env.local.example` | ローカル用環境変数テンプレート |
| `.github/workflows/deploy-gcp.yml` | repository variables を Cloud Run に配線 |
| `infra/lib/ses-stack.ts` | SES ID の CDK 定義（stack 名衝突のため deploy しない） |
| `infra/.env.example` | インフラ用環境変数テンプレート |
