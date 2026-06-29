import { describe, expect, it } from "vitest";
import {
  computeSessionMetrics,
  getDefaultBatchMetrics,
  processClaim,
  runBatchDemo,
} from "@/lib/claim-resolve/engine";
import { getPoliciesForScenario } from "@/lib/claim-resolve/scenarios";
import { DEFAULT_POLICIES } from "@/lib/claim-resolve/policies";

describe("ClaimResolve engine", () => {
  it("approves a low-value eligible order (happy path)", () => {
    const decision = processClaim(
      {
        email: "alex.chen@email.com",
        orderId: "ORD-1001",
        reason: "Accidental purchase",
        submittedAt: new Date().toISOString(),
      },
      DEFAULT_POLICIES
    );
    expect(decision.verdict).toBe("approve");
    expect(decision.order?.orderId).toBe("ORD-1001");
    expect(decision.emailDraft.subject).toContain("Refund approved");
    expect(decision.isFalseApproval).toBe(false);
  });

  it("routes unknown orders to human review", () => {
    const decision = processClaim(
      {
        email: "unknown@email.com",
        orderId: "ORD-9999",
        reason: "Refund",
        submittedAt: new Date().toISOString(),
      },
      DEFAULT_POLICIES
    );
    expect(decision.verdict).toBe("human_review");
    expect(decision.order).toBeNull();
    expect(decision.triggeredRules.some((r) => r.policyId === "order_lookup")).toBe(true);
  });

  it("flags email mismatch for identity verification", () => {
    const decision = processClaim(
      {
        email: "wrong@email.com",
        orderId: "ORD-1001",
        reason: "Refund",
        submittedAt: new Date().toISOString(),
      },
      DEFAULT_POLICIES
    );
    expect(decision.triggeredRules.some((r) => r.policyId === "email_match")).toBe(true);
    expect(decision.verdict).toBe("human_review");
  });

  it("denies high-risk fraud accounts", () => {
    const decision = processClaim(
      {
        email: "morgan.kim@email.com",
        orderId: "ORD-1006",
        reason: "Refund",
        submittedAt: new Date().toISOString(),
      },
      DEFAULT_POLICIES
    );
    expect(decision.verdict).toBe("deny");
    expect(decision.triggeredRules.some((r) => r.policyId === "block_high_risk")).toBe(true);
  });

  it("denies orders outside the refund window", () => {
    const decision = processClaim(
      {
        email: "sam.patel@email.com",
        orderId: "ORD-1003",
        reason: "Refund",
        submittedAt: new Date().toISOString(),
      },
      DEFAULT_POLICIES
    );
    expect(decision.verdict).toBe("deny");
    expect(decision.triggeredRules.some((r) => r.policyId === "transaction_age_limit")).toBe(
      true
    );
  });

  it("includes processing time in the decision", () => {
    const decision = processClaim(
      {
        email: "jamie.oconnor@email.com",
        orderId: "ORD-1010",
        reason: "Accidental purchase",
        submittedAt: new Date().toISOString(),
      },
      DEFAULT_POLICIES
    );
    expect(decision.processingMs).toBeGreaterThan(0);
    expect(decision.verdict).toBe("approve");
  });
});

describe("ClaimResolve scenarios", () => {
  it("strict scenario tightens refund caps", () => {
    const strict = getPoliciesForScenario("strict");
    const maxRefund = strict.find((p) => p.id === "max_refund_value");
    expect(maxRefund?.value).toBe(35);
    const ageLimit = strict.find((p) => p.id === "transaction_age_limit");
    expect(ageLimit?.value).toBe(14);
  });

  it("holiday scenario relaxes repeat claim limit", () => {
    const holiday = getPoliciesForScenario("holiday");
    const repeat = holiday.find((p) => p.id === "repeat_claim_limit");
    expect(repeat?.value).toBe(3);
  });

  it("enterprise scenario raises max refund value", () => {
    const enterprise = getPoliciesForScenario("enterprise");
    const maxRefund = enterprise.find((p) => p.id === "max_refund_value");
    expect(maxRefund?.value).toBe(100);
  });
});

describe("ClaimResolve session metrics", () => {
  it("computes batch metrics across multiple claims", () => {
    const samples = [
      { email: "alex.chen@email.com", orderId: "ORD-1001", reason: "Refund" },
      { email: "morgan.kim@email.com", orderId: "ORD-1006", reason: "Refund" },
    ];
    const decisions = runBatchDemo(DEFAULT_POLICIES, samples);
    const metrics = computeSessionMetrics(decisions);
    expect(metrics.totalProcessed).toBe(2);
    expect(metrics.approvedCount + metrics.deniedCount + metrics.humanReviewCount).toBe(2);
    expect(metrics.autoResolutionRate).toBeGreaterThanOrEqual(0);
  });

  it("provides default batch metrics for the full mock order set", () => {
    const metrics = getDefaultBatchMetrics();
    expect(metrics.totalProcessed).toBeGreaterThan(0);
    expect(metrics.decisions.length).toBe(metrics.totalProcessed);
  });
});
