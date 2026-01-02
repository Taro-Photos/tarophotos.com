export type HeroSeries = {
  slug: string;
  title: string;
  location: string;
  description: string;
  images: Array<{
    src: string;
    alt: string;
    width: number;
    height: number;
  }>;
};

export type SectionLink = {
  label: string;
  description: string;
  href: string;
};

export type SeriesTeaser = {
  slug: string;
  title: string;
  summary: string;
  location: string;
  year: string;
  cover: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

// UNUSED: Reserved for future hero carousel implementation
// This data is currently not used in the homepage but preserved for potential future features
export const heroSeries: HeroSeries[] = [
  {
    slug: "tokyo-night-lines",
    title: "Tokyo Night Lines",
    location: "Tokyo · Night Layering",
    description: "夜の都心を縫う光跡と都市の呼吸を追った夜景シリーズ。",
    images: [
      {
        src: "/series-gallery/tokyo-night-lines/tokyo-night-lines-01.webp",
        alt: "夜の新宿高層ビル群と交差するヘッドライトの軌跡",
        width: 2560,
        height: 1707,
      },
      {
        src: "/series-gallery/tokyo-night-lines/tokyo-night-lines-02.webp",
        alt: "歌舞伎町方面を見下ろす都市の光のレイヤー",
        width: 2560,
        height: 1707,
      },
      {
        src: "/series-gallery/tokyo-night-lines/tokyo-night-lines-06.webp",
        alt: "銀座中央通りを照らすショーウィンドウの光",
        width: 1707,
        height: 2560,
      },
    ],
  },
  {
    slug: "canal-afterglow",
    title: "Canal Afterglow",
    location: "Tokyo · River Twilight",
    description: "代官山から品川へ、運河沿いに滲む夕景と街灯のレイヤーを追う。",
    images: [
      {
        src: "/series-gallery/canal-afterglow/canal-afterglow-01.webp",
        alt: "中目黒川の水面に映る夕暮れの街灯",
        width: 2560,
        height: 1707,
      },
      {
        src: "/series-gallery/canal-afterglow/canal-afterglow-04.webp",
        alt: "川沿いを見下ろす縦構図の中目黒",
        width: 2048,
        height: 2560,
      },
      {
        src: "/series-gallery/canal-afterglow/canal-afterglow-07.webp",
        alt: "品川方面へ伸びるテールライトと水路",
        width: 1707,
        height: 2560,
      },
    ],
  },
  {
    slug: "ueno-arcadia",
    title: "Ueno Arcadia",
    location: "Tokyo · Morning Grove",
    description: "上野と井の頭を巡り、都市の緑と朝靄が溶け合う時間を束ねた散策篇。",
    images: [
      {
        src: "/series-gallery/ueno-arcadia/ueno-arcadia-01.webp",
        alt: "上野動物園の園路に差し込む朝の光",
        width: 2560,
        height: 1707,
      },
      {
        src: "/series-gallery/ueno-arcadia/ueno-arcadia-04.webp",
        alt: "上野恩賜公園の池に映る冬の空",
        width: 2560,
        height: 1707,
      },
      {
        src: "/series-gallery/ueno-arcadia/ueno-arcadia-07.webp",
        alt: "井の頭恩賜公園の池を漂う薄霧",
        width: 2560,
        height: 1707,
      },
    ],
  },
];

// UNUSED: Reserved for future section navigation implementation
// This data is currently not used in the homepage but preserved for potential future features
export const sectionLinks: SectionLink[] = [
  {
    label: "Works",
    description: "都市と自然、動きと静謐のあいだ。代表作をさらに見る。",
    href: "/works",
  },
  {
    label: "Services",
    description: "撮る前から、納品の先まで。安心を設計しています。",
    href: "/services",
  },
  {
    label: "About",
    description: "作家の背景と制作哲学。撮影の伴走について。",
    href: "/about",
  },
];

// UNUSED: Reserved for future series teaser section implementation
// This data is currently not used in the homepage but preserved for potential future features
export const seriesTeasers: SeriesTeaser[] = [
  {
    slug: "kudan-layers",
    title: "Kudan Layers",
    summary: "九段下の坂と新宿の展望をつなぎ、夜と朝の層を重ねた都市シリーズ。",
    location: "Tokyo",
    year: "2025",
    cover: {
      src: "/series-gallery/kudan-layers/kudan-layers-01.webp",
      alt: "九段下の堀とライトトレイルが交わる夜景",
      width: 2560,
      height: 1707,
    },
  },
  {
    slug: "ueno-arcadia",
    title: "Ueno Arcadia",
    summary: "上野と井の頭の緑を歩き、朝靄のレイヤーを拾ったアーバンネイチャー。",
    location: "Tokyo",
    year: "2025",
    cover: {
      src: "/series-gallery/ueno-arcadia/ueno-arcadia-04.webp",
      alt: "上野恩賜公園の池に映る冬の空と樹木",
      width: 2560,
      height: 1707,
    },
  },
  {
    slug: "asakusa-promenade",
    title: "Asakusa Promenade",
    summary: "浅草の提灯と霧がつくる柔らかなグラデーションを歩き集めた散策記。",
    location: "Tokyo",
    year: "2024",
    cover: {
      src: "/series-gallery/asakusa-promenade/asakusa-promenade-01.webp",
      alt: "浅草寺の参道を照らす提灯と濡れた石畳",
      width: 2560,
      height: 1707,
    },
  },
];

// UNUSED: Reserved for future hero CTA implementation
// These CTAs are currently not used in the homepage but preserved for potential future features
export const heroPrimaryCta = {
  label: "お問い合わせ",
  href: "/contact",
};

export const heroSecondaryCta = {
  label: "作品を見る",
  href: "/works",
};
export { footerSocialLinks as socialLinks, footerLegalLinks as footerLegal } from "./site";
