"use client";

import { experience, leadership, education, achievements } from "@/data/profile";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";

export function Experience() {
  return (
    <section id="experience" className="border-t border-zinc-200 bg-white px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <p className="text-sm font-medium tracking-wide text-indigo-600 uppercase">
            Experience
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
            Work & leadership
          </h2>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-12">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Internships
          </h3>
          <Stagger className="mt-6 space-y-8">
            {experience.map((job) => (
              <StaggerItem key={job.title + job.org}>
                <ExperienceEntry job={job} />
              </StaggerItem>
            ))}
          </Stagger>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-12">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Leadership
          </h3>
          <Stagger className="mt-6 space-y-8">
            {leadership.map((job) => (
              <StaggerItem key={job.title + job.org}>
                <ExperienceEntry job={job} />
              </StaggerItem>
            ))}
          </Stagger>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-12">
          <h3 className="font-semibold text-zinc-900">Education</h3>
          <div className="mt-4">
            {education.map((edu) => (
              <div
                key={edu.school}
                className="rounded-xl border border-zinc-100 bg-zinc-50 p-5 transition-all duration-300 hover:border-indigo-100 hover:shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="font-medium text-zinc-900">{edu.degree}</div>
                    <div className="text-sm text-indigo-600">{edu.school}</div>
                    {"detail" in edu && edu.detail && (
                      <div className="mt-1 text-sm text-zinc-500">{edu.detail}</div>
                    )}
                  </div>
                  <div className="text-sm text-zinc-400">{edu.period}</div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-12">
          <h3 className="font-semibold text-zinc-900">Achievements & certifications</h3>
          <Stagger className="mt-4 grid gap-2 sm:grid-cols-2">
            {achievements.map((a) => (
              <StaggerItem key={a}>
                <div className="flex gap-2 text-sm text-zinc-600">
                  <span className="text-indigo-400">✓</span>
                  {a}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </FadeIn>
      </div>
    </section>
  );
}

function ExperienceEntry({
  job,
}: {
  job: (typeof experience)[number] | (typeof leadership)[number];
}) {
  return (
    <div className="group grid gap-2 sm:grid-cols-4">
      <div className="text-sm text-zinc-500 sm:col-span-1">{job.period}</div>
      <div className="sm:col-span-3">
        <h3 className="font-semibold text-zinc-900 transition-colors group-hover:text-indigo-600">
          {job.title}
        </h3>
        <p className="text-sm text-indigo-600">{job.org}</p>
        <ul className="mt-3 space-y-2">
          {job.bullets.map((b) => (
            <li key={b} className="flex gap-2 text-sm leading-relaxed text-zinc-600">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400 transition-transform duration-300 group-hover:scale-125" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
