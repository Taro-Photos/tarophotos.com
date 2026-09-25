# デプロイ手順

[English](deployment.md)

> **最終更新**: 2026-09-23  
> **ステータス**: Approved

## 概要

このプロジェクトでは、**Firebase Hosting** を前段に置いた **Google Cloud Run** で Next.js アプリケーションをホスティングします。
デプロイは GitHub Actions（`.github/workflows/deploy-gcp.yml`）による鍵レス認証で完全に自動化されており、手動で再実行することもできます。
パイプラインの詳細は [CI/CD パイプライン仕様](ci-cd-pipeline.md)（英語）を参照してください。

> 経緯: 本番は 2026-07-25 に AWS Amplify から Cloud Run + Firebase Hosting へ切り替え、Amplify app は 2026-09-01 に削除済み。Amplify はロールバック先として存在しません。

---

## 構成

| 層 | 実体 |
|---|---|
| ホスティング | Firebase Hosting site `tarophotos-web`（`firebase.json` の rewrite で全リクエストを Cloud Run へ） |
| アプリ | Cloud Run service `tarophotos`（`asia-northeast1`・`Dockerfile` でビルドする Next.js standalone コンテナ） |
| コンテナ | Artifact Registry `asia-northeast1-docker.pkg.dev/iwillink-web/web/tarophotos`（コミット SHA でタグ付け） |
| デプロイ | `.github/workflows/deploy-gcp.yml`（GitHub Actions OIDC → GCP Workload Identity Federation） |
| 実行時 env | GitHub repository **variables** → `gcloud run deploy --update-env-vars` |
| DNS | Route53（apex A `199.36.158.100` / www CNAME `tarophotos-web.web.app`） |

GCP 側のリソース（プロジェクト `iwillink-web`・サービスアカウント・WIF プロバイダ等）はこのリポジトリではなく [willink-infra](https://github.com/i-Willink-LLC/willink-infra)（`tarophotos.tf`）で管理しています。

---

## デプロイフロー

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: main ブランチにマージ                                   │
│          → deploy-gcp.yml が起動（対象パスは下記）                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: GCP 認証（WIF・鍵レス）                                 │
│          → docker build → Artifact Registry へ push              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: gcloud run deploy tarophotos（実行時 env を配線）       │
│          → Cloud Run の URL が 200 を返すことを検証              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: firebase deploy --only hosting:tarophotos-web          │
│          → https://tarophotos-web.web.app が 200 を返すことを検証 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 自動デプロイ

### トリガー

`main` への push のうち、以下のいずれかのパスに変更があるもの:

- `apps/web/**`
- `packages/**`
- `Dockerfile`
- `firebase.json`
- `.github/workflows/deploy-gcp.yml`
- `pnpm-lock.yaml`

それ以外のパス（例: `docs/**`・`infra/**`）だけの変更ではデプロイ**されません**。実行は直列化されます（`concurrency: gcp-deploy-main`・キャンセルなし）。

### ワークフローのステップ

| ステップ | 内容 |
|---------|------|
| Authenticate to GCP (WIF) | `google-github-actions/auth` で WIF プロバイダと `tarophotos-deployer@iwillink-web.iam.gserviceaccount.com` を使用 |
| Build / Push image | リポジトリルートから `docker build`（`Dockerfile`）し、`$IMAGE:<コミット SHA>` を push |
| Deploy to Cloud Run | `SES_AWS_ROLE_ARN` 未設定なら fail-closed で停止。その後 `gcloud run deploy`（設定は下記） |
| Verify Cloud Run revision serves | サービス URL を `curl`: HTTP 200 かつページに `ds-wrap` を含む |
| Deploy Firebase Hosting | `npx firebase-tools@14 deploy --only hosting:tarophotos-web --project iwillink-web` |
| Verify Hosting front | `https://tarophotos-web.web.app/` を `curl`: HTTP 200 かつ `ds-wrap` を含む |

### Cloud Run の設定（デプロイごとに指定）

| 設定 | 値 |
|-----|-----|
| プロジェクト / リージョン | `iwillink-web` / `asia-northeast1` |
| ランタイム SA | `tarophotos-runtime@iwillink-web.iam.gserviceaccount.com` |
| 未認証アクセス | 許可（`--allow-unauthenticated`） |
| ポート | `8080` |
| CPU / メモリ | `1` / `512Mi` |
| インスタンス数 | 最小 `0` / 最大 `2` |

---

## 手動での再デプロイ

1. GitHub リポジトリの **Actions** タブを開く
2. **Deploy to GCP (Cloud Run + Firebase Hosting)** を選択
3. `main` で **Run workflow** をクリック

GitHub CLI の場合:

```bash
gh workflow run deploy-gcp.yml --ref main
```

repository variables を変更した後や、コード変更なしで再デプロイしたいときに使います。

---

## 認証（鍵レス）

GitHub Actions が OIDC トークンを取得し、GCP Workload Identity Federation で交換します。**GitHub Secrets・GitHub PAT・クラウドの鍵は一切使いません。**

| 項目 | 値 |
|-----|-----|
| WIF プロバイダ | `projects/626363975800/locations/global/workloadIdentityPools/github/providers/github-oidc` |
| デプロイ用 SA | `tarophotos-deployer@iwillink-web.iam.gserviceaccount.com` |
| デプロイ用 SA のロール | `artifactregistry.writer` / `run.admin` / `firebasehosting.admin` / ランタイム SA への actAs |
| ワークフローの permissions | `contents: read` / `id-token: write` |

---

## 実行時の環境変数

GitHub の **repository variables**（Settings → Secrets and variables → Actions → **Variables**）に設定します。secrets ではありません。public リポジトリのため、値はワークフローに直書きしません。

| 変数名 | 説明 |
|-------|------|
| `SES_REGION` | SES の AWS リージョン |
| `SES_FROM_EMAIL` | 送信元アドレス（SES で検証済み） |
| `SES_TO_EMAIL` | 問い合わせ通知の送信先 |
| `SES_AWS_ROLE_ARN` | `AssumeRoleWithWebIdentity` で引き受ける AWS ロール `tarophotos-ses-federation` |

- `SES_AWS_ROLE_ARN` が未設定だとデプロイは **fail-closed で止まる**ため、静的キーへ無言でフォールバックすることはありません。
- `--update-env-vars` は列挙した変数だけを更新します。Cloud Run service に既にあるその他の env はデプロイを跨いで保持されます。
- 変数を変更したら、ワークフローを手動実行（上記）して反映します。

問い合わせフォームのメール送信の仕組みは [SES メール機能ガイド](../20_development/ses-email-guide.ja.md) を参照してください。

---

## 独自ドメイン / DNS

`tarophotos.com` は Firebase Hosting（site `tarophotos-web`）で配信しています。DNS は Route53 のままです:

| レコード | タイプ | 値 |
|---------|-------|-----|
| `tarophotos.com` | A | `199.36.158.100` |
| `www.tarophotos.com` | CNAME | `tarophotos-web.web.app` |

ゾーンの Cloud DNS への移行は移行計画の P6 で予定しています。

---

## ロールバック

Amplify は存在しないため、ロールバックは Cloud Run / GitHub の中で行います。

### 方法A: main で revert（推奨）

問題のコミットを revert して `main` にマージします。`deploy-gcp.yml` が通常の経路で revert 後のコードをビルド・デプロイします。

### 方法B: 以前の Cloud Run リビジョンにトラフィックを戻す

```bash
# リビジョン一覧
gcloud run revisions list --service=tarophotos --region=asia-northeast1 --project=iwillink-web

# 正常なリビジョンにトラフィックを 100% 向ける
gcloud run services update-traffic tarophotos \
  --to-revisions=REVISION_NAME=100 \
  --region=asia-northeast1 --project=iwillink-web
```

> ⚠️ トラフィックを特定のリビジョンに固定している間は、新しくデプロイしたリビジョンにトラフィックが流れません。修正をデプロイした後は `gcloud run services update-traffic tarophotos --to-latest --region=asia-northeast1 --project=iwillink-web` で戻してください。

---

## このリポジトリのインフラ（`infra/`）

`infra/` は SES ID（`SesStack`）の AWS CDK 定義のみです。CI はチェックとして `cdk synth` を実行しますが、**デプロイはしません**。

> ⚠️ stack 名 `SesStack` は同一 AWS アカウント・リージョンの i-willink.com の stack（同サイトの本番 SES ID を保持）と衝突します（`.github/workflows/ci.yml` 末尾のコメント参照）。`cdk deploy` するとそれを上書きしてしまうため、**名前の衝突を解消するまで `SesStack` は deploy しません**。解消後に適用する場合は、対象 stack を名指しして手元から実行し、認証は静的キーではなく一時クレデンシャル（`aws sso login` 等）で行ってください。

---

## 前提となる権限設定

| 対象 | 権限 |
|-----|------|
| デプロイ（CI） | WIF 経由で `tarophotos-deployer` に付与済み（willink-infra で管理）— 開発者ごとの設定は不要 |
| 実行時 env の変更 | GitHub リポジトリの Admin 権限（repository variables の編集） |
| 手動ロールバック（方法B） | プロジェクト `iwillink-web` の `run.admin`（または同等） |

---

## 必要な設定一覧

| 設定場所 | 名前 | 説明 |
|---------|------|------|
| GitHub repository variables | `SES_REGION` | SES のリージョン |
| GitHub repository variables | `SES_FROM_EMAIL` | 送信元アドレス |
| GitHub repository variables | `SES_TO_EMAIL` | 通知の送信先 |
| GitHub repository variables | `SES_AWS_ROLE_ARN` | federation ロールの ARN（未設定ならデプロイ失敗） |

デプロイに GitHub Secrets は不要です。

---

## トラブルシューティング

| エラー | 原因 | 解決方法 |
|-------|------|---------|
| `repository variable SES_AWS_ROLE_ARN is unset` | repository variable が未設定 | Actions → Variables に `SES_AWS_ROLE_ARN` を設定して再実行 |
| `Authenticate to GCP (WIF)` で失敗 | WIF プロバイダ / SA の紐付けがこのリポジトリを許可していない | willink-infra の WIF・SA 設定を確認 |
| `Verify Cloud Run revision serves` で失敗 | 新リビジョンが 200 以外を返す、またはページに `ds-wrap` がない | 該当リビジョンの Cloud Run ログを確認（`gcloud logging read 'resource.type="cloud_run_revision" AND resource.labels.service_name="tarophotos"' --project=iwillink-web --limit=50`） |
| `Verify Hosting front` で失敗 | Hosting の rewrite、または Hosting 経由で Cloud Run が応答しない | `firebase.json` と `tarophotos-web` の Firebase Hosting リリースを確認 |
| main にマージしたのにデプロイされない | トリガー対象のパスに変更がない | ワークフローを手動実行 |
| 問い合わせフォームが 500 を返す | SES の設定・認証情報 | [SES メール機能ガイド](../20_development/ses-email-guide.ja.md#-トラブルシューティング) を参照 |
