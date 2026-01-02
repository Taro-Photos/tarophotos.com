import type { ServicePlan } from "@/app/_content/services";

export function ServicePlanList({ plans }: { plans: ServicePlan[] }) {
  return (
    <section className="page-container py-16 xl:py-20">
      <header className="mb-10 space-y-3 2xl:mb-12 2xl:flex 2xl:items-end 2xl:justify-between 2xl:space-y-0 2xl:gap-12">
        <p className="text-xs uppercase tracking-[0.36em] text-[var(--color-muted)]">
          Service Plans
        </p>
        <h2 className="text-3xl tracking-[-0.02em] 2xl:text-[2.35rem]">撮影メニューと料金</h2>
        <p className="max-w-[60ch] text-sm text-[var(--color-muted)] 2xl:text-base">
          プロジェクトの規模に合わせてカスタマイズ可能です。ベースプランを起点に、滞在時間や納品点数を柔軟に組み合わせます。
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 md:gap-8 2xl:grid-cols-3 2xl:gap-10">
        {plans
          .filter((plan) => !plan.isHidden)
          .map((plan) => {
          const isPaused = plan.availability === "paused";

          return (
            <article
              key={plan.slug}
              className={`flex h-full flex-col gap-6 rounded-[var(--radius-card)] border p-6 shadow-[var(--shadow-card)]/35 md:p-8 2xl:p-10 ${
                isPaused ? "opacity-90" : ""
              }`}
              style={{
                background: "var(--surface-card)",
                borderColor: "var(--surface-card-border)",
              }}
            >
              <div className="space-y-2">
                <h3 className="text-2xl tracking-[-0.015em]">{plan.title}</h3>
                <p className="text-sm text-[var(--color-muted)]">{plan.summary}</p>
              </div>
              <div className="flex flex-col gap-4">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--color-accent)] px-4 py-1 text-xs uppercase tracking-[0.24em] text-[var(--color-on-accent)]">
                  {plan.price}
                </span>
                {isPaused ? (
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--surface-card-border)] bg-[var(--surface-card-alt)] px-4 py-1 text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                    受付一時停止中
                  </span>
                ) : null}
                <ul className="space-y-2 text-sm text-[var(--color-muted)]">
                  {plan.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span aria-hidden className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto space-y-2">
                <p className="text-xs text-[var(--color-muted)]">{plan.notes}</p>
                {plan.availabilityNote ? (
                  <p className="text-xs text-[var(--color-muted)]">{plan.availabilityNote}</p>
                ) : null}
              </div>
            </article>
          );
          })}
      </div>
    </section>
  );
}
