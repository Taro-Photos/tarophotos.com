import type { Metadata } from "next";
import { Inter, Lato } from "next/font/google"; // Import fonts
import { getSiteUrl } from "./_lib/site";
import "./globals.css";

// Configure fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Taro Photos | Professional Photography",
    template: "%s | Taro Photos",
  },
  description: "Professional photography portfolio by Taro. Specializing in minimal, atmospheric, and storytelling photography.",
  keywords: ["photography", "portfolio", "photographer", "minimal", "art"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Taro Photos",
    title: "Taro Photos | Professional Photography",
    description: "Professional photography portfolio by Taro.",
    images: [
      {
        url: "/og-image.jpg", // Ensure this image exists or is handled
        width: 1200,
        height: 630,
        alt: "Taro Photos Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taro Photos",
    description: "Professional photography portfolio by Taro.",
    creator: "@tarophotos", // Replace with actual handle if available
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${lato.variable}`}>
      <body>{children}</body>
    </html>
  );
}
