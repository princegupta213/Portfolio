import Papa from "papaparse";
import { MOCK_BATCH_DOCUMENTS } from "@/data/mock/doc-classifier";
import { FILENAME_HINTS } from "./categories";
import { parseDocumentCSV } from "./classifier";
import type {
  ExtractedDocument,
  ExtractionMethod,
  SourceFormat,
} from "./types";

const EXTENSION_MAP: Record<string, SourceFormat> = {
  pdf: "pdf",
  docx: "docx",
  txt: "txt",
  md: "md",
  csv: "csv",
  png: "png",
  jpg: "jpg",
  jpeg: "jpeg",
  webp: "webp",
};

const IMAGE_FORMATS = new Set<SourceFormat>(["png", "jpg", "jpeg", "webp"]);

export function detectSourceFormat(fileName: string, mimeType?: string): SourceFormat {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (ext in EXTENSION_MAP) return EXTENSION_MAP[ext];

  if (mimeType) {
    if (mimeType === "application/pdf") return "pdf";
    if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
      return "docx";
    if (mimeType === "text/plain") return "txt";
    if (mimeType === "text/markdown") return "md";
    if (mimeType === "text/csv") return "csv";
    if (mimeType.startsWith("image/")) {
      const sub = mimeType.split("/")[1];
      if (sub && sub in EXTENSION_MAP) return EXTENSION_MAP[sub];
    }
  }

  return "unknown";
}

export function isSupportedUpload(file: File): boolean {
  return detectSourceFormat(file.name, file.type) !== "unknown";
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Failed to read file as text"));
    reader.readAsText(file);
  });
}

async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return file.arrayBuffer();
}

async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const data = await readFileAsArrayBuffer(file);
  const doc = await pdfjs.getDocument({ data }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= doc.numPages; i += 1) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (pageText) pages.push(pageText);
  }

  const text = pages.join("\n\n").trim();
  if (!text) {
    throw new Error(
      "No selectable text found — scanned PDFs need OCR (use production Streamlit app)"
    );
  }
  return text;
}

async function extractDocxText(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const buffer = await readFileAsArrayBuffer(file);
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  const text = result.value.trim();
  if (!text) throw new Error("DOCX contained no extractable text");
  return text;
}

async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number } | null> {
  if (typeof window === "undefined") return null;

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

function mockOcrFromFilename(fileName: string): string {
  const lower = fileName.toLowerCase().replace(/\.[^.]+$/, "");

  const byMockName = MOCK_BATCH_DOCUMENTS.find((doc) => {
    const stem = doc.name.replace(/\.[^.]+$/, "");
    return lower.includes(stem) || stem.includes(lower);
  });
  if (byMockName) return byMockName.text;

  for (const [categoryId, hints] of Object.entries(FILENAME_HINTS)) {
    if (hints.some((hint) => lower.includes(hint))) {
      const sample = MOCK_BATCH_DOCUMENTS.find(
        (doc) => doc.expectedCategory === categoryId
      );
      if (sample) {
        return `[OCR] ${sample.text}`;
      }
    }
  }

  const tokens = lower.split(/[_\-\s.]+/).filter(Boolean);
  const hintHit = tokens.find((token) =>
    Object.values(FILENAME_HINTS).some((hints) =>
      hints.some((h) => token.includes(h) || h.includes(token))
    )
  );

  if (hintHit) {
    return `[OCR scan] Document image (${fileName}) · detected keyword "${hintHit}" · extracted text pending full OCR pipeline`;
  }

  return `[OCR scan] ${fileName} · image document · demo OCR placeholder — route to production Tesseract/Gemini for full extraction`;
}

async function extractImageText(file: File, fileName: string): Promise<string> {
  const dims = await getImageDimensions(file);
  const ocrBody = mockOcrFromFilename(fileName);
  if (dims) {
    return `${ocrBody}\n\n[Image metadata] ${dims.width}×${dims.height}px · ${file.type || "image"}`;
  }
  return ocrBody;
}

async function tryParseCsvBatch(file: File): Promise<ExtractedDocument[] | null> {
  return new Promise((resolve) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (parsed) => {
        const fields = parsed.meta.fields;
        if (!fields?.length) {
          resolve(null);
          return;
        }

        const lower = fields.map((h) => h.toLowerCase());
        const hasName = lower.some((h) => /name|file|document|title/.test(h));
        const hasText = lower.some((h) => /text|content|body|extract|ocr/.test(h));

        if (!hasName || !hasText) {
          resolve(null);
          return;
        }

        const docs = parseDocumentCSV(parsed.data);
        if (docs.length === 0) {
          resolve(null);
          return;
        }

        resolve(
          docs.map((doc, i) => ({
            id: makeId(`csv-row-${i}`),
            rawFileName: doc.name,
            sourceFormat: "csv" as SourceFormat,
            extractedText: doc.text,
            extractionMethod: "csv-parse" as ExtractionMethod,
          }))
        );
      },
      error: () => resolve(null),
    });
  });
}

export async function extractTextFromFile(file: File): Promise<ExtractedDocument[]> {
  const format = detectSourceFormat(file.name, file.type);

  if (format === "unknown") {
    return [
      {
        id: makeId("unsupported"),
        rawFileName: file.name,
        sourceFormat: "unknown",
        extractedText: "",
        extractionMethod: "unsupported",
        error: `Unsupported format: ${file.name}`,
      },
    ];
  }

  if (format === "csv") {
    const batch = await tryParseCsvBatch(file);
    if (batch?.length) return batch;
  }

  try {
    let extractedText = "";
    let extractionMethod: ExtractionMethod;

    switch (format) {
      case "pdf":
        extractedText = await extractPdfText(file);
        extractionMethod = "pdfjs";
        break;
      case "docx":
        extractedText = await extractDocxText(file);
        extractionMethod = "mammoth";
        break;
      case "txt":
      case "md":
      case "csv":
        extractedText = (await readFileAsText(file)).trim();
        extractionMethod = "text-read";
        break;
      default:
        if (IMAGE_FORMATS.has(format)) {
          extractedText = await extractImageText(file, file.name);
          extractionMethod = "ocr-mock";
        } else {
          throw new Error(`No extractor for ${format}`);
        }
    }

    if (!extractedText.trim()) {
      throw new Error("File contained no extractable text");
    }

    return [
      {
        id: makeId(format),
        rawFileName: file.name,
        sourceFormat: format,
        extractedText,
        extractionMethod,
      },
    ];
  } catch (err) {
    const message = err instanceof Error ? err.message : "Extraction failed";
    return [
      {
        id: makeId("error"),
        rawFileName: file.name,
        sourceFormat: format,
        extractedText: "",
        extractionMethod: "unsupported",
        error: message,
      },
    ];
  }
}

export function extractedToDocumentItems(docs: ExtractedDocument[]) {
  return docs
    .filter((d) => d.extractedText.trim() && !d.error)
    .map((d, i) => ({
      id: d.id || `doc-${i}`,
      name: d.rawFileName,
      text: d.extractedText,
    }));
}

export function formatLabel(format: SourceFormat): string {
  return format.toUpperCase();
}

export function methodLabel(method: ExtractionMethod): string {
  const labels: Record<ExtractionMethod, string> = {
    pdfjs: "PDF.js",
    mammoth: "Mammoth (DOCX)",
    "text-read": "Plain text",
    "ocr-mock": "Demo OCR",
    "csv-parse": "CSV batch",
    unsupported: "—",
  };
  return labels[method];
}
