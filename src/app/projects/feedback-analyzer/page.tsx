import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { AnalyzerApp } from "@/components/AnalyzerApp";

export default function FeedbackAnalyzerPage() {
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
          <nav className="flex items-center gap-6">
            <Link
              href="/docs/feedback-analyzer-PRD"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900"
            >
              <FileText className="h-4 w-4" />
              PRD
            </Link>
          </nav>
        </div>
      </header>

      <AnalyzerApp />

      <footer className="border-t border-zinc-200 bg-white py-6 text-center text-sm text-zinc-500">
        AI Product Feedback Analyzer · Portfolio project by Prince Kumar
      </footer>
    </div>
  );
}
