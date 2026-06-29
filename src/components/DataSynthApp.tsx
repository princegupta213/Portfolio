"use client";

import { useCallback, useState } from "react";
import {
  Download,
  FileJson,
  Loader2,
  Sparkles,
  Table,
  Users,
} from "lucide-react";
import {
  DEFAULT_CONFIG,
  generateDataset,
  PRODUCT_CATEGORIES,
  TARGETS,
  toCSV,
  toJSON,
} from "@/lib/data-synth/generator";
import type { FeedbackItem, GenerationResult, PersonaConfig } from "@/lib/data-synth/types";

export function DataSynthApp() {
  const [config, setConfig] = useState<PersonaConfig>(DEFAULT_CONFIG);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const updateSentiment = (key: keyof PersonaConfig["sentimentMix"], value: number) => {
    setConfig((prev) => {
      const next = { ...prev.sentimentMix, [key]: value };
      const total = next.positive + next.neutral + next.negative;
      if (total === 0) return prev;
      return { ...prev, sentimentMix: next };
    });
  };

  const generate = useCallback(() => {
    setLoading(true);
    setProgress(0);
    const interval = setInterval(() => setProgress((p) => Math.min(p + 12, 90)), 200);
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setResult(generateDataset(config, 50));
      setLoading(false);
    }, 2200);
  }, [config]);

  const download = (format: "csv" | "json") => {
    if (!result) return;
    const content = format === "csv" ? toCSV(result.items) : toJSON(result.items);
    const blob = new Blob([content], { type: format === "csv" ? "text/csv" : "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `datasynth-${config.category.toLowerCase().replace(/\s+/g, "-")}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sentimentTotal =
    config.sentimentMix.positive + config.sentimentMix.neutral + config.sentimentMix.negative;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          <Sparkles className="h-3.5 w-3.5" />
          Growth PM · Synthetic Data
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">DataSynth</h1>
        <p className="mt-2 max-w-2xl text-zinc-600">
          Generate realistic customer reviews, bug reports, and feature requests for a target persona —
          dry-run classification and routing workflows before launch.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <aside className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
              <Users className="h-4 w-4 text-emerald-600" />
              Persona configurator
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-zinc-700">Product category</label>
              <select
                value={config.category}
                onChange={(e) => setConfig((p) => ({ ...p, category: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-zinc-700">Target persona</label>
              <textarea
                value={config.personaDescription}
                onChange={(e) => setConfig((p) => ({ ...p, personaDescription: e.target.value }))}
                rows={3}
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                placeholder="e.g. Overworked freelancers"
              />
            </div>

            <div className="mt-6 space-y-4">
              <p className="text-sm font-medium text-zinc-700">Sentiment mix</p>
              {(["positive", "neutral", "negative"] as const).map((key) => (
                <div key={key}>
                  <div className="flex justify-between text-xs text-zinc-500 capitalize">
                    <span>{key}</span>
                    <span>{config.sentimentMix[key]}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={config.sentimentMix[key]}
                    onChange={(e) => updateSentiment(key, Number(e.target.value))}
                    className="mt-1 w-full accent-emerald-600"
                  />
                </div>
              ))}
              <p className={`text-xs ${sentimentTotal === 100 ? "text-emerald-600" : "text-amber-600"}`}>
                Total: {sentimentTotal}% {sentimentTotal !== 100 && "(normalize to 100% for best results)"}
              </p>
            </div>

            <button
              type="button"
              onClick={generate}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate 50 reviews
            </button>
            {loading && (
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          {result && (
            <div className="grid gap-3">
              <MetricCard
                label="Persona compliance"
                value={`${result.personaComplianceScore}%`}
                target={`> ${TARGETS.personaCompliance}%`}
                ok={result.personaComplianceScore > TARGETS.personaCompliance}
              />
              <MetricCard
                label="Duplicate rate"
                value={`${result.duplicateRate}%`}
                target={`< ${TARGETS.maxDuplicateRate}%`}
                ok={result.duplicateRate < TARGETS.maxDuplicateRate}
              />
              <MetricCard
                label="Generation time"
                value={`${(result.generationTimeMs / 1000).toFixed(1)}s`}
                target={`< ${TARGETS.maxGenerationSec}s`}
                ok={result.generationTimeMs < TARGETS.maxGenerationSec * 1000}
              />
            </div>
          )}
        </aside>

        <main className="lg:col-span-2">
          {!result ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white text-zinc-500">
              Configure persona and generate a batch of 50 feedback items
            </div>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => download("csv")}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  <Table className="h-4 w-4" />
                  Download CSV
                </button>
                <button
                  type="button"
                  onClick={() => download("json")}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  <FileJson className="h-4 w-4" />
                  Download JSON
                </button>
                <span className="flex items-center gap-1 text-xs text-zinc-500">
                  <Download className="h-3.5 w-3.5" />
                  {result.items.length} items ready
                </span>
              </div>
              <FeedbackTable items={result.items} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  target,
  ok,
}: {
  label: string;
  value: string;
  target: string;
  ok: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 ${ok ? "border-emerald-200 bg-emerald-50/50" : "border-amber-200 bg-amber-50/50"}`}>
      <div className="text-xs font-medium uppercase text-zinc-500">{label}</div>
      <div className="text-xl font-bold text-zinc-900">{value}</div>
      <div className="text-xs text-zinc-500">Target {target}</div>
    </div>
  );
}

function FeedbackTable({ items }: { items: FeedbackItem[] }) {
  return (
    <div className="max-h-[600px] overflow-auto rounded-xl border border-zinc-200 bg-white">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-zinc-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-zinc-600">ID</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600">Type</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600">Sentiment</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600">Feedback</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-zinc-100">
              <td className="px-4 py-3 font-mono text-xs text-zinc-500">{item.id}</td>
              <td className="px-4 py-3 capitalize text-zinc-700">{item.type}</td>
              <td className="px-4 py-3">
                <SentimentBadge sentiment={item.sentiment} />
              </td>
              <td className="px-4 py-3 text-zinc-600">{item.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SentimentBadge({ sentiment }: { sentiment: FeedbackItem["sentiment"] }) {
  const styles = {
    positive: "bg-emerald-50 text-emerald-700",
    neutral: "bg-zinc-100 text-zinc-600",
    negative: "bg-red-50 text-red-700",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${styles[sentiment]}`}>
      {sentiment}
    </span>
  );
}
