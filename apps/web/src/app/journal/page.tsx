import type { Metadata } from "next";
import { JournalIndex } from "@/components/journal";
import { JsonLd } from "../_components/JsonLd";
import { journalEssays, journalPagePosts } from "../_content/journal";
import { getSiteUrl } from "../_lib/site";

const siteUrl = getSiteUrl();
const description =
  "Taro Shirai の随筆・撮影ノート。風景と、境目と、余白をめぐる書きもの。";

const fallbackOgImage = {
  src: "/hero-main.png",
  width: 1200,
  height: 630,
  alt: "Taro Shirai — Journal",
};
const primaryOgImage = journalEssays[0]?.cover ?? fallbackOgImage;

const blogStructuredData = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Journal — Taro Shirai",
  description,
  url: `${siteUrl}/journal`,
  inLanguage: "ja",
  blogPost: journalPagePosts.map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    url: `${siteUrl}/journal/${post.slug}`,
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    description: post.excerpt,
    ...(post.cover ? { image: `${siteUrl}${post.cover.src}` } : {}),
  })),
};

const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Journal", item: `${siteUrl}/journal` },
  ],
};

export const metadata: Metadata = {
  title: "Journal",
  description,
  alternates: { canonical: "/journal" },
  openGraph: {
    title: "Journal | Taro Shirai",
    description,
    url: `${siteUrl}/journal`,
    type: "website",
    images: [
      {
        url: `${siteUrl}${primaryOgImage.src}`,
        width: primaryOgImage.width,
        height: primaryOgImage.height,
        alt: primaryOgImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Journal | Taro Shirai",
    description,
    images: [`${siteUrl}${primaryOgImage.src}`],
  },
};

export default function JournalPage() {
  return (
    <>
      <JournalIndex />
      <JsonLd data={[blogStructuredData, breadcrumbStructuredData]} />
    </>
  );
}
