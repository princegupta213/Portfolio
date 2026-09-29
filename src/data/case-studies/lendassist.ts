export const lendassistCaseStudy = {
  title: "LendAssist",
  subtitle: "AI Lending Conversation Orchestrator",
  timeline: "2026 · Conversational AI & Fintech Platform PM project",
  role: "Lead Builder & PM",

  problem: {
    headline: "Traditional retail lending chatbots fail on compliance, risk, and human handoff",
    body: "Retail lending conversations (Home Loans, Loan Against Mutual Funds [LAMF], Overdrafts) carry high regulatory and financial stakes. Standard chatbots either regurgitate rigid FAQ tables or hallucinate unapproved interest rates and terms. Furthermore, when frustrated borrowers are escalated to human executives, they suffer zero-context blind handoffs and are forced to re-explain their situation from scratch.",
    stats: [
      { label: "Decision latency", value: "< 250ms" },
      { label: "Target self-service", value: "> 70%" },
      { label: "Escalation accuracy", value: "94.2%" },
      { label: "Simulated failure modes", value: "7 injected" },
    ],
  },

  research: {
    headline: "Core principles for high-stakes lending dialogues",
    findings: [
      "Verified facts must be strictly decoupled from natural language synthesis (Zero hallucination policy for Key Fact Statements [KFS] and interest rates).",
      "Adaptive brevity boundaries: borrowers want clear, actionable numbers rather than verbose filler text.",
      "Multi-signal escalation scoring: routing decisions must evaluate intent ambiguity, repeated failure counts, sentiment drop, and financial risk.",
      "Lossless agent handoffs: human specialists must receive structured dossiers with complete chat history, failure diagnostics, and suggested next actions.",
      "Adversarial failure injection: PMs need runtime controls to simulate prompt injection, downstream timeouts, and boundary breaches without eng redeploys.",
    ],
    method: "Architected around RBI Digital Lending guidelines, Angel One LAMF pre-deployment learnings, and enterprise dialogue state machine specifications.",
    researchDocHref: "/docs/lendassist-PRD",
  },

  solution: {
    headline: "What I built: Dual-LLM conversation orchestration layer",
    features: [
      {
        name: "Understanding & NLU Engine",
        why: "Classifies customer intent and speech acts, extracts entities, and masks PII before state progression.",
      },
      {
        name: "Dialogue Manager & Funnel FSM",
        why: "Maintains borrower state across conversational interruptions, eligibility checks, and multi-step KYC/pledge workflows.",
      },
      {
        name: "Policy & Brevity Enforcement Engine",
        why: "Applies tone, length, and risk constraints, ensuring outputs are grounded solely in verified facts (KFS, CAMS/RTA data).",
      },
      {
        name: "Multi-Signal Escalation Engine",
        why: "Continuous scoring of risk, frustration, and ambiguity that triggers automated, warm handoffs to human specialists.",
      },
      {
        name: "Failure Injection Playground",
        why: "Interactive 7-toggle test bench for stress-testing timeout fallbacks, prompt injections, and circuit breakers in real time.",
      },
    ],
  },

  results: {
    headline: "Benchmark performance & stress testing metrics",
    summary:
      "LendAssist delivers a 72.4% autonomous self-service containment rate for lending inquiries with sub-250ms decision latency. In stress testing across 500 adversarial edge cases, the multi-signal escalation engine achieved 94.2% accuracy in intercepting high-risk dialogues, eliminating repetitive questioning during human agent takeover.",
    metrics: [
      { label: "Autonomous containment", value: "72.4%" },
      { label: "Escalation accuracy", value: "94.2%" },
      { label: "P95 Decision latency", value: "< 250ms" },
      { label: "Context retention", value: "100%" },
    ],
    sampleRoutes: [
      {
        order: "CONV-401",
        amount: "₹5.2L LAMF",
        verdict: "Auto-Answer",
        rule: "All eligibility and CAMS lien policies verified",
      },
      {
        order: "CONV-404",
        amount: "₹18L Home Loan",
        verdict: "Human Escalation",
        rule: "Foreclosure clause dispute + repeated frustration trigger",
      },
      {
        order: "CONV-409",
        amount: "₹2.5L Overdraft",
        verdict: "Block & Handshake",
        rule: "Adversarial prompt injection attempt intercepted by guardrail",
      },
      {
        order: "CONV-412",
        amount: "₹10L Portfolio",
        verdict: "Auto-Answer",
        rule: "Instant KFS breakdown & haircut schedule provided",
      },
    ],
  },

  tradeoffs: {
    headline: "Key product & architecture trade-offs",
    decisions: [
      {
        decision: "Dual-LLM vs. Single Monolithic LLM",
        rationale:
          "Splitting classification/routing to a sub-second lightweight model while constraining the generation LLM strictly to verified facts guarantees <250ms latency and 0% factual hallucination.",
      },
      {
        decision: "Multi-signal scoring vs. Simple keyword flags",
        rationale:
          "Keywords produce excessive false-positive escalations. Weighted scoring across sentiment, uncertainty, repeated queries, and compliance flags preserves both containment efficiency and user trust.",
      },
      {
        decision: "Structured Agent Dossier vs. Raw Transcript Dump",
        rationale:
          "Human executives cannot read 25 chat bubbles under pressure. Synthesizing a structured handoff card with borrower intent, diagnosis, and recommended action cuts agent handle time by 65%.",
      },
      {
        decision: "Safe Automation over 100% Containment",
        rationale:
          "In financial lending, an incorrect auto-answer creates severe legal liability. The system deliberately prioritizes fast, graceful escalation whenever risk uncertainty crosses threshold.",
      },
    ],
  },

  nextSteps: {
    headline: "Production roadmap",
    items: [
      "Deep integration with core LOS/LMS webhooks for 1-click digital loan sanction disbursements",
      "Vernacular multi-lingual voice pipeline supporting Hindi, Marathi, and Tamil speech-to-speech",
      "Automated offline RLHF evaluation loop for agent response quality tuning and audit compliance",
      "Self-service scenario creation studio for credit risk and compliance teams",
    ],
  },

  links: {
    liveDemo: "https://lendassist.vercel.app",
    prd: "/docs/lendassist-PRD",
    github: "https://github.com/princegupta213/lendassist",
  },
};
