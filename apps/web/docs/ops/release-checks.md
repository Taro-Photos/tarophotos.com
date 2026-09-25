# Release Checks

Run these validation steps before merging into `release/staging` or `release/production`.

## Automated Script

```bash
npm run release:check
```

The script enforces Node.js 20+, then runs:

1. Lint (`npm run lint`)
2. Unit tests (`npm run test`)
3. Production build (`npm run build`)

### Flags

- `--skip-test` – omit unit tests when they are covered elsewhere.
- `--skip-build` – omit the production build (not recommended for releases).
- `--with-e2e` – append Playwright E2E tests (`npm run test:e2e`). Use this when browsers are installed and credentials are configured.
- `--with-typecheck` – adds a strict `tsc --noEmit` pass when you want coverage beyond what `next build` already validates.

The script stops at the first failure and returns a non-zero exit code.

## Manual Follow-up

- Production runs on Cloud Run + Firebase Hosting; merging to `main` deploys via `.github/workflows/deploy-gcp.yml`.
- Runtime env (`SES_REGION` / `SES_FROM_EMAIL` / `SES_TO_EMAIL` / `SES_AWS_ROLE_ARN`) comes from GitHub repository variables; confirm they are set before releasing (the deploy fails closed if `SES_AWS_ROLE_ARN` is unset).
- Trigger smoke checks or targeted E2E specs after deploy if `--with-e2e` was skipped.
- Monitor the `Deploy to GCP` workflow run and confirm https://tarophotos.com/ returns 200.
