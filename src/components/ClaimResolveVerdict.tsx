"use client";

import { Fragment, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  UserCheck,
  Mail,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Tooltip,
} from "recharts";
import type { ClaimDecision, SessionMetrics } from "@/lib/claim-resolve/types";
import { getOrderAgeDays } from "@/lib/claim-resolve/orders";
import { ClaimResolveFlowDiagram } from "@/components/ClaimResolveFlowDiagram";

const VERDICT_CONFIG = {
  approve: {
    label: "Approved",
    color: "#10b981",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    ring: "ring-emerald-200",
    icon: CheckCircle2,
  },
  deny: {
    label: "Denied",
    color: "#ef4444",
    bg: "bg-red-50",
    text: "text-red-800",
    ring: "ring-red-200",
    icon: XCircle,
  },
  human_review: {
    label: "Human Review",
    color: "#f59e0b",
    bg: "bg-amber-50",
    text: "text-amber-800",
    ring: "ring-amber-200",
    icon: UserCheck,
  },
};

interface Props {
  decision: ClaimDecision;
  batchDecisions?: ClaimDecision[];
  sessionMetrics: SessionMetrics;
  onReset: () => void;
  onNewClaim?: () => void;
}

export function ClaimResolveVerdict({
  decision,
  batchDecisions,
  sessionMetrics,
  onReset,
  onNewClaim,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [showAllRules, setShowAllRules] = useState(false);
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null);

  const config = VERDICT_CONFIG[decision.verdict];
  const Icon = config.icon;
  const isBatch = batchDecisions && batchDecisions.length > 1;

  const verdictBreakdown = isBatch
    ? [
        {
          name: "Approved",
          value: batchDecisions.filter((d) => d.verdict === "approve").length,
          color: VERDICT_CONFIG.approve.color,
        },
        {
          name: "Denied",
          value: batchDecisions.filter((d) => d.verdict === "deny").length,
          color: VERDICT_CONFIG.deny.color,
        },
        {
          name: "Review",
          value: batchDecisions.filter((d) => d.verdict === "human_review").length,
          color: VERDICT_CONFIG.human_review.color,
        },
      ]
    : [];

  const batchMetrics = isBatch
    ? {
        autoRate:
          (batchDecisions.filter((d) => d.verdict !== "human_review").length /
            batchDecisions.length) *
          100,
        falseRate: (() => {
          const approved = batchDecisions.filter((d) => d.verdict === "approve");
          const val = approved.reduce((s, d) => s + (d.order?.amountUsd ?? 0), 0);
          const falseVal = approved
            .filter((d) => d.isFalseApproval)
            .reduce((s, d) => s + (d.order?.amountUsd ?? 0), 0);
          return val > 0 ? (falseVal / val) * 100 : 0;
        })(),
      }
    : null;

  const copyEmail = async () => {
    await navigator.clipboard.writeText(
      `Subject: ${decision.emailDraft.subject}\n\n${decision.emailDraft.body}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportReport = () => {
    const decisions = batchDecisions ?? [decision];
    const lines = [
      "# ClaimResolve Triage Report",
      "",
      `**Processed:** ${decisions.length} claim(s)`,
      `**Auto-Resolution Rate:** ${(batchMetrics?.autoRate ?? sessionMetrics.autoResolutionRate).toFixed(1)}%`,
      `**False Refund Rate:** ${(batchMetrics?.falseRate ?? sessionMetrics.falseRefundRate).toFixed(1)}%`,
      "",
      "## Decisions",
      "",
      "| Order | Verdict | Amount | Triggered Rule |",
      "|-------|---------|--------|----------------|",
      ...decisions.map(
        (d) =>
          `| ${d.submission.orderId} | ${d.verdict} | $${d.order?.amountUsd.toFixed(2) ?? "—"} | ${d.triggeredRules[0]?.message ?? "All passed"} |`
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "claimresolve-report.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" />
          {isBatch ? "Back to dashboard" : "Back"}
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportReport}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          {onNewClaim && (
            <button
              type="button"
              onClick={onNewClaim}
              className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              New claim
            </button>
          )}
        </div>
      </div>

      {(isBatch ? batchMetrics : sessionMetrics.totalProcessed > 0) && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Auto-Resolution Rate"
            subtitle="North star metric"
            value={`${(batchMetrics?.autoRate ?? sessionMetrics.autoResolutionRate).toFixed(1)}%`}
            highlight
          />
          <MetricCard
            title="False Refund Rate"
            subtitle="Guardrail metric"
            value={`${(batchMetrics?.falseRate ?? sessionMetrics.falseRefundRate).toFixed(1)}%`}
            warn={(batchMetrics?.falseRate ?? sessionMetrics.falseRefundRate) > 0}
          />
          <MetricCard
            title="Human review queue"
            value={String(
              isBatch
                ? batchDecisions.filter((d) => d.verdict === "human_review").length
                : sessionMetrics.humanReviewCount
            )}
          />
          <MetricCard
            title="Processing time"
            value={`${decision.processingMs} ms`}
          />
        </div>
      )}

      {isBatch && (
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-zinc-900">Verdict distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={verdictBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {verdictBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex justify-center gap-4 text-xs text-zinc-600">
              {verdictBreakdown.map((v) => (
                <span key={v.name} className="flex items-center gap-1">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: v.color }}
                  />
                  {v.name}: {v.value}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-zinc-900">Refund amounts by verdict</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={[
                  {
                    name: "Approved",
                    amount: batchDecisions
                      .filter((d) => d.verdict === "approve")
                      .reduce((s, d) => s + (d.order?.amountUsd ?? 0), 0),
                  },
                  {
                    name: "Denied",
                    amount: batchDecisions
                      .filter((d) => d.verdict === "deny")
                      .reduce((s, d) => s + (d.order?.amountUsd ?? 0), 0),
                  },
                  {
                    name: "Review",
                    amount: batchDecisions
                      .filter((d) => d.verdict === "human_review")
                      .reduce((s, d) => s + (d.order?.amountUsd ?? 0), 0),
                  },
                ]}
              >
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {verdictBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {!isBatch && (
        <>
          <ClaimResolveFlowDiagram decision={decision} />

          <div
            className={`mb-8 mt-8 rounded-2xl border p-8 text-center ring-1 ${config.bg} ${config.ring}`}
          >
            <Icon className={`mx-auto mb-4 h-14 w-14 ${config.text}`} />
            <h2 className={`text-2xl font-bold ${config.text}`}>{config.label}</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Order {decision.submission.orderId.toUpperCase()} ·{" "}
              {decision.order
                ? `$${decision.order.amountUsd.toFixed(2)} — ${decision.order.productName}`
                : "Order not found"}
            </p>
            {decision.isFalseApproval && (
              <div className="mx-auto mt-4 flex max-w-md items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-800">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Guardrail alert: this auto-approval differs from ground-truth review outcome
              </div>
            )}
          </div>

          {decision.order && (
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <OrderDetail label="Customer" value={decision.order.customerEmail} />
              <OrderDetail
                label="Transaction age"
                value={`${getOrderAgeDays(decision.order)} days`}
              />
              <OrderDetail
                label="Account warnings"
                value={String(decision.order.accountWarnings)}
              />
              <OrderDetail
                label="Prior claims (90d)"
                value={String(decision.order.priorClaims90Days)}
              />
            </div>
          )}

          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h3 className="mb-4 text-sm font-semibold text-zinc-900">
                {decision.triggeredRules.length > 0 ? "Rules triggered" : "Policy evaluation"}
              </h3>
              <ul className="space-y-3">
                {(showAllRules ? decision.allEvaluations : decision.triggeredRules.length > 0 ? decision.triggeredRules : decision.allEvaluations.filter(e => e.passed).slice(0, 2)).map((rule) => (
                  <li
                    key={rule.policyId}
                    className={`rounded-lg border px-4 py-3 ${
                      rule.passed
                        ? "border-emerald-100 bg-emerald-50/50"
                        : rule.severity === "deny"
                          ? "border-red-100 bg-red-50/50"
                          : "border-amber-100 bg-amber-50/50"
                    }`}
                  >
                    <div className="text-sm font-medium text-zinc-900">{rule.policyName}</div>
                    <div className="mt-0.5 text-sm text-zinc-600">{rule.message}</div>
                    <div className="mt-1 text-xs text-zinc-400">{rule.detail}</div>
                  </li>
                ))}
              </ul>
              {decision.allEvaluations.length > decision.triggeredRules.length && (
                <button
                  type="button"
                  onClick={() => setShowAllRules(!showAllRules)}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-900"
                >
                  {showAllRules ? (
                    <>
                      <ChevronUp className="h-3.5 w-3.5" /> Show triggered only
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3.5 w-3.5" /> Show all {decision.allEvaluations.length} checks
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                  <Mail className="h-4 w-4" />
                  Customer notification draft
                </h3>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
              <div className="rounded-lg bg-zinc-50 p-4">
                <div className="mb-3 border-b border-zinc-200 pb-2 text-sm font-medium text-zinc-800">
                  Subject: {decision.emailDraft.subject}
                </div>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-600">
                  {decision.emailDraft.body}
                </pre>
              </div>
            </div>
          </div>
        </>
      )}

      {isBatch && batchDecisions && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-zinc-900">Batch results</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-xs text-zinc-500">
                  <th className="pb-3 pr-4 font-medium">Order</th>
                  <th className="pb-3 pr-4 font-medium">Amount</th>
                  <th className="pb-3 pr-4 font-medium">Verdict</th>
                  <th className="pb-3 pr-4 font-medium">Primary rule</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {batchDecisions.map((d) => {
                  const vc = VERDICT_CONFIG[d.verdict];
                  const rowKey = d.submission.orderId;
                  const expanded = expandedBatchId === rowKey;
                  return (
                    <Fragment key={rowKey}>
                      <tr className="border-b border-zinc-50">
                        <td className="py-3 pr-4 font-mono text-xs">{d.submission.orderId}</td>
                        <td className="py-3 pr-4">${d.order?.amountUsd.toFixed(2) ?? "—"}</td>
                        <td className="py-3 pr-4">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${vc.bg} ${vc.text}`}
                          >
                            {vc.label}
                          </span>
                          {d.isFalseApproval && (
                            <AlertTriangle className="ml-1 inline h-3.5 w-3.5 text-red-500" />
                          )}
                        </td>
                        <td className="max-w-xs truncate py-3 pr-4 text-zinc-600">
                          {d.triggeredRules[0]?.message ?? "All policies passed"}
                        </td>
                        <td className="py-3">
                          <button
                            type="button"
                            onClick={() => setExpandedBatchId(expanded ? null : rowKey)}
                            className="text-xs text-emerald-700 hover:underline"
                          >
                            {expanded ? "Hide" : "Details"}
                          </button>
                        </td>
                      </tr>
                      {expanded && (
                        <tr>
                          <td colSpan={5} className="bg-zinc-50 px-4 py-3">
                            <pre className="whitespace-pre-wrap text-xs text-zinc-600">
                              {d.emailDraft.body}
                            </pre>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="text-xs font-medium text-zinc-500">{label}</div>
      <div className="mt-1 truncate text-sm font-semibold text-zinc-900">{value}</div>
    </div>
  );
}

function MetricCard({
  title,
  subtitle,
  value,
  highlight,
  warn,
}: {
  title: string;
  subtitle?: string;
  value: string;
  highlight?: boolean;
  warn?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        warn
          ? "border-red-200 bg-red-50"
          : highlight
            ? "border-emerald-200 bg-emerald-50"
            : "border-zinc-200 bg-white"
      }`}
    >
      <div className="text-xs font-medium text-zinc-500">
        {title}
        {subtitle && <span className="block text-[10px] text-zinc-400">{subtitle}</span>}
      </div>
      <div
        className={`mt-1 text-2xl font-bold ${
          warn ? "text-red-700" : highlight ? "text-emerald-700" : "text-zinc-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
