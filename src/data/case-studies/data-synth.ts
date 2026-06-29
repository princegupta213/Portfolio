export const dataSynthCaseStudy = {
  title: "DataSynth",
  subtitle: "Synthetic Feedback Generator",
  timeline: "2026 · Growth PM portfolio project",
  role: "Growth PM & Builder",
  problem: {
    headline: "Zero user traffic blocks pre-launch model testing",
    body: "New product teams can't dry-run triaging models, keyword taggers, or routing workflows without realistic feedback data. Manual seed data is slow, doesn't match target personas, and fails compliance reviews when sentiment mix is wrong.",
    stats: [
      { label: "Batch sizes", value: "50–250" },
      { label: "Compliance target", value: "> 85%" },
      { label: "Max duplicates", value: "< 3%" },
      { label: "Enterprise scenarios", value: "6" },
    ],
  },
  research: {
    headline: "What Growth PMs need before launch",
    findings: [
      "Persona fidelity matters more than volume — misaligned reviews break classifier evals.",
      "Sentiment mix must be configurable to stress-test routing rules and escalation paths.",
      "Export to CSV/JSON must be one-click for sandbox DB imports and QA spreadsheets.",
      "Generation must complete in under 8 seconds or PMs abandon the tool mid-sprint.",
      "Ops teams need audit logs when personas or batch sizes change for reproducibility.",
    ],
    method: "Synthesized from pre-launch ops workflows at early-stage SaaS teams and synthetic data best practices for ML eval sets.",
    researchDocHref: "/docs/data-synth-PRD",
  },
  solution: {
    headline: "What I built",
    features: [
      { name: "Persona Configurator", why: "6 enterprise scenarios — Fintech, HealthTech, E-commerce, B2B CRM, churn, support — with sentiment sliders" },
      { name: "Bulk Dataset Generator", why: "50/100/250 reviews, bugs, and feature requests with progress indicator and RBAC role preview" },
      { name: "Export Panel", why: "Clean CSV and JSON downloads for sandbox import (Admin role)" },
      { name: "Quality KPIs", why: "Persona compliance, duplicate rate, generation time vs. targets — visible to Analyst role" },
      { name: "Audit trail", why: "Ops role sees scenario changes, generation events, and export actions" },
    ],
  },
  results: {
    headline: "Churn post-mortem · B2B CRM persona (100-item batch)",
    summary: "A 100-item churn scenario batch hit ~91% persona compliance with < 0.5% duplicate rate in under 4 seconds — passing north star and guardrail metrics. Negative-heavy mix (65%) surfaced realistic escalation language for routing rule dry-runs without production traffic.",
    metrics: [
      { label: "Persona compliance", value: "~91%" },
      { label: "Duplicate rate", value: "< 0.5%" },
      { label: "Generation time", value: "~3.8 s" },
      { label: "Scenarios available", value: "6" },
    ],
    sampleOutcomes: [
      { scenario: "Pre-launch QA", batch: 50, compliance: "~88%", duplicates: "< 1%" },
      { scenario: "Churn post-mortem", batch: 100, compliance: "~91%", duplicates: "< 0.5%" },
      { scenario: "Festive sale QA", batch: 250, compliance: "~86%", duplicates: "~1.2%" },
      { scenario: "HealthTech pilot", batch: 50, compliance: "~89%", duplicates: "< 1%" },
    ],
  },
  tradeoffs: {
    headline: "Key product decisions",
    decisions: [
      { decision: "Template + persona injection vs. live LLM API", rationale: "Portfolio demo runs offline; production would parallelize real LLM calls with cost caps." },
      { decision: "Configurable batch sizes (50/100/250)", rationale: "Matches PRD MVP and typical sandbox sizes — 250 stresses classifier throughput." },
      { decision: "RBAC role preview in demo shell", rationale: "Shows enterprise buyers how Ops vs Analyst vs Viewer lenses map to audit logs and KPIs." },
      { decision: "Keyword persona compliance scoring", rationale: "Transparent heuristic for interviews; production would use human auditor loop + embedding similarity." },
    ],
  },
  nextSteps: {
    headline: "Production roadmap",
    items: [
      "Wire parallel LLM API with persona prompt templates",
      "Human auditor loop for compliance scoring",
      "Duplicate detection via embedding similarity",
      "Tenant-scoped persona libraries with version history",
    ],
  },
  links: {
    liveDemo: "/projects/data-synth",
    prd: "/docs/data-synth-PRD",
    caseStudy: "/projects/data-synth/case-study",
  },
  screenshotSrc: null as string | null,
};
