"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LatencyResult } from "@/lib/voice-flow/types";
import { LATENCY_TARGETS } from "@/lib/voice-flow/engine";

const HOP_COLORS = {
  stt: "#6366f1",
  translation: "#0ea5e9",
  tts: "#10b981",
  overhead: "#94a3b8",
};

interface Props {
  result: LatencyResult;
  history: LatencyResult[];
}

export function VoiceFlowDashboard({ result, history }: Props) {
  const hops = [
    { name: "STT", ms: result.sttMs, color: HOP_COLORS.stt },
    { name: "Translation", ms: result.translationMs, color: HOP_COLORS.translation },
    { name: "TTS", ms: result.ttsMs, color: HOP_COLORS.tts },
    { name: "Overhead", ms: result.pipelineOverheadMs, color: HOP_COLORS.overhead },
  ];

  const historyChart = history.slice(-12).map((h, i) => ({
    t: i + 1,
    e2e: h.endToEndMs,
    bleu: h.bleuScore,
  }));

  const totalMs = result.endToEndMs;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="End-to-End Latency"
          value={`${result.endToEndMs} ms`}
          sub={`Target < ${LATENCY_TARGETS.endToEndMs} ms`}
          ok={result.meetsLatencyTarget}
          warn={result.endToEndMs > LATENCY_TARGETS.conversationalBreakMs}
        />
        <MetricCard
          label="BLEU Score"
          value={`${result.bleuScore}%`}
          sub={`Guardrail > ${LATENCY_TARGETS.bleuMin}%`}
          ok={result.meetsBleuGuardrail}
        />
        <MetricCard
          label="STT Hop"
          value={`${result.sttMs} ms`}
          sub="Speech-to-Text"
        />
        <MetricCard
          label="Translation + TTS"
          value={`${result.translationMs + result.ttsMs} ms`}
          sub="Translate + synthesize"
        />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-zinc-900">Hop Latency Visualizer</h3>
          <span className="text-sm text-zinc-500">Total: {totalMs} ms</span>
        </div>
        <div className="mt-4 flex h-10 overflow-hidden rounded-lg">
          {hops.map((hop) => (
            <div
              key={hop.name}
              className="flex items-center justify-center text-xs font-medium text-white transition-all duration-300"
              style={{
                width: `${(hop.ms / totalMs) * 100}%`,
                backgroundColor: hop.color,
                minWidth: hop.ms > 0 ? "48px" : 0,
              }}
              title={`${hop.name}: ${hop.ms} ms`}
            >
              {hop.ms >= 60 ? `${hop.ms}ms` : ""}
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-4">
          {hops.map((hop) => (
            <div key={hop.name} className="flex items-center gap-2 text-sm text-zinc-600">
              <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: hop.color }} />
              {hop.name} · {hop.ms} ms
            </div>
          ))}
        </div>

        <div className="mt-6 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hops} layout="vertical" margin={{ left: 8, right: 8 }}>
              <XAxis type="number" unit=" ms" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`${v} ms`, "Latency"]} />
              <Bar dataKey="ms" radius={[0, 4, 4, 0]}>
                {hops.map((h) => (
                  <Cell key={h.name} fill={h.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {historyChart.length > 1 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h3 className="font-semibold text-zinc-900">Recent translation events</h3>
          <div className="mt-4 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historyChart}>
                <XAxis dataKey="t" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit=" ms" />
                <Tooltip />
                <Bar dataKey="e2e" fill="#6366f1" name="E2E (ms)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  ok,
  warn,
}: {
  label: string;
  value: string;
  sub: string;
  ok?: boolean;
  warn?: boolean;
}) {
  const border =
    ok === true
      ? "border-emerald-200 bg-emerald-50/50"
      : ok === false
        ? warn
          ? "border-red-200 bg-red-50/50"
          : "border-amber-200 bg-amber-50/50"
        : "border-zinc-200 bg-white";

  return (
    <div className={`rounded-xl border p-4 ${border}`}>
      <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-zinc-900">{value}</div>
      <div className="mt-1 text-xs text-zinc-500">{sub}</div>
    </div>
  );
}
