import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  CloudRain,
  FileText,
  Lightbulb,
  Map,
  Target,
  Zap,
} from "lucide-react";
import { surgeSimCaseStudy as cs } from "@/data/case-studies/surge-sim";

export default function SurgeSimCaseStudyPage() {
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
            className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-800"
          >
            <BarChart3 className="h-4 w-4" />
            Live demo
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-sm font-medium tracking-wide text-amber-600 uppercase">
          Case study · Marketplaces & Gig Economy
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
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
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
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-amber-600">
            Marketplace flow
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-zinc-700">
            <FlowBox label="Weather Event" />
            <Arrow />
            <FlowBox label="Supply / Demand" highlight />
            <Arrow />
            <FlowBox label="Surge Algorithm" highlight />
            <Arrow />
            <FlowBox label="Match Rate" />
          </div>
          <p className="mt-4 text-center text-xs text-zinc-500">
            Guardrail: checkout abandonment rises when surge exceeds rider price tolerance
          </p>
        </div>

        <Section icon={<Target className="h-5 w-5" />} title="Problem">
          <p className="text-lg font-medium text-zinc-800">{cs.problem.headline}</p>
          <p className="mt-3 leading-relaxed text-zinc-600">{cs.problem.body}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {cs.problem.stats.map((s) => (
              <div key={s.label} className="rounded-lg border border-zinc-200 bg-white p-4">
                <div className="text-2xl font-bold text-amber-600">{s.value}</div>
                <div className="mt-1 text-xs text-zinc-500">{s.label}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={<CloudRain className="h-5 w-5" />} title="Research">
          <p className="text-lg font-medium text-zinc-800">{cs.research.headline}</p>
          <ul className="mt-4 space-y-3">
            {cs.research.findings.map((f, i) => (
              <li key={i} className="flex gap-3 text-zinc-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                {f}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-zinc-500">{cs.research.method}</p>
        </Section>

        <Section icon={<Lightbulb className="h-5 w-5" />} title="Solution">
          <p className="text-lg font-medium text-zinc-800">{cs.solution.headline}</p>
          <div className="mt-6 space-y-4">
            {cs.solution.features.map((f) => (
              <div key={f.name} className="rounded-lg border border-zinc-200 bg-white p-4">
                <div className="font-medium text-zinc-900">{f.name}</div>
                <div className="mt-1 text-sm text-zinc-500">{f.why}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={<BarChart3 className="h-5 w-5" />} title="Results">
          <p className="text-lg font-medium text-zinc-800">{cs.results.headline}</p>
          <p className="mt-3 leading-relaxed text-zinc-600">{cs.results.summary}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {cs.results.metrics.map((m) => (
              <div key={m.label} className="rounded-lg border border-zinc-200 bg-white p-4">
                <div className="text-xl font-bold text-zinc-900">{m.value}</div>
                <div className="text-sm text-zinc-500">{m.label}</div>
              </div>
            ))}
          </div>
          <h3 className="mt-8 font-semibold text-zinc-900">Preset scenarios</h3>
          <div className="mt-4 overflow-hidden rounded-lg border border-zinc-200">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-zinc-600">Scenario</th>
                  <th className="px-4 py-2 text-left font-medium text-zinc-600">Weather</th>
                  <th className="px-4 py-2 text-left font-medium text-zinc-600">Match rate</th>
                  <th className="px-4 py-2 text-left font-medium text-zinc-600">Abandonment</th>
                </tr>
              </thead>
              <tbody>
                {cs.results.sampleScenarios.map((r) => (
                  <tr key={r.scenario} className="border-t border-zinc-100">
                    <td className="px-4 py-3 text-zinc-800">{r.scenario}</td>
                    <td className="px-4 py-3 text-zinc-600">{r.weather}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        {r.match}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                        {r.abandon}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section icon={<Map className="h-5 w-5" />} title="Tradeoffs">
          <p className="text-lg font-medium text-zinc-800">{cs.tradeoffs.headline}</p>
          <div className="mt-6 space-y-4">
            {cs.tradeoffs.decisions.map((d) => (
              <div key={d.decision} className="rounded-lg border border-zinc-200 bg-white p-4">
                <div className="font-medium text-zinc-900">{d.decision}</div>
                <div className="mt-1 text-sm text-zinc-500">{d.rationale}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={<ArrowUpRight className="h-5 w-5" />} title="Production roadmap">
          <p className="text-lg font-medium text-zinc-800">{cs.nextSteps.headline}</p>
          <ul className="mt-4 space-y-2">
            {cs.nextSteps.items.map((item) => (
              <li key={item} className="flex gap-3 text-zinc-600">
                <span className="text-amber-500">→</span>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <div className="mt-16 rounded-xl bg-amber-600 p-8 text-center text-white">
          <h2 className="text-xl font-bold">Simulate a rain surge</h2>
          <p className="mt-2 text-amber-100">
            Load the Heavy Rain preset, drop supply, and watch match rate vs. abandonment trade off live.
          </p>
          <Link
            href={cs.links.liveDemo}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-amber-600 hover:bg-amber-50"
          >
            Open live demo <Zap className="h-4 w-4" />
          </Link>
        </div>
      </article>
    </div>
  );
}

function FlowBox({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-lg px-4 py-2 ${
        highlight ? "bg-amber-50 text-amber-800 ring-1 ring-amber-200" : "bg-zinc-100 text-zinc-700"
      }`}
    >
      {label}
    </div>
  );
}

function Arrow() {
  return <span className="text-zinc-400">→</span>;
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
    <section className="mt-14">
      <div className="flex items-center gap-2 text-amber-600">
        {icon}
        <h2 className="text-sm font-semibold uppercase tracking-wide">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
