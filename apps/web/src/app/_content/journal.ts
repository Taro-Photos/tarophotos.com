import type { Metadata } from "next";
import { getSiteUrl } from "../_lib/site";

/**
 * Journal（随筆・撮影ノート）のレジストリ。
 *
 * 記事の追加手順（CMS なし・git ベース・i-willink.com と同型）:
 *   1. ここ `journalIndex` に 1 エントリ追加（slug / title / date / excerpt / cover / tags）
 *   2. `src/app/journal/<slug>/page.tsx` を作成し、本文を JSX（<Lead>/<P>/<Photo>/<H2>/<Quote>）で記述
 *   3. commit → push → Amplify が自動デプロイ
 * 一覧・sitemap・prev/next ナビ・JSON-LD はすべてこのレジストリから自動導出される。
 */
export type JournalImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type JournalMeta = {
  slug: string;
  /** 主題（日本語主体）。 */
  title: string;
  /** 任意の英題（併記したい記事のみ）。 */
  titleEn?: string;
  /** 公開日 YYYY-MM-DD。 */
  date: string;
  /** 更新日（任意）。 */
  updatedAt?: string;
  /** 一覧カード・meta description に使う要約（60〜120 字目安）。 */
  excerpt: string;
  /** アイキャッチ（一覧カバー・OG 画像に使用）。 */
  cover?: JournalImage;
  /** 分類ラベル（essay / note / travel など・任意）。 */
  kind?: string;
  tags?: string[];
};

export const journalIndex: JournalMeta[] = [
  {
    slug: "waiting-for-first-light",
    title: "夜明けを、待つということ",
    titleEn: "Waiting for First Light",
    date: "2026-01-03",
    excerpt:
      "元日の朝、まだ暗いうちに富士川町の髙下へ上がる。富士山頂に太陽が重なるダイヤモンド富士を、ただ待つ。新富嶽百景「日出づる里」で迎えた初日の出のこと。",
    kind: "essay",
    tags: ["essay", "diamond-fuji", "hatsuhinode"],
    cover: {
      src: "/series-gallery/first-light-voyage/first-light-voyage-01.webp",
      alt: "夜明け前、日出づる里の空がゆっくり色を変えていく",
      width: 2560,
      height: 1707,
    },
  },
];

/** 新しい順にソート済みの一覧。 */
export const journalSorted = [...journalIndex].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export function getJournalPost(slug: string): JournalMeta | undefined {
  return journalIndex.find((post) => post.slug === slug);
}

/** 前後の記事（時系列・detail の nav 用）。 */
export function getJournalNeighbors(slug: string): {
  prev?: JournalMeta;
  next?: JournalMeta;
} {
  const i = journalSorted.findIndex((post) => post.slug === slug);
  if (i === -1) return {};
  // journalSorted は新しい順。newer = 一つ前の index、older = 一つ後の index。
  return {
    next: journalSorted[i - 1], // より新しい記事
    prev: journalSorted[i + 1], // より古い記事
  };
}

/** 記事 page.tsx の Next Metadata を build（cover を OG に流用）。 */
export function buildJournalMetadata(slug: string): Metadata {
  const post = getJournalPost(slug);
  const siteUrl = getSiteUrl();
  if (!post) {
    return { title: "Journal" };
  }
  const url = `${siteUrl}/journal/${post.slug}`;
  const ogImage = post.cover
    ? [
        {
          url: `${siteUrl}${post.cover.src}`,
          width: post.cover.width,
          height: post.cover.height,
          alt: post.cover.alt,
        },
      ]
    : undefined;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: {
      title: `${post.title} | Taro Shirai`,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt ?? post.date,
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Taro Shirai`,
      description: post.excerpt,
      images: ogImage?.map((image) => image.url),
    },
  };
}

/** 記事の JSON-LD（BlogPosting）。 */
export function buildJournalJsonLd(slug: string) {
  const post = getJournalPost(slug);
  const siteUrl = getSiteUrl();
  if (!post) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    inLanguage: "ja",
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    url: `${siteUrl}/journal/${post.slug}`,
    mainEntityOfPage: `${siteUrl}/journal/${post.slug}`,
    ...(post.cover ? { image: `${siteUrl}${post.cover.src}` } : {}),
    author: { "@type": "Person", name: "Taro Shirai" },
    publisher: { "@type": "Person", name: "Taro Shirai" },
    ...(post.tags ? { keywords: post.tags.join(", ") } : {}),
  };
}
