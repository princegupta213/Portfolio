export type WeatherEvent = "clear" | "light_rain" | "heavy_rain" | "heat_wave" | "snow";

export interface WeatherConfig {
  id: WeatherEvent;
  label: string;
  emoji: string;
  demandMultiplier: number;
  supplyMultiplier: number;
  description: string;
}

export interface SurgeConfig {
  minMultiplier: number;
  maxMultiplier: number;
  /** How aggressively surge scales with imbalance (0–1) */
  sensitivity: number;
}

export interface ZoneInput {
  id: string;
  row: number;
  col: number;
  name: string;
  /** Local demand weight — some zones are busier */
  demandWeight: number;
}

export interface ZoneState {
  id: string;
  row: number;
  col: number;
  name: string;
  supply: number;
  demand: number;
  surgeMultiplier: number;
  imbalanceRatio: number;
  matchedOrders: number;
  unmatchedOrders: number;
  driverAcceptRate: number;
  checkoutConversion: number;
  abandonmentRate: number;
  avgWaitMinutes: number;
}

export interface MarketMetrics {
  orderMatchRate: number;
  checkoutAbandonmentRate: number;
  avgSurgeMultiplier: number;
  totalDemand: number;
  totalSupply: number;
  totalMatched: number;
  totalAbandoned: number;
  avgDriverAcceptRate: number;
  avgCheckoutConversion: number;
  avgWaitMinutes: number;
}

export interface SimulationInput {
  baseSupply: number;
  baseDemand: number;
  weather: WeatherEvent;
  surge: SurgeConfig;
  zones: ZoneInput[];
}

export interface SimulationResult {
  zones: ZoneState[];
  metrics: MarketMetrics;
  weather: WeatherConfig;
  surge: SurgeConfig;
  simulatedAt: string;
}

export interface TimeSeriesPoint {
  t: number;
  matchRate: number;
  abandonmentRate: number;
  avgSurge: number;
}
