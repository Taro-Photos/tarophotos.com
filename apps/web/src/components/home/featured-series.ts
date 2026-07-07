/* ============================================================
   Home — Featured Series（番号付き Series インデックスのデータ）
   出典: synth-revised の 6 works。実写真（public/series-gallery）を配線。

   撮影地・時刻・EXIF は元 JPG の実データに更新済み（139f99f / aeea19e で
   CEO 確定）。title / titleJa の詩的コピーのみ CEO 最終確認待ち。
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
    stamp: "06:47 · 日出づる里",
    placeEn: "The few minutes before old roof tiles take on warmth.",
    place: "古い屋根瓦が温度を受け取る前の数分",
    exif: "SONY α7 IV · 70-200mm F2.8 GM · 70mm · ƒ/3.5 · 1/500s · ISO 5000",
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
    stamp: "10:50 · 那須",
    placeEn: "One figure on the volcano's back; the sky, almost all margin.",
    place: "火山の背に、人がひとり。空はほとんど余白",
    exif: "SONY α7 III · 70-200mm F2.8 GM · 108mm · ƒ/8 · 1/500s · ISO 320",
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
    stamp: "14:03 · 中目黒・代官山",
    placeEn: "Water slips through the city's gaps — the side no one watches.",
    place: "街の隙間を水が抜けていく。誰も見ていない側",
    exif: "SONY α7 IV · 24-70mm F2.8 GM · 34mm · ƒ/2.8 · 1/500s · ISO 100",
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
    stamp: "19:58 · 九段下（夜桜）",
    placeEn: "The nightscape is only one expression — one example.",
    place: "夜景はひとつの表現にすぎない。その一例",
    exif: "SONY α1 II · 35mm F1.4 GM · 35mm · ƒ/2 · 1/4s · ISO 100",
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
    stamp: "06:46 · 東京駅",
    placeEn: "Between red brick and glass, a single tree stands.",
    place: "赤煉瓦と硝子のあいだ、樹が一本立っている",
    exif: "SONY α7 IV · 35mm F1.4 GM · 35mm · ƒ/8 · 1/500s · ISO 2000",
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
    stamp: "14:49 · 横浜",
    placeEn: "A tunnel of green; light weaves a mesh on the ground.",
    place: "緑のトンネル。光が地面に網目を編む",
    exif: "SONY α7 IV · 35mm F1.4 GM · 35mm · ƒ/8 · 1/1000s · ISO 3200",
  },
];

export const HERO_IMAGE =
  "/series-gallery/first-light-voyage/first-light-voyage-03.webp";
