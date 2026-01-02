import Image from "next/image";
import { profile } from "@/app/_content/about";

export function ProfileHero() {
  return (
    <section className="page-container grid gap-8 pt-24 md:gap-10 md:pt-[96px] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center xl:gap-14 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] 2xl:gap-16 2xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="space-y-5 2xl:space-y-6">
        <span
          className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs uppercase tracking-[0.3em]"
          style={{
            background: "var(--chip-background)",
            color: "var(--chip-foreground)",
            border: "1px solid var(--chip-border)",
          }}
        >
          About
        </span>
        <h1 className="text-4xl md:text-5xl tracking-[-0.02em] 2xl:text-[3.2rem]">{profile.name}</h1>
        <p className="text-base font-medium text-[var(--color-accent)] 2xl:text-lg">{profile.tagline}</p>
        <p className="max-w-[62ch] text-sm text-[var(--color-muted)] 2xl:text-base">{profile.statement}</p>
        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
          <span
            className="rounded-full px-3 py-1"
            style={{
              background: "var(--chip-background)",
              color: "var(--chip-foreground)",
              border: "1px solid var(--chip-border)",
            }}
          >
            {profile.location}
          </span>
          {profile.languages.map((lang) => (
            <span
              key={lang}
              className="rounded-full px-3 py-1"
              style={{
                background: "var(--chip-background)",
                color: "var(--chip-foreground)",
                border: "1px solid var(--chip-border)",
              }}
            >
              {lang}
            </span>
          ))}
        </div>
      </div>
      <div
        className="overflow-hidden rounded-[var(--radius-card)] border shadow-[var(--shadow-card)]"
        style={{ background: "var(--surface-card)", borderColor: "var(--surface-card-border)" }}
      >
        <Image
          src={profile.portrait.src}
          alt={profile.portrait.alt}
          width={profile.portrait.width}
          height={profile.portrait.height}
          className="w-full object-cover"
          priority
        />
      </div>
    </section>
  );
}
