import { DEFAULT_GRID } from "./grid";
import { getWeather } from "./weather";
import { SURGE_SIM_PRESETS } from "@/data/mock/surge-sim";
import type {
  MarketMetrics,
  SimulationInput,
  SimulationResult,
  SurgeConfig,
  ZoneInput,
  ZoneState,
} from "./types";

const BASE_DRIVER_ACCEPT = 0.78;
const BASE_CHECKOUT_CONVERSION = 0.88;
const SURGE_ACCEPT_BOOST = 0.12;
const SURGE_ABANDON_PENALTY = 0.22;
const WAIT_ABANDON_FACTOR = 0.08;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function computeSurge(imbalanceRatio: number, surge: SurgeConfig): number {
  const normalized = clamp((imbalanceRatio - 1) / 2.5, 0, 1);
  const raw = 1 + normalized * surge.sensitivity * (surge.maxMultiplier - 1);
  return clamp(raw, surge.minMultiplier, surge.maxMultiplier);
}

function simulateZone(
  zone: ZoneInput,
  effectiveSupply: number,
  effectiveDemand: number,
  surge: SurgeConfig
): ZoneState {
  const supply = Math.max(1, Math.round(effectiveSupply));
  const demand = Math.max(1, Math.round(effectiveDemand));
  const imbalanceRatio = demand / supply;
  const surgeMultiplier = computeSurge(imbalanceRatio, surge);

  const waitPressure = clamp((imbalanceRatio - 1) * 2.5, 0, 4);
  const avgWaitMinutes = 3 + waitPressure * 2.8 + (surgeMultiplier > 2 ? (surgeMultiplier - 2) * 1.5 : 0);

  const surgeBoost = (surgeMultiplier - 1) / (surge.maxMultiplier - 1 || 1);
  const driverAcceptRate = clamp(
    BASE_DRIVER_ACCEPT + surgeBoost * SURGE_ACCEPT_BOOST - waitPressure * 0.04,
    0.35,
    0.98
  );

  const pricePain = clamp((surgeMultiplier - surge.minMultiplier) / (surge.maxMultiplier - surge.minMultiplier || 1), 0, 1);
  const checkoutConversion = clamp(
    BASE_CHECKOUT_CONVERSION -
      pricePain * SURGE_ABANDON_PENALTY -
      waitPressure * WAIT_ABANDON_FACTOR,
    0.25,
    0.98
  );

  const abandonmentRate = 1 - checkoutConversion;
  const effectiveDemandAfterCheckout = demand * checkoutConversion;
  const effectiveSupplyAfterAccept = supply * driverAcceptRate;
  const matchedOrders = Math.min(effectiveDemandAfterCheckout, effectiveSupplyAfterAccept);
  const unmatchedOrders = Math.max(0, effectiveDemandAfterCheckout - matchedOrders);

  return {
    id: zone.id,
    row: zone.row,
    col: zone.col,
    name: zone.name,
    supply,
    demand,
    surgeMultiplier,
    imbalanceRatio,
    matchedOrders,
    unmatchedOrders,
    driverAcceptRate,
    checkoutConversion,
    abandonmentRate,
    avgWaitMinutes,
  };
}

function aggregateMetrics(zones: ZoneState[]): MarketMetrics {
  const totalDemand = zones.reduce((s, z) => s + z.demand, 0);
  const totalSupply = zones.reduce((s, z) => s + z.supply, 0);
  const totalMatched = zones.reduce((s, z) => s + z.matchedOrders, 0);
  const totalAbandoned = zones.reduce((s, z) => s + z.demand * z.abandonmentRate, 0);
  const checkoutAttempts = zones.reduce((s, z) => s + z.demand * z.checkoutConversion, 0);

  return {
    orderMatchRate: checkoutAttempts > 0 ? (totalMatched / checkoutAttempts) * 100 : 0,
    checkoutAbandonmentRate: totalDemand > 0 ? (totalAbandoned / totalDemand) * 100 : 0,
    avgSurgeMultiplier: zones.reduce((s, z) => s + z.surgeMultiplier, 0) / zones.length,
    totalDemand,
    totalSupply,
    totalMatched,
    totalAbandoned,
    avgDriverAcceptRate: zones.reduce((s, z) => s + z.driverAcceptRate, 0) / zones.length,
    avgCheckoutConversion: zones.reduce((s, z) => s + z.checkoutConversion, 0) / zones.length,
    avgWaitMinutes: zones.reduce((s, z) => s + z.avgWaitMinutes, 0) / zones.length,
  };
}

export function runSimulation(input: Partial<SimulationInput> = {}): SimulationResult {
  const zones = input.zones ?? DEFAULT_GRID;
  const weather = getWeather(input.weather ?? "clear");
  const surge: SurgeConfig = {
    minMultiplier: input.surge?.minMultiplier ?? 1.2,
    maxMultiplier: input.surge?.maxMultiplier ?? 3.0,
    sensitivity: input.surge?.sensitivity ?? 0.85,
  };

  const baseSupply = input.baseSupply ?? 50;
  const baseDemand = input.baseDemand ?? 50;

  const totalWeight = zones.reduce((s, z) => s + z.demandWeight, 0);
  const supplyPerWeight = (baseSupply * weather.supplyMultiplier) / totalWeight;
  const demandPerWeight = (baseDemand * weather.demandMultiplier) / totalWeight;

  const zoneStates = zones.map((zone) =>
    simulateZone(
      zone,
      supplyPerWeight * zone.demandWeight,
      demandPerWeight * zone.demandWeight,
      surge
    )
  );

  return {
    zones: zoneStates,
    metrics: aggregateMetrics(zoneStates),
    weather,
    surge,
    simulatedAt: new Date().toISOString(),
  };
}

export const DEFAULT_SURGE: SurgeConfig = {
  minMultiplier: 1.2,
  maxMultiplier: 3.0,
  sensitivity: 0.85,
};

export const PRESET_SCENARIOS = SURGE_SIM_PRESETS.map(({ id, label, baseSupply, baseDemand, weather }) => ({
  id,
  label,
  baseSupply,
  baseDemand,
  weather,
}));
