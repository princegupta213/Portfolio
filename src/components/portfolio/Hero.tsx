"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, FileDown } from "lucide-react";
import { profile } from "@/data/profile";
import { easeOut, Stagger, StaggerItem } from "@/components/motion/FadeIn";

const stats = [
  { value: "Angel One", label: "Product & ops" },
  { value: "Indian Oil", label: "Product & strategy" },
  { value: "INR 35M+", label: "Budgets managed" },
  { value: "13,000+", label: "Students led" },
];

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-blob-drift absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-100/60 blur-3xl" />
        <div className="animate-blob-drift-alt absolute -right-32 top-32 h-64 w-64 rounded-full bg-violet-100/50 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl">
        <Stagger className="space-y-0">
          <StaggerItem>
            <p className="mb-4 text-sm font-medium tracking-wide text-indigo-600 uppercase">
              IIT Bombay · Chemical Engineering · 2025
            </p>
          </StaggerItem>

          <StaggerItem>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
              Hi, I&apos;m{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                {profile.name}
              </span>
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-4 text-xl font-medium text-zinc-700 sm:text-2xl">
              {profile.title}
            </p>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
              {profile.tagline}
            </p>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-10 flex flex-wrap gap-4">
              <motion.a
                href="/#projects"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                {...(!reduced && {
                  whileHover: { scale: 1.02, y: -1 },
                  whileTap: { scale: 0.98 },
                  transition: { duration: 0.2, ease: easeOut },
                })}
              >
                View my work
                <ArrowDown className="h-4 w-4" />
              </motion.a>
              <motion.a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                {...(!reduced && {
                  whileHover: { scale: 1.02, y: -1 },
                  whileTap: { scale: 0.98 },
                  transition: { duration: 0.2, ease: easeOut },
                })}
              >
                <FileDown className="h-4 w-4" />
                Resume
              </motion.a>
              <motion.a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                {...(!reduced && {
                  whileHover: { scale: 1.02, y: -1 },
                  whileTap: { scale: 0.98 },
                  transition: { duration: 0.2, ease: easeOut },
                })}
              >
                LinkedIn
                <ArrowUpRight className="h-4 w-4" />
              </motion.a>
            </div>
          </StaggerItem>
        </Stagger>

        <Stagger className="mt-16 grid grid-cols-2 gap-6 border-t border-zinc-200 pt-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="group cursor-default">
                <div className="text-2xl font-bold text-zinc-900 transition-colors group-hover:text-indigo-600">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
