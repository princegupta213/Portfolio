import {
  CATEGORY_KEYWORDS,
  DOC_CATEGORIES,
  FILENAME_HINTS,
} from "./categories";
import type {
  BatchClassificationResult,
  ClassificationResult,
  DocumentItem,
} from "./types";

function scoreCategory(
  text: string,
  filename: string,
  categoryId: string
): { score: number; keywords: string[] } {
  const lower = text.toLowerCase();
  const fileLower = filename.toLowerCase();
  const keywords = CATEGORY_KEYWORDS[categoryId] ?? [];
  const fileHints = FILENAME_HINTS[categoryId] ?? [];
  const matched: string[] = [];

  let keywordCount = 0;
  for (const kw of keywords) {
    if (lower.includes(kw.toLowerCase())) {
      keywordCount += 1;
      matched.push(kw);
    }
  }

  let score = 0.15 + keywordCount * 0.08;
  if (keywordCount >= 4) score += 0.2;
  else if (keywordCount >= 3) score += 0.15;
  else if (keywordCount >= 2) score += 0.1;
  else if (keywordCount >= 1) score += 0.05;

  for (const hint of fileHints) {
    if (fileLower.includes(hint)) {
      score += 0.12;
      matched.push(`file:${hint}`);
    }
  }

  return { score: Math.min(1, score), keywords: matched };
}

function confidenceBucket(score: number): "high" | "medium" | "unknown" {
  if (score > 0.7) return "high";
  if (score >= 0.3) return "medium";
  return "unknown";
}

function classifySingle(doc: DocumentItem): ClassificationResult {
  const scores = DOC_CATEGORIES.filter((c) => c.id !== "unknown").map((cat) => {
    const { score, keywords } = scoreCategory(doc.text, doc.name, cat.id);
    return { cat, score, keywords };
  });

  scores.sort((a, b) => b.score - a.score);
  const best = scores[0];
  const second = scores[1];

  const topScores = scores.slice(0, 5).map((s) => ({
    label: s.cat.name,
    score: Math.round(s.score * 100),
  }));

  let category = DOC_CATEGORIES.find((c) => c.id === "unknown")!;
  let confidence = 0;
  const rationaleParts: string[] = [];

  if (best && best.score > 0) {
    rationaleParts.push(`best=${best.cat.id}:${best.score.toFixed(3)}`);
    if (second) rationaleParts.push(`second=${second.score.toFixed(3)}`);

    if (best.score < 0.3) {
      category = best.score > 0.05 ? best.cat : category;
      confidence = Math.round(best.score * 100);
      rationaleParts.push(`low similarity (${best.score.toFixed(3)}) — may need LLM review`);
    } else if (second && best.score - second.score < 0.1) {
      const keywordMatches = best.keywords.filter((k) => !k.startsWith("file:")).length;
      if (keywordMatches >= 3) {
        category = best.cat;
        confidence = Math.round(best.score * 100);
        rationaleParts.push(`strong keywords (${keywordMatches} matches) override ambiguity`);
      } else {
        category = DOC_CATEGORIES.find((c) => c.id === "unknown")!;
        confidence = Math.round(best.score * 100);
        rationaleParts.push("ambiguous: margin < 0.10");
      }
    } else {
      category = best.cat;
      confidence = Math.round(best.score * 100);
    }
  } else {
    rationaleParts.push("no keyword matches");
  }

  const bucket = confidenceBucket(best?.score ?? 0);

  return {
    id: doc.id,
    documentName: doc.name,
    category,
    confidence,
    confidenceBucket: category.id === "unknown" ? "unknown" : bucket,
    matchedKeywords: best?.keywords.slice(0, 8) ?? [],
    topScores,
    rationale: rationaleParts.join("; "),
    preview: doc.text.slice(0, 140) + (doc.text.length > 140 ? "…" : ""),
  };
}

export function classifyDocuments(docs: DocumentItem[]): BatchClassificationResult {
  const results = docs.map(classifySingle);

  const summary: Record<string, number> = {};
  for (const r of results) {
    summary[r.category.name] = (summary[r.category.name] ?? 0) + 1;
  }

  const categoryBreakdown = DOC_CATEGORIES.filter((c) => c.id !== "unknown")
    .map((cat) => ({
      category: cat.name,
      id: cat.id,
      count: results.filter((r) => r.category.id === cat.id).length,
    }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);

  const avgConfidence =
    results.length > 0
      ? Math.round(results.reduce((s, r) => s + r.confidence, 0) / results.length)
      : 0;

  const highConfidenceCount = results.filter((r) => r.confidenceBucket === "high").length;

  const routingQueue: { category: string; routing: string; count: number }[] = [];
  const routingMap = new Map<string, { routing: string; count: number }>();
  for (const r of results) {
    const key = r.category.name;
    const existing = routingMap.get(key);
    if (existing) existing.count += 1;
    else routingMap.set(key, { routing: r.category.routing, count: 1 });
  }
  for (const [category, { routing, count }] of routingMap) {
    routingQueue.push({ category, routing, count });
  }
  routingQueue.sort((a, b) => b.count - a.count);

  return {
    totalDocuments: docs.length,
    classifiedAt: new Date().toISOString(),
    results,
    summary,
    categoryBreakdown,
    routingQueue,
    avgConfidence,
    highConfidenceCount,
  };
}

export function parseDocumentCSV(rows: Record<string, string>[]): DocumentItem[] {
  if (rows.length === 0) return [];
  const headers = Object.keys(rows[0] ?? {});
  const lower = headers.map((h) => h.toLowerCase());

  const nameIdx = lower.findIndex((h) => /name|file|document|title/.test(h));
  const textIdx = lower.findIndex((h) => /text|content|body|extract|ocr/.test(h));

  const nameCol = nameIdx >= 0 ? headers[nameIdx] : headers[0];
  const textCol = textIdx >= 0 ? headers[textIdx] : headers[1] ?? headers[0];

  return rows
    .filter((row) => row[textCol]?.trim() || row[nameCol]?.trim())
    .map((row, i) => ({
      id: `doc-${i}`,
      name: (row[nameCol] ?? `Document ${i + 1}`).trim(),
      text: (row[textCol] ?? row[nameCol] ?? "").trim(),
    }));
}

export function classifySingleText(name: string, text: string): ClassificationResult {
  return classifySingle({ id: "single", name, text });
}
