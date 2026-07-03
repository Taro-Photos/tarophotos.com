/* ============================================================
   Home — Featured Series（番号付き Series インデックスのデータ）
   出典: synth-revised の 6 works。実写真（public/series-gallery）を配線。

   ⚠️ コピー（title/titleJa/place/exif）は synth 由来の **仮置き**。
   世界観の核（出会う/背景/余白/閾）に沿わせてあるが、CEO の実作品の
   事実（実際の撮影地・時刻・EXIF・タイトル）に後で差し替える。
   ============================================================ */

export type FeaturedWork = {
  no: string;
  slug: string;
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  titleEm?: string;
  titleJa: string;
  stamp: string;
  /** EN-led 併記の英語（暫定・place の対） */
  placeEn?: string;
  place: string;
  exif: string;
};

export const featuredSeries: FeaturedWork[] = [
  {
    no: "01",
    slug: "first-light-voyage",
    image: "/series-gallery/first-light-voyage/first-light-voyage-01.webp",
    alt: "First light on old roof tiles at Takaori before dawn",
    eyebrow: "Threshold",
    title: "Resonance",
    titleEm: "—",
    titleJa: "軒先に降りる、最初の光",
    stamp: "06:52 · 富士川町 髙下",
    placeEn: "The few minutes before old roof tiles take on warmth.",
    place: "古い屋根瓦が温度を受け取る前の数分",
    exif: "SONY α7R IV · 85mm · ƒ/2.0 · 1/200s · ISO 100",
  },
  {
    no: "02",
    slug: "highland-drift",
    image: "/series-gallery/highland-drift/highland-drift-01.webp",
    alt: "Volcanic ridge under open sky",
    eyebrow: "Ridge",
    title: "Ascent",
    titleEm: "—",
    titleJa: "稜線をのぼる、ひとつの点",
    stamp: "10:14 · 茶臼岳",
    placeEn: "One figure on the volcano's back; the sky, almost all margin.",
    place: "火山の背に、人がひとり。空はほとんど余白",
    exif: "SONY α7R IV · 200mm · ƒ/8.0 · 1/640s · ISO 100",
  },
  {
    no: "03",
    slug: "canal-afterglow",
    image: "/series-gallery/canal-afterglow/canal-afterglow-01.webp",
    alt: "Tree-lined canal in low daylight",
    eyebrow: "Channel",
    title: "Transit",
    titleEm: "—",
    titleJa: "運河に落ちる、午後のかげ",
    stamp: "15:38 · 目黒川",
    placeEn: "Water slips through the city's gaps — the side no one watches.",
    place: "街の隙間を水が抜けていく。誰も見ていない側",
    exif: "SONY α7R IV · 35mm · ƒ/4.0 · 1/250s · ISO 160",
  },
  {
    no: "04",
    slug: "sakura-resonance",
    image: "/series-gallery/sakura-resonance/sakura-resonance-01.webp",
    alt: "Night cherry blossoms over a moat",
    eyebrow: "One Example · Night",
    title: "Gleam",
    titleEm: "—",
    titleJa: "夜の水面に、桜がひらく",
    stamp: "20:07 · 千鳥ヶ淵",
    placeEn: "The nightscape is only one expression — one example.",
    place: "夜景はひとつの表現にすぎない。その一例",
    exif: "SONY α7R IV · 24mm · ƒ/2.8 · 4s · ISO 200 · tripod",
  },
  {
    no: "05",
    slug: "morning-transit",
    image: "/series-gallery/morning-transit/morning-transit-01.webp",
    alt: "Morning plaza by Tokyo Station",
    eyebrow: "Passage",
    title: "Stillness",
    titleEm: "—",
    titleJa: "朝の広場、まだ誰も急がない",
    stamp: "07:21 · 丸の内",
    placeEn: "Between red brick and glass, a single tree stands.",
    place: "赤煉瓦と硝子のあいだ、樹が一本立っている",
    exif: "SONY α7R IV · 35mm · ƒ/5.6 · 1/320s · ISO 100",
  },
  {
    no: "06",
    slug: "harbor-blue-hour",
    image: "/series-gallery/harbor-blue-hour/harbor-blue-hour-01.webp",
    alt: "Tree-lined promenade in low light",
    eyebrow: "Promenade",
    title: "Drift",
    titleEm: "—",
    titleJa: "並木の下を、人が通り過ぎる",
    stamp: "14:46 · 横浜",
    placeEn: "A tunnel of green; light weaves a mesh on the ground.",
    place: "緑のトンネル。光が地面に網目を編む",
    exif: "SONY α7R IV · 50mm · ƒ/4.0 · 1/500s · ISO 100",
  },
];

export const HERO_IMAGE =
  "/series-gallery/first-light-voyage/first-light-voyage-01.webp";
