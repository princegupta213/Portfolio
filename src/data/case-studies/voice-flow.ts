export const voiceFlowCaseStudy = {
  title: "VoiceFlow",
  subtitle: "Multi-Modal Translation Latency Tracker",
  timeline: "2026 · Platform PM portfolio project",
  role: "Platform PM & Builder",

  problem: {
    headline: "Voice translation breaks when latency exceeds 1.2 seconds",
    body: "Customer support interpreters and travel apps rely on real-time speech pipelines — STT → translation → TTS. When any hop stalls, users talk over each other and trust drops. Platform PMs need per-hop visibility to decide whether to shrink audio chunks, upgrade models, or re-host inference — before burning budget on the wrong layer.",
    stats: [
      { label: "Conversational break", value: "> 1.2 s" },
      { label: "North star target", value: "< 800 ms" },
      { label: "Pipeline hops", value: "3 + overhead" },
    ],
  },

  research: {
    headline: "What VoIP and translation teams optimize",
    findings: [
      "Chunk size is the fastest latency lever — but shrinks context window and BLEU score.",
      "Model tier (Tiny vs. Large) dominates STT hop cost; translation hop scales with token length.",
      "PMs need guardrails: latency target AND quality floor, not latency alone.",
      "Dashboard refresh must feel instant (< 50 ms) or engineers won't trust live diagnostics.",
    ],
    method: "Synthesized from real-time interpretation product postmortems, Whisper latency benchmarks, and conversational UX research on turn-taking delays.",
    researchDocHref: "/docs/voice-flow-PRD",
  },

  solution: {
    headline: "What I built",
    features: [
      { name: "Hop Latency Visualizer", why: "Stacked timeline + bar chart for STT, translation, TTS, and pipeline overhead" },
      { name: "Audio Chunk Size Slider", why: "200–1000 ms with product rule: smaller chunks = lower delay, lower BLEU" },
      { name: "Model Quality vs. Speed Toggle", why: "Fast/Cheap vs. Accurate/Slow model stacks with live label updates" },
      { name: "North Star & Guardrail KPIs", why: "E2E latency vs. 800 ms target; BLEU vs. 72% guardrail with pass/fail styling" },
      { name: "Live event stream", why: "Simulated utterances update metrics in real time for bottleneck spotting" },
    ],
  },

  results: {
    headline: "Tuning trade-offs (fast model, 500 ms chunks)",
    summary:
      "At 500 ms chunks with fast models, E2E latency lands ~490 ms — under the 800 ms north star — but BLEU sits near 68%, below the 72% guardrail. Switching to accurate models or 800 ms chunks lifts BLEU above guardrail at the cost of ~900 ms E2E. The dashboard makes this Pareto frontier visible for hosting budget decisions.",
    metrics: [
      { label: "E2E (fast, 500 ms)", value: "~490 ms" },
      { label: "BLEU (fast, 500 ms)", value: "~68%" },
      { label: "E2E (accurate, 800 ms)", value: "~920 ms" },
      { label: "BLEU (accurate, 800 ms)", value: "~88%" },
    ],
    sampleRoutes: [
      { config: "Fast · 200 ms chunks", e2e: "~380 ms", bleu: "~62%", verdict: "Fast but low quality" },
      { config: "Fast · 500 ms chunks", e2e: "~490 ms", bleu: "~68%", verdict: "Latency OK, BLEU borderline" },
      { config: "Accurate · 500 ms", e2e: "~1,050 ms", bleu: "~82%", verdict: "Quality OK, latency high" },
      { config: "Accurate · 800 ms", e2e: "~920 ms", bleu: "~88%", verdict: "Best quality, latency trade-off" },
    ],
  },

  tradeoffs: {
    headline: "Key platform decisions",
    decisions: [
      {
        decision: "Expose chunk size as primary PM lever",
        rationale: "Fastest path to sub-800 ms without re-architecting; quality impact is quantified via BLEU guardrail.",
      },
      {
        decision: "Simulate hops client-side vs. real API",
        rationale: "Portfolio demo runs offline with deterministic physics; production would wire OpenTelemetry spans per hop.",
      },
      {
        decision: "Dual KPI pass/fail styling",
        rationale: "Forces PMs to optimize on the frontier, not chase latency alone.",
      },
    ],
  },

  nextSteps: {
    headline: "Production roadmap",
    items: [
      "Wire real Whisper / NLLB / TTS endpoints with span tracing",
      "A/B chunk strategies on live interpreter sessions",
      "Alert when p95 E2E exceeds 1.2 s conversational break threshold",
      "Cost-per-hop attribution for model hosting budget reviews",
    ],
  },

  links: {
    liveDemo: "/projects/voice-flow",
    prd: "/docs/voice-flow-PRD",
  },
};
