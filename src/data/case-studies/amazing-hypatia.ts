export const amazingHypatiaCaseStudy = {
  title: "Launch Employee (Ava)",
  subtitle: "Autonomous AI Product Launch Employee Workspace",
  timeline: "2026 · AI Product PM & Builder portfolio project",
  role: "AI Product PM & Builder",
  problem: {
    headline: "Product launching is a fragmented manual bottleneck",
    body: "PMs waste hours manually synchronizing roadmaps, GTM copy, customer success FAQs, and engineering checklists. When strategic directions pivot, documents drift, leading to misaligned launches. Additionally, passive dashboards fail to proactively monitor post-launch metrics.",
    stats: [
      { label: "Target confidence", value: "> 90%" },
      { label: "Enterprise presets", value: "7 Workspaces" },
      { label: "Engine latency", value: "< 1.5s" },
      { label: "Checklist items", value: "24 items" },
    ],
  },
  research: {
    headline: "What Launch PMs need for autonomous coordination",
    findings: [
      "Consistency is critical: changing the target audience must auto-update GTM collateral across all teams.",
      "Background agency: the AI must work proactively and show execution steps in the background.",
      "Time Travel: PMs need to dry-run post-launch scenarios (Day 3 drop-offs, competitor moves) before launch day.",
      "Escalations: the AI should not make blind decisions but rather escalate tradeoffs to a human inbox.",
      "Real-time Readiness: Overall project health should be derived directly from the status of active team tasks.",
    ],
    method: "Derived from user journeys of PMs launching SaaS/fintech products under tight timelines with cross-departmental alignment gaps.",
    researchDocHref: "/docs/amazing-hypatia-PRD",
  },
  solution: {
    headline: "What I built",
    features: [
      { name: "Consistency Engine", why: "Instantly synchronizes target parameters (SMB vs Enterprise) and highlights affected components with visual glows" },
      { name: "Proactive Loop", why: "Animates real-time background logs of Ava research steps (SWOT, positioning, checklist updates)" },
      { name: "Time Travel Simulator", why: "Tests post-launch milestones (Launch Day, Day 3, Week 2, Month 1) to dry-run anomalies and experiments" },
      { name: "Interactive Tradeoff Drawer", why: "Allows multi-turn chat with Ava in the sign-off inbox to debate recommendations before approval" },
      { name: "Real-time Readiness Tracker", why: "Calculates overall product health percentages dynamically from toggling active department checklists" },
    ],
  },
  results: {
    headline: "Simulation Run · Fintech LAMF launch (100% rollout)",
    summary: "Simulated a full Fintech launch through the Time Travel dashboard. Toggling to Day 3 successfully flagged user drop-off anomalies, while Week 2 simulated a competitor copycat that triggered pricing experiments. Toggling checklists in the Growth workspace updated overall readiness metrics in real-time.",
    metrics: [
      { label: "Post-launch metrics", value: "Stabilized" },
      { label: "Audience updates", value: "Instant" },
      { label: "Build status", value: "Clean" },
      { label: "Timeline events", value: "Logged" },
    ],
    sampleOutcomes: [
      { scenario: "Onboarding drop-off", batch: 50, compliance: "91% resolved", duplicates: "0 errors" },
      { scenario: "Competitor clone scan", batch: 100, compliance: "94% resolved", duplicates: "0 errors" },
      { scenario: "LTV margin tickets", batch: 250, compliance: "88% resolved", duplicates: "0 errors" },
      { scenario: "Month 1 expansion", batch: 50, compliance: "97% resolved", duplicates: "0 errors" },
    ],
  },
  tradeoffs: {
    headline: "Key product decisions",
    decisions: [
      { decision: "Heuristics and local engine vs. live AI server", rationale: "Optimized for fast portfolio load times and zero-latency client simulation while presenting complex logical state changes." },
      { decision: "Interactive time travel selectors", rationale: "Provides recruiters with instant access to post-launch states without having to wait weeks to see metrics accumulate." },
      { decision: "Checklist-linked readiness progress bars", rationale: "Connects operational checkboxes to sidebar visual status hubs to make the platform feel like a real teammate dashboard." },
      { decision: "Contextual turn-based chat fallbacks", rationale: "Prevents Ava from repeating himself during discussions and creates the illusion of intelligent business reasoning." },
    ],
  },
  nextSteps: {
    headline: "Production roadmap",
    items: [
      "Connect to live JIRA / Figma APIs to sync tasks",
      "Integrate LLM-driven prompt generators for copy variants",
      "Set up database hooks to capture actual user telemetry",
      "Incorporate human-in-the-loop Slack integration for escalations",
    ],
  },
  links: {
    liveDemo: "https://amazing-hypatia.vercel.app",
    prd: "/docs/amazing-hypatia-PRD",
    caseStudy: "/projects/amazing-hypatia/case-study",
  },
  screenshotSrc: null as string | null,
};
