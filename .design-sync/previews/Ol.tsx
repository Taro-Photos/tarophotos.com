import { Ol, Li } from "@taro/design-system";

// 番号付きリスト（項目は <Li>）。
export const Default = () => (
  <div style={{ padding: 24, maxWidth: 680 }}>
    <Ol>
      <Li>場所を決める — 太陽の軌道と山頂の交点から逆算する</Li>
      <Li>前夜に機材を並べ、バッテリーを満たしておく</Li>
      <Li>あとは、待つ</Li>
    </Ol>
  </div>
);
