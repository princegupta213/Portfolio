import type { HopLatency, LatencyResult, ModelMode, VoiceFlowConfig } from "./types";

const LATENCY_TARGET_MS = 800;
const BLEU_GUARDRAIL = 72;

/** Base hop times at 500ms chunks with fast models */
const BASE_FAST: HopLatency = {
  sttMs: 180,
  translationMs: 120,
  ttsMs: 150,
  pipelineOverheadMs: 40,
};

const BASE_ACCURATE: HopLatency = {
  sttMs: 420,
  translationMs: 280,
  ttsMs: 310,
  pipelineOverheadMs: 55,
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Smaller chunks = lower per-hop latency but worse context → lower BLEU */
function chunkLatencyFactor(chunkSizeMs: number): number {
  const normalized = (chunkSizeMs - 200) / 800;
  return 0.55 + normalized * 0.9;
}

function chunkBleuBonus(chunkSizeMs: number): number {
  const normalized = (chunkSizeMs - 200) / 800;
  return normalized * 14;
}

function modelBleuBonus(mode: ModelMode): number {
  return mode === "accurate" ? 12 : 0;
}

function jitter(seed: number, range: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return (x - Math.floor(x) - 0.5) * range;
}

export function computeLatency(
  config: VoiceFlowConfig,
  tick = 0
): LatencyResult {
  const base = config.modelMode === "fast" ? BASE_FAST : BASE_ACCURATE;
  const factor = chunkLatencyFactor(config.chunkSizeMs);
  const noise = jitter(tick + config.chunkSizeMs, 18);

  const sttMs = Math.round(base.sttMs * factor + noise * 0.6);
  const translationMs = Math.round(base.translationMs * factor + noise * 0.4);
  const ttsMs = Math.round(base.ttsMs * factor + noise * 0.5);
  const pipelineOverheadMs = Math.round(base.pipelineOverheadMs + noise * 0.2);

  const endToEndMs = sttMs + translationMs + ttsMs + pipelineOverheadMs;

  const baseBleu =
    config.modelMode === "fast" ? 68 : 76;
  const bleuScore = clamp(
    Math.round((baseBleu + chunkBleuBonus(config.chunkSizeMs) + modelBleuBonus(config.modelMode) + jitter(tick, 3)) * 10) / 10,
    58,
    92
  );

  return {
    sttMs,
    translationMs,
    ttsMs,
    pipelineOverheadMs,
    endToEndMs,
    bleuScore,
    meetsLatencyTarget: endToEndMs < LATENCY_TARGET_MS,
    meetsBleuGuardrail: bleuScore > BLEU_GUARDRAIL,
  };
}

export const LATENCY_TARGETS = {
  endToEndMs: LATENCY_TARGET_MS,
  bleuMin: BLEU_GUARDRAIL,
  refreshMs: 50,
  conversationalBreakMs: 1200,
} as const;

export const MODEL_LABELS: Record<ModelMode, { stt: string; translation: string; tts: string }> = {
  fast: {
    stt: "Whisper-Tiny",
    translation: "M2M-100 Small",
    tts: "FastSpeech Lite",
  },
  accurate: {
    stt: "Whisper-Large",
    translation: "NLLB-200",
    tts: "Neural TTS Pro",
  },
};
