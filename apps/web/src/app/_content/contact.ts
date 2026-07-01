const DEFAULT_PRIMARY_CONTACT_EMAIL = "contact@taro.photos";

function normalizeEmail(value?: string | null) {
  return value?.trim().replace(/^mailto:/i, "") ?? "";
}

function resolvePrimaryContactEmail() {
  const fromEnv = normalizeEmail(process.env.NEXT_PUBLIC_PRIMARY_CONTACT_EMAIL ?? null);
  return fromEnv || DEFAULT_PRIMARY_CONTACT_EMAIL;
}

export const primaryContactEmail = resolvePrimaryContactEmail();

export const primaryContactMailto = `mailto:${primaryContactEmail}`;
