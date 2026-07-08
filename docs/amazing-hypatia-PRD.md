# PRD — Launch Employee (Ava)

**Author:** Prince Kumar · IIT Bombay  
**Version:** 1.0 · Autonomous Launch Workspace  
**Stack:** Next.js 16 (Turbopack) + TypeScript + Tailwind CSS + Framer Motion  

---

## Executive Summary

Ava is an autonomous **AI Product Launch Employee** designed to manage cross-functional launch complexity. Traditional dashboards are passive, requiring manual data synchronization and manual metrics checks. Ava coordinates GTM checklists, audits target segment configurations, runs post-launch telemetry simulations, and escalates critical business tradeoffs directly to a human PM.

---

## Problem

Product launch execution is fragmented:
- **Context Drift:** High-level strategic targets (e.g. pivoting from SMB to Enterprise) require manual updates across marketing assets, legal logs, support guidelines, and engineering task tickets.
- **Passive Interfaces:** PMs must regularly check monitoring tools to detect conversion drops, competitor moves, or customer complaints.
- **Action Inability:** Existing tools write static draft snippets but cannot run end-to-end simulations or manage actual milestone transitions.

---

## Product Goals

- **Goal 1:** Eliminate GTM drift by building a **Consistency Engine** that automatically matches dependent parameters and highlights updates.
- **Goal 2:** Build trust by rendering **Proactive Background Logs** showing the AI's step-by-step reasoning.
- **Goal 3:** Create a **Time Travel Simulator** allowing PMs to preview post-launch milestones and test operational readiness before launch day.
- **Goal 4:** Establish a **Human-in-the-Loop Sign-off Inbox** with a slide-over tradeoff drawer for direct multi-turn debates.

---

## Core Requirements & Specifications

### 1. Dynamic Knowledge Engine
- Ingests multiple workspace files (PRD, competitor SWOT, customer surveys, meeting transcripts) to construct a localized project brain.
- Populates key performance metrics (North Star, success metrics) and department lists dynamically.

### 2. Consistency Engine
- Toggles target segments (`SMB` vs. `Enterprise`) and strategic biases (`Growth`, `Reliability`, `Profit`).
- Propagates updates downstream: updates pricing tiers, customizes GTM email copy, and changes legal risk matrices.
- Highlights updated elements with a violet-purple transition pulse.

### 3. Time Travel Simulator
- Progression pathway: `Today` ➔ `Launch Day` ➔ `Day 3` ➔ `Week 2` ➔ `Month 1`.
- Day 3 triggers an activation drop anomaly (18% drop).
- Week 2 triggers a competitor clone event.
- Month 1 stabilizes performance trends.

### 4. Interactive Discuss Drawer
- Stateful chat client within the inbox checklist card.
- Supports viewport auto-scrolling, typing indicators, and contextual AI response loops based on turn count and selected alerts.

---

## Success Metrics

- **Folder Processing Time:** Ingesting 5+ template files completes in under 2.0 seconds.
- **Consistency Synchronization Latency:** Component parameter propagation takes under 1.5 seconds.
- **Product Health Derivation:** Real-time departmental readiness score updates instantly when checklists are toggled.

---

## System Architecture

```
State Provider (LaunchContext.tsx)
    ├── Brain State (North Star, segment, preference)
    ├── Plan State (Checklists, activeTasks, inboxAlerts)
    └── Sync hooks ➔ LocalStorage (Persisted Session)

UI Render Trees
    ├── LeftSidebar (Confidence gauge + Department health)
    ├── Header (Time Travel Stepper + Audience selectors)
    └── RightWork (Knowledge tabs, Checklist toggles, Metrics, History logs)
```

---

## Future Roadmap

- **Integration:** Link with live Jira ticket endpoints and Slack workspace webhooks.
- **Auditing:** Implement vector embeddings to run automated semantic similarity checks on user uploads.
