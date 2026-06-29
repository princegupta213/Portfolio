export type ProjectThemeId =
  | "data-synth"
  | "surge-sim"
  | "claim-resolve"
  | "prompt-route"
  | "feedback-analyzer"
  | "doc-classifier";

export interface ProjectTheme {
  id: ProjectThemeId;
  label: string;
  domain: string;
  badge: string;
  badgeText: string;
  headline: string;
  description: string;
  heroGradient: string;
  accent: string;
  accentMuted: string;
  ring: string;
  tabActive: string;
  pill: string;
  statHighlight: string;
  statWarn: string;
}

export const PROJECT_THEMES: Record<ProjectThemeId, ProjectTheme> = {
  "data-synth": {
    id: "data-synth",
    label: "DataSynth",
    domain: "Growth PM · Synthetic Data",
    badge: "bg-teal-50 ring-teal-200",
    badgeText: "text-teal-800",
    headline: "DataSynth",
    description:
      "Enterprise synthetic feedback lab — configure personas, sentiment mix, and compliance guardrails, then bulk-generate reviews for sandbox QA before launch.",
    heroGradient: "from-teal-50 via-white to-emerald-50/40",
    accent: "text-teal-700",
    accentMuted: "bg-teal-600 hover:bg-teal-700",
    ring: "ring-teal-500",
    tabActive: "bg-teal-600 text-white shadow-sm",
    pill: "bg-teal-50 text-teal-800 ring-teal-100",
    statHighlight: "border-teal-200 bg-teal-50 text-teal-800",
    statWarn: "border-amber-200 bg-amber-50 text-amber-800",
  },
  "surge-sim": {
    id: "surge-sim",
    label: "SurgeSim",
    domain: "Marketplace PM · Dynamic Pricing",
    badge: "bg-orange-50 ring-orange-200",
    badgeText: "text-orange-900",
    headline: "SurgeSim",
    description:
      "City-wide supply/demand control tower — simulate weather shocks, surge caps, and zone-level match rate vs. checkout abandonment in real time.",
    heroGradient: "from-orange-50 via-white to-amber-50/50",
    accent: "text-orange-800",
    accentMuted: "bg-orange-600 hover:bg-orange-700",
    ring: "ring-orange-500",
    tabActive: "bg-orange-600 text-white shadow-sm",
    pill: "bg-orange-50 text-orange-900 ring-orange-100",
    statHighlight: "border-orange-200 bg-orange-50 text-orange-900",
    statWarn: "border-red-200 bg-red-50 text-red-800",
  },
  "claim-resolve": {
    id: "claim-resolve",
    label: "ClaimResolve",
    domain: "Fintech · Customer Operations",
    badge: "bg-emerald-50 ring-emerald-200",
    badgeText: "text-emerald-800",
    headline: "ClaimResolve",
    description:
      "Automated refund triage for ops teams — policy engine, audit trail, SLA tracking, and guardrail metrics at enterprise scale.",
    heroGradient: "from-emerald-50 via-white to-teal-50/30",
    accent: "text-emerald-700",
    accentMuted: "bg-emerald-600 hover:bg-emerald-700",
    ring: "ring-emerald-500",
    tabActive: "bg-emerald-600 text-white shadow-sm",
    pill: "bg-emerald-50 text-emerald-800 ring-emerald-100",
    statHighlight: "border-emerald-200 bg-emerald-50 text-emerald-800",
    statWarn: "border-red-200 bg-red-50 text-red-800",
  },
  "prompt-route": {
    id: "prompt-route",
    label: "PromptRoute",
    domain: "Platform PM · LLM Infrastructure",
    badge: "bg-indigo-50 ring-indigo-200",
    badgeText: "text-indigo-800",
    headline: "PromptRoute",
    description:
      "Multi-model routing control plane — classify workloads, enforce budget caps, simulate failover, and quantify cost savings vs. premium-only baselines.",
    heroGradient: "from-indigo-50 via-white to-violet-50/40",
    accent: "text-indigo-700",
    accentMuted: "bg-indigo-600 hover:bg-indigo-700",
    ring: "ring-indigo-500",
    tabActive: "bg-indigo-600 text-white shadow-sm",
    pill: "bg-indigo-50 text-indigo-800 ring-indigo-100",
    statHighlight: "border-indigo-200 bg-indigo-50 text-indigo-800",
    statWarn: "border-amber-200 bg-amber-50 text-amber-800",
  },
  "feedback-analyzer": {
    id: "feedback-analyzer",
    label: "AI Product Feedback Analyzer",
    domain: "Product Strategy · User Research",
    badge: "bg-violet-50 ring-violet-200",
    badgeText: "text-violet-800",
    headline: "AI Product Feedback Analyzer",
    description:
      "Voice-of-customer command center — cluster reviews by theme, score sentiment, and output ICE-prioritized roadmaps for cross-functional stakeholders.",
    heroGradient: "from-violet-50 via-white to-indigo-50/40",
    accent: "text-violet-700",
    accentMuted: "bg-violet-600 hover:bg-violet-700",
    ring: "ring-violet-500",
    tabActive: "bg-violet-600 text-white shadow-sm",
    pill: "bg-violet-50 text-violet-800 ring-violet-100",
    statHighlight: "border-violet-200 bg-violet-50 text-violet-800",
    statWarn: "border-amber-200 bg-amber-50 text-amber-800",
  },
  "doc-classifier": {
    id: "doc-classifier",
    label: "AI Document Classifier",
    domain: "Fintech · KYC & Onboarding",
    badge: "bg-cyan-50 ring-cyan-200",
    badgeText: "text-cyan-900",
    headline: "AI Document Classifier",
    description:
      "Document intelligence for onboarding ops — classify invoices, bank statements, IDs, and tax forms into SLA-backed routing queues with audit logs.",
    heroGradient: "from-cyan-50 via-white to-emerald-50/30",
    accent: "text-cyan-800",
    accentMuted: "bg-cyan-600 hover:bg-cyan-700",
    ring: "ring-cyan-500",
    tabActive: "bg-cyan-600 text-white shadow-sm",
    pill: "bg-cyan-50 text-cyan-900 ring-cyan-100",
    statHighlight: "border-cyan-200 bg-cyan-50 text-cyan-900",
    statWarn: "border-amber-200 bg-amber-50 text-amber-800",
  },
};

export interface EnterpriseScenario {
  id: string;
  label: string;
  description: string;
}

export const ENTERPRISE_SCENARIOS: Partial<Record<ProjectThemeId, EnterpriseScenario[]>> = {
  "data-synth": [
    { id: "prelaunch", label: "Pre-launch QA", description: "Balanced sentiment for classifier dry-runs" },
    { id: "churn", label: "Churn post-mortem", description: "Heavy negative + feature requests" },
    { id: "enterprise", label: "Enterprise beta", description: "Power-user persona, compliance focus" },
    { id: "support", label: "Support sandbox", description: "Bug reports + neutral how-to questions" },
    { id: "healthcare", label: "HealthTech pilot", description: "Patient adherence + care-plan feedback" },
    { id: "ecommerce", label: "Festive sale QA", description: "Price-sensitive shopper complaints" },
  ],
  "surge-sim": [
    { id: "rush-hour", label: "Friday rush hour", description: "High demand, moderate supply" },
    { id: "storm", label: "Storm surge", description: "Weather shock + demand spike" },
    { id: "stadium", label: "Stadium event", description: "Localized hotspot, supply drain" },
    { id: "airport", label: "Airport pickup", description: "Sustained imbalance, cap test" },
    { id: "downtown", label: "Downtown nightlife", description: "Late-night demand spike" },
    { id: "holiday", label: "Holiday surge", description: "Peak travel weekend" },
  ],
  "claim-resolve": [
    { id: "standard", label: "Standard ops", description: "Default policy thresholds" },
    { id: "strict", label: "Strict fraud mode", description: "Lower caps, tighter repeat limits" },
    { id: "holiday", label: "Holiday volume", description: "Higher auto-approve cap" },
    { id: "enterprise", label: "Enterprise SLA", description: "Fast-track under $100" },
  ],
  "prompt-route": [
    { id: "support", label: "Support bot", description: "Chat-heavy, cost-sensitive" },
    { id: "ide", label: "Developer IDE", description: "Code gen + reasoning mix" },
    { id: "analytics", label: "Analytics pipeline", description: "Extraction + summarization" },
    { id: "premium", label: "Premium tier", description: "Quality-first routing" },
  ],
  "feedback-analyzer": [
    { id: "fintech", label: "Fintech app", description: "Trust, KYC, payments themes" },
    { id: "saas", label: "B2B SaaS", description: "Integrations, admin, uptime" },
    { id: "consumer", label: "Consumer app", description: "UX, performance, pricing" },
    { id: "marketplace", label: "Marketplace", description: "Buyer/seller friction" },
  ],
  "doc-classifier": [
    { id: "kyc-retail", label: "Retail KYC", description: "ID + bank statement mix" },
    { id: "sme-lending", label: "SME lending", description: "Invoices + ITR heavy" },
    { id: "hiring", label: "HR onboarding", description: "CV + ID verification" },
    { id: "compliance", label: "Compliance audit", description: "Mixed doc types, SLA strict" },
  ],
};
