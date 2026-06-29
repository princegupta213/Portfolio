"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BarChart3, BookOpen, FileText, Sparkles } from "lucide-react";
import { projects } from "@/data/projects";
import { TRUMIO_MOCK_RESEARCH } from "@/data/mock/trumio";
import { FITCHECK_MOCK_SURVEY } from "@/data/mock/fitcheck";
import { FadeIn, HoverLift, Stagger, StaggerItem, easeOut } from "@/components/motion/FadeIn";

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  const other = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="bg-zinc-100/80 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <p className="text-sm font-medium tracking-wide text-indigo-600 uppercase">
            Projects
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
            Product work & case studies
          </h2>
          <p className="mt-4 max-w-2xl text-zinc-600">
            End-to-end product projects with PRDs, case studies, and live demos — from platform
            infra (LLM routing) to user research tools, plus 0→1 work from internships and IIT Bombay.
          </p>
        </FadeIn>

        <div className="mt-12 space-y-8">
          {featured.map((project) => (
            <FadeIn key={project.id}>
              <ProjectCard project={project} large />
            </FadeIn>
          ))}
        </div>

        {other.length > 0 && (
          <FadeIn delay={0.1} className="mt-16">
            <h3 className="text-lg font-semibold text-zinc-900">More projects</h3>
            <Stagger className="mt-6 grid gap-6 md:grid-cols-2">
              {other.map((project) => (
                <StaggerItem key={project.id}>
                  <ProjectCard project={project} />
                </StaggerItem>
              ))}
            </Stagger>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  large = false,
}: {
  project: (typeof projects)[number];
  large?: boolean;
}) {
  const reduced = useReducedMotion();
  const accent = project.accent ?? "indigo";
  const themes = {
    indigo: {
      gradient: "from-indigo-600 to-indigo-800",
      subtitle: "text-indigo-100",
      metric: "text-indigo-200",
      hoverBorder: "hover:border-indigo-200 hover:shadow-indigo-100/50",
      shadow: "rgba(79, 70, 229, 0.15)",
      btn: "bg-indigo-600 hover:bg-indigo-700",
      btnOutline: "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
      metricText: "text-indigo-600",
      tagHover: "hover:bg-indigo-50 hover:text-indigo-700",
    },
    emerald: {
      gradient: "from-emerald-600 to-teal-800",
      subtitle: "text-emerald-100",
      metric: "text-emerald-200",
      hoverBorder: "hover:border-emerald-200 hover:shadow-emerald-100/50",
      shadow: "rgba(5, 150, 105, 0.15)",
      btn: "bg-emerald-600 hover:bg-emerald-700",
      btnOutline: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
      metricText: "text-emerald-600",
      tagHover: "hover:bg-emerald-50 hover:text-emerald-700",
    },
  }[accent];

  if (large) {
    return (
      <HoverLift>
        <motion.article
          className={`group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-colors duration-300 hover:shadow-lg ${themes.hoverBorder}`}
          whileHover={reduced ? undefined : { boxShadow: `0 20px 40px -12px ${themes.shadow}` }}
          transition={{ duration: 0.3, ease: easeOut }}
        >
          <div className="grid lg:grid-cols-5">
            <div className={`relative overflow-hidden bg-gradient-to-br ${themes.gradient} p-8 lg:col-span-2`}>
              <div className="absolute inset-0 opacity-10">
                <motion.div
                  className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white"
                  animate={reduced ? undefined : { scale: [1, 1.1, 1], x: [0, 8, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white" />
              </div>
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                  <Sparkles className="h-3.5 w-3.5" />
                  Featured project
                </div>
                <h3 className="mt-4 text-2xl font-bold text-white">{project.title}</h3>
                <p className={`mt-2 text-sm ${themes.subtitle}`}>{project.subtitle}</p>
                {project.metrics && (
                  <div className="mt-8 grid grid-cols-3 gap-3">
                    {project.metrics.map((m) => (
                      <div key={m.label}>
                        <div className="text-lg font-bold text-white">{m.value}</div>
                        <div className={`text-xs ${themes.metric}`}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-between p-8 lg:col-span-3">
              <ProjectBody project={project} tagHover={themes.tagHover} />
              <ProjectActions project={project} btn={themes.btn} btnOutline={themes.btnOutline} />
            </div>
          </div>
        </motion.article>
      </HoverLift>
    );
  }

  return (
    <HoverLift>
      <article className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:border-indigo-200 hover:shadow-md">
        <ProjectBody project={project} tagHover={themes.tagHover} />
        {project.metrics && (
          <div className="mt-4 flex gap-6">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <div className={`font-bold ${themes.metricText}`}>{m.value}</div>
                <div className="text-xs text-zinc-500">{m.label}</div>
              </div>
            ))}
          </div>
        )}
        <ProjectMockPreview projectId={project.id} />
        <div className="mt-auto pt-6">
          <ProjectActions project={project} btn={themes.btn} btnOutline={themes.btnOutline} />
        </div>
      </article>
    </HoverLift>
  );
}

function ProjectBody({
  project,
  tagHover,
}: {
  project: (typeof projects)[number];
  tagHover: string;
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className={`rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 transition-colors ${tagHover}`}
          >
            {tag}
          </span>
        ))}
      </div>
      {!project.featured && (
        <h3 className="mt-3 text-lg font-semibold text-zinc-900">{project.title}</h3>
      )}
      <p className="mt-3 leading-relaxed text-zinc-600">{project.description}</p>
      <div className="mt-3 flex gap-4 text-sm text-zinc-500">
        <span>{project.role}</span>
        <span>·</span>
        <span>{project.timeline}</span>
      </div>
    </div>
  );
}

function ProjectMockPreview({ projectId }: { projectId: string }) {
  if (projectId === "trumio") {
    return (
      <div className="mt-4 rounded-lg border border-zinc-100 bg-zinc-50 p-3">
        <p className="text-xs font-medium text-zinc-500">Mock research snapshot</p>
        <ul className="mt-2 space-y-1">
          {TRUMIO_MOCK_RESEARCH.apps.map((app) => (
            <li key={app.name} className="text-xs text-zinc-600">
              <span className="font-medium text-zinc-800">{app.name}</span> · SOM {app.som}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (projectId === "fitcheck") {
    return (
      <div className="mt-4 rounded-lg border border-zinc-100 bg-zinc-50 p-3">
        <p className="text-xs font-medium text-zinc-500">Mock survey data</p>
        <ul className="mt-2 space-y-1">
          {FITCHECK_MOCK_SURVEY.keyFindings.slice(0, 2).map((f) => (
            <li key={f.finding} className="text-xs text-zinc-600">
              {f.pct}% — {f.finding.slice(0, 55)}…
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
}

function ProjectActions({
  project,
  btn,
  btnOutline,
}: {
  project: (typeof projects)[number];
  btn: string;
  btnOutline: string;
}) {
  const reduced = useReducedMotion();
  const tap = reduced
    ? {}
    : { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, transition: { duration: 0.2 } };

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {project.href && (
        <motion.div {...tap}>
          <Link
            href={project.href}
            className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors ${btn}`}
          >
            <BarChart3 className="h-4 w-4" />
            Live demo
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>
      )}
      {project.caseStudyHref && (
        <motion.div {...tap}>
          <Link
            href={project.caseStudyHref}
            className={`inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors ${btnOutline}`}
          >
            <BookOpen className="h-4 w-4" />
            Case study
          </Link>
        </motion.div>
      )}
      {project.docsHref && (
        <motion.div {...tap}>
          <Link
            href={project.docsHref}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <FileText className="h-4 w-4" />
            Read PRD
          </Link>
        </motion.div>
      )}
    </div>
  );
}
