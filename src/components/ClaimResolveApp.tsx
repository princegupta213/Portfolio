"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Settings2,
  FileInput,
  Play,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Sparkles,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { getPoliciesForScenario } from "@/lib/claim-resolve/scenarios";
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
import { PROJECT_THEMES, ENTERPRISE_SCENARIOS } from "@/lib/project-themes";
import {
  EnterpriseAuditLog,
  ProjectDemoShell,
} from "@/components/enterprise/ProjectDemoShell";
import { EditableSection, AdminActionButton } from "@/components/enterprise/RbacControls";
import { ClaimResolveVerdict } from "@/components/ClaimResolveVerdict";
import { ClaimResolveFlowDiagram } from "@/components/ClaimResolveFlowDiagram";

const theme = PROJECT_THEMES["claim-resolve"];
const scenarios = ENTERPRISE_SCENARIOS["claim-resolve"] ?? [];

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

function auditTimestamp(): string {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

export function ClaimResolveApp() {
  const [tab, setTab] = useState<ClaimResolveTab>("submit");
  const [scenario, setScenario] = useState("standard");
  const [policies, setPolicies] = useState<RefundPolicy[]>(() =>
    getPoliciesForScenario("standard")
  );
  const [auditLog, setAuditLog] = useState<{ time: string; message: string }[]>([]);
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [reason, setReason] = useState<string>(REASONS[0]);
  const [decision, setDecision] = useState<ClaimDecision | null>(null);
  const [sessionDecisions, setSessionDecisions] = useState<ClaimDecision[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [batchResults, setBatchResults] = useState<ClaimDecision[] | null>(null);

  const addAudit = useCallback((message: string) => {
    setAuditLog((prev) => [...prev, { time: auditTimestamp(), message }]);
  }, []);

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

  const shellMetrics = useMemo(
    () => [
      {
        label: "Auto-Resolution Rate",
        value: `${sessionMetrics.totalProcessed > 0 ? sessionMetrics.autoResolutionRate.toFixed(0) : batchPreview.autoResolutionRate.toFixed(0)}%`,
        sublabel: "North star metric",
      },
      {
        label: "False Refund Rate",
        value: `${sessionMetrics.totalProcessed > 0 ? sessionMetrics.falseRefundRate.toFixed(1) : batchPreview.falseRefundRate.toFixed(1)}%`,
        sublabel: "Guardrail",
        warn:
          (sessionMetrics.totalProcessed > 0
            ? sessionMetrics.falseRefundRate
            : batchPreview.falseRefundRate) > 0,
      },
      {
        label: "Processed",
        value: String(sessionMetrics.totalProcessed),
        sublabel: "This session",
      },
      {
        label: "Review queue",
        value: String(
          sessionMetrics.totalProcessed > 0
            ? sessionMetrics.humanReviewCount
            : batchPreview.humanReviewCount
        ),
      },
    ],
    [sessionMetrics, batchPreview]
  );

  const handleScenarioChange = useCallback(
    (id: string) => {
      setScenario(id);
      setPolicies(getPoliciesForScenario(id));
      const label = scenarios.find((s) => s.id === id)?.label ?? id;
      addAudit(`Scenario → ${label} (policies loaded)`);
    },
    [addAudit]
  );

  const resetPolicies = () => {
    setPolicies(getPoliciesForScenario(scenario));
    addAudit("Policies reset to scenario defaults");
  };

  const runWithLoading = useCallback(
    (fn: () => ClaimDecision) => {
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
        addAudit(
          `Claim ${result.submission.orderId} → ${result.verdict.replace("_", " ")} ($${result.order?.amountUsd.toFixed(2) ?? "0"})`
        );
        setLoading(false);
      }, 850);
    },
    [addAudit]
  );

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
      const metrics = computeSessionMetrics(results);
      setBatchResults(results);
      setSessionDecisions((prev) => [...prev, ...results]);
      addAudit(
        `Batch triage: ${results.length} claims · ${metrics.autoResolutionRate.toFixed(0)}% auto-resolved · ${metrics.humanReviewCount} review`
      );
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
    <ProjectDemoShell
      theme={theme}
      metrics={shellMetrics}
      scenarios={scenarios}
      activeScenario={scenario}
      onScenarioChange={handleScenarioChange}
    >
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? theme.tabActive
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
          <div className={`flex flex-col items-center gap-3 rounded-xl border ${theme.pill} py-6`}>
            <Loader2 className={`h-8 w-8 animate-spin ${theme.accent}`} />
            <p className={`text-sm font-medium ${theme.accent}`}>
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
            <EditableSection className="disabled:opacity-70">
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
                  className={`w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:ring-2 ${theme.ring}`}
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
                  className={`w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm uppercase outline-none focus:ring-2 ${theme.ring}`}
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
                  className={`w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:ring-2 ${theme.ring}`}
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
              className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition ${theme.accentMuted}`}
            >
              <Sparkles className="h-4 w-4" />
              Process refund claim
            </button>

            {livePreview && (
              <div className={`mt-4 rounded-lg border border-dashed px-4 py-3 text-sm ${theme.pill}`}>
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
            </EditableSection>
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
                    className={`w-full rounded-lg border border-zinc-100 px-3 py-2.5 text-left text-sm transition hover:border-emerald-200 ${theme.pill}`}
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
        <EditableSection className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm disabled:opacity-70">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="mb-1 text-lg font-semibold text-zinc-900">Policy configuration</h2>
              <p className="text-sm text-zinc-500">
                Toggle rules and adjust thresholds — changes apply to the next claim processed.
              </p>
            </div>
            <button
              type="button"
              onClick={resetPolicies}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to scenario defaults
            </button>
          </div>
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
                        <ToggleRight className={`h-7 w-7 ${theme.accent}`} />
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
                      <ToggleRight className={`h-7 w-7 ${theme.accent}`} />
                    ) : (
                      <ToggleLeft className="h-7 w-7 text-zinc-400" />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </EditableSection>
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
              theme={theme}
            />
            <MetricPill
              label="Projected false refund"
              value={`${batchPreview.falseRefundRate.toFixed(1)}%`}
              warn={batchPreview.falseRefundRate > 0}
              theme={theme}
            />
            <MetricPill
              label="Review queue"
              value={String(batchPreview.humanReviewCount)}
              theme={theme}
            />
          </div>

          <div className="mt-8 text-center">
            <AdminActionButton
              onClick={runBatch}
              className={`inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white ${theme.accentMuted}`}
            >
              <Play className="h-4 w-4" />
              Run batch triage
            </AdminActionButton>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-zinc-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              North star: auto-resolution rate · Guardrail: false refund rate
            </p>
          </div>
        </div>
      )}

      <div className="mt-8">
        <EnterpriseAuditLog entries={auditLog} accentClass={theme.accent} />
      </div>
    </ProjectDemoShell>
  );
}

function MetricPill({
  label,
  value,
  highlight,
  warn,
  theme,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  warn?: boolean;
  theme: (typeof PROJECT_THEMES)[keyof typeof PROJECT_THEMES];
}) {
  return (
    <div
      className={`rounded-lg px-4 py-2 text-center ${
        warn ? theme.statWarn : highlight ? theme.statHighlight : "bg-white ring-1 ring-zinc-200"
      }`}
    >
      <div
        className={`text-lg font-bold ${
          warn ? "text-red-700" : highlight ? theme.accent : "text-zinc-800"
        }`}
      >
        {value}
      </div>
      <div className="text-xs text-zinc-500">{label}</div>
    </div>
  );
}
