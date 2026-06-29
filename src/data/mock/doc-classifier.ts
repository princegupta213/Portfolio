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
];

export function mockDocumentsToCsvRows(): Record<string, string>[] {
  return MOCK_BATCH_DOCUMENTS.map((d) => ({
    document_name: d.name,
    text: d.text,
  }));
}
