import { highlightSections } from "@/app/_content/about";

export function AboutHighlights() {
  return (
    <section className="page-container py-12 md:py-16 xl:py-20">
      <div className="grid gap-5 md:grid-cols-2 md:gap-6 xl:gap-8 2xl:gap-10">
        {highlightSections.map((section) => (
          <div
            key={section.title}
            className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 2xl:p-8"
          >
            <h2 className="text-sm uppercase tracking-[0.3em] text-[var(--color-muted)]">
              {section.title}
            </h2>
            {section.description ? (
              <p className="mt-3 text-sm text-[var(--color-muted)] 2xl:text-base">
                {section.description}
              </p>
            ) : null}
            <ul className="mt-4 space-y-2 text-sm text-[var(--color-foreground)] 2xl:mt-5 2xl:text-base">
              {section.items.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
