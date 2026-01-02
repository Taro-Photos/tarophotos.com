# コンテンツ運用ガイド

## 概要

このドキュメントでは、Taro Photos Webサイトのコンテンツ（Journal、Works）を追加・更新・公開する方法を説明します。

---

## コンテンツの公開状態について

### 公開フラグ

すべてのコンテンツ（JournalとWorks）には以下のフラグがあります：

- **`published: boolean`** - 本番環境で公開するかどうか
  - `true`: 本番環境で表示される
  - `false`: 本番環境では非表示（開発環境では表示される）

- **`isDraft?: boolean`** (オプション) - ドラフト状態
  - `true`: 開発中のコンテンツ（開発環境でのみ表示）
  - 未設定: 通常のコンテンツ

### 環境による表示制御

**開発環境** (`npm run dev`):
- `published: true` のコンテンツ → 表示 ✅
- `published: false, isDraft: true` のコンテンツ → 表示 ✅
- すべてのコンテンツが表示されるため、ダミーデータも確認可能

**本番環境** (デプロイ後):
- `published: true` のコンテンツ → 表示 ✅  
- `published: false` のコンテンツ → 非表示 ❌
- 公開済みコンテンツのみが表示される

---

## 新しいJournal記事を追加する

### 手順

1. **ファイルを作成**

   `src/app/_content/journal/` に新しいファイルを作成：
   
   ```bash
   # 例: my-new-post.ts
   touch src/app/_content/journal/my-new-post.ts
   ```

2. **コンテンツを記述**

   ```typescript
   import type { JournalPostDetail } from "./types";

   export const myNewPost: JournalPostDetail = {
     slug: "my-new-post",
     title: "新しい記事のタイトル",
     excerpt: "記事の要約文。リスティングページで表示されます。",
     category: "Behind",  // Behind | Report | Gear | Memo
     date: "2025-01-15",
     readTime: "8 min",
     published: true,  // 本番環境で公開する場合
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
       {
         kind: "subheading",
         text: "小見出し",
       },
       {
         kind: "list",
         items: [
           "リスト項目1",
           "リスト項目2",
         ],
       },
       {
         kind: "quote",
         text: "引用文",
         attribution: "著者名",
       },
     ],
   };
   ```

3. **インデックスファイルに追加**

   `src/app/_content/journal/index.ts` を編集：

   ```typescript
   import { visionOfLight } from "./vision-of-light";
   import { myNewPost } from "./my-new-post";  // 追加

   const allJournalPostDetails: JournalPostDetail[] = [
     visionOfLight,
     myNewPost,  // 追加
   ];
   ```

4. **画像を配置**

   `/public/content/journal/my-new-post/` ディレクトリを作成して画像を配置：

   ```
   public/content/journal/my-new-post/
   └── hero.webp
   ```

5. **動作確認**

   ```bash
   npm run dev
   ```

   http://localhost:3000/journal にアクセスして新しい記事が表示されることを確認

6. **コミット＆デプロイ**

   ```bash
   git add src/app/_content/journal/my-new-post.ts
   git add src/app/_content/journal/index.ts
   git add public/content/journal/my-new-post/
   git commit -m "feat: Add new journal post 'my-new-post'"
   git push
   ```

---

## 新しいWorks（シリーズ）を追加する

### 手順

1. **カテゴリを決定**

   - **Commercial**: `src/app/_content/series/commercial/`
   - **Personal**: `src/app/_content/series/personal/`

2. **ファイルを作成**

   ```bash
   # Personalの例
   touch src/app/_content/series/personal/my-new-series.ts
   ```

3. **コンテンツを記述**

   ```typescript
   import type { SeriesDetails } from '../types';

   export const myNewSeries: SeriesDetails = {
     slug: "my-new-series",
     category: "Personal",  // Commercial | Personal
     title: "新しいシリーズタイトル",
     year: 2025,
     location: "Tokyo",
     palette: "color",  // color | monochrome
     focus: "urban",    // urban | nature | motion | people
     synopsis: "シリーズの概要（一文）",
     lead: "シリーズのリード文（数文）",
     story: "シリーズのストーリー（詳細な説明）",
     tags: ["Tag1", "Tag2", "Tag3"],
     published: true,  // 本番環境で公開する場合
     cover: {
       src: "/content/series/personal/my-new-series/cover.webp",
       alt: "カバー画像の説明",
       width: 2560,
       height: 1707,
     },
     heroImage: {
       src: "/content/series/personal/my-new-series/hero.webp",
       alt: "ヒーロー画像の説明",
       width: 2560,
       height: 1707,
     },
     gallery: [
       {
         src: "/content/series/personal/my-new-series/01.webp",
         alt: "ギャラリー画像1の説明",
         width: 2560,
         height: 1707,
         contentLocation: "Shibuya, Tokyo, Japan",
         datePublished: "2025-01-15",
         caption: "画像のキャプション（オプション）",
         statement: "撮影時の意図や技術的な説明（オプション）",
       },
       // 必要に応じて画像を追加
     ],
     exif: [
       { label: "Camera", value: "Sony α7 IV" },
       { label: "Lens", value: "FE 24-70mm F2.8 GM II" },
       { label: "Settings", value: "1/200s · F4 · ISO 400" },
     ],
     relatedCta: {
       heading: "関連するCTAの見出し",
       body: "CTAの説明文",
       href: "/contact",
       label: "Contact Me",
     },
   };
   ```

4. **カテゴリのインデックスファイルに追加**

   `src/app/_content/series/personal/index.ts` を編集（Personalの例）：

   ```typescript
   import { tokyoNightLines } from "./tokyo-night-lines";
   // ... other imports
   import { myNewSeries } from "./my-new-series";  // 追加

   export const personalSeries: SeriesDetails[] = [
     tokyoNightLines,
     // ... other series
     myNewSeries,  // 追加
   ];
   ```

5. **画像を配置**

   `/public/content/series/personal/my-new-series/` ディレクトリを作成：

   ```
   public/content/series/personal/my-new-series/
   ├── cover.webp
   ├── hero.webp
   ├── 01.webp
   ├── 02.webp
   └── ...
   ```

6. **動作確認**

   ```bash
   npm run dev
   ```

   - http://localhost:3000/works で新しいシリーズが表示されることを確認
   - http://localhost:3000/works/personal で確認
   - http://localhost:3000/works/my-new-series で詳細ページを確認

7. **コミット＆デプロイ**

   ```bash
   git add src/app/_content/series/personal/my-new-series.ts
   git add src/app/_content/series/personal/index.ts
   git add public/content/series/personal/my-new-series/
   git commit -m "feat: Add new series 'my-new-series'"
   git push
   ```

---

## ダミーデータを実データに置き換える

現在、Commercialセクションには2つのダミーデータがあります：
- `j-league-2024.ts` (`published: false, isDraft: true`)
- `marathon-2024.ts` (`published: false, isDraft: true`)

これらを実際のコンテンツに置き換える手順：

### 手順

1. **ファイルを編集**

   `src/app/_content/series/commercial/j-league-2024.ts` を開く

2. **実際のデータに更新**

   ```typescript
   export const jLeague2024: SeriesDetails = {
     slug: "j-league-2024",
     category: "Commercial",
     // 実際のデータに更新
     title: "実際のプロジェクトタイトル",
     story: "実際のストーリー...",
     // ... 他のフィールドも更新
     
     published: true,  // ✅ trueに変更して公開
     // isDraft: true を削除または false に設定
   };
   ```

3. **画像を実際のものに差し替え**

   `/public/content/series/commercial/j-league-2024/` の画像を実際の画像に置き換え

4. **動作確認**

   ```bash
   npm run dev
   ```

   開発環境で確認後、production buildでも確認：

   ```bash
   npm run build
   npm run start
   ```

5. **コミット＆デプロイ**

   ```bash
   git add src/app/_content/series/commercial/j-league-2024.ts
   git add public/content/series/commercial/j-league-2024/
   git commit -m "feat: Replace dummy data with actual content for j-league-2024"
   git push
   ```

---

## ドラフトコンテンツの管理

### 作成中のコンテンツ（まだ公開しない）

```typescript
export const draftSeries: SeriesDetails = {
  // ... 他のフィールド
  published: false,  // 本番環境では非表示
  isDraft: true,     // 開発環境では表示
};
```

**用途**:
- コンテンツを段階的に作成する際
- チームメンバーと開発環境で確認が必要な場合
- リリース前の最終確認中

### 公開準備が整ったら

```typescript
export const draftSeries: SeriesDetails = {
  // ... 他のフィールド
  published: true,   // ✅ trueに変更
  // isDraft は削除または false に設定
};
```

コミット＆デプロイすると自動的に本番環境に公開されます。

---

## トラブルシューティング

### Q: 新しいコンテンツが表示されない

**確認項目**:
1. `published: true` になっているか？
2. インデックスファイル (`index.ts`) にインポート＆追加しているか？
3. 開発サーバーを再起動してみる (`npm run dev`)
4. ビルドエラーがないか確認 (`npm run build`)

### Q: 本番環境で一部のコンテンツが表示されない

**原因**: `published: false` または `isDraft: true` のコンテンツは本番環境では非表示になります。

**解決策**: `published: true` に変更してデプロイ

### Q: 画像が表示されない

**確認項目**:
1. 画像パスが正しいか？（例: `/content/series/personal/my-series/01.webp`）
2. 画像ファイルが `/public/` ディレクトリ内の正しい場所に配置されているか？
3. 画像ファイル名が正しいか？（大文字小文字を含む）

### Q: ビルドエラーが発生する

**よくあるエラー**:
- TypeScriptの型エラー: 必須フィールドが不足している
- インポートエラー: ファイル名やパスが間違っている

**解決策**:
```bash
npm run typecheck  # 型エラーを確認
npm run lint       # Lint エラーを確認
```

---

## ベストプラクティス

### ファイル命名規則

- **slug名をファイル名に使用**: `tokyo-night-lines.ts`
- **ケバブケース**: 小文字とハイフンを使用
- **明確な名前**: コンテンツの内容が分かる名前

### 画像管理

- **WebP形式を推奨**: ファイルサイズが小さく、品質が高い
- **適切なサイズ**: hero/cover画像は 2560x1707 を推奨
- **ディレクトリ構造を統一**:
  ```
  /content/[type]/[category]/[slug]/
  ├── cover.webp
  ├── hero.webp
  ├── 01.webp
  ├── 02.webp
  └── ...
  ```

### コミットメッセージ

- **feat**: 新しいコンテンツ追加
  - `feat: Add new journal post 'my-post'`
  - `feat: Add new series 'my-series'`
- **fix**: コンテンツの修正
  - `fix: Update tokyo-night-lines description`
- **content**: コンテンツの更新
  - `content: Replace j-league-2024 with actual data`

---

## 参考リンク

- [型定義 (Journal)](file:///Users/yutaroshirai/GitHub/02_Taro%20Photos/taro-photos-web-site/src/app/_content/journal/types.ts)
- [型定義 (Series)](file:///Users/yutaroshirai/GitHub/02_Taro%20Photos/taro-photos-web-site/src/app/_content/series/types.ts)
- [既存のJournal例](file:///Users/yutaroshirai/GitHub/02_Taro%20Photos/taro-photos-web-site/src/app/_content/journal/vision-of-light.ts)
- [既存のSeries例](file:///Users/yutaroshirai/GitHub/02_Taro%20Photos/taro-photos-web-site/src/app/_content/series/personal/tokyo-night-lines.ts)
