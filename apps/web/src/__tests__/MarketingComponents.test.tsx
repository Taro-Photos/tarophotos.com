import type { ReactNode } from "react";
import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const ctaMock = vi.fn();
const trackedMock = vi.fn();

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }: { children: ReactNode }) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock("@/components/atoms/CtaLink", () => ({
  CtaLink: ({ children, href, analytics, ...rest }: { children: ReactNode; href: string; analytics?: unknown }) => {
    ctaMock({ href, analytics });
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  },
}));

vi.mock("@/components/atoms/TrackedLink", () => ({
  TrackedLink: ({ children, href, analytics, ...rest }: { children: ReactNode; href: string | { pathname: string }; analytics?: unknown }) => {
    trackedMock({ href, analytics });
    return (
      <a href={typeof href === "string" ? href : href.pathname} {...rest}>
        {children}
      </a>
    );
  },
}));

import { AboutHighlights } from "@/components/organisms/AboutHighlights";
import { AboutTimeline } from "@/components/organisms/AboutTimeline";
import { DeliveryList } from "@/components/molecules/DeliveryList";
import { DeliveryNotices } from "@/components/organisms/DeliveryNotices";
import { FooterGlobal } from "@/components/organisms/FooterGlobal";
import { LogoWall } from "@/components/molecules/LogoWall";
import { ProfileHero } from "@/components/organisms/ProfileHero";
import { SectionLinks } from "@/components/molecules/SectionLinks";
import { SeriesHeader } from "@/components/organisms/SeriesHeader";
import { SeriesMeta } from "@/components/organisms/SeriesMeta";
import { SeriesRelatedCta } from "@/components/organisms/SeriesRelatedCta";
import { SocialLinks } from "@/components/molecules/SocialLinks";
import { SupportContacts } from "@/components/molecules/SupportContacts";
import { highlightSections, timeline, profile, clients, socials } from "@/app/_content/about";
import { deliveries, notices, supportChannels } from "@/app/_content/clients";
import { sectionLinks } from "@/app/_content/home";
import { seriesDetails } from "@/app/_content/series";

describe("Marketing components", () => {
  beforeEach(() => {
    ctaMock.mockClear();
    trackedMock.mockClear();
  });

  it("renders about highlights and timeline from content", () => {
    render(
      <>
        <AboutHighlights />
        <AboutTimeline />
      </>,
    );

    highlightSections.forEach((section) => {
      expect(screen.getByRole("heading", { name: section.title })).toBeInTheDocument();
    });

    const timelineItems = screen.getAllByText(/\d{4}/);
    expect(timelineItems[0]).toHaveTextContent(String(timeline[0]?.year));
  });

  it("displays profile hero information and portrait", () => {
    render(<ProfileHero />);

    expect(screen.getByRole("heading", { level: 1, name: profile.name })).toBeInTheDocument();
    profile.languages.forEach((lang) => {
      expect(screen.getByText(lang)).toBeInTheDocument();
    });
    expect(screen.getByRole("img", { name: profile.portrait.alt })).toBeInTheDocument();
  });

  it("renders logo wall clients", () => {
    render(<LogoWall />);

    clients.forEach((client) => {
      expect(screen.getByText(client)).toBeInTheDocument();
    });
  });

  it("renders footer with social and legal links", () => {
    const year = new Date().getFullYear();
    render(
      <FooterGlobal
        social={[
          { label: "Instagram", href: "https://instagram.com" },
          { label: "YouTube", href: "https://youtube.com" },
        ]}
        legal={[
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
        ]}
      />,
    );

    expect(screen.getByText(`© ${year} Taro Photos`)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
  });

  it("renders deliveries with CTAs and passcodes", () => {
    render(<DeliveryList deliveries={deliveries.slice(0, 1)} />);

    const article = screen.getByRole("article");
    expect(within(article).getByText(deliveries[0]?.project ?? "")).toBeInTheDocument();
    expect(within(article).getByText(deliveries[0]?.passcode ?? "")).toBeInTheDocument();
    expect(ctaMock).toHaveBeenCalledWith({
      href: deliveries[0]?.url,
      analytics: {
        name: "delivery_open",
        params: { client: deliveries[0]?.client, gallery: deliveries[0]?.service },
      },
    });
  });

  it("renders delivery notices grid", () => {
    render(<DeliveryNotices notices={notices} />);

    notices.forEach((notice) => {
      expect(screen.getByText(notice.title)).toBeInTheDocument();
      expect(screen.getByText(notice.body)).toBeInTheDocument();
    });
  });

  it("renders navigation section links and tracks analytics", () => {
    render(<SectionLinks links={sectionLinks} />);

    const actionLinks = screen.getAllByRole("link", { name: /詳細を見る/ });
    expect(actionLinks).toHaveLength(sectionLinks.length);

    sectionLinks.forEach((link) => {
      expect(trackedMock).toHaveBeenCalledWith({
        href: link.href,
        analytics: {
          name: "cta_click",
          params: { location: "section_links", label: link.label },
        },
      });
    });
  });

  it("renders series header, meta, and related CTA", () => {
    const series = { 
      ...seriesDetails[0], 
      year: 2024, 
      tags: ["Urban", "Night"],
      heroImage: { src: "https://example.com/hero.jpg", alt: "Hero", width: 1200, height: 800 }
    };
    render(
      <>
        <SeriesHeader series={series} />
        <SeriesMeta series={series} />
        <SeriesRelatedCta series={series} />
      </>,
    );

    expect(screen.getByRole("heading", { level: 1, name: series.title })).toBeInTheDocument();
    expect(screen.getByText(series.story)).toBeInTheDocument();
    expect(ctaMock).toHaveBeenCalledWith({ href: series.relatedCta.href, analytics: undefined });
  });

  it("renders social links with analytics tracking", () => {
    render(<SocialLinks />);

    socials.forEach((social) => {
      expect(screen.getByText(social.label)).toBeInTheDocument();
    });
    const instagram = socials[0];
    expect(trackedMock).toHaveBeenCalledWith({
      href: instagram.href,
      analytics: {
        name: "cta_click",
        params: { location: "about_social", label: instagram.label },
      },
    });
  });

  it("renders support contacts with tracked links", () => {
    render(<SupportContacts contacts={supportChannels} />);

    const emailChannel = supportChannels[0];
    expect(screen.getByText(emailChannel.value)).toBeInTheDocument();
    expect(trackedMock).toHaveBeenCalledWith({
      href: emailChannel.href,
      analytics: { name: "contact_open", params: { source: "サポートメール" } },
    });
  });
});
