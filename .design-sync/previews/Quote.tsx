import { Quote } from "@taro/design-system";

// 引用・強調の一節。
export const Japanese = () => (
  <div style={{ padding: 24, maxWidth: 680 }}>
    <Quote>迎えにいって、待つ。</Quote>
  </div>
);

export const English = () => (
  <div style={{ padding: 24, maxWidth: 680 }}>
    <Quote lang="en">I do not chase the beautiful; I wait where it might find me.</Quote>
  </div>
);
