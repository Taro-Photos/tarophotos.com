import path from "node:path";
import type { NextConfig } from "next";

// GCP_BUILD=1（Cloud Run 用 Docker build・Dockerfile で設定）のときだけ output: "standalone"
// にする（コンテナで node server.js 起動）。ローカルの `next start` は通常出力のまま。
// SES_* などのサーバー専用 env は Cloud Run の runtime env を process.env から直接読む
// （next.config の env に列挙すると build 時にインライン化されるので列挙しないこと）。
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
};

export default nextConfig;
