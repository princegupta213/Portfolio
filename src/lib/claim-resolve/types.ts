export type RefundVerdict = "approve" | "deny" | "human_review";

export type RuleSeverity = "pass" | "review" | "deny";

export type PolicyParamType = "currency" | "days" | "count" | "toggle";

export interface RefundPolicy {
  id: string;
  name: string;
  description: string;
  paramType: PolicyParamType;
  value: number | boolean;
  defaultValue: number | boolean;
  enabled: boolean;
  severity: Exclude<RuleSeverity, "pass">;
}

export interface OrderRecord {
  orderId: string;
  customerEmail: string;
  amountUsd: number;
  transactionDate: string;
  productName: string;
  accountWarnings: number;
  priorClaims90Days: number;
  highRisk: boolean;
  eligible: boolean;
  groundTruth: RefundVerdict;
  notes?: string;
}

export interface RuleEvaluation {
  policyId: string;
  policyName: string;
  passed: boolean;
  severity: RuleSeverity;
  message: string;
  detail: string;
}

export interface ClaimSubmission {
  email: string;
  orderId: string;
  reason: string;
  submittedAt: string;
}

export interface ClaimDecision {
  submission: ClaimSubmission;
  order: OrderRecord | null;
  verdict: RefundVerdict;
  triggeredRules: RuleEvaluation[];
  allEvaluations: RuleEvaluation[];
  processingMs: number;
  emailDraft: {
    subject: string;
    body: string;
  };
  isFalseApproval: boolean;
}

export interface SessionMetrics {
  totalProcessed: number;
  autoResolved: number;
  autoResolutionRate: number;
  approvedCount: number;
  approvedValueUsd: number;
  falseApprovalCount: number;
  falseRefundValueUsd: number;
  falseRefundRate: number;
  humanReviewCount: number;
  deniedCount: number;
  decisions: ClaimDecision[];
}

export type ClaimResolveTab = "submit" | "policies" | "batch";
