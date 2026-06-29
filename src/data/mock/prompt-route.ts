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
  {
    id: "chat-3",
    prompt: "Thanks! Can you confirm my appointment is still at 3pm tomorrow?",
    taskType: "simple_chat",
    label: "Scheduling confirm",
  },
  {
    id: "sum-3",
    prompt:
      "Condense this 40-page SOC 2 audit report into a one-page executive summary highlighting open findings.",
    taskType: "summarization",
    label: "Compliance summary",
  },
  {
    id: "code-3",
    prompt:
      "Implement a Python FastAPI endpoint with Pydantic validation for batch document classification webhooks.",
    taskType: "code_gen",
    label: "API scaffold",
  },
  {
    id: "reason-3",
    prompt:
      "Given our current 2M DAU and $0.08/1K token cost, model the ROI of routing 70% of traffic to Flash vs Pro.",
    taskType: "complex_reasoning",
    label: "Cost modeling",
  },
  {
    id: "extract-3",
    prompt:
      "From this shipping label OCR text, extract tracking_number, carrier, weight_kg, and destination_zip as JSON.",
    taskType: "data_extraction",
    label: "Logistics parse",
  },
  {
    id: "chat-4",
    prompt: "What does error code ECONNRESET mean in Node.js?",
    taskType: "simple_chat",
    label: "Dev FAQ",
  },
  {
    id: "reason-4",
    prompt:
      "Design a circuit-breaker policy for OpenAI, Anthropic, and Gemini with fallback order and health-check intervals.",
    taskType: "complex_reasoning",
    label: "Resilience design",
  },
];

export const SAMPLE_PROMPTS = MOCK_LLM_PROMPTS.map((p) => p.prompt);

export const MOCK_ROUTING_BATCH = {
  name: "Mixed production workload",
  description: "12 prompts spanning chat, code, summarization, extraction, and reasoning.",
  promptCount: MOCK_LLM_PROMPTS.length,
  expectedCostSavingsPct: "~48%",
};
