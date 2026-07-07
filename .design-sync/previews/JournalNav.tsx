import { JournalNav } from "@taro/design-system";

// 記事末尾の前後ナビ + 一覧へ戻るリンク。隣接記事は slug からレジストリ導出
// （単一記事のときは「Index · All entries →」だけが出る）。
export const Default = () => (
  <div style={{ padding: 24 }}>
    <JournalNav slug="waiting-for-first-light" />
  </div>
);
