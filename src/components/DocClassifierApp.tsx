"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import {
  Upload,
  FileText,
  Sparkles,
  Layers,
  Terminal,
  ClipboardPaste,
} from "lucide-react";
import {
  classifyDocuments,
  classifySingleText,
  parseDocumentCSV,
} from "@/lib/doc-classifier/classifier";
import {
  extractTextFromFile,
  extractedToDocumentItems,
  isSupportedUpload,
} from "@/lib/doc-classifier/extract-text";
import {
  MOCK_PASTE_DOCUMENTS,
  type DocClassifierScenarioId,
  getDocClassifierScenario,
  scenarioDocumentsToCsvRows,
} from "@/data/mock/doc-classifier";
import { FULL_PIPELINE } from "@/lib/doc-classifier/categories";
import type {
  BatchClassificationResult,
  ClassifierMode,
  FileQueueItem,
} from "@/lib/doc-classifier/types";
import { SUPPORTED_UPLOAD_ACCEPT } from "@/lib/doc-classifier/types";
import { DocClassifierDashboard } from "@/components/DocClassifierDashboard";
import { DocClassifierUploadQueue } from "@/components/DocClassifierUploadQueue";
import {
  EnterpriseAuditLog,
  ProjectDemoShell,
  type DemoMetric,
} from "@/components/enterprise/ProjectDemoShell";
import { EditableSection, AdminActionButton } from "@/components/enterprise/RbacControls";
import { ENTERPRISE_SCENARIOS, PROJECT_THEMES } from "@/lib/project-themes";

const THEME = PROJECT_THEMES["doc-classifier"];
const SCENARIOS = ENTERPRISE_SCENARIOS["doc-classifier"] ?? [];

const TABS: { id: ClassifierMode; label: string; icon: React.ReactNode }[] = [
  { id: "batch", label: "Batch demo", icon: <Upload className="h-4 w-4" /> },
  { id: "paste", label: "Paste document", icon: <ClipboardPaste className="h-4 w-4" /> },
  { id: "full", label: "Full PDF app", icon: <Terminal className="h-4 w-4" /> },
];

const UPLOAD_FORMATS = "PDF, DOCX, TXT, MD, CSV, PNG, JPG, WEBP";

function auditTime() {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

function makeQueueId(): string {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function DocClassifierApp() {
  const [mode, setMode] = useState<ClassifierMode>("batch");
  const [result, setResult] = useState<BatchClassificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [scenario, setScenario] = useState<DocClassifierScenarioId>("kyc-retail");
  const [auditLog, setAuditLog] = useState<{ time: string; message: string }[]>([]);
  const [fileQueue, setFileQueue] = useState<FileQueueItem[]>([]);

  const [pasteName, setPasteName] = useState("document.pdf");
  const [pasteText, setPasteText] = useState("");

  const appendAudit = useCallback((message: string) => {
    setAuditLog((prev) => [...prev, { time: auditTime(), message }]);
  }, []);

  const showResult = useCallback(
    (batch: BatchClassificationResult, name: string, scenarioId?: DocClassifierScenarioId) => {
      setResult(batch);
      setFileName(name);
      setLoading(false);
      if (scenarioId) setScenario(scenarioId);
      appendAudit(
        `Classification complete · ${batch.totalDocuments} docs · avg confidence ${batch.avgConfidence}% · ${batch.routingQueue.length} queues`
      );
    },
    [appendAudit]
  );

  const runClassification = useCallback(
    (rows: Record<string, string>[], name: string, scenarioId?: DocClassifierScenarioId) => {
      const docs = parseDocumentCSV(rows);
      if (docs.length === 0) {
        setError("No documents found. CSV needs document_name and text columns.");
        return;
      }
      setLoading(true);
      setError(null);
      appendAudit(`Batch received · ${name} · ${docs.length} documents`);
      setTimeout(() => showResult(classifyDocuments(docs), name, scenarioId), 500);
    },
    [appendAudit, showResult]
  );

  const processQueueItem = useCallback(
    async (queueId: string, file: File) => {
      setFileQueue((prev) =>
        prev.map((item) =>
          item.queueId === queueId ? { ...item, status: "extracting" } : item
        )
      );

      appendAudit(`Extracting · ${file.name}`);

      const extractedDocs = await extractTextFromFile(file);
      const primary = extractedDocs[0];

      if (primary?.error || !primary?.extractedText.trim()) {
        const errMsg = primary?.error ?? "No text extracted";
        setFileQueue((prev) =>
          prev.map((item) =>
            item.queueId === queueId
              ? { ...item, status: "error", error: errMsg, extracted: primary }
              : item
          )
        );
        appendAudit(`Extraction failed · ${file.name} · ${errMsg}`);
        return;
      }

      if (extractedDocs.length > 1) {
        setFileQueue((prev) => {
          const without = prev.filter((item) => item.queueId !== queueId);
          const csvRows = extractedDocs.map((doc, i) => ({
            queueId: `${queueId}-row-${i}`,
            file,
            status: "extracted" as const,
            extracted: doc,
            expanded: false,
          }));
          return [...without, ...csvRows];
        });
        appendAudit(
          `CSV batch parsed · ${file.name} · ${extractedDocs.length} documents`
        );
        return;
      }

      setFileQueue((prev) =>
        prev.map((item) =>
          item.queueId === queueId
            ? {
                ...item,
                status: "extracted",
                extracted: primary,
                expanded: false,
              }
            : item
        )
      );
      appendAudit(
        `Extracted · ${file.name} · ${primary.extractionMethod} · ${primary.extractedText.length} chars`
      );
    },
    [appendAudit]
  );

  const enqueueFiles = useCallback(
    (files: FileList | File[]) => {
      const incoming = Array.from(files);
      const supported = incoming.filter(isSupportedUpload);
      const rejected = incoming.length - supported.length;

      if (rejected > 0) {
        setError(
          `${rejected} file(s) skipped — supported: ${UPLOAD_FORMATS}`
        );
      } else {
        setError(null);
      }

      if (supported.length === 0) return;

      const newItems: FileQueueItem[] = supported.map((file) => ({
        queueId: makeQueueId(),
        file,
        status: "pending",
        expanded: false,
      }));

      setFileQueue((prev) => [...prev, ...newItems]);
      appendAudit(`Upload queue · ${supported.length} file(s) added`);

      for (const item of newItems) {
        void processQueueItem(item.queueId, item.file);
      }
    },
    [appendAudit, processQueueItem]
  );

  const classifyQueue = useCallback(() => {
    const ready = fileQueue.filter(
      (item) => item.status === "extracted" && item.extracted?.extractedText
    );
    if (ready.length === 0) {
      setError("No extracted documents ready to classify.");
      return;
    }

    setLoading(true);
    setError(null);
    setFileQueue((prev) =>
      prev.map((item) =>
        item.status === "extracted" ? { ...item, status: "classifying" } : item
      )
    );

    const extracted = ready
      .map((item) => item.extracted!)
      .filter((doc) => doc.extractedText.trim());
    const docs = extractedToDocumentItems(extracted);
    const batchName = `${docs.length} uploaded file${docs.length !== 1 ? "s" : ""}`;

    appendAudit(`Classifying · ${docs.length} documents from upload queue`);

    setTimeout(() => {
      setFileQueue((prev) =>
        prev.map((item) =>
          item.status === "classifying" ? { ...item, status: "done" } : item
        )
      );
      showResult(classifyDocuments(docs), batchName);
    }, 600);
  }, [appendAudit, fileQueue, showResult]);

  const toggleQueueExpand = useCallback((queueId: string) => {
    setFileQueue((prev) =>
      prev.map((item) =>
        item.queueId === queueId ? { ...item, expanded: !item.expanded } : item
      )
    );
  }, []);

  const clearQueue = useCallback(() => {
    setFileQueue([]);
    appendAudit("Upload queue cleared");
  }, [appendAudit]);

  const loadScenario = useCallback(
    (id: DocClassifierScenarioId) => {
      setScenario(id);
      appendAudit(`Scenario selected · ${getDocClassifierScenario(id).label}`);
      const meta = getDocClassifierScenario(id);
      const rows = scenarioDocumentsToCsvRows(id);
      runClassification(rows, `${meta.fileName} (${rows.length} docs)`, id);
    },
    [appendAudit, runClassification]
  );

  const loadSample = useCallback(() => {
    loadScenario(scenario);
  }, [loadScenario, scenario]);

  const loadPasteSample = useCallback((id: string) => {
    const doc = MOCK_PASTE_DOCUMENTS.find((d) => d.id === id);
    if (doc) {
      setPasteName(doc.name);
      setPasteText(doc.text);
      setError(null);
      appendAudit(`Paste sample loaded · ${doc.name}`);
    }
  }, [appendAudit]);

  const classifyPaste = useCallback(() => {
    if (!pasteText.trim()) {
      setError("Paste extracted document text first.");
      return;
    }
    setLoading(true);
    setError(null);
    appendAudit(`Single-doc classify · ${pasteName || "pasted-doc"}`);
    setTimeout(() => {
      const single = classifySingleText(pasteName || "pasted-doc", pasteText);
      showResult(
        {
          totalDocuments: 1,
          classifiedAt: new Date().toISOString(),
          results: [single],
          summary: { [single.category.name]: 1 },
          categoryBreakdown: [
            { category: single.category.name, id: single.category.id, count: 1 },
          ],
          routingQueue: [
            { category: single.category.name, routing: single.category.routing, count: 1 },
          ],
          avgConfidence: single.confidence,
          highConfidenceCount: single.confidenceBucket === "high" ? 1 : 0,
        },
        pasteName || "pasted document"
      );
    }, 400);
  }, [appendAudit, pasteName, pasteText, showResult]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        enqueueFiles(e.dataTransfer.files);
      }
    },
    [enqueueFiles]
  );

  const handleScenarioChange = (id: string) => {
    if (result) {
      loadScenario(id as DocClassifierScenarioId);
    } else {
      setScenario(id as DocClassifierScenarioId);
      appendAudit(`Scenario preset · ${getDocClassifierScenario(id as DocClassifierScenarioId).label}`);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFileName(null);
    setFileQueue([]);
    appendAudit("Session reset · new batch");
  };

  const metrics: DemoMetric[] | undefined = result
    ? [
        { label: "Documents", value: String(result.totalDocuments) },
        {
          label: "High confidence",
          value: `${result.highConfidenceCount}/${result.totalDocuments}`,
        },
        { label: "Avg confidence", value: `${result.avgConfidence}%` },
        {
          label: "Routing queues",
          value: String(result.routingQueue.length),
          warn: result.routingQueue.some((q) => q.routing.includes("Manual")),
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
      enterpriseBadge="Enterprise demo · SLA routing"
      footer={
        <span>
          Multi-format extraction · MPNet + keyword heuristics · production Streamlit app for OCR
        </span>
      }
    >
      {result ? (
        <>
          <DocClassifierDashboard
            result={result}
            fileName={fileName}
            scenarioId={scenario}
            onReset={handleReset}
            onExportAudit={(msg) => appendAudit(msg)}
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
                Document intelligence intake
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                Classify &amp; route documents at scale
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-zinc-600">
                Upload PDFs, images, Word docs, and text files — extract in-browser, preview,
                then route to SLA-backed ops queues.
              </p>
            </div>

            <div className="mb-6 grid gap-3 sm:grid-cols-3">
              {[
                { step: "1", title: "Extract", desc: "PDF.js · Mammoth · demo OCR" },
                { step: "2", title: "Classify", desc: "MPNet + keyword heuristics" },
                { step: "3", title: "Route", desc: "KYC, income, compliance queues" },
              ].map((s) => (
                <div
                  key={s.step}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-center"
                >
                  <span className={`text-xs font-bold ${THEME.accent}`}>STEP {s.step}</span>
                  <div className="mt-1 text-sm font-semibold text-zinc-900">{s.title}</div>
                  <div className="text-xs text-zinc-500">{s.desc}</div>
                </div>
              ))}
            </div>

            <div className="mb-6 flex gap-1 rounded-xl border border-zinc-200 bg-zinc-100 p-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setMode(tab.id);
                    setError(null);
                  }}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    mode === tab.id ? THEME.tabActive : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {mode === "batch" && (
              <>
                <div
                  onDrop={onDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="rounded-2xl border-2 border-dashed border-zinc-200 bg-white p-10 text-center transition hover:border-cyan-300 hover:bg-cyan-50/20"
                >
                  <Upload className="mx-auto h-10 w-10 text-zinc-400" />
                  <p className="mt-4 font-medium text-zinc-900">
                    Drop documents or CSV batch
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">
                    {UPLOAD_FORMATS} · multi-file queue · preview before classify
                  </p>
                  <label
                    className={`mt-5 inline-block cursor-pointer rounded-lg px-5 py-2.5 text-sm font-semibold text-white ${THEME.accentMuted}`}
                  >
                    Choose files
                    <input
                      type="file"
                      accept={SUPPORTED_UPLOAD_ACCEPT}
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files?.length) enqueueFiles(files);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <p className="mt-4">
                    <button
                      type="button"
                      onClick={loadSample}
                      disabled={loading}
                      className={`text-sm font-medium ${THEME.accent} hover:opacity-80 disabled:opacity-50`}
                    >
                      Try {getDocClassifierScenario(scenario).label} batch (
                      {scenarioDocumentsToCsvRows(scenario).length} documents) →
                    </button>
                  </p>
                  <p className="mt-2 text-xs text-zinc-400">
                    Scenario batches load pre-extracted CSV · uploads run live extraction
                  </p>
                </div>

                <DocClassifierUploadQueue
                  items={fileQueue}
                  onToggleExpand={toggleQueueExpand}
                  onClassify={classifyQueue}
                  onClear={clearQueue}
                  classifying={loading}
                />
              </>
            )}

            {mode === "paste" && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <label className="block text-sm font-medium text-zinc-700">
                  Document name
                  <input
                    type="text"
                    value={pasteName}
                    onChange={(e) => setPasteName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                    placeholder="aadhaar_scan.pdf"
                  />
                </label>
                <label className="mt-4 block text-sm font-medium text-zinc-700">
                  Extracted text (OCR or copy-paste)
                  <textarea
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    rows={8}
                    className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 font-mono text-sm"
                    placeholder="Paste document text here…"
                  />
                </label>
                <button
                  type="button"
                  onClick={classifyPaste}
                  disabled={loading}
                  className={`mt-4 w-full rounded-lg py-2.5 text-sm font-semibold text-white ${THEME.accentMuted} disabled:opacity-50`}
                >
                  Classify &amp; route
                </button>
                <div className="mt-4 border-t border-zinc-100 pt-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Mock documents
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {MOCK_PASTE_DOCUMENTS.map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => loadPasteSample(doc.id)}
                        className="rounded-lg border border-zinc-100 px-3 py-2 text-left text-sm hover:border-cyan-200 hover:bg-cyan-50/50"
                      >
                        <span className="font-medium text-zinc-800">{doc.name}</span>
                        <span className={`mt-0.5 block text-xs ${THEME.accent}`}>
                          → {doc.routingQueue}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {mode === "full" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-cyan-200 bg-cyan-50/50 p-6">
                  <div className="flex items-start gap-3">
                    <Layers className={`mt-0.5 h-5 w-5 shrink-0 ${THEME.accent}`} />
                    <div>
                      <h2 className="font-semibold text-zinc-900">Production PDF app</h2>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                        The full classifier lives in{" "}
                        <code className="rounded bg-white px-1.5 py-0.5 text-xs">
                          pdf_doc_classifier/
                        </code>{" "}
                        — upload raw PDFs, extract with PyMuPDF or Hindi/English OCR, classify
                        with SentenceTransformer embeddings, and fall back to Gemini for ambiguous
                        scans.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-5">
                  <h3 className="text-sm font-semibold text-zinc-900">Run locally</h3>
                  <pre className="mt-3 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-xs text-zinc-100">
                    {`cd pdf_doc_classifier
pip install -r requirements.txt
export GEMINI_API_KEY=your_key  # optional
streamlit run streamlit_app.py`}
                  </pre>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { title: "Extraction", items: FULL_PIPELINE.extraction },
                    { title: "Classification", items: FULL_PIPELINE.classification },
                    { title: "Output", items: FULL_PIPELINE.output },
                  ].map((col) => (
                    <div key={col.title} className="rounded-xl border border-zinc-200 bg-white p-4">
                      <h4 className={`text-xs font-semibold uppercase tracking-wide ${THEME.accent}`}>
                        {col.title}
                      </h4>
                      <ul className="mt-2 space-y-1.5">
                        {col.items.map((item) => (
                          <li key={item} className="text-sm text-zinc-600">
                            · {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://github.com/princegupta213/pdf-doc-classifier"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white ${THEME.accentMuted}`}
                  >
                    <FileText className="h-4 w-4" />
                    View on GitHub
                  </a>
                  <Link
                    href="/docs/doc-classifier-PRD"
                    className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                  >
                    Read PRD
                  </Link>
                </div>
              </div>
            )}

            {loading && fileQueue.every((i) => i.status !== "extracting") && (
              <p className="mt-6 text-center text-sm text-zinc-500">Classifying documents…</p>
            )}
            {error && <p className="mt-6 text-center text-sm text-red-600">{error}</p>}
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
