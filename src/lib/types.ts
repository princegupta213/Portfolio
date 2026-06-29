export interface FeedbackItem {
  id: string;
  text: string;
  rating?: number;
  date?: string;
  source?: string;
}

export interface ThemeCluster {
  id: string;
  name: string;
  description: string;
  count: number;
  percentage: number;
  sentiment: SentimentBreakdown;
  sampleQuotes: string[];
  keywords: string[];
}

export interface SentimentBreakdown {
  positive: number;
  negative: number;
  neutral: number;
}

export interface ProductOpportunity {
  id: string;
  title: string;
  theme: string;
  problemStatement: string;
  userImpact: string;
  evidenceCount: number;
  impact: number;
  confidence: number;
  effort: number;
  iceScore: number;
  riceScore?: number;
  reach?: number;
  confidencePct?: number;
  priority: "P0" | "P1" | "P2" | "P3";
  sampleFeedback: string[];
}

export interface AnalysisResult {
  totalReviews: number;
  analyzedAt: string;
  overallSentiment: SentimentBreakdown;
  themes: ThemeCluster[];
  opportunities: ProductOpportunity[];
  topPainPoints: string[];
  summary: string;
}

export interface AnalysisConfig {
  textColumn: string;
  ratingColumn?: string;
  dateColumn?: string;
  sourceColumn?: string;
}
