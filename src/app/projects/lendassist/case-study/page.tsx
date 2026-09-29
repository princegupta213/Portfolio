import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Bot,
  CheckCircle2,
  FileText,
  Lightbulb,
  ShieldAlert,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { lendassistCaseStudy as cs } from "@/data/case-studies/lendassist";

export default function LendAssistCaseStudyPage() {
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
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            <Sparkles className="h-4 w-4" />
            Live Demo
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-sm font-medium tracking-wide text-indigo-600 uppercase">
          Case study · Conversational AI · Fintech Platform PM
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
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Try live orchestrator <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href={cs.links.prd}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            <FileText className="h-4 w-4" /> Read PRD
          </Link>
          <a
            href={cs.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            GitHub
          </a>
        </div>

        {/* System Architecture Flow Banner */}
        <div className="mt-10 rounded-xl border border-zinc-200 bg-white p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Lending Conversation Orchestration Architecture
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-zinc-700">
            <FlowBox label="Customer Ingestion" />
            <Arrow />
            <FlowBox label="NLU Intent Layer" highlight />
            <Arrow />
            <FlowBox label="Dialogue FSM & Context" />
            <Arrow />
            <FlowBox label="Multi-Signal Escalation" highlight />
            <Arrow />
            <FlowBox label="Grounded Synthesis / Human" />
          </div>
          <p className="mt-4 text-center text-xs text-zinc-500">
            Dual-LLM · Brevity boundaries · CAMS RTA lien sync · Lossless agent handoff
          </p>
        </div>

        {/* 1. Problem */}
        <Section icon={<Target className="h-5 w-5" />} title="Problem">
          <p className="text-lg font-medium text-zinc-800">{cs.problem.headline}</p>
          <p className="mt-3 leading-relaxed text-zinc-600">{cs.problem.body}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            {cs.problem.stats.map((s) => (
              <div key={s.label} className="rounded-lg border border-zinc-200 bg-white p-4">
                <div className="text-2xl font-bold text-indigo-600">{s.value}</div>
                <div className="mt-1 text-xs text-zinc-500">{s.label}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* 2. Research */}
        <Section icon={<Users className="h-5 w-5" />} title="Research & Design Principles">
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

        {/* 3. Solution */}
        <Section icon={<Sparkles className="h-5 w-5" />} title="Solution Architecture">
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

        {/* 4. Results & Benchmark */}
        <Section icon={<BarChart3 className="h-5 w-5" />} title="Results & Evaluation">
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

          <h3 className="mt-8 font-semibold text-zinc-900">Sample Conversation Routing Log</h3>
          <div className="mt-4 overflow-hidden rounded-lg border border-zinc-200">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-zinc-600">Session ID</th>
                  <th className="px-4 py-2 text-left font-medium text-zinc-600">Loan Context</th>
                  <th className="px-4 py-2 text-left font-medium text-zinc-600">Decision Verdict</th>
                  <th className="px-4 py-2 text-left font-medium text-zinc-600">Enforcement Policy</th>
                </tr>
              </thead>
              <tbody>
                {cs.results.sampleRoutes.map((r) => (
                  <tr key={r.order} className="border-t border-zinc-100">
                    <td className="px-4 py-3 text-zinc-800 font-medium">{r.order}</td>
                    <td className="px-4 py-3 text-zinc-600">{r.amount}</td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        r.verdict.includes("Escalation") || r.verdict.includes("Block")
                          ? "text-amber-600"
                          : "text-indigo-600"
                      }`}
                    >
                      {r.verdict}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">{r.rule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 5. Trade-offs */}
        <Section icon={<Lightbulb className="h-5 w-5" />} title="Key Trade-offs & Decisions">
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

        {/* 6. Next Steps */}
        <Section icon={<ArrowUpRight className="h-5 w-5" />} title="Production Roadmap">
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

        {/* CTA Footer Card */}
        <div className="mt-16 rounded-xl bg-indigo-600 p-8 text-center text-white">
          <h2 className="text-xl font-bold">Experience LendAssist Live</h2>
          <p className="mt-2 text-indigo-100">
            Interact with the dual-LLM lending orchestrator, test the failure injection bench, and review real-time decision telemetry.
          </p>
          <Link
            href={cs.links.liveDemo}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
          >
            Launch LendAssist Demo <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    </div>
  );
}

function FlowBox({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-lg px-3.5 py-1.5 text-xs ${
        highlight
          ? "bg-indigo-50 text-indigo-800 ring-1 ring-indigo-200 font-semibold"
          : "bg-zinc-100 text-zinc-700"
      }`}
    >
      {label}
    </div>
  );
}

function Arrow() {
  return <span className="text-zinc-400 text-xs">→</span>;
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
