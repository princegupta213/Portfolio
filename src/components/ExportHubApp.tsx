"use client";

import { useMemo, useState } from "react";
import { Download, FileText, Layout, Palette } from "lucide-react";
import {
  AVAILABLE_COLUMNS,
  filterRows,
  PREVIEW_TARGET_MS,
  SAMPLE_ROWS,
  toCSVPreview,
} from "@/lib/export-hub/sample-data";
import type { ExportFormat, StyleTheme } from "@/lib/export-hub/types";

const THEMES: { id: StyleTheme; label: string; header: string; accent: string; bg: string }[] = [
  { id: "classic", label: "Classic Corporate", header: "#1e3a5f", accent: "#2563eb", bg: "#ffffff" },
  { id: "modern", label: "Modern Slate", header: "#334155", accent: "#64748b", bg: "#f8fafc" },
  { id: "high-contrast", label: "High-Contrast", header: "#000000", accent: "#facc15", bg: "#ffffff" },
];

const FORMATS: { id: ExportFormat; label: string }[] = [
  { id: "pdf", label: "PDF Report" },
  { id: "csv", label: "CSV Raw Data" },
  { id: "json", label: "JSON" },
];

export function ExportHubApp() {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    AVAILABLE_COLUMNS.map((c) => c.id)
  );
  const [format, setFormat] = useState<ExportFormat>("pdf");
  const [theme, setTheme] = useState<StyleTheme>("classic");

  const filteredData = useMemo(
    () => filterRows(SAMPLE_ROWS, selectedColumns),
    [selectedColumns]
  );

  const activeTheme = THEMES.find((t) => t.id === theme)!;
  const activeCols = AVAILABLE_COLUMNS.filter((c) => selectedColumns.includes(c.id));

  const toggleColumn = (id: string) => {
    setSelectedColumns((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev;
        return prev.filter((c) => c !== id);
      }
      return [...prev, id];
    });
  };

  const handleExport = () => {
    let content: string;
    let mime: string;
    let ext: string;

    if (format === "json") {
      content = JSON.stringify(filteredData, null, 2);
      mime = "application/json";
      ext = "json";
    } else {
      content = toCSVPreview(filteredData, activeCols);
      mime = "text/csv";
      ext = "csv";
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `exporthub-report.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          <Layout className="h-3.5 w-3.5" />
          B2B SaaS · Report Export
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">ExportHub</h1>
        <p className="mt-2 max-w-2xl text-zinc-600">
          Customize columns, pick layout themes, and preview formatted reports live before downloading —
          no more messy CSV dumps for executives.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Controls */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
              <FileText className="h-4 w-4 text-indigo-600" />
              Column selector
            </div>
            <div className="mt-4 space-y-2">
              {AVAILABLE_COLUMNS.map((col) => (
                <label
                  key={col.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-100 px-3 py-2 hover:bg-zinc-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(col.id)}
                    onChange={() => toggleColumn(col.id)}
                    className="accent-indigo-600"
                  />
                  <span className="text-sm text-zinc-800">{col.label}</span>
                  <span className="ml-auto text-xs text-zinc-400">{col.table}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
              <Palette className="h-4 w-4 text-indigo-600" />
              Format & style
            </div>
            <div className="mt-4">
              <p className="text-xs font-medium text-zinc-500">Export format</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {FORMATS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFormat(f.id)}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
                      format === f.id
                        ? "border-indigo-600 bg-indigo-50 text-indigo-800"
                        : "border-zinc-200 text-zinc-600"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            {format === "pdf" && (
              <div className="mt-4">
                <p className="text-xs font-medium text-zinc-500">Style theme</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id)}
                      className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
                        theme === t.id
                          ? "border-indigo-600 bg-indigo-50 text-indigo-800"
                          : "border-zinc-200 text-zinc-600"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Download className="h-4 w-4" />
            Export {format.toUpperCase()}
          </button>
        </div>

        {/* Live preview */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-zinc-900">Live print preview</h3>
            <span className="text-xs text-zinc-400">Updates in &lt; {PREVIEW_TARGET_MS} ms</span>
          </div>
          <div
            className="mt-4 overflow-hidden rounded-lg border border-zinc-200 shadow-sm transition-colors duration-150"
            style={{ backgroundColor: activeTheme.bg }}
          >
            {format === "pdf" ? (
              <PdfPreview
                theme={activeTheme}
                columns={activeCols}
                rows={filteredData}
              />
            ) : format === "csv" ? (
              <pre className="overflow-auto p-4 font-mono text-xs text-zinc-700">
                {toCSVPreview(filteredData, activeCols)}
              </pre>
            ) : (
              <pre className="overflow-auto p-4 font-mono text-xs text-zinc-700">
                {JSON.stringify(filteredData, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PdfPreview({
  theme,
  columns,
  rows,
}: {
  theme: (typeof THEMES)[number];
  columns: typeof AVAILABLE_COLUMNS;
  rows: Record<string, string | number>[];
}) {
  return (
    <div>
      <div
        className="px-6 py-4 text-white"
        style={{ backgroundColor: theme.header }}
      >
        <div className="text-lg font-bold">SaaS Performance Report</div>
        <div className="text-xs opacity-80">Generated · Q2 2026</div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: `2px solid ${theme.accent}` }}>
            {columns.map((c) => (
              <th key={c.id} className="px-4 py-2 text-left font-semibold text-zinc-800">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-zinc-100">
              {columns.map((c) => (
                <td key={c.id} className="px-4 py-2 text-zinc-600">
                  {c.id === "revenue"
                    ? `$${Number(row[c.id]).toLocaleString()}`
                    : c.id === "conversion"
                      ? `${row[c.id]}%`
                      : row[c.id]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t border-zinc-100 px-6 py-3 text-xs text-zinc-400">
        ExportHub · {columns.length} columns · {rows.length} rows
      </div>
    </div>
  );
}
