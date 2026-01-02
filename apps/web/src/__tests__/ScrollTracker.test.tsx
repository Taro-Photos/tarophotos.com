import { act, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ScrollTracker } from "@/components/atoms/ScrollTracker";
import { pushAnalyticsEvent } from "@/app/_lib/analytics";

let currentPathname = "/works";

vi.mock("next/navigation", () => ({
  usePathname: () => currentPathname,
}));

vi.mock("@/app/_lib/analytics", () => ({
  pushAnalyticsEvent: vi.fn(),
}));

function setScrollContext({ scrollHeight, innerHeight, scrollY }: { scrollHeight: number; innerHeight: number; scrollY: number }) {
  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: scrollHeight,
  });

  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: innerHeight,
  });

  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: scrollY,
  });
}

describe("ScrollTracker", () => {
beforeEach(() => {
    vi.mocked(pushAnalyticsEvent).mockReset();
    currentPathname = "/works";
    setScrollContext({ scrollHeight: 2000, innerHeight: 500, scrollY: 0 });
  });

  it("fires analytics once per pathname when scrolled beyond 75%", () => {
    render(<ScrollTracker />);

    setScrollContext({ scrollHeight: 2000, innerHeight: 500, scrollY: 1600 });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(pushAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(pushAnalyticsEvent).toHaveBeenCalledWith({ name: "scroll_75", params: { path: "/works" } });

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(pushAnalyticsEvent).toHaveBeenCalledTimes(1);
  });

  it("resets the guard when the pathname changes", () => {
    const { rerender } = render(<ScrollTracker />);

    setScrollContext({ scrollHeight: 2000, innerHeight: 500, scrollY: 1600 });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(pushAnalyticsEvent).toHaveBeenCalledTimes(1);

    currentPathname = "/booking";
    rerender(<ScrollTracker />);

    setScrollContext({ scrollHeight: 2000, innerHeight: 500, scrollY: 1700 });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(pushAnalyticsEvent).toHaveBeenCalledTimes(2);
    expect(pushAnalyticsEvent).toHaveBeenLastCalledWith({ name: "scroll_75", params: { path: "/booking" } });
  });
});
