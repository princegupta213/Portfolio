"use client";

import { useCallback, useState } from "react";
import Papa from "papaparse";
import { Upload, FileText, Sparkles } from "lucide-react";
import { analyzeFeedback, detectColumns, parseCSVRows } from "@/lib/analyzer";
import {
  MOCK_FEEDBACK_DATASET,
  mockReviewsToCsvRows,
  MOCK_REVIEWS_PREVIEW,
} from "@/data/mock/feedback-analyzer";
import type { AnalysisResult } from "@/lib/types";
import { AnalysisDashboard } from "@/components/AnalysisDashboard";

export function AnalyzerApp() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const runAnalysis = useCallback((items: ReturnType<typeof parseCSVRows>, name: string) => {
    if (items.length === 0) {
      setError("No feedback rows found. Ensure your CSV has a review/feedback column.");
      return;
    }
    setLoading(true);
    setError(null);
    setFileName(name);

    setTimeout(() => {
      const analysis = analyzeFeedback(items);
      setResult(analysis);
      setLoading(false);
    }, 600);
  }, []);

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
          runAnalysis(items, file.name);
        },
        error: () => setError("Failed to parse CSV. Check the file format."),
      });
    },
    [runAnalysis]
  );

  const loadSample = useCallback(async () => {
    setLoading(true);
    setError(null);
    const finish = (items: ReturnType<typeof parseCSVRows>, name: string) => {
      runAnalysis(items, name);
    };
    try {
      const res = await fetch("/sample-feedback.csv");
      if (!res.ok) throw new Error("fetch failed");
      const text = await res.text();
      Papa.parse<Record<string, string>>(text, {
        header: true,
        skipEmptyLines: true,
        complete: (parsed) => {
          const headers = parsed.meta.fields ?? [];
          const config = detectColumns(headers);
          const items = parseCSVRows(parsed.data, config);
          finish(items, `${MOCK_FEEDBACK_DATASET.fileName} (${items.length} reviews)`);
        },
      });
    } catch {
      const config = detectColumns(["review", "rating", "date", "source"]);
      const items = parseCSVRows(mockReviewsToCsvRows(MOCK_REVIEWS_PREVIEW), config);
      finish(items, `mock preview (${items.length} reviews)`);
    }
  }, [runAnalysis]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file?.name.endsWith(".csv")) handleFile(file);
      else setError("Please upload a .csv file.");
    },
    [handleFile]
  );

  if (result) {
    return (
      <AnalysisDashboard
        result={result}
        fileName={fileName}
        onReset={() => {
          setResult(null);
          setFileName(null);
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
          <Sparkles className="h-4 w-4" />
          AI Product Feedback Analyzer
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
          Turn reviews into a prioritized roadmap
        </h1>
        <p className="mt-4 text-lg text-zinc-600">
          Upload app reviews, survey responses, or support tickets. Get theme clusters,
          pain points, and ICE-scored product opportunities in seconds.
        </p>
      </div>

      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="rounded-2xl border-2 border-dashed border-zinc-200 bg-white p-12 text-center transition hover:border-indigo-300 hover:bg-indigo-50/30"
      >
        <Upload className="mx-auto h-12 w-12 text-zinc-400" />
        <p className="mt-4 text-lg font-medium text-zinc-900">
          Drop your CSV here
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          Requires a column named review, feedback, comment, or text
        </p>
        <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
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
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={loadSample}
          disabled={loading}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
        >
          Or analyze {MOCK_FEEDBACK_DATASET.totalReviews} sample app reviews →
        </button>
      </div>

      {loading && (
        <div className="mt-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="mt-3 text-sm text-zinc-500">Clustering themes and scoring opportunities…</p>
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
            <span className="text-xs font-bold text-indigo-600">STEP {item.step}</span>
            <h3 className="mt-1 font-semibold text-zinc-900">{item.title}</h3>
            <p className="mt-1 text-sm text-zinc-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
