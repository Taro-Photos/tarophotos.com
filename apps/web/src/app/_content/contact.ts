// Google Workspace（i-Willink）のエイリアス。受信は yutaro_shirai@i-willink.com の受信箱に届く。
// 以前の "contact@taro.photos" は別の写真家のドメインで MX も無く、届かなかった（2026-09-26 に差し替え・受信テスト済み）。
const DEFAULT_PRIMARY_CONTACT_EMAIL = "info@tarophotos.com";

function normalizeEmail(value?: string | null) {
  return value?.trim().replace(/^mailto:/i, "") ?? "";
}

function resolvePrimaryContactEmail() {
  const fromEnv = normalizeEmail(process.env.NEXT_PUBLIC_PRIMARY_CONTACT_EMAIL ?? null);
  return fromEnv || DEFAULT_PRIMARY_CONTACT_EMAIL;
}

export const primaryContactEmail = resolvePrimaryContactEmail();

export const primaryContactMailto = `mailto:${primaryContactEmail}`;
