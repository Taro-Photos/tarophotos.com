# コンテンツ管理クイックリファレンス

このドキュメントは、日常的なコンテンツ更新作業のクイックリファレンスです。
詳細は [`CONTENT_OPERATIONS.md`](./CONTENT_OPERATIONS.md) を参照してください。

## 📝 Journal記事の追加

### 1. ファイル作成

```bash
touch src/app/_content/journal/my-new-post.ts
```

### 2. 基本テンプレート

```typescript
import type { JournalPostDetail } from "./types";

export const myNewPost: JournalPostDetail = {
  slug: "my-new-post",
  title: "記事タイトル",
  excerpt: "記事の要約（150文字程度）",
  category: "Behind",  // Behind | Report | Gear | Memo
  date: "2025-01-15",
  readTime: "8 min",
  published: true,
  hero: {
    src: "/content/journal/my-new-post/hero.webp",
    alt: "ヒーロー画像の説明",
    width: 2560,
    height: 1707,
  },
  content: [
    {
      kind: "paragraph",
      text: "本文の段落...",
    },
  ],
};
```

### 3. インデックスに追加

```typescript
// src/app/_content/journal/index.ts
import { myNewPost } from "./my-new-post";

const allJournalPostDetails: JournalPostDetail[] = [
  // ...existing posts
  myNewPost,  // 追加
];
```

### 4. 画像配置

```
public/content/journal/my-new-post/
└── hero.webp
```

---

## 🎨 Works シリーズの追加

### 1. ファイル作成

```bash
# Personal の場合
touch src/app/_content/series/personal/my-series.ts

# Commercial の場合
touch src/app/_content/series/commercial/my-series.ts
```

### 2. 基本テンプレート

```typescript
import type { SeriesDetails } from '../types';

export const mySeries: SeriesDetails = {
  slug: "my-series",
  category: "Personal",  // or "Commercial"
  title: "シリーズタイトル",
  year: 2025,
  location: "Tokyo, Japan",
  palette: "color",  // color | monochrome
  focus: "urban",    // urban | nature | motion | people
  synopsis: "シリーズの概要（一文）",
  lead: "リード文（数文）",
  story: "詳細なストーリー",
  tags: ["Tag1", "Tag2", "Tag3"],
  published: true,
  cover: {
    src: "/content/series/personal/my-series/cover.webp",
    alt: "カバー画像の説明",
    width: 2560,
    height: 1707,
  },
  heroImage: {
    src: "/content/series/personal/my-series/hero.webp",
    alt: "ヒーロー画像の説明",
    width: 2560,
    height: 1707,
  },
  gallery: [
    {
      src: "/content/series/personal/my-series/01.webp",
      alt: "画像1の説明",
      width: 2560,
      height: 1707,
      contentLocation: "Shibuya, Tokyo, Japan",
      datePublished: "2025-01-15",
      caption: "キャプション（オプション）",
    },
    // 追加画像...
  ],
  exif: [
    { label: "Camera", value: "Sony α7 IV" },
    { label: "Lens", value: "FE 24-70mm F2.8 GM II" },
    { label: "Settings", value: "1/200s · F4 · ISO 400" },
  ],
  relatedCta: {
    heading: "CTA見出し",
    body: "CTA説明文",
    href: "/contact",
    label: "Contact Me",
  },
};
```

### 3. カテゴリのインデックスに追加

```typescript
// src/app/_content/series/personal/index.ts
import { mySeries } from "./my-series";

export const personalSeries: SeriesDetails[] = [
  // ...existing series
  mySeries,  // 追加
];
```

### 4. 画像配置

```
public/content/series/personal/my-series/
├── cover.webp
├── hero.webp
├── 01.webp
├── 02.webp
└── ...
```

---

## ⚙️ その他のコンテンツ

### About ページ

```typescript
// src/app/_content/about.ts を編集
export const profile = {
  name: "Taro Photos",
  statement: "...",
  // ...
};
```

### Services ページ

```typescript
// src/app/_content/services.ts を編集
export const visibleServicePlans = [
  {
    slug: "portrait",
    title: "Portrait",
    // ...
  },
];
```

### Legal ページ

```typescript
// src/app/_content/legal.ts を編集
export const privacyPolicySections = [
  {
    id: "collection",
    heading: "...",
    // ...
  },
];
```

---

## ✅ 公開フロー

### 1. ローカルで確認

```bash
npm run dev
# http://localhost:3000 で確認
```

### 2. ビルドテスト

```bash
npm run build
npm run start
# http://localhost:3000 で確認
```

### 3. コミット＆プッシュ

```bash
git add .
git commit -m "content: Add new journal post 'my-post'"
git push origin main
```

### 4. デプロイ確認

main へマージすると Cloud Run へ自動デプロイされる（`.github/workflows/deploy-gcp.yml`）。完了後、本番サイトで確認

---

## 📊 コンテンツステータス

### 公開状態

```typescript
published: true   // 本番環境で公開
published: false  // 本番環境では非表示
```

### ドラフト (開発中)

```typescript
published: false,
isDraft: true     // 開発環境でのみ表示
```

---

## 🔍 よくある質問

### Q: コンテンツが表示されない

**確認項目**:
1. `published: true` になっているか
2. `index.ts` に追加されているか
3. ビルドエラーがないか (`npm run build`)

### Q: 画像が表示されない

**確認項目**:
1. 画像パスが `/` で始まっているか
2. `public/` ディレクトリに配置されているか
3. ファイル名の大文字小文字が正しいか

### Q: ビルドエラーが出る

**対処法**:
```bash
npm run typecheck  # 型エラーを確認
npm run lint       # Lintエラーを確認
```

---

## 📚 詳細ドキュメント

- **詳細な手順**: [`CONTENT_OPERATIONS.md`](./CONTENT_OPERATIONS.md)
- **メンテナンスガイド**: [`../MAINTENANCE.md`](../MAINTENANCE.md)
- **型定義**: [`src/app/_content/journal/types.ts`](../src/app/_content/journal/types.ts), [`src/app/_content/series/types.ts`](../src/app/_content/series/types.ts)
