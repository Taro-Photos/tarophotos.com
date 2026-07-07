import type { Metadata } from "next";
import { ConceptPage } from "@/components/concept/ConceptPage";
import { JsonLd } from "../_components/JsonLd";
import { getSiteUrl } from "../_lib/site";

const siteUrl = getSiteUrl();
const description =
  "時と瞬間の、境目を。流れ続ける時間から一枚をすくい上げ、想いごと静止させる——写真家 白井悠太郎（Taro Shirai）のコンセプト。";

export const metadata: Metadata = {
  title: "Concept",
  description,
  alternates: { canonical: "/concept" },
  openGraph: {
    title: "Concept | Taro Shirai",
    description,
    url: `${siteUrl}/concept`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Concept | Taro Shirai",
    description,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Concept | Taro Shirai",
  url: `${siteUrl}/concept`,
  inLanguage: ["en", "ja"],
  about: {
    "@type": "Thing",
    name: "Time passes. One frame stays.",
    description,
  },
};

const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Concept", item: `${siteUrl}/concept` },
  ],
};

export default function Concept() {
  return (
    <>
      <ConceptPage />
      <JsonLd data={[structuredData, breadcrumbStructuredData]} />
    </>
  );
}
