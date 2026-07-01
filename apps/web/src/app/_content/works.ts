import { seriesDetails, type SeriesDetails, type WorkTag } from "./series";

export type WorkSeries = Pick<
  SeriesDetails,
  | "slug"
  | "title"
  | "year"
  | "location"
  | "palette"
  | "focus"
  | "synopsisEn"
  | "synopsis"
  | "cover"
>;

export const workSeries: WorkSeries[] = seriesDetails.map(
  ({ slug, title, year, location, palette, focus, synopsisEn, synopsis, cover }) => ({
    slug,
    title,
    year,
    location,
    palette,
    focus,
    synopsisEn,
    synopsis,
    cover,
  }),
);

export const paletteFilters: Array<{ value: WorkTag; label: string }> = [
  { value: "color", label: "Color" },
  { value: "monochrome", label: "Monochrome" },
];

export const focusFilters: Array<{ value: WorkTag; label: string }> = [
  { value: "urban", label: "Urban" },
  { value: "nature", label: "Nature" },
  { value: "motion", label: "Motion" },
  { value: "people", label: "People" },
];

export type { WorkTag } from "./series";
