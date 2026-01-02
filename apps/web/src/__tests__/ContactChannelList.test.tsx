import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { MouseEvent, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { ContactChannelList } from "@/components/molecules/ContactChannelList";
import { pushAnalyticsEvent } from "@/app/_lib/analytics";
import { primaryContactMailto } from "@/app/_content/contact";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, onClick, ...rest }: { href: string; children: ReactNode; onClick?: (event: MouseEvent<HTMLAnchorElement>) => void }) => (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
      {...rest}
    >
      {children}
    </a>
  ),
}));

vi.mock("@/app/_lib/analytics", () => ({
  pushAnalyticsEvent: vi.fn(),
}));

describe("ContactChannelList", () => {
  it("renders channels with analytics tracking and external targets", async () => {
    const user = userEvent.setup();

    render(
      <ContactChannelList
        channels={[
          {
            label: "サポートメール",
            href: primaryContactMailto,
            description: "納品に関するご質問はこちら",
          },
          {
            label: "緊急連絡 (Chat)",
            href: "https://chat.example.com",
            description: "24時間以内に対応します",
          },
        ]}
      />,
    );

    const mailLink = screen.getByRole("link", { name: /サポートメール/ });
    await user.click(mailLink);

    expect(pushAnalyticsEvent).toHaveBeenCalledWith({
      name: "contact_open",
      params: { source: "サポートメール" },
    });

    const chatLink = screen.getByRole("link", { name: /緊急連絡 \(Chat\)/ });
    expect(chatLink).toHaveAttribute("target", "_blank");
    expect(chatLink).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });
});
