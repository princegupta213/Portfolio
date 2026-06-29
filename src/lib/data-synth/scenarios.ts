import type { PersonaConfig } from "./types";

/** Enterprise scenario presets keyed by ENTERPRISE_SCENARIOS id */
export const DATA_SYNTH_SCENARIO_CONFIGS: Record<string, PersonaConfig> = {
  prelaunch: {
    category: "Fintech",
    personaDescription: "Early adopters testing sandbox flows before GA launch",
    sentimentMix: { positive: 35, neutral: 40, negative: 25 },
  },
  churn: {
    category: "B2B CRM",
    personaDescription: "At-risk power users evaluating competitor alternatives",
    sentimentMix: { positive: 10, neutral: 25, negative: 65 },
  },
  enterprise: {
    category: "B2B CRM",
    personaDescription: "Enterprise admin with SSO, audit logs, and compliance requirements",
    sentimentMix: { positive: 30, neutral: 45, negative: 25 },
  },
  support: {
    category: "Fitness App",
    personaDescription: "Support agents triaging bug reports and neutral how-to questions",
    sentimentMix: { positive: 15, neutral: 50, negative: 35 },
  },
  healthcare: {
    category: "HealthTech",
    personaDescription: "Chronic-care patients tracking vitals and medication adherence",
    sentimentMix: { positive: 25, neutral: 40, negative: 35 },
  },
  ecommerce: {
    category: "E-commerce",
    personaDescription: "Price-sensitive shoppers comparing deals during festival sales",
    sentimentMix: { positive: 20, neutral: 30, negative: 50 },
  },
  onboarding: {
    category: "B2B CRM",
    personaDescription: "New hires learning admin workflows during first-week onboarding",
    sentimentMix: { positive: 40, neutral: 45, negative: 15 },
  },
};
