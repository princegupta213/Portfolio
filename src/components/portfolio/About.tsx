"use client";

import Link from "next/link";
import { about } from "@/data/profile";
import { FadeIn, HoverLift, Stagger, StaggerItem } from "@/components/motion/FadeIn";

export function About() {
  return (
    <section id="about" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <p className="text-sm font-medium tracking-wide text-indigo-600 uppercase">
            About
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
            Product-minded builder
          </h2>
        </FadeIn>

        <div className="mt-10 grid gap-10 lg:grid-cols-5">
          <Stagger className="space-y-4 lg:col-span-3">
            {about.paragraphs.map((p, i) => (
              <StaggerItem key={i}>
                <p className="leading-relaxed text-zinc-600">{p}</p>
              </StaggerItem>
            ))}
            <StaggerItem>
              <Link
                href="/docs/pm-thought-process"
                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                PM thought process — how I built each project →
              </Link>
            </StaggerItem>
          </Stagger>

          <Stagger className="space-y-4 lg:col-span-2">
            {about.highlights.map((item) => (
              <StaggerItem key={item.label}>
                <HoverLift>
                  <div className="rounded-xl border border-zinc-200 bg-white p-5 transition-shadow duration-300 hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-50">
                    <div className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
                      {item.label}
                    </div>
                    <div className="mt-1 font-medium text-zinc-900">{item.value}</div>
                  </div>
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
