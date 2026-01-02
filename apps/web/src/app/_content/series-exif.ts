import type { ImageExif } from "../../../types/exif";
import seriesExif from "../../../content/series-assets/series_exif.json";

type SeriesExifData = Record<string, Record<string, ImageExif>>;

const data = seriesExif as SeriesExifData;

export function getSeriesImageExif(seriesSlug: string): Record<string, ImageExif | undefined> {
  return data[seriesSlug] ?? {};
}
