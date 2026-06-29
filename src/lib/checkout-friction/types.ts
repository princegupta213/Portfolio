export type CheckoutStep = "cart" | "shipping" | "billing" | "success";

export interface OptimizationToggles {
  autofillAddress: boolean;
  guestCheckout: boolean;
  expressApplePay: boolean;
}

export interface FunnelStep {
  id: CheckoutStep;
  label: string;
  entered: number;
  dropped: number;
  converted: number;
  dropOffRate: number;
}

export interface FunnelResult {
  steps: FunnelStep[];
  cartAbandonmentRate: number;
  avgCheckoutDurationSec: number;
  totalStarted: number;
  totalCompleted: number;
}
