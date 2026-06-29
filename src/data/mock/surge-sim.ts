import type { WeatherEvent } from "@/lib/surge-sim/types";

export interface SurgeSimPreset {
  id: string;
  label: string;
  description: string;
  baseSupply: number;
  baseDemand: number;
  weather: WeatherEvent;
  expectedMatchRate: string;
}

/** Checkout abandonment guardrail for SLA breach callouts */
export const SLA_ABANDONMENT_THRESHOLD = 15;

/** Enterprise scenarios wired to ProjectDemoShell / ENTERPRISE_SCENARIOS */
export const ENTERPRISE_SURGE_PRESETS: SurgeSimPreset[] = [
  {
    id: "rush-hour",
    label: "Friday rush hour",
    description: "High demand, moderate supply — office districts overheated.",
    baseSupply: 48,
    baseDemand: 72,
    weather: "clear",
    expectedMatchRate: "~75%",
  },
  {
    id: "storm",
    label: "Storm surge",
    description: "Weather shock + demand spike — supply drops from driver churn.",
    baseSupply: 40,
    baseDemand: 65,
    weather: "heavy_rain",
    expectedMatchRate: "~68%",
  },
  {
    id: "stadium",
    label: "Stadium event",
    description: "Localized hotspot, supply drain — concert let-out pattern.",
    baseSupply: 45,
    baseDemand: 80,
    weather: "clear",
    expectedMatchRate: "~60%",
  },
  {
    id: "airport",
    label: "Airport pickup",
    description: "Sustained imbalance, cap test — long waits at terminals.",
    baseSupply: 35,
    baseDemand: 70,
    weather: "clear",
    expectedMatchRate: "~62%",
  },
  {
    id: "downtown",
    label: "Downtown nightlife",
    description: "Late-night demand spike with thinning supply after midnight.",
    baseSupply: 38,
    baseDemand: 78,
    weather: "clear",
    expectedMatchRate: "~58%",
  },
  {
    id: "holiday",
    label: "Holiday surge",
    description: "Peak travel weekend — elevated demand across all zones.",
    baseSupply: 42,
    baseDemand: 85,
    weather: "heat_wave",
    expectedMatchRate: "~55%",
  },
];

export const SURGE_SIM_PRESETS: SurgeSimPreset[] = [
  {
    id: "balanced",
    label: "Balanced Market",
    description: "Typical weekday evening — supply and demand roughly matched.",
    baseSupply: 55,
    baseDemand: 50,
    weather: "clear",
    expectedMatchRate: "~92%",
  },
  {
    id: "rain_surge",
    label: "Heavy Rain Spike",
    description: "Demand surges as riders avoid walking; supply drops from driver churn.",
    baseSupply: 50,
    baseDemand: 55,
    weather: "heavy_rain",
    expectedMatchRate: "~78%",
  },
  {
    id: "supply_crunch",
    label: "Driver Shortage",
    description: "Post-event exodus — 30% fewer drivers online, demand holds steady.",
    baseSupply: 30,
    baseDemand: 65,
    weather: "clear",
    expectedMatchRate: "~65%",
  },
  {
    id: "snow_chaos",
    label: "Snow Storm",
    description: "Both supply and demand shift — longer waits, higher surge, more abandonment.",
    baseSupply: 40,
    baseDemand: 60,
    weather: "snow",
    expectedMatchRate: "~70%",
  },
  {
    id: "concert_exit",
    label: "Concert Exit Flood",
    description: "Localized demand spike in entertainment zones — stadium let-out pattern.",
    baseSupply: 45,
    baseDemand: 80,
    weather: "clear",
    expectedMatchRate: "~60%",
  },
  {
    id: "morning_commute",
    label: "Morning Commute",
    description: "Predictable rush-hour imbalance — office districts overheated.",
    baseSupply: 48,
    baseDemand: 72,
    weather: "clear",
    expectedMatchRate: "~75%",
  },
];

/** Snapshot metrics for portfolio demo cards */
export const SURGE_SIM_DEMO_METRICS = {
  zones: 24,
  defaultMatchRate: 91.2,
  defaultAbandonment: 8.4,
  avgSurge: 1.35,
};
