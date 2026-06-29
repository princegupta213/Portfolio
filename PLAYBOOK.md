# Step-by-Step Playbook
## Get your APM portfolio hire-ready

Work through these steps in order. Check each box when done.

---

## Step 1 — Personalize your profile (15 min)

**File:** `src/data/profile.ts`

Replace these placeholders with your real info:

- [ ] `email` — your real email
- [ ] `linkedin` — full LinkedIn URL
- [ ] `github` — your GitHub profile
- [ ] `resumeUrl` — link to PDF (Google Drive, Notion, or `/resume.pdf` in `public/`)
- [ ] `about.paragraphs` — add your real background (college, internships, projects)
- [ ] `experience` — add jobs, internships, or relevant activities

**How to test:** Run `npm run dev` → open http://localhost:3000 → check Contact section links work.

---

## Step 2 — Run the live demo yourself (5 min)

1. Open http://localhost:3000
2. Click **Live demo** on the Feedback Analyzer project
3. Click **"Or analyze sample app reviews"**
4. Wait for the dashboard (charts + roadmap table)
5. Click **Export report** — confirm a `.md` file downloads

- [ ] Dashboard loads with themes and ICE scores
- [ ] Export works

---

## Step 3 — Read your case study page (10 min)

Open: http://localhost:3000/projects/feedback-analyzer/case-study

This is what recruiters see when they want depth. Update `src/data/case-studies/feedback-analyzer.ts` with:
- [ ] Your real findings after running the demo
- [ ] Any user quotes from your research
- [ ] What you'd build in v2 (personal opinion)

---

## Step 4 — Take screenshots (10 min)

1. Run sample analysis in the browser
2. Screenshot the dashboard (roadmap table visible)
3. Save as `public/projects/feedback-analyzer-dashboard.png`
4. Uncomment the image in the case study page (instructions in file)

- [ ] Screenshot saved
- [ ] Visible on case study page

---

## Step 5 — Deploy to Vercel (20 min)

### Option A — From terminal

```bash
cd /Users/princekumar/Portfolio
npx vercel
```

Follow prompts:
- Link to your GitHub account (recommended)
- Project name: `portfolio` or `prince-kumar-pm`
- Deploy

You'll get a URL like: `https://portfolio-xxx.vercel.app`

### Option B — From vercel.com

1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repo
4. Click Deploy (no config changes needed)

- [ ] Live URL works
- [ ] `/projects/feedback-analyzer` works on live site
- [ ] Added URL to LinkedIn headline / About section

---

## Step 6 — Record a 2-min Loom (15 min)

**Script:**

1. (0:00) "Hi, I'm Prince — aspiring APM. This is my portfolio."
2. (0:15) Scroll homepage — 10 sec on About + Projects
3. (0:30) Click Live demo → load sample reviews
4. (1:00) Walk through dashboard: themes, sentiment, P0 roadmap
5. (1:30) Click Export report
6. (1:45) "Built end-to-end: PRD, user research, MVP. Open to APM roles."
7. (2:00) End

- [ ] Loom recorded
- [ ] Link added to LinkedIn + portfolio (optional: add to `profile.ts` as `demoVideoUrl`)

---

## Step 7 — Add to resume & LinkedIn (30 min)

**Resume — one bullet:**
> Built AI Product Feedback Analyzer — a PM workflow tool that clusters 100+ app reviews by theme and outputs an ICE-scored roadmap; includes PRD, user research, and live demo.

**LinkedIn — Featured section:**
- Add project link (your Vercel URL)
- Add Loom link when ready

- [ ] Resume updated
- [ ] LinkedIn Featured updated
- [ ] GitHub repo public with README

---

## Step 8 — Run on real data (optional, 1 hour)

1. Pick an app with public reviews (App Store, Google Play, G2)
2. Export or copy 50–100 reviews into a CSV:

```csv
review,rating,date,source
"Your review text here",4,2025-01-01,App Store
```

3. Upload in your tool
4. Write 3 paragraphs in the case study: what you found, top P0, why

- [ ] Real-data CSV created
- [ ] Findings added to case study

---

## Step 9 — Practice your interview story (30 min)

Prepare answers for:

| Question | Your answer lives in… |
|----------|----------------------|
| Tell me about a product you built | Case study page |
| How did you prioritize? | ICE section in case study |
| Who is the user? | `docs/user-research-summary.md` |
| What would you improve? | Case study "What's next" |
| What metrics would you track? | `docs/PRD.md` §2 |

- [ ] Practiced out loud once
- [ ] Can explain in under 3 minutes

---

## Step 10 — Apply (ongoing)

Target: 5–10 APM / APM intern applications per week.

Each application:
- [ ] Customized resume bullet if needed
- [ ] Portfolio link in cover letter
- [ ] LinkedIn connection + short note to recruiter

---

## Quick reference

| What | URL (local) |
|------|-------------|
| Portfolio | http://localhost:3000 |
| Live demo | http://localhost:3000/projects/feedback-analyzer |
| Case study | http://localhost:3000/projects/feedback-analyzer/case-study |
| PRD | http://localhost:3000/docs/PRD.md |

| File to edit | Purpose |
|--------------|---------|
| `src/data/profile.ts` | Your name, links, about, experience |
| `src/data/case-studies/feedback-analyzer.ts` | Case study content |
| `src/data/projects.ts` | Project cards on homepage |

---

## Need help?

Switch to **Agent mode** in Cursor and say:
- "Help me deploy to Vercel"
- "Add my experience to profile.ts" (paste your resume)
- "Add the negative-only filter feature"
