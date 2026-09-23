# tarophotos.com

[English](README.md)

[![CI](https://github.com/Taro-Photos/tarophotos.com/actions/workflows/ci.yml/badge.svg)](https://github.com/Taro-Photos/tarophotos.com/actions/workflows/ci.yml)
[![Deploy to GCP](https://github.com/Taro-Photos/tarophotos.com/actions/workflows/deploy-gcp.yml/badge.svg)](https://github.com/Taro-Photos/tarophotos.com/actions/workflows/deploy-gcp.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Taro Photos の Web サイト（tarophotos.com）のソースコードです。Next.js のモノレポ構成で、**Firebase Hosting 経由の Google Cloud Run** で配信しています。問い合わせフォームのメールは AWS SES から鍵レスの federation（静的 IAM キーなし）で送信します。

> [next-amplify-starter-kit](https://github.com/willink-oss/next-amplify-starter-kit) をベースに開始。本番は 2026-07 に AWS Amplify から Cloud Run + Firebase Hosting へ移行し、Amplify app は 2026-09-01 に削除済みです。現行構成の要約は [docs/HANDOFF.md](docs/HANDOFF.md) を参照してください。

---

## 📋 目次

- [特徴](#-特徴)
- [プロジェクト構成](#-プロジェクト構成)
- [クイックスタート](#-クイックスタート)
- [デプロイ](#-デプロイ)
- [必要な環境変数](#-必要な環境変数)
- [利用可能なコマンド](#-利用可能なコマンド)
- [ドキュメント](#-ドキュメント)

---

## ✨ 特徴

| 技術 | 説明 |
|------|------|
| 🚀 **Turborepo** | 高速なビルドキャッシュとモノレポ管理 |
| ⚡ **Next.js 16** | App Router + React 19 + SSR対応（Cloud Run 用に standalone 出力） |
| ☁️ **Cloud Run + Firebase Hosting** | コンテナで配信。Firebase Hosting が全リクエストを Cloud Run へ rewrite |
| 📧 **AWS SES** | 問い合わせフォームのメール送信（Google OIDC → AWS `AssumeRoleWithWebIdentity` の鍵レス認証） |
| 🎨 **Tailwind CSS** | ユーティリティファーストなスタイリング |
| 🔄 **GitHub Actions** | CI チェック（`ci.yml`）+ GCP への鍵レスデプロイ（`deploy-gcp.yml`） |
| 📦 **pnpm** | 高速で効率的なパッケージ管理 |
| 🐳 **Devcontainer** | 統一された開発環境 |

---

## 📁 プロジェクト構成

```
tarophotos.com/
├── apps/
│   └── web/                 # Next.js アプリケーション
├── packages/
│   ├── tsconfig/            # 共有 TypeScript 設定
│   └── eslint-config/       # 共有 ESLint 設定
├── infra/                   # AWS CDK（SES ID の定義のみ。deploy しない — 下記参照）
├── docs/                    # ドキュメント
│   ├── 00_project/          # プロジェクト管理
│   ├── 20_development/      # 開発ガイド
│   └── 30_operations/       # 運用ガイド
├── Dockerfile               # Cloud Run 用イメージ（Next.js standalone）
├── firebase.json            # Firebase Hosting 設定（全リクエストを Cloud Run へ rewrite）
└── .github/workflows/       # CI（ci.yml）/ デプロイ（deploy-gcp.yml）
```

---

## 🚀 クイックスタート

### 前提条件

| ツール | 最小バージョン | 推奨 |
|--------|--------------|------|
| Node.js | 18.17.0 | 20.x LTS（CI・Docker イメージと同じ） |
| pnpm | 8.0.0 | 10.x（`package.json` の `packageManager`） |
| Docker | - | 最新版（Devcontainer使用時） |

### 1. リポジトリのクローン

```bash
git clone https://github.com/Taro-Photos/tarophotos.com.git
cd tarophotos.com
```

### 2. 依存関係のインストール

```bash
pnpm install
```

### 3. 開発サーバーの起動

```bash
pnpm dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

> ローカルで問い合わせフォームから実際にメールを送るには SES の設定が必要です。[SES メール機能ガイド](docs/20_development/ses-email-guide.ja.md#ローカル開発環境) を参照してください。

### Devcontainer を使用する場合（推奨）

1. Docker Desktop または Rancher Desktop を起動
2. VS Code でプロジェクトを開く
3. コマンドパレット (Ctrl+Shift+P) → **「Dev Containers: Reopen in Container」**

> **Note**: Docker context の設定については [Devcontainer 利用ガイド](docs/20_development/devcontainer-guide.md) を参照してください。

---

## ☁️ デプロイ

### デプロイフロー

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: main にマージ（apps/web/**, packages/**, Dockerfile,    │
│          firebase.json, deploy-gcp.yml, pnpm-lock.yaml）         │
│          → .github/workflows/deploy-gcp.yml が起動               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: GitHub Actions OIDC → GCP Workload Identity Federation │
│          → docker build → Artifact Registry へ push              │
│          → gcloud run deploy（Cloud Run service `tarophotos`）   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: firebase deploy --only hosting:tarophotos-web          │
│          → Firebase Hosting が全リクエストを Cloud Run へ rewrite │
└─────────────────────────────────────────────────────────────────┘
```

- 認証は鍵レス（Workload Identity Federation）のため、GitHub Secrets やクラウドの鍵は不要です。
- 手動で再デプロイ: Actions → **Deploy to GCP (Cloud Run + Firebase Hosting)** → Run workflow
- `ci.yml` はチェック専用（lint / 型チェック / テスト / ビルド / e2e / cdk synth）で、デプロイジョブはありません。

詳細な手順は [デプロイ手順書](docs/30_operations/deployment.ja.md) を参照してください。

---

## 🔐 必要な環境変数

### GitHub repository variables（本番の実行時 env）

**Settings → Secrets and variables → Actions → Variables** に設定します（secrets ではなく *variables*）。`deploy-gcp.yml` が `--update-env-vars` で Cloud Run に配線します。

| 変数名 | 説明 |
|-------|------|
| `SES_REGION` | SES の AWS リージョン |
| `SES_FROM_EMAIL` | 送信元アドレス（SES で検証済みであること） |
| `SES_TO_EMAIL` | 問い合わせ通知の送信先 |
| `SES_AWS_ROLE_ARN` | web identity federation で引き受ける AWS ロール（`tarophotos-ses-federation`） |

> ⚠️ `SES_AWS_ROLE_ARN` が未設定だとデプロイは **fail-closed で止まります**（静的キーへの無言フォールバックはしません）。

### ローカル環境変数

[SES メール機能ガイド](docs/20_development/ses-email-guide.ja.md#ローカル開発環境) を参照してください。

---

## 📋 利用可能なコマンド

| コマンド | 説明 |
|---------|------|
| `pnpm dev` | 開発サーバー起動 |
| `pnpm build` | プロダクションビルド |
| `pnpm lint` | ESLint 実行 |
| `pnpm format` | Prettier でフォーマット |
| `pnpm test` | テスト実行 |

### CDK コマンド（infra/）

`infra/` は SES ID（`SesStack`）の定義のみで、CI からは**適用しません**。

| コマンド | 説明 |
|---------|------|
| `npx cdk synth` | CloudFormation テンプレート生成（CI でも実行） |

> ⚠️ `npx cdk deploy` は実行しないでください。stack 名 `SesStack` は同一 AWS アカウント・リージョンの i-willink.com の stack（同サイトの本番 SES ID を保持）と衝突します（`.github/workflows/ci.yml` 末尾のコメント参照）。名前の衝突を解消するまで deploy しません。

---

## 📚 ドキュメント

| ドキュメント | 対象者 | 説明 |
|------------|-------|------|
| [HANDOFF](docs/HANDOFF.md) | 全員 | 本番の現行構成の要約 |
| [ドキュメント管理ルール](docs/00_project/DOCUMENT_RULES.ja.md) | 開発者 | ドキュメントの書き方 |
| [開発環境セットアップ](docs/20_development/getting-started.ja.md) | 開発者 | 開発環境の構築手順 |
| [Devcontainer 利用ガイド](docs/20_development/devcontainer-guide.ja.md) | 開発者 | Docker開発環境の利用方法 |
| [SES メール機能ガイド](docs/20_development/ses-email-guide.ja.md) | 開発者 | 問い合わせフォームのメール送信 |
| [デプロイ手順書](docs/30_operations/deployment.ja.md) | 運用者 | Cloud Run + Firebase Hosting へのデプロイ |
| [CI/CD パイプライン仕様](docs/30_operations/ci-cd-pipeline.md) | 運用者 | `ci.yml` / `deploy-gcp.yml` の仕様（英語） |
| [検証ガイド](docs/30_operations/verification-guide.ja.md) | 運用者 | デプロイ後の動作確認 |

---

## 🤝 コントリビューション

コントリビューションを歓迎します！詳細は [CONTRIBUTING.ja.md](CONTRIBUTING.ja.md) をご覧ください。

---

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。
