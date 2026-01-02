"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { locales } from "../../../i18n.config";

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLanguage = (newLocale: string) => {
        // Replace current locale in pathname with new locale
        const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newPath);
    };

    if (locales.length <= 1) {
        return null;
    }

    return (
        <div className="flex items-center gap-2">
            {locales.map((loc) => (
                <button
                    key={loc}
                    onClick={() => switchLanguage(loc)}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${locale === loc
                        ? "bg-gradient-accent text-[var(--color-on-accent)] shadow-sm"
                        : "text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:bg-gradient-accent-soft"
                        }`}
                    aria-label={`Switch to ${loc.toUpperCase()}`}
                    aria-current={locale === loc ? "true" : "false"}
                >
                    {loc.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
