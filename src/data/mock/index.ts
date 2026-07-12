export * from "./claim-resolve";
export * from "./prompt-route";
export * from "./doc-classifier";
export * from "./feedback-analyzer";
export * from "./trumio";
export * from "./fitcheck";

/** Registry of all portfolio project mock datasets */
export const MOCK_DATA_REGISTRY = {
  "claim-resolve": { label: "ClaimResolve", hasLiveDemo: true, sampleAction: "Try sample orders" },
  "prompt-route": { label: "PromptRoute", hasLiveDemo: true, sampleAction: "Run sample batch" },
  "feedback-analyzer": { label: "Feedback Analyzer", hasLiveDemo: true, sampleAction: "106 sample reviews" },
  "doc-classifier": { label: "Doc Classifier", hasLiveDemo: true, sampleAction: "20 sample documents" },
  trumio: { label: "Trumio", hasLiveDemo: false, sampleAction: "3 app concepts + TAM/SAM/SOM" },
  fitcheck: { label: "FitCheck", hasLiveDemo: false, sampleAction: "84 survey responses" },
} as const;
