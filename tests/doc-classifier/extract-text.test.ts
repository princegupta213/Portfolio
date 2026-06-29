import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  detectSourceFormat,
  extractTextFromFile,
  extractedToDocumentItems,
  formatLabel,
  isSupportedUpload,
  methodLabel,
} from "@/lib/doc-classifier/extract-text";

function makeFile(name: string, content: string | Blob, type = ""): File {
  const blob = typeof content === "string" ? new Blob([content], { type }) : content;
  return new File([blob], name, { type });
}

class MockFileReader {
  result: string | ArrayBuffer | null = null;
  onload: ((e: ProgressEvent<FileReader>) => void) | null = null;
  onerror: ((e: ProgressEvent<FileReader>) => void) | null = null;

  readAsText(blob: Blob) {
    void blob.text().then((text) => {
      this.result = text;
      this.onload?.({ target: this } as ProgressEvent<FileReader>);
    });
  }

  readAsArrayBuffer(blob: Blob) {
    void blob.arrayBuffer().then((buf) => {
      this.result = buf;
      this.onload?.({ target: this } as ProgressEvent<FileReader>);
    });
  }
}

beforeEach(() => {
  vi.stubGlobal("FileReader", MockFileReader);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Doc Classifier format detection", () => {
  it("detects format from file extension (happy path)", () => {
    expect(detectSourceFormat("report.pdf")).toBe("pdf");
    expect(detectSourceFormat("notes.txt")).toBe("txt");
    expect(detectSourceFormat("data.csv")).toBe("csv");
    expect(detectSourceFormat("scan.png")).toBe("png");
  });

  it("detects format from MIME type when extension is missing", () => {
    expect(detectSourceFormat("document", "application/pdf")).toBe("pdf");
    expect(detectSourceFormat("readme", "text/plain")).toBe("txt");
    expect(detectSourceFormat("photo", "image/jpeg")).toBe("jpeg");
  });

  it("returns unknown for unsupported formats", () => {
    expect(detectSourceFormat("archive.zip")).toBe("unknown");
    expect(isSupportedUpload(makeFile("data.xlsx", ""))).toBe(false);
  });

  it("reports supported uploads for known formats", () => {
    expect(isSupportedUpload(makeFile("doc.pdf", "", "application/pdf"))).toBe(true);
    expect(isSupportedUpload(makeFile("readme.md", "", "text/markdown"))).toBe(true);
  });
});

describe("Doc Classifier text extraction", () => {
  it("extracts plain text files", async () => {
    const file = makeFile("notes.txt", "Hello world document content", "text/plain");
    const results = await extractTextFromFile(file);
    expect(results).toHaveLength(1);
    expect(results[0].extractedText).toBe("Hello world document content");
    expect(results[0].extractionMethod).toBe("text-read");
    expect(results[0].error).toBeUndefined();
  });

  it("extracts markdown files as plain text", async () => {
    const file = makeFile("readme.md", "# Title\n\nBody text", "text/markdown");
    const results = await extractTextFromFile(file);
    expect(results[0].extractedText).toContain("Body text");
    expect(results[0].sourceFormat).toBe("md");
  });

  it("returns error for unsupported file formats", async () => {
    const file = makeFile("archive.zip", "binary", "application/zip");
    const results = await extractTextFromFile(file);
    expect(results[0].error).toContain("Unsupported format");
    expect(results[0].extractionMethod).toBe("unsupported");
  });
});

describe("Doc Classifier PDF extraction", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("window", {} as Window & typeof globalThis);
  });

  it("returns error for scanned PDFs with no selectable text", async () => {
    vi.doMock("pdfjs-dist/legacy/build/pdf.mjs", () => ({
      GlobalWorkerOptions: { workerSrc: "" },
      getDocument: () => ({
        promise: Promise.resolve({
          numPages: 1,
          getPage: async () => ({
            getTextContent: async () => ({ items: [{ str: "   " }] }),
          }),
        }),
      }),
    }));

    const { extractTextFromFile: extractWithMock } = await import(
      "@/lib/doc-classifier/extract-text"
    );
    const file = makeFile("scanned.pdf", new Uint8Array([1, 2, 3]), "application/pdf");
    const results = await extractWithMock(file);
    expect(results[0].error).toContain("No selectable text found");
    expect(results[0].extractedText).toBe("");
  });

  it("extracts text from PDFs with selectable content", async () => {
    vi.doMock("pdfjs-dist/legacy/build/pdf.mjs", () => ({
      GlobalWorkerOptions: { workerSrc: "" },
      getDocument: () => ({
        promise: Promise.resolve({
          numPages: 1,
          getPage: async () => ({
            getTextContent: async () => ({
              items: [{ str: "TAX INVOICE" }, { str: "Total Amount" }],
            }),
          }),
        }),
      }),
    }));

    const { extractTextFromFile: extractWithMock } = await import(
      "@/lib/doc-classifier/extract-text"
    );
    const file = makeFile("invoice.pdf", new Uint8Array([1, 2, 3]), "application/pdf");
    const results = await extractWithMock(file);
    expect(results[0].extractedText).toContain("TAX INVOICE");
    expect(results[0].extractionMethod).toBe("pdfjs");
  });
});

describe("Doc Classifier helpers", () => {
  it("converts extracted documents to classifier items", () => {
    const items = extractedToDocumentItems([
      {
        id: "1",
        rawFileName: "a.txt",
        sourceFormat: "txt",
        extractedText: "content",
        extractionMethod: "text-read",
      },
      {
        id: "2",
        rawFileName: "b.pdf",
        sourceFormat: "pdf",
        extractedText: "",
        extractionMethod: "unsupported",
        error: "failed",
      },
    ]);
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe("a.txt");
  });

  it("provides human-readable format and method labels", () => {
    expect(formatLabel("pdf")).toBe("PDF");
    expect(methodLabel("pdfjs")).toBe("PDF.js");
    expect(methodLabel("ocr-mock")).toBe("Demo OCR");
  });
});
