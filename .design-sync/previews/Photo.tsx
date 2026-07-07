import { Photo } from "@taro/design-system";

// 本文中の写真。caption（和字）と meta（撮影地・日付など）は任意。
// 実運用では実画像パスを渡す（デザイン環境では紙トーンのプレースホルダ表示）。
export const WithCaption = () => (
  <div style={{ padding: 24, maxWidth: 832 }}>
    <Photo
      src="/series-gallery/first-light-voyage/first-light-voyage-02.webp"
      alt="夜明け前の空"
      width={2560}
      height={1707}
      caption="空の色が入れ替わりはじめる"
      meta="06:32 · 日出づる里"
    />
  </div>
);

export const Bare = () => (
  <div style={{ padding: 24, maxWidth: 832 }}>
    <Photo
      src="/series-gallery/highland-drift/highland-drift-02.webp"
      alt="稜線"
      width={2560}
      height={1707}
    />
  </div>
);
