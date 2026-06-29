# Product Requirements Document (PRD)
## AI Product Feedback Analyzer

**Author:** Prince Kumar · IIT Bombay  
**Version:** 1.0  
**Last updated:** June 2025  
**Status:** MVP shipped

---

## 1. Problem Statement

Product managers spend 40%+ of their time synthesizing qualitative feedback from app reviews, NPS surveys, and support tickets. Manual tagging is slow, inconsistent across reviewers, and hard to translate into prioritized roadmap decisions.

**Target user:** Associate / entry-level PMs, founders, and UX researchers who need to go from raw feedback → actionable insights quickly.

---

## 2. Goals & Success Metrics

| Goal | Metric | Target (MVP) |
|------|--------|--------------|
| Reduce time-to-insight | Time from upload → report | < 2 minutes |
| Improve prioritization clarity | Users who export roadmap | > 60% |
| Demonstrate PM workflow | Portfolio demo completions | N/A (portfolio) |

**North Star Metric:** Number of product opportunities identified per analysis session.

---

## 3. User Personas

### Primary: Aspiring APM (Alex)
- **Context:** Preparing for PM interviews; has survey/review data from a side project
- **Need:** Turn messy feedback into a structured roadmap story for case studies
- **Pain:** Doesn't know which themes matter most or how to prioritize

### Secondary: Early-stage Founder (Sam)
- **Context:** 200 App Store reviews, no dedicated PM
- **Need:** Quick pulse on top user pain points before next sprint
- **Pain:** Reading reviews one-by-one doesn't scale

---

## 4. User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-1 | As a PM, I want to upload a CSV of reviews so I can analyze bulk feedback | P0 |
| US-2 | As a PM, I want feedback clustered by theme so I can see patterns | P0 |
| US-3 | As a PM, I want sentiment breakdown so I know urgency | P0 |
| US-4 | As a PM, I want ICE-scored opportunities so I can prioritize | P0 |
| US-5 | As a PM, I want to export a markdown report for stakeholders | P1 |
| US-6 | As a PM, I want sample data so I can demo without my own CSV | P1 |

---

## 5. MVP Scope

### In scope
- CSV upload (drag-and-drop)
- Auto-detect columns (review, rating, date, source)
- Theme clustering (10 predefined product themes)
- Sentiment analysis (positive / neutral / negative)
- ICE prioritization (Impact × Confidence ÷ Effort)
- Dashboard with charts and roadmap table
- Export markdown report
- 100-review sample dataset

### Out of scope (v2)
- LLM-powered theme discovery (custom themes)
- Multi-file upload / database persistence
- Team collaboration and sharing
- Integration with App Store Connect, Zendesk, Intercom
- Historical trend analysis over time

---

## 6. Feature Specifications

### 6.1 CSV Upload
- Accept `.csv` with header row
- Auto-map columns: `review`, `feedback`, `comment`, `text`, `rating`, `date`, `source`
- Minimum 1 row with non-empty review text
- Error states: empty file, no text column, parse failure

### 6.2 Theme Clustering
- Match reviews to 1+ themes via keyword rules
- Themes: Performance, UI/UX, Auth, Notifications, Search, Pricing, Support, Features, Onboarding, Sync
- Show count, percentage, sample quotes, top keywords per theme

### 6.3 ICE Scoring
- **Impact (1–10):** Severity of user pain for theme
- **Confidence (1–10):** Volume of evidence + negative sentiment ratio
- **Effort (1–10):** Estimated engineering cost (heuristic)
- **ICE Score:** `(Impact × Confidence) / Effort`
- **Priority bands:** P0 (≥7), P1 (≥5), P2 (≥3), P3 (<3)

### 6.4 Export
- Markdown report: summary, pain points, roadmap table, theme breakdown

---

## 7. Non-Functional Requirements

- Analysis completes in-browser (no server required for MVP)
- Works offline after initial page load
- Responsive layout (desktop-first, mobile-readable)
- No PII stored; data processed client-side only

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Keyword clustering misses nuance | Document as MVP limitation; v2 adds LLM |
| Multi-theme reviews double-counted | Acceptable for MVP; show as cross-cutting signal |
| ICE scores feel arbitrary | Expose I/C/E breakdown; allow manual override in v2 |
| Large CSVs slow browser | Cap at 5,000 rows; warn above 1,000 |

---

## 9. Open Questions

1. Should we add optional OpenAI integration for custom theme extraction?
2. Is RICE (Reach) more appropriate than ICE for this audience?
3. Should negative-only filtering be a toggle?

---

## 10. Timeline (Hypothetical)

| Phase | Deliverable | Duration |
|-------|-------------|----------|
| Week 1 | PRD, wireframes, sample data | 5 days |
| Week 2 | Upload + clustering engine | 5 days |
| Week 3 | Dashboard + ICE scoring | 5 days |
| Week 4 | Export, polish, case study write-up | 5 days |
