import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText, Sparkles } from "lucide-react";

export default function AmazingHypatiaPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/docs/amazing-hypatia-PRD"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200"
            >
              <FileText className="h-4 w-4" />
              PRD
            </Link>
            <a
              href="https://amazing-hypatia.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300"
            >
              <Sparkles className="h-4 w-4" />
              Open Live Site
            </a>
          </nav>
        </div>
      </header>

      {/* Embedded Live Demo Iframe */}
      <div className="flex-1 w-full bg-zinc-950 relative h-[80vh]">
        <iframe
          src="https://amazing-hypatia.vercel.app"
          className="w-full h-full border-none"
          title="Launch Employee (Ava)"
          allow="clipboard-write"
        />
      </div>

      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-sm text-zinc-500">
        Launch Employee (Ava) · Prince Kumar · Live Agentic Workspace
      </footer>
    </div>
  );
}
