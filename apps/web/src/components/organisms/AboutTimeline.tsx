import { timeline } from "@/app/_content/about";
import { RevealSection } from "@/components/organisms/RevealSection";

export function AboutTimeline() {
  return (
    <RevealSection as="section" className="page-container py-12 md:py-16 xl:py-20">
      <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 md:p-8 2xl:p-10">
        <h2 className="text-2xl tracking-[-0.01em] 2xl:text-[2.35rem]">歩みと活動のハイライト</h2>
        <ol className="mt-6 space-y-4 text-sm text-[var(--color-foreground)] 2xl:mt-8 2xl:space-y-5 2xl:text-base">
          {timeline.map((item) => (
            <li key={item.year} className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-6">
              <span className="text-sm font-medium uppercase tracking-[0.28em] text-[var(--color-muted)]">
                {item.year}
              </span>
              <p>{item.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </RevealSection>
  );
}
