"use client";

import type { ZoneState } from "@/lib/surge-sim/types";

interface Props {
  zones: ZoneState[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  rows: number;
  cols: number;
  surgeMin: number;
  surgeMax: number;
}

function surgeColor(multiplier: number, min: number, max: number): string {
  const t = Math.min(1, Math.max(0, (multiplier - min) / (max - min || 1)));
  if (t < 0.33) return `rgba(16, 185, 129, ${0.4 + t * 0.35})`;
  if (t < 0.66) return `rgba(245, 158, 11, ${0.5 + t * 0.25})`;
  return `rgba(239, 68, 68, ${0.55 + t * 0.3})`;
}

function imbalanceLabel(ratio: number): { text: string; className: string } {
  if (ratio >= 1.4) return { text: "High demand", className: "text-red-700 bg-red-50" };
  if (ratio >= 1.1) return { text: "Demand > supply", className: "text-amber-700 bg-amber-50" };
  if (ratio <= 0.85) return { text: "Oversupplied", className: "text-emerald-700 bg-emerald-50" };
  return { text: "Balanced", className: "text-zinc-600 bg-zinc-100" };
}

export function SurgeSimGrid({ zones, selectedId, onSelect, rows, cols, surgeMin, surgeMax }: Props) {
  const minSurge = Math.min(...zones.map((z) => z.surgeMultiplier));
  const maxSurge = Math.max(...zones.map((z) => z.surgeMultiplier));
  const hotZones = zones.filter((z) => z.imbalanceRatio >= 1.3).length;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">City Grid Map</h3>
          <p className="text-xs text-zinc-500">
            {zones.length} zones · {hotZones} hot {hotZones === 1 ? "zone" : "zones"} (demand &gt; 1.3× supply)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="h-2.5 w-24 rounded-full"
            style={{
              background: `linear-gradient(to right, rgba(16,185,129,0.7), rgba(245,158,11,0.8), rgba(239,68,68,0.85))`,
            }}
            title={`Surge scale ${surgeMin.toFixed(1)}x – ${surgeMax.toFixed(1)}x`}
          />
          <span className="text-[10px] text-zinc-500">{surgeMin.toFixed(1)}x–{surgeMax.toFixed(1)}x</span>
        </div>
      </div>

      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {zones.map((zone) => {
          const selected = zone.id === selectedId;
          const supplyPct = Math.min(100, (zone.supply / Math.max(zone.demand, 1)) * 100);

          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => onSelect(selected ? null : zone.id)}
              className={`group relative aspect-square rounded-lg border transition-all hover:scale-[1.03] hover:shadow-md ${
                selected
                  ? "border-amber-500 ring-2 ring-amber-200 z-10"
                  : "border-zinc-200/80 hover:border-zinc-300"
              }`}
              style={{ backgroundColor: surgeColor(zone.surgeMultiplier, minSurge, maxSurge) }}
              aria-label={`${zone.name}: ${zone.surgeMultiplier.toFixed(1)}x surge, ${zone.demand} demand, ${zone.supply} supply`}
            >
              <div className="absolute inset-x-0 top-0 h-1 overflow-hidden rounded-t-lg bg-black/10">
                <div
                  className="h-full bg-emerald-600/80 transition-all"
                  style={{ width: `${supplyPct}%` }}
                  title={`Supply coverage: ${supplyPct.toFixed(0)}%`}
                />
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                <span className="text-[11px] font-bold text-zinc-900/90 leading-tight">
                  {zone.surgeMultiplier.toFixed(1)}x
                </span>
                <span className="mt-0.5 text-[8px] font-medium text-zinc-800/75 truncate w-full text-center px-0.5">
                  {zone.name}
                </span>
                <span className="mt-1 text-[7px] text-zinc-700/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  D{zone.demand} · S{zone.supply}
                </span>
              </div>

              {zone.imbalanceRatio >= 1.3 && (
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-zinc-500">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-1.5 w-6 rounded-full bg-emerald-600/80" /> Supply bar (top)
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-red-500" /> Hot zone
        </span>
        <span>Hover for D/S counts</span>
      </div>

      {selectedId && (
        <ZoneDetail zone={zones.find((z) => z.id === selectedId)!} />
      )}
    </div>
  );
}

function ZoneDetail({ zone }: { zone: ZoneState }) {
  const imb = imbalanceLabel(zone.imbalanceRatio);

  return (
    <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/40 p-4 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="font-semibold text-zinc-900">{zone.name}</div>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${imb.className}`}>
          {imb.text} ({zone.imbalanceRatio.toFixed(2)}×)
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Supply" value={zone.supply.toString()} />
        <Stat label="Demand" value={zone.demand.toString()} />
        <Stat label="Surge" value={`${zone.surgeMultiplier.toFixed(2)}x`} highlight />
        <Stat label="Wait" value={`${zone.avgWaitMinutes.toFixed(1)} min`} />
        <Stat label="Driver accept" value={`${(zone.driverAcceptRate * 100).toFixed(0)}%`} />
        <Stat label="Checkout conv." value={`${(zone.checkoutConversion * 100).toFixed(0)}%`} />
        <Stat label="Matched" value={zone.matchedOrders.toFixed(0)} good />
        <Stat label="Unmatched" value={zone.unmatchedOrders.toFixed(0)} warn={zone.unmatchedOrders > 0} />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
  good,
  warn,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  good?: boolean;
  warn?: boolean;
}) {
  const valueClass = highlight
    ? "text-amber-700"
    : good
      ? "text-emerald-700"
      : warn
        ? "text-red-600"
        : "text-zinc-900";

  return (
    <div className="rounded-lg bg-white/80 px-2 py-1.5">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className={`font-semibold ${valueClass}`}>{value}</div>
    </div>
  );
}

export function getGridDimensions(zones: { row: number; col: number }[]) {
  const rows = Math.max(...zones.map((z) => z.row)) + 1;
  const cols = Math.max(...zones.map((z) => z.col)) + 1;
  return { rows, cols };
}
