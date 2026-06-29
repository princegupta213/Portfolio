const POSITIVE_WORDS = new Set([
  "love", "great", "awesome", "amazing", "excellent", "fantastic", "perfect",
  "best", "good", "nice", "helpful", "easy", "smooth", "fast", "recommend",
  "wonderful", "brilliant", "impressed", "satisfied", "happy", "enjoy",
  "intuitive", "clean", "beautiful", "useful", "works well", "life saver",
  "thank", "thanks", "five stars", "5 stars",
]);

const NEGATIVE_WORDS = new Set([
  "hate", "terrible", "awful", "worst", "bad", "horrible", "useless",
  "broken", "crash", "crashes", "slow", "lag", "bug", "bugs", "frustrating",
  "annoying", "disappointed", "disappointing", "waste", "refund", "cancel",
  "uninstall", "delete", "never again", "doesn't work", "does not work",
  "not working", "failed", "failure", "poor", "confusing", "difficult",
  "hard", "expensive", "overpriced", "scam", "spam", "unresponsive",
]);

export type SentimentLabel = "positive" | "negative" | "neutral";

export function analyzeSentiment(text: string): SentimentLabel {
  const lower = text.toLowerCase();
  let positiveScore = 0;
  let negativeScore = 0;

  for (const word of POSITIVE_WORDS) {
    if (lower.includes(word)) positiveScore++;
  }
  for (const word of NEGATIVE_WORDS) {
    if (lower.includes(word)) negativeScore++;
  }

  if (ratingSentiment(text)) {
    const rating = extractRating(text);
    if (rating !== null) {
      if (rating >= 4) positiveScore += 2;
      else if (rating <= 2) negativeScore += 2;
    }
  }

  if (negativeScore > positiveScore) return "negative";
  if (positiveScore > negativeScore) return "positive";
  return "neutral";
}

function ratingSentiment(text: string): boolean {
  return /\b[1-5]\s*(?:\/\s*5|stars?)?\b/i.test(text) || /★/.test(text);
}

function extractRating(text: string): number | null {
  const starMatch = text.match(/★/g);
  if (starMatch) return starMatch.length;

  const numMatch = text.match(/\b([1-5])\s*(?:\/\s*5|stars?)?\b/i);
  if (numMatch) return parseInt(numMatch[1], 10);

  return null;
}

export function sentimentBreakdown(
  labels: SentimentLabel[]
): { positive: number; negative: number; neutral: number } {
  return labels.reduce(
    (acc, label) => {
      acc[label]++;
      return acc;
    },
    { positive: 0, negative: 0, neutral: 0 }
  );
}
