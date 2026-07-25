# HANDOFF — tarophotos.com の現在地

> 最終更新: 2026-07-25（AWS → GCP 移行のカットオーバー完了時点）

## 本番はもう Amplify ではない

2026-07-25 に本番を **AWS Amplify → Google Cloud Run + Firebase Hosting** へ切り替えた（TLS 断ゼロ）。

| 層 | 実体 |
|---|---|
| ホスティング | Firebase Hosting site `tarophotos-web`（`firebase.json` の rewrite で全リクエストを Cloud Run へ） |
| アプリ | Cloud Run service `tarophotos`（asia-northeast1・Next.js standalone コンテナ） |
| コンテナ | Artifact Registry `asia-northeast1-docker.pkg.dev/iwillink-web/web/tarophotos` |
| デプロイ | `.github/workflows/deploy-gcp.yml`（WIF 鍵レス認証・main への push で発火） |
| 実行時 env | GitHub repository **variables**（`SES_REGION` / `SES_FROM_EMAIL` / `SES_TO_EMAIL` / `SES_AWS_ROLE_ARN`）→ `gcloud run deploy --update-env-vars` で配線 |
| DNS | Route53（apex A `199.36.158.100` / www CNAME `tarophotos-web.web.app`）— ゾーンの Cloud DNS 移行は移行計画 P6 |

## フォームのメール送信は「鍵レス」になった

問い合わせフォームの SES 送信は **静的 IAM キーを廃し、Google OIDC → AWS `AssumeRoleWithWebIdentity` の federation** に移行済み（`src/app/api/_lib/process-form-submission.ts`）。Cloud Run のランタイム SA が metadata server から ID トークンを取り、AWS ロール `tarophotos-ses-federation` を引き受けて `ses:SendEmail` する。

AWS 側ロールの台帳は [willink-infra の docs/aws-federation](https://github.com/i-Willink-LLC/willink-infra/tree/main/docs/aws-federation/tarophotos-ses-federation)。

> ⚠️ `SES_AWS_ROLE_ARN` が未設定だと deploy CI は **fail-closed で止まる**（静的キーへの無言フォールバックをさせないため）。

## ⚠️ ドキュメントが実態から遅れている

`docs/` 配下の **10 ファイルが Amplify 前提のまま**（`deployment.{ja.,}md` / `ci-cd-pipeline.md` / `verification-guide.{ja.,}md` / `getting-started.{ja.,}md` / `ses-email-guide.{ja.,}md` / `README.md`）。特に `deployment.ja.md` は GitHub トークンの保管に AWS Secrets Manager（$0.40/月）を推奨しているが、**この方式は全社的に廃止済み**（鍵レス WIF へ移行）。

**改訂のタイミングは 2026-08-08**（Amplify app `dmjg8rzuebq6z` の削除日）。それまでは Amplify をロールバック用に生かしているため、両方の記述が必要な過渡期にある。

## 次のセッションがやること

1. **2026-08-08 以降**: Amplify app `dmjg8rzuebq6z` を削除 → 同時に Amplify env に残っている **SES 静的 IAM キーを失効** → 上記 10 ファイルを Cloud Run 版へ改訂
2. 同時に不要化した AWS 資産を撤去: Lambda `taroPhotosContact` + API Gateway `taro-photos-contact-api`（旧フォーム backend・Cloud Run 移行で不要）
3. サイト刷新（redesign）作業は移行とは独立に継続可

## 参照

- 移行計画の正本: [crew の 2026-07-19-gcp-migration-plan.md](https://github.com/i-Willink-LLC/i-willink-crew/blob/main/departments/pm/projects/2026-07-19-gcp-migration-plan.md)（§5 = カットオーバー標準手順）
- インフラ定義: [willink-infra](https://github.com/i-Willink-LLC/willink-infra)（`tarophotos.tf`）
