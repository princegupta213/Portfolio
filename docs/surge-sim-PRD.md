# PRD — SurgeSim: Dynamic Price & Supply Elasticity Dashboard

**Author:** Prince Kumar · IIT Bombay  
**Domain:** Marketplaces & Gig Economy PM  
**Version:** 1.0  
**Stack:** Next.js browser demo (client-side marketplace simulation)

---

## Problem

Ride-share and delivery platforms face a **supply–demand imbalance** during spikes. Customers wait longer; drivers reject low-paying trips in traffic. Surge pricing attracts supply but risks **checkout abandonment**. PMs need a sandbox to tune surge caps, weather shocks, and zone-level balance before changing live pricing policy.

## Solution

**SurgeSim** models a 6×4 city grid where each zone has independent supply, demand, and surge multipliers. PMs adjust global levers and observe match rate (north star) vs. abandonment (guardrail) in real time.

```
Weather event → Demand/Supply multipliers → Zone imbalance → Surge algorithm
                                                      ↓
                              Driver accept rate + Checkout conversion → Match rate
```

---

## Key Features

| Feature | Description |
|---------|-------------|
| **City Grid Map** | 24 zones with demand weights; color = surge intensity |
| **Supply / Demand Sliders** | Global driver pool vs. customer request volume |
| **Weather Events** | Clear, light rain, heavy rain, heat wave, snow |
| **Surge Algorithm Tweaker** | Min/max multiplier (1.2x–3.0x default) + sensitivity |
| **Market Balance Monitor** | Live chart of match rate vs. abandonment |

---

## Metrics

| Metric | Type | Definition |
|--------|------|------------|
| **Order Match Rate** | North star | Matched orders ÷ checkout attempts × 100 |
| **Checkout Abandonment Rate** | Guardrail | Customers leaving due to surge/wait ÷ total demand × 100 |
| **Avg Surge Multiplier** | Operational | Mean surge across all zones |
| **Driver Accept Rate** | Supply health | % of online drivers accepting dispatched trips |
| **Checkout Conversion** | Demand health | % of requests proceeding past price screen |

---

## Surge Formula (simplified)

```
imbalance_ratio = zone_demand / zone_supply
normalized      = clamp((imbalance_ratio - 1) / 2.5, 0, 1)
surge           = clamp(1 + normalized × sensitivity × (max - 1), min, max)
```

Driver accept rate increases with surge; checkout conversion decreases with surge and wait time.

---

## Weather Multipliers

| Event | Demand | Supply |
|-------|--------|--------|
| Clear | 1.0× | 1.0× |
| Light Rain | 1.15× | 0.92× |
| Heavy Rain | 1.45× | 0.72× |
| Heat Wave | 1.2× | 0.85× |
| Snow | 1.35× | 0.65× |

---

## Success Criteria

- PM can run Heavy Rain scenario and see match rate drop within 2 slider adjustments
- Grid highlights highest-surge zones within 1 second of parameter change
- Abandonment guardrail visible alongside north star on every screen
- Preset scenarios load in one click for interview demos

---

## Out of Scope (v1)

- Real geospatial map / GPS data
- ML demand forecasting
- Driver incentive quests
- Multi-sided pricing (restaurant/delivery fees)
