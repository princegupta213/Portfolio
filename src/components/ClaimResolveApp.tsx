"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ShieldCheck,
  Settings2,
  FileInput,
  Play,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { DEFAULT_POLICIES } from "@/lib/claim-resolve/policies";
import { MOCK_ORDERS, REFUND_REASONS } from "@/lib/claim-resolve/orders";
import {
  computeSessionMetrics,
  getDefaultBatchMetrics,
  processClaim,
  runBatchDemo,
} from "@/lib/claim-resolve/engine";
import type {
  ClaimDecision,
  ClaimResolveTab,
  RefundPolicy,
} from "@/lib/claim-resolve/types";
import { ClaimResolveVerdict } from "@/components/ClaimResolveVerdict";
import { ClaimResolveFlowDiagram } from "@/components/ClaimResolveFlowDiagram";

const TABS: { id: ClaimResolveTab; label: string; icon: React.ReactNode }[] = [
  { id: "submit", label: "Submit Claim", icon: <FileInput className="h-4 w-4" /> },
  { id: "policies", label: "Policy Config", icon: <Settings2 className="h-4 w-4" /> },
  { id: "batch", label: "Batch Demo", icon: <Play className="h-4 w-4" /> },
];

const REASONS = [...REFUND_REASONS];

const LOADING_STEPS = [
  "Looking up order…",
  "Verifying customer identity…",
  "Evaluating refund policies…",
  "Drafting notification…",
];

export function ClaimResolveApp() {
  const [tab, setTab] = useState<ClaimResolveTab>("submit");
  const [policies, setPolicies] = useState<RefundPolicy[]>(DEFAULT_POLICIES);
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [reason, setReason] = useState<string>(REASONS[0]);
  const [decision, setDecision] = useState<ClaimDecision | null>(null);
  const [sessionDecisions, setSessionDecisions] = useState<ClaimDecision[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [batchResults, setBatchResults] = useState<ClaimDecision[] | null>(null);

  const sessionMetrics = useMemo(
    () => computeSessionMetrics(sessionDecisions),
    [sessionDecisions]
  );

  const livePreview = useMemo(() => {
    if (!email.trim() || !orderId.trim()) return null;
    return processClaim(
      {
        email: email.trim(),
        orderId: orderId.trim(),
        reason,
        submittedAt: new Date().toISOString(),
      },
      policies
    );
  }, [email, orderId, reason, policies]);

  const batchPreview = useMemo(() => getDefaultBatchMetrics(policies), [policies]);

  const runWithLoading = useCallback((fn: () => ClaimDecision) => {
    setLoading(true);
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1));
    }, 200);
    setTimeout(() => {
      clearInterval(interval);
      const result = fn();
      setDecision(result);
      setSessionDecisions((prev) => [...prev, result]);
      setLoading(false);
    }, 850);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !orderId.trim()) return;
    runWithLoading(() =>
      processClaim(
        {
          email: email.trim(),
          orderId: orderId.trim(),
          reason,
          submittedAt: new Date().toISOString(),
        },
        policies
      )
    );
  };

  const runBatch = () => {
    setLoading(true);
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1));
    }, 150);
    setTimeout(() => {
      clearInterval(interval);
      const samples = MOCK_ORDERS.map((o) => ({
        email: o.customerEmail,
        orderId: o.orderId,
        reason: REASONS[0],
      }));
      const results = runBatchDemo(policies, samples);
      setBatchResults(results);
      setSessionDecisions((prev) => [...prev, ...results]);
      setLoading(false);
    }, 900);
  };

  const togglePolicy = (id: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const updatePolicyValue = (id: string, value: number | boolean) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, value } : p))
    );
  };

  const fillSample = (sampleOrderId: string) => {
    const order = MOCK_ORDERS.find((o) => o.orderId === sampleOrderId);
    if (order) {
      setOrderId(order.orderId);
      setEmail(order.customerEmail);
      setTab("submit");
    }
  };

  const resetVerdict = () => {
    setDecision(null);
    setBatchResults(null);
  };

  if (decision && !batchResults) {
    return (
      <ClaimResolveVerdict
        decision={decision}
        sessionMetrics={sessionMetrics}
        onReset={resetVerdict}
        onNewClaim={() => {
          setDecision(null);
          setEmail("");
          setOrderId("");
        }}
      />
    );
  }

  if (batchResults) {
    return (
      <ClaimResolveVerdict
        decision={batchResults[0]}
        batchDecisions={batchResults}
        sessionMetrics={computeSessionMetrics(sessionDecisions)}
        onReset={resetVerdict}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700">
          <ShieldCheck className="h-4 w-4" />
          Fintech · Customer Operations
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          ClaimResolve
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-zinc-600">
          Automated customer refund triage — evaluate claims against policy rules,
          auto-approve or deny low-risk cases, and route edge cases to human review.
        </p>
        {sessionMetrics.totalProcessed > 0 && (
          <div className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-4">
            <MetricPill
              label="Auto-Resolution Rate"
              value={`${sessionMetrics.autoResolutionRate.toFixed(0)}%`}
              highlight
            />
            <MetricPill
              label="False Refund Rate"
              value={`${sessionMetrics.falseRefundRate.toFixed(1)}%`}
              warn={sessionMetrics.falseRefundRate > 0}
            />
            <MetricPill label="Processed" value={String(sessionMetrics.totalProcessed)} />
          </div>
        )}
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="mb-8 space-y-4">
          <ClaimResolveFlowDiagram activeStep={loadingStep} compact />
          <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 py-6">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="text-sm font-medium text-emerald-800">
              {LOADING_STEPS[loadingStep]}
            </p>
          </div>
        </div>
      )}

      {!loading && (
        <div className="mb-8">
          <ClaimResolveFlowDiagram decision={livePreview ?? undefined} compact />
        </div>
      )}

      {!loading && tab === "submit" && (
        <div className="grid gap-8 lg:grid-cols-5">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-3"
          >
            <h2 className="mb-1 text-lg font-semibold text-zinc-900">
              Customer refund portal
            </h2>
            <p className="mb-6 text-sm text-zinc-500">
              Mock submission form — enter email and order ID to run policy engine.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none ring-emerald-500 focus:ring-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="orderId" className="mb-1.5 block text-sm font-medium text-zinc-700">
                  Order ID
                </label>
                <input
                  id="orderId"
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="ORD-1001"
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm uppercase outline-none ring-emerald-500 focus:ring-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="reason" className="mb-1.5 block text-sm font-medium text-zinc-700">
                  Refund reason
                </label>
                <select
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none ring-emerald-500 focus:ring-2"
                >
                  {REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Sparkles className="h-4 w-4" />
              Process refund claim
            </button>

            {livePreview && (
              <div className="mt-4 rounded-lg border border-dashed border-emerald-200 bg-emerald-50/30 px-4 py-3 text-sm">
                <span className="font-medium text-zinc-700">Live preview: </span>
                <span
                  className={`font-semibold ${
                    livePreview.verdict === "approve"
                      ? "text-emerald-700"
                      : livePreview.verdict === "deny"
                        ? "text-red-700"
                        : "text-amber-700"
                  }`}
                >
                  {livePreview.verdict === "approve"
                    ? "Approve"
                    : livePreview.verdict === "deny"
                      ? "Deny"
                      : "Human review"}
                </span>
                {livePreview.triggeredRules[0] && (
                  <span className="text-zinc-500">
                    {" "}
                    — {livePreview.triggeredRules[0].message}
                  </span>
                )}
              </div>
            )}
          </form>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h3 className="mb-1 text-sm font-semibold text-zinc-900">Try sample orders</h3>
            <p className="mb-4 text-xs text-zinc-500">
              Click to pre-fill — each triggers a different policy outcome.
            </p>
            <ul className="space-y-2">
              {MOCK_ORDERS.map((o) => (
                <li key={o.orderId}>
                  <button
                    type="button"
                    onClick={() => fillSample(o.orderId)}
                    className="w-full rounded-lg border border-zinc-100 px-3 py-2.5 text-left text-sm transition hover:border-emerald-200 hover:bg-emerald-50/50"
                  >
                    <span className="font-mono font-medium text-zinc-800">{o.orderId}</span>
                    <span className="mt-0.5 block text-xs text-zinc-500">
                      ${o.amountUsd.toFixed(2)} · {o.groundTruth.replace("_", " ")}
                      {o.notes ? ` — ${o.notes}` : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!loading && tab === "policies" && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-zinc-900">Policy configuration</h2>
          <p className="mb-6 text-sm text-zinc-500">
            Toggle rules and adjust thresholds — changes apply to the next claim processed.
          </p>
          <ul className="divide-y divide-zinc-100">
            {policies.map((policy) => (
              <li key={policy.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-900">{policy.name}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                        policy.severity === "deny"
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {policy.severity === "deny" ? "Auto-deny" : "Review"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-zinc-500">{policy.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  {policy.paramType === "currency" && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-zinc-500">$</span>
                      <input
                        type="number"
                        min={1}
                        max={500}
                        value={policy.value as number}
                        onChange={(e) => updatePolicyValue(policy.id, Number(e.target.value))}
                        disabled={!policy.enabled}
                        className="w-20 rounded border border-zinc-200 px-2 py-1 text-sm disabled:opacity-50"
                      />
                    </div>
                  )}
                  {policy.paramType === "days" && (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={1}
                        max={365}
                        value={policy.value as number}
                        onChange={(e) => updatePolicyValue(policy.id, Number(e.target.value))}
                        disabled={!policy.enabled}
                        className="w-16 rounded border border-zinc-200 px-2 py-1 text-sm disabled:opacity-50"
                      />
                      <span className="text-sm text-zinc-500">days</span>
                    </div>
                  )}
                  {policy.paramType === "count" && (
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={policy.value as number}
                      onChange={(e) => updatePolicyValue(policy.id, Number(e.target.value))}
                      disabled={!policy.enabled}
                      className="w-16 rounded border border-zinc-200 px-2 py-1 text-sm disabled:opacity-50"
                    />
                  )}
                  {policy.paramType === "toggle" && (
                    <button
                      type="button"
                      onClick={() => updatePolicyValue(policy.id, !(policy.value as boolean))}
                      disabled={!policy.enabled}
                      className="text-zinc-600 disabled:opacity-50"
                    >
                      {(policy.value as boolean) ? (
                        <ToggleRight className="h-7 w-7 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="h-7 w-7" />
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => togglePolicy(policy.id)}
                    aria-label={`Toggle ${policy.name}`}
                  >
                    {policy.enabled ? (
                      <ToggleRight className="h-7 w-7 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="h-7 w-7 text-zinc-400" />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && tab === "batch" && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-zinc-900">Batch policy simulation</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-zinc-500">
              Process all {MOCK_ORDERS.length} mock orders against current policies to measure
              auto-resolution rate and false refund guardrails.
            </p>
          </div>

          <div className="mx-auto mt-6 grid max-w-lg gap-3 sm:grid-cols-3">
            <MetricPill
              label="Projected auto-rate"
              value={`${batchPreview.autoResolutionRate.toFixed(0)}%`}
              highlight
            />
            <MetricPill
              label="Projected false refund"
              value={`${batchPreview.falseRefundRate.toFixed(1)}%`}
              warn={batchPreview.falseRefundRate > 0}
            />
            <MetricPill
              label="Review queue"
              value={String(batchPreview.humanReviewCount)}
            />
          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={runBatch}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <Play className="h-4 w-4" />
              Run batch triage
            </button>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-zinc-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              North star: auto-resolution rate · Guardrail: false refund rate
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricPill({
  label,
  value,
  highlight,
  warn,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  warn?: boolean;
}) {
  return (
    <div
      className={`rounded-lg px-4 py-2 text-center ${
        warn
          ? "bg-red-50 ring-1 ring-red-100"
          : highlight
            ? "bg-emerald-50 ring-1 ring-emerald-100"
            : "bg-white ring-1 ring-zinc-200"
      }`}
    >
      <div
        className={`text-lg font-bold ${
          warn ? "text-red-700" : highlight ? "text-emerald-700" : "text-zinc-800"
        }`}
      >
        {value}
      </div>
      <div className="text-xs text-zinc-500">{label}</div>
    </div>
  );
}
