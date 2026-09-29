# Product Requirements Document (PRD)
## AI Document Classifier — Unified Fintech Document Intelligence Pipeline

**Author:** Prince Kumar · IIT Bombay  
**Role:** Fintech Platform & Operations PM  
**Status:** Approved / Production Blueprint  
**Version:** 2.0 (Unified Dual-Layer Architecture)  
**Target Systems:** Fintech Onboarding SDK, KYC Engine, Underwriting Ops Queues  

---

## 1. Executive Summary

Digital onboarding in retail lending and wealth management (e.g., Loan Against Mutual Funds [LAMF]) requires borrowers to submit diverse verification documents—identity proofs, multi-page bank statements, Income Tax Returns (ITR), and salary slips. Manual sorting of document uploads introduces 4–8 hour onboarding bottlenecks, high operational costs, and catastrophic misclassification risks (e.g., sending an ITR to an identity desk).

**AI Document Classifier** is an enterprise document intelligence pipeline that ingests mixed uploads, extracts raw textual content (handling both digital PDFs and scanned images via bilingual OCR), classifies documents into a standardized 5-class fintech taxonomy via MPNet vector embeddings, and routes them to appropriate downstream ops queues—with automated generative LLM fallback for ambiguous edge cases.

---

## 2. Problem Statement & User Personas

### 2.1 The Core Problem
1. **Onboarding Funnel Drop-off**: Manual document intake takes hours to triage, causing prospective borrowers to abandon applications during pre-approval.
2. **Format Heterogeneity**: Users upload clean digital vector PDFs, skewed mobile camera photos, and low-resolution vernacular scans (English and Hindi).
3. **Queue Congestion & SLA Breaches**: Misrouted documents bounce between KYC, credit underwriting, and compliance queues, delaying loan disbursement.

### 2.2 Target Personas
* **Primary: Fintech Operations PM**: Needs high auto-routing accuracy (>85%) to maintain 15-minute onboarding SLAs.
* **Secondary: KYC / Credit Underwriting Officer**: Needs pre-verified, categorized documents with clean audit trails and confidence scores.
* **End Borrower**: Expects immediate upload validation without cryptic upload rejection errors.

---

## 3. Product Frameworks

### Framework 1: Tiered Extraction & Classification Architecture
To balance processing latency, inference cost, and extraction fidelity, documents traverse a tiered hierarchy:

```
[ USER PDF / IMAGE UPLOAD ]
            │
            ▼
     [ TIER 1: EXTRACTION ]
     • Digital Text Check (PyMuPDF) ─── Text Exists? ──► Extract in < 50ms
            │ No (Scanned image)
            ▼
     • Bilingual OCR (Tesseract EN/HI) ────────────────► Extract in < 1.2s
            │
            ▼
     [ TIER 2: CLASSIFICATION ]
     • MPNet Vector Embeddings (155 Seeded Centroids)
     • Domain Keyword Boost (PAN, Form 16, Bank Header)
            │
       Confidence ≥ 0.75?
       ├── YES ──► Route directly to Ops Queue (KYC, Underwriting, Billing)
       └── NO  ──► [ TIER 3: GEMINI LLM ESCALATION ]
                   Deep contextual multi-modal evaluation ➔ Final Queue Route
```

### Framework 2: 5-Class Taxonomy & Routing Queue Matrix

| Document Category | Key Textual Indicators | Target Ops Queue | Business SLA | Re-check Protocol |
|---|---|---|---|---|
| **Government ID** | `Income Tax Department`, `Aadhaar`, `DOB`, `Father's Name` | **KYC Verification** | < 15 mins | PII cryptographic hashing |
| **Bank Statement** | `Account Balance`, `Debit`, `Credit`, `IFSC`, `Cheque` | **Credit & Underwriting** | < 30 mins | Balance verification check |
| **ITR / Tax Form** | `Assessment Year`, `Form 16`, `Gross Income`, `ITR-V` | **High-Ticket Risk Ops** | < 60 mins | Income threshold audit |
| **Commercial Invoice** | `Invoice Number`, `GSTIN`, `Subtotal`, `Due Date` | **Disbursement & Billing** | < 45 mins | Tax invoice validation |
| **Resume / CV** | `Experience`, `Education`, `Skills`, `University` | **Employment Verification** | < 2 hours | Cross-check LinkedIn/EPFO |
| **Unknown / Edge Case** | Unrecognized format / Low confidence (< 0.60) | **Manual Senior Review** | < 4 hours | Escalated with Gemini triage note |

---

## 4. Key Product Decisions & Trade-off Rationales

| Product Decision | Options Evaluated | Chosen Approach | PM Trade-off & Rationale |
|---|---|---|---|
| **1. Classification Method** | A. Pure LLM Zero-shot<br>B. Fine-tuned Classifier<br>C. Embeddings + Keyword Boost | **C. Embeddings + Keyword Boost** | **Latency & Unit Economics:** Running every 10-page document through an LLM costs $0.05/doc and takes 3s. Pre-computed MPNet vector centroids run in **< 100ms** at **$0 compute cost**, reserving expensive LLMs solely for ambiguous edge cases. |
| **2. Dual-Layer Product Scope** | A. Python app only<br>B. Browser demo only<br>C. Unified Dual-Layer | **C. Unified Dual-Layer** | **Recruiter Access vs. Engineering Depth:** Interviewers need a 1-click browser demo (`/projects/doc-classifier`) without installing Python dependencies. The production Streamlit app (`pdf_doc_classifier/`) proves real OCR and PyMuPDF engineering capabilities. |
| **3. Bilingual Language Support** | A. English only<br>B. English + Hindi OCR | **B. English + Hindi OCR** | **Market Reality (India Fintech):** Over 25% of tier-2/3 Indian KYC documents contain Hindi Devanagari script. Restricting to English causes unacceptable onboarding drop-off. |
| **4. Confidence Boundary Policy** | A. Force auto-routing always<br>B. Multi-tiered confidence cutoffs | **B. Multi-tiered confidence cutoffs** | **Risk Mitigation:** Forcing classification on ambiguous documents creates catastrophic queue contamination. Cutoffs (>0.75 Auto-Route, 0.60–0.75 Gemini Fallback, <0.60 Manual Queue) protect data integrity. |

---

## 5. Metric Framework (North Star & Guardrails)

* **North Star Metric:** **Automated Ingestion Accuracy**
  * *Formula:* `Correctly Routed Documents / Total Processed Documents × 100`
  * *Target:* **> 90.0%** across mixed digital and scanned corpora.
* **Secondary Efficiency Metrics:**
  * **High-Confidence Auto-Route Rate:** % of uploads cleared without Gemini or human escalation (Target: **> 75.0%**).
  * **Batch Processing Speed:** Classifying a batch of 20 documents in **< 30 seconds** (browser).
* **Compliance Guardrail Metric:**
  * **Cross-Queue Contamination Rate:** Documents routed to the wrong functional department (Target: **< 1.0%**).
  * **Manual Review Overflow:** Total volume redirected to human review (Target: **< 15.0%**).

---

## 6. Functional Specifications

1. **Dual Ingestion Endpoints**:
   * **Browser Sandbox:** Instant CSV batch upload and text paste with live keyword/heuristic scoring.
   * **Production Python App:** Multipart file upload supporting `.pdf`, `.png`, `.jpg`, and multi-page documents.
2. **Text Extraction Pipeline**:
   * Direct text layer extraction via PyMuPDF.
   * Fallback OCR rasterization via Tesseract with dual language packs (`eng+hin`).
3. **Similarity Engine**:
   * Evaluates extracted vectors against 155 curated training examples across 5 document types.
4. **Queue Dispatcher**:
   * Outputs structured JSON payload with `doc_type`, `confidence`, `extracted_entities`, and `target_queue`.

---

## 7. Production Roadmap & Future Milestones

* **Phase 1 (Shipped):** Browser demo + Streamlit production pipeline, 5-class taxonomy, MPNet embeddings.
* **Phase 2 (Next):** Bounding-box visual extraction for document tampering and photo forgery detection.
* **Phase 3 (Enterprise):** Direct integration with DigiLocker API and NSDL PAN verification databases.
