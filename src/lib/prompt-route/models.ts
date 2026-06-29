import type { LLMModel } from "./types";

export const BASELINE_MODEL_ID = "gpt-4o";

export const LLM_MODELS: LLMModel[] = [
  {
    id: "gemini-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    inputCostPer1M: 0.1,
    outputCostPer1M: 0.4,
    avgLatencyMs: 420,
    contextWindow: 1_000_000,
    rateLimitRpm: 2000,
    strengths: ["simple_chat", "summarization", "data_extraction"],
  },
  {
    id: "gemini-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    inputCostPer1M: 1.25,
    outputCostPer1M: 10.0,
    avgLatencyMs: 980,
    contextWindow: 1_000_000,
    rateLimitRpm: 150,
    strengths: ["code_gen", "complex_reasoning", "summarization"],
  },
  {
    id: "claude-haiku",
    name: "Claude Haiku 3.5",
    provider: "Anthropic",
    inputCostPer1M: 0.8,
    outputCostPer1M: 4.0,
    avgLatencyMs: 510,
    contextWindow: 200_000,
    rateLimitRpm: 4000,
    strengths: ["simple_chat", "data_extraction", "summarization"],
  },
  {
    id: "claude-sonnet",
    name: "Claude Sonnet 4",
    provider: "Anthropic",
    inputCostPer1M: 3.0,
    outputCostPer1M: 15.0,
    avgLatencyMs: 1100,
    contextWindow: 200_000,
    rateLimitRpm: 50,
    strengths: ["code_gen", "complex_reasoning"],
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o mini",
    provider: "OpenAI",
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.6,
    avgLatencyMs: 480,
    contextWindow: 128_000,
    rateLimitRpm: 3000,
    strengths: ["simple_chat", "summarization", "data_extraction"],
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    inputCostPer1M: 2.5,
    outputCostPer1M: 10.0,
    avgLatencyMs: 1350,
    contextWindow: 128_000,
    rateLimitRpm: 500,
    strengths: ["code_gen", "complex_reasoning", "summarization", "data_extraction"],
  },
];

export function getModel(id: string): LLMModel {
  const model = LLM_MODELS.find((m) => m.id === id);
  if (!model) throw new Error(`Unknown model: ${id}`);
  return model;
}

export function estimateCost(
  model: LLMModel,
  inputTokens: number,
  outputTokens: number
): number {
  return (
    (inputTokens / 1_000_000) * model.inputCostPer1M +
    (outputTokens / 1_000_000) * model.outputCostPer1M
  );
}
