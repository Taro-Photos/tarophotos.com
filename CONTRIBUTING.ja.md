# コントリビューションガイド

[English](CONTRIBUTING.md)

tarophotos.com へのコントリビューションを歓迎します！

## 開発の流れ

1. リポジトリをフォーク
2. feature ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'feat: Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. Pull Request を作成

> **Note**: `main` へのマージは本番デプロイになります。`apps/web/**`・`packages/**`・`Dockerfile`・`firebase.json`・`pnpm-lock.yaml` に変更があると、`.github/workflows/deploy-gcp.yml` が Cloud Run + Firebase Hosting へデプロイします（[デプロイ手順書](docs/30_operations/deployment.ja.md) 参照）。

## コミットメッセージ規約

[Conventional Commits](https://www.conventionalcommits.org/) 形式を使用します。

| プレフィックス | 用途 |
|--------------|------|
| `feat:` | 新機能 |
| `fix:` | バグ修正 |
| `docs:` | ドキュメント変更 |
| `style:` | コードスタイル変更 |
| `refactor:` | リファクタリング |
| `test:` | テスト追加・修正 |
| `chore:` | その他の変更 |

## コードスタイル

- ESLint + Prettier の設定に従う
- `pnpm lint`・`pnpm test`・`pnpm format` を実行してから PR 作成

## 質問・サポート

Issue を作成するか、Discussions で質問してください。
