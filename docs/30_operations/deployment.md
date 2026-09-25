# Deployment Guide

[日本語 (Japanese)](deployment.ja.md)

> **Last Updated**: 2026-09-23
> **Status**: Approved

## Overview

This project hosts the Next.js application on **Google Cloud Run**, fronted by **Firebase Hosting**.
Deployment is fully automated by GitHub Actions (`.github/workflows/deploy-gcp.yml`) with keyless authentication, and can also be re-run manually.
For detailed pipeline specifications, please refer to [CI/CD Pipeline Specification](ci-cd-pipeline.md).

> History: production moved from AWS Amplify to Cloud Run + Firebase Hosting on 2026-07-25, and the Amplify app was deleted on 2026-09-01. Amplify is not a rollback target.

---

## Architecture

| Layer | Resource |
|-------|----------|
| Hosting | Firebase Hosting site `tarophotos-web` (`firebase.json` rewrites every request to Cloud Run) |
| App | Cloud Run service `tarophotos` (`asia-northeast1`, Next.js standalone container built from `Dockerfile`) |
| Container | Artifact Registry `asia-northeast1-docker.pkg.dev/iwillink-web/web/tarophotos` (tagged with the commit SHA) |
| Deploy | `.github/workflows/deploy-gcp.yml` (GitHub Actions OIDC → GCP Workload Identity Federation) |
| Runtime env | GitHub repository **variables** → `gcloud run deploy --update-env-vars` |
| DNS | Route53 (apex A `199.36.158.100` / www CNAME `tarophotos-web.web.app`) |

The GCP resources (project `iwillink-web`, service accounts, WIF provider, etc.) are managed in [willink-infra](https://github.com/i-Willink-LLC/willink-infra) (`tarophotos.tf`), not in this repository.

---

## Deployment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: Merge to main branch                                   │
│          → deploy-gcp.yml starts (path filter below)            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: Authenticate to GCP (WIF, keyless)                     │
│          → docker build → push to Artifact Registry             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: gcloud run deploy tarophotos (with runtime env vars)   │
│          → verify the Cloud Run URL returns 200                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: firebase deploy --only hosting:tarophotos-web          │
│          → verify https://tarophotos-web.web.app returns 200    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Automatic Deployment

### Trigger

A push to `main` that changes any of the following paths:

- `apps/web/**`
- `packages/**`
- `Dockerfile`
- `firebase.json`
- `.github/workflows/deploy-gcp.yml`
- `pnpm-lock.yaml`

Changes to other paths only (e.g. `docs/**`, `infra/**`) do **not** deploy. Runs are serialized (`concurrency: gcp-deploy-main`, no cancellation).

### Workflow Steps

| Step | Content |
|------|---------|
| Authenticate to GCP (WIF) | `google-github-actions/auth` with the WIF provider and `tarophotos-deployer@iwillink-web.iam.gserviceaccount.com` |
| Build / Push image | `docker build` from the repo root (`Dockerfile`), push `$IMAGE:<commit SHA>` |
| Deploy to Cloud Run | Fails closed if `SES_AWS_ROLE_ARN` is unset, then `gcloud run deploy` (settings below) |
| Verify Cloud Run revision serves | `curl` the service URL: HTTP 200 and the page contains `ds-wrap` |
| Deploy Firebase Hosting | `npx firebase-tools@14 deploy --only hosting:tarophotos-web --project iwillink-web` |
| Verify Hosting front | `curl https://tarophotos-web.web.app/`: HTTP 200 and contains `ds-wrap` |

### Cloud Run Settings (set on every deploy)

| Setting | Value |
|---------|-------|
| Project / Region | `iwillink-web` / `asia-northeast1` |
| Runtime service account | `tarophotos-runtime@iwillink-web.iam.gserviceaccount.com` |
| Unauthenticated access | Allowed (`--allow-unauthenticated`) |
| Port | `8080` |
| CPU / Memory | `1` / `512Mi` |
| Instances | min `0` / max `2` |

---

## Manual Re-deployment

1. Open the **Actions** tab in the GitHub repository.
2. Select **Deploy to GCP (Cloud Run + Firebase Hosting)**.
3. Click **Run workflow** on `main`.

Or with the GitHub CLI:

```bash
gh workflow run deploy-gcp.yml --ref main
```

Use this after changing repository variables, or to re-deploy without a code change.

---

## Authentication (Keyless)

GitHub Actions obtains an OIDC token and exchanges it through GCP Workload Identity Federation. **No GitHub Secrets, GitHub PAT or cloud keys are used.**

| Item | Value |
|------|-------|
| WIF provider | `projects/626363975800/locations/global/workloadIdentityPools/github/providers/github-oidc` |
| Deployer SA | `tarophotos-deployer@iwillink-web.iam.gserviceaccount.com` |
| Deployer roles | `artifactregistry.writer` / `run.admin` / `firebasehosting.admin` / actAs on the runtime SA |
| Workflow permissions | `contents: read` / `id-token: write` |

---

## Runtime Environment Variables

Set as GitHub **repository variables** (Settings → Secrets and variables → Actions → **Variables**). They are not secrets; the repository is public, so the values are not written into the workflow.

| Variable | Description |
|----------|-------------|
| `SES_REGION` | AWS region for SES |
| `SES_FROM_EMAIL` | Sender address (verified in SES) |
| `SES_TO_EMAIL` | Contact form notification recipient |
| `SES_AWS_ROLE_ARN` | AWS role `tarophotos-ses-federation`, assumed with `AssumeRoleWithWebIdentity` |

- The deploy **fails closed** when `SES_AWS_ROLE_ARN` is unset, so it can never silently fall back to static keys.
- `--update-env-vars` only updates the listed variables; other env vars already on the Cloud Run service are kept across deploys.
- After changing a variable, run the workflow manually (see above) to apply it.

The contact form's email flow is described in the [SES Email Guide](../20_development/ses-email-guide.md).

---

## Custom Domain / DNS

`tarophotos.com` is served by Firebase Hosting (site `tarophotos-web`). DNS stays on Route53:

| Record | Type | Value |
|--------|------|-------|
| `tarophotos.com` | A | `199.36.158.100` |
| `www.tarophotos.com` | CNAME | `tarophotos-web.web.app` |

Moving the zone to Cloud DNS is planned as phase P6 of the migration plan.

---

## Rollback

Amplify no longer exists, so rollback happens within Cloud Run / GitHub.

### Method A: Revert on main (Recommended)

Revert the offending commit and merge to `main`. `deploy-gcp.yml` builds and deploys the reverted code through the normal path.

### Method B: Route traffic to a previous Cloud Run revision

```bash
# List revisions
gcloud run revisions list --service=tarophotos --region=asia-northeast1 --project=iwillink-web

# Send 100% of traffic to a known-good revision
gcloud run services update-traffic tarophotos \
  --to-revisions=REVISION_NAME=100 \
  --region=asia-northeast1 --project=iwillink-web
```

> ⚠️ While traffic is pinned to a specific revision, newly deployed revisions do not receive traffic. After fixing forward, restore it with `gcloud run services update-traffic tarophotos --to-latest --region=asia-northeast1 --project=iwillink-web`.

---

## Infrastructure in this Repository (`infra/`)

`infra/` contains only the AWS CDK definition of the SES identity (`SesStack`). CI runs `cdk synth` as a check but **never deploys it**.

> ⚠️ The stack name `SesStack` collides with the i-willink.com stack in the same AWS account/region, which holds that site's production SES identity (see the comment at the end of `.github/workflows/ci.yml`). A `cdk deploy` would overwrite it, so **do not deploy `SesStack` until the name collision is resolved**. Once it is, apply changes by hand naming the target stack explicitly, authenticated with temporary credentials (e.g. `aws sso login`), never static keys.

---

## Prerequisite Permissions

| Who | Permission |
|-----|------------|
| Deploy (CI) | Granted to `tarophotos-deployer` via WIF (managed in willink-infra) — nothing to set up per developer |
| Changing runtime env | Admin access to the GitHub repository (to edit repository variables) |
| Manual rollback (Method B) | `run.admin` (or equivalent) on project `iwillink-web` |

---

## Required Configuration List

| Location | Name | Description |
|----------|------|-------------|
| GitHub repository variables | `SES_REGION` | SES region |
| GitHub repository variables | `SES_FROM_EMAIL` | Sender address |
| GitHub repository variables | `SES_TO_EMAIL` | Notification recipient |
| GitHub repository variables | `SES_AWS_ROLE_ARN` | Federation role ARN (deploy fails if unset) |

No GitHub Secrets are required for deployment.

---

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| `repository variable SES_AWS_ROLE_ARN is unset` | Repository variable missing | Set `SES_AWS_ROLE_ARN` under Actions → Variables and re-run |
| Failure in `Authenticate to GCP (WIF)` | WIF provider / SA binding does not allow this repository | Check the WIF and SA settings in willink-infra |
| `Verify Cloud Run revision serves` fails | New revision returns non-200 or the page lacks `ds-wrap` | Check Cloud Run logs for the revision (`gcloud logging read 'resource.type="cloud_run_revision" AND resource.labels.service_name="tarophotos"' --project=iwillink-web --limit=50`) |
| `Verify Hosting front` fails | Hosting rewrite or Cloud Run not serving via Hosting | Check `firebase.json` and the Firebase Hosting release for `tarophotos-web` |
| Merge to main did not deploy | No change under the trigger paths | Run the workflow manually |
| Contact form returns 500 | SES configuration or credentials | See the [SES Email Guide](../20_development/ses-email-guide.md#-troubleshooting) |
