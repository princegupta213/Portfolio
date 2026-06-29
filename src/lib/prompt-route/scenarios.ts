import { MOCK_LLM_PROMPTS } from "@/data/mock/prompt-route";
import { DEFAULT_POLICIES } from "./policies";
import type { RoutingPolicy, TaskComplexity } from "./types";

export type PromptRouteScenarioId = "support" | "ide" | "analytics" | "premium";

function clonePolicies(policies: RoutingPolicy[]): RoutingPolicy[] {
  return policies.map((p) => ({ ...p }));
}

function enableOnly(policies: RoutingPolicy[], ids: string[]): void {
  policies.forEach((p) => {
    p.enabled = ids.includes(p.id);
  });
}

export function getPoliciesForScenario(scenarioId: string): RoutingPolicy[] {
  const policies = clonePolicies(DEFAULT_POLICIES);

  switch (scenarioId as PromptRouteScenarioId) {
    case "support":
      enableOnly(policies, ["short-chat", "summarize", "extract"]);
      break;
    case "ide":
      enableOnly(policies, ["code", "reasoning", "long-context"]);
      break;
    case "analytics":
      enableOnly(policies, ["summarize", "extract", "short-chat"]);
      break;
    case "premium":
      policies.forEach((p) => {
        p.enabled = true;
        if (p.id === "reasoning" || p.id === "code") {
          p.primaryModelId = "gpt-4o";
          p.fallbackModelId = "claude-sonnet";
        }
        if (p.id === "short-chat") {
          p.primaryModelId = "gpt-4o-mini";
          p.fallbackModelId = "gpt-4o";
        }
      });
      break;
    default:
      break;
  }

  return policies;
}

const TASK_FILTERS: Record<PromptRouteScenarioId, TaskComplexity[]> = {
  support: ["simple_chat", "summarization"],
  ide: ["code_gen", "complex_reasoning"],
  analytics: ["summarization", "data_extraction"],
  premium: ["simple_chat", "summarization", "code_gen", "complex_reasoning", "data_extraction"],
};

export function getPromptsForScenario(scenarioId: string): string[] {
  const id = scenarioId as PromptRouteScenarioId;
  const types = TASK_FILTERS[id] ?? TASK_FILTERS.premium;
  return MOCK_LLM_PROMPTS.filter((p) => types.includes(p.taskType)).map((p) => p.prompt);
}

export function getDailyBudgetCap(scenarioId: string): number {
  switch (scenarioId as PromptRouteScenarioId) {
    case "support":
      return 250;
    case "ide":
      return 800;
    case "analytics":
      return 400;
    case "premium":
      return 2000;
    default:
      return 500;
  }
}
