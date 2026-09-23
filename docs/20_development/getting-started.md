# Development Environment Setup

[日本語 (Japanese)](getting-started.ja.md)

> **Last Updated**: 2026-09-23
> **Status**: Approved

## Overview

This guide explains how to set up the development environment for tarophotos.com.

## Prerequisites

| Tool | Minimum Version | Recommended |
|------|-----------------|-------------|
| Node.js | 18.17.0 | 20.x LTS (same as CI and the Docker image) |
| pnpm | 8.0.0 | 10.x (`packageManager` in `package.json`) |
| Git | 2.30.0 | Latest |

## Setup Procedures

### 1. Clone the Repository

```bash
git clone https://github.com/Taro-Photos/tarophotos.com.git
cd tarophotos.com
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Development Server

```bash
pnpm dev
```

You can access the application at http://localhost:3000.

> To send mail from the contact form locally, set up `apps/web/.env.local` as described in the [SES Email Guide](./ses-email-guide.md#local-development-environment). Without `SES_FROM_EMAIL`, `/api/contact` returns 500 ("Email delivery is not configured.").

## Build

```bash
pnpm build
```

## Code Quality Check

```bash
# Lint
pnpm lint

# Unit tests (Vitest)
pnpm test

# E2E (Playwright, apps/web/tests/e2e)
pnpm --filter @repo/web exec playwright test

# Format
pnpm format
```

## Devcontainer (Optional)

You can use a unified development environment using Docker.

1. Start Docker Desktop or Rancher Desktop
2. Open the project in VS Code
3. Command Palette (Ctrl+Shift+P) → **"Dev Containers: Reopen in Container"**

For details, refer to [devcontainer-guide.md](./devcontainer-guide.md).

## Hosting & Infrastructure

Production runs on **Google Cloud Run + Firebase Hosting**. Merging to `main` deploys automatically via `.github/workflows/deploy-gcp.yml`; there is nothing to deploy from your machine.

- The GCP resources (Cloud Run / Artifact Registry / Firebase Hosting / Workload Identity Federation) are defined outside this repository (willink-infra).
- `infra/` contains only the AWS CDK definition of the SES identity (`SesStack`). It is not applied from CI.

For details, refer to:
- [Deployment Guide](../30_operations/deployment.md)
- [README.md - Deployment](../../README.md#-deployment)

## Next Steps

- [Documentation Rules](../00_project/DOCUMENT_RULES.md)
