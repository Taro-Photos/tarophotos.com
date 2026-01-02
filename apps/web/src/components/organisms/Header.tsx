"use client";

import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from "@/components/molecules/LanguageSwitcher";

type NavKey = "works" | "services" | "about" | "journal" | "contact";

export default function Header() {
  const t = useTranslations<"nav">('nav');
  const locale = useLocale();

  const navItems: Array<{ labelKey: NavKey; href: string }> = [
    { labelKey: "works", href: "/works" },
    { labelKey: "services", href: "/services" },
    { labelKey: "about", href: "/about" },
    { labelKey: "journal", href: "/journal" },
    { labelKey: "contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-sm transition-shadow duration-300 border-b border-gray-100 dark:border-gray-800">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
        <div className="flex items-center">
          <Link href={`/${locale}`} className="text-base font-medium tracking-wider text-primary dark:text-white">
            TARO PHOTOS
          </Link>
        </div>
        <nav className="flex items-center gap-x-10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className="text-sm font-medium text-primary dark:text-gray-300 hover:text-gray-500 dark:hover:text-white transition-colors duration-200"
            >
              {t(item.labelKey)}
            </Link>
          ))}
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
