import { describe, expect, it } from "vitest";
import { analyzeFeedback, detectColumns, parseCSVRows } from "@/lib/analyzer";
import { analyzeSentiment, sentimentBreakdown } from "@/lib/sentiment";
import { THEME_DEFINITIONS } from "@/lib/themes";
import type { FeedbackItem } from "@/lib/types";

const sampleItems: FeedbackItem[] = [
  { id: "1", text: "The app crashes constantly and is very slow to load" },
  { id: "2", text: "Love this app, works great and is super fast!" },
  { id: "3", text: "Can't find anything with search, very frustrating" },
  { id: "4", text: "Login keeps failing, locked out of my account" },
  { id: "5", text: "Too expensive for what you get, want a refund" },
];

describe("Feedback Analyzer sentiment", () => {
  it("detects positive sentiment (happy path)", () => {
    expect(analyzeSentiment("I love this app, it works great!")).toBe("positive");
  });

  it("detects negative sentiment from crash keywords", () => {
    expect(analyzeSentiment("App crashes constantly, very frustrating")).toBe("negative");
  });

  it("returns neutral when signals are balanced", () => {
    expect(analyzeSentiment("The product arrived on Tuesday")).toBe("neutral");
  });

  it("uses star ratings to boost sentiment", () => {
    expect(analyzeSentiment("Okay app ★★★★★")).toBe("positive");
    expect(analyzeSentiment("Disappointing experience 1 star")).toBe("negative");
  });

  it("aggregates sentiment breakdown counts", () => {
    const labels = ["positive", "negative", "neutral", "positive"] as const;
    const breakdown = sentimentBreakdown([...labels]);
    expect(breakdown.positive).toBe(2);
    expect(breakdown.negative).toBe(1);
    expect(breakdown.neutral).toBe(1);
  });
});

describe("Feedback Analyzer themes", () => {
  it("defines theme definitions with keywords", () => {
    expect(THEME_DEFINITIONS.length).toBeGreaterThanOrEqual(8);
    expect(THEME_DEFINITIONS.find((t) => t.id === "performance")?.keywords).toContain("crash");
  });
});

describe("Feedback Analyzer engine", () => {
  it("clusters feedback into themes (happy path)", () => {
    const result = analyzeFeedback(sampleItems);
    expect(result.totalReviews).toBe(5);
    expect(result.themes.length).toBeGreaterThan(0);
    expect(result.themes[0].count).toBeGreaterThan(0);
    expect(result.summary).toContain("Analyzed 5 reviews");
  });

  it("generates prioritized product opportunities with ICE scores", () => {
    const result = analyzeFeedback(sampleItems);
    expect(result.opportunities.length).toBeGreaterThan(0);
    const top = result.opportunities[0];
    expect(top.iceScore).toBeGreaterThan(0);
    expect(["P0", "P1", "P2", "P3"]).toContain(top.priority);
    expect(top.evidenceCount).toBeGreaterThan(0);
  });

  it("computes overall sentiment breakdown", () => {
    const result = analyzeFeedback(sampleItems);
    const total =
      result.overallSentiment.positive +
      result.overallSentiment.negative +
      result.overallSentiment.neutral;
    expect(total).toBe(5);
    expect(result.overallSentiment.negative).toBeGreaterThan(0);
  });

  it("handles empty input edge case", () => {
    const result = analyzeFeedback([]);
    expect(result.totalReviews).toBe(0);
    expect(result.themes).toHaveLength(0);
    expect(result.opportunities).toHaveLength(0);
  });
});

describe("Feedback Analyzer CSV utilities", () => {
  it("auto-detects column mappings", () => {
    const detected = detectColumns(["Review Text", "Star Rating", "Created Date", "Platform"]);
    expect(detected.textColumn).toBe("Review Text");
    expect(detected.ratingColumn).toBe("Star Rating");
    expect(detected.dateColumn).toBe("Created Date");
    expect(detected.sourceColumn).toBe("Platform");
  });

  it("parses CSV rows into feedback items", () => {
    const rows = [
      { review: "Great product", rating: "5", date: "2024-01-01" },
      { review: "", rating: "3" },
      { review: "Needs improvement", rating: "2" },
    ];
    const items = parseCSVRows(rows, { textColumn: "review", ratingColumn: "rating" });
    expect(items).toHaveLength(2);
    expect(items[0].text).toBe("Great product");
    expect(items[0].rating).toBe(5);
  });
});
