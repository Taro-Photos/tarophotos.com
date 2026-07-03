import bookingFormFields from "../../../docs/forms/booking_form_fields.json";
import contactFormFields from "../../../docs/forms/contact_form_fields.json";
import { primaryContactMailto } from "./contact";
import { instagramPrimaryAccount } from "./socials";

export type BookingFieldOption = string;

export type FormField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox" | "date" | "number" | "url" | "email";
  required?: boolean;
  options?: BookingFieldOption[];
};

export type BookingField = FormField;
export type ContactField = FormField;

export type BookingGuide = {
  title: string;
  description: string;
  duration: string;
};

export type ContactChannel = {
  label: string;
  href: string;
  description: string;
};

export const bookingFields = bookingFormFields as BookingField[];
export const contactFields = contactFormFields as ContactField[];

export const bookingGuide: BookingGuide[] = [
  {
    title: "フォーム入力",
    description: "所要2〜3分で、依頼の概要とご希望のスケジュールを共有いただけます。",
    duration: "約3分",
  },
  {
    title: "24時間以内に一次返信",
    description: "撮影の可否と簡単なお見積もりレンジ、追加で伺いたい内容があればご案内します。",
    duration: "24h以内",
  },
  {
    title: "詳細ヒアリング",
    description: "オンラインまたはチャットで撮影体制や演出アイデアをすり合わせます。",
    duration: "30分〜",
  },
];

export const contactChannels: ContactChannel[] = [
  {
    label: "メール",
    href: primaryContactMailto,
    description: "資料添付や見積書のやり取りがある場合はこちらをご利用ください。",
  },
  {
    label: "Instagram DM",
    href: instagramPrimaryAccount.href,
    description: "直近の案件状況や軽い相談をしたい時にご利用ください。",
  },
];

export const privacyNotice =
  "送信いただいた情報は問い合わせ対応のみに使用し、許可なく第三者へ提供することはありません。";
