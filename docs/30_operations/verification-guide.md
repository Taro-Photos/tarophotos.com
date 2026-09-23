# Verification Guide

[日本語 (Japanese)](verification-guide.ja.md)

This guide explains how to verify that a change reached production correctly on **Cloud Run + Firebase Hosting** (see the [Deployment Guide](deployment.md) for the architecture).

> **Last Updated**: 2026-09-23
>
> All commands below are read-only. The only step with a side effect is Scenario 6 (it sends real email).

## 📋 Prerequisites

1. **Tools**
   - `curl` and `dig`
   - [GitHub CLI](https://cli.github.com/) (`gh`) authenticated for `Taro-Photos/tarophotos.com` (Scenarios 1–2; the web UI works too)
   - [gcloud CLI](https://cloud.google.com/sdk/gcloud) with read access to project `iwillink-web` (Scenarios 5–6 only)

2. **Context**
   - Production deploys run only from `main` via `.github/workflows/deploy-gcp.yml`. There is no staging environment and no local deploy path.

---

## ✅ Scenario 1: CI Checks on the Pull Request
**Objective**: Confirm the change passes `ci.yml` before merging.

1. **Check the PR checks**
   ```bash
   gh pr checks <PR number>
   ```
2. **Verify**
   - `Lint & Type Check`, `Test`, `Build` and `E2E (responsive)` pass when `apps/**`, `packages/**`, `package.json` or `pnpm-lock.yaml` changed.
   - `CDK Check` (`cdk synth`) passes when `infra/**` changed.

---

## ✅ Scenario 2: Deploy Workflow Succeeded
**Objective**: Confirm `deploy-gcp.yml` ran for the merge and every step passed.

1. **Find the run**
   ```bash
   gh run list --workflow=deploy-gcp.yml --limit 5
   ```
2. **Inspect it**
   ```bash
   gh run view <run id>
   ```
3. **Verify**
   - The run's commit matches the merge commit on `main`.
   - `Verify Cloud Run revision serves` and `Verify Hosting front` both passed (HTTP 200 and the page contains `ds-wrap`).

> If the merge did not touch a trigger path (`apps/web/**`, `packages/**`, `Dockerfile`, `firebase.json`, `deploy-gcp.yml`, `pnpm-lock.yaml`), no run is expected.

---

## ✅ Scenario 3: Production Responds
**Objective**: Confirm the public domains serve the new build through Firebase Hosting.

1. **Check the status codes**
   ```bash
   curl -sI https://tarophotos.com/ | head -n 1
   curl -sI https://www.tarophotos.com/ | head -n 1
   curl -sI https://tarophotos-web.web.app/ | head -n 1
   ```
2. **Check the content**
   ```bash
   curl -s "https://tarophotos.com/?cb=$(date +%s)" | grep -c 'ds-wrap'
   ```
3. **Verify**
   - Each domain responds without error, and the page contains `ds-wrap` (the same check the workflow uses).
   - The change you shipped is visible in a browser (use a cache-busting query string if needed).

---

## ✅ Scenario 4: DNS Points to Firebase Hosting
**Objective**: Confirm the Route53 records are as expected.

```bash
dig +short tarophotos.com A
# Expected: 199.36.158.100

dig +short www.tarophotos.com CNAME
# Expected: tarophotos-web.web.app.
```

---

## ✅ Scenario 5: Cloud Run Revision and Runtime Env
**Objective**: Confirm the latest revision is serving and the SES variables are wired.

1. **Check which revision serves traffic**
   ```bash
   gcloud run services describe tarophotos \
     --region=asia-northeast1 --project=iwillink-web \
     --format='yaml(status.latestReadyRevisionName,status.traffic)'
   ```
   - The latest ready revision should receive 100% of traffic. If traffic is pinned to an older revision (e.g. after a rollback), see [Rollback](deployment.md#rollback).

2. **Check the runtime env**
   ```bash
   gcloud run services describe tarophotos \
     --region=asia-northeast1 --project=iwillink-web \
     --format='yaml(spec.template.spec.containers[0].env)'
   ```
   - `SES_REGION`, `SES_FROM_EMAIL`, `SES_TO_EMAIL` and `SES_AWS_ROLE_ARN` are present.
   - No static AWS keys (`SES_AWS_ACCESS_KEY_ID` / `SES_AWS_SECRET_ACCESS_KEY`) are present.

---

## ✅ Scenario 6: Contact Form End-to-End
**Objective**: Confirm keyless SES sending works in production.

> ⚠️ This sends real email: a notification to `SES_TO_EMAIL` and an auto-response to the address you enter. Use your own address.

1. **Submit the form**
   - Open https://tarophotos.com/contact, wait a few seconds (submissions faster than 3 s are silently dropped), fill in the required fields and submit.
2. **Check the logs**
   ```bash
   gcloud logging read \
     'resource.type="cloud_run_revision" AND resource.labels.service_name="tarophotos" AND textPayload:"[forms:contact]"' \
     --project=iwillink-web --limit=10
   ```
3. **Verify**
   - The form shows success, both emails arrive, and the logs contain `[forms:contact] email sent to ...` and `[forms:contact] auto-response sent to ...`.
   - If sending fails, see [SES Email Guide - Troubleshooting](../20_development/ses-email-guide.md#-troubleshooting).

---

## 🧹 Cleanup Procedure

No resources are created by these checks, so there is nothing to clean up. Delete any test emails you received if needed.
