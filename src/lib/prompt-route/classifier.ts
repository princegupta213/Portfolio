import type { ClassificationResult, TaskComplexity, ClassificationScore } from "./types";
import { SAMPLE_PROMPTS } from "@/data/mock/prompt-route";

export { SAMPLE_PROMPTS };

const TASK_LABELS: Record<TaskComplexity, string> = {
  simple_chat: "Simple Chat",
  summarization: "Summarization",
  code_gen: "Code Generation",
  complex_reasoning: "Complex Reasoning",
  data_extraction: "Data Extraction",
};

interface SignalRule {
  taskType: TaskComplexity;
  patterns: RegExp[];
  weight: number;
  signal: string;
}

const SIGNAL_RULES: SignalRule[] = [
  {
    taskType: "code_gen",
    patterns: [
      /\b(function|class|def |import |const |let |var |async |await |debug|refactor|implement|typescript|python|javascript|sql query|api endpoint)\b/i,
      /```[\s\S]*```/,
      /\.(ts|tsx|js|py|go|rs)\b/i,
    ],
    weight: 3,
    signal: "Code keywords or fenced block detected",
  },
  {
    taskType: "summarization",
    patterns: [
      /\b(summarize|summary|tl;dr|tldr|condense|brief overview|key points|in \d+ (words|sentences))\b/i,
    ],
    weight: 3,
    signal: "Summarization intent detected",
  },
  {
    taskType: "data_extraction",
    patterns: [
      /\b(extract|parse|json|schema|fields?|table|csv|structured|return as)\b/i,
      /\{[\s\S]*"[\w]+"[\s\S]*\}/,
    ],
    weight: 2.5,
    signal: "Structured extraction pattern",
  },
  {
    taskType: "complex_reasoning",
    patterns: [
      /\b(analyze|compare|evaluate|trade-?off|pros and cons|step by step|reasoning|strategy|architecture|design doc|root cause)\b/i,
      /\b(why|how would you|what if|implications)\b/i,
    ],
    weight: 2,
    signal: "Multi-step reasoning cues",
  },
  {
    taskType: "simple_chat",
    patterns: [
      /^(hi|hello|hey|thanks|thank you|what is|who is|when is|where is)\b/i,
      /\?\s*$/,
    ],
    weight: 1.5,
    signal: "Short conversational query",
  },
];

function estimateTokens(text: string): number {
  return Math.max(8, Math.ceil(text.trim().split(/\s+/).length * 1.35));
}

function estimateOutputTokens(taskType: TaskComplexity, inputTokens: number): number {
  const ratios: Record<TaskComplexity, number> = {
    simple_chat: 0.4,
    summarization: 0.35,
    code_gen: 1.8,
    complex_reasoning: 1.2,
    data_extraction: 0.5,
  };
  return Math.max(16, Math.ceil(inputTokens * ratios[taskType]));
}

export function classifyPrompt(prompt: string): ClassificationResult {
  const inputTokens = estimateTokens(prompt);
  const scores: Record<TaskComplexity, number> = {
    simple_chat: inputTokens < 80 ? 1 : 0,
    summarization: 0,
    code_gen: 0,
    complex_reasoning: inputTokens > 400 ? 0.5 : 0,
    data_extraction: 0,
  };
  const signals: string[] = [];

  if (inputTokens < 100) signals.push(`Short input (~${inputTokens} tokens)`);
  if (inputTokens > 8000) signals.push(`Long context (~${inputTokens} tokens)`);

  for (const rule of SIGNAL_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(prompt)) {
        scores[rule.taskType] += rule.weight;
        if (!signals.includes(rule.signal)) signals.push(rule.signal);
        break;
      }
    }
  }

  if (inputTokens > 8000) {
    scores.summarization += 1;
    signals.push("Long document — likely summarization or extraction");
  }

  const ranked = (Object.entries(scores) as [TaskComplexity, number][]).sort(
    (a, b) => b[1] - a[1]
  );
  const [taskType, topScore] = ranked[0];
  const secondScore = ranked[1]?.[1] ?? 0;
  const confidence = Math.min(
    98,
    Math.round(55 + (topScore / Math.max(topScore + secondScore, 1)) * 40)
  );

  return {
    taskType,
    taskLabel: TASK_LABELS[taskType],
    estimatedInputTokens: inputTokens,
    estimatedOutputTokens: estimateOutputTokens(taskType, inputTokens),
    confidence,
    signals: signals.length ? signals : ["Default classification from token length"],
  };
}

export function getClassificationScores(prompt: string): ClassificationScore[] {
  const inputTokens = estimateTokens(prompt);
  const scores: Record<TaskComplexity, number> = {
    simple_chat: inputTokens < 80 ? 1 : 0,
    summarization: 0,
    code_gen: 0,
    complex_reasoning: inputTokens > 400 ? 0.5 : 0,
    data_extraction: 0,
  };

  for (const rule of SIGNAL_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(prompt)) {
        scores[rule.taskType] += rule.weight;
        break;
      }
    }
  }

  if (inputTokens > 8000) scores.summarization += 1;

  return (Object.entries(scores) as [TaskComplexity, number][])
    .map(([taskType, score]) => ({
      taskType,
      label: TASK_LABELS[taskType],
      score,
    }))
    .sort((a, b) => b.score - a.score);
}
