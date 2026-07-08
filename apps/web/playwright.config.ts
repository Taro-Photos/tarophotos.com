import { defineConfig, devices } from "@playwright/test";

// 実ページをモバイル/デスクトップ実描画して応答レイアウトを検証する e2e ハーネス。
// DS の render-check はデスクトップ幅・分離コンポーネントのみで、モバイル固有の
// レイアウト崩れ（横溢れ等）を検知できない。その層を埋める。
//
// webServer が本番ビルドを立ち上げてからテストする。ローカルは再利用可。
const PORT = 3210;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 5"] } },
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } } },
  ],
  webServer: {
    command: `pnpm run build && pnpm exec next start --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
