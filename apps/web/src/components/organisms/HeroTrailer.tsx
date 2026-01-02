"use client";

import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { HeroSeries } from "@/app/_content/home";
import { usePrefersReducedMotion } from "@/app/_hooks/usePrefersReducedMotion";
import { CtaLink } from "@/components/atoms/CtaLink";

type HeroTrailerProps = {
  series: HeroSeries[];
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

const ROTATION_INTERVAL = 5200;
const IMAGE_EASE = [0.22, 1, 0.36, 1] as const;
const CAPTION_EASE = [0.22, 1, 0.36, 1] as const;
const SCALE_START = 1.02;
const SCALE_END = 1.08;

export function HeroTrailer({ series, primaryCta, secondaryCta }: HeroTrailerProps) {
  const [activeSeriesIndex, setActiveSeriesIndex] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const allowAutoRotate = !prefersReducedMotion;

  const activeSeries = series[activeSeriesIndex];
  const activeImage = activeSeries.images[frameIndex] ?? activeSeries.images[0];
  const activeImageKey = `${activeSeries.slug}-${activeImage?.src ?? frameIndex}`;
  const activeImageAlt = activeImage?.alt ?? activeSeries.title ?? "";

  useEffect(() => {
    if (!allowAutoRotate) {
      return undefined;
    }

    const timer = setInterval(() => {
      setFrameIndex((prev) => {
        const frameCount = series[activeSeriesIndex]?.images.length ?? 1;
        return (prev + 1) % frameCount;
      });
    }, ROTATION_INTERVAL);

    return () => {
      clearInterval(timer);
    };
  }, [activeSeriesIndex, allowAutoRotate, series]);

  useEffect(() => {
    setFrameIndex(0); // eslint-disable-line react-hooks/set-state-in-effect
  }, [activeSeriesIndex]);

  useEffect(() => {
    if (!allowAutoRotate) {
      setFrameIndex(0); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [allowAutoRotate]);

  const seriesWithIndex = useMemo(
    () =>
      series.map((item, index) => ({
        index,
        item,
        isActive: index === activeSeriesIndex,
      })),
    [series, activeSeriesIndex],
  );

  return (
    <section className="page-container pt-24 pb-16 md:pt-[96px] md:pb-[80px] xl:pb-[96px] 2xl:pt-[128px] 2xl:pb-[104px]">
      <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] xl:gap-20 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] 2xl:gap-24 2xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#d2d6d3] px-4 py-1 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
              TARO PHOTOS
            </span>
            <h1 className="text-balance">
              <span className="block text-4xl md:text-[2.9rem] lg:text-[3.65rem] 2xl:text-[4.1rem] font-semibold leading-[1.04] tracking-[-0.02em]">
                Move with the Moment.
              </span>
              <span className="mt-1 block text-sm uppercase tracking-[0.24em] text-[var(--color-muted)]">
                一瞬とともに動き続けるという信条。
              </span>
              <span className="mt-2 block text-[2.15rem] md:text-[2.65rem] lg:text-[3.05rem] 2xl:text-[3.4rem] font-medium leading-[1.18] tracking-[-0.008em]">
                動く瞬間を、美しく。
              </span>
            </h1>
            <p className="max-w-[54ch] text-base text-[var(--color-muted)] md:text-lg 2xl:text-xl">
              都会と自然の交差点で、心が動く一瞬を。静謐さの中にある微細な揺らぎを捉え、東京マラソン公式フォトチームや都市開発ブランドのキャンペーンなどで培った視点で、記憶に残るビジュアルストーリーへと翻訳します。
            </p>
          </div>
          <div className="flex flex-wrap gap-3 2xl:gap-4">
            <CtaLink
              href={primaryCta.href}
              size="md"
              variant="accent"
              analytics={{
                name: "cta_click",
                params: { location: "hero_primary", label: primaryCta.label },
              }}
            >
              {primaryCta.label}
            </CtaLink>
            <CtaLink
              href={secondaryCta.href}
              size="md"
              variant="outline"
              analytics={{
                name: "cta_click",
                params: { location: "hero_secondary", label: secondaryCta.label },
              }}
            >
              {secondaryCta.label}
            </CtaLink>
          </div>
          <div className="hidden items-center gap-4 text-xs uppercase tracking-[0.32em] text-[var(--color-muted)] lg:flex 2xl:mt-2 2xl:text-sm">
            <span className="h-[1px] w-10 bg-[var(--color-muted)]" aria-hidden="true" />
            Scroll to explore
          </div>
        </div>

        <div className="relative 2xl:ml-auto 2xl:max-w-[820px]">
          <div className="relative overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
            <div className="relative aspect-[3/2] w-full">
              <AnimatePresence initial={false}>
                {activeImage ? (
                  <motion.div
                    key={activeImageKey}
                    className="absolute inset-0"
                    initial={allowAutoRotate ? { opacity: 0, scale: SCALE_START } : { opacity: 1, scale: 1 }}
                    animate={allowAutoRotate ? { opacity: 1, scale: SCALE_END } : { opacity: 1, scale: 1 }}
                    exit={allowAutoRotate ? { opacity: 0, scale: SCALE_START } : { opacity: 1, scale: 1 }}
                    transition={{
                      opacity: { duration: allowAutoRotate ? 0.6 : 0.12, ease: IMAGE_EASE },
                      scale: {
                        duration: allowAutoRotate ? ROTATION_INTERVAL / 1000 : 0.01,
                        ease: IMAGE_EASE,
                      },
                    }}
                  >
                    <Image
                      src={activeImage.src}
                      alt={activeImageAlt}
                      fill
                      priority={activeSeriesIndex === 0 && frameIndex === 0}
                      sizes="(min-width: 1760px) 820px, (min-width: 1280px) 640px, 100vw"
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            <AnimatePresence initial={false}>
              {activeImage && (
                <motion.div
                  key={`caption-${activeImageKey}`}
                  className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-6 pb-6 pt-12 text-white"
                  initial={allowAutoRotate ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={allowAutoRotate ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
                  transition={{ duration: allowAutoRotate ? 0.4 : 0.16, ease: CAPTION_EASE }}
                >
                  <span className="text-xs uppercase tracking-[0.3em] text-white/80">{activeSeries.title}</span>
                  <p className="text-lg font-medium tracking-[-0.01em]">{activeImageAlt}</p>
                  <span className="text-xs uppercase tracking-[0.26em] text-white/70">
                    {activeSeries.location}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <LayoutGroup id="hero-trailer-series">
            <div className="mt-6 grid gap-3 md:grid-cols-3 xl:gap-4 2xl:gap-6" role="list">
              {seriesWithIndex.map(({ item, index, isActive }) => (
                <button
                  key={item.slug}
                  type="button"
                  aria-pressed={isActive}
                  className={`group relative flex items-start gap-3 overflow-hidden rounded-[18px] border px-4 py-4 text-left transition-colors ${
                    isActive
                      ? "border-[var(--color-accent)] bg-[var(--color-surface-raised)] shadow-[var(--shadow-card)]"
                      : "border-transparent bg-[var(--color-surface)] hover:border-[var(--color-border)]"
                  }`}
                  onMouseEnter={() => setActiveSeriesIndex(index)}
                  onFocus={() => setActiveSeriesIndex(index)}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="hero-trailer-active"
                      className="pointer-events-none absolute inset-0 -z-10 bg-[var(--color-surface-raised)]"
                      transition={{ duration: 0.36, ease: IMAGE_EASE }}
                    />
                  ) : null}
                  <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-xs font-semibold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold uppercase tracking-[0.24em]">
                      {item.title}
                    </span>
                    <span className="text-xs text-[var(--color-muted)]">
                      {item.location}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>
      </div>
    </section>
  );
}
