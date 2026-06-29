export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  href?: string;
  caseStudyHref?: string;
  docsHref?: string;
  featured: boolean;
  accent?: "indigo" | "emerald";
  metrics?: { label: string; value: string }[];
  role: string;
  timeline: string;
}

export const projects: Project[] = [
  {
    id: "data-synth",
    title: "DataSynth",
    subtitle: "Synthetic Feedback Generator",
    description:
      "Growth PM tool: configure product category, target persona, and sentiment mix, then generate 50 realistic reviews, bug reports, and feature requests. Export to CSV or JSON to populate sandbox databases before launch.",
    tags: ["Growth PM", "Synthetic Data", "LLM", "Pre-Launch"],
    href: "/projects/data-synth",
    caseStudyHref: "/projects/data-synth/case-study",
    docsHref: "/docs/data-synth-PRD",
    featured: true,
    accent: "emerald",
    metrics: [
      { label: "Compliance", value: "> 85%" },
      { label: "Batch size", value: "50" },
      { label: "Gen time", value: "< 8 s" },
    ],
    role: "Growth PM & Builder",
    timeline: "2026",
  },
  {
    id: "surge-sim",
    title: "SurgeSim",
    subtitle: "Dynamic Price & Supply Elasticity Dashboard",
    description:
      "Marketplace PM simulator: grid-map of ride-share zones where supply (drivers) vs. demand (orders) drives surge pricing, driver accept rates, and checkout conversion. Tweak weather events, surge multiplier caps, and watch Order Match Rate vs. Checkout Abandonment in real time.",
    tags: ["Marketplace PM", "Surge Pricing", "Supply/Demand", "Gig Economy"],
    href: "/projects/surge-sim",
    caseStudyHref: "/projects/surge-sim/case-study",
    docsHref: "/docs/surge-sim-PRD",
    featured: true,
    accent: "emerald",
    metrics: [
      { label: "North star", value: "Match rate" },
      { label: "Guardrail", value: "Abandonment" },
      { label: "City zones", value: "24" },
    ],
    role: "Marketplace PM & Builder",
    timeline: "2026",
  },
  {
    id: "claim-resolve",
    title: "ClaimResolve",
    subtitle: "Automated Customer Refund Triage",
    description:
      "Fintech ops PM demo: ingest refund requests, evaluate against configurable policies (max value, age window, warnings, repeat claims, fraud flags), and auto-approve, deny, or route to human review — with email drafts and north-star/guardrail metrics.",
    tags: ["Fintech", "Customer Ops", "Policy Engine", "Automation"],
    href: "/projects/claim-resolve",
    caseStudyHref: "/projects/claim-resolve/case-study",
    docsHref: "/docs/claim-resolve-PRD",
    featured: true,
    accent: "emerald",
    metrics: [
      { label: "Auto-resolution", value: "~50%" },
      { label: "Mock orders", value: "12" },
      { label: "False refund rate", value: "0%" },
    ],
    role: "Product Manager & Builder",
    timeline: "2026",
  },
  {
    id: "prompt-route",
    title: "PromptRoute",
    subtitle: "Intelligent Multi-LLM Router & Cost Optimizer",
    description:
      "Platform PM case study: intercept LLM calls, classify task complexity (chat vs. code vs. reasoning), route to the cheapest capable model, and simulate 429 failover with circuit breakers. Live dashboard tracks cost savings %, latency delta, and recovery rate vs. a GPT-4o-only baseline.",
    tags: ["Platform PM", "LLM Routing", "Cost Optimization", "Circuit Breaker"],
    href: "/projects/prompt-route",
    caseStudyHref: "/projects/prompt-route/case-study",
    docsHref: "/docs/prompt-route-PRD",
    featured: true,
    accent: "indigo",
    metrics: [
      { label: "Cost savings", value: "~45%" },
      { label: "Mock prompts", value: "12" },
      { label: "Failover recovery", value: "> 85%" },
    ],
    role: "Platform PM & Builder",
    timeline: "2026",
  },
  {
    id: "feedback-analyzer",
    title: "AI Product Feedback Analyzer",
    subtitle: "Turning 106 app reviews into a prioritized roadmap",
    description:
      "A PM workflow tool that clusters app reviews by theme, analyzes sentiment, and outputs an ICE-scored product roadmap — built to demonstrate end-to-end product thinking for APM interviews.",
    tags: ["Product Strategy", "User Research", "Next.js", "ICE Framework"],
    href: "/projects/feedback-analyzer",
    caseStudyHref: "/projects/feedback-analyzer/case-study",
    docsHref: "/docs/PRD",
    featured: true,
    accent: "indigo",
    metrics: [
      { label: "Reviews analyzed", value: "106" },
      { label: "Themes detected", value: "10" },
      { label: "Time to insight", value: "< 2 min" },
    ],
    role: "Product Manager & Builder",
    timeline: "2025",
  },
  {
    id: "doc-classifier",
    title: "AI Document Classifier",
    subtitle: "Extract → classify → route — browser demo + PDF production app",
    description:
      "Unified document intelligence for fintech onboarding: classify invoices, bank statements, IDs, ITRs, and CVs into ops routing queues. Browser demo for batch CSV; production Streamlit app with PyMuPDF, MPNet embeddings (155 examples), EN/HI OCR, and Gemini fallback.",
    tags: ["Fintech", "KYC", "Python", "NLP", "Gemini AI"],
    href: "/projects/doc-classifier",
    docsHref: "/docs/doc-classifier-PRD",
    featured: true,
    accent: "emerald",
    metrics: [
      { label: "Document types", value: "5" },
      { label: "Mock documents", value: "20" },
      { label: "Layers", value: "Demo + App" },
    ],
    role: "Builder · PM",
    timeline: "Sep 2025",
  },
  {
    id: "trumio",
    title: "Trumio.in — AI Upskilling Apps",
    subtitle: "0→1 product ideation for student career growth",
    description:
      "Ideated 3 AI-driven apps for student upskilling at Trumio. Conducted market research for user personas, competitor benchmarking, and TAM/SAM/SOM analysis targeting US SMB markets.",
    tags: ["0→1 Product", "Market Research", "TAM/SAM/SOM", "AI"],
    featured: false,
    metrics: [
      { label: "Apps ideated", value: "3" },
      { label: "Market", value: "US SMB" },
    ],
    role: "Product Management",
    timeline: "May – Jul 2022",
  },
  {
    id: "fitcheck",
    title: "FitCheck.io — Virtual Fitting Room",
    subtitle: "DSSE, IIT Bombay",
    description:
      "Developed a virtual fitting room to bridge online and offline shopping. Conducted 80+ consumer surveys and designed a 3D simulation solution that reduced sampling costs by 45%.",
    tags: ["User Research", "Consumer Surveys", "3D Simulation", "E-commerce"],
    featured: false,
    metrics: [
      { label: "Surveys", value: "80+" },
      { label: "Cost reduction", value: "45%" },
    ],
    role: "Product & Research",
    timeline: "Aug – Nov 2022",
  },
];
