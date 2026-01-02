import type { MetadataRoute } from "next";
import { seriesDetails } from "./_content/series";
import { journalPostDetails } from "./_content/journal";
import { legalPage } from "./_content/legal";
import { timeline } from "./_content/about";
import { getSiteUrl } from "./_lib/site";

const toTimestamp = (value: string | number | Date | undefined) => {
  if (!value) {
    return undefined;
  }
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.getTime();
};

const galleryTimestamps = seriesDetails
  .flatMap((series) => series.gallery.map((image) => toTimestamp(image.datePublished)))
  .filter((timestamp): timestamp is number => typeof timestamp === "number");
const latestGalleryTimestamp = galleryTimestamps.length ? Math.max(...galleryTimestamps) : undefined;

const journalTimestamps = journalPostDetails
  .map((post) => toTimestamp(post.date))
  .filter((timestamp): timestamp is number => typeof timestamp === "number");
const latestJournalTimestamp = journalTimestamps.length ? Math.max(...journalTimestamps) : undefined;

const timelineTimestamps = timeline
  .map((entry) => toTimestamp(`${entry.year}-01-01`))
  .filter((timestamp): timestamp is number => typeof timestamp === "number");
const latestTimelineTimestamp = timelineTimestamps.length ? Math.max(...timelineTimestamps) : undefined;

const legalTimestamp = toTimestamp(`${legalPage.updatedAt}T00:00:00Z`);

const defaultTimestamp = Math.max(
  latestGalleryTimestamp ?? 0,
  latestJournalTimestamp ?? 0,
  latestTimelineTimestamp ?? 0,
  legalTimestamp ?? 0,
);

const defaultLastModified = new Date(defaultTimestamp || Date.now()).toISOString();

const safeDate = (value: string | number | Date | undefined) => {
  const timestamp = toTimestamp(value);
  if (!timestamp) {
    return defaultLastModified;
  }

  return new Date(timestamp).toISOString();
};

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  lastModified?: string | number | Date;
}> = [
  {
    path: "",
    changeFrequency: "weekly",
    lastModified: defaultTimestamp,
  },
  {
    path: "/about",
    changeFrequency: "monthly",
    lastModified: latestTimelineTimestamp ?? defaultTimestamp,
  },
  {
    path: "/services",
    changeFrequency: "monthly",
    lastModified: latestGalleryTimestamp ?? defaultTimestamp,
  },
  {
    path: "/contact",
    changeFrequency: "weekly",
  },
  {
    path: "/works",
    changeFrequency: "weekly",
    lastModified: latestGalleryTimestamp ?? defaultTimestamp,
  },
  {
    path: "/journal",
    changeFrequency: "weekly",
    lastModified: latestJournalTimestamp ?? defaultTimestamp,
  },
  {
    path: "/legal",
    changeFrequency: "yearly",
    lastModified: legalTimestamp,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, changeFrequency, lastModified }) => ({
    url: `${siteUrl}${path}`,
    lastModified: safeDate(lastModified),
    changeFrequency,
  }));

  const worksRoutes: MetadataRoute.Sitemap = seriesDetails.map((series) => {
    const galleryTimestamps = series.gallery
      .map((image) => new Date(image.datePublished).getTime())
      .filter((timestamp) => Number.isFinite(timestamp));

    const lastModifiedTimestamp = galleryTimestamps.length
      ? Math.max(...galleryTimestamps)
      : new Date(`${series.year}-01-01`).getTime();

    return {
      url: `${siteUrl}/works/${series.slug}`,
      lastModified: safeDate(lastModifiedTimestamp),
      changeFrequency: "yearly",
    };
  });

  const journalRoutes: MetadataRoute.Sitemap = journalPostDetails.map((post) => ({
    url: `${siteUrl}/journal/${post.slug}`,
    lastModified: safeDate(post.date),
    changeFrequency: "weekly",
  }));

  return [...staticRoutes, ...worksRoutes, ...journalRoutes];
}
