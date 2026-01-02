import { CtaLink } from "@/components/atoms/CtaLink";

type CtaBannerProps = {
  eyebrow: string;
  heading: string;
  copy: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export function CtaBanner({ eyebrow, heading, copy, primaryCta, secondaryCta }: CtaBannerProps) {
  return (
    <section className="page-container py-20 xl:py-24">
      <div className="flex flex-col gap-6 rounded-[var(--radius-card)] bg-[var(--color-accent)] px-6 py-10 text-[var(--color-on-accent)] shadow-[var(--shadow-card)] md:px-10 md:py-12 2xl:flex-row 2xl:items-center 2xl:gap-16 2xl:px-14 2xl:py-16">
        <span className="text-xs uppercase tracking-[0.3em] opacity-70">{eyebrow}</span>
        <h2 className="text-3xl tracking-[-0.02em] 2xl:text-[2.6rem]">{heading}</h2>
        <p className="max-w-[58ch] text-sm opacity-80 2xl:text-base 2xl:opacity-90">{copy}</p>
        <div className="flex flex-wrap gap-4 2xl:ml-auto">
          <CtaLink
            href={primaryCta.href}
            variant="surface"
            analytics={{
              name: "cta_click",
              params: { location: "cta_banner_primary", label: primaryCta.label },
            }}
          >
            {primaryCta.label}
          </CtaLink>
          {secondaryCta ? (
            <CtaLink
              href={secondaryCta.href}
              variant="outlineOnAccent"
              analytics={{
                name: "cta_click",
                params: { location: "cta_banner_secondary", label: secondaryCta.label },
              }}
            >
              {secondaryCta.label}
            </CtaLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}
