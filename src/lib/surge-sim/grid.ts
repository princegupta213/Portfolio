import type { ZoneInput } from "./types";

const ZONE_NAMES = [
  "Downtown",
  "Midtown",
  "Uptown",
  "Financial",
  "Arts Dist.",
  "Waterfront",
  "University",
  "Airport",
  "Suburbs N",
  "Suburbs S",
  "Industrial",
  "Tech Park",
  "Old Town",
  "Stadium",
  "Hospital",
  "Mall",
  "Transit Hub",
  "Residential",
  "Nightlife",
  "Convention",
  "Park",
  "Harbor",
  "East Side",
  "West End",
];

/** 6×4 city grid with heterogeneous demand weights */
export function buildCityGrid(rows = 4, cols = 6): ZoneInput[] {
  const zones: ZoneInput[] = [];
  let idx = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const centerDist = Math.hypot(row - (rows - 1) / 2, col - (cols - 1) / 2);
      const maxDist = Math.hypot((rows - 1) / 2, (cols - 1) / 2);
      const centrality = 1 - centerDist / maxDist;
      const edgeBoost = row === 0 || col === 0 || row === rows - 1 || col === cols - 1 ? 0.15 : 0;
      const demandWeight = 0.55 + centrality * 0.55 + edgeBoost;

      zones.push({
        id: `z-${row}-${col}`,
        row,
        col,
        name: ZONE_NAMES[idx % ZONE_NAMES.length],
        demandWeight,
      });
      idx++;
    }
  }
  return zones;
}

export const DEFAULT_GRID = buildCityGrid();
