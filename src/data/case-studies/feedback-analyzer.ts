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
      { label: "Reviews in sample dataset", value: "106" },
      { label: "Target time-to-insight", value: "< 2 min" },
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
    ],
  },

  results: {
    headline: "Sample analysis results",
    summary:
      "Analyzing 106 synthetic app reviews surfaced 10 themes. Top P0 initiatives: clarify pricing/subscription value, streamline login/account recovery, and improve search relevance. Performance & stability appeared in 12+ reviews but ranked lower on ICE due to effort estimates — a tradeoff I'd revisit with engineering input.",
    metrics: [
      { label: "Themes detected", value: "10" },
      { label: "Negative sentiment", value: "58%" },
      { label: "P0 initiatives", value: "3" },
      { label: "Export format", value: "Markdown" },
    ],
    topPriorities: [
      { priority: "P0", title: "Clarify pricing and subscription value", ice: 20 },
      { priority: "P0", title: "Streamline login and account recovery", ice: 18 },
      { priority: "P0", title: "Improve search relevance and filters", ice: 16 },
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
    prd: "/docs/PRD",
    strategy: "/docs/product-strategy",
    research: "/docs/user-research-summary",
  },

  // Set to "/projects/feedback-analyzer-dashboard.png" after you add a screenshot to public/
  screenshotSrc: null as string | null,
};
