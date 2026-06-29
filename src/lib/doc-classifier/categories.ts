import type { DocCategory } from "./types";

/** Unified taxonomy: PDF classifier types + fintech routing queues (LAMF/KYC). */
export const DOC_CATEGORIES: DocCategory[] = [
  {
    id: "invoice",
    name: "Invoice",
    description: "Bills, receipts, tax invoices, and commercial invoices",
    examples: ["GST invoice", "proforma", "payment terms"],
    routing: "Billing & compliance review",
    useCase: "Vendor payments, expense verification",
  },
  {
    id: "bank_statement",
    name: "Bank Statement",
    description: "Account statements with transactions, balances, and IFSC details",
    examples: ["monthly statement", "NEFT/IMPS", "closing balance"],
    routing: "Income & liability review",
    useCase: "LAMF eligibility, credit assessment",
  },
  {
    id: "resume",
    name: "Resume / CV",
    description: "Job applications, CVs, and professional profiles",
    examples: ["work experience", "education", "skills"],
    routing: "HR & identity cross-check",
    useCase: "Employment verification",
  },
  {
    id: "ITR",
    name: "Income Tax Return",
    description: "ITR filings, tax returns, and assessment documents",
    examples: ["assessment year", "PAN", "Form 26AS"],
    routing: "Financial & tax review",
    useCase: "High-value loan verification, LAMF",
  },
  {
    id: "government_id",
    name: "Government ID",
    description: "Aadhaar, PAN, passport, voter ID, and driving licence",
    examples: ["UIDAI", "government of india", "date of birth"],
    routing: "KYC verification queue",
    useCase: "Onboarding, identity match",
  },
  {
    id: "unknown",
    name: "Unknown",
    description: "Low confidence — route to manual review or Gemini fallback",
    examples: [],
    routing: "Manual review queue",
    useCase: "Ops escalation",
  },
];

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  invoice: [
    "invoice", "total due", "subtotal", "bill to", "invoice #", "gst", "vat", "tax invoice",
    "commercial invoice", "proforma", "receipt", "amount due", "payment terms", "net 30",
    "bill no", "taxable amount", "cgst", "sgst", "igst", "service bill", "retail invoice",
  ],
  bank_statement: [
    "account statement", "transaction", "debit", "credit", "balance", "ifsc", "swift", "account number",
    "bank statement", "monthly statement", "transaction history", "closing balance", "opening balance",
    "neft", "rtgs", "imps", "upi", "atm", "cheque", "deposit", "withdrawal", "interest", "charges",
  ],
  resume: [
    "resume", "curriculum vitae", "experience", "education", "skills", "projects", "summary",
    "cv", "bio-data", "professional experience", "work experience", "career objective",
    "technical skills", "achievements", "certifications", "internship", "training",
    "leadership", "extracurricular", "publications", "awards", "contact information",
  ],
  ITR: [
    "income tax return", "itr", "pan", "assessment year", "tax paid", "gross total income",
    "taxable income", "deductions", "refund", "tds", "advance tax", "self assessment",
    "form itr", "ay 20", "80c", "80d", "80g", "hra", "lta", "medical", "donation",
  ],
  government_id: [
    "government id", "id card", "issuing authority", "dob", "date of birth", "aadhaar", "passport", "driver", "voter",
    "government of india", "unique identification", "uidai", "driving license", "voter id", "pan card",
    "passport no", "license no", "epic", "valid until", "issued by", "father's name", "mother's name",
  ],
};

export const FILENAME_HINTS: Record<string, string[]> = {
  invoice: ["invoice", "bill", "receipt", "gst"],
  bank_statement: ["bank", "statement", "stmt", "account"],
  resume: ["resume", "cv", "curriculum"],
  ITR: ["itr", "tax", "26as", "income_tax"],
  government_id: ["aadhaar", "aadhar", "pan", "passport", "id", "voter", "license"],
};

/** Full Python pipeline capabilities (Streamlit app in pdf_doc_classifier/). */
export const FULL_PIPELINE = {
  extraction: ["PyMuPDF native text", "OCR fallback (Tesseract EN + HI)"],
  classification: ["MPNet embeddings (155 examples)", "Keyword heuristics", "Gemini 1.5 Flash fallback"],
  output: ["Plotly charts", "Batch PDF upload", "JSON export"],
};
