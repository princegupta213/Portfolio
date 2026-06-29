"use client";

import { profile } from "@/data/profile";
import { FadeIn } from "@/components/motion/FadeIn";

export function Footer() {
  return (
    <FadeIn amount={0.5}>
      <footer className="border-t border-zinc-200 px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} {profile.name}. Built with Next.js.
          </p>
          <p className="text-sm text-zinc-400">
            Aspiring Associate Product Manager
          </p>
        </div>
      </footer>
    </FadeIn>
  );
}
