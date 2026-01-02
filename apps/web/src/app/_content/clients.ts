export type Delivery = {
  id: string;
  client: string;
  project: string;
  description: string;
  service: "Pic-Time" | "Pixieset" | "PhotoShelter" | "Notion" | string;
  url: string;
  passcode?: string;
  expiresOn: string;
};

export type DeliveryNotice = {
  title: string;
  body: string;
};

export const deliveries: Delivery[] = [
  {
    id: "2025-07-bluehours",
    client: "Blue Hours Architects",
    project: "ブランドブック撮影",
    description: "冊子用キービジュアル + Web 向けカット一式。色校正用TIFFとSNS用JPEGを同梱しています。",
    service: "Pic-Time",
    url: "https://example.com/delivery/bluehours",
    passcode: "BHA-4582",
    expiresOn: "2025-10-31",
  },
  {
    id: "2025-06-runreel",
    client: "RUNREEL",
    project: "ランニングイベント 2025",
    description: "選手別フォルダ / SNS速報 30枚 / スポンサー向けセレクト 15枚。",
    service: "Pixieset",
    url: "https://example.com/delivery/runreel",
    passcode: "RUN-2025",
    expiresOn: "2025-09-15",
  },
  {
    id: "2025-04-hikari",
    client: "Hikari Hotels",
    project: "リブランディングキャンペーン",
    description: "共用部と客室の静止画、15秒ループ動画、スタイリングメモをまとめています。",
    service: "PhotoShelter",
    url: "https://example.com/delivery/hikari",
    passcode: "HKR-0418",
    expiresOn: "2026-01-31",
  },
];

export const notices: DeliveryNotice[] = [
  {
    title: "二次利用について",
    body: "ご契約時に合意した媒体・期間であれば追加費用なくご利用いただけます。用途の追加は別途ご相談ください。",
  },
  {
    title: "ダウンロード期限",
    body: "納品URLの有効期限は納品日から90日です。期限超過後の再アップロードは別途手数料を頂戴します。",
  },
  {
    title: "パスワード管理",
    body: "パスワードは第三者へ共有しないでください。アクセス権の分割が必要な場合は個別パスをご用意します。",
  },
];

export type SupportChannel = {
  label: string;
  value: string;
  href?: string;
};

const DEFAULT_SUPPORT_EMAIL = "delivery@taro.photos";

function resolveSupportEmail() {
  const rawValue = process.env.NEXT_PUBLIC_DELIVERY_SUPPORT_EMAIL?.trim();
  if (!rawValue) {
    return DEFAULT_SUPPORT_EMAIL;
  }
  const normalized = rawValue.replace(/^mailto:/i, "");
  return normalized || DEFAULT_SUPPORT_EMAIL;
}

const supportEmail = resolveSupportEmail();

export const supportChannels: SupportChannel[] = [
  {
    label: "サポートメール",
    value: supportEmail,
    href: `mailto:${supportEmail}`,
  },
  {
    label: "緊急連絡 (Chat)",
    value: "Notion Connect / Slack Guest",
    href: "https://www.notion.so",
  },
];
