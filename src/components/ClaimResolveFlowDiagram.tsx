"use client";

import { ArrowRight, CheckCircle2, AlertTriangle, XCircle, UserCheck } from "lucide-react";
import type { ClaimDecision } from "@/lib/claim-resolve/types";

interface Props {
  decision?: ClaimDecision;
  activeStep?: number;
  compact?: boolean;
}

const VERDICT_STYLES = {
  approve: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 ring-emerald-200" },
  deny: { icon: XCircle, color: "text-red-600", bg: "bg-red-50 ring-red-200" },
  human_review: { icon: UserCheck, color: "text-amber-600", bg: "bg-amber-50 ring-amber-200" },
};

export function ClaimResolveFlowDiagram({ decision, activeStep, compact = false }: Props) {
  const order = decision?.order;
  const verdict = decision?.verdict;
  const primaryRule = decision?.triggeredRules[0];

  const steps = [
    {
      id: "submit",
      label: "Claim submitted",
      sub: decision
        ? `${decision.submission.orderId.toUpperCase()} · ${decision.submission.reason}`
        : "Email + order ID",
    },
    {
      id: "lookup",
      label: "Order lookup",
      sub: order
        ? `$${order.amountUsd.toFixed(2)} · ${order.productName.slice(0, 24)}${order.productName.length > 24 ? "…" : ""}`
        : decision && !order
          ? "Not found"
          : "Billing record",
    },
    {
      id: "verify",
      label: "Identity check",
      sub: order
        ? order.customerEmail.toLowerCase() === decision?.submission.email.trim().toLowerCase()
          ? "Email verified"
          : "Mismatch — review"
        : "Email match",
    },
    {
      id: "policy",
      label: "Policy engine",
      sub: primaryRule
        ? primaryRule.policyName
        : decision
          ? `${decision.allEvaluations.filter((e) => e.passed).length} checks passed`
          : "6 rules",
    },
    {
      id: "verdict",
      label: verdict
        ? verdict === "approve"
          ? "Approved"
          : verdict === "deny"
            ? "Denied"
            : "Human review"
        : "Verdict",
      sub: decision ? `${decision.processingMs} ms` : "Approve · Deny · Review",
    },
  ];

  return (
    <div className={`rounded-xl border border-zinc-200 bg-white ${compact ? "p-4" : "p-6"}`}>
      {!compact && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-emerald-600">
          Claim pipeline
        </p>
      )}
      <div className={`flex flex-wrap items-center gap-2 ${compact ? "text-xs" : "text-sm"}`}>
        {steps.map((step, i) => {
          const isActive = activeStep !== undefined ? i <= activeStep : !!decision;
          const isVerdict = i === 4 && verdict;
          const verdictStyle = verdict ? VERDICT_STYLES[verdict] : null;
          return (
            <div key={step.id} className="flex items-center gap-2">
              <div
                className={`rounded-lg px-3 py-2 transition-colors ${
                  isActive
                    ? isVerdict && verdictStyle
                      ? `${verdictStyle.bg} ring-1`
                      : "bg-emerald-50 ring-1 ring-emerald-200"
                    : "bg-zinc-50 text-zinc-400"
                }`}
              >
                <div className={`font-medium ${isActive ? "text-zinc-900" : ""}`}>
                  {step.label}
                </div>
                <div className={`text-xs ${isActive ? "text-zinc-500" : ""}`}>{step.sub}</div>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight
                  className={`h-4 w-4 shrink-0 ${isActive ? "text-emerald-400" : "text-zinc-300"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {decision && decision.triggeredRules.length > 0 && (
        <div
          className={`mt-4 flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${
            decision.verdict === "deny"
              ? "bg-red-50 text-red-800"
              : decision.verdict === "human_review"
                ? "bg-amber-50 text-amber-800"
                : "bg-emerald-50 text-emerald-800"
          }`}
        >
          {decision.verdict === "deny" ? (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          ) : decision.verdict === "human_review" ? (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>
            <strong>{primaryRule?.policyName ?? "Policy"}:</strong>{" "}
            {primaryRule?.message ?? "All checks passed"}
          </span>
        </div>
      )}

      {decision && decision.triggeredRules.length === 0 && decision.verdict === "approve" && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          All {decision.allEvaluations.length} policy checks passed — auto-approved
        </div>
      )}
    </div>
  );
}
