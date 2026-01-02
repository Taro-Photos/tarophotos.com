import Image from "next/image";
import type { SeriesDetails } from "@/app/_content/series";

export function SeriesHeader({ series }: { series: SeriesDetails }) {
  return (
    <header className="page-container grid gap-8 pt-24 md:gap-10 md:pt-[96px] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
      <div className="flex flex-col gap-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-1 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
          {series.year} · {series.location}
        </span>
        <h1 className="text-4xl md:text-5xl tracking-[-0.02em]">{series.title}</h1>
        <p className="max-w-[60ch] text-base text-[var(--color-muted)]">{series.lead}</p>
        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
          {series.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-[var(--color-border)] px-3 py-1">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
        <Image
          src={series.heroImage.src}
          alt={series.heroImage.alt}
          width={series.heroImage.width}
          height={series.heroImage.height}
          className="w-full object-cover"
          priority
        />
      </div>
    </header>
  );
}
