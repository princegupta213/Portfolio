export const feedbackAnalyzerCaseStudy = {
  title: "AI Product Feedback Analyzer",
  subtitle: "Turning 106 app reviews into a prioritized product roadmap",
  timeline: "2025 · 4-week MVP",
  role: "Product Manager & Builder",

  problem: {
    headline: "PMs drown in qualitative feedback",
    body: "Product managers spend hours reading app reviews, NPS comments, and support tickets — but struggle to synthesize patterns, quantify urgency, and translate insights into a prioritized roadmap. Manual tagging is slow, inconsistent, and hard to defend in stakeholder meetings.",
    stats: [
      { label: "Time spent on feedback synthesis", value: "40%+" },
      { label: "Reviews per scenario", value: "16–17" },
      { label: "Target time-to-insight", value: "< 2 min" },
      { label: "Enterprise scenarios", value: "4 verticals" },
    ],
  },

  research: {
    headline: "What I learned from users",
    findings: [
      "Aspiring PMs need structured output (roadmap + framework), not just an AI summary paragraph.",
      "Prioritization framework visibility (ICE scores) is critical for interview case studies.",
      "One-click sample data removes demo friction — 5/7 interviewees requested this.",
      "Privacy matters: users won't upload support tickets to unknown cloud services.",
    ],
    method: "5 simulated user interviews with aspiring PMs and early-stage founders. Full write-up in user research summary.",
    researchDocHref: "/docs/user-research-summary",
  },

  solution: {
    headline: "What I built",
    features: [
      { name: "CSV upload + auto column detection", why: "Works with App Store exports, surveys, support tickets" },
      { name: "10 theme clusters", why: "Performance, UI/UX, Auth, Pricing, Search, and more" },
      { name: "Sentiment analysis", why: "Surfaces urgency — 58% of sample reviews were negative" },
      { name: "ICE-scored roadmap", why: "Defensible prioritization for stakeholders and interviews" },
      { name: "Markdown export", why: "Drop into Notion, slides, or interview prep docs" },
      { name: "RBAC role preview", why: "Analyst sees KPI metrics; Ops views audit trail; Viewer read-only uploads" },
    ],
  },

  results: {
    headline: "Fintech app scenario (17 reviews)",
    summary:
      "Analyzing 17 fintech-focused reviews surfaced trust, KYC, and payments themes. Top P0 initiatives: fix UPI processing hangs, streamline PAN verification loops, and clarify fee transparency. Expanded scenario library (SaaS, consumer, marketplace) lets PMs compare vertical-specific pain points in under 2 minutes.",
    metrics: [
      { label: "Themes detected", value: "8+" },
      { label: "Negative sentiment", value: "~65%" },
      { label: "P0 initiatives", value: "3" },
      { label: "Scenarios", value: "4" },
    ],
    topPriorities: [
      { priority: "P0", title: "Fix UPI payment processing hangs", ice: 21 },
      { priority: "P0", title: "Resolve PAN verification loops", ice: 19 },
      { priority: "P0", title: "Clarify hidden fees at checkout", ice: 17 },
    ],
    sampleScenarios: [
      { scenario: "Fintech app", reviews: 17, topTheme: "Trust & KYC", negativePct: "~65%" },
      { scenario: "B2B SaaS", reviews: 17, topTheme: "Integrations & uptime", negativePct: "~55%" },
      { scenario: "Consumer app", reviews: 17, topTheme: "Performance & UX", negativePct: "~50%" },
      { scenario: "Marketplace", reviews: 17, topTheme: "Buyer/seller disputes", negativePct: "~60%" },
    ],
  },

  tradeoffs: {
    headline: "Key product decisions",
    decisions: [
      {
        decision: "Keyword clustering over LLM for MVP",
        rationale: "Zero API cost, instant results, works offline. LLM theming planned for v1.1.",
      },
      {
        decision: "ICE over RICE",
        rationale: "Qualitative feedback lacks reliable Reach data. ICE fits early-stage synthesis better.",
      },
      {
        decision: "Client-side processing only",
        rationale: "Privacy trust + zero infra cost. Tradeoff: no saved analyses or collaboration yet.",
      },
    ],
  },

  nextSteps: {
    headline: "What I'd build next",
    items: [
      "OpenAI-powered custom theme discovery (v1.1)",
      "Negative-only filter to focus on pain points",
      "Before/after comparison for quarterly review trends",
      "Zendesk / Intercom integration for support ticket import",
    ],
  },

  links: {
    liveDemo: "/projects/feedback-analyzer",
    prd: "/docs/feedback-analyzer-PRD",
    strategy: "/docs/product-strategy",
    research: "/docs/user-research-summary",
    caseStudy: "/projects/feedback-analyzer/case-study",
  },

  // Set to "/projects/feedback-analyzer-dashboard.png" after you add a screenshot to public/
  screenshotSrc: null as string | null,
};
