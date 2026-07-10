import type { Metadata } from "next";
import { getSiteUrl } from "../_lib/site";

/**
 * Journal（個人ブログ的な随筆が主役・お知らせは時々）のレジストリ。
 *
 * 2 種類:
 *   - kind:"essay" … 随筆＝主役。撮影の前後・待つこと・境目・余白をめぐる個人的な文章。
 *                    大判カバーの editorial カードで一覧に載る。
 *   - kind:"news"  … お知らせ＝時々。個展・プリント・掲載・新シリーズ公開など。
 *                    一覧上部の簡潔な日付リストに載る（控えめ）。
 *
 * 随筆の追加（CMS なし・git ベース・i-willink.com と同型）:
 *   1. `journalIndex` に 1 エントリ追加（kind:"essay" / slug / title / date / excerpt / cover）
 *   2. `src/app/journal/<slug>/page.tsx` を作成し、本文を JSX（<Lead>/<P>/<Photo>/<H2>/<Quote>）で記述
 *   3. commit → push → Amplify が自動デプロイ
 *
 * お知らせの追加:
 *   - リンクだけの一報 … `href` を付ける（例: 新シリーズ→"/works/xxx"、外部掲載→"https://…"）。
 *     この場合 page.tsx は不要（href 先へ飛ぶ）。
 *   - 本文を持たせる … href を付けず、随筆と同様に page.tsx を作る。
 *
 * 一覧・sitemap・prev/next ナビ・JSON-LD はすべてこのレジストリから自動導出される。
 */
export type JournalKind = "essay" | "news";

export type JournalImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type JournalMeta = {
  slug: string;
  /** essay=随筆（主役） / news=お知らせ（時々）。 */
  kind: JournalKind;
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
  /** アイキャッチ（一覧カバー・OG 画像に使用）。essay は原則付ける。 */
  cover?: JournalImage;
  /** news 専用: リンク先（内部 "/works/…" か外部 "https://…"）。付けると page.tsx 不要。 */
  href?: string;
  tags?: string[];
};

export const journalIndex: JournalMeta[] = [
  {
    slug: "waiting-for-first-light",
    kind: "essay",
    title: "夜明けを、待つということ",
    titleEn: "Waiting for First Light",
    date: "2026-01-03",
    excerpt:
      "元日の朝、まだ暗いうちに富士川町の髙下へ上がる。富士山頂に太陽が重なるダイヤモンド富士を、ただ待つ。新富嶽百景「日出づる里」で迎えた初日の出のこと。",
    tags: ["essay", "diamond-fuji", "hatsuhinode"],
    cover: {
      src: "/series-gallery/first-light-voyage/first-light-voyage-01.webp",
      alt: "夜明け前、日出づる里の空がゆっくり色を変えていく",
      width: 2560,
      height: 1707,
    },
  },
  // お知らせの例（リンクだけの一報）。href を付けているので page.tsx は不要。
  // CEO 確定情報（個展・プリント等）に差し替え／追加してください。
  {
    slug: "works-series-published",
    kind: "news",
    title: "Works に撮影シリーズを公開しています",
    date: "2026-06-01",
    excerpt: "作品ページ（Works）で、風景シリーズを順次公開しています。",
    href: "/works",
    tags: ["news"],
  },
];

/** 新しい順にソート済みの一覧（全種）。 */
export const journalSorted = [...journalIndex].sort((a, b) =>
  b.date.localeCompare(a.date),
);

/** 随筆（essay）だけを新しい順で。一覧の主役。 */
export const journalEssays = journalSorted.filter((p) => p.kind === "essay");

/** お知らせ（news）だけを新しい順で。一覧上部の簡潔リスト。 */
export const journalNews = journalSorted.filter((p) => p.kind === "news");

/** news のリンク先（href 優先、無ければ自前の詳細ページ）。 */
export function journalHref(post: JournalMeta): string {
  return post.href ?? `/journal/${post.slug}`;
}

/** href が外部 URL か。 */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}

/** 自前の詳細ページ（/journal/<slug>）を持つ記事だけ。sitemap / JSON-LD 用。
 *  href ポインタの news は page.tsx を持たないため除外する。 */
export const journalPagePosts = journalSorted.filter((p) => !p.href);

export function getJournalPost(slug: string): JournalMeta | undefined {
  return journalIndex.find((post) => post.slug === slug);
}

/** 前後の記事（detail の nav 用）。同じ kind・ページ持ちの中で前後を返す
 *  （随筆の記事末では隣接する随筆へ。お知らせの href ポインタは対象外）。 */
export function getJournalNeighbors(slug: string): {
  prev?: JournalMeta;
  next?: JournalMeta;
} {
  const post = getJournalPost(slug);
  if (!post) return {};
  const pool = journalPagePosts.filter((p) => p.kind === post.kind);
  const i = pool.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  // pool は新しい順。newer = 一つ前の index、older = 一つ後の index。
  return {
    next: pool[i - 1], // より新しい記事
    prev: pool[i + 1], // より古い記事
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
