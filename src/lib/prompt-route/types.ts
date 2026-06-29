export type TaskComplexity =
  | "simple_chat"
  | "summarization"
  | "code_gen"
  | "complex_reasoning"
  | "data_extraction";

export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  inputCostPer1M: number;
  outputCostPer1M: number;
  avgLatencyMs: number;
  contextWindow: number;
  rateLimitRpm: number;
  strengths: TaskComplexity[];
}

export interface RoutingPolicy {
  id: string;
  name: string;
  condition: string;
  maxTokens?: number;
  minTokens?: number;
  taskTypes?: TaskComplexity[];
  primaryModelId: string;
  fallbackModelId: string;
  enabled: boolean;
}

export interface ClassificationResult {
  taskType: TaskComplexity;
  taskLabel: string;
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  confidence: number;
  signals: string[];
}

export type RouteOutcome = "primary" | "fallback" | "circuit_open";

export interface RouteDecision {
  policy: RoutingPolicy;
  primaryModel: LLMModel;
  fallbackModel: LLMModel;
  outcome: RouteOutcome;
  routedModel: LLMModel;
  routerLatencyMs: number;
  totalLatencyMs: number;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  baselineCostUsd: number;
  failoverReason?: "rate_limit" | "timeout" | "circuit_breaker";
  rateLimitHit: boolean;
}

export interface SimulatedRequest {
  id: string;
  prompt: string;
  classification: ClassificationResult;
  route: RouteDecision;
}

export interface SimulationResult {
  requests: SimulatedRequest[];
  simulatedAt: string;
  totalRequests: number;
  metrics: {
    costSavingsPct: number;
    totalRoutedCostUsd: number;
    totalBaselineCostUsd: number;
    avgLatencyDeltaMs: number;
    avgRouterOverheadMs: number;
    failoverRecoveryRate: number;
    failoverAttempts: number;
    failoverSuccesses: number;
    avgTokensPerSecond: number;
    primaryRoutePct: number;
    fallbackRoutePct: number;
  };
  modelUsage: { modelId: string; name: string; count: number; costUsd: number }[];
  taskBreakdown: { taskType: TaskComplexity; label: string; count: number }[];
}

export type PromptRouteTab = "simulate" | "policies" | "classifier" | "failover";

export interface ClassificationScore {
  taskType: TaskComplexity;
  label: string;
  score: number;
}
