"use client";

import { useState } from "react";
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
  Legend,
} from "recharts";
import {
  ArrowLeft,
  Download,
  TrendingDown,
  Layers,
  Target,
  AlertCircle,
  Users,
  Wrench,
} from "lucide-react";
import type { AnalysisResult } from "@/lib/types";
import {
  type FeedbackScenarioId,
  type StakeholderView,
  STAKEHOLDER_THEME_FILTER,
} from "@/data/mock/feedback-scenarios";
import { PROJECT_THEMES } from "@/lib/project-themes";

const THEME = PROJECT_THEMES["feedback-analyzer"];

const PRIORITY_COLORS: Record<string, string> = {
  P0: "#ef4444",
  P1: "#f97316",
  P2: "#eab308",
  P3: "#94a3b8",
};

const SENTIMENT_COLORS = ["#22c55e", "#94a3b8", "#ef4444"];

interface Props {
  result: AnalysisResult;
  fileName: string | null;
  scenarioId?: FeedbackScenarioId;
  onReset: () => void;
  onExportAudit?: (message: string) => void;
}

export function AnalysisDashboard({
  result,
  fileName,
  scenarioId,
  onReset,
  onExportAudit,
}: Props) {
  const [stakeholderView, setStakeholderView] = useState<StakeholderView>("pm");
  const [scoringFramework, setScoringFramework] = useState<"ice" | "rice">("ice");
  const { overallSentiment, themes, opportunities, topPainPoints, summary } = result;

  const themeIdsForView = STAKEHOLDER_THEME_FILTER[stakeholderView];
  const filteredOpportunities = opportunities.filter((o) => {
    const themeId = o.id.replace("opp-", "");
    return themeIdsForView.includes(themeId);
  });

  const sortedRoadmapOpportunities = [...(filteredOpportunities.length > 0 ? filteredOpportunities : opportunities)].sort((a, b) => {
    if (scoringFramework === "rice") {
      return (b.riceScore ?? 0) - (a.riceScore ?? 0);
    }
    return b.iceScore - a.iceScore;
  });

  const sentimentData = [
    { name: "Positive", value: overallSentiment.positive },
    { name: "Neutral", value: overallSentiment.neutral },
    { name: "Negative", value: overallSentiment.negative },
  ].filter((d) => d.value > 0);

  const themeChartData = themes.slice(0, 8).map((t) => ({
    name: t.name.length > 18 ? t.name.slice(0, 16) + "…" : t.name,
    count: t.count,
    fullName: t.name,
  }));

  const getPriority = (opp: typeof opportunities[0]) => {
    if (scoringFramework === "ice") return opp.priority;
    const score = opp.riceScore ?? 0;
    if (score >= 1000) return "P0";
    if (score >= 500) return "P1";
    if (score >= 200) return "P2";
    return "P3";
  };

  const exportReport = () => {
    const rawOpps = filteredOpportunities.length > 0 ? filteredOpportunities : opportunities;
    const exportOpps = [...rawOpps].sort((a, b) => {
      if (scoringFramework === "rice") {
        return (b.riceScore ?? 0) - (a.riceScore ?? 0);
      }
      return b.iceScore - a.iceScore;
    });

    const lines = [
      "# Product Feedback Analysis Report",
      "",
      `**Analyzed:** ${result.totalReviews} reviews`,
      `**Date:** ${new Date(result.analyzedAt).toLocaleDateString()}`,
      `**Source:** ${fileName ?? "Unknown"}`,
      `**Scenario:** ${scenarioId ?? "custom"}`,
      `**Stakeholder view:** ${stakeholderView === "pm" ? "Product Management" : "Engineering"}`,
      `**Prioritization framework:** ${scoringFramework.toUpperCase()}`,
      "",
      "## Executive Summary",
      summary,
      "",
      "## Top Pain Points",
      ...topPainPoints.map((p, i) => `${i + 1}. ${p}`),
      "",
      `## Prioritized Roadmap (${scoringFramework.toUpperCase()})`,
      "",
      scoringFramework === "ice"
        ? "| Priority | Initiative | Theme | ICE | Impact | Confidence | Effort | Evidence |"
        : "| Priority | Initiative | Theme | RICE | Reach | Impact | Confidence (%) | Effort | Evidence |",
      scoringFramework === "ice"
        ? "|----------|------------|-------|-----|--------|------------|--------|----------|"
        : "|----------|------------|-------|------|-------|--------|----------------|--------|----------|",
      ...exportOpps.map((o) => {
        const priority = getPriority(o);
        return scoringFramework === "ice"
          ? `| ${priority} | ${o.title} | ${o.theme} | ${o.iceScore} | ${o.impact} | ${o.confidence} | ${o.effort} | ${o.evidenceCount} |`
          : `| ${priority} | ${o.title} | ${o.theme} | ${o.riceScore ?? 0} | ${o.reach ?? 0} | ${o.impact} | ${o.confidencePct ?? 0}% | ${o.effort} | ${o.evidenceCount} |`;
      }),
      "",
      "## Theme Breakdown",
      "",
      ...themes.map(
        (t) =>
          `### ${t.name} (${t.count} mentions, ${t.percentage}%)\n${t.description}\n\nSample: "${t.sampleQuotes[0] ?? "—"}"`
      ),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "feedback-analysis-report.md";
    a.click();
    URL.revokeObjectURL(url);
    onExportAudit?.(
      `Report exported · ${exportOpps.length} initiatives · view=${stakeholderView} · ${fileName ?? "unknown"}`
    );
  };

  const totalSentiment =
    overallSentiment.positive + overallSentiment.neutral + overallSentiment.negative;
  const negPct =
    totalSentiment > 0 ? Math.round((overallSentiment.negative / totalSentiment) * 100) : 0;
  const p0Count = opportunities.filter((o) => o.priority === "P0").length;

  const kpiCards = [
    {
      icon: <Layers className="h-5 w-5" />,
      label: "Reviews analyzed",
      value: result.totalReviews.toString(),
      tone: THEME.statHighlight,
    },
    {
      icon: <TrendingDown className="h-5 w-5" />,
      label: "Negative sentiment",
      value: `${negPct}%`,
      tone: negPct >= 40 ? THEME.statWarn : THEME.statHighlight,
    },
    {
      icon: <Target className="h-5 w-5" />,
      label: "Themes detected",
      value: themes.length.toString(),
      tone: THEME.statHighlight,
    },
    {
      icon: <AlertCircle className="h-5 w-5" />,
      label: "P0 initiatives",
      value: p0Count.toString(),
      tone: p0Count > 0 ? THEME.statWarn : THEME.statHighlight,
    },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" />
          New analysis
        </button>
        <button
          type="button"
          onClick={exportReport}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white ${THEME.accentMuted}`}
        >
          <Download className="h-4 w-4" />
          Export report
        </button>
      </div>

      <div className="mb-2 text-sm text-zinc-500">{fileName}</div>
      <h2 className="text-2xl font-bold text-zinc-900">Analysis results</h2>
      <p className="mt-2 max-w-3xl text-zinc-600">{summary}</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className={`rounded-xl border p-5 ${kpi.tone}`}>
            <div className="flex items-center gap-2 opacity-90">{kpi.icon}</div>
            <div className="mt-2 text-2xl font-bold">{kpi.value}</div>
            <div className="text-sm opacity-80">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Feedback by theme">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={themeChartData} layout="vertical" margin={{ left: 8, right: 16 }}>
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value) => [value, "Mentions"]}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ""}
              />
              <Bar dataKey="count" fill="#7c3aed" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Overall sentiment">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {sentimentData.map((_, i) => (
                  <Cell key={i} fill={SENTIMENT_COLORS[i]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Prioritized roadmap</h2>
            <p className="mt-1 text-sm text-zinc-500">
              {scoringFramework === "ice"
                ? "Ranked by ICE score (Impact × Confidence ÷ Effort)"
                : "Ranked by RICE score (Reach × Impact × Confidence % ÷ Effort)"}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {/* Framework Switcher */}
            <div className="flex gap-1 rounded-lg border border-zinc-200 bg-zinc-100 p-1">
              <button
                type="button"
                onClick={() => setScoringFramework("ice")}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                  scoringFramework === "ice"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                ICE
              </button>
              <button
                type="button"
                onClick={() => setScoringFramework("rice")}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                  scoringFramework === "rice"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                RICE
              </button>
            </div>

            {/* Stakeholder View Switcher */}
            <div className="flex gap-1 rounded-lg border border-zinc-200 bg-zinc-100 p-1">
              <StakeholderToggle
                active={stakeholderView === "pm"}
                onClick={() => setStakeholderView("pm")}
                icon={<Users className="h-3.5 w-3.5" />}
                label="PM view"
              />
              <StakeholderToggle
                active={stakeholderView === "engineering"}
                onClick={() => setStakeholderView("engineering")}
                icon={<Wrench className="h-3.5 w-3.5" />}
                label="Engineering"
              />
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs text-zinc-500">
          {stakeholderView === "pm"
            ? "Showing product themes: pricing, features, UX, onboarding, support"
            : "Showing platform themes: performance, auth, sync, search, notifications"}
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-zinc-700">Priority</th>
                <th className="px-4 py-3 font-semibold text-zinc-700">Initiative</th>
                <th className="px-4 py-3 font-semibold text-zinc-700">Theme</th>
                <th className="px-4 py-3 font-semibold text-zinc-700">
                  {scoringFramework === "ice" ? "ICE" : "RICE"}
                </th>
                <th className="px-4 py-3 font-semibold text-zinc-700">
                  {scoringFramework === "ice" ? "I / C / E" : "R / I / C / E"}
                </th>
                <th className="px-4 py-3 font-semibold text-zinc-700">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {sortedRoadmapOpportunities.map(
                (opp) => {
                  const priority = getPriority(opp);
                  const displayScore = scoringFramework === "ice" ? opp.iceScore : opp.riceScore;
                  return (
                    <tr key={opp.id} className="border-b border-zinc-50 hover:bg-zinc-50/50">
                      <td className="px-4 py-3">
                        <span
                          className="inline-block rounded px-2 py-0.5 text-xs font-bold text-white"
                          style={{ backgroundColor: PRIORITY_COLORS[priority] }}
                        >
                          {priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-zinc-900">{opp.title}</div>
                        <div className="mt-0.5 text-xs text-zinc-500">{opp.problemStatement}</div>
                      </td>
                      <td className="px-4 py-3 text-zinc-600">{opp.theme}</td>
                      <td className={`px-4 py-3 font-semibold ${THEME.accent}`}>
                        {displayScore}
                      </td>
                      <td className="px-4 py-3 text-zinc-500">
                        {scoringFramework === "ice" ? (
                          `${opp.impact} / ${opp.confidence} / ${opp.effort}`
                        ) : (
                          `${opp.reach} / ${opp.impact} / ${opp.confidencePct}% / ${opp.effort}`
                        )}
                      </td>
                      <td className="px-4 py-3 text-zinc-600">{opp.evidenceCount}</td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-zinc-900">Theme deep dive</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {themes.map((theme) => (
            <div key={theme.id} className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-zinc-900">{theme.name}</h3>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${THEME.pill}`}>
                  {theme.count} mentions · {theme.percentage}%
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-500">{theme.description}</p>
              <div className="mt-3 flex gap-3 text-xs">
                <span className="text-green-600">+{theme.sentiment.positive}</span>
                <span className="text-zinc-400">~{theme.sentiment.neutral}</span>
                <span className="text-red-500">−{theme.sentiment.negative}</span>
              </div>
              {theme.keywords.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {theme.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
              {theme.sampleQuotes[0] && (
                <blockquote className="mt-3 border-l-2 border-violet-200 pl-3 text-sm italic text-zinc-600">
                  &ldquo;{theme.sampleQuotes[0]}&rdquo;
                </blockquote>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StakeholderToggle({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
        active ? THEME.tabActive : "text-zinc-600 hover:text-zinc-900"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <h3 className="mb-4 font-semibold text-zinc-900">{title}</h3>
      {children}
    </div>
  );
}
