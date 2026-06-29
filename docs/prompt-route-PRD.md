# PRD — PromptRoute: Intelligent Multi-LLM Router & Cost Optimizer

**Author:** Prince Kumar · IIT Bombay  
**Domain:** Platform & Core Infrastructure PM  
**Version:** 1.0  
**Stack:** Next.js browser demo (client-side routing simulation)

---

## Problem

GenAI applications face a fundamental trade-off: **inference cost vs. latency vs. accuracy**. Teams default to a single premium model (e.g. GPT-4o) for all requests, overpaying on simple chat while still hitting rate limits on peak traffic. Platform PMs need visibility into routing policies, fallback behavior, and cost impact before rolling out multi-model architectures.

## Solution

**PromptRoute** intercepts LLM calls (simulated in this demo), classifies task complexity, routes to the cheapest capable model, and handles fallback when rate limits or timeouts occur.

```
App request → Complexity Classifier → Routing Table → Primary Model
                                              ↓ (429 / timeout)
                                         Fallback Model → Response + metrics
```

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Task Complexity Classifier** | Scores prompts as Simple Chat, Summarization, Code Gen, Complex Reasoning, or Data Extraction |
| **Dynamic Routing Table** | PM-configurable policies (token thresholds, task type → model mapping) |
| **Fallback & Circuit Breaker** | Simulates HTTP 429 / timeout → secondary model redirect |
| **Cost & Latency Analyzer** | Tracks savings vs. single-model baseline, router overhead, failover recovery |

---

## Routing Policies (default)

| Policy | Condition | Primary | Fallback |
|--------|-----------|---------|----------|
| Short chat | < 100 tokens, simple chat | Gemini Flash | Claude Haiku |
| Summarization | Summary intent | Gemini Flash | GPT-4o mini |
| Code gen | Code keywords / fenced blocks | Gemini Pro | Claude Sonnet |
| Complex reasoning | Multi-step analysis | Gemini Pro | GPT-4o |
| Data extraction | JSON / structured output | Claude Haiku | Gemini Flash |
| Long context | > 8K tokens | Gemini Flash | Gemini Pro |

---

## Key Metrics

| Metric | Formula / Definition |
|--------|---------------------|
| **Cost Savings %** | `(Baseline Cost − Routed Cost) / Baseline Cost × 100` |
| **Latency Delta** | Avg routed latency − single-model baseline (~1350 ms) |
| **Router Overhead** | Time spent in classification + policy lookup (~12–20 ms) |
| **Failover Recovery Rate** | % of rate-limited requests successfully resolved by fallback |
| **Tokens / Second** | Aggregate output throughput across routed requests |

**Baseline model:** GPT-4o (simulates "route everything to premium" strategy)

---

## Model Catalog

| Model | Input / 1M | Output / 1M | Avg Latency | RPM |
|-------|------------|-------------|-------------|-----|
| Gemini 2.0 Flash | $0.10 | $0.40 | 420 ms | 2,000 |
| Gemini 2.5 Pro | $1.25 | $10.00 | 980 ms | 150 |
| Claude Haiku 3.5 | $0.80 | $4.00 | 510 ms | 4,000 |
| Claude Sonnet 4 | $3.00 | $15.00 | 1,100 ms | 50 |
| GPT-4o mini | $0.15 | $0.60 | 480 ms | 3,000 |
| GPT-4o (baseline) | $2.50 | $10.00 | 1,350 ms | 500 |

---

## Success Criteria

- Batch of 8 sample prompts routed in < 1 second (browser)
- Cost savings > 40% vs. GPT-4o-only baseline on mixed workload
- Failover recovery rate > 85% on simulated 429 events
- Router overhead < 25 ms per request

---

## Future (Production)

- Real API proxy middleware (OpenAI-compatible gateway)
- Embedding-based classifier trained on production logs
- Per-tenant policy CRUD with audit trail
- Live circuit breaker state from provider health checks
- Datadog / Grafana dashboards for cost & SLO tracking
