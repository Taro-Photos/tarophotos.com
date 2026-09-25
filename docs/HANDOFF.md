# HANDOFF — tarophotos.com の現在地

> 最終更新: 2026-09-23（移行後の後片付け完了時点）

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

## 移行後の後片付け（完了）

| 日付 | 内容 |
|---|---|
| 2026-09-01 | Amplify app `dmjg8rzuebq6z` を削除。CI の deploy-app と CDK の AmplifyStack も撤去（#44） |
| 2026-09-23 | 旧フォーム backend（Lambda `taroPhotosContact` + HTTP API `taro-photos-contact-api` + 実行ロール）を削除。90 日間の呼び出しは 0 件だった |
| 2026-09-23 | 静的 IAM キーを無効化: `tarophotos-ses-sender`（旧 SES 送信用）/ `tarophotos-cicd-user`（旧 Amplify デプロイ用） |
| 2026-09-23 | ci.yml から secrets 必須チェック（AWS キー / GH_PAT / AMPLIFY_APP_NAME 等）を削除。README と docs/ を Cloud Run 版に改訂 |
| 2026-09-25 | apps/web の Amplify 残骸を撤去（#47）: フォーム送信の静的キー fallback を削除し、Cloud Run 上で `SES_AWS_ROLE_ARN` が無ければ送信前に 500（fail-closed）。next.config の Amplify 用 env 列挙・`.env.local.example` の AWS キー欄・Amplify runbook も削除 |

`ci.yml` はチェック専用で、デプロイジョブは持たない。`infra/` の CDK `SesStack` は **同一アカウントの i-willink.com の stack と名前が衝突する**ため、衝突を解消するまで deploy しない（`ci.yml` 末尾コメント参照）。

## 次のセッションがやること

1. **2026-10 下旬を目安に**: 無効化した 2 つの IAM キーで問題が出ていなければ、キーを削除し、IAM ユーザー `tarophotos-ses-sender` / `tarophotos-cicd-user` も削除する（`tarophotos-cicd-user` は `i-willink-cicd-group` から外してから）
2. GitHub の不要になった secrets を削除: `AMPLIFY_APP_NAME` / `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `GH_PAT` / `DOMAIN_NAME` / `REPO_NAME` / `SES_FROM_EMAIL` / `SES_REGION` / `SES_TO_EMAIL`（実行時 env は repository **variables** 側を使う）
3. 旧 Lambda のバックアップ（コード + 設定。秘密値は伏せ字）はリポジトリ外のローカル `~/GitHub/_aws-backups/tarophotos-legacy-contact-2026-09-23/` にある。不要になったら消してよい。CloudWatch Logs `/aws/lambda/taroPhotosContact`（約 15KB）は残している
4. DNS ゾーンの Cloud DNS 移行（移行計画 P6）
5. サイト刷新（redesign）作業は継続可

## 参照

- 移行計画の正本: [crew の 2026-07-19-gcp-migration-plan.md](https://github.com/i-Willink-LLC/i-willink-crew/blob/main/departments/pm/projects/2026-07-19-gcp-migration-plan.md)（§5 = カットオーバー標準手順）
- インフラ定義: [willink-infra](https://github.com/i-Willink-LLC/willink-infra)（`tarophotos.tf`）
