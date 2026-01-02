import type { SectionLink } from "@/app/_content/home";
import { RevealSection } from "@/components/organisms/RevealSection";
import { TrackedLink } from "@/components/atoms/TrackedLink";

type SectionLinksProps = {
  links: SectionLink[];
};

export function SectionLinks({ links }: SectionLinksProps) {
  return (
    <RevealSection as="section" className="page-container py-20">
      <div className="flex items-center justify-between gap-6 pb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.36em] text-[var(--color-muted)]">
            Navigate
          </p>
          <h2 className="mt-2 text-2xl tracking-[-0.01em] md:text-3xl">次へつながる導線</h2>
        </div>
        <span className="hidden text-sm text-[var(--color-muted)] md:block">Works / Services / About</span>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {links.map((link) => (
          <TrackedLink
            key={link.href}
            href={link.href}
            className="group flex flex-col justify-between gap-6 rounded-[var(--radius-card)] border border-transparent bg-[var(--color-surface-raised)] p-8 transition-all duration-200 hover:-translate-y-[3px] hover:border-[var(--color-accent)] hover:bg-[var(--color-surface)]"
            analytics={{
              name: "cta_click",
              params: { location: "section_links", label: link.label },
            }}
          >
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[var(--color-muted)]">
                {link.label}
              </span>
              <p className="text-base leading-relaxed text-[var(--color-foreground)]">
                {link.description}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)]">
              詳細を見る
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </TrackedLink>
        ))}
      </div>
    </RevealSection>
  );
}
