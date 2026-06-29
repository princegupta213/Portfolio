"use client";

import { skills } from "@/data/profile";
import { FadeIn, HoverLift, Stagger, StaggerItem } from "@/components/motion/FadeIn";

export function Skills() {
  return (
    <section id="skills" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <p className="text-sm font-medium tracking-wide text-indigo-600 uppercase">
            Skills
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
            What I bring to the table
          </h2>
        </FadeIn>

        <Stagger className="mt-10 grid gap-8 sm:grid-cols-2">
          {[
            { title: "Product", items: skills.product },
            { title: "Technical", items: skills.technical },
          ].map((group) => (
            <StaggerItem key={group.title}>
              <HoverLift>
                <div className="rounded-2xl border border-zinc-200 bg-white p-8 transition-all duration-300 hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-50">
                  <h3 className="font-semibold text-zinc-900">{group.title}</h3>
                  <ul className="mt-4 space-y-3">
                    {group.items.map((skill, i) => (
                      <li
                        key={skill}
                        className="flex items-center gap-3 text-sm text-zinc-600"
                        style={{ transitionDelay: `${i * 30}ms` }}
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
