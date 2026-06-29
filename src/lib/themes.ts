export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  keywords: string[];
}

export const THEME_DEFINITIONS: ThemeDefinition[] = [
  {
    id: "performance",
    name: "Performance & Stability",
    description: "Crashes, lag, loading times, and reliability issues",
    keywords: [
      "crash", "crashes", "crashing", "slow", "lag", "laggy", "freeze",
      "freezes", "bug", "bugs", "glitch", "glitches", "broken", "error",
      "errors", "loading", "load", "stuck", "unresponsive", "force close",
      "memory", "battery", "drain",
    ],
  },
  {
    id: "ui-ux",
    name: "UI/UX & Design",
    description: "Navigation, layout, readability, and visual design",
    keywords: [
      "ui", "ux", "design", "layout", "confusing", "cluttered", "hard to find",
      "navigation", "navigate", "intuitive", "ugly", "beautiful", "clean",
      "dark mode", "font", "color", "interface", "user friendly", "unfriendly",
      "screens", "menu", "button", "buttons",
    ],
  },
  {
    id: "auth",
    name: "Login & Authentication",
    description: "Sign-in, sign-up, password reset, and account access",
    keywords: [
      "login", "log in", "sign in", "signin", "sign up", "signup", "password",
      "authentication", "auth", "verify", "verification", "otp", "2fa",
      "account access", "locked out", "reset password", "forgot password",
      "google sign", "apple sign", "sso",
    ],
  },
  {
    id: "notifications",
    name: "Notifications",
    description: "Push alerts, email notifications, and notification settings",
    keywords: [
      "notification", "notifications", "notify", "alert", "alerts", "push",
      "reminder", "reminders", "spam", "too many", "mute", "silent", "badge",
    ],
  },
  {
    id: "search",
    name: "Search & Discovery",
    description: "Finding content, filters, and search relevance",
    keywords: [
      "search", "find", "filter", "filters", "discover", "discovery", "browse",
      "results", "relevant", "sort", "sorting", "category", "categories",
      "can't find", "cannot find", "hard to find",
    ],
  },
  {
    id: "pricing",
    name: "Pricing & Subscription",
    description: "Plans, billing, refunds, and value for money",
    keywords: [
      "price", "pricing", "expensive", "cheap", "subscription", "subscribe",
      "premium", "pay", "payment", "billing", "refund", "cancel", "free trial",
      "upgrade", "plan", "plans", "cost", "money", "worth", "value",
    ],
  },
  {
    id: "support",
    name: "Customer Support",
    description: "Help center, response times, and support quality",
    keywords: [
      "support", "customer service", "help", "contact", "response", "ticket",
      "chat", "email support", "no response", "unhelpful", "resolved",
      "agent", "faq", "documentation",
    ],
  },
  {
    id: "features",
    name: "Missing Features",
    description: "Feature requests and capability gaps",
    keywords: [
      "feature", "features", "wish", "would love", "please add", "need",
      "missing", "lack", "doesn't have", "does not have", "should have",
      "request", "add option", "integrate", "integration", "export", "import",
      "share", "sync", "offline", "widget", "api",
    ],
  },
  {
    id: "onboarding",
    name: "Onboarding & Setup",
    description: "First-run experience, tutorials, and getting started",
    keywords: [
      "onboarding", "tutorial", "setup", "getting started", "first time",
      "new user", "guide", "walkthrough", "instructions", "learn", "confusing start",
    ],
  },
  {
    id: "sync",
    name: "Sync & Data",
    description: "Cross-device sync, data loss, and backup",
    keywords: [
      "sync", "syncing", "backup", "data loss", "lost data", "cloud",
      "cross device", "device", "restore", "save", "saved", "deleted",
    ],
  },
];
