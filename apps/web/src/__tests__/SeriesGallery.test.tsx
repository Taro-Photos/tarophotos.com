import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SeriesGallery } from "@/components/organisms/SeriesGallery";
import { pushAnalyticsEvent } from "@/app/_lib/analytics";

vi.mock("@/app/_lib/analytics", () => ({
  pushAnalyticsEvent: vi.fn(),
}));

describe("SeriesGallery", () => {
  const images = [
    {
      src: "/series/image-01.jpg",
      alt: "青い光を纏った都市の高層ビル",
      width: 1200,
      height: 800,
      contentLocation: "Tokyo",
      datePublished: "2025-01-01",
      caption: "都市の光が呼吸する時間",
      statement: "夜風で看板が揺れるタイミングを押さえながら撮影した。",
    },
    {
      src: "/series/image-02.jpg",
      alt: "橋を走るランナーのシルエット",
      width: 800,
      height: 1200,
      contentLocation: "Osaka",
      datePublished: "2025-01-03",
    },
  ];

  afterEach(() => {
    vi.mocked(pushAnalyticsEvent).mockReset();
    document.body.style.overflow = "";
  });

  it("opens the lightbox, emits analytics, and falls back to series EXIF", async () => {
    const user = userEvent.setup();

    render(
      <SeriesGallery
        images={images}
        seriesTitle="Night Trails"
        seriesSlug="night-trails"
        seriesExif={[
          { label: "Camera", value: "Sony α7 IV" },
          { label: "ISO", value: "800" },
        ]}
        imageExifMap={{}}
      />,
    );

    expect(screen.getByText("都市の光が呼吸する時間")).toBeVisible();
    expect(screen.getByText("夜風で看板が揺れるタイミングを押さえながら撮影した。")).toBeVisible();
    expect(screen.getByText("View Story")).toBeVisible();
    expect(screen.getByText("View")).toBeVisible();

    const trigger = screen.getByRole("button", { name: /Night Trails ギャラリー 1/ });
    await user.click(trigger);

    expect(pushAnalyticsEvent).toHaveBeenCalledWith({
      name: "lightbox_open",
      params: { series_slug: "night-trails", index: 0 },
    });

    const dialog = await screen.findByRole("dialog");
    await waitFor(() => expect(dialog).toBeVisible());
    expect(within(dialog).getByText("Tokyo")).toBeVisible();
    expect(within(dialog).getByText("Sony α7 IV")).toBeVisible();
    expect(within(dialog).getByText("Artist Notes")).toBeVisible();
    expect(within(dialog).getByText("都市の光が呼吸する時間")).toBeVisible();
    expect(within(dialog).getByText("夜風で看板が揺れるタイミングを押さえながら撮影した。")).toBeVisible();

    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(document.body.style.overflow).toBe("");
  });

  it("cycles through images with arrow keys using per-image EXIF data", async () => {
    const user = userEvent.setup();

    render(
      <SeriesGallery
        images={images}
        seriesTitle="Night Trails"
        seriesSlug="night-trails"
        imageExifMap={{
          "/series/image-02.jpg": {
            camera: "Sony α7R V",
            shutterSpeed: "1/60",
            aperture: "F2.0",
            iso: "ISO 1600",
          },
        }}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Night Trails ギャラリー 1/ }));

    let dialog = await screen.findByRole("dialog");
    await waitFor(() => expect(dialog).toBeVisible());
    await waitFor(() => expect(within(dialog).getByRole("img", { name: images[0].alt })).toBeVisible());

    await user.keyboard("{ArrowRight}");
    dialog = await screen.findByRole("dialog");
    await waitFor(() => expect(within(dialog).getByRole("img", { name: images[1].alt })).toBeVisible());
    expect(screen.getByText("ISO 1600")).toBeVisible();

    await user.keyboard("{ArrowRight}");
    dialog = await screen.findByRole("dialog");
    await waitFor(() => expect(within(dialog).getByRole("img", { name: images[0].alt })).toBeVisible());

    await user.keyboard("{ArrowLeft}");
    dialog = await screen.findByRole("dialog");
    await waitFor(() => expect(within(dialog).getByRole("img", { name: images[1].alt })).toBeVisible());
  });
});

  it("uses fallback exif, truncates statement preview, and traps focus", async () => {
    const user = userEvent.setup();
    const longStatement = Array(10).fill("歩道橋からの視点で夜のリズムを記録し、").join("");

    render(
      <SeriesGallery
        images={[
          {
            src: "/series/image-03.jpg",
            alt: "夜の交差点を俯瞰した景色",
            width: 2560,
            height: 1707,
            contentLocation: "Shibuya",
            datePublished: "2025-01-05",
            caption: "夜の交差点を俯瞰する",
            statement: longStatement,
          },
        ]}
        seriesTitle="Night Trails"
        seriesSlug="night-trails"
        seriesExif={[
          { label: "Settings", value: "1/125s · ƒ1.8 · ISO 640" },
        ]}
      />
    );

    const teaser = screen.getByRole("button", { name: /Night Trails ギャラリー 1/ });
    const preview = screen.getByText((content) => content.startsWith("歩道橋からの視点で夜のリズム"));
    expect(preview.textContent?.endsWith("...")).toBe(true);

    await user.click(teaser);
    const dialog = await screen.findByRole("dialog");
    await waitFor(() => expect(dialog).toBeVisible());

    // Tab forward from Close button should loop to the next focusable element without leaving the dialog
    await user.keyboard("{Tab}");
    expect(document.activeElement && dialog.contains(document.activeElement)).toBe(true);

    await user.keyboard("{Shift>}{Tab}{/Shift}");
    expect(document.activeElement && dialog.contains(document.activeElement)).toBe(true);

    expect(screen.getByText("ISO 640")).toBeInTheDocument();
    expect(screen.getByText("1/125s")).toBeInTheDocument();
    expect(screen.getByText("F1.8")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(document.body.style.overflow).toBe("");
  });
