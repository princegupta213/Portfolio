export type ModelMode = "fast" | "accurate";

export interface VoiceFlowConfig {
  chunkSizeMs: number;
  modelMode: ModelMode;
}

export interface HopLatency {
  sttMs: number;
  translationMs: number;
  ttsMs: number;
  pipelineOverheadMs: number;
}

export interface LatencyResult extends HopLatency {
  endToEndMs: number;
  bleuScore: number;
  meetsLatencyTarget: boolean;
  meetsBleuGuardrail: boolean;
}

export interface TranslationEvent {
  id: string;
  timestamp: number;
  result: LatencyResult;
}
