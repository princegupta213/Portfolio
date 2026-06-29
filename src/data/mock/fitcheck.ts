export const FITCHECK_MOCK_SURVEY = {
  totalResponses: 84,
  completionRate: 91,
  keyFindings: [
    { finding: "67% abandon online purchase due to size uncertainty", pct: 67 },
    { finding: "78% would use virtual try-on if checkout integrated", pct: 78 },
    { finding: "45% reduction in return rate with 3D fit preview", pct: 45 },
  ],
  segments: [
    { segment: "Women 18–25", sampleSize: 32, willingnessToPay: "₹199/mo" },
    { segment: "Men 25–35", sampleSize: 28, willingnessToPay: "₹149/mo" },
    { segment: "Premium shoppers", sampleSize: 24, willingnessToPay: "₹499/mo" },
  ],
  prototypeMetrics: {
    samplingCostReduction: "45%",
    avgSessionMinutes: 4.2,
    fitConfidenceScore: 4.1,
    nps: 42,
  },
};

export const FITCHECK_MOCK_PERSONAS = [
  {
    name: "Priya, 22",
    behavior: "Shops fashion online 2×/month, returns 40% due to fit",
    painPoint: "Size charts differ across brands",
  },
  {
    name: "Arjun, 29",
    behavior: "Buys formal wear online, visits store for alterations",
    painPoint: "No way to preview drape and shoulder fit",
  },
];
