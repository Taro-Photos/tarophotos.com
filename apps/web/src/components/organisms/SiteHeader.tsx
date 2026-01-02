"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { pushAnalyticsEvent } from "@/app/_lib/analytics";

type NavKey = "home" | "works" | "services" | "about" | "journal" | "contact";

const NAV_LINKS: Array<{ labelKey: NavKey; href: string }> = [
  { labelKey: "home", href: "/" },
  { labelKey: "works", href: "/works" },
  { labelKey: "services", href: "/services" },
  { labelKey: "about", href: "/about" },
  { labelKey: "journal", href: "/journal" },
  { labelKey: "contact", href: "/contact" },
];

export function SiteHeader() {
  const t = useTranslations<"nav">("nav");
  const tCommon = useTranslations<"common">("common");
  const locale = useLocale();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleNavClick = (label: string) => {
    pushAnalyticsEvent({
      name: "cta_click",
      params: { location: "site_header", label },
    });
    setIsMenuOpen(false);
  };

  // Helper to check if current path matches the link
  const isActive = (href: string) => {
    const localePath = `/${locale}${href}`;
    if (href === "/") {
      return pathname === localePath;
    }
    return pathname.startsWith(localePath);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur">
      <div className="page-container flex items-center justify-between py-4">
        <Link
          href={`/${locale}`}
          className="text-sm font-semibold uppercase tracking-[0.4em] text-[var(--color-muted)]"
          onClick={() => handleNavClick("Home")}
        >
          TARO PHOTOS
        </Link>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-sm md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? tCommon("close") : tCommon("menu")}
        </button>
        <nav className="hidden items-center gap-5 text-sm md:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                onClick={() => handleNavClick(t(link.labelKey))}
              className={`rounded-full px-4 py-2 transition-all duration-200 ease-out ${
                  active
                    ? "bg-gradient-accent text-[var(--color-on-accent)] shadow-[0_14px_30px_-22px_rgba(11,110,122,0.45)]"
                    : "text-[var(--color-muted)] hover:bg-gradient-accent-soft hover:text-[var(--color-accent)] hover:shadow-[0_14px_30px_-24px_rgba(11,110,122,0.35)]"
                }`}
              >
                {t(link.labelKey)}
              </Link>
            );
          })}
        </nav>
      </div>
      {isMenuOpen ? (
        <nav
          className="fixed inset-0 z-50 flex h-dvh flex-col overflow-y-auto bg-[var(--color-background)] px-8 py-10 text-base md:hidden"
          aria-modal="true"
          role="dialog"
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-[0.4em] text-[var(--color-muted)]">
              {tCommon("menu")}
            </span>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-sm"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close navigation"
            >
              {tCommon("close")}
            </button>
          </div>
          <div className="mt-8 flex flex-col gap-4">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  onClick={() => handleNavClick(t(link.labelKey))}
                  className={`rounded-full px-5 py-3 text-lg transition-all duration-200 ease-out ${
                    active
                      ? "bg-gradient-accent text-[var(--color-on-accent)] shadow-[0_14px_30px_-20px_rgba(11,110,122,0.5)]"
                      : "text-[var(--color-muted)] hover:bg-gradient-accent-soft hover:text-[var(--color-accent)] hover:shadow-[0_14px_30px_-24px_rgba(11,110,122,0.35)]"
                  }`}
                >
                  {t(link.labelKey)}
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
