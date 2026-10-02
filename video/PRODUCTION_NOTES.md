# Portfolio Reel: Production Notes

**Final cut:** `aditya_portfolio_reel_1080p.mp4` · 2:30 · 1920×1080 · 30 fps · H.264 + AAC 320 kbps · −15 LUFS

A personal-brand showreel built only from real material: screen captures of the portfolio (this repository, built locally), the DemandIQ Streamlit dashboard running locally from its public repo, real code from public repos, and facts from the October 2026 resume and the portfolio content files.

---

## 1. Sources and what was reachable

| Source | Status | How it was used |
| --- | --- | --- |
| `aditbytes/portfolio` (this repo) | Cloned, built (`npm run build`), served locally | All portfolio screen captures. Same code as the deployment. |
| Live portfolio `portfolio-one-hazel-4qr78e531q.vercel.app` | **Blocked** by the session's network policy | Captures come from the local build of this repo instead. The browser frame shows the public URL because the content is identical. |
| Resume (`resume_oct_1.pdf`) | Read, including its embedded links | Source of truth for roles, dates, skills and metrics |
| Public repos `Demand_IQ`, `Data_scout`, `Indieye-ml`, `Indieye-news-sentiment`, `sanjivani-ai`, `CNN_candleStick` | Cloned | Real code excerpts; DemandIQ dashboard run locally |
| Live demos in the resume: `market-regime-quant.kraditya9241.workers.dev`, `india-market-monitor.pages.dev`, `demandiq-aditya.streamlit.app` | **Blocked** | Not used. Swap them in when access is available (see §7). |
| YouTube style reference `ZK-rNEhJIDs` | **Blocked** (search found nothing for the ID) | Not studied. The visual language follows the written brief. |
| LinkedIn | **Blocked** | URL taken from the brief and confirmed in the resume PDF's link annotation |

### Conflicts found between sources

| Item | Portfolio repo | Resume (Oct 2026) | Brief | Used |
| --- | --- | --- | --- | --- |
| LinkedIn | `linkedin.com/in/aditya-405437360` (`src/content/site.ts`) | `linkedin.com/in/sinhaaditya5` | `linkedin.com/in/sinhaaditya5` | **sinhaaditya5**. The portfolio still points to the old profile, so update `site.ts`. |
| GitHub | `github.com/aditbytes` (profile) | `github.com/aditbytes` (profile) | `github.com/aditbytes/portfolio` (repo) | The brief's exact URL, as instructed. The profile URL may suit an end card better. |
| Resume file on the site | `public/assets/resume/Aditya_Resume.pdf` is the **April** resume (old LinkedIn, `github.com/sinhaaditya9241`, `adiresume.netlify.app`) | October resume | n/a | Consider replacing the PDF on the site |
| IndiEye role | "Founder · open research startup" | "Open Source" (no founder title) | n/a | Avoided the founder claim; "Open source" only |

No conflicts in education, dates, metrics or certifications.

---

## 2. Projects featured and why

| # | Project | Why it was selected | Evidence shown |
| --- | --- | --- | --- |
| 01 | **INDRA**: Intelligent National Disaster & Weather Platform | Deepest systems work, current (Sep 2026 → present), strongest verifiable numbers | Portfolio card capture (receipt from the recorded demo, map illustrative), pipeline from the case study, 691 commits / 1,788 tests / 16 hazard types / 7-factor receipt |
| 02 | **Market Regime Detection Framework** | Core quant project, IEEE-format paper, clear model story, the only backtest numbers in the sources | Case-study capture (chart is labelled "illustrative data" on the site), HMM + K-Means → XGBoost diagram, 78% accuracy, CAGR 14.2% vs 10.8%, max drawdown 18% vs 50% |
| 03 | **DemandIQ**: retail demand forecasting | The only project whose **real UI could be run and recorded**; clean ML-to-decision story | Live Streamlit dashboard (demo-mode sample data), `inventory/safety_stock.py` lines 43–62, 6-layer pipeline |
| 04 | **IndiEye**: market intelligence platform | Open-source, LLM + quant, real FastAPI service code | Portfolio card (interface concept, illustrative), `training/train_regime.py` walk-forward CV, 5 real `/api/ml/*` endpoints |
| + | DataScout · Sanjivani AI · LLM Pruning & Explainability · CNN Candlestick Recognizer | Breadth: agents, multimodal ML, interpretability research, deep learning | Frozen frames of their portfolio cards plus one verified line each |

Not featured: **Agentic AI Core** (spec only, "in design") and the terminal/landing-page web builds (less relevant to AI/ML/quant).

---

## 3. Storyboard / timeline

Music is 96 BPM, so one bar is 2.5 s; every section boundary lands on a bar line.

| Time | Scene | Screen capture | Motion graphics / text | Transition | Audio |
| --- | --- | --- | --- | --- | --- |
| 0:00–0:05 | **Open** | Portfolio loads in a light browser frame (hero entrance animations) | A hairline draws across the paper; the frame rises; slow push-in toward the headline | n/a | Intro pad, rising air swell |
| 0:05–0:10 | **Name** | Hero keeps playing, frame glides right | `ADITYA●` mask reveal; 01 AI/ML Engineer · 02 Quant Researcher · 03 Data/Systems Builder; B.S. CSDA · IIT Patna · 2025–2029 | Frame resizes | Low thump + shimmer on the name, ticks per role |
| 0:10–0:17.5 | **Signal** | Scroll to "I like turning messy data into systems." (live scramble animation) | Zoom into headline, lime callout, quote card: "The model is one step… is the work." | Crossfade + push | Whoosh in, arpeggio starts |
| 0:17.5–0:25 | **What I work on** | n/a (pure type) | AI / ML · Quantitative Research · Data Systems · Cloud Infrastructure, each with its portfolio note; lime marker steps through them; "Learning now → MLOps & inference" | Crossfade | Ticks per row, marker swipes |
| 0:25–0:32.5 | **About** | About section scroll; camera pushes into "I build at the intersection of machine learning, data, markets and production systems." | Facts column: IIT Patna, NISM Series VIII, Patna and internship focus | Crossfade | Whoosh |
| 0:32.5–0:45 | **Toolchain** | n/a | "Data → Signal → Model → Decision"; Python root node with curves drawing to 5 lanes (ML & AI, Quant research, Backend & data, Cloud, Web & MLOps), then the site's system map: Data → Signal → Model → Evaluation → Deployment → Feedback | Graph steps back for the strip | Half-time kick enters |
| 0:45–0:47.5 | **Selected work** | n/a | SELECTED / WORK (outline), project index 01–04 | Hard reveal | Big whoosh + thump, groove starts |
| 0:47.5–1:05 | **01 INDRA** | Portfolio INDRA card → animated verification visual | Spec rail (title, context, stack chips). Camera zooms into the DBSCAN + H3 cluster, then pans to the 7-factor receipt (callouts). Pipeline in 8 steps; CORROBORATED / CONTRADICTED / UNCONFIRMED; "byte-identical receipt". Counters: 691 · 1,788 · 16 · 7 | Stage card expands; sub-stages crossfade | Ticks on callouts and counters |
| 1:05–1:25 | **02 Market Regime Detection** | Case-study page loads → illustrative regime chart draws | Zoom on regime timeline; NIFTY 50 → HMM + K-Means (P(sₜ \| sₜ₋₁) · P(xₜ \| sₜ)) → XGBoost → Low-vol / Trending / Crisis → strategy. Results: 78% counter, CAGR bars 14.2 vs 10.8, drawdown bars 18 vs 50, "Exited before the 2020 COVID crash." Footnote: as reported, historical | Previous project collapses left; next expands | Thump on results |
| 1:25–1:41 | **03 DemandIQ** | Real Streamlit dashboard: cursor → *SKU Analysis* (click) → forecast chart hover → *Order N Units* button | Camera follows the cursor; "14-day forecast" callout; then `safety_stock.py` with line 60 highlighted → `SS = Z × σ × √L`; 6-layer pipeline | Collapse / expand | Click SFX synced to the recorded click |
| 1:41–1:52.5 | **04 IndiEye** | Portfolio IndiEye card → interface concept visual | `train_regime.py` walk-forward CV (lines 65 and 78 highlighted); 5 GET endpoints from `Indieye-ml` | Collapse / expand | Swipes on highlights |
| 1:52.5–2:00 | **Also built** | Frozen frames of the DataScout, Sanjivani AI and LLM Pruning cards | 2×2 cards + CNN Candlestick flow (OHLC → 64×64 image → 2D CNN → pattern) | Staggered card entrance | Ticks |
| 2:00–2:10 | **Experience** | "Where I've built" timeline scroll | Synced list: SIH 2026 (INDRA) → AI for Bharat → WorldQuant BRAIN → IIT Patna; active item lights up | Crossfade | Breakdown: drums drop out |
| 2:10–2:17.5 | **whoami** | Command palette (Ctrl+K) → typing `whoami` → identity output | Camera zooms into the terminal output | Frame steps back | Keystrokes synced to the capture |
| 2:17.5–2:30 | **End** | n/a | "Explore the work." → `ADITYA●` + identity; Portfolio / GitHub / LinkedIn / Email (exact URLs); clean hold for ~5 s | Lift + fade | Resolve chord, bells, fade out |

Persistent HUD (0:05–2:17): `ADITYA●` top-left, section label top-right, progress hairline at the bottom.

---

## 4. Visual language

- **Canvas:** off-white paper `#F4F3EF` with a 64 px grid and faint 256 px major grid; the grid drifts slowly.
- **Ink:** charcoal `#111214`; muted greys for secondary text.
- **Accent:** the portfolio's own lime `#B7FF00`, used only as highlighter, callouts, status dots and "active" states. A warm orange appears once, for crisis/contradicted.
- **Type:** the portfolio's typefaces: Space Grotesk (display), Inter (body), JetBrains Mono (labels, code, URLs).
- **Captures:** the dark site sits inside light browser frames with layered soft shadows, so the dark/light contrast frames the work. Camera moves (push, pan, zoom-to-region) are done in post on 1080p captures.
- **Motion:** two curves only: `cubic-bezier(.16,1,.3,1)` for entrances (the site's own ease-out) and `cubic-bezier(.65,0,.35,1)` for camera/transitions. Mask reveals, line draws, marker sweeps, count-ups (real numbers only).

---

## 5. Assets used

### Screen captures (real UI, captured headless at 1920×1080, 30 fps CFR)

| Clip | What | Length |
| --- | --- | --- |
| `hero` | Portfolio loading → hero entrance, cursor drift | 9.6 s |
| `signal` | Scroll to the Signal section ("messy data" scramble), then to keywords | 14.2 s |
| `about` | About section | 7.1 s |
| `stack` | Toolchain grid (captured, not used in the cut) | 8.3 s |
| `work_indra` | Selected Work heading → INDRA card → verification visual | 15.3 s |
| `regime` | `/work/market-regime-detection` load → regime chart | 10.4 s |
| `indieye` | IndiEye card → interface concept | 10.4 s |
| `more` | DataScout → Sanjivani AI → Agentic AI Core → LLM Pruning cards | 12.6 s |
| `experience` | Experience timeline | 9.0 s |
| `palette` | Ctrl+K → `whoami` | 6.1 s |
| `diq` | DemandIQ Streamlit dashboard (local run, demo mode): Dashboard → SKU Analysis → chart hover → Order button | 10.3 s |

Capture method: Chromium via CDP screencast with the page's CSS animations and JS clock slowed to 0.25× and re-timed to 30 fps, which gives smooth captures at roughly 60–100 effective fps. No UI was mocked up or recreated; all project UI in the cut is the real site or app.

### Code excerpts (verbatim, real line numbers)

- `aditbytes/Demand_IQ` · `inventory/safety_stock.py` · lines 43 (truncated), 53–62
- `aditbytes/Indieye-ml` · `training/train_regime.py` · lines 65–69, 78–83

### Audio (original, synthesised for this reel)

- `audio/music.py`: 96 BPM minimal electronic score (Dm9 · Bbmaj7 · Fmaj7/A · C/G), pads, pluck arpeggio with ping-pong delay, soft kick/hats/bass in the project section, breakdown under Experience, bell resolve at the end.
- `audio/sfx.py`: UI ticks, whooshes, low thumps, marker swipes, keystrokes and the dashboard click, placed on the measured event times.
- Master: −15 LUFS integrated, true peak −1.5 dBFS (measured on the final AAC). No stock or third-party audio.

---

## 6. Claim verification (every on-screen fact)

| On-screen claim | Source |
| --- | --- |
| AI/ML Engineer · Quant Researcher · Data/Systems Builder | `src/content/site.ts` → `identity` |
| B.S. CSDA · IIT Patna · 2025–2029 | Resume; `site.ts` education |
| NISM Series VIII, Equity Derivatives | Resume; `site.ts` certifications |
| Seeking AI/ML, data science, quant research and backend internships | Resume summary |
| "The model is one step…is the work." | `src/sections/Signal.tsx` |
| Keyword notes (AI / ML … Cloud Infrastructure) | `src/content/profile.ts` → `signalKeywords` |
| Toolchain items | Resume skills section |
| Data → Signal → Model → Decision / system map | `src/sections/Hero.tsx`; `profile.ts` → `systemNodes` |
| INDRA pipeline, verdicts, deterministic receipt | `src/content/projects.ts` → INDRA case study |
| 691 commits, 1,788 tests, 16 hazard types, 7 factors | Resume; INDRA case study (README run of 27 Sep 2026) |
| Regime pipeline, 3 regimes → strategies, 28 features | Resume; regime case study |
| 78% accuracy · 14.2% vs 10.8% CAGR · 50% → 18% max DD · exited before 2020 COVID crash | Resume (backtest, labelled "as reported · historical, not a forecast") |
| DemandIQ 6 layers, 7/14/28 lags, 95% service level, Telegram, Walmart M5, Capstone-I, led model training | Resume; DemandIQ case study |
| IndiEye news + X/Reddit + SEC filings, fine-tuned Llama 3 | Resume |
| `/api/ml/*` endpoints | `Indieye-ml/README.md` and `api/routes/*` |
| "Walk-forward validation: every fold trains on the past and tests on the future" | `Indieye-ml/training/utils.py` → `walk_forward_split` (expanding window) |
| DataScout on Bedrock, team lead of 4 | Resume |
| Sanjivani 34/34 tests; DistilBERT / U-Net / YOLOv8 | Resume |
| Faithfulness holds to 80% sparsity under magnitude pruning | Resume |
| CNN Candlestick pipeline | `profile.ts` → `moreBuilds` |
| Experience entries and dates | Resume |
| Links | Brief (exact URLs) + resume email |

Labels kept honest on screen: the INDRA map, regime chart and IndiEye visual are marked illustrative (as on the site); DemandIQ is marked demo-mode sample data.

---

## 7. Quality control

| Check | Result |
| --- | --- |
| Duration 2–3 min | 2:30.0 (4,500 frames @ 30 fps) |
| Resolution / fps | 1920×1080, 30 fps, yuv420p, H.264 High |
| Every claim sourced | Yes (§6) |
| Project names / technologies | Match `projects.ts` and the resume |
| URLs exact | Portfolio, GitHub and LinkedIn as given in the brief |
| Fake metrics | None; count-ups only on sourced numbers |
| Smallest on-screen text | ≥ 13 px mono labels (source footnotes); body ≥ 19 px; headings 28–250 px |
| Light background throughout | Yes; dark only inside captured browser frames |
| Audio | −15 LUFS integrated, −1.5 dBTP after AAC, no clipping. Synthesised and checked by measurement only, not by ear, so give it a listen. |
| Spelling | Checked against source strings |

### Known limitations / next steps

1. **Live demos not captured.** The Market Regime app, India Market Monitor and the hosted DemandIQ were unreachable from the build environment. To add them, allow the hosts and re-run `capture/` with a new shot script, then swap the `regime` / `indieye` clips. The composition already has the stage slots.
2. **Reference video not studied** (YouTube blocked).
3. Captures are of a local build of `main`. If the Vercel deployment differs from `main`, re-capture against the live URL.

---

## 8. Thumbnail

`thumbnail.jpg` (1920×1080) and `thumbnail_1280.jpg` (1280×720) are frame 0:08.7 of the reel: `ADITYA●` with the three roles beside the live hero in a browser frame. It reads at small sizes: big name, lime dot, real product UI.

Alternatives: 1:22 (Market Regime results: 78% + bars) for a quant-focused upload, or 1:02 (INDRA counters) for a systems/backend audience.

---

## 9. Captions

### LinkedIn

> I put my work into a 2½-minute reel.
>
> It covers what I build at the intersection of machine learning, data, markets and production systems:
>
> ▸ **INDRA** (Smart India Hackathon 2026): the core backend for a weather-event verification platform. Streaming intake on Redpanda, DBSCAN + H3 clustering on PostGIS, and a deterministic 7-factor verification receipt. 691 commits, 1,788 tests passing.
> ▸ **Market Regime Detection**: hybrid HMM + K-Means regimes on 15 years of NIFTY 50, with XGBoost predicting the regime (78% accuracy). In backtest, regime-driven allocation delivered 14.2% CAGR vs 10.8% buy-and-hold, with max drawdown cut from 50% to 18%.
> ▸ **DemandIQ**: SKU-level demand forecasting (Prophet + XGBoost) that ends in a reorder quantity and a risk alert, not just a chart.
> ▸ **IndiEye**: open-source market intelligence with a fine-tuned Llama 3 and a FastAPI ML service.
>
> Everything in the video is real: screen captures of my portfolio and dashboards, code from my repositories, and numbers from my write-ups.
>
> I'm a CS & Data Analytics undergrad at IIT Patna, looking for AI/ML, data science, quant research and backend internships.
>
> Portfolio → https://portfolio-one-hazel-4qr78e531q.vercel.app/
> GitHub → https://github.com/aditbytes/portfolio
>
> #MachineLearning #QuantitativeFinance #DataEngineering #SoftwareEngineering #IITPatna

### YouTube

**Title:** Aditya | AI/ML, Quant Research & Data Systems: Portfolio Reel (2026)

**Description:**

> A 2½-minute tour of my engineering portfolio: what I build, how I think about systems, and four projects in detail.
>
> 0:00 Intro
> 0:10 What I work on
> 0:32 Toolchain
> 0:45 INDRA: weather-event verification platform (SIH 2026)
> 1:05 Market Regime Detection: HMM + K-Means + XGBoost on NIFTY 50
> 1:25 DemandIQ: demand forecasting & replenishment
> 1:41 IndiEye: market intelligence platform
> 1:52 Also built
> 2:00 Experience
> 2:17 Contact
>
> All footage is real: screen captures of my portfolio and project dashboards, and code from my public repositories. Backtest figures are as reported in the project write-up; historical, not a forecast. Visuals labelled "illustrative" on the portfolio are shown as such.
>
> Portfolio: https://portfolio-one-hazel-4qr78e531q.vercel.app/
> GitHub: https://github.com/aditbytes/portfolio
> LinkedIn: https://www.linkedin.com/in/sinhaaditya5
>
> Music and sound design: original, made for this video.
