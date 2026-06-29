"use client";

import type { ZoneState } from "@/lib/surge-sim/types";

interface Props {
  zones: ZoneState[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  rows: number;
  cols: number;
}

function surgeColor(multiplier: number, min: number, max: number): string {
  const t = Math.min(1, Math.max(0, (multiplier - min) / (max - min || 1)));
  if (t < 0.33) return `rgba(16, 185, 129, ${0.35 + t * 0.4})`;
  if (t < 0.66) return `rgba(245, 158, 11, ${0.45 + t * 0.3})`;
  return `rgba(239, 68, 68, ${0.5 + t * 0.35})`;
}

export function SurgeSimGrid({ zones, selectedId, onSelect, rows, cols }: Props) {
  const minSurge = Math.min(...zones.map((z) => z.surgeMultiplier));
  const maxSurge = Math.max(...zones.map((z) => z.surgeMultiplier));

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">City Grid Map</h3>
          <p className="text-xs text-zinc-500">Color = surge intensity · click a zone for details</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="inline-block h-3 w-3 rounded-sm bg-emerald-400/60" /> Low
          <span className="inline-block h-3 w-3 rounded-sm bg-amber-400/70" /> Med
          <span className="inline-block h-3 w-3 rounded-sm bg-red-500/70" /> High
        </div>
      </div>

      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {zones.map((zone) => {
          const selected = zone.id === selectedId;
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => onSelect(selected ? null : zone.id)}
              className={`relative aspect-square rounded-lg border transition-all ${
                selected
                  ? "border-amber-500 ring-2 ring-amber-200"
                  : "border-zinc-200/80 hover:border-zinc-300"
              }`}
              style={{ backgroundColor: surgeColor(zone.surgeMultiplier, minSurge, maxSurge) }}
              title={`${zone.name}: ${zone.surgeMultiplier.toFixed(2)}x surge`}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                <span className="text-[10px] font-bold text-zinc-900/80 leading-tight text-center">
                  {zone.surgeMultiplier.toFixed(1)}x
                </span>
                <span className="mt-0.5 text-[8px] text-zinc-700/70 truncate w-full text-center">
                  {zone.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedId && (
        <ZoneDetail zone={zones.find((z) => z.id === selectedId)!} />
      )}
    </div>
  );
}

function ZoneDetail({ zone }: { zone: ZoneState }) {
  return (
    <div className="mt-4 rounded-xl bg-zinc-50 p-4 text-sm">
      <div className="font-semibold text-zinc-900">{zone.name}</div>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Supply" value={zone.supply.toString()} />
        <Stat label="Demand" value={zone.demand.toString()} />
        <Stat label="Surge" value={`${zone.surgeMultiplier.toFixed(2)}x`} />
        <Stat label="Wait" value={`${zone.avgWaitMinutes.toFixed(1)} min`} />
        <Stat label="Driver accept" value={`${(zone.driverAcceptRate * 100).toFixed(0)}%`} />
        <Stat label="Checkout conv." value={`${(zone.checkoutConversion * 100).toFixed(0)}%`} />
        <Stat label="Matched" value={zone.matchedOrders.toFixed(0)} />
        <Stat label="Unmatched" value={zone.unmatchedOrders.toFixed(0)} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="font-semibold text-zinc-900">{value}</div>
    </div>
  );
}

export function getGridDimensions(zones: { row: number; col: number }[]) {
  const rows = Math.max(...zones.map((z) => z.row)) + 1;
  const cols = Math.max(...zones.map((z) => z.col)) + 1;
  return { rows, cols };
}
