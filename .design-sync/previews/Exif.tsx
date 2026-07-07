import { Exif } from "@taro/design-system";

// Camera / capture metadata — the smallest UI-sans size, tabular figures.
export const CaptureLine = () => (
  <div style={{ padding: 24 }}>
    <Exif>SONY α7R IV · 85mm · ƒ/2.0 · 1/200s · ISO 100</Exif>
  </div>
);

export const TimestampAndPlace = () => (
  <div style={{ padding: 24 }}>
    <Exif>04:52 · 那須塩原 · SONY α7R IV · 24mm · ƒ/8 · 30s · ISO 64</Exif>
  </div>
);
