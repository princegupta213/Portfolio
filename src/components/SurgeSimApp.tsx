"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CloudRain,
  Download,
  Gauge,
  Map,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { ProjectDemoShell, EnterpriseAuditLog } from "@/components/enterprise/ProjectDemoShell";
import { EditableSection, AdminActionButton } from "@/components/enterprise/RbacControls";
import { ENTERPRISE_SCENARIOS, PROJECT_THEMES } from "@/lib/project-themes";
import { DEFAULT_SURGE, runSimulation } from "@/lib/surge-sim/engine";
import {
  ENTERPRISE_SURGE_PRESETS,
  SLA_ABANDONMENT_THRESHOLD,
} from "@/data/mock/surge-sim";
import { WEATHER_EVENTS } from "@/lib/surge-sim/weather";
import type { SimulationResult, TimeSeriesPoint, WeatherEvent } from "@/lib/surge-sim/types";
import { SurgeSimDashboard } from "@/components/SurgeSimDashboard";
import { SurgeSimGrid, getGridDimensions } from "@/components/SurgeSimGrid";

const HISTORY_MAX = 30;
const theme = PROJECT_THEMES["surge-sim"];
const scenarios = ENTERPRISE_SCENARIOS["surge-sim"] ?? [];

function auditTime() {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

export function SurgeSimApp() {
  const [activeScenario, setActiveScenario] = useState("rush-hour");
  const [baseSupply, setBaseSupply] = useState(48);
  const [baseDemand, setBaseDemand] = useState(72);
  const [weather, setWeather] = useState<WeatherEvent>("clear");
  const [surgeMin, setSurgeMin] = useState(DEFAULT_SURGE.minMultiplier);
  const [surgeMax, setSurgeMax] = useState(DEFAULT_SURGE.maxMultiplier);
  const [surgeSensitivity, setSurgeSensitivity] = useState(DEFAULT_SURGE.sensitivity);
  const [live, setLive] = useState(true);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [history, setHistory] = useState<TimeSeriesPoint[]>([]);
  const [tick, setTick] = useState(0);
  const [auditLog, setAuditLog] = useState<{ time: string; message: string }[]>([]);

  const result: SimulationResult = useMemo(
    () =>
      runSimulation({
        baseSupply,
        baseDemand,
        weather,
        surge: { minMultiplier: surgeMin, maxMultiplier: surgeMax, sensitivity: surgeSensitivity },
      }),
    [baseSupply, baseDemand, weather, surgeMin, surgeMax, surgeSensitivity, tick]
  );

  useEffect(() => {
    setHistory((prev) => {
      const next: TimeSeriesPoint = {
        t: prev.length,
        matchRate: result.metrics.orderMatchRate,
        abandonmentRate: result.metrics.checkoutAbandonmentRate,
        avgSurge: result.metrics.avgSurgeMultiplier,
      };
      return [...prev.slice(-(HISTORY_MAX - 1)), next];
    });
  }, [result.metrics.orderMatchRate, result.metrics.checkoutAbandonmentRate, result.metrics.avgSurgeMultiplier]);

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, [live]);

  const applyScenario = useCallback((id: string) => {
    const preset = ENTERPRISE_SURGE_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setActiveScenario(id);
    setBaseSupply(preset.baseSupply);
    setBaseDemand(preset.baseDemand);
    setWeather(preset.weather);
    setHistory([]);
    setAuditLog((prev) => [
      ...prev,
      { time: auditTime(), message: `Scenario applied: ${preset.label}` },
    ]);
  }, []);

  const reset = useCallback(() => {
    applyScenario("rush-hour");
    setSurgeMin(DEFAULT_SURGE.minMultiplier);
    setSurgeMax(DEFAULT_SURGE.maxMultiplier);
    setSurgeSensitivity(DEFAULT_SURGE.sensitivity);
    setSelectedZone(null);
  }, [applyScenario]);

  const slaBreached = result.metrics.checkoutAbandonmentRate > SLA_ABANDONMENT_THRESHOLD;

  const metrics = useMemo(
    () => [
      {
        label: "Order match rate",
        value: `${result.metrics.orderMatchRate.toFixed(1)}%`,
        sublabel: "North star metric",
      },
      {
        label: "Checkout abandonment",
        value: `${result.metrics.checkoutAbandonmentRate.toFixed(1)}%`,
        sublabel: `SLA guardrail < ${SLA_ABANDONMENT_THRESHOLD}%`,
        warn: slaBreached,
      },
      {
        label: "Avg surge multiplier",
        value: `${result.metrics.avgSurgeMultiplier.toFixed(2)}x`,
        sublabel: "Pricing pressure",
      },
      {
        label: "Avg wait time",
        value: `${result.metrics.avgWaitMinutes.toFixed(1)} min`,
        sublabel: "Customer experience",
      },
    ],
    [result.metrics, slaBreached]
  );

  const exportReport = () => {
    const topZones = [...result.zones]
      .sort((a, b) => b.surgeMultiplier - a.surgeMultiplier)
      .slice(0, 5);
    const scenarioLabel =
      scenarios.find((s) => s.id === activeScenario)?.label ?? activeScenario;

    const lines = [
      "# SurgeSim Simulation Report",
      "",
      `**Scenario:** ${scenarioLabel}`,
      `**Date:** ${new Date(result.simulatedAt).toLocaleString()}`,
      `**Weather:** ${result.weather.label}`,
      "",
      "## Key Metrics",
      "",
      "| Metric | Value |",
      "|--------|-------|",
      `| Order match rate | ${result.metrics.orderMatchRate.toFixed(1)}% |`,
      `| Checkout abandonment | ${result.metrics.checkoutAbandonmentRate.toFixed(1)}% |`,
      `| SLA threshold | ${SLA_ABANDONMENT_THRESHOLD}% |`,
      `| SLA status | ${slaBreached ? "BREACH" : "OK"} |`,
      `| Avg surge multiplier | ${result.metrics.avgSurgeMultiplier.toFixed(2)}x |`,
      `| Avg wait time | ${result.metrics.avgWaitMinutes.toFixed(1)} min |`,
      `| Driver accept rate | ${(result.metrics.avgDriverAcceptRate * 100).toFixed(0)}% |`,
      "",
      "## Surge Configuration",
      "",
      `- Min multiplier: ${surgeMin.toFixed(1)}x`,
      `- Max multiplier: ${surgeMax.toFixed(1)}x`,
      `- Sensitivity: ${(surgeSensitivity * 100).toFixed(0)}%`,
      `- Base supply: ${baseSupply}`,
      `- Base demand: ${baseDemand}`,
      "",
      "## Highest Surge Zones",
      "",
      "| Zone | Surge | Imbalance |",
      "|------|-------|-----------|",
      ...topZones.map(
        (z) =>
          `| ${z.name} | ${z.surgeMultiplier.toFixed(2)}x | ${z.imbalanceRatio.toFixed(2)}x |`
      ),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "surgesim-report.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const { rows, cols } = getGridDimensions(result.zones);
  const weatherInfo = result.weather;

  return (
    <ProjectDemoShell
      theme={theme}
      metrics={metrics}
      scenarios={scenarios}
      activeScenario={activeScenario}
      onScenarioChange={applyScenario}
    >
      {slaBreached && (
        <div className={`mb-6 flex items-start gap-3 rounded-xl border p-4 ${theme.statWarn}`}>
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">SLA breach — checkout abandonment elevated</p>
            <p className="mt-1 text-sm opacity-90">
              Abandonment at {result.metrics.checkoutAbandonmentRate.toFixed(1)}% exceeds the{" "}
              {SLA_ABANDONMENT_THRESHOLD}% guardrail. Consider lowering max surge or increasing
              supply in hot zones.
            </p>
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
        <AdminActionButton
          onClick={exportReport}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          <Download className="h-4 w-4" />
          Export report
        </AdminActionButton>
        <AdminActionButton
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </AdminActionButton>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <EditableSection className="space-y-5 lg:col-span-1 disabled:opacity-70">
          <ControlPanel
            title="Supply / Demand"
            icon={<SlidersHorizontal className={`h-4 w-4 ${theme.accent}`} />}
          >
            <SliderControl
              label="Available drivers (supply)"
              value={baseSupply}
              min={10}
              max={100}
              onChange={setBaseSupply}
              accentClass="accent-orange-600"
            />
            <SliderControl
              label="Customer requests (demand)"
              value={baseDemand}
              min={10}
              max={100}
              onChange={setBaseDemand}
              accentClass="accent-amber-600"
            />
            <div className={`rounded-lg px-3 py-2 text-xs ring-1 ${theme.pill}`}>
              Imbalance ratio:{" "}
              <span className="font-semibold">{(baseDemand / baseSupply).toFixed(2)}x</span>
            </div>
          </ControlPanel>

          <ControlPanel
            title="Weather Events"
            icon={<CloudRain className={`h-4 w-4 ${theme.accent}`} />}
          >
            <div className="grid grid-cols-2 gap-2">
              {WEATHER_EVENTS.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWeather(w.id)}
                  className={`rounded-lg border px-2 py-2 text-left text-xs transition-colors ${
                    weather === w.id
                      ? theme.tabActive
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-orange-200 hover:bg-orange-50/50"
                  }`}
                >
                  <span className="text-base">{w.emoji}</span>
                  <div className="mt-0.5 font-medium">{w.label}</div>
                </button>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-zinc-500">{weatherInfo.description}</p>
          </ControlPanel>

          <ControlPanel
            title="Surge Algorithm"
            icon={<Gauge className={`h-4 w-4 ${theme.accent}`} />}
          >
            <SliderControl
              label={`Min multiplier (${surgeMin.toFixed(1)}x)`}
              value={surgeMin}
              min={1.0}
              max={2.0}
              step={0.1}
              onChange={(v) => setSurgeMin(Math.min(v, surgeMax - 0.1))}
              accentClass="accent-amber-500"
            />
            <SliderControl
              label={`Max multiplier (${surgeMax.toFixed(1)}x)`}
              value={surgeMax}
              min={1.5}
              max={5.0}
              step={0.1}
              onChange={(v) => setSurgeMax(Math.max(v, surgeMin + 0.1))}
              accentClass="accent-orange-600"
            />
            <SliderControl
              label={`Sensitivity (${(surgeSensitivity * 100).toFixed(0)}%)`}
              value={surgeSensitivity}
              min={0.2}
              max={1}
              step={0.05}
              onChange={setSurgeSensitivity}
              accentClass="accent-orange-500"
            />
          </ControlPanel>

          <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3">
            <div>
              <div className="text-sm font-medium text-zinc-900">Live simulation</div>
              <div className="text-xs text-zinc-500">Auto-refresh every 2s</div>
            </div>
            <button
              type="button"
              onClick={() => setLive((l) => !l)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                live ? theme.tabActive : "bg-zinc-100 text-zinc-600"
              }`}
            >
              {live ? "On" : "Off"}
            </button>
          </div>
          <EnterpriseAuditLog entries={auditLog} accentClass={theme.accent} />
        </EditableSection>

        <main className="space-y-6 lg:col-span-2">
          <SurgeSimGrid
            zones={result.zones}
            selectedId={selectedZone}
            onSelect={setSelectedZone}
            rows={rows}
            cols={cols}
            surgeMin={surgeMin}
            surgeMax={surgeMax}
          />
          <SurgeSimDashboard
            metrics={result.metrics}
            zones={result.zones}
            history={history}
            slaThreshold={SLA_ABANDONMENT_THRESHOLD}
          />
        </main>
      </div>

      <div className={`mt-10 rounded-2xl border border-dashed p-6 ${theme.statHighlight}`}>
        <div className="flex items-start gap-3">
          <Map className={`mt-0.5 h-5 w-5 ${theme.accent}`} />
          <div>
            <h3 className="font-semibold text-zinc-900">PM Playbook</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-zinc-600">
              <li>
                <strong className="text-zinc-800">North Star:</strong> Order Match Rate — % of checkout
                attempts successfully paired with a driver.
              </li>
              <li>
                <strong className="text-zinc-800">Guardrail:</strong> Checkout Abandonment — customers
                leaving due to surge pricing or long waits (SLA &lt; {SLA_ABANDONMENT_THRESHOLD}%).
              </li>
              <li>
                Try <strong className="text-zinc-800">Storm surge</strong> with low supply — surge rises
                but abandonment may spike if max multiplier is too aggressive.
              </li>
              <li>
                Lower max surge to protect conversion; raise min surge to retain drivers during spikes.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ProjectDemoShell>
  );
}

function ControlPanel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-900">
        {icon}
        {title}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  accentClass,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  accentClass: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-xs">
        <span className="font-medium text-zinc-700">{label}</span>
        <span className="text-zinc-500">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full ${accentClass}`}
      />
    </div>
  );
}
