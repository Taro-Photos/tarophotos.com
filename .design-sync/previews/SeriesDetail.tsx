import { SeriesDetail } from "@taro/design-system";

// Paper-toned stand-in for photographs.
const IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='3'%3E%3Crect width='4' height='3' fill='%23e4ddd2'/%3E%3C/svg%3E";

const data = {
  slug: "hiizuru-no-sato",
  title: "Hiizuru no Sato",
  year: 2023,
  location: "山梨 · 富士川町 髙下",
  palette: "color",
  focus: "nature",
  synopsisEn: "Diamond Fuji — first light cresting the summit over Hiizuru-no-Sato.",
  synopsis: "山頂に太陽が重なる、一年最初の光。日出づる里の朝を追ったシリーズ。",
  lead: "夜明け前の凍てつく空気の中で、山頂に太陽が重なる一瞬を待つ。日出づる里・髙下から見上げた、一年最初の光。",
  story:
    "氷点下の斜面に三脚を据え、二時間ほど待ちました。太陽が山頂に触れる数十秒のために、露出とホワイトバランスを整え、光が里へ降りてくるリズムをそのまま写し取っています。",
  tags: ["Nature", "Dawn", "Mt. Fuji"],
  cover: { src: IMG, alt: "ダイヤモンド富士", width: 2400, height: 1600 },
  heroImage: {
    src: IMG,
    alt: "富士山頂に太陽が重なるダイヤモンド富士 — 日出づる里 髙下より",
    width: 2400,
    height: 1600,
  },
  gallery: [
    {
      src: IMG,
      alt: "夜明け前、藍色に沈む富士のシルエット",
      width: 2400,
      height: 1600,
      contentLocation: "富士川町 髙下",
      datePublished: "2023-01-01",
      caption: "夜明け前、藍色に沈む稜線。",
      statement: "光が来る前の静けさに、いちばん長く立ち会う。",
    },
    {
      src: IMG,
      alt: "山頂に太陽が重なる瞬間の閃光",
      width: 2400,
      height: 1600,
      contentLocation: "富士川町 髙下",
      datePublished: "2023-01-01",
      caption: "07:24 — 山頂に太陽が重なる。",
    },
  ],
  exif: [
    { label: "Camera", value: "SONY α7R IV" },
    { label: "Lens", value: "FE 100-400mm GM" },
    { label: "Exposure", value: "ƒ/8 · 1/500s · ISO 100" },
    { label: "Location", value: "35.55° N, 138.45° E" },
  ],
  relatedCta: {
    heading: "Continue through the index.",
    body: "他のシリーズも、同じ閾のそばで待っています。",
    href: "/works",
    label: "All Works",
  },
};

export const Default = () => <SeriesDetail data={data} />;
