export const exportHubCaseStudy = {
  title: "ExportHub",
  subtitle: "Custom SaaS Report & Format Generator",
  timeline: "2026 · B2B PM portfolio project",
  role: "Product Manager & Builder",
  problem: {
    headline: "CSV dumps don't survive executive review",
    body: "Marketing associates and analysts waste cycles exporting raw data their managers can't read. Custom PDF reports require engineering sprints most teams can't prioritize.",
    stats: [
      { label: "Preview target", value: "< 150 ms" },
      { label: "Export formats", value: "3" },
      { label: "Style themes", value: "3" },
    ],
  },
  research: {
    headline: "What B2B end users export for",
    findings: [
      "Column selection is the #1 customization — not fancy chart types.",
      "Preview-before-download prevents 'wrong export' support tickets.",
      "Corporate vs. modern themes map to audience (board vs. team standup).",
      "Sub-150 ms preview updates feel instant; slower breaks trust.",
    ],
    method: "Synthesized from B2B SaaS churn interviews citing export friction and internal reporting workflows.",
    researchDocHref: "/docs/export-hub-PRD",
  },
  solution: {
    headline: "What I built",
    features: [
      { name: "Column Selector Checklist", why: "Toggle Date, User, Revenue, Conversion, Region from mock tables" },
      { name: "Format & Style Selector", why: "PDF / CSV / JSON with Classic, Modern Slate, High-Contrast themes" },
      { name: "Live Print Preview", why: "Side-by-side preview updates instantly as settings change" },
      { name: "One-click export", why: "Download compiled file matching preview selection" },
    ],
  },
  results: {
    headline: "Preview performance",
    summary: "Client-side preview recomputes in under 50 ms on settings change — well under the 150 ms NFR. PDF theme switching gives executives polished output without eng involvement.",
    metrics: [
      { label: "Preview latency", value: "< 50 ms" },
      { label: "Columns available", value: "5" },
      { label: "Themes", value: "3" },
      { label: "Export failure rate", value: "0%" },
    ],
    sampleRoutes: [],
  },
  tradeoffs: {
    headline: "Key product decisions",
    decisions: [
      { decision: "Mock data vs. live DB connection", rationale: "Demo uses sample rows; production wires read-only query builder." },
      { decision: "PDF as styled HTML preview", rationale: "Shows layout intent; production uses headless PDF renderer." },
    ],
  },
  nextSteps: {
    headline: "Production roadmap",
    items: ["SQL column picker with RBAC", "Scheduled report delivery", "Branded white-label themes"],
  },
  links: { liveDemo: "/projects/export-hub", prd: "/docs/export-hub-PRD" },
};
