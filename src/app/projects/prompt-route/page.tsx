import Link from "next/link";
import { ArrowLeft, BookOpen, FileText } from "lucide-react";
import { PromptRouteApp } from "@/components/PromptRouteApp";

export default function PromptRoutePage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/projects/prompt-route/case-study"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900"
            >
              <BookOpen className="h-4 w-4" />
              Case study
            </Link>
            <Link
              href="/docs/prompt-route-PRD"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900"
            >
              <FileText className="h-4 w-4" />
              PRD
            </Link>
          </nav>
        </div>
      </header>

      <PromptRouteApp />

      <footer className="border-t border-zinc-200 bg-white py-6 text-center text-sm text-zinc-500">
        PromptRoute · Intelligent Multi-LLM Router & Cost Optimizer · Prince Kumar
      </footer>
    </div>
  );
}
