import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "tests/unit/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: ["tests/e2e/**", "node_modules", ".next/**"],
    environment: "happy-dom",
    globals: true,
    setupFiles: [path.resolve(__dirname, "vitest.setup.ts")],
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@/": `${path.resolve(__dirname, "src")}/`,
    },
    environmentOptions: {
      happyDom: {
        url: "http://localhost",
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "coverage",
      include: [
        "src/components/**/*.{ts,tsx}",
        "src/app/_lib/**/*.ts",
        "src/app/_hooks/**/*.ts",
        "src/app/_content/**/*.ts",
        "src/app/api/**/*.ts",
      ],
      exclude: [
        "src/app/**/index.ts",
        "src/app/**/?(*.)test.ts",
        "src/components/**/index.ts",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
      ],
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
      },
    },
  },
});
