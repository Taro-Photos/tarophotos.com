"use client";

import { useEffect, useState } from "react";

const MEDIA_QUERY = "(prefers-reduced-motion: reduce)";
let cachedPreference: boolean | null = null;

function getPreference(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  if (cachedPreference !== null) {
    return cachedPreference;
  }

  cachedPreference = window.matchMedia(MEDIA_QUERY).matches;
  return cachedPreference;
}

export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(getPreference);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia(MEDIA_QUERY);
    const handleChange = () => {
      cachedPreference = mediaQuery.matches;
      setPrefersReducedMotion(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersReducedMotion;
}
