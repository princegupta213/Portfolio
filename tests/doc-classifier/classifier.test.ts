import { describe, expect, it } from "vitest";
import {
  classifyDocuments,
  classifySingleText,
  parseDocumentCSV,
} from "@/lib/doc-classifier/classifier";
import { MOCK_PASTE_DOCUMENTS } from "@/data/mock/doc-classifier";

describe("Doc Classifier", () => {
  it("classifies an invoice document (happy path)", () => {
    const invoice = MOCK_PASTE_DOCUMENTS.find((d) => d.expectedCategory === "invoice")!;
    const result = classifySingleText(invoice.name, invoice.text);
    expect(result.category.id).toBe("invoice");
    expect(result.confidence).toBeGreaterThan(30);
    expect(result.matchedKeywords.length).toBeGreaterThan(0);
  });

  it("classifies a bank statement document", () => {
    const bank = MOCK_PASTE_DOCUMENTS.find((d) => d.expectedCategory === "bank_statement")!;
    const result = classifySingleText(bank.name, bank.text);
    expect(result.category.id).toBe("bank_statement");
    expect(result.confidenceBucket).not.toBe("unknown");
  });

  it("flags low-similarity documents for manual review", () => {
    const result = classifySingleText("aaaa.pdf", "");
    expect(result.confidence).toBeLessThanOrEqual(15);
    expect(result.rationale).toMatch(/low similarity|no keyword matches/);
    expect(result.confidenceBucket).toBe("unknown");
  });

  it("batch classifies multiple documents with summary metrics", () => {
    const docs = MOCK_PASTE_DOCUMENTS.map((d, i) => ({
      id: `doc-${i}`,
      name: d.name,
      text: d.text,
    }));
    const batch = classifyDocuments(docs);
    expect(batch.totalDocuments).toBe(docs.length);
    expect(batch.results).toHaveLength(docs.length);
    expect(batch.avgConfidence).toBeGreaterThanOrEqual(0);
    expect(batch.categoryBreakdown.length).toBeGreaterThan(0);
    expect(batch.routingQueue.length).toBeGreaterThan(0);
  });

  it("parses document CSV rows", () => {
    const rows = [
      { file_name: "invoice.pdf", extracted_text: "TAX INVOICE GST payment terms" },
      { file_name: "resume.pdf", extracted_text: "Curriculum Vitae work experience" },
    ];
    const docs = parseDocumentCSV(rows);
    expect(docs).toHaveLength(2);
    expect(docs[0].name).toBe("invoice.pdf");
    expect(docs[0].text).toContain("TAX INVOICE");
  });

  it("handles empty CSV input", () => {
    expect(parseDocumentCSV([])).toEqual([]);
  });
});
