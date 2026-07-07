import { primaryContactEmail } from "./contact";

export const legalPage = {
  updatedAt: "2025-09-01",
  contactEmail: primaryContactEmail,
  contactFormUrl: "/contact",
};

export type PrivacyPolicySection = {
  id: string;
  heading: string;
  body: string[];
  contact?: {
    formLabel: string;
    formHref: string;
    emailLabel: string;
    email: string;
  };
};

export const privacyPolicySections: PrivacyPolicySection[] = [
  {
    id: "purpose",
    heading: "個人情報の利用目的",
    body: [
      "お問い合わせ対応、撮影・納品に関わる業務連絡、請求・支払管理、サービス改善および新規企画の検討に利用します。",
      "上記目的の範囲を超えて個人情報を利用する必要が生じた場合は、事前に本人の同意を取得します。",
    ],
  },
  {
    id: "collection",
    heading: "取得する個人情報",
    body: [
      "氏名、メールアドレス、電話番号、住所、撮影に必要な情報（ロケ地、参加者情報、利用目的など）をフォームまたはメールにて取得します。",
      "アクセス解析ツールにより、Cookie等を通じてサイト閲覧履歴や利用環境に関する情報を取得する場合があります。",
    ],
  },
  {
    id: "sharing",
    heading: "第三者提供と委託",
    body: [
      "法令に基づく場合を除き、本人の同意なく第三者に個人情報を提供しません。",
      "制作パートナー等へ業務を委託する場合は、適切な管理体制と守秘義務契約を締結したうえで必要最小限の情報のみを共有します。",
    ],
  },
  {
    id: "security",
    heading: "安全管理措置",
    body: [
      "個人情報を取り扱う端末にはパスワード・生体認証等のアクセス制限を設け、クラウドストレージは暗号化されたサービスを利用します。",
      "撮影データは案件完了後、原則として3か月を経過した時点でアーカイブまたは削除を行います。",
    ],
  },
  {
    id: "analytics",
    heading: "Cookie・解析ツールについて",
    body: [
      "サイト改善のため、Google Analytics等の解析ツールを利用する場合があります。これらのツールは匿名のトラフィックデータ収集のためにCookieを使用します。",
      "Cookieの受け入れを希望しない場合、ブラウザ設定で無効化できますが、一部機能が利用できなくなる場合があります。",
    ],
  },
  {
    id: "requests",
    heading: "開示・訂正・利用停止の請求",
    body: [
      "ご本人または代理人からの請求に応じて、合理的な範囲で個人情報の開示・訂正・利用停止に対応します。",
      "手続きの際は本人確認書類の提示をお願いする場合があります。詳しくは下記お問い合わせ窓口までご連絡ください。",
    ],
  },
  {
    id: "contact",
    heading: "お問い合わせ窓口",
    body: ["個人情報の取り扱いに関するお問い合わせは、専用フォームまたはメールアドレスにて受け付けています。"],
    contact: {
      formLabel: "お問い合わせフォーム",
      formHref: legalPage.contactFormUrl,
      emailLabel: "メールアドレス",
      email: legalPage.contactEmail,
    },
  },
];

export const tokushoFields: Array<{ label: string; value: string }> = [
  { label: "販売事業者", value: "Taro Photos / 白井 悠太郎" },
  { label: "運営統括責任者", value: "白井 悠太郎" },
  { label: "所在地", value: "東京都渋谷区（詳細住所はご請求時に開示いたします）" },
  { label: "連絡先", value: legalPage.contactEmail },
  { label: "販売URL", value: "https://taro.photos" },
  { label: "商品代金以外の必要料金", value: "振込手数料、交通費、許可申請費等の実費" },
  { label: "引き渡し時期", value: "撮影内容に応じたスケジュールで納品（事前打合せで確定）" },
  { label: "お支払い方法", value: "銀行振込（請求書発行日から30日以内）" },
  { label: "キャンセルポリシー", value: "撮影7日前〜前日: 税込見積額の50%、当日: 100%" },
  { label: "返品・交換", value: "デジタルコンテンツの特性上、納品後の返品・交換には応じられません" },
];

export const tokushoNotes: string[] = [
  "上記以外の条件が発生する場合は、個別見積もりの際にご案内いたします。",
  `表記の更新日: ${legalPage.updatedAt.replaceAll("-", "/")}`,
];
