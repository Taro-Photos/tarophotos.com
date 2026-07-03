import type { Metadata } from "next";
import { WorksIndex } from "@/components/works/WorksIndex";
import { JsonLd } from "../_components/JsonLd";
import { workSeries } from "../_content/works";
import { getSiteUrl } from "../_lib/site";

const siteUrl = getSiteUrl();
const worksDescription =
  "Taro Shirai の作品索引。風景・閾・余白をめぐるシリーズ群を一覧できます。";

const fallbackOgImage = {
  src: "/hero-main.png",
  width: 1200,
  height: 630,
  alt: "Taro Shirai — landscape",
};
const primaryOgImage = workSeries[0]?.cover ?? fallbackOgImage;

const collectionStructuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Works — Taro Shirai",
  description: worksDescription,
  url: `${siteUrl}/works`,
  inLanguage: "ja",
  hasPart: workSeries.map((series) => ({
    "@type": "CreativeWork",
    name: series.title,
    url: `${siteUrl}/works/${series.slug}`,
    image: `${siteUrl}${series.cover.src}`,
    datePublished: `${series.year}-01-01`,
    locationCreated: series.location,
    keywords: [series.palette, series.focus].join(", "),
    description: series.synopsis,
  })),
};

const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Works", item: `${siteUrl}/works` },
  ],
};

export const metadata: Metadata = {
  title: "Works",
  description: worksDescription,
  alternates: { canonical: "/works" },
  openGraph: {
    title: "Works | Taro Photos",
    description: worksDescription,
    url: `${siteUrl}/works`,
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
    title: "Works | Taro Photos",
    description: worksDescription,
    images: [`${siteUrl}${primaryOgImage.src}`],
  },
};

export default function WorksPage() {
  return (
    <>
      <WorksIndex series={workSeries} />
      <JsonLd data={[collectionStructuredData, breadcrumbStructuredData]} />
    </>
  );
}
