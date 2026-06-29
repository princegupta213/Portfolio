import { describe, expect, it } from "vitest";
import {
  DEFAULT_CONFIG,
  generateDataset,
  PRODUCT_CATEGORIES,
  TARGETS,
  toCSV,
  toJSON,
} from "@/lib/data-synth/generator";
import { DATA_SYNTH_SCENARIO_CONFIGS } from "@/lib/data-synth/scenarios";
import type { PersonaConfig } from "@/lib/data-synth/types";

describe("DataSynth generator", () => {
  it("generates the requested number of feedback items (happy path)", () => {
    const result = generateDataset(DEFAULT_CONFIG, 50);
    expect(result.items).toHaveLength(50);
    expect(result.items[0].id).toBe("fb-001");
    expect(result.personaComplianceScore).toBeGreaterThan(0);
    expect(result.duplicateRate).toBeGreaterThanOrEqual(0);
    expect(result.generationTimeMs).toBeGreaterThan(0);
  });

  it("assigns sentiment according to the configured mix", () => {
    const config: PersonaConfig = {
      category: "Fintech",
      personaDescription: "Test users",
      sentimentMix: { positive: 100, neutral: 0, negative: 0 },
    };
    const result = generateDataset(config, 20);
    const positiveCount = result.items.filter((i) => i.sentiment === "positive").length;
    expect(positiveCount).toBe(20);
  });

  it("includes bug and feature types in the rotation", () => {
    const result = generateDataset(DEFAULT_CONFIG, 10);
    const types = new Set(result.items.map((i) => i.type));
    expect(types.has("review")).toBe(true);
    expect(types.has("bug")).toBe(true);
    expect(types.has("feature")).toBe(true);
  });

  it("exports valid CSV and JSON formats", () => {
    const result = generateDataset(DEFAULT_CONFIG, 3);
    const csv = toCSV(result.items);
    expect(csv).toContain("id,type,sentiment,text,persona_compliance");
    expect(csv.split("\n")).toHaveLength(4);

    const json = toJSON(result.items);
    const parsed = JSON.parse(json);
    expect(parsed).toHaveLength(3);
    expect(parsed[0]).toHaveProperty("text");
  });

  it("exposes product categories and quality targets", () => {
    expect(PRODUCT_CATEGORIES).toEqual(
      expect.arrayContaining(["Fintech", "Fitness App", "B2B CRM"])
    );
    expect(PRODUCT_CATEGORIES.length).toBeGreaterThanOrEqual(3);
    expect(TARGETS.personaCompliance).toBe(85);
    expect(TARGETS.maxDuplicateRate).toBe(3);
    expect(TARGETS.maxGenerationSec).toBe(8);
  });

  it("handles edge case of a single-item dataset", () => {
    const result = generateDataset(DEFAULT_CONFIG, 1);
    expect(result.items).toHaveLength(1);
    expect(result.duplicateRate).toBe(0);
  });
});

describe("DataSynth scenarios", () => {
  it("defines all enterprise scenario presets", () => {
    expect(Object.keys(DATA_SYNTH_SCENARIO_CONFIGS)).toEqual(
      expect.arrayContaining(["prelaunch", "churn", "enterprise", "support"])
    );
  });

  it("churn scenario skews heavily negative", () => {
    const churn = DATA_SYNTH_SCENARIO_CONFIGS.churn;
    expect(churn.sentimentMix.negative).toBe(65);
    expect(churn.category).toBe("B2B CRM");
  });

  it("generates datasets from scenario presets", () => {
    const result = generateDataset(DATA_SYNTH_SCENARIO_CONFIGS.support, 30);
    expect(result.items).toHaveLength(30);
    expect(result.personaComplianceScore).toBeLessThanOrEqual(96);
  });
});
