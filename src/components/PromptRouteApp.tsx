"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  Route,
  Zap,
  Settings2,
  Play,
  Sparkles,
  GitBranch,
  ToggleLeft,
  ToggleRight,
  Shield,
  BookOpen,
  Loader2,
  DollarSign,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { MOCK_LLM_PROMPTS } from "@/data/mock/prompt-route";
import {
  getDailyBudgetCap,
  getPoliciesForScenario,
  getPromptsForScenario,
} from "@/lib/prompt-route/scenarios";
import { LLM_MODELS, getModel } from "@/lib/prompt-route/models";
import {
  classifyPrompt,
  getClassificationScores,
} from "@/lib/prompt-route/classifier";
import { routeRequest } from "@/lib/prompt-route/router";
import {
  runSimulation,
  simulateSinglePrompt,
  simulateFailoverScenario,
} from "@/lib/prompt-route/simulator";
import { hashString } from "@/lib/prompt-route/seeded-random";
import type { PromptRouteTab, RoutingPolicy, SimulationResult } from "@/lib/prompt-route/types";
import { PROJECT_THEMES, ENTERPRISE_SCENARIOS } from "@/lib/project-themes";
import {
  EnterpriseAuditLog,
  ProjectDemoShell,
} from "@/components/enterprise/ProjectDemoShell";
import { EditableSection, AdminActionButton } from "@/components/enterprise/RbacControls";
import { PromptRouteDashboard } from "@/components/PromptRouteDashboard";
import { PromptRouteFlowDiagram } from "@/components/PromptRouteFlowDiagram";

const theme = PROJECT_THEMES["prompt-route"];
const scenarios = ENTERPRISE_SCENARIOS["prompt-route"] ?? [];

const TABS: { id: PromptRouteTab; label: string; icon: React.ReactNode }[] = [
  { id: "simulate", label: "Simulate", icon: <Play className="h-4 w-4" /> },
  { id: "classifier", label: "Classifier", icon: <Sparkles className="h-4 w-4" /> },
  { id: "policies", label: "Routing Rules", icon: <Settings2 className="h-4 w-4" /> },
  { id: "failover", label: "Failover", icon: <Shield className="h-4 w-4" /> },
];

const LOADING_STEPS = [
  "Classifying task complexity…",
  "Matching routing policy…",
  "Checking rate limits…",
  "Computing cost & latency…",
];

const SCORE_COLORS = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ec4899"];

function auditTimestamp(): string {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

export function PromptRouteApp() {
  const [tab, setTab] = useState<PromptRouteTab>("simulate");
  const [scenario, setScenario] = useState("support");
  const [policies, setPolicies] = useState<RoutingPolicy[]>(() =>
    getPoliciesForScenario("support")
  );
  const [auditLog, setAuditLog] = useState<{ time: string; message: string }[]>([]);
  const [dailySpendUsd, setDailySpendUsd] = useState(127.42);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [customPrompt, setCustomPrompt] = useState("");
  const [classifierPreview, setClassifierPreview] = useState("");
  const [semanticCacheEnabled, setSemanticCacheEnabled] = useState(false);

  const budgetCap = getDailyBudgetCap(scenario);
  const budgetUsedPct = Math.min(100, (dailySpendUsd / budgetCap) * 100);

  const addAudit = useCallback((message: string) => {
    setAuditLog((prev) => [...prev, { time: auditTimestamp(), message }]);
  }, []);

  const recordSimulation = useCallback(
    (simResult: SimulationResult, label: string) => {
      setDailySpendUsd((prev) =>
        Math.round((prev + simResult.metrics.totalRoutedCostUsd) * 100) / 100
      );
      addAudit(
        `${label}: ${simResult.totalRequests} req · $${simResult.metrics.totalRoutedCostUsd.toFixed(4)} · ${simResult.metrics.costSavingsPct.toFixed(0)}% savings`
      );
    },
    [addAudit]
  );

  const handleScenarioChange = useCallback(
    (id: string) => {
      setScenario(id);
      setPolicies(getPoliciesForScenario(id));
      const label = scenarios.find((s) => s.id === id)?.label ?? id;
      addAudit(`Scenario → ${label} (policies + prompt set updated)`);
    },
    [addAudit]
  );

  const runWithLoading = useCallback(
    (fn: () => SimulationResult, auditLabel: string) => {
      setLoading(true);
      setLoadingStep(0);
      const interval = setInterval(() => {
        setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1));
      }, 180);
      setTimeout(() => {
        clearInterval(interval);
        const simResult = fn();
        recordSimulation(simResult, auditLabel);
        setResult(simResult);
        setLoading(false);
      }, 750);
    },
    [recordSimulation]
  );

  const scenarioPrompts = useMemo(() => getPromptsForScenario(scenario), [scenario]);

  const runBatch = useCallback(() => {
    runWithLoading(
      () => runSimulation({ prompts: scenarioPrompts, policies, seeded: true, semanticCacheEnabled }),
      "Batch simulation"
    );
  }, [policies, runWithLoading, scenarioPrompts, semanticCacheEnabled]);

  const runCustom = useCallback(() => {
    if (!customPrompt.trim()) return;
    runWithLoading(
      () => runSimulation({ prompts: [customPrompt.trim()], policies, seeded: true, semanticCacheEnabled }),
      "Single prompt route"
    );
  }, [customPrompt, policies, runWithLoading, semanticCacheEnabled]);

  const runFailoverDemo = useCallback(() => {
    runWithLoading(
      () => simulateFailoverScenario(policies),
      "Failover drill"
    );
  }, [policies, runWithLoading]);

  const togglePolicy = (id: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const livePreview = useMemo(() => {
    if (!customPrompt.trim()) return null;
    const classification = classifyPrompt(customPrompt.trim());
    const route = routeRequest(classification, {
      policies,
      simulateRateLimit: false,
      seed: hashString(customPrompt),
    });
    return { classification, route };
  }, [customPrompt, policies]);

  const shellMetrics = useMemo(
    () => [
      {
        label: "Daily spend",
        value: `$${dailySpendUsd.toFixed(2)}`,
        sublabel: `of $${budgetCap.toFixed(0)} cap`,
        warn: budgetUsedPct >= 85,
      },
      {
        label: "Budget used",
        value: `${budgetUsedPct.toFixed(0)}%`,
        sublabel: "Rolling 24h window",
        warn: budgetUsedPct >= 85,
      },
      {
        label: "Active policies",
        value: String(policies.filter((p) => p.enabled).length),
        sublabel: `${policies.length} total rules`,
      },
      {
        label: "Scenario prompts",
        value: String(scenarioPrompts.length),
        sublabel: "Sample batch size",
      },
    ],
    [dailySpendUsd, budgetCap, budgetUsedPct, policies, scenarioPrompts.length]
  );

  if (result) {
    return <PromptRouteDashboard result={result} onReset={() => setResult(null)} />;
  }

  return (
    <ProjectDemoShell
      theme={theme}
      metrics={shellMetrics}
      scenarios={scenarios}
      activeScenario={scenario}
      onScenarioChange={handleScenarioChange}
      footer={
        <Link
          href="/projects/prompt-route/case-study"
          className={`inline-flex items-center gap-1.5 font-medium ${theme.accent} hover:opacity-80`}
        >
          <BookOpen className="h-4 w-4" />
          Read case study
        </Link>
      }
    >
      <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <DollarSign className={`h-5 w-5 ${theme.accent}`} />
            <div>
              <p className="text-sm font-semibold text-zinc-900">Daily budget cap</p>
              <p className="text-xs text-zinc-500">Mock spend tracker for routing simulations</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-lg font-bold ${budgetUsedPct >= 85 ? "text-amber-700" : theme.accent}`}>
              ${dailySpendUsd.toFixed(2)} / ${budgetCap.toFixed(0)}
            </p>
            <p className="text-xs text-zinc-500">{budgetUsedPct.toFixed(0)}% utilized</p>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100">
          <div
            className={`h-full transition-all duration-500 ${
              budgetUsedPct >= 85 ? "bg-amber-500" : "bg-indigo-600"
            }`}
            style={{ width: `${budgetUsedPct}%` }}
          />
        </div>
      </div>

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
        <div className={`mb-6 flex items-center justify-center gap-3 rounded-xl border px-6 py-4 text-sm font-medium ${theme.pill}`}>
          <Loader2 className={`h-4 w-4 animate-spin ${theme.accent}`} />
          {LOADING_STEPS[loadingStep]}
        </div>
      )}

      {tab === "simulate" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="mb-4 flex items-center gap-2">
                <Zap className={`h-5 w-5 ${theme.accent}`} />
                <h2 className="font-semibold text-zinc-900">Batch Simulation</h2>
              </div>
              <p className="mb-4 text-sm text-zinc-600">
                Run {scenarioPrompts.length} prompts for the{" "}
                <span className="font-medium">{scenarios.find((s) => s.id === scenario)?.label}</span>{" "}
                scenario — chat, code, summarization, extraction, and reasoning workloads with
                deterministic routing and simulated 429 failover.
              </p>
              <div className="mb-4 flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-zinc-900">Semantic cache</p>
                  <p className="text-xs text-zinc-500">
                    Exact-duplicate prompts return cached responses (~8 ms, $0)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSemanticCacheEnabled(!semanticCacheEnabled)}
                  className="focus:outline-none"
                  aria-label="Toggle Semantic Cache"
                >
                  {semanticCacheEnabled ? (
                    <ToggleRight className="h-9 w-9 text-indigo-600" />
                  ) : (
                    <ToggleLeft className="h-9 w-9 text-zinc-300" />
                  )}
                </button>
              </div>
              <AdminActionButton
                onClick={runBatch}
                disabled={loading}
                className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white ${theme.accentMuted}`}
              >
                <Play className="h-4 w-4" />
                Run sample batch ({scenarioPrompts.length})
              </AdminActionButton>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="mb-4 flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-violet-600" />
                <h2 className="font-semibold text-zinc-900">Single Prompt</h2>
              </div>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Paste an LLM prompt to classify and route…"
                rows={4}
                className={`mb-3 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 ${theme.ring}`}
              />
              {livePreview && (
                <div className="mb-3">
                  <PromptRouteFlowDiagram
                    classification={livePreview.classification}
                    route={livePreview.route}
                    compact
                  />
                </div>
              )}
              <button
                type="button"
                onClick={runCustom}
                disabled={loading || !customPrompt.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
              >
                <Route className="h-4 w-4" />
                Route & analyze
              </button>
              <div className="mt-3 flex flex-wrap gap-2">
                {MOCK_LLM_PROMPTS.filter((p) =>
                  getPromptsForScenario(scenario).includes(p.prompt)
                )
                  .slice(0, 4)
                  .map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setCustomPrompt(p.prompt)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-zinc-200 hover:ring-indigo-200 ${theme.pill}`}
                    >
                      {p.label}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          <PromptRouteFlowDiagram />

          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-zinc-900">Model Catalog & Pricing</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-zinc-500">
                  <tr>
                    <th className="pb-2 font-medium">Model</th>
                    <th className="pb-2 font-medium">Provider</th>
                    <th className="pb-2 font-medium">Input / 1M</th>
                    <th className="pb-2 font-medium">Output / 1M</th>
                    <th className="pb-2 font-medium">Latency</th>
                    <th className="pb-2 font-medium">RPM Limit</th>
                    <th className="pb-2 font-medium">Best for</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {LLM_MODELS.map((m) => (
                    <tr key={m.id} className={m.id === "gpt-4o" ? "bg-zinc-50" : ""}>
                      <td className="py-2 font-medium text-zinc-800">
                        {m.name}
                        {m.id === "gpt-4o" && (
                          <span className="ml-2 rounded bg-zinc-200 px-1.5 py-0.5 text-xs text-zinc-600">
                            baseline
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-zinc-600">{m.provider}</td>
                      <td className="py-2 font-mono text-xs">${m.inputCostPer1M}</td>
                      <td className="py-2 font-mono text-xs">${m.outputCostPer1M}</td>
                      <td className="py-2 text-zinc-600">{m.avgLatencyMs} ms</td>
                      <td className="py-2 text-zinc-600">{m.rateLimitRpm.toLocaleString()}</td>
                      <td className="py-2 text-xs text-zinc-500">
                        {m.strengths.slice(0, 2).join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "classifier" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-zinc-900">Task Complexity Classifier</h2>
            <textarea
              value={classifierPreview}
              onChange={(e) => setClassifierPreview(e.target.value)}
              placeholder="Enter a prompt to see how the classifier scores it…"
              rows={5}
              className={`mb-4 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 ${theme.ring}`}
            />
            {classifierPreview.trim() ? (
              <ClassifierPreview prompt={classifierPreview} />
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-zinc-500">Try a mock prompt:</p>
                {MOCK_LLM_PROMPTS.slice(0, 6).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setClassifierPreview(p.prompt)}
                    className="block w-full rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100"
                  >
                    <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${theme.pill}`}>
                      {p.label}
                    </span>
                    <span className="mt-1 block truncate text-zinc-600">{p.prompt}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "policies" && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-600">
            PM-configurable routing rules. Toggle policies to change routing in the next simulation.
          </p>
          {policies.map((policy) => (
            <PolicyCard
              key={policy.id}
              policy={policy}
              onToggle={() => togglePolicy(policy.id)}
            />
          ))}
        </div>
      )}

      {tab === "failover" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
            <div className="mb-2 flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-700" />
              <h2 className="font-semibold text-amber-900">Circuit Breaker & Failover Simulator</h2>
            </div>
            <p className="mb-4 text-sm text-amber-800">
              Simulates a degraded provider state: circuit breaker opens on Gemini Pro after sustained
              429 errors, automatically redirecting code-gen requests to Claude Sonnet while tracking
              recovery metrics.
            </p>
            <button
              type="button"
              onClick={runFailoverDemo}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
            >
              <Shield className="h-4 w-4" />
              Simulate circuit breaker trip
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FailoverCard
              title="HTTP 429"
              desc="Primary model rate limited — request redirected to fallback within ~180ms penalty."
            />
            <FailoverCard
              title="Timeout"
              desc="Inference exceeds SLA — same failover path, flagged as timeout not rate limit."
            />
            <FailoverCard
              title="Circuit Open"
              desc="Provider marked unhealthy — all requests skip primary until health check passes."
            />
          </div>
        </div>
      )}

      <div className="mt-8">
        <EnterpriseAuditLog entries={auditLog} accentClass={theme.accent} />
      </div>
    </ProjectDemoShell>
  );
}

function PolicyCard({ policy, onToggle }: { policy: RoutingPolicy; onToggle: () => void }) {
  const primary = getModel(policy.primaryModelId);
  const fallback = getModel(policy.fallbackModelId);

  return (
    <div
      className={`rounded-xl border p-5 transition-colors ${
        policy.enabled ? "border-indigo-200 bg-white" : "border-zinc-200 bg-zinc-50 opacity-70"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-zinc-900">{policy.name}</h3>
          <p className="mt-1 text-sm text-zinc-500">{policy.condition}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs">
              <span className="font-medium text-emerald-800">Primary</span>
              <div className="text-emerald-700">{primary.name}</div>
              <div className="text-emerald-600">${primary.inputCostPer1M}/1M in</div>
            </div>
            <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs">
              <span className="font-medium text-amber-800">Fallback</span>
              <div className="text-amber-700">{fallback.name}</div>
              <div className="text-amber-600">${fallback.inputCostPer1M}/1M in</div>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="shrink-0 text-indigo-600"
          aria-label={policy.enabled ? "Disable policy" : "Enable policy"}
        >
          {policy.enabled ? (
            <ToggleRight className="h-8 w-8" />
          ) : (
            <ToggleLeft className="h-8 w-8 text-zinc-400" />
          )}
        </button>
      </div>
    </div>
  );
}

function FailoverCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <h3 className="font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600">{desc}</p>
    </div>
  );
}

function ClassifierPreview({ prompt }: { prompt: string }) {
  const result = classifyPrompt(prompt);
  const scores = getClassificationScores(prompt);
  const maxScore = Math.max(...scores.map((s) => s.score), 1);
  const chartData = scores.filter((s) => s.score > 0);

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-indigo-50 p-4">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-indigo-600 px-3 py-1 text-sm font-semibold text-white">
            {result.taskLabel}
          </span>
          <span className="text-sm text-indigo-700">{result.confidence}% confidence</span>
          <span className="text-sm text-indigo-600">
            ~{result.estimatedInputTokens} in / ~{result.estimatedOutputTokens} out tokens
          </span>
        </div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-indigo-500">Signals</p>
        <ul className="list-inside list-disc text-sm text-indigo-800">
          {result.signals.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>

      {chartData.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
            Score breakdown
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} layout="vertical">
              <XAxis type="number" domain={[0, maxScore]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="label" width={120} tick={{ fontSize: 11 }} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={SCORE_COLORS[i % SCORE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
