import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  // SES_* は server-only（api/contact のみ参照）。Amplify SSR で runtime に露出させる
  // ため env に列挙する（app env だけでは undefined→500 になる既知挙動）。
  // ⚠️ これらは絶対に client component で参照しないこと（build 時インライン化で漏れる）。
  env: {
    SES_REGION: process.env.SES_REGION,
    SES_FROM_EMAIL: process.env.SES_FROM_EMAIL,
    SES_TO_EMAIL: process.env.SES_TO_EMAIL,
    SES_AWS_ACCESS_KEY_ID: process.env.SES_AWS_ACCESS_KEY_ID,
    SES_AWS_SECRET_ACCESS_KEY: process.env.SES_AWS_SECRET_ACCESS_KEY,
  },
};

export default nextConfig;
