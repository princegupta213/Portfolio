# PRD — ClaimResolve: Automated Customer Refund Triage

**Author:** Prince Kumar · IIT Bombay  
**Domain:** Fintech & Customer Operations PM  
**Version:** 1.0  
**Stack:** Next.js browser demo (client-side policy engine)

---

## Problem

Customer support agents spend **8–12 minutes per refund ticket** manually checking transaction dates, account warnings, and eligibility — even for small-dollar claims. Queue backlogs hurt CSAT, ops cost scales linearly, and inconsistent manual decisions create compliance risk.

## Solution

**ClaimResolve** ingests refund requests, evaluates them against configurable business policies, and returns **Approve**, **Deny**, or **Human Review** — with a rule audit trail and customer email draft.

```
Customer form → Order lookup → Policy engine → Verdict + notification draft
                                      ↓
                              Ops metrics (auto-rate, false refund rate)
```

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Policy Configuration Panel** | Toggles and thresholds for max refund value, transaction age, account warnings, repeat claims, fraud block, eligibility |
| **Submission Portal** | Email + order ID form against seeded billing records |
| **Automated Verdict** | Severity-ranked rule evaluation with triggered-policy detail |
| **Email Drafts** | Approve / deny / review templates citing specific rules |
| **Batch Simulation** | Process all mock orders to measure north-star and guardrail KPIs |

---

## Default Policies

| Policy | Default | Breach action |
|--------|---------|---------------|
| Max refund value | $50 | Human review |
| Transaction age limit | 30 days | Deny |
| Account warning count | < 2 | Human review |
| Repeat claims (90d) | ≤ 2 | Human review |
| Block high-risk accounts | On | Deny |
| Require eligible orders | On | Human review |

---

## Key Metrics

| Metric | Formula / Definition |
|--------|---------------------|
| **Auto-Resolution Rate** (north star) | `(Approved + Denied) / Total claims × 100` — claims solved without agent touch |
| **False Refund Rate** (guardrail) | `$ value of invalid auto-approvals / $ value of all auto-approvals × 100` |
| **Human review queue** | Count routed to agents |
| **Processing time** | End-to-end policy evaluation latency |

---

## Mock Order Catalog

| Order ID | Amount | Scenario | Expected verdict |
|----------|--------|----------|------------------|
| ORD-1001 | $24.99 | Clean, recent | Approve |
| ORD-1002 | $79.00 | Over cap | Human review |
| ORD-1003 | $32.50 | 42 days old | Deny |
| ORD-1004 | $41.00 | 2 account warnings | Human review |
| ORD-1005 | $18.75 | 3 prior claims | Human review |
| ORD-1006 | $55.00 | Fraud flagged | Deny |
| ORD-1007 | $29.99 | Ineligible (partial refund) | Human review |
| ORD-1008 | $12.00 | Clean | Approve |

---

## Success Criteria

- Single claim processed in < 1 second (browser)
- Batch of 8 orders shows > 60% auto-resolution with default policies
- False refund rate = 0% on seeded ground-truth when eligibility rule enabled
- Every verdict includes ≥ 1 auditable rule evaluation

---

## Future (Production)

- Billing API + payment processor integration
- Real-time fraud score feed
- Agent queue handoff with SLA tracking
- A/B policy experiments and rollback
