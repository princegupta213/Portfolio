import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  FileText,
  Lightbulb,
  Target,
  Users,
} from "lucide-react";
import { feedbackAnalyzerCaseStudy as cs } from "@/data/case-studies/feedback-analyzer";

export default function CaseStudyPage() {
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
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            <BarChart3 className="h-4 w-4" />
            Live demo
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-12">
        {/* Hero */}
        <p className="text-sm font-medium text-indigo-600 uppercase tracking-wide">
          Case study
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900">
          {cs.title}
        </h1>
        <p className="mt-3 text-xl text-zinc-600">{cs.subtitle}</p>
        <div className="mt-4 flex gap-4 text-sm text-zinc-500">
          <span>{cs.role}</span>
          <span>·</span>
          <span>{cs.timeline}</span>
        </div>

        {/* Quick links */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={cs.links.liveDemo}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Try live demo <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href={cs.links.prd}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            <FileText className="h-4 w-4" /> PRD
          </Link>
          <Link
            href={cs.links.research}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            <Users className="h-4 w-4" /> User research
          </Link>
        </div>

        {/* Screenshot placeholder */}
        {cs.screenshotSrc ? (
          <img
            src={cs.screenshotSrc}
            alt="Feedback analyzer dashboard"
            className="mt-10 rounded-xl border border-zinc-200 shadow-lg"
          />
        ) : (
          <div className="mt-10 rounded-xl border-2 border-dashed border-zinc-200 bg-white p-10 text-center">
            <p className="text-sm font-medium text-zinc-500">
              Screenshot placeholder
            </p>
            <p className="mt-2 text-xs text-zinc-400">
              Save a dashboard screenshot to{" "}
              <code className="rounded bg-zinc-100 px-1">
                public/projects/feedback-analyzer-dashboard.png
              </code>{" "}
              and set{" "}
              <code className="rounded bg-zinc-100 px-1">screenshotSrc</code> in{" "}
              <code className="rounded bg-zinc-100 px-1">
                src/data/case-studies/feedback-analyzer.ts
              </code>
            </p>
          </div>
        )}

        {/* Problem */}
        <Section icon={<Target className="h-5 w-5" />} title="Problem">
          <p className="text-lg font-medium text-zinc-800">{cs.problem.headline}</p>
          <p className="mt-3 leading-relaxed text-zinc-600">{cs.problem.body}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {cs.problem.stats.map((s) => (
              <div key={s.label} className="rounded-lg border border-zinc-200 bg-white p-4">
                <div className="text-2xl font-bold text-indigo-600">{s.value}</div>
                <div className="mt-1 text-xs text-zinc-500">{s.label}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Research */}
        <Section icon={<Users className="h-5 w-5" />} title="Research">
          <p className="text-lg font-medium text-zinc-800">{cs.research.headline}</p>
          <ul className="mt-4 space-y-3">
            {cs.research.findings.map((f, i) => (
              <li key={i} className="flex gap-3 text-zinc-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                {f}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-zinc-500">{cs.research.method}</p>
        </Section>

        {/* Solution */}
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

        {/* Results */}
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
          <h3 className="mt-8 font-semibold text-zinc-900">Top prioritized initiatives</h3>
          <div className="mt-4 overflow-hidden rounded-lg border border-zinc-200">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-zinc-600">Priority</th>
                  <th className="px-4 py-2 text-left font-medium text-zinc-600">Initiative</th>
                  <th className="px-4 py-2 text-left font-medium text-zinc-600">ICE</th>
                </tr>
              </thead>
              <tbody>
                {cs.results.topPriorities.map((p) => (
                  <tr key={p.title} className="border-t border-zinc-100">
                    <td className="px-4 py-3">
                      <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                        {p.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-800">{p.title}</td>
                    <td className="px-4 py-3 font-semibold text-indigo-600">{p.ice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Tradeoffs */}
        <Section icon={<Target className="h-5 w-5" />} title="Tradeoffs">
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

        {/* Next steps */}
        <Section icon={<ArrowUpRight className="h-5 w-5" />} title="What's next">
          <p className="text-lg font-medium text-zinc-800">{cs.nextSteps.headline}</p>
          <ul className="mt-4 space-y-2">
            {cs.nextSteps.items.map((item) => (
              <li key={item} className="flex gap-3 text-zinc-600">
                <span className="text-indigo-500">→</span>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        {/* CTA */}
        <div className="mt-16 rounded-xl bg-indigo-600 p-8 text-center text-white">
          <h2 className="text-xl font-bold">Try it yourself</h2>
          <p className="mt-2 text-indigo-100">
            Upload a CSV or analyze 106 sample reviews in under 2 minutes.
          </p>
          <Link
            href={cs.links.liveDemo}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
          >
            Open live demo <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
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
    <section className="mt-14">
      <div className="flex items-center gap-2 text-indigo-600">
        {icon}
        <h2 className="text-sm font-semibold uppercase tracking-wide">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
