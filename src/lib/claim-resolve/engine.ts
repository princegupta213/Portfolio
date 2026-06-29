import { draftCustomerEmail } from "./email-templates";
import { getOrderAgeDays, lookupOrder, MOCK_ORDERS } from "./orders";
import { DEFAULT_POLICIES } from "./policies";
import type {
  ClaimDecision,
  ClaimSubmission,
  OrderRecord,
  RefundPolicy,
  RefundVerdict,
  RuleEvaluation,
  RuleSeverity,
  SessionMetrics,
} from "./types";

const SEVERITY_RANK: Record<RuleSeverity, number> = {
  pass: 0,
  review: 1,
  deny: 2,
};

function worstVerdict(evaluations: RuleEvaluation[]): RefundVerdict {
  let maxSeverity: RuleSeverity = "pass";
  for (const ev of evaluations) {
    if (SEVERITY_RANK[ev.severity] > SEVERITY_RANK[maxSeverity]) {
      maxSeverity = ev.severity;
    }
  }
  if (maxSeverity === "deny") return "deny";
  if (maxSeverity === "review") return "human_review";
  return "approve";
}

function evaluatePolicies(
  order: OrderRecord | null,
  emailMatch: boolean,
  policies: RefundPolicy[]
): RuleEvaluation[] {
  const evaluations: RuleEvaluation[] = [];

  if (!order) {
    evaluations.push({
      policyId: "order_lookup",
      policyName: "Order verification",
      passed: false,
      severity: "review",
      message: "Order ID not found in billing system",
      detail: "Unknown order requires manual lookup before any refund action.",
    });
    return evaluations;
  }

  if (!emailMatch) {
    evaluations.push({
      policyId: "email_match",
      policyName: "Email verification",
      passed: false,
      severity: "review",
      message: "Submitted email does not match order record",
      detail: `Order is registered to ${order.customerEmail}. Identity verification required.`,
    });
  }

  const ageDays = getOrderAgeDays(order);

  for (const policy of policies) {
    if (!policy.enabled) continue;

    switch (policy.id) {
      case "max_refund_value": {
        const max = policy.value as number;
        const passed = order.amountUsd <= max;
        evaluations.push({
          policyId: policy.id,
          policyName: policy.name,
          passed,
          severity: passed ? "pass" : policy.severity,
          message: passed
            ? `Refund amount ${formatUsd(order.amountUsd)} is within $${max} auto-approval limit`
            : `Refund amount ${formatUsd(order.amountUsd)} exceeds $${max} auto-approval limit`,
          detail: passed
            ? "Within configured cap for unattended processing."
            : "High-value claims require agent approval to limit exposure.",
        });
        break;
      }
      case "transaction_age_limit": {
        const limit = policy.value as number;
        const passed = ageDays <= limit;
        evaluations.push({
          policyId: policy.id,
          policyName: policy.name,
          passed,
          severity: passed ? "pass" : policy.severity,
          message: passed
            ? `Transaction is ${ageDays} days old (limit: ${limit} days)`
            : `Transaction is ${ageDays} days old — exceeds ${limit}-day refund window`,
          detail: passed
            ? "Purchase falls inside the eligible refund period."
            : "Policy excludes refunds beyond the configured age window.",
        });
        break;
      }
      case "account_warning_threshold": {
        const threshold = policy.value as number;
        const passed = order.accountWarnings < threshold;
        evaluations.push({
          policyId: policy.id,
          policyName: policy.name,
          passed,
          severity: passed ? "pass" : policy.severity,
          message: passed
            ? `Account warnings: ${order.accountWarnings} (threshold: < ${threshold})`
            : `Account has ${order.accountWarnings} warnings (threshold: < ${threshold})`,
          detail: passed
            ? "Account standing is acceptable for auto-processing."
            : "Elevated account risk signals require human judgment.",
        });
        break;
      }
      case "repeat_claim_limit": {
        const limit = policy.value as number;
        const passed = order.priorClaims90Days <= limit;
        evaluations.push({
          policyId: policy.id,
          policyName: policy.name,
          passed,
          severity: passed ? "pass" : policy.severity,
          message: passed
            ? `Prior claims (90d): ${order.priorClaims90Days} (limit: ≤ ${limit})`
            : `${order.priorClaims90Days} prior claims in 90 days exceeds limit of ${limit}`,
          detail: passed
            ? "No repeat-claim pattern detected."
            : "Potential abuse pattern — route to fraud/ops review.",
        });
        break;
      }
      case "block_high_risk": {
        if (!(policy.value as boolean)) break;
        const passed = !order.highRisk;
        evaluations.push({
          policyId: policy.id,
          policyName: policy.name,
          passed,
          severity: passed ? "pass" : policy.severity,
          message: passed
            ? "Account passed fraud risk screening"
            : "Account flagged as high-risk by fraud scoring",
          detail: passed
            ? "No active fraud holds on this account."
            : "Automated deny to protect against invalid disbursements.",
        });
        break;
      }
      case "require_eligible_orders": {
        if (!(policy.value as boolean)) break;
        const passed = order.eligible;
        evaluations.push({
          policyId: policy.id,
          policyName: policy.name,
          passed,
          severity: passed ? "pass" : policy.severity,
          message: passed
            ? "Order is eligible for refund processing"
            : "Order is not eligible (partial refund or open dispute)",
          detail: passed
            ? "Billing status allows refund initiation."
            : "Agent must reconcile billing state before proceeding.",
        });
        break;
      }
    }
  }

  return evaluations;
}

function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export function processClaim(
  submission: ClaimSubmission,
  policies: RefundPolicy[]
): ClaimDecision {
  const start = performance.now();
  const order = lookupOrder(submission.orderId);
  const emailMatch =
    order !== null &&
    order.customerEmail.toLowerCase() === submission.email.trim().toLowerCase();

  const allEvaluations = evaluatePolicies(order, emailMatch, policies);
  const triggeredRules = allEvaluations.filter((e) => !e.passed);
  const verdict = worstVerdict(allEvaluations);

  const base: Omit<ClaimDecision, "emailDraft"> = {
    submission,
    order,
    verdict,
    triggeredRules,
    allEvaluations,
    processingMs: Math.round(performance.now() - start + 8),
    isFalseApproval:
      verdict === "approve" && order !== null && order.groundTruth !== "approve",
  };

  return {
    ...base,
    emailDraft: draftCustomerEmail(base),
  };
}

export function computeSessionMetrics(decisions: ClaimDecision[]): SessionMetrics {
  const total = decisions.length;
  const approved = decisions.filter((d) => d.verdict === "approve");
  const denied = decisions.filter((d) => d.verdict === "deny");
  const humanReview = decisions.filter((d) => d.verdict === "human_review");
  const autoResolved = approved.length + denied.length;

  const approvedValueUsd = approved.reduce((sum, d) => sum + (d.order?.amountUsd ?? 0), 0);
  const falseApprovals = approved.filter((d) => d.isFalseApproval);
  const falseRefundValueUsd = falseApprovals.reduce(
    (sum, d) => sum + (d.order?.amountUsd ?? 0),
    0
  );

  return {
    totalProcessed: total,
    autoResolved,
    autoResolutionRate: total > 0 ? (autoResolved / total) * 100 : 0,
    approvedCount: approved.length,
    approvedValueUsd,
    falseApprovalCount: falseApprovals.length,
    falseRefundValueUsd,
    falseRefundRate:
      approvedValueUsd > 0 ? (falseRefundValueUsd / approvedValueUsd) * 100 : 0,
    humanReviewCount: humanReview.length,
    deniedCount: denied.length,
    decisions,
  };
}

export function runBatchDemo(
  policies: RefundPolicy[],
  samples: { email: string; orderId: string; reason: string }[]
): ClaimDecision[] {
  const now = new Date().toISOString();
  return samples.map((s) =>
    processClaim(
      {
        email: s.email,
        orderId: s.orderId,
        reason: s.reason,
        submittedAt: now,
      },
      policies
    )
  );
}

/** Pre-computed metrics for default policies + full mock order set (used in case study copy). */
export function getDefaultBatchMetrics(policies: RefundPolicy[] = DEFAULT_POLICIES) {
  const samples = MOCK_ORDERS.map((o) => ({
    email: o.customerEmail,
    orderId: o.orderId,
    reason: "Accidental purchase",
  }));
  const decisions = runBatchDemo(policies, samples);
  return computeSessionMetrics(decisions);
}

