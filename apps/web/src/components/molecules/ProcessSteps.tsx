import type { ProcessStep } from "@/app/_content/services";

export function ProcessSteps({ steps }: { steps: ProcessStep[] }) {
  return (
    <section className="page-container py-12 md:py-16 xl:py-20">
      <header className="mb-10 space-y-3 2xl:mb-12 2xl:flex 2xl:items-end 2xl:justify-between 2xl:gap-10 2xl:space-y-0">
        <p className="text-xs uppercase tracking-[0.36em] text-[var(--color-muted)]">Process</p>
        <h2 className="text-3xl tracking-[-0.02em] 2xl:text-[2.35rem]">撮影までの流れ</h2>
        <p className="max-w-[60ch] text-sm text-[var(--color-muted)] 2xl:text-base">
          事前のヒアリングから納品までの各ステップで、進行状況と必要な情報を透明化します。
        </p>
      </header>
      <ol className="grid gap-6 lg:grid-cols-2 lg:gap-8 xl:gap-10">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="relative h-full rounded-[var(--radius-card)] border p-8 2xl:p-10"
            style={{
              background: "var(--surface-card)",
              borderColor: "var(--surface-card-border)",
            }}
          >
            <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-sm font-semibold text-[var(--color-on-accent)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="space-y-2">
              <h3 className="text-xl tracking-[-0.01em]">{step.title}</h3>
              <p className="text-sm text-[var(--color-muted)]">{step.description}</p>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-muted)]">{step.duration}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
