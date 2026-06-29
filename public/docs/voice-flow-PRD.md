# PRD — VoiceFlow: Multi-Modal Translation Latency Tracker

**Author:** Prince Kumar · Associate Product Manager  
**Status:** Ready for Engineering Review  
**Target Release:** Q3 2026  
**Stack:** Next.js browser demo (client-side latency simulation)

---

## Goal & Product Objective

Real-time voice translation applications suffer from processing delays. When total time between one person finishing speaking and the translation playing exceeds **1.2 seconds**, conversational flow breaks down.

**Product Goal:** Build a diagnostic latency analyzer dashboard that breaks down processing times at each stage of a multi-modal pipeline, helping engineers isolate performance bottlenecks.

---

## User Persona & Use Cases

- **Persona:** Platform Product Manager / VoIP Lead Engineer
- **User Story:** *As a platform PM, I want to see a live breakdown of translation latency across STT, translation, and TTS steps so that I can decide where to optimize our model hosting budgets.*

---

## Functional Requirements (MVP)

| Feature | Description |
|---------|-------------|
| **Hop Latency Visualizer** | Timeline showing STT, Translation, and TTS hop times |
| **Audio Chunk Size Slider** | 200ms–1000ms packets; smaller = lower delay, less context |
| **Model Quality vs. Speed** | Fast/Cheap (Whisper-Tiny) vs. Accurate/Slow (Whisper-Large) |

---

## Key Metrics

| Metric | Target |
|--------|--------|
| **North Star:** End-to-End Latency | < 800 ms |
| **Guardrail:** Translation BLEU Score | > 72% |
| **Conversational break threshold** | > 1,200 ms |

---

## Non-Functional Requirements

- Dashboard refresh within **50 ms** of a simulated translation finishing
- Real-time hop breakdown updates as controls change

---

## Demo

Live portfolio demo: `/projects/voice-flow`
