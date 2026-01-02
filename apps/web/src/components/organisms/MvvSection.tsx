import { mvv } from "@/app/_content/about";

export function MvvSection() {
  return (
    <section className="page-container py-16 md:py-20">
      <div
        className="relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] px-6 py-12 text-[var(--color-foreground)] md:px-10 md:py-14 2xl:px-14"
        style={{
          background: "var(--mvv-section-background)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute -left-14 -top-10 h-60 w-60 rounded-full blur-3xl"
            style={{ background: "var(--mvv-glow-primary)" }}
          />
          <div
            className="absolute right-[-14%] top-1/3 h-72 w-72 -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: "var(--mvv-glow-secondary)" }}
          />
          <div
            className="absolute bottom-[-25%] left-1/4 h-56 w-56 rounded-full blur-2xl"
            style={{ background: "var(--mvv-glow-tertiary)" }}
          />
        </div>

        <header className="max-w-[640px] space-y-3">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-[11px] uppercase tracking-[0.28em]"
            style={{
              borderColor: "var(--mvv-badge-border)",
              background: "var(--mvv-badge-background)",
              color: "var(--mvv-badge-foreground)",
            }}
          >
            Mission Vision Values
          </span>
          <h2 className="text-3xl tracking-[-0.02em] md:text-[2.35rem]">
            現場から生まれる指針
          </h2>
          <p className="text-sm text-[var(--color-muted)] md:text-base">
            ストリート・自然・コミュニティスポーツのフィールドで活動するうえで軸にしているMission / Vision / Valuesをまとめました。
          </p>
        </header>

        <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-3 md:gap-7">
          {mvv.map((item) => (
            <div
              key={item.id}
              className="flex h-full flex-col gap-4 rounded-[24px] border p-6 shadow-[var(--shadow-card)] backdrop-blur-sm md:p-7"
              style={{
                background: "var(--mvv-card-background)",
                borderColor: "var(--mvv-card-border)",
                color: "var(--mvv-card-foreground)",
              }}
            >
              <span
                className="text-xs uppercase tracking-[0.32em]"
                style={{ color: "var(--mvv-card-muted)" }}
              >
                {item.label}
              </span>
              <h3 className="text-lg font-semibold tracking-[-0.01em] md:text-xl">
                {item.title}
              </h3>
              {item.description ? (
                <p
                  className="text-sm leading-relaxed md:text-base"
                  style={{ color: "var(--mvv-card-muted)" }}
                >
                  {item.description}
                </p>
              ) : null}
              {item.points ? (
                <ul
                  className="space-y-2 text-sm leading-relaxed md:text-base"
                  style={{ color: "var(--mvv-card-muted)" }}
                >
                  {item.points.map((point) => (
                    <li key={point} className="relative pl-4">
                      <span
                        className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full"
                        style={{ background: "var(--mvv-bullet-color)" }}
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
