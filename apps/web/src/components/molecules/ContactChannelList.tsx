import { TrackedLink } from "@/components/atoms/TrackedLink";

export type ContactChannel = {
  label: string;
  href: string;
  description: string;
};

export function ContactChannelList({ channels }: { channels: ContactChannel[] }) {
  return (
    <ul className="space-y-4">
      {channels.map((channel) => (
        <li key={channel.label}>
          <TrackedLink
            href={channel.href}
            className="group flex flex-col gap-1 rounded-[var(--radius-card)] border border-transparent bg-[var(--color-surface-raised)] px-5 py-4 transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-surface)]"
            target={channel.href.startsWith("http") ? "_blank" : undefined}
            rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
            analytics={{ name: "contact_open", params: { source: channel.label } }}
          >
            <span className="text-sm font-medium tracking-[-0.005em] group-hover:text-[var(--color-accent)]">
              {channel.label}
            </span>
            <span className="text-xs text-[var(--color-muted)]">{channel.description}</span>
          </TrackedLink>
        </li>
      ))}
    </ul>
  );
}
