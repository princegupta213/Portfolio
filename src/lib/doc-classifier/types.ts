export interface DocumentItem {
  id: string;
  name: string;
  text: string;
}

export interface DocCategory {
  id: string;
  name: string;
  description: string;
  examples: string[];
  routing: string;
  useCase: string;
}

export interface ClassificationResult {
  id: string;
  documentName: string;
  category: DocCategory;
  confidence: number;
  confidenceBucket: "high" | "medium" | "unknown";
  matchedKeywords: string[];
  topScores: { label: string; score: number }[];
  rationale: string;
  preview: string;
}

export interface RoutingQueueItem {
  category: string;
  routing: string;
  count: number;
}

export interface BatchClassificationResult {
  totalDocuments: number;
  classifiedAt: string;
  results: ClassificationResult[];
  summary: Record<string, number>;
  categoryBreakdown: { category: string; count: number; id: string }[];
  routingQueue: RoutingQueueItem[];
  avgConfidence: number;
  highConfidenceCount: number;
}

export type ClassifierMode = "batch" | "paste" | "full";
