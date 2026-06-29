export const docClassifierCaseStudy = {
  title: "AI Document Classifier",
  subtitle: "KYC & Onboarding Document Intelligence",
  timeline: "2026 · Fintech Operations PM portfolio project",
  role: "Product Manager & Builder",

  problem: {
    headline: "Manual document sorting bottlenecks onboarding SLAs",
    body: "Ops teams receive mixed PDF batches — Aadhaar scans, bank statements, ITR acknowledgements, invoices — and manually route each to the right queue. Misroutes delay KYC by days, compliance audits fail when SLA tiers aren't tracked, and PMs can't quantify classification accuracy before rolling out ML models.",
    stats: [
      { label: "Document types", value: "6 categories" },
      { label: "KYC SLA target", value: "< 4 h" },
      { label: "Batch scenarios", value: "4 verticals" },
      { label: "Mock corpus", value: "20+ docs" },
    ],
  },

  research: {
    headline: "What onboarding ops teams need",
    findings: [
      "Routing queues must map to SLA tiers (P0 KYC vs P2 HR) — not just category labels.",
      "Batch demos need vertical-specific subsets: retail KYC, SME lending, HR onboarding, compliance audit.",
      "Low-confidence and blurry scans must route to manual review — never silent misclassification.",
      "Audit logs are mandatory for regulated workflows — who classified what and when.",
      "Multi-format upload (PDF, DOCX, images) mirrors real ops intake, not paste-only demos.",
    ],
    method: "Synthesized from Indian fintech KYC playbooks (Aadhaar, PAN, bank statements, ITR) and lending onboarding SLAs at regulated NBFCs.",
    researchDocHref: "/docs/doc-classifier-PRD",
  },

  solution: {
    headline: "What I built",
    features: [
      { name: "Batch classification demo", why: "4 enterprise scenarios with 8–11 documents each — retail KYC, SME lending, HR, compliance" },
      { name: "Paste & upload modes", why: "Single-doc paste, multi-file queue with in-browser extraction (PDF.js, Mammoth, demo OCR)" },
      { name: "SLA routing dashboard", why: "Category breakdown, confidence buckets, routing queue counts with P0/P1/P2 badges" },
      { name: "RBAC role preview", why: "Admin configures, Ops sees audit log, Analyst sees confidence metrics, Viewer read-only" },
      { name: "Full PDF app link", why: "Production Streamlit classifier for heavy OCR workloads" },
    ],
  },

  results: {
    headline: "Retail KYC batch (9 documents, default classifier)",
    summary: "A retail KYC scenario batch classified 9 documents into 3 routing queues with 89% average confidence. Government IDs and bank statements routed to P0 KYC and income-review queues within SLA targets. One blurry scan correctly flagged for manual review at low confidence.",
    metrics: [
      { label: "Avg confidence", value: "~89%" },
      { label: "High-confidence docs", value: "7/9" },
      { label: "Routing queues", value: "3" },
      { label: "P0 SLA routes", value: "5 docs" },
    ],
    sampleRoutes: [
      { document: "aadhaar_kyc.pdf", category: "Government ID", queue: "KYC verification", sla: "P0 · 4h" },
      { document: "hdfc_statement_oct.pdf", category: "Bank statement", queue: "Income & liability", sla: "P0 · 8h" },
      { document: "itr_ack_2024.pdf", category: "ITR", queue: "Financial & tax", sla: "P1 · 24h" },
      { document: "blurry_scan.pdf", category: "Unknown", queue: "Manual review", sla: "P0 · 2h" },
      { document: "gst_invoice_q2.pdf", category: "Invoice", queue: "Billing & compliance", sla: "P1 · 24h" },
    ],
  },

  tradeoffs: {
    headline: "Key product decisions",
    decisions: [
      {
        decision: "MPNet + keyword heuristics vs. hosted vision API",
        rationale: "Runs fully client-side for portfolio demos. Production Streamlit app handles OCR-heavy PDFs.",
      },
      {
        decision: "Scenario subsets over full corpus shuffle",
        rationale: "PMs can narrate vertical-specific onboarding stories in interviews without noise.",
      },
      {
        decision: "Expanded mock corpus (20+ docs)",
        rationale: "Driving licence, salary slips, NOC letters, and balance sheets stress-test edge categories.",
      },
      {
        decision: "SLA badges on routing queues",
        rationale: "Connects classification output to ops KPIs — not just accuracy percentages.",
      },
    ],
  },

  nextSteps: {
    headline: "Production roadmap",
    items: [
      "Fine-tuned classifier on production labeled corpus",
      "Human-in-the-loop relabeling UI for low-confidence queue",
      "Webhook routing to Zendesk / internal ops queues",
      "Per-tenant category taxonomy CRUD with audit trail",
    ],
  },

  links: {
    liveDemo: "/projects/doc-classifier",
    prd: "/docs/doc-classifier-PRD",
    caseStudy: "/projects/doc-classifier/case-study",
  },

  screenshotSrc: null as string | null,
};
