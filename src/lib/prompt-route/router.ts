import { getModel, estimateCost, BASELINE_MODEL_ID } from "./models";
import { createSeededRandom } from "./seeded-random";
import type {
  ClassificationResult,
  RouteDecision,
  RoutingPolicy,
  LLMModel,
} from "./types";

const ROUTER_OVERHEAD_MS = 12;

interface RouteOptions {
  policies: RoutingPolicy[];
  simulateRateLimit?: boolean;
  circuitBreakerOpen?: boolean;
  forceRateLimit?: boolean;
  forceFailoverSuccess?: boolean;
  seed?: number;
}

function pickPolicy(
  classification: ClassificationResult,
  policies: RoutingPolicy[]
): RoutingPolicy | null {
  const enabled = policies.filter((p) => p.enabled);
  const { taskType, estimatedInputTokens } = classification;

  const longContext = enabled.find(
    (p) => p.minTokens && estimatedInputTokens >= p.minTokens
  );
  if (longContext) return longContext;

  const byTask = enabled.find(
    (p) => p.taskTypes?.includes(taskType) && (!p.maxTokens || estimatedInputTokens <= p.maxTokens)
  );
  if (byTask) return byTask;

  const shortChat = enabled.find(
    (p) =>
      p.taskTypes?.includes("simple_chat") &&
      p.maxTokens &&
      estimatedInputTokens <= p.maxTokens
  );
  return shortChat ?? enabled[0] ?? null;
}

export function routeRequest(
  classification: ClassificationResult,
  options: RouteOptions
): RouteDecision {
  const rand = createSeededRandom(options.seed ?? Date.now());

  const jitter = (base: number, pct = 0.15) => {
    const delta = base * pct * (rand() * 2 - 1);
    return Math.max(50, Math.round(base + delta));
  };

  const shouldHitRateLimit = (model: LLMModel) => {
    if (options.forceRateLimit) return true;
    const pressure = 500 / model.rateLimitRpm;
    return rand() < Math.min(0.35, pressure * 0.08);
  };

  const policy =
    pickPolicy(classification, options.policies) ??
    ({
      id: "default",
      name: "Default",
      condition: "Fallback policy",
      primaryModelId: "gpt-4o-mini",
      fallbackModelId: "claude-haiku",
      enabled: true,
    } satisfies RoutingPolicy);

  const primaryModel = getModel(policy.primaryModelId);
  const fallbackModel = getModel(policy.fallbackModelId);
  const baselineModel = getModel(BASELINE_MODEL_ID);

  const { estimatedInputTokens, estimatedOutputTokens } = classification;
  const routerLatencyMs = ROUTER_OVERHEAD_MS + Math.floor(rand() * 8);

  let outcome: RouteDecision["outcome"] = "primary";
  let routedModel: LLMModel = primaryModel;
  let failoverReason: RouteDecision["failoverReason"];
  let rateLimitHit = false;

  if (options.circuitBreakerOpen) {
    outcome = "circuit_open";
    routedModel = fallbackModel;
    failoverReason = "circuit_breaker";
    rateLimitHit = true;
  } else if (options.simulateRateLimit !== false && shouldHitRateLimit(primaryModel)) {
    rateLimitHit = true;
    const recover = options.forceFailoverSuccess ?? rand() < 0.88;
    if (recover) {
      outcome = "fallback";
      routedModel = fallbackModel;
      failoverReason = rand() < 0.7 ? "rate_limit" : "timeout";
    } else {
      outcome = "primary";
      routedModel = primaryModel;
    }
  }

  const inferenceLatency = jitter(routedModel.avgLatencyMs);
  const failoverPenalty =
    outcome === "fallback" || outcome === "circuit_open" ? jitter(180, 0.25) : 0;
  const totalLatencyMs = routerLatencyMs + inferenceLatency + failoverPenalty;

  const costUsd = estimateCost(routedModel, estimatedInputTokens, estimatedOutputTokens);
  const baselineCostUsd = estimateCost(
    baselineModel,
    estimatedInputTokens,
    estimatedOutputTokens
  );

  return {
    policy,
    primaryModel,
    fallbackModel,
    outcome,
    routedModel,
    routerLatencyMs,
    totalLatencyMs,
    inputTokens: estimatedInputTokens,
    outputTokens: estimatedOutputTokens,
    costUsd,
    baselineCostUsd,
    failoverReason,
    rateLimitHit,
  };
}
