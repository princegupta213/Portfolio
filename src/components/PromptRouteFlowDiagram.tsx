"use client";

import { ArrowRight, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { RouteDecision, ClassificationResult } from "@/lib/prompt-route/types";

interface Props {
  classification?: ClassificationResult;
  route?: RouteDecision;
  activeStep?: number;
  compact?: boolean;
}

export function PromptRouteFlowDiagram({
  classification,
  route,
  activeStep,
  compact = false,
}: Props) {
  const steps = [
    { id: "request", label: "LLM Request", sub: classification ? `~${classification.estimatedInputTokens} tokens` : "Incoming prompt" },
    { id: "classify", label: "Classifier", sub: classification?.taskLabel ?? "Task complexity" },
    { id: "policy", label: "Routing Table", sub: route?.policy.name ?? "Policy match" },
    { id: "model", label: route?.routedModel.name ?? "Model", sub: route ? `${route.outcome.replace("_", " ")}` : "Inference" },
    { id: "response", label: "Response", sub: route ? `${route.totalLatencyMs} ms · $${route.costUsd.toFixed(5)}` : "Metrics logged" },
  ];

  return (
    <div className={`rounded-xl border border-zinc-200 bg-white ${compact ? "p-4" : "p-6"}`}>
      {!compact && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-indigo-600">
          Request pipeline
        </p>
      )}
      <div className={`flex flex-wrap items-center gap-2 ${compact ? "text-xs" : "text-sm"}`}>
        {steps.map((step, i) => {
          const isActive = activeStep !== undefined ? i <= activeStep : !!route;
          const isFailover = i === 3 && route && route.outcome !== "primary";
          return (
            <div key={step.id} className="flex items-center gap-2">
              <div
                className={`rounded-lg px-3 py-2 transition-colors ${
                  isActive
                    ? isFailover
                      ? "bg-amber-50 ring-1 ring-amber-200"
                      : "bg-indigo-50 ring-1 ring-indigo-200"
                    : "bg-zinc-50 text-zinc-400"
                }`}
              >
                <div className={`font-medium ${isActive ? "text-zinc-900" : ""}`}>{step.label}</div>
                <div className={`text-xs ${isActive ? "text-zinc-500" : ""}`}>{step.sub}</div>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className={`h-4 w-4 shrink-0 ${isActive ? "text-indigo-400" : "text-zinc-300"}`} />
              )}
            </div>
          );
        })}
      </div>

      {route && route.outcome !== "primary" && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {route.outcome === "circuit_open" ? (
              <>
                Circuit breaker open on <strong>{route.primaryModel.name}</strong> → redirected to{" "}
                <strong>{route.fallbackModel.name}</strong>
              </>
            ) : (
              <>
                {route.failoverReason === "timeout" ? "Timeout" : "HTTP 429"} on{" "}
                <strong>{route.primaryModel.name}</strong> → failover to{" "}
                <strong>{route.fallbackModel.name}</strong>
              </>
            )}
          </span>
        </div>
      )}

      {route?.outcome === "primary" && route.rateLimitHit === false && (
        <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          Primary route succeeded — no failover needed
        </div>
      )}

      {route?.rateLimitHit && route.outcome === "primary" && (
        <div className="mt-4 flex items-center gap-2 text-sm text-red-700">
          <XCircle className="h-4 w-4" />
          Rate limit hit but failover failed — request retried on primary
        </div>
      )}
    </div>
  );
}
