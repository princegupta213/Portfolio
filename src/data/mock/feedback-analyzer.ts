export interface MockReview {
  review: string;
  rating: number;
  date: string;
  source: string;
}

/** First 20 reviews — full set lives in public/sample-feedback.csv (106 rows) */
export const MOCK_REVIEWS_PREVIEW: MockReview[] = [
  {
    review: "The app crashes every time I open the settings menu. Very frustrating.",
    rating: 1,
    date: "2025-01-15",
    source: "App Store",
  },
  {
    review: "Love the clean design but search is broken — can't find anything.",
    rating: 3,
    date: "2025-01-16",
    source: "App Store",
  },
  {
    review: "Login failed three times today. Password reset email never arrived.",
    rating: 2,
    date: "2025-01-17",
    source: "Google Play",
  },
  {
    review: "Notifications are spamming me every hour. Need a mute option ASAP.",
    rating: 2,
    date: "2025-01-18",
    source: "App Store",
  },
  {
    review: "Great app overall! Easy to use and fast.",
    rating: 5,
    date: "2025-01-19",
    source: "Google Play",
  },
  {
    review: "Too expensive for what you get. Premium plan isn't worth it.",
    rating: 2,
    date: "2025-01-20",
    source: "App Store",
  },
  {
    review: "Customer support took 5 days to respond. Unacceptable.",
    rating: 1,
    date: "2025-01-21",
    source: "Google Play",
  },
  {
    review: "Please add dark mode! My eyes hurt using this at night.",
    rating: 4,
    date: "2025-01-22",
    source: "App Store",
  },
];

export const MOCK_FEEDBACK_DATASET = {
  fileName: "sample-feedback.csv",
  totalReviews: 106,
  sources: ["App Store", "Google Play"],
  dateRange: "Jan 2025",
  topThemes: [
    "Performance & crashes",
    "Login & authentication",
    "Pricing & subscription",
    "Search & discovery",
    "UI/UX navigation",
  ],
  sentimentSplit: { negative: 58, neutral: 22, positive: 26 },
};

/** Convert mock reviews to CSV-parse-compatible rows */
export function mockReviewsToCsvRows(reviews: MockReview[]): Record<string, string>[] {
  return reviews.map((r) => ({
    review: r.review,
    rating: String(r.rating),
    date: r.date,
    source: r.source,
  }));
}
