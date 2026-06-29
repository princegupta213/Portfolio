# PRD — CheckoutFriction: Checkout Drop-off Diagnoser

**Author:** Prince Kumar · Associate Product Manager  
**Status:** Ready for Engineering Review  
**Target Release:** Q3 2026

---

## Goal

E-commerce PMs need to quantify conversion uplift from checkout optimizations before allocating dev resources. **CheckoutFriction** simulates a 4-step funnel with toggleable tactics.

## MVP Features

| Feature | Description |
|---------|-------------|
| Step Simulator | Cart → Shipping → Billing → Payment Success |
| Optimization Toggles | Autofill (−20% shipping drop-off), Guest (−15% cart), Apple Pay (skip steps) |
| Funnel Analytics | Bar chart + table with live drop-off counts |

## Key Metrics

| Metric | Description |
|--------|-------------|
| Cart Abandonment Rate | North star |
| Avg Checkout Duration | Secondary metric |

## NFR

Responsive layout for mobile (> 60% of checkouts).

## Demo

`/projects/checkout-friction`
