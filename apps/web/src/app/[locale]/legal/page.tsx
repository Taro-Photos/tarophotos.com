import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/atoms/JsonLd";
import {
  legalPage,
  privacyPolicySections,
  tokushoFields,
  tokushoNotes,
} from "@/app/_content/legal";
import { getSiteUrl } from "@/app/_lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Legal",
  description: "Privacy Policy and Specified Commercial Transactions Act notation for Taro Photos.",
  alternates: {
    canonical: "/legal",
  },
  openGraph: {
    title: "Legal | Taro Photos",
    description:
      "Privacy Policy and Specified Commercial Transactions Act notation for Taro Photos.",
    url: `${siteUrl}/legal`,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Legal | Taro Photos",
  url: `${siteUrl}/legal`,
  inLanguage: "en",
  dateModified: legalPage.updatedAt,
  hasPart: [
    {
      "@type": "WebPageElement",
      name: "Privacy Policy",
      url: `${siteUrl}/legal#privacy`,
    },
    {
      "@type": "WebPageElement",
      name: "Specified Commercial Transactions Act",
      url: `${siteUrl}/legal#tokusho`,
    },
  ],
};

function formatUpdatedAt(dateString: string) {
  const date = new Date(`${dateString}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  return `${year}.${month}.${day}`;
}

export default function LegalPage() {
  const updatedAtLabel = formatUpdatedAt(legalPage.updatedAt);

  return (
    <div className="py-16 sm:py-24 px-6 sm:px-10 md:px-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-wider leading-tight mb-6 text-primary dark:text-white">
          Legal
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 mb-4">
          To ensure you can entrust us with your photography needs with peace of mind.<br className="hidden sm:block" />
          We have compiled a transparent policy regarding the handling of personal information and terms of sale.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500">Last updated: {updatedAtLabel}</p>
      </div>

      {/* Privacy Policy */}
      <section id="privacy" className="mb-24">
        <h2 className="text-3xl font-light uppercase tracking-wider text-center mb-12 text-primary dark:text-white">Privacy Policy</h2>
        
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Intro */}
          <div className="border border-gray-200 dark:border-gray-800 p-8">
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              Taro Photos (hereinafter referred to as &quot;the Service&quot;) prioritizes the protection of personal information in the operation of photography services and related services.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {privacyPolicySections.map((section) => (
              <article key={section.id} className="border-b border-gray-200 dark:border-gray-800 pb-12 last:border-0">
                <h3 className="text-xl font-bold mb-4 text-primary dark:text-white">{section.heading}</h3>
                <div className="space-y-4 text-gray-500 dark:text-gray-400 leading-relaxed">
                  {section.body.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                {section.contact ? (
                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-sm">
                    <p className="text-gray-400 dark:text-gray-500 mb-2">How to contact</p>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          href={section.contact.formHref}
                          className="text-primary dark:text-white underline underline-offset-4 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          {section.contact.formLabel}
                        </Link>
                      </li>
                      <li>
                        <a
                          href={`mailto:${section.contact.email}`}
                          className="text-primary dark:text-white underline underline-offset-4 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          {section.contact.emailLabel}: {section.contact.email}
                        </a>
                      </li>
                    </ul>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Tokusho */}
      <section id="tokusho" className="mb-24">
        <h2 className="text-3xl font-light uppercase tracking-wider text-center mb-12 text-primary dark:text-white">Specified Commercial Transactions Act</h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="border border-gray-200 dark:border-gray-800">
            <dl className="divide-y divide-gray-200 dark:divide-gray-800">
              {tokushoFields.map((item) => (
                <div
                  key={item.label}
                  className="grid gap-4 px-6 py-4 md:grid-cols-[200px_1fr] md:px-8 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                >
                  <dt className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 pt-1">{item.label}</dt>
                  <dd className="text-sm text-gray-600 dark:text-gray-300">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <ul className="mt-8 space-y-2 text-sm text-gray-400 dark:text-gray-500">
            {tokushoNotes.map((note, index) => (
              <li key={index}>・{note}</li>
            ))}
          </ul>
        </div>
      </section>

      <JsonLd data={structuredData} />
    </div>
  );
}
