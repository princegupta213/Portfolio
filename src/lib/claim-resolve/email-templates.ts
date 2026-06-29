import type { ClaimDecision, RefundVerdict } from "./types";

function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export function draftCustomerEmail(decision: Omit<ClaimDecision, "emailDraft">): {
  subject: string;
  body: string;
} {
  const { submission, order, verdict, triggeredRules } = decision;
  const orderId = submission.orderId.toUpperCase();
  const amount = order ? formatUsd(order.amountUsd) : "your order";

  const ruleSummary =
    triggeredRules.length > 0
      ? triggeredRules.map((r) => `• ${r.message}`).join("\n")
      : "• All automated policy checks passed.";

  const templates: Record<RefundVerdict, { subject: string; body: string }> = {
    approve: {
      subject: `Refund approved — ${orderId}`,
      body: `Hi,

We've reviewed your refund request for order ${orderId} (${amount}).

Decision: APPROVED

Our automated review confirmed your claim meets our refund policy. You should see ${amount} credited to your original payment method within 3–5 business days.

Policy checks:
${ruleSummary}

If you have questions, reply to this email.

— Customer Operations`,
    },
    deny: {
      subject: `Refund request update — ${orderId}`,
      body: `Hi,

We've reviewed your refund request for order ${orderId}.

Decision: NOT APPROVED

Unfortunately, your request doesn't meet our current refund policy based on the following:

${ruleSummary}

You can reply to this email if you believe this decision was made in error, and an agent will follow up within 24 hours.

— Customer Operations`,
    },
    human_review: {
      subject: `Refund request received — ${orderId}`,
      body: `Hi,

We've received your refund request for order ${orderId} (${amount}).

Decision: UNDER REVIEW

Your claim requires additional review by our support team. This typically takes 1–2 business days.

Reason for review:
${ruleSummary}

We'll email you as soon as a specialist completes the review. No action is needed from you right now.

— Customer Operations`,
    },
  };

  return templates[verdict];
}
