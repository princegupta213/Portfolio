import { THEME_DEFINITIONS } from "./themes";
import { analyzeSentiment, sentimentBreakdown, type SentimentLabel } from "./sentiment";
import type {
  AnalysisResult,
  FeedbackItem,
  ProductOpportunity,
  ThemeCluster,
} from "./types";

const OPPORTUNITY_TEMPLATES: Record<
  string,
  { title: string; problem: string; impact: string; baseImpact: number; baseEffort: number }
> = {
  performance: {
    title: "Improve app stability and performance",
    problem: "Users report crashes, lag, and reliability issues that block core workflows.",
    impact: "High — stability issues directly cause churn and 1-star reviews.",
    baseImpact: 9,
    baseEffort: 7,
  },
  "ui-ux": {
    title: "Redesign navigation and core flows",
    problem: "Users find the interface confusing or hard to navigate.",
    impact: "High — poor UX increases support tickets and reduces daily active use.",
    baseImpact: 8,
    baseEffort: 6,
  },
  auth: {
    title: "Streamline login and account recovery",
    problem: "Users struggle to sign in, reset passwords, or verify accounts.",
    impact: "Critical — auth friction blocks new user activation.",
    baseImpact: 9,
    baseEffort: 5,
  },
  notifications: {
    title: "Add granular notification controls",
    problem: "Users feel overwhelmed by notifications or can't customize alerts.",
    impact: "Medium — notification fatigue leads to opt-outs and uninstalls.",
    baseImpact: 6,
    baseEffort: 4,
  },
  search: {
    title: "Improve search relevance and filters",
    problem: "Users can't find what they need quickly.",
    impact: "High — search failure reduces task completion and retention.",
    baseImpact: 8,
    baseEffort: 5,
  },
  pricing: {
    title: "Clarify pricing and subscription value",
    problem: "Users are confused about plans, billing, or perceived value.",
    impact: "High — pricing confusion hurts conversion and increases refunds.",
    baseImpact: 8,
    baseEffort: 4,
  },
  support: {
    title: "Reduce support response time and self-serve help",
    problem: "Users can't get timely help when issues arise.",
    impact: "Medium — poor support erodes trust even when product works.",
    baseImpact: 7,
    baseEffort: 5,
  },
  features: {
    title: "Ship top-requested feature gaps",
    problem: "Users repeatedly request capabilities the product lacks.",
    impact: "Varies — depends on feature; often drives competitive switching.",
    baseImpact: 7,
    baseEffort: 6,
  },
  onboarding: {
    title: "Improve first-run onboarding experience",
    problem: "New users don't understand how to get value quickly.",
    impact: "High — weak onboarding hurts activation and day-7 retention.",
    baseImpact: 8,
    baseEffort: 5,
  },
  sync: {
    title: "Fix cross-device sync and data reliability",
    problem: "Users lose data or can't sync across devices.",
    impact: "Critical — data loss destroys trust and drives churn.",
    baseImpact: 9,
    baseEffort: 7,
  },
};

function matchThemes(text: string): string[] {
  const lower = text.toLowerCase();
  return THEME_DEFINITIONS.filter((theme) =>
    theme.keywords.some((kw) => lower.includes(kw))
  ).map((t) => t.id);
}

function computeConfidence(count: number, total: number, negativeRatio: number): number {
  const volumeScore = Math.min(10, Math.round((count / total) * 100));
  const sentimentBoost = Math.round(negativeRatio * 3);
  return Math.min(10, Math.max(1, volumeScore + sentimentBoost));
}

function computePriority(iceScore: number): ProductOpportunity["priority"] {
  if (iceScore >= 7) return "P0";
  if (iceScore >= 5) return "P1";
  if (iceScore >= 3) return "P2";
  return "P3";
}

function buildSummary(
  total: number,
  themes: ThemeCluster[],
  opportunities: ProductOpportunity[]
): string {
  const topTheme = themes[0]?.name ?? "General feedback";
  const topOpp = opportunities[0]?.title ?? "No clear opportunities";
  const negPct = themes.reduce((s, t) => s + t.sentiment.negative, 0);
  const negRatio = total > 0 ? Math.round((negPct / total) * 100) : 0;

  return `Analyzed ${total} reviews. ${negRatio}% express negative sentiment. The dominant theme is "${topTheme}". Top recommended initiative: "${topOpp}".`;
}

export function analyzeFeedback(items: FeedbackItem[]): AnalysisResult {
  const total = items.length;
  const sentiments: SentimentLabel[] = items.map((item) => analyzeSentiment(item.text));

  const themeMap = new Map<
    string,
    { items: FeedbackItem[]; sentiments: SentimentLabel[]; matchedKeywords: Set<string> }
  >();

  for (const theme of THEME_DEFINITIONS) {
    themeMap.set(theme.id, { items: [], sentiments: [], matchedKeywords: new Set() });
  }

  const unmatched: FeedbackItem[] = [];

  items.forEach((item, idx) => {
    const matched = matchThemes(item.text);
    const sentiment = sentiments[idx];

    if (matched.length === 0) {
      unmatched.push(item);
      return;
    }

    matched.forEach((themeId) => {
      const bucket = themeMap.get(themeId)!;
      bucket.items.push(item);
      bucket.sentiments.push(sentiment);

      const def = THEME_DEFINITIONS.find((t) => t.id === themeId)!;
      def.keywords.forEach((kw) => {
        if (item.text.toLowerCase().includes(kw)) bucket.matchedKeywords.add(kw);
      });
    });
  });

  const themes: ThemeCluster[] = THEME_DEFINITIONS.map((def) => {
    const bucket = themeMap.get(def.id)!;
    const count = bucket.items.length;
    const breakdown = sentimentBreakdown(bucket.sentiments);

    return {
      id: def.id,
      name: def.name,
      description: def.description,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      sentiment: breakdown,
      sampleQuotes: bucket.items.slice(0, 3).map((i) => i.text),
      keywords: Array.from(bucket.matchedKeywords).slice(0, 8),
    };
  })
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count);

  const opportunities: ProductOpportunity[] = themes.map((theme) => {
    const template = OPPORTUNITY_TEMPLATES[theme.id];
    const negativeRatio =
      theme.count > 0 ? theme.sentiment.negative / theme.count : 0;
    const confidence = computeConfidence(theme.count, total, negativeRatio);
    const impact = template?.baseImpact ?? 5;
    const effort = template?.baseEffort ?? 5;
    const iceScore = Math.round(((impact * confidence) / effort) * 10) / 10;

    return {
      id: `opp-${theme.id}`,
      title: template?.title ?? `Address ${theme.name} issues`,
      theme: theme.name,
      problemStatement: template?.problem ?? theme.description,
      userImpact: template?.impact ?? "Medium — recurring user pain in this area.",
      evidenceCount: theme.count,
      impact,
      confidence,
      effort,
      iceScore,
      priority: computePriority(iceScore),
      sampleFeedback: theme.sampleQuotes,
    };
  }).sort((a, b) => b.iceScore - a.iceScore);

  const topPainPoints = opportunities
    .slice(0, 5)
    .map((o) => o.problemStatement);

  return {
    totalReviews: total,
    analyzedAt: new Date().toISOString(),
    overallSentiment: sentimentBreakdown(sentiments),
    themes,
    opportunities,
    topPainPoints,
    summary: buildSummary(total, themes, opportunities),
  };
}

export function parseCSVRows(
  rows: Record<string, string>[],
  config: { textColumn: string; ratingColumn?: string; dateColumn?: string; sourceColumn?: string }
): FeedbackItem[] {
  return rows
    .filter((row) => row[config.textColumn]?.trim())
    .map((row, idx) => ({
      id: `row-${idx}`,
      text: row[config.textColumn].trim(),
      rating: config.ratingColumn ? parseFloat(row[config.ratingColumn]) || undefined : undefined,
      date: config.dateColumn ? row[config.dateColumn] : undefined,
      source: config.sourceColumn ? row[config.sourceColumn] : undefined,
    }));
}

export function detectColumns(headers: string[]): {
  textColumn: string;
  ratingColumn?: string;
  dateColumn?: string;
  sourceColumn?: string;
} {
  const lower = headers.map((h) => h.toLowerCase());

  const textCandidates = ["review", "feedback", "comment", "text", "body", "content", "message"];
  const ratingCandidates = ["rating", "score", "stars"];
  const dateCandidates = ["date", "created", "timestamp", "time"];
  const sourceCandidates = ["source", "platform", "channel"];

  const find = (candidates: string[]) => {
    const idx = lower.findIndex((h) => candidates.some((c) => h.includes(c)));
    return idx >= 0 ? headers[idx] : undefined;
  };

  const textColumn = find(textCandidates) ?? headers[0];

  return {
    textColumn,
    ratingColumn: find(ratingCandidates),
    dateColumn: find(dateCandidates),
    sourceColumn: find(sourceCandidates),
  };
}
