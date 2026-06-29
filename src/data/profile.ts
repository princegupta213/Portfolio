export const profile = {
  name: "Prince Kumar",
  title: "Aspiring Associate Product Manager",
  tagline:
    "IIT Bombay · Chemical Engineering. Product & strategy across fintech and energy — plus hands-on building with AI tools.",
  location: "Mumbai, India",
  email: "princegupta.iitb@gmail.com",
  phone: "+91 6203261916",
  linkedin: "https://www.linkedin.com/in/prince-kumar-943b281bb/",
  github: "https://github.com/princegupta213",
  resumeUrl: "https://tinyurl.com/pchr4tjx",
  demoVideoUrl: "",
};

export const about = {
  paragraphs: [
    "I'm a B.Tech Chemical Engineering student at IIT Bombay (CPI 7.64) pursuing APM roles. I've interned at Angel One on the LAMF pre-launch team and at Indian Oil in product & strategy — plus led large-scale initiatives across IIT Bombay.",
    "I like working where product, business, and data meet: translating policy into product logic, shaping GTM, and turning user feedback into prioritized roadmaps.",
    "Outside internships, I've managed INR 35M+ in budgets as Admin Head of the Institute Technical Council and built portfolio projects here — from feedback analysis to PromptRoute, a multi-LLM cost router for platform PM interviews.",
  ],
  highlights: [
    { label: "Education", value: "IIT Bombay · B.Tech '25" },
    { label: "Internships", value: "Angel One · Indian Oil" },
    { label: "Leadership", value: "INR 35M+ budgets · 13K+ students" },
  ],
};

export interface ExperienceEntry {
  title: string;
  org: string;
  period: string;
  bullets: string[];
}

export const experience: ExperienceEntry[] = [
  {
    title: "Product & Business Operations Intern",
    org: "Angel One Ltd. · LAMF pre-deployment",
    period: "Aug 2025 – Present",
    bullets: [
      "Built the Business Rule Engine — translated NBFC lending policies into structured product logic for the LAMF MVP.",
      "Designed B2B GTM with Marketing (positioning, segmentation, launch) and built a propensity model for campaign targeting.",
      "Analyzed B2B/B2C funnels and worked with Product to prioritize onboarding improvements.",
    ],
  },
  {
    title: "Product & Strategy Intern",
    org: "Indian Oil Corporation Ltd.",
    period: "May 2024 – Jul 2024",
    bullets: [
      "Letter of Recommendation · XP95 brand strategy & Indian Oil One app impact model; EV market strategy projecting 25% growth.",
      "Automated customer ID via ANPR (Computer Vision), cutting manual errors by 45%.",
    ],
  },
];

export const leadership = [
  {
    title: "Admin Head",
    org: "Institute Technical Council, IIT Bombay",
    period: "Apr 2024 – Mar 2025",
    bullets: [
      "Led council for 13,000+ students across 13+ clubs; INR 15M budget (60% YoY). Setup of 18 MoE labs (INR 80M).",
      "Audited INR 50M+ inventory; pioneered INR 20M alumni fund; digitalized inventory dashboards.",
    ],
  },
  {
    title: "Finance Head",
    org: "Inter-IIT Tech Meet 13.0",
    period: "Aug 2024 – Dec 2024",
    bullets: [
      "25+ member team, 2,000+ participants, INR 20M+ budget; secured 100+ sponsorships for Pan IIT Tech Expo.",
    ],
  },
  {
    title: "Operations & Logistics Manager",
    org: "Abhyuday, IIT Bombay",
    period: "May 2023 – Apr 2024",
    bullets: [
      "Institute Special Mention (top 1%); 1,000+ volunteers, INR 7M budget (22% cost cut), TEDxIITBombay (5,000+ audience).",
    ],
  },
];

export const education = [
  {
    degree: "B.Tech, Chemical Engineering",
    school: "Indian Institute of Technology Bombay",
    period: "2021 – 2025",
    detail: "CPI: 7.64",
  },
];

export const achievements = [
  "1st place — InstiApp ProdCom deck competition ('23)",
  "1st place — Product Management GC, hostel communication app ('22)",
  "Strategic Consulting — OneDay@BCG ('22)",
  "Asset Management Job Simulation — J.P. Morgan ('23)",
  "Guinness World Record — yoga gathering ('18)",
];

export const skills = {
  product: [
    "Product strategy & GTM planning",
    "Business logic → product rules",
    "Funnel analysis & prioritization",
    "User research & market sizing",
    "Stakeholder alignment",
    "PRD writing & ICE/RICE frameworks",
    "Platform PM & infra trade-offs",
  ],
  technical: [
    "Python & SQL",
    "Propensity / rule engine modeling",
    "Next.js / React",
    "Data visualization",
    "Computer vision (ANPR)",
    "AI product prototyping",
    "LLM routing & cost optimization",
    "Platform infra trade-offs (cost / latency / accuracy)",
  ],
};
