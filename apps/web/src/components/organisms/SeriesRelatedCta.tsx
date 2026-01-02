import type { SeriesDetails } from "@/app/_content/series";
import { CtaLink } from "@/components/atoms/CtaLink";

export function SeriesRelatedCta({ series }: { series: SeriesDetails }) {
  return (
    <section className="page-container py-16 md:py-20">
      <div className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-gradient-accent px-8 py-10 text-[var(--color-on-accent)] shadow-[var(--shadow-card)] md:px-10 md:py-12">
        <h2 className="text-2xl tracking-[-0.01em]">{series.relatedCta.heading}</h2>
        <p className="max-w-[58ch] text-sm opacity-85">{series.relatedCta.body}</p>
        <CtaLink href={series.relatedCta.href} variant="surface">
          {series.relatedCta.label}
        </CtaLink>
      </div>
    </section>
  );
}
