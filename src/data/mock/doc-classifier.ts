export interface MockDocument {
  id: string;
  name: string;
  text: string;
  expectedCategory: string;
  routingQueue: string;
}

export const MOCK_PASTE_DOCUMENTS: MockDocument[] = [
  {
    id: "invoice",
    name: "tax_invoice_march.pdf",
    text: "TAX INVOICE · Invoice No TAX/2024/001234 · Bill To Tech Solutions Pvt Ltd · CGST 9% SGST 9% · Total Amount 59000 · Payment Terms Net 15 days · GST tax invoice",
    expectedCategory: "invoice",
    routingQueue: "Billing & compliance",
  },
  {
    id: "bank",
    name: "hdfc_statement_oct.pdf",
    text: "HDFC Bank · Account Statement · Account Number 50100XXXXX · IFSC HDFC0001234 · Opening Balance 45230 · Closing Balance 78450 · NEFT IMPS UPI transactions · Debit Credit balance",
    expectedCategory: "bank_statement",
    routingQueue: "Income & liability review",
  },
  {
    id: "aadhaar",
    name: "aadhaar_kyc.pdf",
    text: "Unique Identification Authority of India · Aadhaar No 2345 6789 0123 · Government of India · Date of Birth · Father's Name · UIDAI photo identity card",
    expectedCategory: "government_id",
    routingQueue: "KYC verification",
  },
  {
    id: "itr",
    name: "itr_ack_2024.pdf",
    text: "Income Tax Return Acknowledgement · Assessment Year 2024-25 · ITR-1 Filed · PAN ABCPK1234L · Gross Total Income · Tax Paid · TDS deductions · CBDT refund status",
    expectedCategory: "ITR",
    routingQueue: "Financial & tax review",
  },
  {
    id: "resume",
    name: "resume_software_engineer.pdf",
    text: "Curriculum Vitae · Professional Experience · Education · Technical Skills · Projects · Career Objective · Work Experience at TCS · Certifications · Contact Information",
    expectedCategory: "resume",
    routingQueue: "HR cross-check",
  },
  {
    id: "unknown",
    name: "blurry_scan.pdf",
    text: "Scanned image quality low · Unreadable text · Manual review required · Page 1 of 3",
    expectedCategory: "unknown",
    routingQueue: "Manual review",
  },
];

export const MOCK_BATCH_DOCUMENTS: MockDocument[] = [
  ...MOCK_PASTE_DOCUMENTS,
  {
    id: "proforma",
    name: "proforma_invoice.pdf",
    text: "Proforma Invoice · Bill To · Subtotal · Amount Due · Commercial Invoice · Taxable Amount · IGST · Service Bill · Payment Terms Net 30",
    expectedCategory: "invoice",
    routingQueue: "Billing & compliance",
  },
  {
    id: "sbi",
    name: "sbi_monthly_stmt.pdf",
    text: "State Bank of India · Account Statement · Transaction history · Opening Balance · Closing Balance · NEFT RTGS IMPS · ATM withdrawal · Interest credit",
    expectedCategory: "bank_statement",
    routingQueue: "Income & liability review",
  },
  {
    id: "pan",
    name: "pan_card_scan.pdf",
    text: "Income Tax Department · Permanent Account Number · Government of India · Date of Birth · Father's Name · PAN card issued by GOI",
    expectedCategory: "government_id",
    routingQueue: "KYC verification",
  },
  {
    id: "cv2",
    name: "cv_analyst.pdf",
    text: "Resume · Bio-data · Summary · Skills · Internship · Achievements · Publications · Awards · Professional Experience · Training",
    expectedCategory: "resume",
    routingQueue: "HR cross-check",
  },
  {
    id: "itr2",
    name: "itr2_salaried.pdf",
    text: "Form ITR · Self Assessment · Taxable Income · Assessment Year · HRA LTA Medical Donation · Refund · Form ITR filing",
    expectedCategory: "ITR",
    routingQueue: "Financial & tax review",
  },
  {
    id: "icici",
    name: "icici_credit_stmt.pdf",
    text: "ICICI Bank · Monthly Statement · Account Number · Swift IFSC · Cheque deposit · Withdrawal · Transaction history",
    expectedCategory: "bank_statement",
    routingQueue: "Income & liability review",
  },
  {
    id: "form26",
    name: "form26as_2024.pdf",
    text: "Form 26AS · Tax Credit Statement · Assessment Year 2024-25 · TDS deposited · Advance Tax · Income Tax Department · Deductions 80C 80D",
    expectedCategory: "ITR",
    routingQueue: "Financial & tax review",
  },
  {
    id: "retail",
    name: "retail_receipt.pdf",
    text: "Retail Invoice · Bill No 4521 · Receipt · VAT · Subtotal · Total Due · Amount paid",
    expectedCategory: "invoice",
    routingQueue: "Billing & compliance",
  },
  {
    id: "passport",
    name: "passport_india.pdf",
    text: "Republic of India · Passport No K1234567 · Government issued · Place of Birth · Valid Until · Issuing Authority",
    expectedCategory: "government_id",
    routingQueue: "KYC verification",
  },
  {
    id: "voter",
    name: "voter_id_epic.pdf",
    text: "Election Commission · Voter ID · EPIC number · Government ID · Date of Birth · Issued by Government of India",
    expectedCategory: "government_id",
    routingQueue: "KYC verification",
  },
  {
    id: "kotak",
    name: "kotak_stmt.pdf",
    text: "Kotak Mahindra Bank · Savings Account Statement · IFSC KKBK0001234 · UPI NEFT · Opening Balance · Closing Balance · Salary credit",
    expectedCategory: "bank_statement",
    routingQueue: "Income & liability review",
  },
  {
    id: "gst",
    name: "gst_invoice_q2.pdf",
    text: "GST Invoice · HSN Code · Taxable Value · CGST SGST · Bill To Angel One Ltd · Invoice Number GST/2024/Q2/8891",
    expectedCategory: "invoice",
    routingQueue: "Billing & compliance",
  },
  {
    id: "employment",
    name: "employment_letter.pdf",
    text: "To Whom It May Concern · Employment Verification · Designation Senior Analyst · Date of Joining · HR Department · Company Letterhead",
    expectedCategory: "resume",
    routingQueue: "HR cross-check",
  },
  {
    id: "dl",
    name: "driving_license.pdf",
    text: "Driving Licence · Transport Department · Licence Number DL-0123456789 · Date of Issue · Valid Till · Government of India · Address proof",
    expectedCategory: "government_id",
    routingQueue: "KYC verification",
  },
  {
    id: "salary",
    name: "salary_slip_march.pdf",
    text: "Salary Slip · Employee Name · Gross Salary · Net Pay · PF ESI deductions · Pay Period March 2025 · Employer TCS Ltd",
    expectedCategory: "resume",
    routingQueue: "Income & liability review",
  },
  {
    id: "balance",
    name: "balance_sheet_fy24.pdf",
    text: "Balance Sheet · Assets Liabilities · Shareholders Equity · Financial Year 2023-24 · Auditor Report · CA certified",
    expectedCategory: "ITR",
    routingQueue: "Financial & tax review",
  },
  {
    id: "noc",
    name: "bank_noc_letter.pdf",
    text: "No Objection Certificate · Bank NOC · Loan closure · Outstanding balance zero · HDFC Bank letterhead",
    expectedCategory: "bank_statement",
    routingQueue: "Income & liability review",
  },
];

export type DocClassifierScenarioId = "kyc-retail" | "sme-lending" | "hiring" | "compliance";

export interface DocClassifierScenario {
  id: DocClassifierScenarioId;
  label: string;
  description: string;
  documentIds: string[];
  fileName: string;
}

/** Scenario subsets — each maps to a vertical onboarding batch. */
export const DOC_CLASSIFIER_SCENARIOS: DocClassifierScenario[] = [
  {
    id: "kyc-retail",
    label: "Retail KYC",
    description: "ID + bank statement mix",
    documentIds: ["aadhaar", "bank", "pan", "passport", "voter", "sbi", "kotak", "icici", "dl"],
    fileName: "retail-kyc-batch.csv",
  },
  {
    id: "sme-lending",
    label: "SME lending",
    description: "Invoices + ITR heavy",
    documentIds: ["invoice", "proforma", "itr", "itr2", "form26", "gst", "retail", "balance"],
    fileName: "sme-lending-batch.csv",
  },
  {
    id: "hiring",
    label: "HR onboarding",
    description: "CV + ID verification",
    documentIds: ["resume", "cv2", "employment", "aadhaar", "pan", "passport", "salary"],
    fileName: "hr-onboarding-batch.csv",
  },
  {
    id: "compliance",
    label: "Compliance audit",
    description: "Mixed doc types, SLA strict",
    documentIds: [
      "invoice",
      "bank",
      "aadhaar",
      "itr",
      "resume",
      "unknown",
      "proforma",
      "form26",
      "passport",
      "gst",
      "noc",
    ],
    fileName: "compliance-audit-batch.csv",
  },
];

export interface RoutingSlaMeta {
  priority: "P0" | "P1" | "P2";
  slaHours: number;
  badgeClass: string;
}

/** SLA tiers keyed by routing destination substring match. */
export const ROUTING_SLA_META: Record<string, RoutingSlaMeta> = {
  "KYC verification": {
    priority: "P0",
    slaHours: 4,
    badgeClass: "bg-red-100 text-red-800",
  },
  "Income & liability": {
    priority: "P0",
    slaHours: 8,
    badgeClass: "bg-orange-100 text-orange-800",
  },
  "Financial & tax": {
    priority: "P1",
    slaHours: 24,
    badgeClass: "bg-amber-100 text-amber-800",
  },
  "Billing & compliance": {
    priority: "P1",
    slaHours: 24,
    badgeClass: "bg-amber-100 text-amber-800",
  },
  "HR": {
    priority: "P2",
    slaHours: 48,
    badgeClass: "bg-sky-100 text-sky-800",
  },
  "Manual review": {
    priority: "P0",
    slaHours: 2,
    badgeClass: "bg-red-100 text-red-800",
  },
};

export function getRoutingSla(routing: string): RoutingSlaMeta {
  const key = Object.keys(ROUTING_SLA_META).find((k) => routing.includes(k));
  return (
    ROUTING_SLA_META[key ?? ""] ?? {
      priority: "P2",
      slaHours: 48,
      badgeClass: "bg-zinc-100 text-zinc-700",
    }
  );
}

export function getDocClassifierScenario(id: DocClassifierScenarioId): DocClassifierScenario {
  return DOC_CLASSIFIER_SCENARIOS.find((s) => s.id === id) ?? DOC_CLASSIFIER_SCENARIOS[0];
}

export function scenarioDocumentsToCsvRows(id: DocClassifierScenarioId): Record<string, string>[] {
  const scenario = getDocClassifierScenario(id);
  const docs = scenario.documentIds
    .map((docId) => MOCK_BATCH_DOCUMENTS.find((d) => d.id === docId))
    .filter((d): d is MockDocument => Boolean(d));
  return docs.map((d) => ({
    document_name: d.name,
    text: d.text,
  }));
}

export function mockDocumentsToCsvRows(): Record<string, string>[] {
  return MOCK_BATCH_DOCUMENTS.map((d) => ({
    document_name: d.name,
    text: d.text,
  }));
}
