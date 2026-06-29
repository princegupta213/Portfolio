import type { MockReview } from "@/data/mock/feedback-analyzer";
import { mockReviewsToCsvRows } from "@/data/mock/feedback-analyzer";

export type FeedbackScenarioId = "fintech" | "saas" | "consumer" | "marketplace";
export type StakeholderView = "pm" | "engineering";

export interface FeedbackScenario {
  id: FeedbackScenarioId;
  label: string;
  description: string;
  fileName: string;
  reviews: MockReview[];
}

/** Theme IDs visible per stakeholder lens (roadmap filter). */
export const STAKEHOLDER_THEME_FILTER: Record<StakeholderView, string[]> = {
  pm: ["pricing", "features", "ui-ux", "onboarding", "support"],
  engineering: ["performance", "auth", "sync", "search", "notifications"],
};

const FINTECH_REVIEWS: MockReview[] = [
  { review: "KYC verification failed twice — uploaded Aadhaar but system keeps rejecting.", rating: 1, date: "2025-02-01", source: "App Store" },
  { review: "UPI payments hang on processing screen. Money debited but order not confirmed.", rating: 1, date: "2025-02-02", source: "Google Play" },
  { review: "Can't trust this app with my bank details after the data breach news.", rating: 2, date: "2025-02-03", source: "App Store" },
  { review: "OTP login expired before I could paste the code. Very frustrating.", rating: 2, date: "2025-02-04", source: "Google Play" },
  { review: "Withdrawal to bank account took 5 days. Expected instant transfer.", rating: 2, date: "2025-02-05", source: "App Store" },
  { review: "PAN verification loop — keeps asking to re-upload same document.", rating: 1, date: "2025-02-06", source: "Google Play" },
  { review: "Transaction history missing last week's UPI payments. Sync broken.", rating: 2, date: "2025-02-07", source: "App Store" },
  { review: "Fees are hidden until checkout. Not transparent pricing.", rating: 2, date: "2025-02-08", source: "Google Play" },
  { review: "Customer support can't explain why my account was frozen.", rating: 1, date: "2025-02-09", source: "App Store" },
  { review: "Biometric login works great when it doesn't crash on launch.", rating: 3, date: "2025-02-10", source: "Google Play" },
  { review: "Need dark mode for late-night balance checks.", rating: 4, date: "2025-02-11", source: "App Store" },
  { review: "Please add export to CSV for tax filing.", rating: 4, date: "2025-02-12", source: "Google Play" },
];

const SAAS_REVIEWS: MockReview[] = [
  { review: "Slack integration broke after your API update. Webhooks failing silently.", rating: 1, date: "2025-02-01", source: "G2" },
  { review: "Admin console is confusing — can't find SSO settings.", rating: 2, date: "2025-02-02", source: "Capterra" },
  { review: "Dashboard was down for 2 hours yesterday. No status page update.", rating: 1, date: "2025-02-03", source: "G2" },
  { review: "Role permissions are too coarse. Need granular RBAC.", rating: 3, date: "2025-02-04", source: "Capterra" },
  { review: "Salesforce sync duplicates contacts every night.", rating: 2, date: "2025-02-05", source: "G2" },
  { review: "API rate limits too aggressive for enterprise tier.", rating: 2, date: "2025-02-06", source: "Capterra" },
  { review: "Onboarding wizard skipped our compliance checklist.", rating: 3, date: "2025-02-07", source: "G2" },
  { review: "Billing page shows wrong seat count vs actual usage.", rating: 2, date: "2025-02-08", source: "Capterra" },
  { review: "Support ticket auto-closed without resolution.", rating: 1, date: "2025-02-09", source: "G2" },
  { review: "Love the new analytics module — finally actionable insights.", rating: 5, date: "2025-02-10", source: "Capterra" },
  { review: "Need SCIM provisioning for Okta.", rating: 4, date: "2025-02-11", source: "G2" },
  { review: "Search across workspaces returns irrelevant results.", rating: 2, date: "2025-02-12", source: "Capterra" },
];

const CONSUMER_REVIEWS: MockReview[] = [
  { review: "App crashes every time I open settings. Unusable.", rating: 1, date: "2025-01-15", source: "App Store" },
  { review: "Love the clean design but search is broken.", rating: 3, date: "2025-01-16", source: "App Store" },
  { review: "Too slow on older phones — lag when scrolling feed.", rating: 2, date: "2025-01-17", source: "Google Play" },
  { review: "Premium plan isn't worth the price. Too expensive.", rating: 2, date: "2025-01-18", source: "App Store" },
  { review: "Please add dark mode! My eyes hurt at night.", rating: 4, date: "2025-01-19", source: "Google Play" },
  { review: "Navigation is confusing — hard to find my saved items.", rating: 2, date: "2025-01-20", source: "App Store" },
  { review: "Notifications spam me every hour. Need mute controls.", rating: 2, date: "2025-01-21", source: "Google Play" },
  { review: "Great app overall! Easy to use and fast.", rating: 5, date: "2025-01-22", source: "App Store" },
  { review: "First-run tutorial was too long. Just let me explore.", rating: 3, date: "2025-01-23", source: "Google Play" },
  { review: "Customer support took 5 days to respond.", rating: 1, date: "2025-01-24", source: "App Store" },
  { review: "Would love offline mode for commutes.", rating: 4, date: "2025-01-25", source: "Google Play" },
  { review: "Filters on browse page don't stick after refresh.", rating: 2, date: "2025-01-26", source: "App Store" },
];

const MARKETPLACE_REVIEWS: MockReview[] = [
  { review: "Buyer paid but seller never shipped. No refund option visible.", rating: 1, date: "2025-03-01", source: "App Store" },
  { review: "Seller dashboard crashes when uploading 10+ product photos.", rating: 2, date: "2025-03-02", source: "Google Play" },
  { review: "Commission fees unclear — different numbers at checkout vs listing.", rating: 2, date: "2025-03-03", source: "App Store" },
  { review: "Chat between buyer and seller doesn't notify in real time.", rating: 2, date: "2025-03-04", source: "Google Play" },
  { review: "Dispute resolution took 3 weeks. Lost the sale.", rating: 1, date: "2025-03-05", source: "App Store" },
  { review: "Can't filter listings by seller rating. Search is useless.", rating: 2, date: "2025-03-06", source: "Google Play" },
  { review: "Payout to seller bank delayed beyond promised 24h SLA.", rating: 2, date: "2025-03-07", source: "App Store" },
  { review: "Fake reviews on competitor listings — no report button.", rating: 2, date: "2025-03-08", source: "Google Play" },
  { review: "Login failed after switching from buyer to seller account.", rating: 2, date: "2025-03-09", source: "App Store" },
  { review: "Easy to list items — onboarding for sellers is smooth.", rating: 4, date: "2025-03-10", source: "Google Play" },
  { review: "Need bulk upload CSV for inventory management.", rating: 4, date: "2025-03-11", source: "App Store" },
  { review: "Delivery tracking sync lost between buyer and seller views.", rating: 2, date: "2025-03-12", source: "Google Play" },
];

export const FEEDBACK_SCENARIOS: FeedbackScenario[] = [
  {
    id: "fintech",
    label: "Fintech app",
    description: "Trust, KYC, payments themes",
    fileName: "fintech-app-reviews.csv",
    reviews: FINTECH_REVIEWS,
  },
  {
    id: "saas",
    label: "B2B SaaS",
    description: "Integrations, admin, uptime",
    fileName: "b2b-saas-reviews.csv",
    reviews: SAAS_REVIEWS,
  },
  {
    id: "consumer",
    label: "Consumer app",
    description: "UX, performance, pricing",
    fileName: "consumer-app-reviews.csv",
    reviews: CONSUMER_REVIEWS,
  },
  {
    id: "marketplace",
    label: "Marketplace",
    description: "Buyer/seller friction",
    fileName: "marketplace-reviews.csv",
    reviews: MARKETPLACE_REVIEWS,
  },
];

export function getFeedbackScenario(id: FeedbackScenarioId): FeedbackScenario {
  return FEEDBACK_SCENARIOS.find((s) => s.id === id) ?? FEEDBACK_SCENARIOS[0];
}

export function scenarioToCsvRows(id: FeedbackScenarioId): Record<string, string>[] {
  return mockReviewsToCsvRows(getFeedbackScenario(id).reviews);
}
