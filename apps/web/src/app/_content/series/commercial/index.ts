import type { SeriesDetails } from "../types";
// Original series (unpublished)
import { jLeague2024 } from "./j-league-2024";
import { marathon2024 } from "./marathon-2024";

// New curated series (published)
import { sportsAction2024 } from "./sports-action-2024";

export const commercialSeries: SeriesDetails[] = [
  // Curated series (published)
  sportsAction2024,
  // Original series (unpublished)
  jLeague2024,
  marathon2024,
];
