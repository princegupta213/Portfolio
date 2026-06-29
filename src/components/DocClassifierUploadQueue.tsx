"use client";

import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import type { FileQueueItem } from "@/lib/doc-classifier/types";
import { formatLabel, methodLabel } from "@/lib/doc-classifier/extract-text";
import { PROJECT_THEMES } from "@/lib/project-themes";

const THEME = PROJECT_THEMES["doc-classifier"];

const STATUS_META: Record<
  FileQueueItem["status"],
  { label: string; className: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Queued",
    className: "bg-zinc-100 text-zinc-600",
    icon: <FileText className="h-3.5 w-3.5" />,
  },
  extracting: {
    label: "Extracting",
    className: "bg-cyan-100 text-cyan-800",
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
  },
  extracted: {
    label: "Ready",
    className: "bg-emerald-100 text-emerald-800",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  error: {
    label: "Error",
    className: "bg-red-100 text-red-800",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
  },
  classifying: {
    label: "Classifying",
    className: "bg-cyan-100 text-cyan-800",
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
  },
  done: {
    label: "Done",
    className: "bg-emerald-100 text-emerald-800",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
};

interface Props {
  items: FileQueueItem[];
  onToggleExpand: (queueId: string) => void;
  onClassify: () => void;
  onClear: () => void;
  classifying: boolean;
}

export function DocClassifierUploadQueue({
  items,
  onToggleExpand,
  onClassify,
  onClear,
  classifying,
}: Props) {
  const readyCount = items.filter(
    (i) => i.status === "extracted" && i.extracted?.extractedText
  ).length;
  const errorCount = items.filter((i) => i.status === "error").length;
  const extractingCount = items.filter(
    (i) => i.status === "pending" || i.status === "extracting"
  ).length;
  const canClassify = readyCount > 0 && extractingCount === 0 && !classifying;

  if (items.length === 0) return null;

  return (
    <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-zinc-900">Upload queue</h3>
          <p className="text-xs text-zinc-500">
            {items.length} file{items.length !== 1 ? "s" : ""} · {readyCount} ready
            {errorCount > 0 ? ` · ${errorCount} failed` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onClear}
            disabled={classifying}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-50"
          >
            Clear queue
          </button>
          <button
            type="button"
            onClick={onClassify}
            disabled={!canClassify}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold text-white ${THEME.accentMuted} disabled:opacity-50`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Classify {readyCount} document{readyCount !== 1 ? "s" : ""}
          </button>
        </div>
      </div>

      <ul className="space-y-2">
        {items.map((item) => {
          const meta = STATUS_META[item.status];
          const extracted = item.extracted;
          const preview = extracted?.extractedText?.slice(0, 280);
          const hasPreview = Boolean(preview?.trim());

          return (
            <li
              key={item.queueId}
              className="rounded-xl border border-zinc-100 bg-zinc-50/50 px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-medium text-zinc-900">
                      {item.file.name}
                    </span>
                    {extracted && (
                      <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500 ring-1 ring-zinc-200">
                        {formatLabel(extracted.sourceFormat)}
                      </span>
                    )}
                  </div>
                  {extracted && !item.error && (
                    <p className="mt-0.5 text-xs text-zinc-500">
                      via {methodLabel(extracted.extractionMethod)}
                    </p>
                  )}
                  {item.error && (
                    <p className="mt-1 text-xs text-red-600">{item.error}</p>
                  )}
                </div>
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.className}`}
                >
                  {meta.icon}
                  {meta.label}
                </span>
              </div>

              {hasPreview && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => onToggleExpand(item.queueId)}
                    className={`inline-flex items-center gap-1 text-xs font-medium ${THEME.accent} hover:opacity-80`}
                  >
                    {item.expanded ? (
                      <>
                        <ChevronUp className="h-3.5 w-3.5" />
                        Hide extracted text
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3.5 w-3.5" />
                        Preview extracted text
                      </>
                    )}
                  </button>
                  {item.expanded ? (
                    <pre className="mt-2 max-h-40 overflow-auto rounded-lg border border-zinc-200 bg-white p-3 font-mono text-xs leading-relaxed text-zinc-700">
                      {extracted?.extractedText}
                    </pre>
                  ) : (
                    <p className="mt-1 truncate text-xs text-zinc-500">{preview}…</p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
