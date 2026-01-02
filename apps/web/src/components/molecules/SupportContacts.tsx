import type { SupportChannel } from "@/app/_content/clients";
import { TrackedLink } from "@/components/atoms/TrackedLink";

export function SupportContacts({ contacts }: { contacts: SupportChannel[] }) {
  return (
    <section className="page-container pb-20">
      <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-6 py-6 md:px-8">
        <h2 className="text-sm uppercase tracking-[0.3em] text-[var(--color-muted)]">Support</h2>
        <p className="text-sm text-[var(--color-muted)]">
          納品内容やパスワードに関するご質問は以下よりご連絡ください。24時間以内の一次返信を心がけています。
        </p>
        <ul className="grid gap-3 md:grid-cols-2">
          {contacts.map((contact) => (
            <li
              key={contact.label}
              className="flex flex-col rounded-[var(--radius-card)] bg-[var(--color-surface)] px-4 py-3 text-sm"
            >
              <span className="text-xs uppercase tracking-[0.28em] text-[var(--color-muted)]">
                {contact.label}
              </span>
              {contact.href ? (
                <TrackedLink
                  href={contact.href}
                  target={contact.href.startsWith("http") ? "_blank" : undefined}
                  rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="font-medium tracking-[-0.01em] text-[var(--color-accent)] hover:underline"
                  analytics={{ name: "contact_open", params: { source: contact.label } }}
                >
                  {contact.value}
                </TrackedLink>
              ) : (
                <span className="font-medium tracking-[-0.01em]">{contact.value}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
