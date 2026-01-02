# AWS Amplify Hosting Runbook

_Last updated: September 27, 2025_

## Prerequisites
- Node.js 20 or newer locally to match the Amplify build image. Node 18 support in Amplify Hosting sunsets on September 15, 2025, so upgrade before configuring CI builds.
- GitHub repository access with the `main` branch ready for deployment.
- AWS account with Amplify Hosting enabled and permissions to connect Git repositories.

## One-Time Setup
1. **Connect the repo**
   - In the Amplify console, choose *New app › Host web app*, select *GitHub*, and authorize the repo.
   - Pick the branch you want to deploy (typically `main`).
2. **Build settings**
   - Accept the detected app root (repository root) and ensure Amplify picks up the `amplify.yml` file committed at the repo root. If Amplify attempts to autogenerate settings, switch to "Edit" and paste the contents from `amplify.yml`.
   - Confirm the environment uses Node.js 20 in the pre-build phase. The committed `amplify.yml` already runs `nvm install 20 && nvm use 20` before installing dependencies.
   - The AWS sample template includes a `backend` phase with `npx ampx pipeline-deploy`. We intentionally omit that block because this project hosts a frontend-only Next.js app and does not provision Amplify backend resources. Reintroduce the backend phase if we later adopt Amplify-managed APIs, Auth, or Storage.
   - We cache `node_modules` and `.next/cache` by default. Add the `.npm` cache path only if we switch to `npm ci --cache .npm` to avoid persisting empty directories between builds.
3. **Environment variables**
   - AWS SES credentials (managed via IAM role in Amplify):
     - `SES_REGION` — AWS Region for SES (e.g. `ap-northeast-1`).
     - `SES_FROM_EMAIL` — Verified sender address used for all form notifications (e.g. `noreply@taro.photos`).
   - Notification recipients:
     - `BOOKING_NOTIFICATION_EMAIL` — Internal inbox for booking inquiries.
     - `CONTACT_NOTIFICATION_EMAIL` — Internal inbox for general contact inquiries.
   - Public-facing contact channels:
     - `NEXT_PUBLIC_PRIMARY_CONTACT_EMAIL` — Email surfaced in the site footer, about page, and legal notices.
     - `NEXT_PUBLIC_DELIVERY_SUPPORT_EMAIL` — Email shown on delivery support sections.
   - `NEXT_PUBLIC_ALLOW_DARK_THEME` — Set to `true` (or `1`) when the deployment should follow the visitor's OS dark-mode preference. Leave unset to force light mode across the site.
   - Keep the same keys in `.env.local` for local testing. ローカル開発では AWS CLI のプロファイル (`~/.aws/credentials`) が自動的に使用されます。テスト時は `SES_FROM_EMAIL` と `CONTACT_NOTIFICATION_EMAIL` の両方が Verified Identity である必要があります（サンドボックス環境の場合）。
   - Any time you change these values, trigger a redeploy so Amplify rebuilds with the new environment.
4. **Save & deploy**
   - Amplify installs dependencies via `npm ci`, runs the linter (`npm run lint`), then executes `npm run build`. Build output in `.next` is uploaded automatically for SSR/App Router hosting.

## Development Flow
- Push to the connected branch to trigger Amplify. Monitor build logs in the console; lint failures stop the deployment early.
- For previews, enable pull-request previews in *App settings › Preview settings* to spin up temporary amplifications per PR.
- Use *Rewrites and redirects* under *App settings* to manage custom paths if needed. The default configuration already supports App Router dynamic routes.

## Custom Domains & Caching
- Attach custom domains via *Domain management*. Amplify provisions ACM certificates automatically; allow ~15 minutes for DNS validation.
- The `.next` cache is persisted between builds via the cache paths declared in `amplify.yml`. Invalidate manually from the Amplify console after publishing important asset changes to bypass cached responses.

## Rollbacks & Monitoring
- Failed deployments stay isolated. Use the Amplify console's build history to redeploy a prior successful artifact if needed.
- Integrate CloudWatch alarms for the Amplify-hosted app by enabling full-stack observability in *App settings*.

## Local Verification
Before pushing, run:

```bash
npm run lint
npm run build
```

These commands mirror the Amplify pipeline, ensuring parity between local checks and the hosted environment.
