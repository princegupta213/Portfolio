export type Sentiment = "positive" | "neutral" | "negative";
export type FeedbackType = "review" | "bug" | "feature";

export interface PersonaConfig {
  category: string;
  personaDescription: string;
  sentimentMix: { positive: number; neutral: number; negative: number };
}

export interface FeedbackItem {
  id: string;
  type: FeedbackType;
  sentiment: Sentiment;
  text: string;
  personaCompliance: number;
}

export interface GenerationResult {
  items: FeedbackItem[];
  personaComplianceScore: number;
  duplicateRate: number;
  generationTimeMs: number;
}
