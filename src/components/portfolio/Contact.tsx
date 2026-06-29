"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Mail, ExternalLink, FileDown } from "lucide-react";
import { profile } from "@/data/profile";
import { FadeIn, Stagger, StaggerItem, easeOut } from "@/components/motion/FadeIn";

export function Contact() {
  const reduced = useReducedMotion();
  const tap = reduced
    ? {}
    : { whileHover: { scale: 1.03, y: -2 }, whileTap: { scale: 0.98 }, transition: { duration: 0.2, ease: easeOut } };

  const links = [
    { href: `mailto:${profile.email}`, label: "Email me", icon: Mail, primary: true },
    { href: profile.resumeUrl, label: "Resume", icon: FileDown, external: true },
    { href: profile.linkedin, label: "LinkedIn", icon: ExternalLink, external: true },
    { href: profile.github, label: "GitHub", icon: ExternalLink, external: true },
  ];

  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-indigo-50 to-white p-10 text-center sm:p-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-100/40 blur-3xl" />
            <div className="relative">
              <p className="text-sm font-medium tracking-wide text-indigo-600 uppercase">
                Contact
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
                Let&apos;s build something together
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-zinc-600">
                Open to Associate Product Manager roles and PM internships.
                B.Tech IIT Bombay &apos;25 — based in Mumbai.
              </p>

              <Stagger className="mt-8 flex flex-wrap justify-center gap-4">
                {links.map((link) => {
                  const Icon = link.icon;
                  const className = link.primary
                    ? "inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                    : "inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50";

                  return (
                    <StaggerItem key={link.label}>
                      <motion.a
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className={className}
                        {...tap}
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </motion.a>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
