import type { CSSProperties, ReactNode } from "react";

export type PageHeroTone =
  | "default"
  | "works"
  | "services"
  | "journal"
  | "clients"
  | "booking"
  | "legal";

type HeroToneStyleMap = Record<PageHeroTone, CSSProperties>;

const heroToneStyles: HeroToneStyleMap = {
  default: ({
    "--hero-color-primary": "color-mix(in srgb, var(--color-accent-soft) 60%, white)",
    "--hero-color-secondary": "color-mix(in srgb, var(--color-accent) 32%, white)",
    "--hero-color-tertiary": "color-mix(in srgb, var(--color-accent) 12%, white)",
    "--hero-ring-color": "color-mix(in srgb, var(--color-accent) 40%, transparent)",
  }) as CSSProperties,
  works: ({
    "--hero-color-primary": "var(--hero-tone-works-primary)",
    "--hero-color-secondary": "var(--hero-tone-works-secondary)",
    "--hero-color-tertiary": "var(--hero-tone-works-tertiary)",
    "--hero-ring-color": "color-mix(in srgb, var(--hero-tone-works-secondary) 60%, white)",
  }) as CSSProperties,
  services: ({
    "--hero-color-primary": "var(--hero-tone-services-primary)",
    "--hero-color-secondary": "var(--hero-tone-services-secondary)",
    "--hero-color-tertiary": "var(--hero-tone-services-tertiary)",
    "--hero-ring-color": "color-mix(in srgb, var(--hero-tone-services-secondary) 55%, white)",
  }) as CSSProperties,
  journal: ({
    "--hero-color-primary": "var(--hero-tone-journal-primary)",
    "--hero-color-secondary": "var(--hero-tone-journal-secondary)",
    "--hero-color-tertiary": "var(--hero-tone-journal-tertiary)",
    "--hero-ring-color": "color-mix(in srgb, var(--hero-tone-journal-secondary) 60%, white)",
  }) as CSSProperties,
  clients: ({
    "--hero-color-primary": "var(--hero-tone-clients-primary)",
    "--hero-color-secondary": "var(--hero-tone-clients-secondary)",
    "--hero-color-tertiary": "var(--hero-tone-clients-tertiary)",
    "--hero-ring-color": "color-mix(in srgb, var(--hero-tone-clients-secondary) 55%, white)",
  }) as CSSProperties,
  booking: ({
    "--hero-color-primary": "var(--hero-tone-booking-primary)",
    "--hero-color-secondary": "var(--hero-tone-booking-secondary)",
    "--hero-color-tertiary": "var(--hero-tone-booking-tertiary)",
    "--hero-ring-color": "color-mix(in srgb, var(--hero-tone-booking-secondary) 55%, white)",
  }) as CSSProperties,
  legal: ({
    "--hero-color-primary": "var(--hero-tone-legal-primary)",
    "--hero-color-secondary": "var(--hero-tone-legal-secondary)",
    "--hero-color-tertiary": "var(--hero-tone-legal-tertiary)",
    "--hero-ring-color": "color-mix(in srgb, var(--hero-tone-legal-secondary) 55%, white)",
  }) as CSSProperties,
};

export type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  tone?: PageHeroTone;
};

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  tone = "default",
}: PageHeroProps) {
  const hasChildren = Boolean(children);
  const descriptionMarkup =
    typeof description === "string" ? (
      <p className="mt-4 max-w-[64ch] text-base text-[var(--color-muted)] md:text-lg 2xl:text-xl">
        {description}
      </p>
    ) : (
      description
    );

  const toneStyle = heroToneStyles[tone] ?? heroToneStyles.default;
  const contentLayoutClassName = hasChildren
    ? "relative z-10 grid gap-8 md:gap-10 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1fr)] lg:items-end xl:gap-14 2xl:gap-16"
    : "relative z-10 flex flex-col gap-8 md:gap-10 xl:gap-14 2xl:gap-16";
  const titleColumnClassName = hasChildren
    ? "flex flex-col"
    : "flex flex-col lg:max-w-[62rem]";

  return (
    <section className="relative isolate overflow-hidden pt-24 md:pt-[96px] xl:pt-[110px] 2xl:pt-[128px]">
      <div className="page-container">
        <div
          className="relative overflow-hidden rounded-[var(--radius-card)] px-6 py-12 backdrop-blur md:px-10 md:py-14 lg:px-12 xl:px-14 xl:py-16"
          style={{ ...toneStyle, background: "var(--hero-panel-background)" }}
        >
          <div className="pointer-events-none absolute inset-0">
            <span
              className="absolute -left-[18%] top-[-46%] h-[280px] w-[320px] rounded-full blur-[140px] opacity-80 md:top-[-52%] md:h-[340px] md:w-[360px]"
              style={{ background: "var(--hero-color-primary)" }}
            />
            <span
              className="absolute right-[-18%] top-[20%] h-[260px] w-[320px] rounded-full blur-[150px] opacity-75 md:right-[-14%] md:top-[10%] md:h-[320px] md:w-[380px]"
              style={{ background: "var(--hero-color-secondary)" }}
            />
            <span
              className="absolute inset-x-[-26%] bottom-[-42%] h-[300px] rounded-full blur-[160px] opacity-80 md:bottom-[-38%] md:h-[340px]"
              style={{ background: "var(--hero-color-tertiary)" }}
            />
          </div>

          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] backdrop-blur"
            style={{ background: "var(--hero-surface-overlay)" }}
          />

          <div className={contentLayoutClassName}>
            <div className={titleColumnClassName}>
              <span
                className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-1 text-xs uppercase tracking-[0.3em]"
                style={{
                  background: "var(--hero-chip-background)",
                  color: "var(--hero-chip-foreground)",
                  border: "1px solid var(--chip-border)",
                }}
              >
                {eyebrow}
              </span>
              <h1 className="mt-6 text-4xl tracking-[-0.02em] md:text-5xl 2xl:text-[3.05rem]">
                {title}
              </h1>
              {descriptionMarkup}
            </div>
            {children ? (
              <div className="flex flex-col gap-6 lg:justify-end">{children}</div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
