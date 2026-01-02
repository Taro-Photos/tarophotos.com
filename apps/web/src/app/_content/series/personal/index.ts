import type { SeriesDetails } from "../types";
// Original series (unpublished)
import { tokyoNightLines } from "./tokyo-night-lines";
import { neonCascades } from "./neon-cascades";
import { lanternArcade } from "./lantern-arcade";
import { canalRibbons } from "./canal-ribbons";
import { harborLanterns } from "./harbor-lanterns";
import { elevatedCitylines } from "./elevated-citylines";
import { springSanctuaries } from "./spring-sanctuaries";
import { morningTransit } from "./morning-transit";
import { sakuraResonance } from "./sakura-resonance";
import { highlandDrift } from "./highland-drift";
import { harborBlueHour } from "./harbor-blue-hour";
import { winterGleam } from "./winter-gleam";
import { uenoArcadia } from "./ueno-arcadia";
import { canalAfterglow } from "./canal-afterglow";
import { asakusaPromenade } from "./asakusa-promenade";
import { yoyogiIntervals } from "./yoyogi-intervals";
import { matsuyamaTransit } from "./matsuyama-transit";
import { kudanLayers } from "./kudan-layers";
import { firstLightVoyage } from "./first-light-voyage";

// New curated series (published)
import { tokyoNightChronicles } from "./tokyo-night-chronicles";
import { waterfrontMoments } from "./waterfront-moments";
import { seasonalTokyo } from "./seasonal-tokyo";
import { tokyoTransit } from "./tokyo-transit";
import { historicDistricts } from "./historic-districts";

export const personalSeries: SeriesDetails[] = [
  // Curated series (published)
  tokyoNightChronicles,
  waterfrontMoments,
  seasonalTokyo,
  tokyoTransit,
  historicDistricts,
  // Original series (unpublished)
  tokyoNightLines,
  neonCascades,
  lanternArcade,
  canalRibbons,
  harborLanterns,
  elevatedCitylines,
  springSanctuaries,
  morningTransit,
  sakuraResonance,
  highlandDrift,
  harborBlueHour,
  winterGleam,
  uenoArcadia,
  canalAfterglow,
  asakusaPromenade,
  yoyogiIntervals,
  matsuyamaTransit,
  kudanLayers,
  firstLightVoyage,
];
