"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Download,
  FileJson,
  Loader2,
  Sparkles,
  Table,
  Users,
} from "lucide-react";
import {
  AuditLogPanel,
  ProjectDemoShell,
} from "@/components/enterprise/ProjectDemoShell";
import { ENTERPRISE_SCENARIOS, PROJECT_THEMES } from "@/lib/project-themes";
import {
  DEFAULT_CONFIG,
  generateDataset,
  PRODUCT_CATEGORIES,
  TARGETS,
  toCSV,
  toJSON,
} from "@/lib/data-synth/generator";
import { DATA_SYNTH_SCENARIO_CONFIGS } from "@/lib/data-synth/scenarios";
import type { FeedbackItem, GenerationResult, PersonaConfig } from "@/lib/data-synth/types";

const BATCH_SIZES = [50, 100, 250] as const;
const theme = PROJECT_THEMES["data-synth"];
const scenarios = ENTERPRISE_SCENARIOS["data-synth"] ?? [];

function auditTime() {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

export function DataSynthApp() {
  const [activeScenario, setActiveScenario] = useState("prelaunch");
  const [config, setConfig] = useState<PersonaConfig>(
    DATA_SYNTH_SCENARIO_CONFIGS.prelaunch ?? DEFAULT_CONFIG
  );
  const [batchSize, setBatchSize] = useState<(typeof BATCH_SIZES)[number]>(50);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [auditLog, setAuditLog] = useState<{ time: string; message: string }[]>([]);

  const handleScenarioChange = (id: string) => {
    setActiveScenario(id);
    const preset = DATA_SYNTH_SCENARIO_CONFIGS[id];
    if (preset) {
      setConfig(preset);
      setAuditLog((prev) => [
        ...prev,
        { time: auditTime(), message: `Scenario applied: ${id}` },
      ]);
    }
  };

  const metrics = useMemo(() => {
    const complianceOk = result
      ? result.personaComplianceScore > TARGETS.personaCompliance
      : true;
    const duplicateOk = result ? result.duplicateRate < TARGETS.maxDuplicateRate : true;
    const kpiPass = result ? complianceOk && duplicateOk : null;

    return [
      {
        label: "Batch size",
        value: result ? String(result.items.length) : String(batchSize),
        sublabel: result ? "Generated items" : "Ready to generate",
      },
      {
        label: "Persona compliance",
        value: result ? `${result.personaComplianceScore}%` : "—",
        sublabel: result ? `Target > ${TARGETS.personaCompliance}%` : undefined,
        warn: result ? !complianceOk : false,
      },
      {
        label: "Duplicate rate",
        value: result ? `${result.duplicateRate}%` : "—",
        sublabel: result ? `Target < ${TARGETS.maxDuplicateRate}%` : undefined,
        warn: result ? !duplicateOk : false,
      },
      {
        label: "Compliance KPI",
        value: kpiPass === null ? "—" : kpiPass ? "Pass" : "Review",
        sublabel: "Sandbox QA guardrails",
        warn: kpiPass === false,
      },
    ];
  }, [result, batchSize]);

  const generate = useCallback(() => {
    setLoading(true);
    setProgress(0);
    setAuditLog((prev) => [
      ...prev,
      {
        time: auditTime(),
        message: `Generate started · batch=${batchSize} · category=${config.category}`,
      },
    ]);
    const interval = setInterval(() => setProgress((p) => Math.min(p + 12, 90)), 200);
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      const generated = generateDataset(config, batchSize);
      setResult(generated);
      setLoading(false);
      setAuditLog((prev) => [
        ...prev,
        {
          time: auditTime(),
          message: `Generate complete · ${generated.items.length} items · compliance=${generated.personaComplianceScore}%`,
        },
      ]);
    }, 2200);
  }, [config, batchSize]);

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
    setAuditLog((prev) => [
      ...prev,
      {
        time: auditTime(),
        message: `Export ${format.toUpperCase()} · ${result.items.length} items`,
      },
    ]);
  };

  const sentimentTotal =
    config.sentimentMix.positive + config.sentimentMix.neutral + config.sentimentMix.negative;

  const updateSentiment = (key: keyof PersonaConfig["sentimentMix"], value: number) => {
    setConfig((prev) => {
      const next = { ...prev.sentimentMix, [key]: value };
      const total = next.positive + next.neutral + next.negative;
      if (total === 0) return prev;
      return { ...prev, sentimentMix: next };
    });
  };

  return (
    <ProjectDemoShell
      theme={theme}
      metrics={metrics}
      scenarios={scenarios}
      activeScenario={activeScenario}
      onScenarioChange={handleScenarioChange}
    >
      <div className="grid gap-8 lg:grid-cols-3">
        <aside className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <div className={`flex items-center gap-2 text-sm font-semibold ${theme.accent}`}>
              <Users className="h-4 w-4" />
              Persona configurator
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-zinc-700">Product category</label>
              <select
                value={config.category}
                onChange={(e) => setConfig((p) => ({ ...p, category: e.target.value }))}
                className={`mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 ${theme.ring}`}
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-zinc-700">Target persona</label>
              <textarea
                value={config.personaDescription}
                onChange={(e) => setConfig((p) => ({ ...p, personaDescription: e.target.value }))}
                rows={3}
                className={`mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 ${theme.ring}`}
                placeholder="e.g. Overworked freelancers"
              />
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-zinc-700">Batch size</label>
              <div className="mt-2 flex gap-2">
                {BATCH_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setBatchSize(size)}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      batchSize === size
                        ? theme.tabActive
                        : "bg-zinc-50 text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-100"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
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
                    className="mt-1 w-full accent-teal-600"
                  />
                </div>
              ))}
              <p
                className={`text-xs ${
                  sentimentTotal === 100 ? theme.accent : "text-amber-600"
                }`}
              >
                Total: {sentimentTotal}%{" "}
                {sentimentTotal !== 100 && "(normalize to 100% for best results)"}
              </p>
            </div>

            <button
              type="button"
              onClick={generate}
              disabled={loading}
              className={`mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 ${theme.accentMuted}`}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Generate {batchSize} reviews
            </button>
            {loading && (
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full bg-teal-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          {result && (
            <div className="grid gap-3">
              <MetricCard
                theme={theme}
                label="Persona compliance"
                value={`${result.personaComplianceScore}%`}
                target={`> ${TARGETS.personaCompliance}%`}
                ok={result.personaComplianceScore > TARGETS.personaCompliance}
              />
              <MetricCard
                theme={theme}
                label="Duplicate rate"
                value={`${result.duplicateRate}%`}
                target={`< ${TARGETS.maxDuplicateRate}%`}
                ok={result.duplicateRate < TARGETS.maxDuplicateRate}
              />
              <MetricCard
                theme={theme}
                label="Generation time"
                value={`${(result.generationTimeMs / 1000).toFixed(1)}s`}
                target={`< ${TARGETS.maxGenerationSec}s`}
                ok={result.generationTimeMs < TARGETS.maxGenerationSec * 1000}
              />
            </div>
          )}

          <AuditLogPanel entries={auditLog} accentClass={theme.accent} />
        </aside>

        <main className="lg:col-span-2">
          {!result ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white text-zinc-500">
              Configure persona and generate a batch of {batchSize} feedback items
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
              <FeedbackTable items={result.items} pillClass={theme.pill} />
            </>
          )}
        </main>
      </div>
    </ProjectDemoShell>
  );
}

function MetricCard({
  theme,
  label,
  value,
  target,
  ok,
}: {
  theme: (typeof PROJECT_THEMES)["data-synth"];
  label: string;
  value: string;
  target: string;
  ok: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        ok ? theme.statHighlight : theme.statWarn
      }`}
    >
      <div className="text-xs font-medium uppercase opacity-80">{label}</div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs opacity-70">Target {target}</div>
    </div>
  );
}

function FeedbackTable({
  items,
  pillClass,
}: {
  items: FeedbackItem[];
  pillClass: string;
}) {
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
                <SentimentBadge sentiment={item.sentiment} pillClass={pillClass} />
              </td>
              <td className="px-4 py-3 text-zinc-600">{item.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SentimentBadge({
  sentiment,
  pillClass,
}: {
  sentiment: FeedbackItem["sentiment"];
  pillClass: string;
}) {
  const styles = {
    positive: pillClass,
    neutral: "bg-zinc-100 text-zinc-600 ring-zinc-100",
    negative: "bg-red-50 text-red-700 ring-red-100",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ${styles[sentiment]}`}
    >
      {sentiment}
    </span>
  );
}
