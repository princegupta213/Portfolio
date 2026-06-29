import type { TaskComplexity } from "@/lib/prompt-route/types";

export interface MockPrompt {
  id: string;
  prompt: string;
  taskType: TaskComplexity;
  label: string;
}

export const MOCK_LLM_PROMPTS: MockPrompt[] = [
  {
    id: "chat-1",
    prompt: "What is the capital of France?",
    taskType: "simple_chat",
    label: "Simple FAQ",
  },
  {
    id: "chat-2",
    prompt: "Hey, can you explain what a vector database is in simple terms?",
    taskType: "simple_chat",
    label: "Conversational",
  },
  {
    id: "sum-1",
    prompt: "Summarize this 10-page earnings report into 5 bullet points for executives.",
    taskType: "summarization",
    label: "Executive summary",
  },
  {
    id: "sum-2",
    prompt: "TL;DR this customer support thread into 3 action items for the PM.",
    taskType: "summarization",
    label: "Support triage",
  },
  {
    id: "code-1",
    prompt:
      "Write a TypeScript function that debounces API calls with generic types and unit tests.",
    taskType: "code_gen",
    label: "TypeScript utility",
  },
  {
    id: "code-2",
    prompt:
      "Refactor this React component to use useMemo and fix the re-render loop in the useEffect hook.",
    taskType: "code_gen",
    label: "React refactor",
  },
  {
    id: "reason-1",
    prompt:
      "Compare microservices vs monolith for a fintech startup doing 50K RPM — include cost, latency, and team size trade-offs.",
    taskType: "complex_reasoning",
    label: "Architecture trade-off",
  },
  {
    id: "reason-2",
    prompt:
      "Analyze churn drivers from this dataset schema and propose 3 experiments with expected impact.",
    taskType: "complex_reasoning",
    label: "Growth analysis",
  },
  {
    id: "extract-1",
    prompt:
      'Extract name, email, and phone from: "Contact Jane Doe at jane@acme.io or +1-555-0100" as JSON.',
    taskType: "data_extraction",
    label: "Contact parse",
  },
  {
    id: "extract-2",
    prompt:
      "Parse this invoice line items table and return JSON with sku, qty, unit_price, and line_total fields.",
    taskType: "data_extraction",
    label: "Invoice extraction",
  },
  {
    id: "long-1",
    prompt:
      "Review this 12,000-token legal contract appendix and list clauses that conflict with our standard SaaS MSA template.",
    taskType: "complex_reasoning",
    label: "Long context legal",
  },
  {
    id: "sql-1",
    prompt:
      "Write an optimized SQL query joining orders, users, and subscriptions to compute 90-day LTV cohorts by signup month.",
    taskType: "code_gen",
    label: "Analytics SQL",
  },
];

export const SAMPLE_PROMPTS = MOCK_LLM_PROMPTS.map((p) => p.prompt);

export const MOCK_ROUTING_BATCH = {
  name: "Mixed production workload",
  description: "12 prompts spanning chat, code, summarization, extraction, and reasoning.",
  promptCount: MOCK_LLM_PROMPTS.length,
  expectedCostSavingsPct: "~45%",
};
