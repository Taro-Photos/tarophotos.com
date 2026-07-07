import { Ul, Li } from "@taro/design-system";

// 箇条書き（項目は <Li>）。
export const Default = () => (
  <div style={{ padding: 24, maxWidth: 680 }}>
    <Ul>
      <Li>三脚と、レリーズと、熱いお茶</Li>
      <Li>日の出の 40 分前に現地に着くこと</Li>
      <Li lang="en">Check the diamond-Fuji alignment the night before</Li>
    </Ul>
  </div>
);
