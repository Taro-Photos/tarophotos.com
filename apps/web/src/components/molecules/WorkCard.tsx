"use client";

import Image from "next/image";
import Link from "next/link";
import type { WorkSeries } from "@/app/_content/works";
import { focusFilters, paletteFilters } from "@/app/_content/works";
import { pushAnalyticsEvent } from "@/app/_lib/analytics";

type WorkCardProps = {
  series: WorkSeries;
};

const tagLabelMap = Object.fromEntries(
  [...paletteFilters, ...focusFilters].map((filter) => [filter.value, filter.label]),
);

export function WorkCard({ series }: WorkCardProps) {
  const paletteLabel = tagLabelMap[series.palette] ?? series.palette;
  const focusLabel = tagLabelMap[series.focus] ?? series.focus;

  const handleViewSeries = () => {
    pushAnalyticsEvent({ name: "view_series", params: { series_slug: series.slug } });
  };

  const handleTagClick = (facet: string, value: string) => {
    pushAnalyticsEvent({ name: "filter_change", params: { facet, value } });
  };

  return (
    <article className="group flex h-full flex-col gap-4 rounded-[var(--radius-card)] border border-transparent bg-[var(--color-surface-raised)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)] hover:bg-[var(--color-surface)]">
      <Link
        href={`/works/${series.slug}`}
        className="flex flex-col gap-4"
        onClick={handleViewSeries}
      >
        <div className="overflow-hidden rounded-[var(--radius-card)]">
          <Image
            src={series.cover.src}
            alt={series.cover.alt}
            width={series.cover.width}
            height={series.cover.height}
            className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />
        </div>
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.26em] text-[var(--color-muted)]">
          <span>{series.location}</span>
          <span>{series.year}</span>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-medium tracking-[-0.01em]">{series.title}</h3>
          <p className="text-sm leading-relaxed text-[var(--color-muted)]">{series.synopsis}</p>
        </div>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)]">
          シリーズを見る
          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </Link>
      <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.28em] text-[var(--color-muted)]">
        <Link
          href={`/works?palette=${series.palette}`}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-3 py-1 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-foreground)]"
          onClick={() => handleTagClick("palette", series.palette)}
        >
          {paletteLabel}
        </Link>
        <Link
          href={`/works?focus=${series.focus}`}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-3 py-1 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-foreground)]"
          onClick={() => handleTagClick("focus", series.focus)}
        >
          {focusLabel}
        </Link>
      </div>
    </article>
  );
}
