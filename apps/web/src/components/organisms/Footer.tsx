"use client";

import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';
import { instagramPrimaryAccount } from "@/app/_content/socials";

export default function Footer() {
  const t = useTranslations('nav');
  const tFooter = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="py-24 px-4 md:px-8 text-xs uppercase tracking-[0.2em] bg-white dark:bg-background-dark text-primary dark:text-white border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center gap-12">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center text-gray-500 dark:text-gray-400 order-2 md:order-1">
          <Link href={`/${locale}`} className="hover:text-primary dark:hover:text-white transition-colors">
            WWW.TAROPHOTOS.COM
          </Link>
          <Link href={`/${locale}/contact`} className="hover:text-primary dark:hover:text-white transition-colors">
            HELLO@TAROPHOTOS.COM
          </Link>
          <Link href={`/${locale}/legal#privacy`} className="hover:text-primary dark:hover:text-white transition-colors">
            {tFooter('privacyPolicy')}
          </Link>
        </div>
        <nav className="flex gap-8 text-sm order-1 md:order-2">
          <Link href={`/${locale}/works`} className="hover:text-gray-500 dark:hover:text-gray-400 transition-colors">
            {t('works')}
          </Link>
          <Link href={`/${locale}/services`} className="hover:text-gray-500 dark:hover:text-gray-400 transition-colors">
            {t('services')}
          </Link>
          <Link href={`/${locale}/journal`} className="hover:text-gray-500 dark:hover:text-gray-400 transition-colors">
            {t('journal')}
          </Link>
          <Link href={`/${locale}/about`} className="hover:text-gray-500 dark:hover:text-gray-400 transition-colors">
            {t('about')}
          </Link>
          <Link href={`/${locale}/contact`} className="hover:text-gray-500 dark:hover:text-gray-400 transition-colors">
            {t('contact')}
          </Link>
        </nav>
      </div>
      <div className="max-w-7xl mx-auto mt-16 flex flex-col md:flex-row justify-between items-center text-gray-500 dark:text-gray-400 gap-4">
        <p className="text-center md:text-left">© TARO PHOTOS {new Date().getFullYear()}</p>
        <div className="flex gap-6">
          <a href={instagramPrimaryAccount.href} target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-white transition-colors">
            {instagramPrimaryAccount.label}
          </a>
        </div>
      </div>
    </footer>
  );
}
