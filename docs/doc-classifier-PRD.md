# PRD — AI Document Classifier (Unified)

**Author:** Prince Kumar · IIT Bombay  
**Version:** 2.0 · Unified product  
**Stack:** Next.js demo + Python Streamlit production app

---

## One product, two layers

| Layer | Where | What it does |
|-------|-------|--------------|
| **Browser demo** | Portfolio `/projects/doc-classifier` | Batch CSV + paste text → classify & route in-browser (keyword heuristics) |
| **Production app** | `pdf_doc_classifier/` Streamlit | Upload PDFs → PyMuPDF/OCR → MPNet embeddings → Gemini fallback |

Both share the **same 5-class taxonomy** and **ops routing queues**.

---

## Problem

Fintech onboarding (e.g. LAMF at Angel One) requires customers to upload mixed document types — IDs, bank statements, tax returns, invoices. Ops teams manually sort uploads; errors delay KYC and loan disbursement.

## Solution

End-to-end document classifier:
1. **Extract** text from PDFs (PyMuPDF + EN/HI OCR)
2. **Classify** into 5 types using embeddings + keyword heuristics
3. **Route** to ops queues (KYC, income review, compliance, manual review)
4. **Fallback** to Gemini for low-confidence scans

---

## Document types & routing

| Type | Routing queue | Use case |
|------|---------------|----------|
| Government ID | KYC verification | Onboarding identity |
| Bank Statement | Income & liability review | LAMF / credit |
| ITR | Financial & tax review | High-value loans |
| Invoice | Billing & compliance | Vendor/expense |
| Resume / CV | HR cross-check | Employment verify |
| Unknown | Manual review | Gemini escalation |

---

## Success metrics

- Batch of 20 docs classified: < 30 seconds (browser demo)
- High-confidence rate on sample set: > 70%
- Manual review rate: < 15%

---

## Architecture

```
PDF upload → PyMuPDF → (OCR if needed) → clean text
          → MPNet embeddings vs class centroids (155 examples)
          → keyword boost + confidence thresholds
          → (Gemini if ambiguous) → routing queue
```

Browser demo runs steps 2–3 heuristics only on pre-extracted text.

---

## Repo structure

```
Portfolio/
├── src/app/projects/doc-classifier/   # Browser demo
├── pdf_doc_classifier/                # Streamlit production app
│   ├── streamlit_app.py
│   ├── extract_and_classify.py
│   └── class_examples/                # 155 training snippets
```
