export const locales = ['en'] as const;
export const defaultLocale = 'en' as const;

// Keep 'ja' incomments for future reference
// export const locales = ['en', 'ja'] as const;

export type Locale = (typeof locales)[number];
