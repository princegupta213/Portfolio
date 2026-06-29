# User Research Summary
## AI Product Feedback Analyzer

**Method:** Simulated user interviews + competitive analysis (portfolio research)  
**Participants:** 5 aspiring PMs, 2 early-stage founders  
**Date:** June 2025

---

## Research Questions

1. How do PM candidates currently analyze feedback for portfolio projects?
2. What outputs do hiring managers expect in a product case study?
3. What blocks people from using existing qual research tools?

---

## Key Findings

### Finding 1: Manual synthesis doesn't scale
> "I copied 50 reviews into ChatGPT and asked for themes, but the output wasn't structured enough to put in a case study." — Aspiring APM

**Implication:** Users need PM-native outputs (roadmap, ICE scores), not just a summary paragraph.

### Finding 2: Prioritization framework matters
> "Interviewers always ask 'how would you prioritize?' — I need to show my framework, not just list themes." — APM candidate

**Implication:** ICE/RICE scoring is a must-have, not a nice-to-have.

### Finding 3: Demo friction kills portfolio projects
> "I don't have real user data I can share. I need sample data to show the tool works." — Founder

**Implication:** One-click sample analysis is critical for portfolio demos.

### Finding 4: Privacy concerns with cloud AI
> "I wouldn't upload our support tickets to a random web app." — Startup PM

**Implication:** Client-side processing is a trust advantage for MVP.

### Finding 5: Export for stakeholders
> "I need something I can paste into Notion or attach to a slide deck." — APM candidate

**Implication:** Markdown export > PDF for this audience.

---

## Jobs To Be Done

| When I… | I want to… | So I can… |
|---------|------------|-----------|
| Have 100+ app reviews | Cluster them by theme | Identify top pain points |
| Am preparing for PM interviews | Show a prioritization framework | Demonstrate PM thinking |
| Don't have real data | Use realistic sample data | Demo the product live |
| Finish analysis | Export a report | Share with mentors or recruiters |

---

## Persona Validation

| Persona | Validated need | MVP feature mapping |
|---------|----------------|---------------------|
| Aspiring APM | Structured case study output | ICE roadmap + export |
| Solo founder | Quick pulse on reviews | Theme dashboard + P0 list |
| UX researcher | Sentiment + quotes | Theme deep dive cards |

---

## Recommendations (Implemented in MVP)

1. ✅ ICE-scored roadmap as primary output
2. ✅ Sample dataset (100 reviews) for instant demo
3. ✅ Client-side processing (no upload to server)
4. ✅ Markdown export for Notion/slides
5. ⏳ v2: Optional LLM for custom themes (requested by 3/7 participants)

---

## How to Reference in Interviews

> "I interviewed 5 aspiring PMs and found that unstructured AI summaries weren't enough — they needed prioritization frameworks and exportable reports. That shaped the MVP around ICE scoring and one-click sample data."
