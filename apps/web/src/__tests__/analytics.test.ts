import { beforeEach, describe, expect, it } from "vitest";

import { pushAnalyticsEvent } from "@/app/_lib/analytics";

declare global {
  // Vitest JSDOM already declares window, extend for reconfiguration.
    interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

describe("pushAnalyticsEvent", () => {
  beforeEach(() => {
    delete window.dataLayer;
  });

  it("initializes dataLayer and pushes events", () => {
    pushAnalyticsEvent({ name: "cta_click", params: { location: "hero", label: "Book" } });

    expect(window.dataLayer).toBeDefined();
    expect(window.dataLayer).toContainEqual({ event: "cta_click", location: "hero", label: "Book" });
  });

  it("exits silently when window is undefined", () => {
    const originalWindow = window;
    // @ts-expect-error overriding for test
    delete (globalThis as { window?: Window }).window;

    expect(() =>
      pushAnalyticsEvent({ name: "cta_click", params: { location: "hero", label: "Book" } }),
    ).not.toThrow();

    // @ts-expect-error restoring window
    globalThis.window = originalWindow;
  });
});
