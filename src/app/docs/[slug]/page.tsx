import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";

const DOC_TITLES: Record<string, string> = {
  "pm-thought-process": "PM Thought Process",
  "data-synth-PRD": "DataSynth PRD",
  "surge-sim-PRD": "SurgeSim PRD",
  "prompt-route-PRD": "PromptRoute PRD",
  "claim-resolve-PRD": "ClaimResolve PRD",
  "doc-classifier-PRD": "Document Classifier PRD",
  PRD: "Feedback Analyzer PRD",
  "user-research-summary": "User Research Summary",
  "product-strategy": "Product Strategy",
};

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const docsDir = path.join(process.cwd(), "public/docs");
  if (!fs.existsSync(docsDir)) return [];
  return fs
    .readdirSync(docsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ slug: f.replace(/\.md$/, "") }));
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "public/docs", `${slug}.md`);

  if (!fs.existsSync(filePath)) notFound();

  const content = fs.readFileSync(filePath, "utf8");
  const title = DOC_TITLES[slug] ?? slug.replace(/-/g, " ");

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </Link>
          <span className="inline-flex items-center gap-1.5 text-sm text-zinc-500">
            <FileText className="h-4 w-4" />
            PRD
          </span>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
          <DocContent content={content} title={title} />
        </div>
      </article>
    </div>
  );
}

function DocContent({ content, title }: { content: string; title: string }) {
  const lines = content.split("\n");

  return (
    <div className="prose-doc space-y-1 text-zinc-800">
      {lines.map((line, i) => {
        if (line.startsWith("# ")) {
          return (
            <h1 key={i} className="mb-4 text-3xl font-bold text-zinc-900">
              {line.slice(2)}
            </h1>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={i} className="mb-3 mt-8 text-xl font-semibold text-zinc-900">
              {line.slice(3)}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={i} className="mb-2 mt-6 text-lg font-semibold text-zinc-900">
              {line.slice(4)}
            </h3>
          );
        }
        if (line.startsWith("|")) {
          return (
            <p key={i} className="overflow-x-auto font-mono text-sm text-zinc-700">
              {line}
            </p>
          );
        }
        if (line.startsWith("- ")) {
          return (
            <li key={i} className="ml-4 list-disc text-zinc-700">
              {formatInline(line.slice(2))}
            </li>
          );
        }
        if (line.startsWith("---")) {
          return <hr key={i} className="my-6 border-zinc-200" />;
        }
        if (line.trim() === "") {
          return <div key={i} className="h-2" />;
        }
        return (
          <p key={i} className="leading-relaxed text-zinc-700">
            {formatInline(line)}
          </p>
        );
      })}
    </div>
  );
}

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-zinc-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-sm">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
