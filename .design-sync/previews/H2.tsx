import { H2, P } from "@taro/design-system";

// Journal 記事の小見出し。
export const Japanese = () => (
  <div style={{ padding: 24, maxWidth: 680 }}>
    <H2>閾のこちら側</H2>
    <P>小見出しのあとに本文段落が続く。</P>
  </div>
);

export const English = () => (
  <div style={{ padding: 24, maxWidth: 680 }}>
    <H2 lang="en">On Waiting</H2>
    <P lang="en">A heading may also be set in English.</P>
  </div>
);
