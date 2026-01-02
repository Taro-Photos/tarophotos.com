"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { pushAnalyticsEvent } from "@/app/_lib/analytics";

export function ScrollTracker() {
  const pathname = usePathname();
  const hasFiredRef = useRef<string | null>(null);

  useEffect(() => {
    hasFiredRef.current = null;

    const handleScroll = () => {
      if (hasFiredRef.current === pathname) {
        return;
      }

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) {
        return;
      }

      const scrolled = window.scrollY;
      if (scrolled / scrollHeight >= 0.75) {
        pushAnalyticsEvent({ name: "scroll_75", params: { path: pathname } });
        hasFiredRef.current = pathname;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return null;
}
