# Prince Kumar — Portfolio

Personal portfolio site for Associate Product Manager roles, featuring product case studies and live demos.

## Projects

- **[AI Product Feedback Analyzer](/projects/feedback-analyzer)** — Turn app reviews into ICE-scored product roadmaps

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Customize

Edit your profile in `src/data/profile.ts`:

- Name, title, tagline
- Email, LinkedIn, GitHub links
- About section and skills

Add more projects in `src/data/projects.ts`.

## Structure

```
src/
├── app/
│   ├── page.tsx                          # Portfolio homepage
│   └── projects/feedback-analyzer/       # Live demo
├── components/
│   ├── portfolio/                        # Portfolio sections
│   └── AnalyzerApp.tsx                   # Feedback analyzer
├── data/
│   ├── profile.ts
│   └── projects.ts
└── lib/                                  # Analyzer engine
docs/                                     # PM artifacts (PRD, strategy)
public/
├── sample-feedback.csv
└── docs/PRD.md
```

## Deploy

Deploy to [Vercel](https://vercel.com) for free:

```bash
npx vercel
```

## PM Artifacts

| Document | Path |
|----------|------|
| PRD | [docs/PRD.md](docs/PRD.md) |
| Product strategy | [docs/product-strategy.md](docs/product-strategy.md) |
| User research | [docs/user-research-summary.md](docs/user-research-summary.md) |
