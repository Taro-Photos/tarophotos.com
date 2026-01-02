"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState, useId } from "react";
import type { ImageExif } from "../../../types/exif";
import type { SeriesImage } from "@/app/_content/series";
import { usePrefersReducedMotion } from "@/app/_hooks/usePrefersReducedMotion";
import { pushAnalyticsEvent } from "@/app/_lib/analytics";

type SeriesGalleryProps = {
  images: SeriesImage[];
  seriesTitle: string;
  seriesSlug: string;
  seriesExif?: Array<{ label: string; value: string }>;
  imageExifMap?: Record<string, ImageExif | undefined>;
};

type ExifEntry = { label: string; value: string };

function getStatementPreview(statement?: string): string | undefined {
  if (!statement) {
    return undefined;
  }

  const trimmed = statement.trim();

  if (!trimmed) {
    return undefined;
  }

  if (trimmed.length <= 120) {
    return trimmed;
  }

  return `${trimmed.slice(0, 117).trimEnd()}...`;
}

function hasExif(exif?: ImageExif): exif is ImageExif {
  if (!exif) {
    return false;
  }

  return Object.values(exif).some((value) => typeof value === "string" && value.trim().length > 0);
}

function parseSeriesExif(seriesExif?: Array<{ label: string; value: string }>): ImageExif | undefined {
  if (!seriesExif?.length) {
    return undefined;
  }

  const parsed: ImageExif = {};

  for (const { label, value } of seriesExif) {
    if (!value) {
      continue;
    }

    switch (label) {
      case "Camera":
        parsed.camera = value;
        break;
      case "Lens":
        parsed.lens = value;
        break;
      case "Focal Length":
        parsed.focalLength = value;
        break;
      case "Shutter Speed":
        parsed.shutterSpeed = value;
        break;
      case "Aperture":
        parsed.aperture = value;
        break;
      case "ISO":
        parsed.iso = value.toUpperCase().startsWith("ISO") ? value : `ISO ${value}`;
        break;
      case "Settings": {
        const segments = value
          .split("·")
          .map((segment) => segment.trim())
          .filter(Boolean);

        for (const segment of segments) {
          if (/^ISO/i.test(segment)) {
            const isoValue = segment.replace(/^iso\s*/i, "").trim();
            parsed.iso = isoValue ? `ISO ${isoValue}` : "ISO";
            continue;
          }

          if (/^(f|ƒ)/i.test(segment)) {
            parsed.aperture = segment.replace(/^ƒ/, "F");
            continue;
          }

          parsed.shutterSpeed = segment;
        }
        break;
      }
      default:
        break;
    }
  }

  return hasExif(parsed) ? parsed : undefined;
}

function getExifEntries(exif: ImageExif): ExifEntry[] {
  const entries: ExifEntry[] = [];

  if (exif.camera) {
    entries.push({ label: "Camera", value: exif.camera });
  }

  if (exif.lens) {
    entries.push({ label: "Lens", value: exif.lens });
  }

  if (exif.focalLength) {
    entries.push({ label: "Focal Length", value: exif.focalLength });
  }

  if (exif.shutterSpeed) {
    entries.push({ label: "Shutter", value: exif.shutterSpeed });
  }

  if (exif.aperture) {
    entries.push({ label: "Aperture", value: exif.aperture });
  }

  if (exif.iso) {
    entries.push({ label: "ISO", value: exif.iso });
  }

  return entries;
}

export function SeriesGallery({ images, seriesTitle, seriesSlug, seriesExif, imageExifMap = {} }: SeriesGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [transitionDirection, setTransitionDirection] = useState<1 | -1 | 0>(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const fallbackExif = useMemo(() => parseSeriesExif(seriesExif), [seriesExif]);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lightboxHeadingId = useId();

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
    setTransitionDirection(0);
  }, []);

  const showNext = useCallback(() => {
    setTransitionDirection(1);
    setActiveIndex((prev) => (prev === null ? 0 : (prev + 1) % images.length));
  }, [images.length]);

  const showPrevious = useCallback(() => {
    setTransitionDirection(-1);
    setActiveIndex((prev) => (prev === null ? images.length - 1 : (prev - 1 + images.length) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) {
      return undefined;
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }
      if (event.key === "ArrowRight") {
        showNext();
      }
      if (event.key === "ArrowLeft") {
        showPrevious();
      }
      if (event.key === "Tab" && overlayRef.current) {
        const focusableSelectors =
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
        const focusable = Array.from(
          overlayRef.current.querySelectorAll<HTMLElement>(focusableSelectors),
        ).filter((element) => !element.hasAttribute("disabled") && element.tabIndex !== -1);

        if (focusable.length === 0) {
          return;
        }

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];
        const isShift = event.shiftKey;
        const activeElement = document.activeElement as HTMLElement | null;

        if (!isShift && activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }

        if (isShift && activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, closeLightbox, showNext, showPrevious]);

  const openLightbox = (index: number) => {
    setTransitionDirection(0);
    setActiveIndex(index);
    pushAnalyticsEvent({ name: "lightbox_open", params: { series_slug: seriesSlug, index } });
  };

  const activeImage = activeIndex === null ? null : images[activeIndex];
  const activeCaption = activeImage?.caption?.trim();
  const activeStatement = activeImage?.statement?.trim();
  const isLightboxOpen = activeIndex !== null && activeImage !== null;
  const activeExif = activeImage ? imageExifMap[activeImage.src] : undefined;
  const displayExif = hasExif(activeExif) ? activeExif : fallbackExif;
  const exifEntries = displayExif ? getExifEntries(displayExif) : [];

  return (
    <section className="page-container py-16 xl:py-20">
      <div className="grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-8 2xl:gap-10">
        {images.map((image, index) => {
          const aspectRatio = image.width / image.height;
          const isPortrait = aspectRatio < 1;
          const caption = image.caption?.trim();
          const statementPreview = getStatementPreview(image.statement);
          const hasNarrative = Boolean(caption || statementPreview);
          return (
            <button
              key={image.src}
              type="button"
              onClick={() => openLightbox(index)}
              className={`group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-left transition-transform duration-200 hover:-translate-y-1 ${
                isPortrait ? "md:row-span-2" : ""
              }`}
              aria-label={`${seriesTitle} ギャラリー ${index + 1}${caption ? `: ${caption}` : ""}`}
            >
              <div className="relative">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="(min-width: 1760px) 26vw, (min-width: 1280px) 30vw, (min-width: 768px) 45vw, 92vw"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div
                className={`flex flex-col border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 transition-colors duration-200 group-hover:bg-[var(--color-surface-raised)] ${
                  hasNarrative ? "gap-2" : ""
                }`}
              >
                {caption ? (
                  <p className="text-sm font-medium tracking-[-0.01em] text-[var(--color-foreground)]">{caption}</p>
                ) : null}
                {statementPreview ? (
                  <p className="text-xs leading-relaxed text-[var(--color-muted)]">{statementPreview}</p>
                ) : null}
                <span className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-muted)]">
                  {hasNarrative ? "View Story" : "View"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {isLightboxOpen && activeImage ? (
          <motion.div
            key="series-gallery-lightbox"
            role="dialog"
            aria-modal="true"
            aria-labelledby={lightboxHeadingId}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
            ref={overlayRef}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 id={lightboxHeadingId} className="sr-only">
              {seriesTitle} の拡大ギャラリー
            </h2>
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-6 top-6 rounded-full border border-white/40 bg-black/40 px-4 py-2 text-sm uppercase tracking-[0.28em] text-white"
              ref={closeButtonRef}
            >
              Close
            </button>
            <motion.button
              type="button"
              className="absolute left-6 top-1/2 flex -translate-y-1/2 items-center rounded-full border border-white/40 bg-black/40 px-4 py-2 text-sm uppercase tracking-[0.28em] text-white"
              onClick={showPrevious}
              aria-label="前の画像"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
            >
              ←
            </motion.button>
            <motion.button
              type="button"
              className="absolute right-6 top-1/2 flex -translate-y-1/2 items-center rounded-full border border-white/40 bg-black/40 px-4 py-2 text-sm uppercase tracking-[0.28em] text-white"
              onClick={showNext}
              aria-label="次の画像"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
            >
              →
            </motion.button>
            <motion.div
              className="flex max-h-[90vh] max-w-[90vw] flex-col items-center overflow-y-auto rounded-[var(--radius-card)] border border-white/20 bg-black/20 p-4"
              initial={prefersReducedMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={activeImage.src}
                  className="flex w-full flex-col items-center"
                  initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: transitionDirection === 0 ? 0 : transitionDirection * 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: transitionDirection === 0 ? 0 : transitionDirection * -12 }}
                  transition={{ duration: prefersReducedMotion ? 0.25 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={activeImage.src}
                    alt={activeImage.alt}
                    width={activeImage.width}
                    height={activeImage.height}
                    sizes="90vw"
                    className="h-auto max-h-[60vh] w-full object-contain"
                  />
                  <div className="mt-4 flex flex-col items-center gap-2 text-center text-sm text-white/80">
                    <p className="text-base font-medium tracking-[-0.01em] text-white">{activeImage.alt}</p>
                    {activeCaption ? (
                      <p className="max-w-[60ch] text-sm leading-relaxed text-white/70">{activeCaption}</p>
                    ) : null}
                    <p className="text-sm text-white/70">{activeImage.contentLocation}</p>
                    {activeImage.datePublished ? (
                      <p className="text-xs uppercase tracking-[0.28em] text-white/60">{activeImage.datePublished}</p>
                    ) : null}
                  </div>
                  {activeStatement ? (
                    <motion.div
                      key={`${activeImage.src}-statement`}
                      className="mt-6 w-full max-w-2xl rounded-[var(--radius-card)] border border-white/20 bg-black/40 p-5 text-left"
                      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                      transition={{ duration: prefersReducedMotion ? 0.2 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <h4 className="text-xs uppercase tracking-[0.36em] text-white/60">Artist Notes</h4>
                      <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed tracking-[-0.005em] text-white/90">
                        {activeStatement}
                      </p>
                    </motion.div>
                  ) : null}
                  {exifEntries.length ? (
                    <motion.div
                      key={`${activeImage.src}-exif`}
                      className="mt-6 w-full max-w-md rounded-[var(--radius-card)] border border-white/20 bg-black/40 p-4 text-left"
                      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                      transition={{ duration: prefersReducedMotion ? 0.2 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <h4 className="text-xs uppercase tracking-[0.36em] text-white/60">Shooting Info</h4>
                      <dl className="mt-3 grid gap-2 text-sm text-white">
                        {exifEntries.map((entry) => (
                          <div key={entry.label} className="flex items-center justify-between gap-4">
                            <dt className="text-white/60">{entry.label}</dt>
                            <dd className="font-medium tracking-[-0.01em] text-white">{entry.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </motion.div>
                  ) : fallbackExif ? (
                    <motion.div
                      key={`${seriesSlug}-fallback-exif`}
                      className="mt-6 w-full max-w-md rounded-[var(--radius-card)] border border-white/20 bg-black/40 p-4 text-left"
                      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                      transition={{ duration: prefersReducedMotion ? 0.2 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <h4 className="text-xs uppercase tracking-[0.36em] text-white/60">Shooting Info</h4>
                      <dl className="mt-3 grid gap-2 text-sm text-white">
                        {getExifEntries(fallbackExif).map((entry) => (
                          <div key={entry.label} className="flex items-center justify-between gap-4">
                            <dt className="text-white/60">{entry.label}</dt>
                            <dd className="font-medium tracking-[-0.01em] text-white">{entry.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </motion.div>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
