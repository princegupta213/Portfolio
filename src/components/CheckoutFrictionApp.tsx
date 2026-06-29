"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Apple,
  CreditCard,
  MapPin,
  ShoppingCart,
  Truck,
  User,
  Zap,
} from "lucide-react";
import { BASELINE, computeFunnel } from "@/lib/checkout-friction/engine";
import type { CheckoutStep, OptimizationToggles } from "@/lib/checkout-friction/types";

const STEP_ICONS: Record<CheckoutStep, React.ReactNode> = {
  cart: <ShoppingCart className="h-5 w-5" />,
  shipping: <Truck className="h-5 w-5" />,
  billing: <CreditCard className="h-5 w-5" />,
  success: <Zap className="h-5 w-5" />,
};

const STEP_COLORS = ["#6366f1", "#0ea5e9", "#10b981", "#22c55e"];

export function CheckoutFrictionApp() {
  const [toggles, setToggles] = useState<OptimizationToggles>({
    autofillAddress: false,
    guestCheckout: false,
    expressApplePay: false,
  });
  const [activeStep, setActiveStep] = useState<CheckoutStep>("cart");

  const result = useMemo(() => computeFunnel(toggles), [toggles]);
  const uplift =
    BASELINE.totalCompleted > 0
      ? Math.round(
          ((result.totalCompleted - BASELINE.totalCompleted) / BASELINE.totalCompleted) * 1000
        ) / 10
      : 0;

  const chartData = result.steps.map((s, i) => ({
    name: s.label.replace(" ", "\n"),
    entered: s.entered,
    converted: s.converted,
    dropped: s.dropped,
    color: STEP_COLORS[i],
  }));

  const toggle = (key: keyof OptimizationToggles) => {
    setToggles((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (key === "expressApplePay" && next.expressApplePay) {
        setActiveStep("success");
      }
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          <ShoppingCart className="h-3.5 w-3.5" />
          E-commerce Growth PM · Checkout Funnel
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">CheckoutFriction</h1>
        <p className="mt-2 max-w-2xl text-zinc-600">
          Simulate checkout optimizations — autofill, guest checkout, Apple Pay — and watch drop-off
          metrics change at each funnel step before allocating engineering resources.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <aside className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-zinc-900">Optimization toggles</h3>
            <div className="mt-4 space-y-3">
              <ToggleRow
                icon={<MapPin className="h-4 w-4" />}
                label="Autofill Address"
                hint="−20% drop-off on Shipping"
                on={toggles.autofillAddress}
                onToggle={() => toggle("autofillAddress")}
              />
              <ToggleRow
                icon={<User className="h-4 w-4" />}
                label="Guest Checkout"
                hint="−15% drop-off on Cart"
                on={toggles.guestCheckout}
                onToggle={() => toggle("guestCheckout")}
              />
              <ToggleRow
                icon={<Apple className="h-4 w-4" />}
                label="Express Apple Pay"
                hint="Skips Shipping & Billing"
                on={toggles.expressApplePay}
                onToggle={() => toggle("expressApplePay")}
              />
            </div>
          </div>

          <div className="grid gap-3">
            <MetricCard
              label="Cart abandonment"
              value={`${result.cartAbandonmentRate}%`}
              sub={`Baseline: ${BASELINE.cartAbandonmentRate}%`}
              improved={result.cartAbandonmentRate < BASELINE.cartAbandonmentRate}
            />
            <MetricCard
              label="Completed checkouts"
              value={result.totalCompleted.toLocaleString()}
              sub={uplift > 0 ? `+${uplift}% vs baseline` : "Baseline scenario"}
              improved={uplift > 0}
            />
            <MetricCard
              label="Avg checkout duration"
              value={`${result.avgCheckoutDurationSec}s`}
              sub={`Baseline: ${BASELINE.avgCheckoutDurationSec}s`}
              improved={result.avgCheckoutDurationSec < BASELINE.avgCheckoutDurationSec}
            />
          </div>
        </aside>

        <main className="space-y-6 lg:col-span-2">
          {/* Step simulator */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h3 className="font-semibold text-zinc-900">Checkout simulator</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.steps.map((step) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  disabled={toggles.expressApplePay && (step.id === "shipping" || step.id === "billing")}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    activeStep === step.id
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
                  }`}
                >
                  {STEP_ICONS[step.id]}
                  {step.label}
                </button>
              ))}
            </div>
            <StepPanel step={activeStep} toggles={toggles} />
          </div>

          {/* Funnel chart */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h3 className="font-semibold text-zinc-900">Live funnel analytics</h3>
            <div className="mt-4 h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="entered" name="Entered" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="converted" name="Converted" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="text-left text-zinc-500">
                    <th className="pb-2 font-medium">Step</th>
                    <th className="pb-2 font-medium">Entered</th>
                    <th className="pb-2 font-medium">Dropped</th>
                    <th className="pb-2 font-medium">Converted</th>
                    <th className="pb-2 font-medium">Drop-off %</th>
                  </tr>
                </thead>
                <tbody>
                  {result.steps.map((s) => (
                    <tr key={s.id} className="border-t border-zinc-100">
                      <td className="py-2 font-medium text-zinc-800">{s.label}</td>
                      <td className="py-2 text-zinc-600">{s.entered.toLocaleString()}</td>
                      <td className="py-2 text-red-600">{s.dropped.toLocaleString()}</td>
                      <td className="py-2 text-emerald-600">{s.converted.toLocaleString()}</td>
                      <td className="py-2 text-zinc-600">{s.dropOffRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  hint,
  on,
  onToggle,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
        on ? "border-emerald-300 bg-emerald-50" : "border-zinc-200 hover:bg-zinc-50"
      }`}
    >
      <span className={on ? "text-emerald-600" : "text-zinc-400"}>{icon}</span>
      <div className="flex-1">
        <div className="text-sm font-medium text-zinc-900">{label}</div>
        <div className="text-xs text-zinc-500">{hint}</div>
      </div>
      <div
        className={`h-6 w-11 rounded-full transition-colors ${on ? "bg-emerald-500" : "bg-zinc-200"}`}
      >
        <div
          className={`mt-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </div>
    </button>
  );
}

function MetricCard({
  label,
  value,
  sub,
  improved,
}: {
  label: string;
  value: string;
  sub: string;
  improved?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        improved ? "border-emerald-200 bg-emerald-50/50" : "border-zinc-200 bg-white"
      }`}
    >
      <div className="text-xs font-medium uppercase text-zinc-500">{label}</div>
      <div className="text-2xl font-bold text-zinc-900">{value}</div>
      <div className="text-xs text-zinc-500">{sub}</div>
    </div>
  );
}

function StepPanel({ step, toggles }: { step: CheckoutStep; toggles: OptimizationToggles }) {
  const content: Record<CheckoutStep, { title: string; body: string }> = {
    cart: {
      title: "Cart Review",
      body: toggles.guestCheckout
        ? "Guest checkout enabled — users skip account creation, reducing cart abandonment."
        : "Review items and sign in or create an account to continue.",
    },
    shipping: {
      title: "Shipping Form",
      body: toggles.expressApplePay
        ? "Bypassed via Apple Pay express checkout."
        : toggles.autofillAddress
          ? "Address autofill active — form fields pre-populated from browser/device."
          : "Enter shipping address manually (high friction step).",
    },
    billing: {
      title: "Billing Info",
      body: toggles.expressApplePay
        ? "Bypassed via Apple Pay express checkout."
        : "Enter billing details and verify payment method.",
    },
    success: {
      title: "Payment Success",
      body: "Order confirmed! Conversion complete.",
    },
  };
  const c = content[step];
  return (
    <div className="mt-4 rounded-lg border border-zinc-100 bg-zinc-50 p-4">
      <div className="font-medium text-zinc-900">{c.title}</div>
      <p className="mt-1 text-sm text-zinc-600">{c.body}</p>
    </div>
  );
}
