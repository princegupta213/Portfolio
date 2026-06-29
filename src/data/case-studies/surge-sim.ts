export const surgeSimCaseStudy = {
  title: "SurgeSim",
  subtitle: "Dynamic Price & Supply Elasticity Dashboard",
  timeline: "2026 · Marketplace PM portfolio project",
  role: "Marketplace PM & Builder",

  problem: {
    headline: "Spikes break the marketplace flywheel",
    body: "During high-demand events — rain, concerts, rush hour — customers face long wait times while drivers log off because standard payouts don't justify traffic delays. Marketplace PMs must balance surge pricing (retain supply) against checkout abandonment (retain demand). Without a simulator, policy changes ship blind.",
    stats: [
      { label: "Typical rain demand spike", value: "+45%" },
      { label: "Driver supply drop (heavy rain)", value: "−28%" },
      { label: "Surge cap range tested", value: "1.2–3.0x" },
      { label: "Enterprise zone presets", value: "7" },
    ],
  },

  research: {
    headline: "What marketplace PMs optimize",
    findings: [
      "Order match rate is the north star — unmatched demand is lost GMV and erodes rider trust.",
      "Checkout abandonment is the guardrail — surge above ~2.5x triggers measurable drop-off.",
      "Weather is a leading indicator: demand rises before ops can reposition supply.",
      "Zone-level imbalance matters — city-wide averages hide hyper-local surge pockets.",
    ],
    method: "Synthesized from Uber/Lyft surge pricing literature, marketplace elasticity research, and gig-economy driver incentive case studies.",
    researchDocHref: "/docs/surge-sim-PRD",
  },

  solution: {
    headline: "What I built",
    features: [
      { name: "6×4 City Grid Map", why: "24 zones with heterogeneous demand weights — color-coded surge intensity, click for zone-level supply/demand/wait" },
      { name: "Supply / Demand Sliders", why: "Simulate driver availability vs. customer requests with live imbalance ratio" },
      { name: "Weather Event Presets", why: "Clear, rain, heat, snow — each shifts demand and supply multipliers like real ops playbooks" },
      { name: "Surge Algorithm Tweaker", why: "Adjust min/max multiplier caps and sensitivity to see elasticity curves" },
      { name: "Market Balance Monitor", why: "Real-time line chart of match rate vs. abandonment as you tune parameters" },
      { name: "RBAC role preview", why: "Admin tunes surge caps; Analyst sees KPI header; Ops exports audit-ready reports" },
    ],
  },

  results: {
    headline: "Heavy Rain + driver shortage scenario",
    summary:
      "With demand at 65 and supply at 30 under heavy rain, average surge hits ~2.4x. Match rate falls to ~72% while checkout abandonment climbs past 18%. Lowering max surge to 2.0x recovers conversion but leaves more unmatched orders — the classic marketplace tradeoff the dashboard makes visible.",
    metrics: [
      { label: "Order match rate", value: "~72%" },
      { label: "Checkout abandonment", value: "~18%" },
      { label: "Avg surge multiplier", value: "2.4x" },
      { label: "City zones", value: "24" },
    ],
    sampleScenarios: [
      { scenario: "Balanced Market", weather: "Clear", match: "~92%", abandon: "~8%" },
      { scenario: "Heavy Rain Spike", weather: "Rain", match: "~78%", abandon: "~14%" },
      { scenario: "Driver Shortage", weather: "Clear", match: "~65%", abandon: "~22%" },
      { scenario: "Snow Storm", weather: "Snow", match: "~58%", abandon: "~26%" },
      { scenario: "Stadium event", weather: "Clear", match: "~60%", abandon: "~20%" },
      { scenario: "Downtown nightlife", weather: "Clear", match: "~58%", abandon: "~22%" },
      { scenario: "Holiday surge", weather: "Heat wave", match: "~55%", abandon: "~24%" },
    ],
  },

  tradeoffs: {
    headline: "Key marketplace decisions",
    decisions: [
      {
        decision: "Client-side elasticity model vs. ML demand forecast",
        rationale: "Transparent formulas PMs can reason about in interviews. Production would layer ML on historical trip data.",
      },
      {
        decision: "Zone grid vs. geospatial map",
        rationale: "Grid communicates imbalance patterns faster in a demo. Real product uses hex bins on map tiles.",
      },
      {
        decision: "North star = match rate, not revenue",
        rationale: "Revenue maxing via surge alone destroys long-term retention. Match rate captures marketplace health.",
      },
      {
        decision: "2s live refresh vs. on-demand only",
        rationale: "Auto-tick shows metrics drifting as sliders move — feels like a real ops room monitor.",
      },
    ],
  },

  nextSteps: {
    headline: "Production roadmap",
    items: [
      "Hook to real-time dispatch API for live supply/demand ingestion",
      "A/B surge policy experiments with statistical significance testing",
      "Driver incentive overlays (quest bonuses vs. pure surge)",
      "Per-zone ETA prediction feeding abandonment model",
    ],
  },

  links: {
    liveDemo: "/projects/surge-sim",
    prd: "/docs/surge-sim-PRD",
    caseStudy: "/projects/surge-sim/case-study",
  },

  screenshotSrc: null as string | null,
};
