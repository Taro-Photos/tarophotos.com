# 検証ガイド

[English](verification-guide.md)

このガイドでは、変更が **Cloud Run + Firebase Hosting** の本番に正しく反映されたかを確認する手順を説明します（構成は [デプロイ手順](deployment.ja.md) を参照）。

> **最終更新**: 2026-09-23
>
> 以下のコマンドはすべて読み取り専用です。副作用があるのはシナリオ6（実際にメールが送信される）のみです。

## 📋 前提条件

1. **ツール**
   - `curl` と `dig`
   - `Taro-Photos/tarophotos.com` にアクセスできる [GitHub CLI](https://cli.github.com/)（`gh`）（シナリオ1〜2。Web UI でも可）
   - プロジェクト `iwillink-web` の読み取り権限を持つ [gcloud CLI](https://cloud.google.com/sdk/gcloud)（シナリオ5〜6のみ）

2. **前提知識**
   - 本番へのデプロイは `main` から `.github/workflows/deploy-gcp.yml` 経由でのみ行われます。ステージング環境やローカルからのデプロイ経路はありません。

---

## ✅ シナリオ1: Pull Request の CI チェック
**目的**: マージ前に変更が `ci.yml` を通過することを確認する。

1. **PR のチェックを確認**
   ```bash
   gh pr checks <PR 番号>
   ```
2. **確認**
   - `apps/**`・`packages/**`・`package.json`・`pnpm-lock.yaml` に変更がある場合、`Lint & Type Check`・`Test`・`Build`・`E2E (responsive)` が成功している。
   - `infra/**` に変更がある場合、`CDK Check`（`cdk synth`）が成功している。

---

## ✅ シナリオ2: デプロイワークフローの成功
**目的**: マージに対して `deploy-gcp.yml` が実行され、全ステップが成功したことを確認する。

1. **実行を探す**
   ```bash
   gh run list --workflow=deploy-gcp.yml --limit 5
   ```
2. **内容を確認**
   ```bash
   gh run view <run id>
   ```
3. **確認**
   - 実行のコミットが `main` のマージコミットと一致している。
   - `Verify Cloud Run revision serves` と `Verify Hosting front` が両方成功している（HTTP 200 かつページに `ds-wrap` を含む）。

> マージがトリガー対象のパス（`apps/web/**`・`packages/**`・`Dockerfile`・`firebase.json`・`deploy-gcp.yml`・`pnpm-lock.yaml`）に触れていない場合、実行されないのが正常です。

---

## ✅ シナリオ3: 本番の応答
**目的**: 公開ドメインが Firebase Hosting 経由で新しいビルドを配信していることを確認する。

1. **ステータスコードを確認**
   ```bash
   curl -sI https://tarophotos.com/ | head -n 1
   curl -sI https://www.tarophotos.com/ | head -n 1
   curl -sI https://tarophotos-web.web.app/ | head -n 1
   ```
2. **内容を確認**
   ```bash
   curl -s "https://tarophotos.com/?cb=$(date +%s)" | grep -c 'ds-wrap'
   ```
3. **確認**
   - 各ドメインがエラーなく応答し、ページに `ds-wrap` が含まれる（ワークフローと同じチェック）。
   - リリースした変更がブラウザで見える（必要に応じてキャッシュ回避のクエリ文字列を付ける）。

---

## ✅ シナリオ4: DNS が Firebase Hosting を向いている
**目的**: Route53 のレコードが想定どおりであることを確認する。

```bash
dig +short tarophotos.com A
# 期待値: 199.36.158.100

dig +short www.tarophotos.com CNAME
# 期待値: tarophotos-web.web.app.
```

---

## ✅ シナリオ5: Cloud Run のリビジョンと実行時 env
**目的**: 最新リビジョンが配信中で、SES の変数が配線されていることを確認する。

1. **トラフィックを受けているリビジョンを確認**
   ```bash
   gcloud run services describe tarophotos \
     --region=asia-northeast1 --project=iwillink-web \
     --format='yaml(status.latestReadyRevisionName,status.traffic)'
   ```
   - 最新の Ready リビジョンがトラフィックの 100% を受けていること。古いリビジョンに固定されている場合（ロールバック後など）は [ロールバック](deployment.ja.md#ロールバック) を参照。

2. **実行時 env を確認**
   ```bash
   gcloud run services describe tarophotos \
     --region=asia-northeast1 --project=iwillink-web \
     --format='yaml(spec.template.spec.containers[0].env)'
   ```
   - `SES_REGION`・`SES_FROM_EMAIL`・`SES_TO_EMAIL`・`SES_AWS_ROLE_ARN` が存在する。
   - 静的な AWS キー（`SES_AWS_ACCESS_KEY_ID` / `SES_AWS_SECRET_ACCESS_KEY`）が存在しない。

---

## ✅ シナリオ6: 問い合わせフォームの疎通
**目的**: 本番で鍵レスの SES 送信が動作することを確認する。

> ⚠️ 実際にメールが送信されます: `SES_TO_EMAIL` への通知と、入力したアドレスへの自動返信。自分のアドレスを使ってください。

1. **フォームを送信**
   - https://tarophotos.com/contact を開き、数秒待ってから（3 秒未満の送信は静かに破棄される）必須項目を入力して送信。
2. **ログを確認**
   ```bash
   gcloud logging read \
     'resource.type="cloud_run_revision" AND resource.labels.service_name="tarophotos" AND textPayload:"[forms:contact]"' \
     --project=iwillink-web --limit=10
   ```
3. **確認**
   - フォームに成功表示が出て 2 通とも届き、ログに `[forms:contact] email sent to ...` と `[forms:contact] auto-response sent to ...` が出ている。
   - 送信に失敗する場合は [SES メール機能ガイド - トラブルシューティング](../20_development/ses-email-guide.ja.md#-トラブルシューティング) を参照。

---

## 🧹 クリーンアップ手順

これらの確認ではリソースを作成しないため、クリーンアップは不要です。必要に応じて受信したテストメールを削除してください。
