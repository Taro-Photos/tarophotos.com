import { P, Rule } from "@taro/design-system";

// 節の区切り（短い罫）。
export const BetweenSections = () => (
  <div style={{ padding: 24, maxWidth: 680 }}>
    <P>前の節の最後の段落。</P>
    <Rule />
    <P>次の節の最初の段落。</P>
  </div>
);
