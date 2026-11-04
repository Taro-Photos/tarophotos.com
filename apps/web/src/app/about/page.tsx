import type { Metadata } from "next";
import { About } from "@/components/home/About";
import { JsonLd } from "../_components/JsonLd";
import { footerSocialLinks } from "../_content/site";
import { getSiteUrl } from "../_lib/site";

const siteUrl = getSiteUrl();
const socialProfileUrls = footerSocialLinks.map((link) => link.href);
const description =
  "写真家 白井悠太郎（Taro Shirai）について。東京を拠点に、作品の制作と撮影のご依頼を受けています。";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | Taro Shirai",
    description,
    url: `${siteUrl}/about`,
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Taro Shirai",
    description,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: `${siteUrl}/about`,
  inLanguage: ["en", "ja"],
  mainEntity: {
    "@type": "Person",
    name: "Taro Shirai",
    alternateName: "白井 悠太郎",
    jobTitle: "Photographer",
    url: siteUrl,
    sameAs: socialProfileUrls,
  },
};

const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "About", item: `${siteUrl}/about` },
  ],
};

export default function AboutPage() {
  return (
    <>
      <About />
      <JsonLd data={[structuredData, breadcrumbStructuredData]} />
    </>
  );
}
