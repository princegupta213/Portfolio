import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import { DocClassifierApp } from "@/components/DocClassifierApp";

export default function DocClassifierPage() {
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
              href="/docs/doc-classifier-PRD"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900"
            >
              <FileText className="h-4 w-4" />
              PRD
            </Link>
            <a
              href="https://github.com/princegupta213/pdf-doc-classifier"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-800"
            >
              <ExternalLink className="h-4 w-4" />
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <DocClassifierApp />

      <footer className="border-t border-zinc-200 bg-white py-6 text-center text-sm text-zinc-500">
        AI Document Classifier · Prince Kumar · Browser demo + Streamlit production app
      </footer>
    </div>
  );
}
