import { describe, expect, it } from "vitest";
import { classifyPrompt, getClassificationScores } from "@/lib/prompt-route/classifier";
import { routeRequest } from "@/lib/prompt-route/router";
import { DEFAULT_POLICIES } from "@/lib/prompt-route/policies";
import {
  getDailyBudgetCap,
  getPoliciesForScenario,
  getPromptsForScenario,
} from "@/lib/prompt-route/scenarios";

describe("PromptRoute classifier", () => {
  it("classifies simple conversational prompts (happy path)", () => {
    const result = classifyPrompt("Hi, what is the weather today?");
    expect(result.taskType).toBe("simple_chat");
    expect(result.taskLabel).toBe("Simple Chat");
    expect(result.confidence).toBeGreaterThan(50);
    expect(result.estimatedInputTokens).toBeGreaterThan(0);
  });

  it("detects code generation requests", () => {
    const result = classifyPrompt(
      "Write a TypeScript function to debounce API calls with async await"
    );
    expect(result.taskType).toBe("code_gen");
    expect(result.signals.some((s) => s.includes("Code"))).toBe(true);
  });

  it("detects summarization intent", () => {
    const result = classifyPrompt("Summarize this article in 3 bullet points");
    expect(result.taskType).toBe("summarization");
    expect(result.estimatedOutputTokens).toBeGreaterThan(0);
  });

  it("detects data extraction patterns", () => {
    const result = classifyPrompt('Extract fields from this JSON: {"name": "test", "age": 30}');
    expect(result.taskType).toBe("data_extraction");
  });

  it("returns ranked classification scores", () => {
    const scores = getClassificationScores("Analyze trade-offs step by step for our architecture");
    expect(scores.length).toBe(5);
    expect(scores[0].score).toBeGreaterThanOrEqual(scores[1]?.score ?? 0);
    expect(scores.some((s) => s.taskType === "complex_reasoning")).toBe(true);
  });

  it("handles long-context edge case signals", () => {
    const longPrompt = "word ".repeat(7000);
    const result = classifyPrompt(longPrompt);
    expect(result.estimatedInputTokens).toBeGreaterThan(8000);
    expect(result.signals.some((s) => s.includes("Long context"))).toBe(true);
  });
});

describe("PromptRoute router", () => {
  it("routes simple chat to the short-chat policy (happy path)", () => {
    const classification = classifyPrompt("Hello there!");
    const decision = routeRequest(classification, {
      policies: DEFAULT_POLICIES,
      simulateRateLimit: false,
      seed: 42,
    });
    expect(decision.policy.id).toBe("short-chat");
    expect(decision.outcome).toBe("primary");
    expect(decision.costUsd).toBeGreaterThanOrEqual(0);
    expect(decision.totalLatencyMs).toBeGreaterThan(0);
  });

  it("failovers to fallback model on circuit breaker", () => {
    const classification = classifyPrompt("Implement a React hook for infinite scroll");
    const decision = routeRequest(classification, {
      policies: DEFAULT_POLICIES,
      circuitBreakerOpen: true,
      seed: 1,
    });
    expect(decision.outcome).toBe("circuit_open");
    expect(decision.failoverReason).toBe("circuit_breaker");
    expect(decision.rateLimitHit).toBe(true);
    expect(decision.routedModel.id).toBe(decision.fallbackModel.id);
  });

  it("forces rate limit with deterministic seed", () => {
    const classification = classifyPrompt("Summarize the quarterly report");
    const decision = routeRequest(classification, {
      policies: DEFAULT_POLICIES,
      forceRateLimit: true,
      forceFailoverSuccess: true,
      seed: 99,
    });
    expect(decision.rateLimitHit).toBe(true);
    expect(decision.outcome).toBe("fallback");
  });

  it("computes cost savings vs baseline model", () => {
    const classification = classifyPrompt("Thanks!");
    const decision = routeRequest(classification, {
      policies: DEFAULT_POLICIES,
      simulateRateLimit: false,
      seed: 7,
    });
    expect(decision.baselineCostUsd).toBeGreaterThanOrEqual(decision.costUsd);
  });
});

describe("PromptRoute scenarios", () => {
  it("support scenario enables only support-relevant policies", () => {
    const policies = getPoliciesForScenario("support");
    const enabled = policies.filter((p) => p.enabled).map((p) => p.id);
    expect(enabled).toEqual(expect.arrayContaining(["short-chat", "summarize", "extract"]));
    expect(enabled).not.toContain("code");
  });

  it("premium scenario upgrades model assignments", () => {
    const policies = getPoliciesForScenario("premium");
    const code = policies.find((p) => p.id === "code");
    expect(code?.primaryModelId).toBe("gpt-4o");
    expect(code?.fallbackModelId).toBe("claude-sonnet");
  });

  it("provides scenario-specific prompts and budget caps", () => {
    const idePrompts = getPromptsForScenario("ide");
    expect(idePrompts.length).toBeGreaterThan(0);
    expect(getDailyBudgetCap("support")).toBe(250);
    expect(getDailyBudgetCap("premium")).toBe(2000);
  });
});
