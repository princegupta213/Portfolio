# Product Requirements Document (PRD)
## AI Product Feedback Analyzer — Qualitative Triage & Prioritized Roadmap Engine

**Author:** Prince Kumar · IIT Bombay  
**Role:** Product Strategy & User Research PM  
**Status:** Approved / Production Blueprint  
**Version:** 2.0 (Dual-Framework Prioritization Engine)  
**Target Systems:** PM Workflow Suite, Product Backlog / Jira, Stakeholder Presentation Deck  

---

## 1. Executive Summary

Product Managers spend over **40% of sprint planning time** manually reading through unstructured qualitative feedback—App Store reviews, NPS verbatims, and Zendesk tickets. This manual synthesis is slow, subject to recency bias (the loudest user wins), and lacks defensible mathematical scoring when defending roadmap priorities in leadership reviews.

**AI Product Feedback Analyzer** is an end-to-end user research workflow tool that automatically ingests raw customer reviews, clusters qualitative noise into 10 structured product themes, extracts net sentiment, and calculates auditable **ICE** and **RICE** scores to output a prioritized sprint roadmap in under 2 minutes.

---

## 2. Problem Statement & User Personas

### 2.1 The Core Problem
1. **Qualitative Noise Overload**: Unstructured text reviews are hard to aggregate without losing the severity of individual customer pain points.
2. **Subjective Prioritization**: Without an explicit mathematical scoring model, roadmaps are shaped by internal politics or recent escalations rather than user reach and impact.
3. **Synthesis Time Lag**: Translating 100+ raw reviews into executive-ready requirements takes days, delaying engineering handoffs.

### 2.2 Target Personas
* **Primary: Associate Product Manager (APM)**: Needs structured frameworks (ICE/RICE) to present defensible, data-backed feature trade-offs.
* **Secondary: Early-Stage Founder**: Needs immediate clarity on the top 3 product-breaking bugs without hiring dedicated research staff.
* **Engineering Lead**: Needs clear categorization separating infrastructure/auth blockers from cosmetic UI requests.

---

## 3. Product Frameworks

### Framework 1: Mathematical Prioritization Framework (ICE vs. RICE)
The system provides dual-framework scoring tailored to organizational maturity:

| Metric Component | Scoring Range | Valuation Heuristic / Formula |
|---|---|---|
| **Impact ($I$)** | 1 to 10 | Severity of customer friction (1 = cosmetic annoyance; 10 = blocking core value/crashes) |
| **Confidence ($C$)** | 1 to 10 (or %) | `Volume of reviews in cluster × Negative sentiment ratio` |
| **Effort ($E$)** | 1 to 10 | Estimated engineering sprint story points (1 = copy change; 10 = architectural overhaul) |
| **Reach ($R$)** | Quantified Count | `Cluster Mention Count × 120` (estimated quarterly user exposure per review) |

* **ICE Model (Early Stage):**
  $$\text{ICE Score} = \frac{\text{Impact} \times \text{Confidence}}{\text{Effort}}$$
* **RICE Model (Enterprise Scale):**
  $$\text{RICE Score} = \frac{\text{Reach} \times \text{Impact} \times \text{Confidence \%}}{\text{Effort}}$$

### Framework 2: Qualitative Taxonomy & Priority Bands

```
[ RAW REVIEWS ] ──► [ THEME CLUSTERING ] ──► [ SENTIMENT WEIGHTING ] ──► [ ROADMAP BANDS ]
106 App Store       10 Predefined             Negative Verbatims         • P0 (Score ≥ 7.0)
Reviews / CSV       Product Buckets           Given 1.5x Multiplier      • P1 (Score ≥ 5.0)
                                                                         • P2 (Score ≥ 3.0)
```

---

## 4. Key Product Decisions & Trade-off Rationales

| Product Decision | Options Evaluated | Chosen Approach | PM Trade-off & Rationale |
|---|---|---|---|
| **1. Clustering Mechanism** | A. Blackbox LLM API<br>B. Deterministic Keyword Taxonomy | **B. Deterministic Keyword Taxonomy** | **Interview Defensibility:** Blackbox LLMs cannot explain *why* a review was assigned to a cluster. A transparent keyword-heuristic model allows PM candidates to walk recruiters through the exact categorization logic. |
| **2. Dual Framework Support** | A. ICE only<br>B. RICE only<br>C. Toggleable ICE / RICE | **C. Toggleable ICE / RICE** | **Multi-Stage Relevance:** ICE is optimal for 0➔1 early discovery; RICE is mandatory for enterprise scale where Reach justifies resource allocation. A live toggle proves fluency in both paradigms. |
| **3. Stakeholder Lenses** | A. Unified single table<br>B. PM vs. Eng Filter Views | **B. PM vs. Eng Filter Views** | **Cross-Functional Alignment:** Engineering leaders prioritize reliability, performance, and auth; PMs focus on pricing, onboarding, and features. Segmented views mirror real sprint ceremonies. |
| **4. Ingestion Experience** | A. CSV upload only<br>B. One-Click Sample Dataset | **B. One-Click Sample Dataset** | **Zero Time-to-Value:** Recruiters review portfolios in under 90 seconds. Requiring an external CSV causes immediate drop-off; pre-seeding 106 real-world reviews ensures instant engagement. |

---

## 5. Metric Framework (North Star & Guardrails)

* **North Star Metric:** **Time to Actionable Insight**
  * *Target:* **< 2.0 minutes** from data ingestion to prioritized roadmap generation.
* **Product Success Metrics:**
  * **Roadmap Export Rate:** % of sessions where a user downloads the synthesized `.md` artifact (Target: **> 60%**).
  * **Theme Extraction Coverage:** % of input reviews mapped to ≥ 1 actionable product theme (Target: **> 85%**).
* **Process Guardrail Metric:**
  * **Framework Defensibility:** 100% of prioritized opportunities must display underlying Impact, Confidence, and Effort parameters.

---

## 6. Functional Specifications

1. **Flexible Ingestion Pipeline**:
   * Drag-and-drop CSV parser with auto-column detection (`review`, `rating`, `date`, `source`).
   * "One-Click Sample Reviews" button loading 106 curated fintech and consumer app reviews.
2. **Thematic Clustering Engine**:
   * Evaluates text against 10 core dimensions: *Performance, UI/UX, Auth & Security, Notifications, Search, Pricing & Billing, Customer Support, Missing Features, Onboarding, Sync*.
3. **Interactive Scoring Table**:
   * Live toggle between ICE and RICE scoring algorithms.
   * Filterable by Priority Band (P0, P1, P2) and Departmental Lens (PM vs. Engineering).
4. **Markdown Export Generator**:
   * Generates a complete requirements summary ready to paste into Notion, Linear, or executive PRD decks.

---

## 7. Production Roadmap & Future Milestones

* **Phase 1 (Shipped):** Browser ingestion, 10-theme clustering, dual ICE/RICE scoring, markdown report export.
* **Phase 2 (Next):** Direct API integrations with Apple App Store Connect, Google Play Console, and Zendesk.
* **Phase 3 (Enterprise):** Fine-tuned semantic embedding clusterer for continuous weekly customer sentiment tracking.
