export const promptRouteCaseStudy = {
  title: "PromptRoute",
  subtitle: "Intelligent Multi-LLM Router & Cost Optimizer",
  timeline: "2026 · Platform PM portfolio project",
  role: "Platform PM & Builder",

  problem: {
    headline: "One model for everything is expensive and fragile",
    body: "Teams shipping GenAI features default to a single premium model (GPT-4o) for every request — simple FAQs, code generation, and summarization alike. That burns budget on trivial queries, adds latency on easy tasks, and still fails under rate limits when traffic spikes. Platform PMs need a routing layer with policy control, fallback logic, and cost visibility before production rollout.",
    stats: [
      { label: "Typical cost overpay vs. routed", value: "40–60%" },
      { label: "Models in catalog", value: "6" },
      { label: "Router overhead target", value: "< 25 ms" },
    ],
  },

  research: {
    headline: "What platform teams care about",
    findings: [
      "Cost is the #1 GenAI infra concern — but PMs can't optimize without per-task routing visibility.",
      "Rate limits (HTTP 429) are inevitable; failover success rate matters more than zero failures.",
      "Policy configurability (token thresholds, task types) must be PM-accessible, not eng-only.",
      "Latency delta from routing must stay negligible — sub-20 ms classification or users notice.",
    ],
    method: "Synthesized from platform engineering blogs (OpenAI, Anthropic rate limits), LLM routing papers, and Angel One LAMF infra constraints around API cost at scale.",
    researchDocHref: "/docs/prompt-route-PRD",
  },

  solution: {
    headline: "What I built",
    features: [
      { name: "Task Complexity Classifier", why: "Scores prompts as chat, summarization, code, reasoning, or extraction using keyword + token heuristics" },
      { name: "Dynamic Routing Table", why: "6 toggleable PM policies — token thresholds and task types map to primary/fallback model pairs" },
      { name: "Fallback & Circuit Breaker", why: "Simulates HTTP 429 and timeout → automatic redirect to secondary model with recovery tracking" },
      { name: "Cost & Latency Analyzer", why: "KPI dashboard: cost savings %, latency delta, failover recovery rate, tokens/sec vs. GPT-4o baseline" },
      { name: "Markdown export", why: "Route decision report for stakeholder reviews and interview prep" },
    ],
  },

  results: {
    headline: "Sample batch simulation (18 mixed prompts)",
    summary:
      "Routing an 18-prompt mixed workload through PromptRoute vs. a GPT-4o-only baseline yields ~48% cost savings with sub-20 ms router overhead. Failover resolves 85%+ of simulated rate-limit events. Simple chat and extraction tasks land on Flash/Haiku; code and reasoning route to Pro/Sonnet — matching the cost-capability curve platform teams want.",
    metrics: [
      { label: "Cost savings", value: "~48%" },
      { label: "Failover recovery", value: "> 85%" },
      { label: "Router overhead", value: "~15 ms" },
      { label: "Sample prompts", value: "18" },
    ],
    sampleRoutes: [
      { task: "Simple Chat", primary: "Gemini Flash", fallback: "Claude Haiku", outcome: "Primary" },
      { task: "Code Generation", primary: "Gemini Pro", fallback: "Claude Sonnet", outcome: "Fallback (429)" },
      { task: "Summarization", primary: "Gemini Flash", fallback: "GPT-4o mini", outcome: "Primary" },
      { task: "Complex Reasoning", primary: "Gemini Pro", fallback: "GPT-4o", outcome: "Primary" },
      { task: "Compliance summary", primary: "Gemini Flash", fallback: "GPT-4o mini", outcome: "Primary" },
      { task: "Cost modeling", primary: "Gemini Pro", fallback: "Claude Sonnet", outcome: "Primary" },
      { task: "Logistics parse", primary: "Gemini Flash", fallback: "Claude Haiku", outcome: "Fallback (429)" },
    ],
  },

  tradeoffs: {
    headline: "Key platform decisions",
    decisions: [
      {
        decision: "Heuristic classifier over embedding model for demo",
        rationale: "Zero API cost, instant results, explainable signals. Production would use fine-tuned classifier on request logs.",
      },
      {
        decision: "GPT-4o as cost baseline",
        rationale: "Represents the 'route everything to premium' anti-pattern most teams start with — makes savings tangible.",
      },
      {
        decision: "Client-side simulation only",
        rationale: "Portfolio demo without API keys. Tradeoff: no live inference, but full routing logic and metrics are real.",
      },
      {
        decision: "Policy toggle vs. full CRUD editor",
        rationale: "Toggle + model swap covers PM interview narrative. Full policy editor planned for v2.",
      },
    ],
  },

  nextSteps: {
    headline: "Production roadmap",
    items: [
      "OpenAI-compatible proxy middleware for real request interception",
      "Embedding classifier trained on production request logs",
      "Per-tenant policy CRUD with audit trail and A/B routing",
      "Live circuit breaker from provider health checks + Datadog dashboards",
    ],
  },

  links: {
    liveDemo: "/projects/prompt-route",
    prd: "/docs/prompt-route-PRD",
    caseStudy: "/projects/prompt-route/case-study",
  },

  screenshotSrc: null as string | null,
};
