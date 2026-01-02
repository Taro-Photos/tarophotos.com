import type { SeriesDetails } from "./types";
import { commercialSeries as allCommercialSeries } from "./commercial";
import { personalSeries as allPersonalSeries } from "./personal";

export * from "./types";

// Environment check
const isDevelopment = process.env.NODE_ENV === 'development';

// Filter based on published status
function filterPublished(series: SeriesDetails[]): SeriesDetails[] {
  return series.filter(s => s.published || (isDevelopment && s.isDraft));
}

// Export filtered series
export const commercialSeries = filterPublished(allCommercialSeries);
export const personalSeries = filterPublished(allPersonalSeries);

// Aggregate all series
export const seriesDetails: SeriesDetails[] = [...commercialSeries, ...personalSeries];

// Helper function to get a series by slug
export function getSeriesBySlug(slug: string) {
  return seriesDetails.find((series) => series.slug === slug);
}
