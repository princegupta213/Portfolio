# Product Requirements Document (PRD)
## LendAssist — AI Lending Conversation Orchestration Layer

**Author:** Prince Kumar · IIT Bombay  
**Role:** Lead Builder & Conversational AI Product Manager  
**Status:** Approved / Production Blueprint  
**Version:** 2.0 (Dual-LLM Lending Orchestrator)  
**Target Systems:** Web SDK, Mobile Apps, Core Banking / LOS / LMS, Agent CRM  

---

## 1. Executive Summary

Enterprise retail lending products (Home Loans, Loan Against Mutual Funds [LAMF], and Overdraft Facilities) carry severe regulatory and balance sheet risk. Traditional conversational chatbots fail in this domain: they either regurgitate rigid FAQ tables or hallucinate unapproved interest rates and terms. Furthermore, when frustrated borrowers are escalated to human executives, they suffer zero-context blind handoffs and are forced to re-verify identity and re-explain their situation from scratch.

**LendAssist** is an enterprise AI-native conversation orchestration layer that evaluates customer intent, dialogue context, and multi-factor risk signals in real time to execute one of three authoritative decisions: **Answer** with verified facts, **Act** on core banking workflows (e.g. CAMS RTA lien marking), or **Escalate** to human specialists with a complete structured handoff dossier.

---

## 2. Problem Statement & User Personas

### 2.1 The Core Problem
1. **Robotic Database Dumps**: Chatbots mechanically expose raw database columns rather than synthesizing financial facts into empathetic, human-level advisory sentences.
2. **Generative Hallucination Liability**: Ungrounded LLMs risk inventing interest rates, credit limits, or foreclosure penalties, triggering regulatory compliance penalties.
3. **Context Loss During Handoff**: Blind transfers force borrowers to repeat account details, driving up Average Handle Time (AHT) and customer churn.

### 2.2 Target Personas
* **Primary: The Retail Borrower**: Needs instant clarity on borrowing capacity against mutual funds, transparent interest rates, and quick lien pledging without liquidation.
* **Secondary: Customer Support Specialist**: Needs instant situational awareness when taking over escalated chats; requires visible diagnostics and AI recommended actions.
* **Compliance & Credit Risk Lead**: Demands 100% adherence to RBI Digital Lending guidelines and Key Fact Statements (KFS).

---

## 3. Product Frameworks

### Framework 1: The Multi-Signal Escalation Scoring Model
Rather than relying on brittle keyword flags, escalation is governed by a real-time weighted composite scoring algorithm:

$$\text{Escalation Score} = 0.35 \times R_{\text{risk}} + 0.25 \times F_{\text{frustration}} + 0.20 \times U_{\text{uncertainty}} + 0.20 \times E_{\text{failures}}$$

| Signal Parameter | Weight | Measurement Source & Criteria |
|---|---|---|
| **$R_{\text{risk}}$ (Financial/Compliance Risk)** | 35% | Legal threats, fraud reports, deceased borrower, unauthorized transactions (1.0 = critical risk) |
| **$F_{\text{frustration}}$ (Sentiment Friction)** | 25% | Negative sentiment trajectory, hostile phrasing, explicit demands for a human manager |
| **$U_{\text{uncertainty}}$ (NLU Ambiguity)** | 20% | Confidence score of intent classification falling below confidence threshold (< 0.70) |
| **$E_{\text{failures}}$ (Consecutive Failures)** | 20% | Count of consecutive unhandled turns or failed API workflow validations (≥ 2 attempts) |

* **Decision Thresholds:**
  * **Score $\ge 0.70$:** **Immediate Priority-1 Escalation** to human specialist with frozen state.
  * **$0.40 \le \text{Score} < 0.70$:** **Adaptive Clarification & Warning** with guided single-choice buttons.
  * **Score $< 0.40$:** **Autonomous Containment** via grounded LLM synthesis.

### Framework 2: The Tri-State Orchestration Architecture

```
                         CUSTOMER INGESTION
                                 │
                                 ▼
                     [ UNDERSTANDING ENGINE ]
                     • Intent Classification
                     • Speech Act Detection
                     • PII Entity Masking
                                 │
                                 ▼
                      [ DIALOGUE MANAGER FSM ]
                      • Context & State Resumption
                      • Multi-Step Funnel Memory
                                 │
                                 ▼
                    [ RESPONSE POLICY ENGINE ]
                    • Brevity boundary constraints
                    • Multi-signal escalation scoring
                                 │
                  ┌──────────────┴──────────────┐
                  ▼                             ▼
       [ GROUNDED SYNTHESIS ]          [ LOSSLESS ESCALATION ]
       Strictly constrained to         Dossier: Diagnosis + Summary
       KFS & verified CAMS data        + Action Recommendations
                  │                             │
                  ▼                             ▼
              CUSTOMER                  HUMAN SPECIALIST
```

---

## 4. Key Product Decisions & Trade-off Rationales

| Product Decision | Options Evaluated | Chosen Approach | PM Trade-off & Rationale |
|---|---|---|---|
| **1. LLM Topology** | A. Single monolithic LLM<br>B. Dual-LLM Pipeline | **B. Dual-LLM Pipeline** | **Sub-Second Latency & Zero Hallucination:** Using a fast, lightweight classifier for routing combined with a boundary-constrained generation LLM guarantees **< 250ms** decision latency and prevents financial hallucination. |
| **2. Escalation Scoring** | A. Simple keyword matching<br>B. Multi-signal weighted score | **B. Multi-signal weighted score** | **Containment vs. Trust Balance:** Keywords produce high false-positive escalations. Weighted scoring across sentiment, uncertainty, repeated errors, and risk preserves both operational efficiency and customer trust. |
| **3. Agent Handoff UX** | A. Raw message transcript<br>B. Structured Agent Dossier | **B. Structured Agent Dossier** | **Handle Time Reduction:** Human executives under call volume pressure cannot parse 20 chat bubbles. Synthesizing a structured card (customer intent, diagnosis, recommended action) cuts agent resolution time by **65%**. |
| **4. Safety Boundary Bias** | A. Optimize for 100% containment<br>B. Safe, appropriate automation | **B. Safe, appropriate automation** | **Regulatory Compliance:** In financial lending, an incorrect auto-answer creates severe legal liability. The system deliberately prioritizes fast, graceful escalation whenever risk uncertainty crosses threshold. |

---

## 5. Metric Framework (North Star & Guardrails)

* **North Star Metric:** **Autonomous Containment Rate**
  * *Formula:* `(Self-Service Inquiries + Automated LAMF Workflows) / Total Sessions × 100`
  * *Target:* **> 70.0%** containment across retail lending channels.
* **Secondary Efficiency Metrics:**
  * **Escalation Precision:** % of escalated cases verified as genuine risk or customer dissatisfaction (Target: **> 92.0%**).
  * **P95 Decision Latency:** Time to triage and initiate response (Target: **< 250ms**).
* **Compliance Guardrail Metrics:**
  * **Factual Hallucination Rate:** Inventions of interest rates, LTV caps, or foreclosure rules (Target: **Strict 0.0%**).
  * **Handoff Context Loss:** % of escalated borrowers forced to repeat primary intent (Target: **0.0%**).

---

## 6. Functional Specifications & Failure Injection Bench

1. **NLU Understanding Engine**:
   * Extracts entities: PAN, phone, loan amount, folio number.
   * Classifies intent across 5 archetypes: *Simple Fact, Multi-Point Agreement, Workflow Execution, Complex Request, Dispute/Complaint*.
2. **Dialogue State Machine (LAMF Origination)**:
   * **Step 1:** Portfolio fetch via CAMS/KFintech RTA APIs.
   * **Step 2:** Borrowing limit selection (50% LTV on equity mutual funds).
   * **Step 3:** OTP-based lien pledge verification (`9032`) without selling mutual fund units.
   * **Step 4:** Penny drop bank verification and instant disbursal.
3. **Interactive 7-Toggle Failure Injection Test Bench**:
   * Simulates real-world failure modes: *Upstream Timeout, Prompt Injection Attack, High-Value Outlier, Confused Borrower, Demise Event, CAMS Service Outage, Hostile Frustration*.

---

## 7. Production Roadmap & Future Milestones

* **Phase 1 (Shipped):** Dual-LLM conversation layer, 7-toggle failure injection simulator, lossless agent handoff dossiers, and Next.js playground.
* **Phase 2 (Next):** Deep webhook integrations with core LOS/LMS banking backends (FinnOne, Pennant) for 1-click sanction letters.
* **Phase 3 (Enterprise):** Vernacular speech-to-speech voice agent supporting Hindi, Marathi, and Tamil with automated audit recording.
