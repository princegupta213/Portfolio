export const dataSynthCaseStudy = {
  title: "DataSynth",
  subtitle: "Synthetic Feedback Generator",
  timeline: "2026 · Growth PM portfolio project",
  role: "Growth PM & Builder",
  problem: {
    headline: "Zero user traffic blocks pre-launch model testing",
    body: "New product teams can't dry-run triaging models, keyword taggers, or routing workflows without realistic feedback data. Manual seed data is slow and doesn't match target personas.",
    stats: [
      { label: "Batch size", value: "50 items" },
      { label: "Compliance target", value: "> 85%" },
      { label: "Max duplicates", value: "< 3%" },
    ],
  },
  research: {
    headline: "What Growth PMs need before launch",
    findings: [
      "Persona fidelity matters more than volume — misaligned reviews break classifier evals.",
      "Sentiment mix must be configurable to stress-test routing rules.",
      "Export to CSV/JSON must be one-click for sandbox DB imports.",
      "Generation must complete in under 8 seconds or PMs abandon the tool.",
    ],
    method: "Synthesized from pre-launch ops workflows at early-stage SaaS teams and synthetic data best practices for ML eval sets.",
    researchDocHref: "/docs/data-synth-PRD",
  },
  solution: {
    headline: "What I built",
    features: [
      { name: "Persona Configurator", why: "Category picker, free-text persona, sentiment mix sliders" },
      { name: "Bulk Dataset Generator", why: "50 reviews, bugs, and feature requests with progress indicator" },
      { name: "Export Panel", why: "Clean CSV and JSON downloads for sandbox import" },
      { name: "Quality KPIs", why: "Persona compliance, duplicate rate, and generation time vs. targets" },
    ],
  },
  results: {
    headline: "Sample Fintech · overworked freelancers persona",
    summary: "Generated batches hit ~88% persona compliance with < 1% duplicate rate in under 3 seconds simulated time — passing both north star and guardrail metrics for pre-launch classifier dry-runs.",
    metrics: [
      { label: "Persona compliance", value: "~88%" },
      { label: "Duplicate rate", value: "< 1%" },
      { label: "Generation time", value: "~2.5 s" },
      { label: "Item types", value: "3" },
    ],
    sampleRoutes: [],
  },
  tradeoffs: {
    headline: "Key product decisions",
    decisions: [
      { decision: "Template + persona injection vs. live LLM API", rationale: "Portfolio demo runs offline; production would parallelize real LLM calls." },
      { decision: "Fixed batch of 50", rationale: "Matches PRD MVP scope and typical sandbox seed size." },
    ],
  },
  nextSteps: {
    headline: "Production roadmap",
    items: ["Wire parallel LLM API with persona prompt templates", "Human auditor loop for compliance scoring", "Duplicate detection via embedding similarity"],
  },
  links: { liveDemo: "/projects/data-synth", prd: "/docs/data-synth-PRD" },
};
