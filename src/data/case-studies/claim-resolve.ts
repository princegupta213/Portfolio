import { getDefaultBatchMetrics } from "@/lib/claim-resolve/engine";

const defaultBatch = getDefaultBatchMetrics();

export const claimResolveCaseStudy = {
  title: "ClaimResolve",
  subtitle: "Automated Customer Refund Triage",
  timeline: "2026 · Fintech & Customer Operations PM project",
  role: "Product Manager & Builder",

  problem: {
    headline: "Small refunds consume disproportionate agent time",
    body: "Customer support teams manually verify transaction dates, account standing, and refund eligibility for every claim — even $15 duplicate charges. Average handle time stretches to 8–12 minutes per ticket, CSAT drops, and ops cost scales linearly with volume. PMs need policy-driven auto-resolution with guardrails against invalid disbursements.",
    stats: [
      { label: "Avg. manual review time", value: "8–12 min" },
      { label: "Target auto-resolution", value: "> 70%" },
      { label: "False refund guardrail", value: "< 2%" },
    ],
  },

  research: {
    headline: "What ops and risk teams require",
    findings: [
      "Most refund volume is low-dollar and rule-bound — ideal for automation if policies are explicit.",
      "High-value, repeat, and flagged accounts must never auto-approve without human review.",
      "Every auto-decision needs an audit trail: which rule fired and why.",
      "Customer notification drafts reduce agent follow-up time on approved/denied cases.",
    ],
    method: "Modeled on fintech CS workflows (chargeback windows, fraud holds, repeat claimant patterns) and Angel One–style ops guardrails for financial disbursements.",
    researchDocHref: "/docs/claim-resolve-PRD.md",
  },

  solution: {
    headline: "What I built",
    features: [
      { name: "Policy Configuration Panel", why: "PM-tunable rules: max refund value, transaction age, warning count, repeat claims, fraud block" },
      { name: "Customer Submission Portal", why: "Mock form with email + order ID lookup against seeded billing records" },
      { name: "Automated Verdict Engine", why: "Approve, deny, or route to human review with per-rule evaluation and severity ranking" },
      { name: "Email Notification Drafts", why: "Context-aware customer emails listing triggered policies" },
      { name: "Ops Metrics Dashboard", why: "North star (auto-resolution rate) and guardrail (false refund rate) with batch simulation" },
    ],
  },

  results: {
    headline: `Batch simulation (${defaultBatch.totalProcessed} mock orders, default policies)`,
    summary: `With default policies, ClaimResolve auto-resolves ${defaultBatch.autoResolutionRate.toFixed(0)}% of sample claims (${defaultBatch.autoResolved} of ${defaultBatch.totalProcessed}: ${defaultBatch.approvedCount} approved, ${defaultBatch.deniedCount} denied) without agent touch. High-value, aged, flagged, and repeat-claimant orders correctly route to review or deny. False refund rate stays at ${defaultBatch.falseRefundRate.toFixed(0)}% on the seeded ground-truth set when eligibility rules are enabled.`,
    metrics: [
      { label: "Auto-resolution rate", value: `${defaultBatch.autoResolutionRate.toFixed(0)}%` },
      { label: "False refund rate", value: `${defaultBatch.falseRefundRate.toFixed(0)}%` },
      { label: "Policy rules", value: "6" },
      { label: "Human review queue", value: String(defaultBatch.humanReviewCount) },
    ],
    sampleRoutes: [
      { order: "ORD-1001", amount: "$24.99", verdict: "Approved", rule: "All policies passed" },
      { order: "ORD-1002", amount: "$79.00", verdict: "Human review", rule: "Exceeds $50 cap" },
      { order: "ORD-1003", amount: "$32.50", verdict: "Denied", rule: "Outside 30-day window" },
      { order: "ORD-1006", amount: "$55.00", verdict: "Denied", rule: "High-risk account" },
    ],
  },

  tradeoffs: {
    headline: "Key product decisions",
    decisions: [
      {
        decision: "Review vs. deny for threshold breaches",
        rationale: "Amount and warning-count breaches route to review (recoverable); age and fraud breaches auto-deny (hard policy).",
      },
      {
        decision: "Ground-truth guardrail metric",
        rationale: "Seeded orders include hidden eligibility flags so the demo can surface false auto-approvals as a guardrail KPI.",
      },
      {
        decision: "Client-side policy engine",
        rationale: "Browser demo for portfolio — production would connect to billing API, fraud scores, and agent queue.",
      },
    ],
  },

  links: {
    liveDemo: "/projects/claim-resolve",
    prd: "/docs/claim-resolve-PRD.md",
  },
};
