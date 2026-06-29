"use client";

import { useCallback, useState } from "react";
import Papa from "papaparse";
import { Upload, FileText, Sparkles } from "lucide-react";
import { analyzeFeedback, detectColumns, parseCSVRows } from "@/lib/analyzer";
import {
  type FeedbackScenarioId,
  getFeedbackScenario,
  scenarioToCsvRows,
} from "@/data/mock/feedback-scenarios";
import type { AnalysisResult } from "@/lib/types";
import { AnalysisDashboard } from "@/components/AnalysisDashboard";
import {
  EnterpriseAuditLog,
  ProjectDemoShell,
  type DemoMetric,
} from "@/components/enterprise/ProjectDemoShell";
import { EditableSection, AdminActionButton } from "@/components/enterprise/RbacControls";
import { ENTERPRISE_SCENARIOS, PROJECT_THEMES } from "@/lib/project-themes";

const THEME = PROJECT_THEMES["feedback-analyzer"];
const SCENARIOS = ENTERPRISE_SCENARIOS["feedback-analyzer"] ?? [];

function auditTime() {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

export function AnalyzerApp() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [scenario, setScenario] = useState<FeedbackScenarioId>("consumer");
  const [auditLog, setAuditLog] = useState<{ time: string; message: string }[]>([]);

  const appendAudit = useCallback((message: string) => {
    setAuditLog((prev) => [...prev, { time: auditTime(), message }]);
  }, []);

  const runAnalysis = useCallback(
    (items: ReturnType<typeof parseCSVRows>, name: string, scenarioId?: FeedbackScenarioId) => {
      if (items.length === 0) {
        setError("No feedback rows found. Ensure your CSV has a review/feedback column.");
        return;
      }
      setLoading(true);
      setError(null);
      setFileName(name);
      if (scenarioId) setScenario(scenarioId);

      setTimeout(() => {
        const analysis = analyzeFeedback(items);
        setResult(analysis);
        setLoading(false);
        appendAudit(
          `Analysis complete · ${analysis.totalReviews} reviews · ${analysis.themes.length} themes · scenario=${scenarioId ?? scenario}`
        );
      }, 600);
    },
    [appendAudit, scenario]
  );

  const handleFile = useCallback(
    (file: File) => {
      Papa.parse<Record<string, string>>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (parsed) => {
          const headers = parsed.meta.fields ?? [];
          if (headers.length === 0) {
            setError("CSV has no headers. Add column names in the first row.");
            return;
          }
          const config = detectColumns(headers);
          const items = parseCSVRows(parsed.data, config);
          appendAudit(`Upload received · ${file.name} · ${items.length} rows`);
          runAnalysis(items, file.name);
        },
        error: () => setError("Failed to parse CSV. Check the file format."),
      });
    },
    [appendAudit, runAnalysis]
  );

  const loadScenario = useCallback(
    (id: FeedbackScenarioId) => {
      setScenario(id);
      appendAudit(`Scenario selected · ${getFeedbackScenario(id).label}`);
      const config = detectColumns(["review", "rating", "date", "source"]);
      const items = parseCSVRows(scenarioToCsvRows(id), config);
      const meta = getFeedbackScenario(id);
      runAnalysis(items, `${meta.fileName} (${items.length} reviews)`, id);
    },
    [appendAudit, runAnalysis]
  );

  const loadSample = useCallback(async () => {
    loadScenario(scenario);
  }, [loadScenario, scenario]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file?.name.endsWith(".csv")) handleFile(file);
      else setError("Please upload a .csv file.");
    },
    [handleFile]
  );

  const handleScenarioChange = (id: string) => {
    loadScenario(id as FeedbackScenarioId);
  };

  const handleReset = () => {
    setResult(null);
    setFileName(null);
    appendAudit("Session reset · new analysis");
  };

  const handleExportAudit = (detail: string) => {
    appendAudit(detail);
  };

  const metrics: DemoMetric[] | undefined = result
    ? [
        {
          label: "Reviews analyzed",
          value: String(result.totalReviews),
        },
        {
          label: "Negative sentiment",
          value: `${Math.round(
            (result.overallSentiment.negative /
              Math.max(
                1,
                result.overallSentiment.positive +
                  result.overallSentiment.neutral +
                  result.overallSentiment.negative
              )) *
              100
          )}%`,
          warn: result.overallSentiment.negative > result.overallSentiment.positive,
        },
        {
          label: "Themes detected",
          value: String(result.themes.length),
        },
        {
          label: "P0 initiatives",
          value: String(result.opportunities.filter((o) => o.priority === "P0").length),
          warn: result.opportunities.some((o) => o.priority === "P0"),
        },
      ]
    : undefined;

  return (
    <ProjectDemoShell
      theme={THEME}
      metrics={metrics}
      scenarios={SCENARIOS}
      activeScenario={scenario}
      onScenarioChange={handleScenarioChange}
      enterpriseBadge="Enterprise demo · VoC audit trail"
      footer={
        <span>
          ICE-scored roadmaps for PM and Engineering stakeholders · sample data only
        </span>
      }
    >
      {result ? (
        <>
          <AnalysisDashboard
            result={result}
            fileName={fileName}
            scenarioId={scenario}
            onReset={handleReset}
            onExportAudit={handleExportAudit}
          />
          <div className="mt-6">
            <EnterpriseAuditLog entries={auditLog} accentClass={THEME.accent} />
          </div>
        </>
      ) : (
        <>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <div
                className={`mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${THEME.pill} ring-1`}
              >
                <Sparkles className="h-4 w-4" />
                Voice-of-customer intake
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                Turn reviews into a prioritized roadmap
              </h2>
              <p className="mt-3 text-zinc-600">
                Upload app reviews, survey responses, or support tickets. Get theme clusters,
                pain points, and ICE-scored product opportunities in seconds.
              </p>
            </div>

            <div
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`rounded-2xl border-2 border-dashed border-zinc-200 bg-white p-12 text-center transition hover:border-violet-300 hover:bg-violet-50/30`}
            >
              <EditableSection className="disabled:opacity-70">
              <Upload className="mx-auto h-12 w-12 text-zinc-400" />
              <p className="mt-4 text-lg font-medium text-zinc-900">Drop your CSV here</p>
              <p className="mt-1 text-sm text-zinc-500">
                Requires a column named review, feedback, comment, or text
              </p>
              <label
                className={`mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition ${THEME.accentMuted}`}
              >
                <FileText className="h-4 w-4" />
                Choose file
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </label>
              </EditableSection>
            </div>

            <div className="mt-6 text-center">
              <AdminActionButton
                onClick={loadSample}
                disabled={loading}
                className={`text-sm font-medium ${THEME.accent} hover:opacity-80`}
              >
                Or analyze {getFeedbackScenario(scenario).reviews.length} sample{" "}
                {getFeedbackScenario(scenario).label.toLowerCase()} reviews →
              </AdminActionButton>
            </div>

            {loading && (
              <div className="mt-8 text-center">
                <div
                  className={`mx-auto h-8 w-8 animate-spin rounded-full border-2 border-t-transparent ${THEME.ring.replace("ring-", "border-")}`}
                />
                <p className="mt-3 text-sm text-zinc-500">
                  Clustering themes and scoring opportunities…
                </p>
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-16 grid gap-6 sm:grid-cols-3">
              {[
                { step: "1", title: "Upload feedback", desc: "CSV with reviews, ratings, dates" },
                { step: "2", title: "AI clusters themes", desc: "Sentiment + keyword grouping" },
                { step: "3", title: "Get roadmap", desc: "ICE-scored priorities P0–P3" },
              ].map((item) => (
                <div key={item.step} className="rounded-xl border border-zinc-100 bg-white p-5">
                  <span className={`text-xs font-bold ${THEME.accent}`}>STEP {item.step}</span>
                  <h3 className="mt-1 font-semibold text-zinc-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-zinc-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {auditLog.length > 0 && (
            <div className="mx-auto mt-8 max-w-3xl">
              <EnterpriseAuditLog entries={auditLog} accentClass={THEME.accent} />
            </div>
          )}
        </>
      )}
    </ProjectDemoShell>
  );
}
