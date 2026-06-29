"use client";

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
} from "lucide-react";
import type { AnalysisResult } from "@/lib/types";

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
  onReset: () => void;
}

export function AnalysisDashboard({ result, fileName, onReset }: Props) {
  const { overallSentiment, themes, opportunities, topPainPoints, summary } = result;

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

  const exportReport = () => {
    const lines = [
      "# Product Feedback Analysis Report",
      "",
      `**Analyzed:** ${result.totalReviews} reviews`,
      `**Date:** ${new Date(result.analyzedAt).toLocaleDateString()}`,
      `**Source:** ${fileName ?? "Unknown"}`,
      "",
      "## Executive Summary",
      summary,
      "",
      "## Top Pain Points",
      ...topPainPoints.map((p, i) => `${i + 1}. ${p}`),
      "",
      "## Prioritized Roadmap (ICE)",
      "",
      "| Priority | Initiative | Theme | ICE | Impact | Confidence | Effort | Evidence |",
      "|----------|------------|-------|-----|--------|------------|--------|----------|",
      ...opportunities.map(
        (o) =>
          `| ${o.priority} | ${o.title} | ${o.theme} | ${o.iceScore} | ${o.impact} | ${o.confidence} | ${o.effort} | ${o.evidenceCount} |`
      ),
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
  };

  const totalSentiment =
    overallSentiment.positive + overallSentiment.neutral + overallSentiment.negative;
  const negPct = totalSentiment > 0
    ? Math.round((overallSentiment.negative / totalSentiment) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" />
          New analysis
        </button>
        <button
          onClick={exportReport}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Download className="h-4 w-4" />
          Export report
        </button>
      </div>

      <div className="mb-2 text-sm text-zinc-500">{fileName}</div>
      <h1 className="text-3xl font-bold text-zinc-900">Analysis Results</h1>
      <p className="mt-2 max-w-3xl text-zinc-600">{summary}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Layers className="h-5 w-5 text-indigo-600" />}
          label="Reviews analyzed"
          value={result.totalReviews.toString()}
        />
        <StatCard
          icon={<TrendingDown className="h-5 w-5 text-red-500" />}
          label="Negative sentiment"
          value={`${negPct}%`}
        />
        <StatCard
          icon={<Target className="h-5 w-5 text-amber-600" />}
          label="Themes detected"
          value={themes.length.toString()}
        />
        <StatCard
          icon={<AlertCircle className="h-5 w-5 text-orange-600" />}
          label="P0 initiatives"
          value={opportunities.filter((o) => o.priority === "P0").length.toString()}
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Feedback by theme">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={themeChartData} layout="vertical" margin={{ left: 8, right: 16 }}>
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(value) => [value, "Mentions"]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullName ?? ""
                }
              />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
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
        <h2 className="text-xl font-bold text-zinc-900">Prioritized roadmap</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Ranked by ICE score (Impact × Confidence ÷ Effort)
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-zinc-700">Priority</th>
                <th className="px-4 py-3 font-semibold text-zinc-700">Initiative</th>
                <th className="px-4 py-3 font-semibold text-zinc-700">Theme</th>
                <th className="px-4 py-3 font-semibold text-zinc-700">ICE</th>
                <th className="px-4 py-3 font-semibold text-zinc-700">I / C / E</th>
                <th className="px-4 py-3 font-semibold text-zinc-700">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opp) => (
                <tr key={opp.id} className="border-b border-zinc-50 hover:bg-zinc-50/50">
                  <td className="px-4 py-3">
                    <span
                      className="inline-block rounded px-2 py-0.5 text-xs font-bold text-white"
                      style={{ backgroundColor: PRIORITY_COLORS[opp.priority] }}
                    >
                      {opp.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-900">{opp.title}</div>
                    <div className="mt-0.5 text-xs text-zinc-500">{opp.problemStatement}</div>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{opp.theme}</td>
                  <td className="px-4 py-3 font-semibold text-indigo-600">{opp.iceScore}</td>
                  <td className="px-4 py-3 text-zinc-500">
                    {opp.impact} / {opp.confidence} / {opp.effort}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{opp.evidenceCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-zinc-900">Theme deep dive</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className="rounded-xl border border-zinc-200 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-zinc-900">{theme.name}</h3>
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
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
                <blockquote className="mt-3 border-l-2 border-indigo-200 pl-3 text-sm italic text-zinc-600">
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

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center gap-2">{icon}</div>
      <div className="mt-3 text-2xl font-bold text-zinc-900">{value}</div>
      <div className="text-sm text-zinc-500">{label}</div>
    </div>
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
