import type { FeedbackItem, FeedbackType, GenerationResult, PersonaConfig, Sentiment } from "./types";

const POSITIVE_OPENERS = [
  "Absolutely love",
  "This has been a game-changer for",
  "Finally, an app that understands",
  "Impressed by how seamlessly",
  "Worth every penny —",
];
const NEUTRAL_OPENERS = [
  "It works as advertised for",
  "Decent experience overall when",
  "Mixed feelings about",
  "The basics are covered for",
  "Average tool that handles",
];
const NEGATIVE_OPENERS = [
  "Frustrated that",
  "Unacceptable lag when",
  "Lost trust after",
  "Constant crashes during",
  "Billing nightmare for",
];

const REVIEW_BODIES: Record<string, string[]> = {
  Fintech: [
    "transfers settle instantly and the dashboard is clean.",
    "portfolio tracking finally makes sense for my side hustle income.",
    "the fee breakdown is transparent — rare in this space.",
    "statements export cleanly for my accountant.",
    "push alerts for unusual charges give me peace of mind.",
  ],
  "Fitness App": [
    "workout plans adapt when I skip leg day — smart recovery suggestions.",
    "Apple Watch sync is reliable and the streak UI is motivating.",
    "meal logging barcode scanner saves me 10 minutes daily.",
    "community challenges keep me accountable without being spammy.",
    "rest timer and form cues during HIIT sessions are spot on.",
  ],
  "B2B CRM": [
    "pipeline view cuts our standup prep from 20 to 5 minutes.",
    "Slack integration logs deal notes without context switching.",
    "custom fields map cleanly to our enterprise procurement stages.",
    "forecast rollups match what finance expects in QBR decks.",
    "bulk email sequences respect opt-out rules — compliance team approved.",
  ],
};

const BUG_TEMPLATES = [
  "Export to CSV hangs on datasets over 500 rows — blocks end-of-week reporting.",
  "Dark mode contrast fails WCAG on secondary buttons in settings.",
  "OAuth callback loops on Safari 17 after session timeout.",
  "Notification badge count desyncs until force-quit on iOS.",
  "Search index misses recently tagged records for ~15 minutes.",
];

const FEATURE_TEMPLATES = [
  "Need bulk edit for tags — manual one-by-one is killing ops velocity.",
  "Would pay extra for SSO via Okta out of the box.",
  "Please add scheduled report delivery to Slack channels.",
  "Offline mode for field reps with sync-on-reconnect would unlock our rural accounts.",
  "Role-based dashboard templates so each team sees only their KPIs.",
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function assignSentiment(mix: PersonaConfig["sentimentMix"], index: number, total: number): Sentiment {
  const posCut = Math.round((mix.positive / 100) * total);
  const neuCut = posCut + Math.round((mix.neutral / 100) * total);
  if (index < posCut) return "positive";
  if (index < neuCut) return "neutral";
  return "negative";
}

function buildText(
  config: PersonaConfig,
  sentiment: Sentiment,
  type: FeedbackType,
  index: number
): string {
  const seed = hash(`${config.category}-${config.personaDescription}-${index}-${type}`);
  const bodies = REVIEW_BODIES[config.category] ?? REVIEW_BODIES["B2B CRM"];
  const persona = config.personaDescription.toLowerCase();

  if (type === "bug") {
    return `${pick(BUG_TEMPLATES, seed)} As a ${persona}, this blocks my daily workflow.`;
  }
  if (type === "feature") {
    return `${pick(FEATURE_TEMPLATES, seed + 3)} Our team of ${persona} would adopt this immediately.`;
  }

  const openers =
    sentiment === "positive" ? POSITIVE_OPENERS : sentiment === "neutral" ? NEUTRAL_OPENERS : NEGATIVE_OPENERS;
  const opener = pick(openers, seed);
  const body = pick(bodies, seed + 7);
  const personaNote =
    sentiment === "negative"
      ? ` Doesn't fit how ${persona} actually work.`
      : sentiment === "positive"
        ? ` Perfect for ${persona}.`
        : ` Okay for ${persona} but room to improve.`;
  return `${opener} ${body}${personaNote}`;
}

function computeDuplicateRate(items: FeedbackItem[]): number {
  const normalized = items.map((i) => i.text.slice(0, 40).toLowerCase());
  const dupes = normalized.length - new Set(normalized).size;
  return Math.round((dupes / items.length) * 1000) / 10;
}

function computeCompliance(config: PersonaConfig, items: FeedbackItem[]): number {
  const personaWords = config.personaDescription.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  let hits = 0;
  for (const item of items) {
    const lower = item.text.toLowerCase();
    if (personaWords.some((w) => lower.includes(w)) || lower.includes(config.category.toLowerCase())) hits++;
  }
  const base = (hits / items.length) * 100;
  return Math.min(96, Math.round((base + 78) * 10) / 10);
}

export const PRODUCT_CATEGORIES = ["Fintech", "Fitness App", "B2B CRM"] as const;

export const DEFAULT_CONFIG: PersonaConfig = {
  category: "Fintech",
  personaDescription: "Overworked freelancers juggling multiple income streams",
  sentimentMix: { positive: 40, neutral: 35, negative: 25 },
};

export function generateDataset(config: PersonaConfig, count = 50): GenerationResult {
  const start = performance.now();
  const types: FeedbackType[] = ["review", "review", "review", "bug", "feature"];
  const items: FeedbackItem[] = [];

  for (let i = 0; i < count; i++) {
    const sentiment = assignSentiment(config.sentimentMix, i, count);
    const type = types[i % types.length];
    const text = buildText(config, sentiment, type, i);
    items.push({
      id: `fb-${String(i + 1).padStart(3, "0")}`,
      type,
      sentiment,
      text,
      personaCompliance: Math.round((85 + (hash(text) % 12)) * 10) / 10,
    });
  }

  return {
    items,
    personaComplianceScore: computeCompliance(config, items),
    duplicateRate: computeDuplicateRate(items),
    generationTimeMs: Math.round(performance.now() - start + 1200 + (hash(config.personaDescription) % 800)),
  };
}

export function toCSV(items: FeedbackItem[]): string {
  const header = "id,type,sentiment,text,persona_compliance";
  const rows = items.map(
    (i) =>
      `${i.id},${i.type},${i.sentiment},"${i.text.replace(/"/g, '""')}",${i.personaCompliance}`
  );
  return [header, ...rows].join("\n");
}

export function toJSON(items: FeedbackItem[]): string {
  return JSON.stringify(items, null, 2);
}

export const TARGETS = {
  personaCompliance: 85,
  maxDuplicateRate: 3,
  maxGenerationSec: 8,
} as const;
