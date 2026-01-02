// Archived on 2025-09: Former `/clients` route backup for internal reference.
import type { Metadata } from "next";
import { DeliveryList } from "@/components/molecules/DeliveryList";
import { DeliveryNotices } from "@/components/organisms/DeliveryNotices";
import { JsonLd } from "@/components/atoms/JsonLd";
import { PageHero } from "@/components/organisms/PageHero";
import { SupportContacts } from "@/components/molecules/SupportContacts";
import { deliveries, notices, supportChannels } from "@/app/_content/clients";
import { getSiteUrl } from "@/app/_lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Clients",
  description: "外部ギャラリーと安全に連携するための納品ページ。案件別リンクとパスワード、利用ガイドラインを掲載しています。",
  alternates: {
    canonical: "/clients",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Clients | Taro Photos",
    description:
      "外部ギャラリーと安全に連携するための納品ページ。案件別リンクとパスワード、利用ガイドラインを掲載しています。",
    url: `${siteUrl}/clients`,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Clients | Taro Photos",
  url: `${siteUrl}/clients`,
  description:
    "外部ギャラリーと安全に連携するための納品ページ。案件別リンクとパスワード、利用ガイドラインを掲載しています。",
  inLanguage: "ja",
};

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-12 pb-24">
      <PageHero
        eyebrow="Clients"
        title="納品と校正のためのハブ"
        description="納品中の案件は以下のリンクからアクセスできます。URL とパスワードは第三者に共有せず、ダウンロード後は安全な場所に保管してください。"
      />

      <DeliveryList deliveries={deliveries} />

      <DeliveryNotices notices={notices} />

      <SupportContacts contacts={supportChannels} />

      <JsonLd data={structuredData} />
    </div>
  );
}
