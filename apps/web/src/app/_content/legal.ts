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
    heading: "Purpose of Use of Personal Information",
    body: [
      "We use personal information for responding to inquiries, business communications related to photography and delivery, billing and payment management, service improvement, and consideration of new projects.",
      "If it becomes necessary to use personal information beyond the scope of the above purposes, we will obtain the person's consent in advance.",
    ],
  },
  {
    id: "collection",
    heading: "Personal Information We Collect",
    body: [
      "We collect names, email addresses, phone numbers, addresses, and information necessary for photography (location, participant information, purpose of use, etc.) via forms or email.",
      "We may collect information regarding site browsing history and usage environment through cookies and other means using access analysis tools.",
    ],
  },
  {
    id: "sharing",
    heading: "Third-Party Provision and Outsourcing",
    body: [
      "We will not provide personal information to third parties without the person's consent, except as required by law.",
      "When outsourcing business to production partners, etc., we will share only the minimum necessary information after establishing an appropriate management system and concluding a confidentiality agreement.",
    ],
  },
  {
    id: "security",
    heading: "Security Management Measures",
    body: [
      "Terminals that handle personal information are equipped with access restrictions such as passwords and biometric authentication, and cloud storage uses encrypted services.",
      "In principle, shooting data will be archived or deleted 3 months after the completion of the project.",
    ],
  },
  {
    id: "analytics",
    heading: "About Cookies and Analysis Tools",
    body: [
      "We may use analysis tools such as Google Analytics to improve the site. These tools use cookies to collect anonymous traffic data.",
      "If you wish not to accept cookies, you can disable them in your browser settings, but some functions may not be available.",
    ],
  },
  {
    id: "requests",
    heading: "Requests for Disclosure, Correction, and Suspension of Use",
    body: [
      "We will respond to requests for disclosure, correction, and suspension of use of personal information within a reasonable range in response to requests from the person or their agent.",
      "We may ask you to present identification documents during the procedure. For details, please contact the inquiry window below.",
    ],
  },
  {
    id: "contact",
    heading: "Inquiry Window",
    body: ["Inquiries regarding the handling of personal information are accepted via the dedicated form or email address."],
    contact: {
      formLabel: "Inquiry Form",
      formHref: legalPage.contactFormUrl,
      emailLabel: "Email Address",
      email: legalPage.contactEmail,
    },
  },
];

export const tokushoFields: Array<{ label: string; value: string }> = [
  { label: "Distributor", value: "Taro Photos / Yutaro Shirai" },
  { label: "Operations Manager", value: "Yutaro Shirai" },
  { label: "Address", value: "Shibuya-ku, Tokyo (Detailed address will be disclosed upon request)" },
  { label: "Contact", value: legalPage.contactEmail },
  { label: "Sales URL", value: "https://taro.photos" },
  { label: "Necessary Charges Other Than Item Price", value: "Bank transfer fees, transportation expenses, permit application fees, etc. (actual costs)" },
  { label: "Delivery Time", value: "Delivery according to the schedule based on the shooting content (determined in advance consultation)" },
  { label: "Payment Method", value: "Bank transfer (within 30 days from the invoice issuance date)" },
  { label: "Cancellation Policy", value: "7 days before to the day before shooting: 50% of the estimated amount including tax, On the day: 100%" },
  { label: "Returns and Exchanges", value: "Due to the nature of digital content, we cannot accept returns or exchanges after delivery." },
];

export const tokushoNotes: string[] = [
  "If conditions other than the above occur, we will inform you at the time of individual quotation.",
  `Date of update: ${legalPage.updatedAt.replaceAll("-", "/")}`,
];
