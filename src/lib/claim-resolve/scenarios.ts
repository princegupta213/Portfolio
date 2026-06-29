import { DEFAULT_POLICIES } from "./policies";
import type { RefundPolicy } from "./types";

export type ClaimResolveScenarioId = "standard" | "strict" | "holiday" | "enterprise";

function clonePolicies(policies: RefundPolicy[]): RefundPolicy[] {
  return policies.map((p) => ({ ...p }));
}

function setPolicyValue(
  policies: RefundPolicy[],
  id: string,
  value: number | boolean
): void {
  const policy = policies.find((p) => p.id === id);
  if (policy) {
    policy.value = value;
    policy.defaultValue = value;
  }
}

export function getPoliciesForScenario(scenarioId: string): RefundPolicy[] {
  const policies = clonePolicies(DEFAULT_POLICIES);

  switch (scenarioId as ClaimResolveScenarioId) {
    case "strict":
      setPolicyValue(policies, "max_refund_value", 35);
      setPolicyValue(policies, "transaction_age_limit", 14);
      setPolicyValue(policies, "repeat_claim_limit", 1);
      setPolicyValue(policies, "account_warning_threshold", 1);
      break;
    case "holiday":
      setPolicyValue(policies, "max_refund_value", 75);
      setPolicyValue(policies, "repeat_claim_limit", 3);
      break;
    case "enterprise":
      setPolicyValue(policies, "max_refund_value", 100);
      setPolicyValue(policies, "repeat_claim_limit", 3);
      setPolicyValue(policies, "transaction_age_limit", 45);
      break;
    case "standard":
    default:
      break;
  }

  return policies;
}
