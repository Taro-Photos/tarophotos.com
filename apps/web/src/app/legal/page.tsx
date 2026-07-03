import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { JsonLd } from "../_components/JsonLd";
import { legalPage } from "../_content/legal";
import { getSiteUrl } from "../_lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Legal",
  description:
    "Taro Photos のプライバシーポリシーおよび特定商取引法に基づく表記。",
  alternates: { canonical: "/legal" },
  openGraph: {
    title: "Legal | Taro Photos",
    description:
      "Taro Photos のプライバシーポリシーおよび特定商取引法に基づく表記。",
    url: `${siteUrl}/legal`,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Legal | Taro Photos",
  url: `${siteUrl}/legal`,
  inLanguage: "ja",
  dateModified: legalPage.updatedAt,
  hasPart: [
    {
      "@type": "WebPageElement",
      name: "プライバシーポリシー",
      url: `${siteUrl}/legal#privacy`,
    },
    {
      "@type": "WebPageElement",
      name: "特定商取引法に基づく表記",
      url: `${siteUrl}/legal#tokusho`,
    },
  ],
};

export default function Legal() {
  return (
    <>
      <LegalPage />
      <JsonLd data={structuredData} />
    </>
  );
}
