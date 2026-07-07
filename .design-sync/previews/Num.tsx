import { Num } from "@taro/design-system";

// Tabular counter / sequence number — UI sans, wide tracking, tabular-nums.
export const SequenceCounter = () => (
  <div style={{ padding: 24 }}>
    <Num>01 / 06</Num>
  </div>
);

export const PlateNumber = () => (
  <div style={{ padding: 24, display: "flex", gap: 32 }}>
    <Num>01</Num>
    <Num>02</Num>
    <Num>03</Num>
  </div>
);
