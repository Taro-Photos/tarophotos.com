import { socials } from "@/app/_content/about";
import { TrackedLink } from "@/components/atoms/TrackedLink";

export function SocialLinks() {
  return (
    <section className="page-container pb-20 xl:pb-24">
      <div className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-6 py-6 md:px-8 2xl:flex-row 2xl:items-center 2xl:justify-between 2xl:gap-10 2xl:px-12 2xl:py-10">
        <h2 className="text-sm uppercase tracking-[0.3em] text-[var(--color-muted)]">Follow</h2>
        <ul className="flex flex-wrap gap-4 text-sm 2xl:gap-6 2xl:text-base">
          {socials.map((social) => (
            <li key={social.label}>
              <TrackedLink
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-col gap-1 rounded-[var(--radius-card)] border border-transparent bg-[var(--color-surface-raised)] px-4 py-3 transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-surface)] 2xl:px-6 2xl:py-4"
                analytics={{
                  name: "cta_click",
                  params: { location: "about_social", label: social.label },
                }}
              >
                <span className="font-medium tracking-[-0.01em]">{social.label}</span>
                <span className="text-xs text-[var(--color-muted)]">{social.username}</span>
              </TrackedLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
