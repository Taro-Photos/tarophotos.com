import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  env: {
    SES_REGION: process.env.SES_REGION,
    SES_FROM_EMAIL: process.env.SES_FROM_EMAIL,
    SES_TO_EMAIL: process.env.SES_TO_EMAIL,
  },
};

export default withNextIntl(nextConfig);
