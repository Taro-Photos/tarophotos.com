export type SocialAccountKey =
  | "instagram"
  | "instagramMonochrome"
  | "x";

export type SocialAccount = {
  key: SocialAccountKey;
  label: string;
  href: string;
  username?: string;
};

const socialAccountRegistry: Record<SocialAccountKey, SocialAccount> = {
  instagram: {
    key: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/taro.photostagram",
    username: "@taro.photostagram",
  },
  instagramMonochrome: {
    key: "instagramMonochrome",
    label: "Instagram Monochrome",
    href: "https://www.instagram.com/taro.monochrome",
    username: "@taro.monochrome",
  },
  x: {
    key: "x",
    label: "X",
    href: "https://x.com/taro_whitey",
    username: "@taro_whitey",
  },
};

// note.com/taro_whitey と youtube.com/@tarophotos は 404（2026-09-24 実測）なので載せない。
const primarySocialKeys: SocialAccountKey[] = [
  "instagram",
  "instagramMonochrome",
];

const structuredDataSocialKeys: SocialAccountKey[] = [
  "instagram",
  "instagramMonochrome",
  "x",
];

export function getSocialAccount(key: SocialAccountKey) {
  return socialAccountRegistry[key];
}

export function getSocialAccounts(keys: SocialAccountKey[]) {
  return keys.map((key) => getSocialAccount(key));
}

export const aboutSocials = getSocialAccounts(primarySocialKeys).map((account) => {
  if (!account.username) {
    throw new Error(`Social account "${account.key}" lacks username for about page`);
  }
  return {
    label: account.label,
    href: account.href,
    username: account.username,
  };
});

export const footerSocialLinks = getSocialAccounts(primarySocialKeys).map(
  ({ label, href }) => ({ label, href }),
);

export const structuredDataSocialLinks = getSocialAccounts(
  structuredDataSocialKeys,
).map(({ href }) => href);

export const instagramPrimaryAccount = getSocialAccount("instagram");
