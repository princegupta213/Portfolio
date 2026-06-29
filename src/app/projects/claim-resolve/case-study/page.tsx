import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Lightbulb,
  ShieldCheck,
  Target,
} from "lucide-react";
import { claimResolveCaseStudy as cs } from "@/data/case-studies/claim-resolve";

export default function ClaimResolveCaseStudyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </Link>
          <Link
            href={cs.links.liveDemo}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-800"
          >
            <ShieldCheck className="h-4 w-4" />
            Live demo
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-sm font-medium tracking-wide text-emerald-600 uppercase">
          Case study · Fintech & Customer Operations
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900">{cs.title}</h1>
        <p className="mt-3 text-xl text-zinc-600">{cs.subtitle}</p>
        <div className="mt-4 flex gap-4 text-sm text-zinc-500">
          <span>{cs.role}</span>
          <span>·</span>
          <span>{cs.timeline}</span>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={cs.links.liveDemo}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Try live demo <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href={cs.links.prd}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            <FileText className="h-4 w-4" /> PRD
          </Link>
        </div>

        <div className="mt-10 rounded-xl border border-zinc-200 bg-white p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-emerald-600">
            Claim flow
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-zinc-700">
            <FlowBox label="Customer submits" />
            <Arrow />
            <FlowBox label="Order lookup" highlight />
            <Arrow />
            <FlowBox label="Policy engine" highlight />
            <Arrow />
            <FlowBox label="Verdict + email" />
          </div>
          <p className="mt-4 text-center text-xs text-zinc-500">
            Approve · Deny · Human review — with full rule audit trail
          </p>
        </div>

        <Section icon={<Target className="h-5 w-5" />} title="Problem">
          <h3 className="text-lg font-semibold text-zinc-900">{cs.problem.headline}</h3>
          <p className="mt-3 leading-relaxed text-zinc-600">{cs.problem.body}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {cs.problem.stats.map((s) => (
              <div key={s.label} className="rounded-lg bg-emerald-50 px-4 py-3 text-center">
                <div className="text-xl font-bold text-emerald-800">{s.value}</div>
                <div className="text-xs text-emerald-700">{s.label}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={<Lightbulb className="h-5 w-5" />} title="Research">
          <h3 className="text-lg font-semibold text-zinc-900">{cs.research.headline}</h3>
          <ul className="mt-4 space-y-2">
            {cs.research.findings.map((f) => (
              <li key={f} className="flex gap-2 text-zinc-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                {f}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-zinc-500">{cs.research.method}</p>
        </Section>

        <Section icon={<ShieldCheck className="h-5 w-5" />} title="Solution">
          <h3 className="text-lg font-semibold text-zinc-900">{cs.solution.headline}</h3>
          <ul className="mt-4 space-y-4">
            {cs.solution.features.map((f) => (
              <li key={f.name} className="rounded-lg border border-zinc-100 p-4">
                <div className="font-medium text-zinc-900">{f.name}</div>
                <div className="mt-1 text-sm text-zinc-600">{f.why}</div>
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={<Target className="h-5 w-5" />} title="Results">
          <h3 className="text-lg font-semibold text-zinc-900">{cs.results.headline}</h3>
          <p className="mt-3 leading-relaxed text-zinc-600">{cs.results.summary}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {cs.results.metrics.map((m) => (
              <div key={m.label} className="rounded-lg border border-zinc-200 p-4">
                <div className="text-2xl font-bold text-zinc-900">{m.value}</div>
                <div className="text-sm text-zinc-500">{m.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 overflow-x-auto rounded-lg border border-zinc-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs text-zinc-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Order</th>
                  <th className="px-4 py-2 font-medium">Amount</th>
                  <th className="px-4 py-2 font-medium">Verdict</th>
                  <th className="px-4 py-2 font-medium">Rule</th>
                </tr>
              </thead>
              <tbody>
                {cs.results.sampleRoutes.map((r) => (
                  <tr key={r.order} className="border-t border-zinc-100">
                    <td className="px-4 py-2 font-mono text-xs">{r.order}</td>
                    <td className="px-4 py-2">{r.amount}</td>
                    <td className="px-4 py-2">{r.verdict}</td>
                    <td className="px-4 py-2 text-zinc-600">{r.rule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section icon={<Lightbulb className="h-5 w-5" />} title="Tradeoffs">
          <h3 className="text-lg font-semibold text-zinc-900">{cs.tradeoffs.headline}</h3>
          <ul className="mt-4 space-y-4">
            {cs.tradeoffs.decisions.map((d) => (
              <li key={d.decision} className="border-l-2 border-emerald-200 pl-4">
                <div className="font-medium text-zinc-900">{d.decision}</div>
                <div className="mt-1 text-sm text-zinc-600">{d.rationale}</div>
              </li>
            ))}
          </ul>
        </Section>

        {"nextSteps" in cs && cs.nextSteps && (
          <Section icon={<ArrowUpRight className="h-5 w-5" />} title="Production roadmap">
            <h3 className="text-lg font-semibold text-zinc-900">{cs.nextSteps.headline}</h3>
            <ul className="mt-4 space-y-2">
              {cs.nextSteps.items.map((item) => (
                <li key={item} className="flex gap-2 text-zinc-600">
                  <span className="text-emerald-500">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </article>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <div className="mb-4 flex items-center gap-2 text-emerald-600">
        {icon}
        <h2 className="text-sm font-semibold uppercase tracking-wide">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function FlowBox({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <span
      className={`rounded-lg px-3 py-2 ${
        highlight ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-700"
      }`}
    >
      {label}
    </span>
  );
}

function Arrow() {
  return <span className="text-zinc-400">→</span>;
}
