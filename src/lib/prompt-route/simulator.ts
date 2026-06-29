import { classifyPrompt } from "./classifier";
import { DEFAULT_POLICIES } from "./policies";
import { routeRequest } from "./router";
import { hashString } from "./seeded-random";
import type { RoutingPolicy, SimulationResult, TaskComplexity } from "./types";

const TASK_LABELS: Record<TaskComplexity, string> = {
  simple_chat: "Simple Chat",
  summarization: "Summarization",
  code_gen: "Code Generation",
  complex_reasoning: "Complex Reasoning",
  data_extraction: "Data Extraction",
};

/** Precomputed seeds for sample batch — consistent demo metrics */
const SAMPLE_RATE_LIMIT_INDICES = new Set([2, 4, 6, 9]);

interface SimulateOptions {
  prompts: string[];
  policies?: RoutingPolicy[];
  seeded?: boolean;
  forceRateLimitDemo?: boolean;
  semanticCacheEnabled?: boolean;
}

export function runSimulation(options: SimulateOptions): SimulationResult {
  const policies = options.policies ?? DEFAULT_POLICIES;
  const seeded = options.seeded ?? false;
  const seenPrompts = new Set<string>();

  const requests = options.prompts.map((prompt, i) => {
    const classification = classifyPrompt(prompt);
    const seed = seeded ? hashString(`${prompt}:${i}`) : undefined;
    const forceRateLimit = seeded && SAMPLE_RATE_LIMIT_INDICES.has(i);

    const rawRoute = routeRequest(classification, {
      policies,
      simulateRateLimit: true,
      circuitBreakerOpen: options.forceRateLimitDemo && i === 2,
      forceRateLimit,
      forceFailoverSuccess: forceRateLimit ? true : undefined,
      seed,
    });

    const isCacheHit = !!options.semanticCacheEnabled && seenPrompts.has(prompt);
    seenPrompts.add(prompt);

    const route = isCacheHit
      ? {
          ...rawRoute,
          outcome: "cache_hit" as const,
          routedModel: {
            id: "cache",
            name: "Semantic Cache",
            provider: "Local",
            inputCostPer1M: 0,
            outputCostPer1M: 0,
            avgLatencyMs: 8,
            contextWindow: 0,
            rateLimitRpm: 0,
            strengths: [],
          },
          routerLatencyMs: 8,
          totalLatencyMs: 8,
          costUsd: 0,
          cacheHit: true,
        }
      : rawRoute;

    return {
      id: `req-${i + 1}`,
      prompt,
      classification,
      route,
    };
  });

  const totalBaseline = requests.reduce((s, r) => s + r.route.baselineCostUsd, 0);
  const totalRouted = requests.reduce((s, r) => s + r.route.costUsd, 0);
  const costSavingsPct =
    totalBaseline > 0 ? ((totalBaseline - totalRouted) / totalBaseline) * 100 : 0;

  const avgRouterOverheadMs =
    requests.reduce((s, r) => s + r.route.routerLatencyMs, 0) / requests.length;

  const avgTotalLatency =
    requests.reduce((s, r) => s + r.route.totalLatencyMs, 0) / requests.length;
  const avgBaselineLatency = 1350;
  const avgLatencyDeltaMs = avgTotalLatency - avgBaselineLatency;

  const failoverAttempts = requests.filter((r) => r.route.rateLimitHit && !r.route.cacheHit).length;
  const failoverSuccesses = requests.filter(
    (r) => (r.route.outcome === "fallback" || r.route.outcome === "circuit_open") && !r.route.cacheHit
  ).length;
  const failoverRecoveryRate =
    failoverAttempts > 0 ? (failoverSuccesses / failoverAttempts) * 100 : 100;

  const totalOutputTokens = requests.reduce((s, r) => s + r.route.outputTokens, 0);
  const totalInferenceMs = requests.reduce(
    (s, r) => s + (r.route.totalLatencyMs - r.route.routerLatencyMs),
    0
  );
  const avgTokensPerSecond =
    totalInferenceMs > 0 ? totalOutputTokens / (totalInferenceMs / 1000) : 0;

  const primaryCount = requests.filter((r) => r.route.outcome === "primary").length;
  const fallbackCount = requests.filter(
    (r) => r.route.outcome === "fallback" || r.route.outcome === "circuit_open"
  ).length;
  const cacheHits = requests.filter((r) => r.route.cacheHit).length;
  const cacheHitRate = requests.length > 0 ? (cacheHits / requests.length) * 100 : 0;
  const cachedCostSavedUsd = requests.reduce(
    (s, r) => s + (r.route.cacheHit ? r.route.baselineCostUsd : 0),
    0
  );

  const modelMap = new Map<
    string,
    { modelId: string; name: string; count: number; costUsd: number }
  >();
  for (const req of requests) {
    const id = req.route.routedModel.id;
    const existing = modelMap.get(id);
    if (existing) {
      existing.count += 1;
      existing.costUsd += req.route.costUsd;
    } else {
      modelMap.set(id, {
        modelId: id,
        name: req.route.routedModel.name,
        count: 1,
        costUsd: req.route.costUsd,
      });
    }
  }

  const taskMap = new Map<TaskComplexity, number>();
  for (const req of requests) {
    taskMap.set(req.classification.taskType, (taskMap.get(req.classification.taskType) ?? 0) + 1);
  }

  return {
    requests,
    simulatedAt: new Date().toISOString(),
    totalRequests: requests.length,
    metrics: {
      costSavingsPct,
      totalRoutedCostUsd: totalRouted,
      totalBaselineCostUsd: totalBaseline,
      avgLatencyDeltaMs,
      avgRouterOverheadMs,
      failoverRecoveryRate,
      failoverAttempts,
      failoverSuccesses,
      avgTokensPerSecond,
      primaryRoutePct: (primaryCount / requests.length) * 100,
      fallbackRoutePct: (fallbackCount / requests.length) * 100,
      cacheHits,
      cacheHitRate,
      cachedCostSavedUsd,
    },
    modelUsage: Array.from(modelMap.values()).sort((a, b) => b.count - a.count),
    taskBreakdown: Array.from(taskMap.entries()).map(([taskType, count]) => ({
      taskType,
      label: TASK_LABELS[taskType],
      count,
    })),
  };
}

export function simulateSinglePrompt(
  prompt: string,
  policies: RoutingPolicy[]
): SimulationResult {
  return runSimulation({ prompts: [prompt], policies, seeded: true });
}

export function simulateFailoverScenario(policies: RoutingPolicy[]): SimulationResult {
  const prompt =
    "Write a production-ready Python microservice with FastAPI, Redis caching, and OpenTelemetry tracing.";
  const classification = classifyPrompt(prompt);
  const route = routeRequest(classification, {
    policies,
    circuitBreakerOpen: true,
    seed: 42,
  });
  const req = { id: "failover-1", prompt, classification, route };
  return {
    requests: [req],
    simulatedAt: new Date().toISOString(),
    totalRequests: 1,
    metrics: {
      costSavingsPct:
        route.baselineCostUsd > 0
          ? ((route.baselineCostUsd - route.costUsd) / route.baselineCostUsd) * 100
          : 0,
      totalRoutedCostUsd: route.costUsd,
      totalBaselineCostUsd: route.baselineCostUsd,
      avgLatencyDeltaMs: route.totalLatencyMs - 1350,
      avgRouterOverheadMs: route.routerLatencyMs,
      failoverRecoveryRate: 100,
      failoverAttempts: 1,
      failoverSuccesses: 1,
      avgTokensPerSecond: route.outputTokens / ((route.totalLatencyMs - route.routerLatencyMs) / 1000),
      primaryRoutePct: 0,
      fallbackRoutePct: 100,
    },
    modelUsage: [
      {
        modelId: route.routedModel.id,
        name: route.routedModel.name,
        count: 1,
        costUsd: route.costUsd,
      },
    ],
    taskBreakdown: [
      { taskType: classification.taskType, label: classification.taskLabel, count: 1 },
    ],
  };
}
