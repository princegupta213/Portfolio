# PM Thought Process — How I Built This Portfolio

**Author:** Prince Kumar · IIT Bombay  
**Purpose:** Walk recruiters and interviewers through *why* each decision was made — not just what shipped.  
**Live portfolio:** https://prince-kumar-portfolio-ecru.vercel.app

---

## Why this portfolio exists

I built this site for **Associate Product Manager** interviews. Each project is a deliberate answer to a question I expect in a loop:

| Interview question | Portfolio answer |
|--------------------|------------------|
| "How do you turn messy user input into a roadmap?" | Feedback Analyzer (ICE + RICE) |
| "How do you think about platform cost and reliability?" | PromptRoute |
| "How would you automate ops without blowing up risk?" | ClaimResolve |
| "How do you reason about marketplace trade-offs?" | SurgeSim |
| "How do you de-risk a launch with no users?" | DataSynth |
| "How do you ship document intelligence in fintech?" | Doc Classifier |

My background — Angel One (LAMF pre-launch), Indian Oil product & strategy, IIT Bombay — pushed me toward **fintech, ops guardrails, and measurable north-star metrics**. I didn't want six unrelated demos; I wanted a **coherent PM narrative** across domains.

---

## Cross-cutting decisions (the "how I work" layer)

Before diving into each project, these choices shaped every build:

### 1. Live demo > slide deck
Recruiters have 90 seconds. I optimized for **one-click sample data** and instant dashboards — not login walls or empty states.

### 2. North star + guardrail on every project
Every demo names two metrics: what we're optimizing for and what we're protecting against.

| Project | North star | Guardrail |
|---------|------------|-----------|
| ClaimResolve | Auto-resolution rate | False refund rate |
| SurgeSim | Order match rate | Checkout abandonment |
| PromptRoute | Cost savings % | Failover recovery rate |
| DataSynth | Persona compliance | Duplicate rate |
| Feedback Analyzer | Time to insight | Framework defensibility (ICE/RICE) |
| Doc Classifier | Routing accuracy | SLA breach rate |

### 3. Enterprise pass (RBAC, audit logs, scenarios)
I added **Admin / Ops / Analyst / Viewer** roles because real PM tools aren't one-size-fits-all. Ops needs audit trails; analysts need KPIs; viewers shouldn't break production configs. This mirrors how I'd scope v1 vs. v2 for a B2B product.

### 4. Browser-first, production-aware
Demos run client-side for speed and privacy. Where production would differ (OCR for scanned PDFs, real fraud scores, Redis cache), I **say so explicitly** — that's PM honesty, not a bug.

### 5. Automated tests (74 cases)
I added Vitest suites so prioritization math, policy engines, and routing logic don't regress. PMs own outcomes; I still believe in testable business logic.

---

## Project 1 — AI Product Feedback Analyzer

**Domain:** Product Strategy · User Research  
**Timeline:** 2025 (first portfolio project)

### Step 1: Problem framing
I noticed PM candidates and early founders spend **40%+ of synthesis time** reading reviews manually. The pain isn't "no AI" — it's **no structured output** you can defend in a roadmap review.

**Thought:** If the deliverable isn't a prioritized list with scores, the tool fails the interview use case.

### Step 2: User research (simulated)
I ran 5 structured interviews with aspiring PMs. Key insight: **one-click sample data** mattered more than upload flexibility. Privacy also blocked cloud uploads for support tickets.

**Decision:** Ship CSV upload + baked-in sample reviews. Keep processing client-side.

### Step 3: Theme clustering + sentiment
I chose **keyword + heuristic clustering** over a black-box LLM because interviewers ask *how* themes were derived. Ten theme buckets (Performance, Auth, Pricing, etc.) map to how real PM teams tag feedback.

**Trade-off:** Lower recall on novel phrases vs. full LLM — acceptable for a transparent demo.

### Step 4: ICE scoring first
ICE (Impact × Confidence / Effort) is interview-standard. I surfaced all three components in the table so stakeholders can challenge assumptions.

### Step 5: RICE extension (2026)
Recruiters asked about **reach quantification**. I added RICE with:

- **Reach** = `theme.count × 120` (estimated users impacted per quarter per mention)
- **RICE** = `(reach × impact × confidence%) / effort`

**Thought:** ICE is faster for early-stage; RICE is better when you need to justify scale. A toggle lets me demonstrate both frameworks in one demo.

### Step 6: Stakeholder views
PM vs. Engineering filter on the roadmap mirrors real alignment meetings — PMs care about pricing/UX; eng cares about performance/auth.

### Step 7: Export
Markdown export = drop into Notion, slides, or interview prep. The artifact outlives the demo.

---

## Project 2 — PromptRoute

**Domain:** Platform PM · LLM Infrastructure  
**Timeline:** 2026

### Step 1: Problem framing
At Angel One, API cost at scale is a real constraint. Teams default to **one premium model for everything** — overpaying on simple chat, still hitting 429s under load.

**Thought:** Platform PMs need a **routing layer** with policy control before eng rolls multi-model infra.

### Step 2: Classifier design
I built a **task complexity classifier** (simple chat, summarization, code, reasoning, extraction) using keyword + token heuristics — not because it's SOTA, but because it's **inspectable** in an interview.

### Step 3: Routing table as PM config
Six toggleable policies map task types → primary/fallback model pairs. **PM-accessible config** was a deliberate requirement — eng shouldn't be the bottleneck for routing experiments.

### Step 4: Failover + circuit breaker
Rate limits are inevitable. I simulate HTTP 429 / timeout → fallback model and track **failover recovery rate**. Zero failures is the wrong goal; **recovery** is the right one.

### Step 5: Cost baseline
Every simulation compares against **GPT-4o-only baseline** so savings % is meaningful, not vanity.

### Step 6: Semantic cache (2026)
Duplicate prompts in production hit Redis/memcached at ~8ms for $0. I added a toggle that:

- Detects repeated prompts in a batch
- Returns `cache_hit` at 8ms, $0 cost
- Surfaces **cache hit rate** and **$ saved** on the dashboard

**Thought:** Routing saves money on model choice; caching saves money on repeat work. Platform PMs own both levers.

### Step 7: Workload scenarios
Support / IDE / Analytics / Premium presets map to how different products stress the router differently.

---

## Project 3 — ClaimResolve

**Domain:** Fintech · Customer Operations  
**Timeline:** 2026

### Step 1: Problem framing
Small refunds ($15–$50) take **8–12 minutes** of agent time each — checking transaction dates, account warnings, prior claims. CSAT dies in the queue.

**Thought:** Most volume is **rule-bound**; automation should handle the boring middle, not replace judgment on edge cases.

### Step 2: Policy engine architecture
I separated rules into **auto-deny** (hard policy: age window, fraud flag) vs. **human review** (recoverable: over cap, repeat claimant). That matches how risk teams actually think.

Default policies:
- Max refund $50 → review
- Transaction age > 30 days → deny
- Account warnings ≥ 2 → review
- Repeat claims in 90d → review
- High-risk account → deny

### Step 3: Verdict severity ranking
When multiple rules fire, **deny > review > approve**. PMs need deterministic outcomes for audit.

### Step 4: Email drafts
Every verdict generates a customer notification citing **which rule fired**. This cuts agent follow-up time and is non-negotiable for ops buy-in.

### Step 5: Metrics design
- **North star:** Auto-resolution rate (% approved + denied without agent)
- **Guardrail:** False refund rate ($ invalid auto-approvals / $ all auto-approvals)

Seeded orders include hidden `groundTruth` so the demo can surface false approvals as a KPI — teaching moment for interviewers.

### Step 6: Enterprise scenarios
Standard / Strict / Holiday / Enterprise SLA presets let me show how **policy tuning** changes auto-rate without code deploys.

### Step 7: Pipeline UX
Flow diagram (submit → lookup → identity → policy → verdict) makes the audit trail visible — ops teams ask "what happened?" not just "what's the answer?"

---

## Project 4 — SurgeSim

**Domain:** Marketplace PM · Dynamic Pricing  
**Timeline:** 2026

### Step 1: Problem framing
Ride-share PMs live in the tension between **match rate** (riders paired) and **abandonment** (riders leaving due to surge/wait). You can't optimize one in a vacuum.

### Step 2: Zone-level simulation
A 24-zone grid map makes supply/demand **spatial** — stadium events, airports, and downtown nightlife behave differently. City-wide averages hide the story.

### Step 3: Weather as demand shock
Weather events (clear / rain / storm) model exogenous demand spikes — the classic "surge during rain" narrative with data behind it.

### Step 4: Surge caps as guardrail
Min/max multiplier sliders let PMs ask: "If we cap surge at 2×, what happens to match rate vs. abandonment?" That's the actual product conversation.

### Step 5: SLA breach callout
When abandonment exceeds 15%, a visible alert fires. **Guardrails should be loud**, not buried in a chart.

### Step 6: Presets
Rush hour, storm surge, stadium event, airport pickup — each tells a different marketplace story in one click.

---

## Project 5 — DataSynth

**Domain:** Growth PM · Synthetic Data  
**Timeline:** 2026

### Step 1: Problem framing
Pre-launch teams can't test classifiers, routers, or triage workflows without realistic feedback. Manual seed data is slow and off-persona.

### Step 2: Persona-first generation
I prioritized **persona fidelity** over raw volume. Misaligned synthetic reviews break evals worse than too few samples.

### Step 3: Sentiment mix sliders
Configurable positive/neutral/negative mix lets PMs stress-test escalation paths — e.g., churn post-mortem at 65% negative.

### Step 4: Batch sizes (50 / 100 / 250)
Different teams need different eval sizes. Generation must finish in **< 8 seconds** or PMs abandon mid-sprint.

### Step 5: Quality KPIs
Persona compliance % and duplicate rate % give Growth PMs a language to defend synthetic data quality to ML stakeholders.

### Step 6: Pairing with Feedback Analyzer
DataSynth → export CSV → Feedback Analyzer is the **intended loop**: generate sandbox data, then prioritize it. Two demos, one workflow.

---

## Project 6 — AI Document Classifier

**Domain:** Fintech · KYC & Onboarding  
**Timeline:** Sep 2025 (earliest technical build)

### Step 1: Problem framing
Fintech onboarding receives invoices, bank statements, IDs, ITRs, CVs — ops manually sorts them into queues. Wrong routing delays KYC and burns SLA.

### Step 2: Two-layer product
- **Browser demo:** Fast, interview-friendly, batch + paste
- **Production Streamlit app:** PyMuPDF, MPNet embeddings (155 examples), EN/HI OCR, Gemini fallback

**Thought:** PMs need to see the demo; eng hiring managers need to see depth.

### Step 3: Multi-format upload (2026)
Users upload PDF, DOCX, images, CSV, TXT. PDF.js runs **locally** (no CDN) after I hit worker load failures on corporate networks. Scanned PDFs get a clear OCR message — honest scope boundary.

### Step 4: SLA routing queue
Documents route to queues with P0/P1/P2 priority and turnaround hours — connecting classification to **ops outcomes**, not just labels.

### Step 5: Enterprise scenarios
KYC retail, SME lending, HR onboarding, compliance audit — each loads a different document mix because **vertical context changes routing rules**.

---

## Projects I chose NOT to feature

I built CheckoutFriction, ExportHub, and VoiceFlow early in the portfolio sprint, then **removed them from the homepage** to keep the narrative tight. Six strong demos beat nine thin ones. The code taught me growth PM, B2B export UX, and voice latency trade-offs — but the featured set targets my APM story: **strategy, platform, fintech ops, marketplace, growth, and document intelligence**.

---

## Earlier work (non-demo)

### Trumio.in — AI Upskilling Apps (2022)
**Thought process:** 0→1 ideation practice — TAM/SAM/SOM, personas, competitor maps for US SMB. Taught me to separate *idea generation* from *build execution*.

### FitCheck.io — Virtual Fitting Room (2022)
**Thought process:** 80+ consumer surveys before building. 45% sampling cost reduction gave me a template: **research → metric → solution**, which I reused in every portfolio project.

---

## How I'd talk about this in an interview

> "I don't build features first — I name the user, the north star, the guardrail, and the trade-off. Then I ship the smallest demo that lets a recruiter *feel* the decision in 90 seconds. Every project here has sample data, exportable artifacts, and test coverage on the business logic. That's how I worked at Angel One on LAMF pre-launch, and that's how I'd work on your team."

---

## Related artifacts

| Document | Path |
|----------|------|
| Feedback Analyzer PRD | [/docs/PRD](/docs/PRD) |
| Product strategy | [/docs/product-strategy](/docs/product-strategy) |
| User research summary | [/docs/user-research-summary](/docs/user-research-summary) |
| Per-project PRDs | `/docs/{project}-PRD` |
| Case studies | `/projects/{project}/case-study` |

---

*Last updated: June 2026 · Reflects RICE prioritization, semantic cache, RBAC, and multi-format doc upload.*
