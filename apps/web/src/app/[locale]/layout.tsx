import type { Metadata } from "next";
import { getSiteUrl } from "@/app/_lib/site";
import { Inter, Lato } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import { locales } from "../../../i18n.config";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const lato = Lato({
    weight: ["300", "400", "700"],
    subsets: ["latin"],
    variable: "--font-lato",
    display: "swap",
});

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;

    const siteUrl = getSiteUrl();

    return {
        metadataBase: new URL(siteUrl),
        title: {
            default: 'Taro Photos - Professional Photography in Tokyo',
            template: '%s | Taro Photos',
        },
        description: 'Professional photographer specializing in urban landscapes, night photography, and event coverage in Tokyo. Explore curated photo series and contact for bookings.',
        keywords: ['Tokyo photographer', 'urban photography', 'night photography', 'event photography', 'commercial photography', 'Japan photography'],
        authors: [{ name: 'Taro Photos' }],
        creator: 'Taro Photos',
        publisher: 'Taro Photos',
        openGraph: {
            type: 'website',
            locale: locale === 'ja' ? 'ja_JP' : 'en_US',
            alternateLocale: locale === 'ja' ? ['en_US'] : ['ja_JP'],
            url: siteUrl,
            siteName: 'Taro Photos',
            title: 'Taro Photos - Professional Photography in Tokyo',
            description: 'Professional photographer specializing in urban landscapes, night photography, and event coverage in Tokyo.',
            images: [
                {
                    url: '/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Taro Photos - Professional Photography',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Taro Photos - Professional Photography',
            description: 'Professional photographer in Tokyo specializing in urban landscapes and night photography',
            images: ['/og-image.jpg'],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        alternates: {
            canonical: `/${locale}`,
            languages: Object.fromEntries(
                locales.map((l) => [l, `/${l}`])
            ),
        },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!locales.includes(locale as (typeof locales)[number])) {
        notFound();
    }

    setRequestLocale(locale);

    const messages = await getMessages();

    return (
        <html lang={locale} className={`${inter.variable} ${lato.variable}`}>
            <body className="antialiased" suppressHydrationWarning>
                <NextIntlClientProvider messages={messages} locale={locale}>
                    <Header />
                    <main className="w-full min-h-screen flex flex-col">
                        {children}
                    </main>
                    <Footer />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
