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
    SES_AWS_ACCESS_KEY_ID: process.env.SES_AWS_ACCESS_KEY_ID,
    SES_AWS_SECRET_ACCESS_KEY: process.env.SES_AWS_SECRET_ACCESS_KEY,
  },
};

export default withNextIntl(nextConfig);
