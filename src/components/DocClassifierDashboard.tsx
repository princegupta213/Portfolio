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
} from "recharts";
import { ArrowLeft, Download, FileSearch, Layers, Target } from "lucide-react";
import type { BatchClassificationResult } from "@/lib/doc-classifier/types";

const CATEGORY_COLORS: Record<string, string> = {
  invoice: "#6366f1",
  bank_statement: "#0ea5e9",
  resume: "#10b981",
  ITR: "#f59e0b",
  government_id: "#ec4899",
  unknown: "#94a3b8",
};

const BUCKET_COLORS = {
  high: "text-emerald-600 bg-emerald-50",
  medium: "text-amber-600 bg-amber-50",
  unknown: "text-zinc-600 bg-zinc-100",
};

interface Props {
  result: BatchClassificationResult;
  fileName: string | null;
  onReset: () => void;
}

export function DocClassifierDashboard({ result, fileName, onReset }: Props) {
  const chartData = result.categoryBreakdown.map((c) => ({
    name: c.category,
    count: c.count,
    id: c.id,
  }));

  const exportReport = () => {
    const lines = [
      "# PDF Document Classification Report",
      "",
      `**Documents:** ${result.totalDocuments}`,
      `**Date:** ${new Date(result.classifiedAt).toLocaleDateString()}`,
      `**Source:** ${fileName ?? "Unknown"}`,
      `**Avg confidence:** ${result.avgConfidence}%`,
      `**High confidence:** ${result.highConfidenceCount}/${result.totalDocuments}`,
      "",
      "## Results",
      "",
      "| Document | Category | Confidence | Bucket |",
      "|----------|----------|------------|--------|",
      ...result.results.map(
        (r) =>
          `| ${r.documentName} | ${r.category.name} | ${r.confidence}% | ${r.confidenceBucket} |`
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document-classification-report.md";
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
        Classify another batch
      </button>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Classification results</h1>
          <p className="mt-1 text-sm text-zinc-500">{fileName}</p>
        </div>
        <button
          type="button"
          onClick={exportReport}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          <Download className="h-4 w-4" />
          Export report
        </button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Layers className="h-5 w-5 text-violet-600" />}
          label="Documents"
          value={String(result.totalDocuments)}
        />
        <MetricCard
          icon={<Target className="h-5 w-5 text-emerald-600" />}
          label="High confidence"
          value={`${result.highConfidenceCount}/${result.totalDocuments}`}
        />
        <MetricCard
          icon={<FileSearch className="h-5 w-5 text-sky-600" />}
          label="Avg confidence"
          value={`${result.avgConfidence}%`}
        />
        <MetricCard
          icon={<Layers className="h-5 w-5 text-amber-600" />}
          label="Routing queues"
          value={String(result.routingQueue.length)}
        />
      </div>

      {result.routingQueue.length > 0 && (
        <div className="mb-8 rounded-xl border border-violet-100 bg-violet-50/40 p-6">
          <h2 className="mb-4 font-semibold text-zinc-900">Ops routing queue</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {result.routingQueue.map((q) => (
              <div
                key={q.category}
                className="rounded-lg border border-white bg-white/80 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-zinc-900">{q.category}</span>
                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">
                    {q.count}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">→ {q.routing}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-zinc-900">By category</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.id} fill={CATEGORY_COLORS[entry.id] ?? "#94a3b8"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-zinc-900">Distribution</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {chartData.map((entry) => (
                  <Cell key={entry.id} fill={CATEGORY_COLORS[entry.id] ?? "#94a3b8"} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-6 py-4">
          <h2 className="font-semibold text-zinc-900">Document-level results</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-6 py-3 font-medium">Document</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Routing</th>
                <th className="px-6 py-3 font-medium">Confidence</th>
                <th className="px-6 py-3 font-medium">Keywords</th>
                <th className="hidden px-6 py-3 font-medium lg:table-cell">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {result.results.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-50/80">
                  <td className="px-6 py-4 font-medium text-zinc-900">{r.documentName}</td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                      style={{
                        backgroundColor: CATEGORY_COLORS[r.category.id] ?? "#94a3b8",
                      }}
                    >
                      {r.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-500">{r.category.routing}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${BUCKET_COLORS[r.confidenceBucket]}`}
                    >
                      {r.confidence}%
                    </span>
                  </td>
                  <td className="max-w-[180px] truncate px-6 py-4 text-zinc-500">
                    {r.matchedKeywords.slice(0, 4).join(", ") || "—"}
                  </td>
                  <td className="hidden max-w-xs truncate px-6 py-4 text-zinc-400 lg:table-cell">
                    {r.preview}
                  </td>
                </tr>
              ))}
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
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <div className="text-2xl font-bold text-zinc-900">{value}</div>
          <div className="text-sm text-zinc-500">{label}</div>
        </div>
      </div>
    </div>
  );
}
