import { clients } from "@/app/_content/about";

export function LogoWall() {
  return (
    <section className="page-container pb-12 md:pb-16 xl:pb-20">
      <div
        className="rounded-[var(--radius-card)] border p-6 md:p-8 2xl:p-10"
        style={{
          background: "var(--surface-card)",
          borderColor: "var(--surface-card-border)",
        }}
      >
        <h2 className="text-sm uppercase tracking-[0.3em] text-[var(--color-muted)]">Clients & Partners</h2>
        <div
          className="mt-6 grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 xl:gap-8 2xl:gap-10"
          aria-label="clients-and-partners"
        >
          {clients.map((client) => (
            <div
              key={client}
              className="flex items-center justify-center rounded-[var(--radius-card)] border border-dashed px-5 py-4 text-center text-sm font-medium leading-6 tracking-[-0.01em] md:px-6 md:py-5 md:text-base md:leading-7"
              style={{
                background: "var(--surface-card-alt)",
                borderColor: "var(--surface-card-border)",
              }}
            >
              {client}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
