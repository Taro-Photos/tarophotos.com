"use client";

import Image from "next/image";
import Link from "next/link";
import type { SeriesTeaser } from "@/app/_content/home";
import { pushAnalyticsEvent } from "@/app/_lib/analytics";
import { RevealSection } from "@/components/organisms/RevealSection";

type SeriesTeaserListProps = {
  items: SeriesTeaser[];
};

export function SeriesTeaserList({ items }: SeriesTeaserListProps) {
  return (
    <RevealSection as="section" className="page-container pb-24">
      <div className="flex flex-col gap-3 pb-10">
        <p className="text-xs uppercase tracking-[0.36em] text-[var(--color-muted)]">
          Latest Series
        </p>
        <h2 className="text-2xl md:text-3xl tracking-[-0.01em]">
          最新シリーズのピックアップ
        </h2>
        <p className="max-w-[56ch] text-sm text-[var(--color-muted)]">
          発表前後の作品から、今見てほしいストーリーを 3 つ選びました。都市と自然を横断する視点をご覧ください。
        </p>
      </div>
      <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <RevealSection
            key={item.slug}
            as="article"
            className="h-full"
            delay={index * 0.08}
            margin="-10% 0px"
          >
            <Link
              href={`/works/${item.slug}`}
              className="group flex h-full flex-col gap-5 rounded-[var(--radius-card)] border border-transparent bg-[var(--color-surface-raised)] p-5 transition-all hover:-translate-y-1 hover:border-[var(--color-accent)] hover:bg-[var(--color-surface)]"
              onClick={() => pushAnalyticsEvent({ name: "view_series", params: { series_slug: item.slug } })}
            >
              <div className="overflow-hidden rounded-[20px]">
                <Image
                  src={item.cover.src}
                  alt={item.cover.alt}
                  width={item.cover.width}
                  height={item.cover.height}
                  className="aspect-[9/6] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.26em] text-[var(--color-muted)]">
                  <span>{item.location}</span>
                  <span>{item.year}</span>
                </div>
                <h3 className="text-xl font-medium tracking-[-0.01em]">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                  {item.summary}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)]">
                シリーズを見る
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          </RevealSection>
        ))}
      </div>
    </RevealSection>
  );
}
