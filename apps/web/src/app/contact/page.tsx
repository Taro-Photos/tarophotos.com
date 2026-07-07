import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/ContactPage";
import { JsonLd } from "../_components/JsonLd";
import { primaryContactEmail } from "../_content/contact";
import { getSiteUrl } from "../_lib/site";

const siteUrl = getSiteUrl();
const description =
  "作品・撮影・寄稿のご相談は、こちらから。写真家 白井悠太郎（Taro Shirai）へのお問い合わせ。";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Taro Shirai",
    description,
    url: `${siteUrl}/contact`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Taro Shirai",
    description,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact | Taro Shirai",
  url: `${siteUrl}/contact`,
  inLanguage: ["ja", "en"],
  mainEntity: {
    "@type": "Person",
    name: "Taro Shirai",
    email: primaryContactEmail,
  },
};

const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Contact", item: `${siteUrl}/contact` },
  ],
};

export default function Contact() {
  return (
    <>
      <ContactPage />
      <JsonLd data={[structuredData, breadcrumbStructuredData]} />
    </>
  );
}
