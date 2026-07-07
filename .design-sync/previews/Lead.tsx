import { Lead, P } from "@taro/design-system";

// 記事冒頭のリード文（本文よりやや大きい）。
export const Default = () => (
  <div style={{ padding: 24, maxWidth: 680 }}>
    <Lead>
      元日の朝、まだ暗いうちに山へ上がる。ダイヤモンド富士を、ただ待つ。
    </Lead>
    <P>本文はこのリードのあとに続く。</P>
  </div>
);
