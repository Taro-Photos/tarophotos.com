# 開発環境セットアップ

[English](getting-started.md)

> **最終更新**: 2026-09-23  
> **ステータス**: Approved

## 概要

このガイドでは、tarophotos.com の開発環境をセットアップする手順を説明します。

## 前提条件

| ツール | 最小バージョン | 推奨 |
|--------|--------------|------|
| Node.js | 18.17.0 | 20.x LTS（CI・Docker イメージと同じ） |
| pnpm | 8.0.0 | 10.x（`package.json` の `packageManager`） |
| Git | 2.30.0 | 最新版 |

## セットアップ手順

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

> ローカルで問い合わせフォームからメールを送るには、[SES メール機能ガイド](./ses-email-guide.ja.md#ローカル開発環境) に従って `apps/web/.env.local` を設定してください。`SES_FROM_EMAIL` が未設定だと `/api/contact` は 500（"Email delivery is not configured."）を返します。

## ビルド

```bash
pnpm build
```

## コード品質チェック

```bash
# Lint
pnpm lint

# ユニットテスト（Vitest）
pnpm test

# E2E（Playwright・apps/web/tests/e2e）
pnpm --filter @repo/web exec playwright test

# フォーマット
pnpm format
```

## Devcontainer（オプション）

Docker を使用して統一された開発環境を利用できます。

1. Docker Desktop または Rancher Desktop を起動
2. VS Code でプロジェクトを開く
3. コマンドパレット (Ctrl+Shift+P) → **「Dev Containers: Reopen in Container」**

詳細は [devcontainer-guide.md](./devcontainer-guide.md) を参照してください。

## ホスティングとインフラ

本番は **Google Cloud Run + Firebase Hosting** で稼働しています。`main` へのマージで `.github/workflows/deploy-gcp.yml` が自動デプロイするため、手元からデプロイする作業はありません。

- GCP 側のリソース（Cloud Run / Artifact Registry / Firebase Hosting / Workload Identity Federation）はこのリポジトリの外（willink-infra）で定義されています。
- `infra/` は SES ID（`SesStack`）の AWS CDK 定義のみで、CI からは適用しません。

詳細は以下を参照してください：
- [デプロイ手順書](../30_operations/deployment.ja.md)
- [README.ja.md - デプロイ](../../README.ja.md#-デプロイ)

## 次のステップ

- [ドキュメント管理ルール](../00_project/DOCUMENT_RULES.md)
