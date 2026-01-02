import { afterEach, describe, expect, it } from "vitest";

import { getSiteUrl } from "@/app/_lib/site";

describe("getSiteUrl", () => {
  const ENV_KEYS = ["NEXT_PUBLIC_SITE_URL", "SITE_URL"] as const;

  afterEach(() => {
    for (const key of ENV_KEYS) {
      delete process.env[key];
    }
  });

  it("returns default domain when env is missing", () => {
    expect(getSiteUrl()).toBe("https://taro.photos");
  });

  it("normalizes trailing slash and nested path", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com/base/";
    expect(getSiteUrl()).toBe("https://example.com/base");
  });

  it("falls back to default when env is invalid", () => {
    process.env.SITE_URL = "not-a-url";
    expect(getSiteUrl()).toBe("https://taro.photos");
  });
});
