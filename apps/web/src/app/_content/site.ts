import { footerSocialLinks as sharedFooterSocialLinks } from "./socials";

export const footerSocialLinks = sharedFooterSocialLinks;

// サイトの運営者。作品の販売・撮影の契約主体（特商法の販売事業者）は作家本人のままで、
// 運営だけを i-Willink が担う（2026-09-25 CEO 決定「運営: i-Willink / 作家: 白井」の併記）。
export const siteOperator = {
  nameJa: "合同会社i-Willink",
  nameEn: "i-Willink LLC",
  url: "https://i-willink.com",
};

export const footerLegalLinks = [
  { label: "プライバシーポリシー", href: "/legal#privacy" },
  { label: "特定商取引法に基づく表記", href: "/legal#tokusho" },
];
