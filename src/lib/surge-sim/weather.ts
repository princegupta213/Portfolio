import type { WeatherConfig, WeatherEvent } from "./types";

export const WEATHER_EVENTS: WeatherConfig[] = [
  {
    id: "clear",
    label: "Clear",
    emoji: "☀️",
    demandMultiplier: 1.0,
    supplyMultiplier: 1.0,
    description: "Baseline conditions — normal demand and driver availability.",
  },
  {
    id: "light_rain",
    label: "Light Rain",
    emoji: "🌦️",
    demandMultiplier: 1.15,
    supplyMultiplier: 0.92,
    description: "Mild weather bump in ride requests; some drivers pause.",
  },
  {
    id: "heavy_rain",
    label: "Heavy Rain",
    emoji: "🌧️",
    demandMultiplier: 1.45,
    supplyMultiplier: 0.72,
    description: "Spike in delivery demand; drivers avoid traffic delays.",
  },
  {
    id: "heat_wave",
    label: "Heat Wave",
    emoji: "🔥",
    demandMultiplier: 1.2,
    supplyMultiplier: 0.85,
    description: "More short trips; drivers reduce hours in peak heat.",
  },
  {
    id: "snow",
    label: "Snow",
    emoji: "❄️",
    demandMultiplier: 1.35,
    supplyMultiplier: 0.65,
    description: "High demand, low supply — worst imbalance scenario.",
  },
];

export function getWeather(id: WeatherEvent): WeatherConfig {
  return WEATHER_EVENTS.find((w) => w.id === id) ?? WEATHER_EVENTS[0];
}
