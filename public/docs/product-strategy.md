# Product Strategy Memo
## AI Product Feedback Analyzer

**One-liner:** Help PMs turn qualitative noise into a prioritized product roadmap in under 2 minutes.

---

## Strategic Context

Qualitative feedback is the richest signal for product direction, but the hardest to operationalize. Tools like Dovetail, Productboard, and Enterpret solve this for enterprise teams — but aspiring PMs and early-stage builders lack access, budget, or time to learn those systems.

This product occupies the **"PM workflow demo"** niche: a lightweight, portfolio-friendly tool that mirrors real PM work (synthesis → prioritization → roadmap) without requiring enterprise infrastructure.

---

## Target Market

| Segment | Size | Willingness to pay | Fit |
|---------|------|-------------------|-----|
| APM candidates (portfolio) | Large | Low | ★★★★★ |
| Solo founders | Medium | Low–Medium | ★★★★ |
| Startup PMs (1–10 person teams) | Medium | Medium | ★★★ |
| Enterprise PM teams | Small | High | ★ (competitive) |

**Beachhead:** APM candidates building portfolio case studies.

---

## Competitive Landscape

| Product | Strength | Gap we fill |
|---------|----------|-------------|
| ChatGPT (manual paste) | Flexible | No structure, no ICE, no export |
| Dovetail | Deep qual research | Expensive, steep learning curve |
| Productboard | Roadmap + feedback | Enterprise pricing, overkill for demos |
| MonkeyLearn | ML tagging | Requires setup, not PM-native output |

**Differentiation:** PM-native output (ICE roadmap, pain points, theme clusters) with zero setup and instant demo via sample data.

---

## Product Principles

1. **Insight over ingestion** — The output (roadmap) matters more than fancy upload UX.
2. **Show your work** — Expose I/C/E scores and sample quotes so stakeholders can challenge assumptions.
3. **Demo-ready by default** — Sample data lets anyone experience value in one click.
4. **Privacy-first** — Client-side processing; no feedback leaves the browser.

---

## Roadmap (Product, not analyzed roadmap)

### Now (MVP)
- CSV upload + sample data
- Keyword theme clustering
- ICE prioritization
- Markdown export

### Next (v1.1)
- Optional OpenAI theme extraction for custom categories
- Filter by sentiment (negative-only)
- CSV column mapping UI

### Later (v2)
- Integrations: App Store, Google Play, Zendesk
- Trend analysis over time
- Team sharing and saved analyses

---

## Success Criteria for Portfolio Use

When presenting this project in an APM interview, you should be able to:

1. Walk through the **problem → solution → metrics** arc in 3 minutes
2. Explain **why ICE** over RICE or MoSCoW for this use case
3. Discuss **tradeoffs** (keyword vs LLM clustering)
4. Show **sample output** from 100 reviews with a clear P0 recommendation
5. Describe **what you'd build next** and why

---

## Key Metric Tree

```
North Star: Opportunities identified per session
├── Activation: CSV uploaded OR sample loaded
├── Engagement: Dashboard viewed (>30s)
├── Value: Export report clicked
└── Retention: Return visit within 7 days (v2 — needs auth)
```
