export interface DocumentItem {
  id: string;
  name: string;
  text: string;
}

export interface DocCategory {
  id: string;
  name: string;
  description: string;
  examples: string[];
  routing: string;
  useCase: string;
}

export interface ClassificationResult {
  id: string;
  documentName: string;
  category: DocCategory;
  confidence: number;
  confidenceBucket: "high" | "medium" | "unknown";
  matchedKeywords: string[];
  topScores: { label: string; score: number }[];
  rationale: string;
  preview: string;
}

export interface RoutingQueueItem {
  category: string;
  routing: string;
  count: number;
}

export interface BatchClassificationResult {
  totalDocuments: number;
  classifiedAt: string;
  results: ClassificationResult[];
  summary: Record<string, number>;
  categoryBreakdown: { category: string; count: number; id: string }[];
  routingQueue: RoutingQueueItem[];
  avgConfidence: number;
  highConfidenceCount: number;
}

export type ClassifierMode = "batch" | "paste" | "full";

export type SourceFormat =
  | "pdf"
  | "docx"
  | "txt"
  | "md"
  | "csv"
  | "png"
  | "jpg"
  | "jpeg"
  | "webp"
  | "unknown";

export type ExtractionMethod =
  | "pdfjs"
  | "mammoth"
  | "text-read"
  | "ocr-mock"
  | "csv-parse"
  | "unsupported";

export interface ExtractedDocument {
  id: string;
  rawFileName: string;
  sourceFormat: SourceFormat;
  extractedText: string;
  extractionMethod: ExtractionMethod;
  error?: string;
}

export type FileQueueStatus =
  | "pending"
  | "extracting"
  | "extracted"
  | "error"
  | "classifying"
  | "done";

export interface FileQueueItem {
  queueId: string;
  file: File;
  status: FileQueueStatus;
  extracted?: ExtractedDocument;
  error?: string;
  expanded?: boolean;
}

export const SUPPORTED_UPLOAD_EXTENSIONS = [
  ".pdf",
  ".docx",
  ".txt",
  ".md",
  ".csv",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
] as const;

export const SUPPORTED_UPLOAD_ACCEPT = SUPPORTED_UPLOAD_EXTENSIONS.join(",");
