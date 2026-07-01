/* ============================================================
   TARO Design System — Tokens (JS mirror)
   CSS の SSOT は tokens.css。本ファイルは JS/TS から値参照が要る
   場面（framer-motion・canvas・meta theme-color 等）のためのミラー。
   CSS 側を変えたら必ずここも合わせる。
   ============================================================ */

export const color = {
  paper: "#f7f4ef",
  paperDeep: "#f1ece4",
  ink: "#1a1a1a",
  warmGrey: "#6b6157",
  hair: "#e2dcd2",
} as const;

export const font = {
  serif: "var(--font-serif)",
  mincho: "var(--font-mincho)",
  ui: "var(--font-ui)",
} as const;

export const layout = {
  measure: "1440px",
  gutter: "120px",
} as const;

export const tracking = {
  tight: "-0.01em",
  mark: "0.16em",
  wide: "0.14em",
  wider: "0.2em",
  nav: "0.24em",
  eyebrow: "0.34em",
  widest: "0.42em",
} as const;

export const ease = {
  ds: "cubic-bezier(0.22, 1, 0.36, 1)",
  dsInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
} as const;

export const tokens = { color, font, layout, tracking, ease } as const;
export default tokens;
