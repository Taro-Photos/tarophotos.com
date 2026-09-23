# tarophotos.com

[日本語 (Japanese)](README.ja.md)

[![CI](https://github.com/Taro-Photos/tarophotos.com/actions/workflows/ci.yml/badge.svg)](https://github.com/Taro-Photos/tarophotos.com/actions/workflows/ci.yml)
[![Deploy to GCP](https://github.com/Taro-Photos/tarophotos.com/actions/workflows/deploy-gcp.yml/badge.svg)](https://github.com/Taro-Photos/tarophotos.com/actions/workflows/deploy-gcp.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Source for the Taro Photos website (tarophotos.com). A Next.js monorepo served from **Google Cloud Run behind Firebase Hosting**. The contact form sends mail through AWS SES using keyless federation (no static IAM keys).

> Originally based on [next-amplify-starter-kit](https://github.com/willink-oss/next-amplify-starter-kit). Production moved from AWS Amplify to Cloud Run + Firebase Hosting in 2026-07, and the Amplify app was deleted on 2026-09-01. See [docs/HANDOFF.md](docs/HANDOFF.md) for the current state.

---

## 📋 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Deployment](#-deployment)
- [Required Environment Variables](#-required-environment-variables)
- [Available Commands](#-available-commands)
- [Documentation](#-documentation)

---

## ✨ Features

| Technology | Description |
|------------|-------------|
| 🚀 **Turborepo** | High-performance build system and monorepo management |
| ⚡ **Next.js 16** | App Router + React 19 + SSR (standalone output for Cloud Run) |
| ☁️ **Cloud Run + Firebase Hosting** | Container hosting; Firebase Hosting rewrites every request to Cloud Run |
| 📧 **AWS SES** | Contact form email via Google OIDC → AWS `AssumeRoleWithWebIdentity` (keyless) |
| 🎨 **Tailwind CSS** | Utility-first styling |
| 🔄 **GitHub Actions** | CI checks (`ci.yml`) + keyless deploy to GCP (`deploy-gcp.yml`) |
| 📦 **pnpm** | Fast and efficient package management |
| 🐳 **Devcontainer** | Consistent development environment |

---

## 📁 Project Structure

```
tarophotos.com/
├── apps/
│   └── web/                 # Next.js Application
├── packages/
│   ├── tsconfig/            # Shared TypeScript Config
│   └── eslint-config/       # Shared ESLint Config
├── infra/                   # AWS CDK (SES identity only; not deployed — see below)
├── docs/                    # Documentation
│   ├── 00_project/          # Project Management
│   ├── 20_development/      # Development Guide
│   └── 30_operations/       # Operations Guide
├── Dockerfile               # Cloud Run image (Next.js standalone)
├── firebase.json            # Firebase Hosting config (rewrites all requests to Cloud Run)
└── .github/workflows/       # CI (ci.yml) / Deploy (deploy-gcp.yml)
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Minimum Version | Recommended |
|------|-----------------|-------------|
| Node.js | 18.17.0 | 20.x LTS (same as CI and the Docker image) |
| pnpm | 8.0.0 | 10.x (`packageManager` in `package.json`) |
| Docker | - | Latest (When using Devcontainer) |

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

Access the application at http://localhost:3000.

> The contact form needs SES settings to actually send mail locally. See the [SES Email Guide](docs/20_development/ses-email-guide.md#local-development-environment).

### Using Devcontainer (Recommended)

1. Start Docker Desktop or Rancher Desktop.
2. Open the project in VS Code.
3. Command Palette (Ctrl+Shift+P) → **"Dev Containers: Reopen in Container"**

> **Note**: For Docker context settings, please refer to the [Devcontainer Guide](docs/20_development/devcontainer-guide.md).

---

## ☁️ Deployment

### Deploy Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: Merge to main (apps/web/**, packages/**, Dockerfile,   │
│          firebase.json, deploy-gcp.yml, pnpm-lock.yaml)         │
│          → .github/workflows/deploy-gcp.yml starts              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: GitHub Actions OIDC → GCP Workload Identity Federation │
│          → docker build → push to Artifact Registry             │
│          → gcloud run deploy (Cloud Run service `tarophotos`)   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: firebase deploy --only hosting:tarophotos-web          │
│          → Firebase Hosting rewrites all requests to Cloud Run  │
└─────────────────────────────────────────────────────────────────┘
```

- No GitHub Secrets or cloud keys are needed: authentication is keyless (Workload Identity Federation).
- Manual re-deploy: Actions → **Deploy to GCP (Cloud Run + Firebase Hosting)** → Run workflow.
- `ci.yml` is checks only (lint / type check / test / build / e2e / cdk synth). It has no deploy job.

For detailed instructions, refer to the [Deployment Guide](docs/30_operations/deployment.md).

---

## 🔐 Required Environment Variables

### GitHub Repository Variables (Production Runtime)

Set under **Settings → Secrets and variables → Actions → Variables** (these are *variables*, not secrets). `deploy-gcp.yml` wires them into Cloud Run with `--update-env-vars`.

| Variable | Description |
|----------|-------------|
| `SES_REGION` | AWS region for SES |
| `SES_FROM_EMAIL` | Sender address (must be verified in SES) |
| `SES_TO_EMAIL` | Recipient of contact form notifications |
| `SES_AWS_ROLE_ARN` | AWS role assumed via web identity federation (`tarophotos-ses-federation`) |

> ⚠️ If `SES_AWS_ROLE_ARN` is unset, the deploy **fails closed** (it never silently falls back to static keys).

### Local Environment Variables

See the [SES Email Guide](docs/20_development/ses-email-guide.md#local-development-environment).

---

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format with Prettier |
| `pnpm test` | Run tests |

### CDK Commands (infra/)

`infra/` only defines the SES identity (`SesStack`). It is **not** applied from CI.

| Command | Description |
|---------|-------------|
| `npx cdk synth` | Generate CloudFormation template (also run by CI) |

> ⚠️ Do not run `npx cdk deploy`. The stack name `SesStack` collides with the i-willink.com stack in the same AWS account/region, which holds that site's production SES identity (see the comment at the end of `.github/workflows/ci.yml`). Do not deploy it until the name collision is resolved.

---

## 📚 Documentation

| Document | Target | Description |
|----------|--------|-------------|
| [HANDOFF](docs/HANDOFF.md) | Everyone | Summary of the current production setup |
| [Documentation Rules](docs/00_project/DOCUMENT_RULES.md) | Developers | How to write documentation |
| [Getting Started](docs/20_development/getting-started.md) | Developers | Setting up development environment |
| [Devcontainer Guide](docs/20_development/devcontainer-guide.md) | Developers | How to use Docker dev environment |
| [SES Email Guide](docs/20_development/ses-email-guide.md) | Developers | Contact form email sending |
| [Deployment Guide](docs/30_operations/deployment.md) | Operators | Cloud Run + Firebase Hosting deployment |
| [CI/CD Pipeline](docs/30_operations/ci-cd-pipeline.md) | Operators | `ci.yml` / `deploy-gcp.yml` specification |
| [Verification Guide](docs/30_operations/verification-guide.md) | Operators | Post-deploy verification |

---

## 🤝 Contribution

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
