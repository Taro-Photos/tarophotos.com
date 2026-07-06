import { Hairline, Eyebrow } from "@taro/design-system";

// 1px hair-toned rule — the quiet section divider.
export const Divider = () => (
  <div style={{ padding: 24 }}>
    <Eyebrow>Selected Work</Eyebrow>
    <div style={{ height: 20 }} />
    <Hairline />
    <div style={{ height: 20 }} />
    <Eyebrow>About</Eyebrow>
  </div>
);
