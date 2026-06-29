"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  ArrowLeft,
  Download,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Clock,
  Activity,
  Shield,
  BookOpen,
  TrendingDown,
} from "lucide-react";
import type { SimulationResult } from "@/lib/prompt-route/types";
import { PromptRouteFlowDiagram } from "@/components/PromptRouteFlowDiagram";

const OUTCOME_COLORS: Record<string, string> = {
  primary: "#10b981",
  fallback: "#f59e0b",
  circuit_open: "#ef4444",
};

const MODEL_COLORS = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

interface Props {
  result: SimulationResult;
  onReset: () => void;
}

export function PromptRouteDashboard({ result, onReset }: Props) {
  const { metrics, modelUsage, taskBreakdown, requests } = result;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const latencyData = requests.map((r, i) => ({
    name: `#${i + 1}`,
    router: r.route.routerLatencyMs,
    inference: r.route.totalLatencyMs - r.route.routerLatencyMs,
    total: r.route.totalLatencyMs,
  }));

  const costCompareData = [
    { name: "Routed", cost: metrics.totalRoutedCostUsd * 1000 },
    { name: "Baseline (GPT-4o)", cost: metrics.totalBaselineCostUsd * 1000 },
  ];

  const exportReport = () => {
    const lines = [
      "# PromptRoute Simulation Report",
      "",
      `**Requests:** ${result.totalRequests}`,
      `**Date:** ${new Date(result.simulatedAt).toLocaleString()}`,
      "",
      "## Key Metrics",
      "",
      `| Metric | Value |`,
      `|--------|-------|`,
      `| Cost savings | ${metrics.costSavingsPct.toFixed(1)}% |`,
      `| Latency delta | ${metrics.avgLatencyDeltaMs.toFixed(0)} ms |`,
      `| Router overhead | ${metrics.avgRouterOverheadMs.toFixed(1)} ms |`,
      `| Failover recovery | ${metrics.failoverRecoveryRate.toFixed(0)}% |`,
      `| Tokens/sec | ${metrics.avgTokensPerSecond.toFixed(1)} |`,
      "",
      "## Routes",
      "",
      "| # | Task | Model | Outcome | Cost | Latency |",
      "|---|------|-------|---------|------|---------|",
      ...requests.map(
        (r, i) =>
          `| ${i + 1} | ${r.classification.taskLabel} | ${r.route.routedModel.name} | ${r.route.outcome} | $${r.route.costUsd.toFixed(5)} | ${r.route.totalLatencyMs}ms |`
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "promptroute-report.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <button
        type="button"
        onClick={onReset}
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" />
        New simulation
      </button>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Routing Results</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {result.totalRequests} requests · simulated {new Date(result.simulatedAt).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/projects/prompt-route/case-study"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <BookOpen className="h-4 w-4" />
            Case study
          </Link>
          <button
            type="button"
            onClick={exportReport}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <Download className="h-4 w-4" />
            Export report
          </button>
        </div>
      </div>

      {metrics.costSavingsPct > 0 && (
        <div className="mb-8 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <TrendingDown className="h-6 w-6 text-emerald-600" />
          <div>
            <p className="font-semibold text-emerald-900">
              {metrics.costSavingsPct.toFixed(1)}% cost savings vs. GPT-4o-only baseline
            </p>
            <p className="text-sm text-emerald-700">
              Saved ${(metrics.totalBaselineCostUsd - metrics.totalRoutedCostUsd).toFixed(5)} on this
              batch · router added only {metrics.avgRouterOverheadMs.toFixed(1)} ms overhead
            </p>
          </div>
        </div>
      )}

      {/* KPI cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
          label="Cost Savings"
          value={`${metrics.costSavingsPct.toFixed(1)}%`}
          sub={`$${metrics.totalRoutedCostUsd.toFixed(4)} vs $${metrics.totalBaselineCostUsd.toFixed(4)} baseline`}
          accent="emerald"
        />
        <MetricCard
          icon={<Clock className="h-5 w-5 text-indigo-600" />}
          label="Latency Delta"
          value={`${metrics.avgLatencyDeltaMs > 0 ? "+" : ""}${metrics.avgLatencyDeltaMs.toFixed(0)} ms`}
          sub={`Router overhead: ${metrics.avgRouterOverheadMs.toFixed(1)} ms avg`}
          accent="indigo"
        />
        <MetricCard
          icon={<Shield className="h-5 w-5 text-amber-600" />}
          label="Failover Recovery"
          value={`${metrics.failoverRecoveryRate.toFixed(0)}%`}
          sub={`${metrics.failoverSuccesses}/${metrics.failoverAttempts} rate-limit events resolved`}
          accent="amber"
        />
        <MetricCard
          icon={<Activity className="h-5 w-5 text-violet-600" />}
          label="Throughput"
          value={`${metrics.avgTokensPerSecond.toFixed(0)} tok/s`}
          sub={`${metrics.primaryRoutePct.toFixed(0)}% primary · ${metrics.fallbackRoutePct.toFixed(0)}% fallback`}
          accent="violet"
        />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Model usage */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-zinc-900">Model Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={modelUsage}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, payload }) =>
                  `${name ?? payload?.name ?? ""} (${payload?.count ?? 0})`
                }
              >
                {modelUsage.map((_, i) => (
                  <Cell key={i} fill={MODEL_COLORS[i % MODEL_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Cost comparison */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-zinc-900">Cost Comparison (millicents)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={costCompareData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`${Number(v).toFixed(3)} m¢`, "Cost"]} />
              <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                <Cell fill="#6366f1" />
                <Cell fill="#94a3b8" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Latency breakdown */}
      <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-zinc-900">Latency per Request</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={latencyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} unit="ms" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="router" name="Router" stroke="#6366f1" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="total" name="Total" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Task breakdown */}
      <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-zinc-900">Task Complexity Breakdown</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={taskBreakdown} layout="vertical">
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="label" width={140} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Request table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <div className="border-b border-zinc-200 px-6 py-4">
          <h3 className="font-semibold text-zinc-900">Route Decisions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Prompt</th>
                <th className="px-4 py-3 font-medium">Task</th>
                <th className="px-4 py-3 font-medium">Routed Model</th>
                <th className="px-4 py-3 font-medium">Outcome</th>
                <th className="px-4 py-3 font-medium">Cost</th>
                <th className="px-4 py-3 font-medium">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {requests.map((req) => {
                const expanded = expandedId === req.id;
                return (
                  <Fragment key={req.id}>
                    <tr
                      key={req.id}
                      className="cursor-pointer hover:bg-zinc-50"
                      onClick={() => setExpandedId(expanded ? null : req.id)}
                    >
                      <td className="max-w-xs truncate px-4 py-3 text-zinc-700" title={req.prompt}>
                        <span className="inline-flex items-center gap-1">
                          {expanded ? (
                            <ChevronUp className="h-3.5 w-3.5 text-zinc-400" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                          )}
                          {req.prompt.slice(0, 55)}{req.prompt.length > 55 ? "…" : ""}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                          {req.classification.taskLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-700">{req.route.routedModel.name}</td>
                      <td className="px-4 py-3">
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-medium capitalize"
                          style={{
                            backgroundColor: `${OUTCOME_COLORS[req.route.outcome]}20`,
                            color: OUTCOME_COLORS[req.route.outcome],
                          }}
                        >
                          {req.route.outcome.replace("_", " ")}
                          {req.route.failoverReason
                            ? ` (${req.route.failoverReason.replace("_", " ")})`
                            : ""}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-600">
                        ${req.route.costUsd.toFixed(5)}
                        <span className="ml-1 text-zinc-400">
                          (-{(((req.route.baselineCostUsd - req.route.costUsd) / req.route.baselineCostUsd) * 100).toFixed(0)}%)
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-600">{req.route.totalLatencyMs} ms</td>
                    </tr>
                    {expanded && (
                      <tr className="bg-zinc-50">
                        <td colSpan={6} className="px-4 py-4">
                          <p className="mb-3 text-sm text-zinc-700">{req.prompt}</p>
                          <PromptRouteFlowDiagram
                            classification={req.classification}
                            route={req.route}
                            compact
                          />
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
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent: "emerald" | "indigo" | "amber" | "violet";
}) {
  const borders = {
    emerald: "border-emerald-100",
    indigo: "border-indigo-100",
    amber: "border-amber-100",
    violet: "border-violet-100",
  };
  return (
    <div className={`rounded-xl border ${borders[accent]} bg-white p-5`}>
      <div className="mb-2 flex items-center gap-2 text-zinc-500">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold text-zinc-900">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{sub}</p>
    </div>
  );
}
