import { Ja } from "@taro/design-system";

// Japanese accent set in Shippori Mincho, always lang="ja". Short phrases/labels.
export const AccentPhrase = () => (
  <div style={{ padding: 24 }}>
    <Ja className="text-subhead">迎えにいって、待つ</Ja>
  </div>
);

export const InlineWithLatin = () => (
  <div style={{ padding: 24 }} className="font-serif text-lede">
    First Light <Ja> ／ 初日の出</Ja>
  </div>
);

export const AsBlock = () => (
  <div style={{ padding: 24 }}>
    <Ja as="p" className="text-heading">
      風景写真家
    </Ja>
  </div>
);
