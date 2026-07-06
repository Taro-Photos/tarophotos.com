import { WorksIndex } from "@taro/design-system";

// Paper-toned stand-in for a photograph (the design agent supplies real
// images; the DS card shows the index layout + typography).
const IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='3'%3E%3Crect width='4' height='3' fill='%23e4ddd2'/%3E%3C/svg%3E";

const series = [
  {
    slug: "tokyo-night-lines",
    title: "Tokyo Night Lines",
    year: 2025,
    location: "新宿 · 渋谷 · 銀座",
    synopsisEn: "Layers of light in motion — the city as it breathes after dark.",
    synopsis: "夜を走る光をレイヤーにし、都心が呼吸する瞬間を追った夜景シリーズ。",
    cover: { src: IMG, alt: "夜の新宿高層ビル群と交差するヘッドライトの軌跡" },
  },
  {
    slug: "first-light-voyage",
    title: "First Light Voyage",
    year: 2024,
    location: "那須塩原",
    synopsisEn: "The harbor before anyone arrives — dawn at the threshold.",
    synopsis: "誰も来ない夜明けの港。閾（しきい）のそばで待った光。",
    cover: { src: IMG, alt: "夜明けの港に差す最初の光" },
  },
  {
    slug: "hiizuru-no-sato",
    title: "Hiizuru no Sato",
    year: 2023,
    location: "山梨 · 富士川町 髙下",
    synopsisEn: "Diamond Fuji — first light cresting the summit over the village.",
    synopsis: "山頂に太陽が重なる、一年最初の光。日出づる里の朝。",
    cover: { src: IMG, alt: "富士山頂に太陽が重なるダイヤモンド富士" },
  },
];

export const Default = () => <WorksIndex series={series} />;
