import type { FunnelResult, FunnelStep, OptimizationToggles } from "./types";

const BASE_STARTED = 10000;

/** Base drop-off rates per step (without optimizations) */
const BASE_DROP = {
  cart: 0.12,
  shipping: 0.28,
  billing: 0.18,
  success: 0,
};

export function computeFunnel(toggles: OptimizationToggles): FunnelResult {
  let cartDrop = BASE_DROP.cart;
  let shippingDrop = BASE_DROP.shipping;
  let billingDrop = BASE_DROP.billing;

  if (toggles.guestCheckout) cartDrop *= 0.85;
  if (toggles.autofillAddress) shippingDrop *= 0.8;
  if (toggles.expressApplePay) {
    shippingDrop = 0;
    billingDrop = 0;
  }

  const steps: FunnelStep[] = [];
  let remaining = BASE_STARTED;

  const stepDefs: { id: FunnelStep["id"]; label: string; dropRate: number }[] = [
    { id: "cart", label: "Cart Review", dropRate: cartDrop },
    { id: "shipping", label: "Shipping Form", dropRate: shippingDrop },
    { id: "billing", label: "Billing Info", dropRate: billingDrop },
    { id: "success", label: "Payment Success", dropRate: 0 },
  ];

  for (const def of stepDefs) {
    const dropped =
      def.id === "success" ? 0 : Math.round(remaining * def.dropRate);
    const converted = remaining - dropped;
    steps.push({
      id: def.id,
      label: def.label,
      entered: remaining,
      dropped,
      converted,
      dropOffRate: remaining > 0 ? Math.round((dropped / remaining) * 1000) / 10 : 0,
    });
    remaining = converted;
  }

  const totalCompleted = steps[steps.length - 1].converted;
  const cartAbandonmentRate =
    Math.round(((BASE_STARTED - totalCompleted) / BASE_STARTED) * 1000) / 10;

  const baseDuration = 245;
  const durationReduction =
    (toggles.autofillAddress ? 35 : 0) +
    (toggles.guestCheckout ? 20 : 0) +
    (toggles.expressApplePay ? 120 : 0);

  return {
    steps,
    cartAbandonmentRate,
    avgCheckoutDurationSec: Math.max(45, baseDuration - durationReduction),
    totalStarted: BASE_STARTED,
    totalCompleted,
  };
}

export const BASELINE = computeFunnel({
  autofillAddress: false,
  guestCheckout: false,
  expressApplePay: false,
});
