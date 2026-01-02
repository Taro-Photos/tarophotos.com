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

- Confirm required environment variables are set in Amplify for the target backend.
- After deploying to `release/staging`, trigger smoke checks or targeted E2E specs if `--with-e2e` was skipped.
- Monitor Amplify pipelines for both staging and production to ensure the release succeeds.
