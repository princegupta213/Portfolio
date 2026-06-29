import type { OrderRecord } from "@/lib/claim-resolve/types";

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export const REFUND_REASONS = [
  "Accidental purchase",
  "Service not as described",
  "Duplicate charge",
  "Cancelled before delivery",
  "Technical issue",
  "Subscription renewed without notice",
  "Product not received",
] as const;

export const MOCK_ORDERS: OrderRecord[] = [
  {
    orderId: "ORD-1001",
    customerEmail: "alex.chen@email.com",
    amountUsd: 24.99,
    transactionDate: daysAgo(8),
    productName: "Premium Subscription — Monthly",
    accountWarnings: 0,
    priorClaims90Days: 0,
    highRisk: false,
    eligible: true,
    groundTruth: "approve",
  },
  {
    orderId: "ORD-1002",
    customerEmail: "jordan.lee@email.com",
    amountUsd: 79.0,
    transactionDate: daysAgo(5),
    productName: "Annual Pro Plan",
    accountWarnings: 0,
    priorClaims90Days: 0,
    highRisk: false,
    eligible: true,
    groundTruth: "human_review",
    notes: "Amount exceeds auto-approval cap",
  },
  {
    orderId: "ORD-1003",
    customerEmail: "sam.patel@email.com",
    amountUsd: 32.5,
    transactionDate: daysAgo(42),
    productName: "One-time API Credits",
    accountWarnings: 0,
    priorClaims90Days: 0,
    highRisk: false,
    eligible: true,
    groundTruth: "deny",
    notes: "Outside refund window",
  },
  {
    orderId: "ORD-1004",
    customerEmail: "taylor.nguyen@email.com",
    amountUsd: 41.0,
    transactionDate: daysAgo(14),
    productName: "Team Add-on (3 seats)",
    accountWarnings: 2,
    priorClaims90Days: 1,
    highRisk: false,
    eligible: true,
    groundTruth: "human_review",
    notes: "Account at warning threshold",
  },
  {
    orderId: "ORD-1005",
    customerEmail: "casey.wright@email.com",
    amountUsd: 18.75,
    transactionDate: daysAgo(3),
    productName: "Storage Upgrade",
    accountWarnings: 0,
    priorClaims90Days: 3,
    highRisk: false,
    eligible: true,
    groundTruth: "human_review",
    notes: "Repeat claimant pattern",
  },
  {
    orderId: "ORD-1006",
    customerEmail: "morgan.kim@email.com",
    amountUsd: 55.0,
    transactionDate: daysAgo(12),
    productName: "Enterprise Trial Conversion",
    accountWarnings: 1,
    priorClaims90Days: 0,
    highRisk: true,
    eligible: true,
    groundTruth: "deny",
    notes: "Fraud score flagged",
  },
  {
    orderId: "ORD-1007",
    customerEmail: "riley.brown@email.com",
    amountUsd: 29.99,
    transactionDate: daysAgo(10),
    productName: "Pro Subscription",
    accountWarnings: 0,
    priorClaims90Days: 0,
    highRisk: false,
    eligible: false,
    groundTruth: "human_review",
    notes: "Order already partially refunded",
  },
  {
    orderId: "ORD-1008",
    customerEmail: "devon.martinez@email.com",
    amountUsd: 12.0,
    transactionDate: daysAgo(20),
    productName: "Add-on Module",
    accountWarnings: 0,
    priorClaims90Days: 0,
    highRisk: false,
    eligible: true,
    groundTruth: "approve",
  },
  {
    orderId: "ORD-1009",
    customerEmail: "quinn.adams@email.com",
    amountUsd: 149.0,
    transactionDate: daysAgo(6),
    productName: "Annual Enterprise Plan",
    accountWarnings: 0,
    priorClaims90Days: 0,
    highRisk: false,
    eligible: true,
    groundTruth: "human_review",
    notes: "High-value order — manager approval",
  },
  {
    orderId: "ORD-1010",
    customerEmail: "jamie.oconnor@email.com",
    amountUsd: 9.99,
    transactionDate: daysAgo(1),
    productName: "In-app Purchase — Theme Pack",
    accountWarnings: 0,
    priorClaims90Days: 0,
    highRisk: false,
    eligible: true,
    groundTruth: "approve",
    notes: "Low value, within window",
  },
  {
    orderId: "ORD-1011",
    customerEmail: "avery.zhang@email.com",
    amountUsd: 44.5,
    transactionDate: daysAgo(35),
    productName: "Quarterly Analytics Bundle",
    accountWarnings: 0,
    priorClaims90Days: 2,
    highRisk: false,
    eligible: true,
    groundTruth: "human_review",
    notes: "Near refund window edge + repeat claims",
  },
  {
    orderId: "ORD-1012",
    customerEmail: "blake.foster@email.com",
    amountUsd: 67.0,
    transactionDate: daysAgo(9),
    productName: "Workshop Registration",
    accountWarnings: 3,
    priorClaims90Days: 0,
    highRisk: false,
    eligible: true,
    groundTruth: "deny",
    notes: "Account warnings exceed threshold",
  },
];

export const SAMPLE_ORDER_IDS = MOCK_ORDERS.map((o) => o.orderId);

export function lookupOrder(orderId: string): OrderRecord | null {
  const normalized = orderId.trim().toUpperCase();
  return MOCK_ORDERS.find((o) => o.orderId === normalized) ?? null;
}

export function getOrderAgeDays(order: OrderRecord): number {
  const tx = new Date(order.transactionDate);
  const now = new Date();
  return Math.floor((now.getTime() - tx.getTime()) / (1000 * 60 * 60 * 24));
}
