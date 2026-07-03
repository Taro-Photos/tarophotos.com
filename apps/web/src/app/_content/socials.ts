export type SocialAccountKey =
  | "instagram"
  | "instagramMonochrome"
  | "note"
  | "youtube"
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
  note: {
    key: "note",
    label: "note",
    href: "https://note.com/taro_whitey",
    username: "note.com/taro_whitey",
  },
  youtube: {
    key: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@tarophotos",
    username: "@tarophotos",
  },
  x: {
    key: "x",
    label: "X",
    href: "https://x.com/taro_whitey",
    username: "@taro_whitey",
  },
};

const primarySocialKeys: SocialAccountKey[] = [
  "instagram",
  "instagramMonochrome",
  "note",
  "youtube",
];

const structuredDataSocialKeys: SocialAccountKey[] = [
  "instagram",
  "instagramMonochrome",
  "note",
  "youtube",
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
