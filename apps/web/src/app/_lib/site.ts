// 本番のドメイン。以前の既定値 "https://taro.photos" は別の写真家（Wix）のドメインで、
// canonical / OGP / sitemap / JSON-LD がすべてそちらを指していた（2026-09-24 実測）。
const DEFAULT_SITE_URL = "https://tarophotos.com";

/**
 * Resolves the canonical site URL, stripping any trailing slash so downstream consumers
 * can compose paths consistently. Falls back to the production domain when the env
 * variable is not provided or invalid.
 */
export function getSiteUrl() {
  const envValue = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? DEFAULT_SITE_URL;

  try {
    const url = new URL(envValue);
    const normalizedPath = url.pathname.endsWith("/") && url.pathname !== "/"
      ? url.pathname.slice(0, -1)
      : url.pathname;
    return `${url.origin}${normalizedPath === "/" ? "" : normalizedPath}`;
  } catch {
    return DEFAULT_SITE_URL;
  }
}
