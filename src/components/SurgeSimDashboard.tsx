"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { Target, ShieldAlert, TrendingUp, Users, ShoppingCart, Clock } from "lucide-react";
import type { MarketMetrics, TimeSeriesPoint, ZoneState } from "@/lib/surge-sim/types";

interface Props {
  metrics: MarketMetrics;
  zones: ZoneState[];
  history: TimeSeriesPoint[];
  slaThreshold?: number;
}

export function SurgeSimDashboard({ metrics, zones, history, slaThreshold = 15 }: Props) {
  const slaBreached = metrics.checkoutAbandonmentRate > slaThreshold;
  const topSurgeZones = [...zones]
    .sort((a, b) => b.surgeMultiplier - a.surgeMultiplier)
    .slice(0, 5)
    .map((z) => ({
      name: z.name,
      surge: z.surgeMultiplier,
      match: z.demand > 0 ? (z.matchedOrders / (z.demand * z.checkoutConversion || 1)) * 100 : 0,
    }));

  const funnelData = [
    { stage: "Requests", count: metrics.totalDemand },
    { stage: "Checkout", count: Math.round(metrics.totalDemand * metrics.avgCheckoutConversion) },
    { stage: "Matched", count: Math.round(metrics.totalMatched) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          icon={<Target className="h-5 w-5 text-orange-600" />}
          label="Order Match Rate"
          value={`${metrics.orderMatchRate.toFixed(1)}%`}
          sub="North Star"
          accent="orange"
          highlight
        />
        <MetricCard
          icon={<ShieldAlert className={`h-5 w-5 ${slaBreached ? "text-red-600" : "text-orange-600"}`} />}
          label="Checkout Abandonment"
          value={`${metrics.checkoutAbandonmentRate.toFixed(1)}%`}
          sub={`Guardrail < ${slaThreshold}%`}
          accent={slaBreached ? "red" : "orange"}
          highlight
          warn={slaBreached}
        />
        <MetricCard
          icon={<TrendingUp className="h-5 w-5 text-orange-600" />}
          label="Avg Surge Multiplier"
          value={`${metrics.avgSurgeMultiplier.toFixed(2)}x`}
          sub="Pricing pressure"
          accent="orange"
        />
        <MetricCard
          icon={<Users className="h-5 w-5 text-amber-600" />}
          label="Driver Accept Rate"
          value={`${(metrics.avgDriverAcceptRate * 100).toFixed(0)}%`}
          sub="Supply responsiveness"
          accent="amber"
        />
        <MetricCard
          icon={<ShoppingCart className="h-5 w-5 text-orange-700" />}
          label="Checkout Conversion"
          value={`${(metrics.avgCheckoutConversion * 100).toFixed(0)}%`}
          sub="Demand retention"
          accent="orange"
        />
        <MetricCard
          icon={<Clock className="h-5 w-5 text-zinc-600" />}
          label="Avg Wait Time"
          value={`${metrics.avgWaitMinutes.toFixed(1)} min`}
          sub="Customer experience"
          accent="zinc"
        />
      </div>

      {history.length > 1 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-zinc-900">Market Balance Monitor</h3>
          <p className="mb-4 text-xs text-zinc-500">Real-time metrics as you adjust supply, demand & surge</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="t" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}s`} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip
                  formatter={(v) => [
                    `${Number(v).toFixed(1)}%`,
                    "Rate",
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="matchRate"
                  name="Match rate"
                  stroke="#ea580c"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="abandonmentRate"
                  name="Abandonment"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-zinc-900">Order Funnel</h3>
          <p className="mb-4 text-xs text-zinc-500">Requests → checkout → matched</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="stage" width={72} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {funnelData.map((_, i) => (
                    <Cell key={i} fill={["#f97316", "#fb923c", "#ea580c"][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-zinc-900">Highest Surge Zones</h3>
          <p className="mb-4 text-xs text-zinc-500">Where pricing pressure peaks</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSurgeZones}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11 }} domain={[1, "auto"]} />
                <Tooltip formatter={(v) => [`${Number(v).toFixed(2)}x`, "Surge"]} />
                <Bar dataKey="surge" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  sub,
  accent,
  highlight,
  warn,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent: string;
  highlight?: boolean;
  warn?: boolean;
}) {
  const border = highlight
    ? warn
      ? "border-red-200 bg-red-50/50"
      : accent === "orange" || accent === "amber"
        ? "border-orange-200 bg-orange-50/50"
        : "border-red-200 bg-red-50/50"
    : "border-zinc-200 bg-white";

  return (
    <div className={`rounded-xl border p-4 ${border}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-medium text-zinc-500">{label}</span>
      </div>
      <div className="mt-2 text-2xl font-bold text-zinc-900">{value}</div>
      <div className="mt-0.5 text-xs text-zinc-500">{sub}</div>
    </div>
  );
}
