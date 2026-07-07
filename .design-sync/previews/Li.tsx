import { Ul, Li } from "@taro/design-system";

// リスト項目 — 必ず <Ul> / <Ol> の子として使う。既定は和字、lang="en" で英文。
export const Default = () => (
  <div style={{ padding: 24, maxWidth: 680 }}>
    <Ul>
      <Li>和字の項目（既定・明朝）</Li>
      <Li lang="en">An English item</Li>
    </Ul>
  </div>
);
