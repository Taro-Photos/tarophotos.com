import type { Metadata } from "next";
import "./globals.css";
import { GOOGLE_FONTS_HREF } from "@/design-system";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { JsonLd } from "./_components/JsonLd";
import { MotionProvider } from "./_components/MotionProvider";
import { ScrollTracker } from "./_components/ScrollTracker";
import { primaryContactEmail } from "./_content/contact";
import { footerSocialLinks } from "./_content/site";
import { getSiteUrl } from "./_lib/site";

const siteUrl = getSiteUrl();
const socialProfileUrls = footerSocialLinks.map((link) => link.href);

// 注: title/description は事実ベースの暫定コピー。最終的なブランド・タグライン
// （hero/About の詩的コピー）は CEO 検討中。favicon / OG 画像は file-based
// convention（app/icon.svg・app/apple-icon.svg・app/opengraph-image.tsx）で自動配線。
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Taro Shirai — Landscape Photography",
    template: "%s — Taro Shirai",
  },
  description:
    "写真家 白井悠太郎（Taro Shirai）のポートフォリオ。風景・閾・余白をめぐる作品シリーズを収録。",
  keywords: [
    "Taro Shirai",
    "白井悠太郎",
    "風景写真",
    "ポートフォリオ",
    "landscape photography",
    "Tokyo",
  ],
  authors: [{ name: "Taro Shirai" }],
  creator: "Taro Shirai",
  publisher: "Taro Shirai",
  // 単一 URL の同時併記バイリンガル（EN 主導）。ロケール別 URL を持たないため
  // hreflang alternates は付けず canonical のみ。言語は html lang="en" + 和字の
  // lang="ja" で表現する。
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Taro Shirai — Landscape Photography",
    description:
      "写真家 白井悠太郎（Taro Shirai）のポートフォリオ。風景・閾・余白をめぐる作品シリーズ。",
    siteName: "Taro Shirai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taro Shirai — Landscape Photography",
    description:
      "写真家 白井悠太郎（Taro Shirai）のポートフォリオ。風景・閾・余白をめぐる作品シリーズ。",
  },
};

export const viewport = {
  themeColor: "#f7f4ef",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Taro Shirai",
      url: siteUrl,
      description:
        "写真家 白井悠太郎（Taro Shirai）のポートフォリオ。風景・閾・余白をめぐる作品シリーズ。",
      inLanguage: ["en", "ja"],
      sameAs: socialProfileUrls,
    },
    {
      "@type": "Organization",
      name: "Taro Shirai",
      url: siteUrl,
      logo: `${siteUrl}/icon.svg`,
      sameAs: socialProfileUrls,
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          email: primaryContactEmail,
          areaServed: "JP",
          availableLanguage: ["Japanese", "English"],
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={GOOGLE_FONTS_HREF} />
        <JsonLd data={structuredData} />
      </head>
      <body className="antialiased">
        <MotionProvider>
          <ScrollTracker />
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
