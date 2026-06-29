export const checkoutFrictionCaseStudy = {
  title: "CheckoutFriction",
  subtitle: "Checkout Drop-off Diagnoser",
  timeline: "2026 · E-commerce Growth PM portfolio project",
  role: "Growth PM & Builder",
  problem: {
    headline: "Checkout friction kills conversion — but uplift is hard to quantify",
    body: "Long forms, missing autofill, and no express pay options drive cart abandonment. Growth PMs need to model optimization impact before committing engineering sprints.",
    stats: [
      { label: "Funnel steps", value: "4" },
      { label: "Mobile checkouts", value: "> 60%" },
      { label: "Baseline abandonment", value: "~48%" },
    ],
  },
  research: {
    headline: "Standard conversion tactics and their impact",
    findings: [
      "Address autofill reduces shipping step drop-off ~20% in industry benchmarks.",
      "Guest checkout cuts cart-step abandonment ~15% for first-time buyers.",
      "Express Apple Pay bypasses shipping/billing — highest uplift but platform-dependent.",
      "Funnel visualization must update live as toggles flip for stakeholder demos.",
    ],
    method: "Synthesized from e-commerce conversion benchmarks (Baymard Institute) and growth PM prioritization frameworks.",
    researchDocHref: "/docs/checkout-friction-PRD",
  },
  solution: {
    headline: "What I built",
    features: [
      { name: "Step-by-Step Simulator", why: "Cart → Shipping → Billing → Success with contextual copy per toggle" },
      { name: "Optimization Toggles", why: "Autofill, Guest Checkout, Express Apple Pay with PRD-specified impact" },
      { name: "Live Funnel Analytics", why: "Bar chart + table with entered/dropped/converted per step" },
      { name: "Uplift vs. baseline", why: "Cart abandonment, completions, and duration delta metrics" },
    ],
  },
  results: {
    headline: "All optimizations enabled",
    summary: "With autofill, guest checkout, and Apple Pay enabled, cart abandonment drops from ~48% to ~32% and average checkout duration falls by ~2 minutes — giving PMs a quantified case for eng allocation.",
    metrics: [
      { label: "Abandonment (baseline)", value: "~48%" },
      { label: "Abandonment (optimized)", value: "~32%" },
      { label: "Completion uplift", value: "+~30%" },
      { label: "Duration saved", value: "~175 s" },
    ],
    sampleRoutes: [],
  },
  tradeoffs: {
    headline: "Key product decisions",
    decisions: [
      { decision: "Deterministic funnel math vs. Monte Carlo", rationale: "Clear cause-effect for PM demos; production would use session replay data." },
      { decision: "Mobile-responsive layout", rationale: "NFR reflects > 60% mobile checkout share." },
    ],
  },
  nextSteps: {
    headline: "Production roadmap",
    items: ["Wire real session analytics (Amplitude/Mixpanel)", "A/B test planner with confidence intervals", "Payment method expansion (Google Pay, Shop Pay)"],
  },
  links: { liveDemo: "/projects/checkout-friction", prd: "/docs/checkout-friction-PRD" },
};
