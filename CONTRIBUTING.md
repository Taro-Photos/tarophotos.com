# Contributing Guide

[日本語 (Japanese)](CONTRIBUTING.ja.md)

Welcome to contribute to tarophotos.com!

## Development Flow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

> **Note**: Merging to `main` deploys production. When `apps/web/**`, `packages/**`, `Dockerfile`, `firebase.json` or `pnpm-lock.yaml` change, `.github/workflows/deploy-gcp.yml` deploys to Cloud Run + Firebase Hosting (see the [Deployment Guide](docs/30_operations/deployment.md)).

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

| Prefix | Usage |
|--------|-------|
| `feat:` | New features |
| `fix:` | Bug fixes |
| `docs:` | Documentation changes |
| `style:` | Code style changes (formatting, missing semi colons, etc) |
| `refactor:` | Refactoring (no functional changes) |
| `test:` | Adding or fixing tests |
| `chore:` | Other changes (build process, auxiliary tools, libraries) |

## Code Style

- Follow the ESLint + Prettier settings.
- Run `pnpm lint`, `pnpm test` and `pnpm format` before creating a PR.

## Questions & Support

Please create an Issue or ask in Discussions.
