import path from "node:path";
import type { NextConfig } from "next";

// GCP_BUILD=1（Cloud Run 用 Docker build）の分岐:
//  - output: "standalone"（Cloud Run コンテナで node server.js 起動）
//  - env インライン化を無効化 — env 列挙は Amplify SSR の runtime 露出 workaround であり、
//    build 時に値を固定してしまうため Cloud Run では逆に runtime env が読めなくなる。
//    Cloud Run では素の process.env が動的に読まれる（standalone server）。
const isGcpBuild = process.env.GCP_BUILD === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isGcpBuild
    ? {
        output: "standalone" as const,
        outputFileTracingRoot: path.join(__dirname, "../../"),
      }
    : {}),
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
  ...(isGcpBuild
    ? {}
    : {
        env: {
          SES_REGION: process.env.SES_REGION,
          SES_FROM_EMAIL: process.env.SES_FROM_EMAIL,
          SES_TO_EMAIL: process.env.SES_TO_EMAIL,
          SES_AWS_ACCESS_KEY_ID: process.env.SES_AWS_ACCESS_KEY_ID,
          SES_AWS_SECRET_ACCESS_KEY: process.env.SES_AWS_SECRET_ACCESS_KEY,
        },
      }),
};

export default nextConfig;
