import { describe, expect, it } from "vitest";
import { runSimulation, DEFAULT_SURGE, PRESET_SCENARIOS } from "@/lib/surge-sim/engine";
import { SLA_ABANDONMENT_THRESHOLD } from "@/data/mock/surge-sim";

describe("SurgeSim engine", () => {
  it("runs a default simulation with zones and metrics (happy path)", () => {
    const result = runSimulation();
    expect(result.zones.length).toBeGreaterThan(0);
    expect(result.metrics.totalDemand).toBeGreaterThan(0);
    expect(result.metrics.totalSupply).toBeGreaterThan(0);
    expect(result.weather.id).toBe("clear");
    expect(result.simulatedAt).toBeTruthy();
  });

  it("increases surge multiplier when demand exceeds supply", () => {
    const balanced = runSimulation({ baseSupply: 50, baseDemand: 50 });
    const imbalanced = runSimulation({ baseSupply: 20, baseDemand: 90 });
    expect(imbalanced.metrics.avgSurgeMultiplier).toBeGreaterThan(
      balanced.metrics.avgSurgeMultiplier
    );
  });

  it("applies weather modifiers to supply and demand", () => {
    const clear = runSimulation({ weather: "clear", baseSupply: 50, baseDemand: 50 });
    const storm = runSimulation({ weather: "heavy_rain", baseSupply: 50, baseDemand: 50 });
    expect(storm.metrics.totalDemand).toBeGreaterThan(clear.metrics.totalDemand);
    expect(storm.metrics.totalSupply).toBeLessThan(clear.metrics.totalSupply);
  });

  it("computes abandonment rate within valid bounds", () => {
    const result = runSimulation({ baseSupply: 10, baseDemand: 100 });
    for (const zone of result.zones) {
      expect(zone.abandonmentRate).toBeGreaterThanOrEqual(0);
      expect(zone.abandonmentRate).toBeLessThanOrEqual(1);
      expect(zone.driverAcceptRate).toBeGreaterThanOrEqual(0.35);
      expect(zone.driverAcceptRate).toBeLessThanOrEqual(0.98);
    }
  });

  it("respects custom surge config bounds", () => {
    const result = runSimulation({
      baseSupply: 10,
      baseDemand: 100,
      surge: { minMultiplier: 1.5, maxMultiplier: 2.5, sensitivity: 1.0 },
    });
    for (const zone of result.zones) {
      expect(zone.surgeMultiplier).toBeGreaterThanOrEqual(1.5);
      expect(zone.surgeMultiplier).toBeLessThanOrEqual(2.5);
    }
  });

  it("exposes preset scenarios and default surge config", () => {
    expect(PRESET_SCENARIOS.length).toBeGreaterThanOrEqual(4);
    expect(DEFAULT_SURGE.minMultiplier).toBe(1.2);
    expect(DEFAULT_SURGE.maxMultiplier).toBe(3.0);
  });
});

describe("SurgeSim guardrails", () => {
  it("flags SLA breach when abandonment exceeds threshold", () => {
    const extreme = runSimulation({ baseSupply: 5, baseDemand: 120 });
    const breachesSla =
      extreme.metrics.checkoutAbandonmentRate > SLA_ABANDONMENT_THRESHOLD;
    expect(breachesSla).toBe(true);
  });

  it("reports order match rate as a percentage", () => {
    const result = runSimulation();
    expect(result.metrics.orderMatchRate).toBeGreaterThanOrEqual(0);
    expect(result.metrics.orderMatchRate).toBeLessThanOrEqual(100);
  });
});
