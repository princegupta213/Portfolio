"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Gauge,
  Mic,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Zap,
} from "lucide-react";
import {
  computeLatency,
  LATENCY_TARGETS,
  MODEL_LABELS,
} from "@/lib/voice-flow/engine";
import type { ModelMode } from "@/lib/voice-flow/types";
import { VoiceFlowDashboard } from "@/components/VoiceFlowDashboard";

export function VoiceFlowApp() {
  const [chunkSizeMs, setChunkSizeMs] = useState(500);
  const [modelMode, setModelMode] = useState<ModelMode>("fast");
  const [live, setLive] = useState(true);
  const [tick, setTick] = useState(0);
  const [history, setHistory] = useState<ReturnType<typeof computeLatency>[]>([]);

  const result = useMemo(
    () => computeLatency({ chunkSizeMs, modelMode }, tick),
    [chunkSizeMs, modelMode, tick]
  );

  useEffect(() => {
    setHistory((prev) => [...prev.slice(-19), result]);
  }, [result.endToEndMs, result.bleuScore]);

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setTick((t) => t + 1), 1800);
    return () => clearInterval(id);
  }, [live]);

  const simulateOnce = useCallback(() => setTick((t) => t + 1), []);

  const reset = useCallback(() => {
    setChunkSizeMs(500);
    setModelMode("fast");
    setHistory([]);
    setTick(0);
  }, []);

  const models = MODEL_LABELS[modelMode];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          <Mic className="h-3.5 w-3.5" />
          Platform PM · Multi-Modal Pipeline
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">VoiceFlow</h1>
        <p className="mt-2 max-w-2xl text-zinc-600">
          Diagnostic latency analyzer for real-time voice translation — break down STT, translation,
          and TTS hops to isolate bottlenecks and tune chunk size vs. model quality.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Controls */}
        <aside className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
              <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
              Pipeline controls
            </div>

            <div className="mt-6">
              <label className="flex items-center justify-between text-sm font-medium text-zinc-700">
                Audio chunk size
                <span className="font-mono text-indigo-600">{chunkSizeMs} ms</span>
              </label>
              <input
                type="range"
                min={200}
                max={1000}
                step={50}
                value={chunkSizeMs}
                onChange={(e) => setChunkSizeMs(Number(e.target.value))}
                className="mt-2 w-full accent-indigo-600"
              />
              <p className="mt-2 text-xs text-zinc-500">
                Smaller chunks → lower delay, less context. Larger chunks → higher latency, better
                translation accuracy.
              </p>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-zinc-700">Model quality vs. speed</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["fast", "accurate"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setModelMode(mode)}
                    className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                      modelMode === mode
                        ? "border-indigo-600 bg-indigo-50 text-indigo-800"
                        : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    {mode === "fast" ? (
                      <>
                        <Zap className="mb-1 inline h-4 w-4" /> Fast / Cheap
                      </>
                    ) : (
                      <>
                        <Gauge className="mb-1 inline h-4 w-4" /> Accurate / Slow
                      </>
                    )}
                  </button>
                ))}
              </div>
              <ul className="mt-3 space-y-1 text-xs text-zinc-500">
                <li>STT: {models.stt}</li>
                <li>Translation: {models.translation}</li>
                <li>TTS: {models.tts}</li>
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={simulateOnce}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Play className="h-4 w-4" />
                Simulate utterance
              </button>
              <button
                type="button"
                onClick={() => setLive((l) => !l)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                  live
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-zinc-200 text-zinc-600"
                }`}
              >
                {live ? "Live · ON" : "Live · OFF"}
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-600">
            <p className="font-semibold text-zinc-800">Product rules</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>North star: E2E latency &lt; {LATENCY_TARGETS.endToEndMs} ms</li>
              <li>Guardrail: BLEU &gt; {LATENCY_TARGETS.bleuMin}%</li>
              <li>Conversational break &gt; {LATENCY_TARGETS.conversationalBreakMs} ms</li>
              <li>Dashboard refresh within {LATENCY_TARGETS.refreshMs} ms of event</li>
            </ul>
          </div>
        </aside>

        {/* Dashboard */}
        <main className="lg:col-span-2">
          <VoiceFlowDashboard result={result} history={history} />
        </main>
      </div>
    </div>
  );
}
