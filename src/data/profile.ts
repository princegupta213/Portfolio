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
    title: "Business Strategy Intern",
    org: "Angel One Ltd. · LAMF pre-deployment",
    period: "Aug 2025 – Feb 2026",
    bullets: [
      "Collaborated with product, marketing, and NBFC partner teams to develop the Business Rule Engine, translating complex lending terms into personalized loan offers for the LAMF MVP.",
      "Prepared comprehensive Go-To-Market (GTM) launch strategies for the MVP, covering commercial pricing logic, marketing cohort targeting, and campaign parameters.",
      "Built a machine learning propensity model to enhance targeted marketing outreach and maximize early user conversions.",
      "Analyzed B2B/B2C onboarding funnels and user journeys with Product and Business teams to locate drop-off points, optimizing the end-to-end customer onboarding flow.",
    ],
  },
  {
    title: "Product & Strategy Intern",
    org: "Indian Oil Corporation Ltd.",
    period: "May 2024 – Jul 2024",
    bullets: [
      "Received a Letter of Recommendation from the General Manager for outstanding performance in product and strategy deliverables (IOCL Net Profit: INR 396B+).",
      "Formulated 15+ premium brand strategies for XP95 high-octane fuel to improve its 6% market penetration, analyzing user preferences and competitive pricing models.",
      "Conceptualized and launched pump-specific QR payment tags integrated into the Indian Oil One app, conducting field research with operators to simplify the checkout flow and reduce manual entry errors by 45%.",
      "Designed IOCL's EV charging station expansion roadmap, analyzing SWOT for 8+ major competitors and formulating tech partnerships to target a 35% market share.",
      "Automated vehicle tracking at fuel pumps using computer vision-based ANPR technology to capture customer metrics, reducing station check-in overhead.",
    ],
  },
];

export const leadership = [
  {
    title: "Admin Head",
    org: "Institute Technical Council, IIT Bombay",
    period: "Apr 2024 – Mar 2025",
    bullets: [
      "Led the administrative body representing 13,000+ students across 13+ technical clubs, securing a budget of INR 15M (60% YoY increase).",
      "Managed the deployment of 18 state-of-the-art labs under the Ministry of Education's Institute of Eminence initiative (Budget: INR 80M).",
      "Conducted a comprehensive audit of INR 20M+ worth of equipment and built a centralized inventory management portal from scratch, streamlining tracking and eliminating discrepancy losses.",
      "Pioneered an INR 20M alumni fund program to incentivize student-led deep tech projects.",
    ],
  },
  {
    title: "Finance Head",
    org: "Inter-IIT Tech Meet 13.0",
    period: "Aug 2024 – Dec 2024",
    bullets: [
      "Supervised a budget of INR 20M+ and led a 3-tier team of 25+ members, securing 100+ sponsorships for the first-ever Pan-IIT Tech Expo while managing high-pressure logistics concurrently with the placement session.",
    ],
  },
  {
    title: "Operations & Logistics Manager",
    org: "Abhyuday, IIT Bombay",
    period: "May 2023 – Apr 2024",
    bullets: [
      "Felicitated with the Institute Organizational Special Mention award (given to top 1% of student leaders) by the Dean of Student Affairs, IIT Bombay.",
      "Successfully organized the first-ever student-led TEDxIITBombay (5,000+ audience) from scratch in just 3 weeks after resolving critical administrative blocks.",
      "Managed Abhyuday's operations budget of INR 7M, implementing structural resource optimizations that achieved a 22% y-o-y cost reduction.",
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
