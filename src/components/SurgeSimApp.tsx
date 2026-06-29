"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CloudRain,
  Gauge,
  Map,
  RotateCcw,
  SlidersHorizontal,
  Zap,
} from "lucide-react";
import { DEFAULT_SURGE, runSimulation } from "@/lib/surge-sim/engine";
import { SURGE_SIM_PRESETS } from "@/data/mock/surge-sim";
import { WEATHER_EVENTS } from "@/lib/surge-sim/weather";
import type { SimulationResult, TimeSeriesPoint, WeatherEvent } from "@/lib/surge-sim/types";
import { SurgeSimDashboard } from "@/components/SurgeSimDashboard";
import { SurgeSimGrid, getGridDimensions } from "@/components/SurgeSimGrid";

const HISTORY_MAX = 30;

export function SurgeSimApp() {
  const [baseSupply, setBaseSupply] = useState(50);
  const [baseDemand, setBaseDemand] = useState(55);
  const [weather, setWeather] = useState<WeatherEvent>("clear");
  const [surgeMin, setSurgeMin] = useState(DEFAULT_SURGE.minMultiplier);
  const [surgeMax, setSurgeMax] = useState(DEFAULT_SURGE.maxMultiplier);
  const [surgeSensitivity, setSurgeSensitivity] = useState(DEFAULT_SURGE.sensitivity);
  const [live, setLive] = useState(true);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [history, setHistory] = useState<TimeSeriesPoint[]>([]);
  const [tick, setTick] = useState(0);

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

  const applyPreset = useCallback((id: string) => {
    const preset = SURGE_SIM_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setBaseSupply(preset.baseSupply);
    setBaseDemand(preset.baseDemand);
    setWeather(preset.weather);
    setHistory([]);
  }, []);

  const reset = useCallback(() => {
    setBaseSupply(50);
    setBaseDemand(55);
    setWeather("clear");
    setSurgeMin(DEFAULT_SURGE.minMultiplier);
    setSurgeMax(DEFAULT_SURGE.maxMultiplier);
    setSurgeSensitivity(DEFAULT_SURGE.sensitivity);
    setHistory([]);
    setSelectedZone(null);
  }, []);

  const { rows, cols } = getGridDimensions(result.zones);
  const weatherInfo = result.weather;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
          <Zap className="h-3.5 w-3.5" />
          Marketplaces & Gig Economy
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900">SurgeSim</h1>
        <p className="mt-2 max-w-2xl text-zinc-600">
          Dynamic price & supply elasticity dashboard — adjust drivers vs. customer demand, tweak surge
          limits, and watch match rates and checkout abandonment shift across a live city grid.
        </p>
      </div>

      <div className="mb-6">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
          Mock city scenarios
        </p>
        <div className="flex flex-wrap gap-2">
          {SURGE_SIM_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => applyPreset(p.id)}
              title={p.description}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-left text-xs font-medium text-zinc-700 hover:border-amber-300 hover:bg-amber-50"
            >
              {p.label}
              <span className="mt-0.5 block font-normal text-zinc-400">
                Match {p.expectedMatchRate}
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={reset}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <aside className="space-y-5 lg:col-span-1">
          <ControlPanel title="Supply / Demand" icon={<SlidersHorizontal className="h-4 w-4" />}>
            <SliderControl
              label="Available drivers (supply)"
              value={baseSupply}
              min={10}
              max={100}
              onChange={setBaseSupply}
              color="emerald"
            />
            <SliderControl
              label="Customer requests (demand)"
              value={baseDemand}
              min={10}
              max={100}
              onChange={setBaseDemand}
              color="orange"
            />
            <div className="rounded-lg bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
              Imbalance ratio:{" "}
              <span className="font-semibold text-zinc-900">
                {(baseDemand / baseSupply).toFixed(2)}x
              </span>
            </div>
          </ControlPanel>

          <ControlPanel title="Weather Events" icon={<CloudRain className="h-4 w-4" />}>
            <div className="grid grid-cols-2 gap-2">
              {WEATHER_EVENTS.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWeather(w.id)}
                  className={`rounded-lg border px-2 py-2 text-left text-xs transition-colors ${
                    weather === w.id
                      ? "border-amber-400 bg-amber-50 text-amber-900"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                  }`}
                >
                  <span className="text-base">{w.emoji}</span>
                  <div className="mt-0.5 font-medium">{w.label}</div>
                </button>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-zinc-500">{weatherInfo.description}</p>
          </ControlPanel>

          <ControlPanel title="Surge Algorithm" icon={<Gauge className="h-4 w-4" />}>
            <SliderControl
              label={`Min multiplier (${surgeMin.toFixed(1)}x)`}
              value={surgeMin}
              min={1.0}
              max={2.0}
              step={0.1}
              onChange={(v) => setSurgeMin(Math.min(v, surgeMax - 0.1))}
              color="amber"
            />
            <SliderControl
              label={`Max multiplier (${surgeMax.toFixed(1)}x)`}
              value={surgeMax}
              min={1.5}
              max={5.0}
              step={0.1}
              onChange={(v) => setSurgeMax(Math.max(v, surgeMin + 0.1))}
              color="red"
            />
            <SliderControl
              label={`Sensitivity (${(surgeSensitivity * 100).toFixed(0)}%)`}
              value={surgeSensitivity}
              min={0.2}
              max={1}
              step={0.05}
              onChange={setSurgeSensitivity}
              color="orange"
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
                live ? "bg-amber-600 text-white" : "bg-zinc-100 text-zinc-600"
              }`}
            >
              {live ? "On" : "Off"}
            </button>
          </div>
        </aside>

        <main className="space-y-6 lg:col-span-2">
          <SurgeSimGrid
            zones={result.zones}
            selectedId={selectedZone}
            onSelect={setSelectedZone}
            rows={rows}
            cols={cols}
          />
          <SurgeSimDashboard metrics={result.metrics} zones={result.zones} history={history} />
        </main>
      </div>

      <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/80 p-6">
        <div className="flex items-start gap-3">
          <Map className="mt-0.5 h-5 w-5 text-amber-600" />
          <div>
            <h3 className="font-semibold text-zinc-900">PM Playbook</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-zinc-600">
              <li>
                <strong className="text-zinc-800">North Star:</strong> Order Match Rate — % of checkout
                attempts successfully paired with a driver.
              </li>
              <li>
                <strong className="text-zinc-800">Guardrail:</strong> Checkout Abandonment — customers
                leaving due to surge pricing or long waits.
              </li>
              <li>
                Try <strong className="text-zinc-800">Heavy Rain</strong> with low supply — surge rises
                but abandonment may spike if max multiplier is too aggressive.
              </li>
              <li>
                Lower max surge to protect conversion; raise min surge to retain drivers during spikes.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
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
  color,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  color: "emerald" | "orange" | "amber" | "red";
}) {
  const accent = {
    emerald: "accent-emerald-600",
    orange: "accent-orange-600",
    amber: "accent-amber-600",
    red: "accent-red-600",
  }[color];

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
        className={`w-full ${accent}`}
      />
    </div>
  );
}
