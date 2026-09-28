# Aditya Portfolio

Personal engineering portfolio of **Aditya**: AI/ML engineer, quant researcher and data/systems builder. B.S. Computer Science & Data Analytics, IIT Patna (2025–2029).

It's a statically prerendered React site served from **Cloudflare Workers Static Assets**. The only server-side code is a small Worker route that proxies and edge-caches GitHub repository stats.

- Lighthouse (local build on the Workers runtime): **mobile 92 / 100 / 100 / 100**, **desktop 100 / 100 / 100 / 100** (performance / accessibility / best practices / SEO)
- JS on first load: ~92 KB gzipped. Fonts: 3 self-hosted Latin variable files. Portraits: AVIF/WebP, 4–33 KB each.

---

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| UI | React 19 + TypeScript | Component model for the visuals; nothing heavier needed |
| Build | Vite 8 + a build-time prerender (`scripts/prerender.mjs`) | Real HTML for first paint and crawlers, then the page hydrates |
| Styling | Hand-written CSS with design tokens (`src/styles/tokens.css`) | Full control over the look; no utility-class noise |
| Motion | CSS transitions + IntersectionObserver + one 2D canvas | No animation library; respects `prefers-reduced-motion` |
| Routing | ~60-line history router (`src/lib/router.tsx`) | Only two route shapes: `/` and `/work/:slug` |
| Fonts | Space Grotesk · Inter · JetBrains Mono (self-hosted, Latin) | No third-party font requests; CSP stays strict |
| Hosting | Cloudflare Workers + Static Assets (`wrangler.jsonc`) | Static files at the edge, plus one tiny API route |
| Icons | Inline SVG | No icon dependency |

Runtime dependencies: `react`, `react-dom` and three `@fontsource-variable/*` font packages. That's all.

## Local Development

Requires Node 20+.

```bash
npm install
npm run dev          # Vite dev server → http://localhost:5173
```

The GitHub section calls `/api/github` (the Worker). The plain Vite dev server has no Worker, so the site falls back to the public GitHub API, and then to a built-in snapshot. It never breaks.

To run the **real production setup locally** (Worker + static assets, same as Cloudflare):

```bash
npm run cf:dev       # builds, then `wrangler dev` → http://localhost:8787
```

Useful checks:

```bash
npm run typecheck    # app, build scripts and Worker
```

## Build

```bash
npm run build
```

This runs, in order:

1. `tsc -b`: type-checks the app, the Vite config and the Worker.
2. `vite build`: client bundle into `dist/`.
3. `vite build --ssr src/entry-server.tsx`: a temporary server bundle.
4. `node scripts/prerender.mjs`: renders `/` → `dist/index.html` and each `/work/<slug>` → `dist/work/<slug>.html` (each with its own title and description), then deletes the temporary bundle.

`dist/` is what gets deployed.

## Cloudflare Deployment

This project uses **Workers Static Assets** (config in `wrangler.jsonc`):

- `assets.directory: ./dist`: the built site.
- `not_found_handling: single-page-application`: unknown paths get `index.html`, and the client renders the 404 page.
- `run_worker_first: ["/api/*"]`: only API calls run Worker code. Every other request is served directly from the asset store.
- `public/_headers`: security headers (strict CSP, `X-Frame-Options`, etc.) and long-lived caching for fingerprinted assets.

### Option A: deploy from your machine

```bash
npx wrangler login              # one-time, opens the browser
npm run deploy                  # = npm run build && wrangler deploy
```

Wrangler prints the live URL, e.g. `https://aditya-portfolio.<your-subdomain>.workers.dev`.

### Option B: deploy on every push (GitHub integration)

1. Push this repository to GitHub (it's already at `aditbytes/portfolio`).
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Import a repository** → select `aditbytes/portfolio`.
3. Build settings:
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
   - **Root directory:** `/`
4. Under **Settings → Build → Variables**, add `SITE_URL` (see below) once you know the final URL.
5. Save. Every push to the production branch now builds and deploys, and pull requests get preview URLs.

### Also on Vercel

The repository is also connected to Vercel, which builds `npm run build` into `dist/`. `vercel.json` makes case-study URLs (`/work/<slug>`) and the 404 fallback work there too. Vercel doesn't run the Worker or apply `public/_headers`, so `/api/github` isn't available, and the GitHub section falls back to the public GitHub API. Cloudflare remains the intended production host.

## Environment Variables

Nothing sensitive is ever shipped to the browser. There are only two optional variables:

| Name | Where | Required | Purpose |
| --- | --- | --- | --- |
| `SITE_URL` | **Build-time** (shell, `.env`, or Cloudflare build variables) | Recommended | Public origin, no trailing slash, e.g. `https://aditya.dev`. Enables the `<link rel="canonical">`, absolute OpenGraph URLs, `sitemap.xml` and the `Sitemap:` line in `robots.txt`. Without it the build still works and just skips those tags. |
| `GITHUB_TOKEN` | **Worker secret** (runtime) | Optional | Fine-grained GitHub token with **no permissions** (public data only). Raises the GitHub API limit for `/api/github` from 60 to 5,000 req/h. Responses are edge-cached for an hour anyway. |

```bash
# build-time
SITE_URL=https://your-domain.com npm run build

# runtime secret (stored encrypted by Cloudflare, never in the repo)
npx wrangler secret put GITHUB_TOKEN
```

For local `wrangler dev`, copy `.dev.vars.example` → `.dev.vars` (gitignored). `.env.example` documents the build variable.

`GITHUB_USER` (default `aditbytes`) is a plain, non-secret var in `wrangler.jsonc`.

## Project Structure

```
├── index.html                 # HTML shell + static meta; prerender injects page markup
├── wrangler.jsonc             # Cloudflare Worker + Static Assets config
├── worker/index.ts            # Worker: /api/github (edge-cached) → everything else = static assets
├── vite.config.ts
├── build/seo.ts               # Vite plugin: canonical/OG URLs, JSON-LD, robots.txt, sitemap.xml
├── scripts/
│   ├── prerender.mjs          # Renders every route to static HTML after the build
│   └── optimize-images.mjs    # `npm run images`: AVIF/WebP/JPEG portrait crops (sharp)
├── assets-src/portraits/      # Original photos (inputs to `npm run images`)
├── public/
│   ├── _headers               # Security + cache headers
│   ├── assets/portraits/      # Generated responsive images (committed)
│   ├── assets/resume/         # Aditya_Resume.pdf
│   ├── og.jpg                 # 1200×630 social card
│   └── favicon.svg, apple-touch-icon.png, site.webmanifest
├── src/
│   ├── content/               # ← ALL site copy lives here
│   │   ├── site.ts            #   identity, links, education
│   │   ├── projects.ts        #   the five case studies
│   │   └── profile.ts         #   experience, research notes, stack, system map, GitHub picks
│   ├── sections/              # Hero, Signal, Work, SystemMap, Experience, Research, Stack, About, Code, Contact
│   ├── visuals/               # Custom project visualizations (SVG/CSS; all labelled illustrative)
│   ├── pages/                 # CaseStudy (/work/:slug), NotFound
│   ├── components/            # Nav, Cursor, CommandPalette, SignalField (canvas), Reveal, Portrait…
│   ├── hooks/, lib/           # media queries, in-view, router, GitHub loader, page meta
│   ├── styles/                # tokens, base, fonts
│   ├── main.tsx               # hydrate (prerendered) or render (SPA fallback)
│   └── entry-server.tsx       # used only by the prerender step
├── docs/aeluron-readiness-assessment.md   # previous README content, preserved
└── legacy/portfolio-v1.html               # previous single-file site, preserved
```

## Custom Domain

1. Add your domain to Cloudflare (**Websites → Add a site**) and switch the nameservers to the ones Cloudflare shows.
2. **Workers & Pages → aditya-portfolio → Settings → Domains & Routes → Add → Custom domain**, and enter e.g. `aditya.dev` (and optionally `www.aditya.dev`). Cloudflare creates the DNS record and certificate automatically.
   - Or do it in code: uncomment the `routes` block in `wrangler.jsonc`, set your domain, and deploy.
3. Set `SITE_URL=https://aditya.dev` as a build variable and redeploy, so the canonical URL, OpenGraph URLs and sitemap point at the new domain.

All asset paths are root-relative and nothing hardcodes a host, so no code changes are needed.

## Updating the Portfolio

**Content rule:** every fact on the site comes from the April 2026 resume (`public/assets/resume/Aditya_Resume.pdf`) or a public GitHub README. Keep it that way: no unverified metrics, titles, employers or links.

| To change… | Edit |
| --- | --- |
| Name, email, links, education | `src/content/site.ts` |
| A project / case study (text, metrics, links) | `src/content/projects.ts` |
| Add a project | Add an entry to `projects.ts`, then register a visual in `src/visuals/index.tsx` (copy an existing one as a starting point). It gets a card, a case-study page and a sitemap entry automatically. |
| Experience, research notes, stack, system map | `src/content/profile.ts` |
| Repos shown in the Code section | `featuredRepos` in `src/content/profile.ts` |
| Resume | Replace `public/assets/resume/Aditya_Resume.pdf` (keep the filename) |
| Photos | Put originals in `assets-src/portraits/`, adjust crops in `scripts/optimize-images.mjs`, run `npm run images` |
| Colors / type / spacing | `src/styles/tokens.css` |
| Social card | `public/og.jpg` (1200×630) |

Then `npm run build` (or just push if the GitHub integration is set up).

### Easter eggs

Press **`~`** or **`⌘K` / `Ctrl+K`** anywhere for the command palette: `/work`, `/about`, `/research`, `/system`, `/stack`, `/github`, `/contact`, `/resume`, `/email`, `whoami`, `help`, `clear`.

## Accessibility & motion

- Semantic landmarks, one `h1` per page, skip link, visible focus rings, labelled icon buttons.
- The command palette and mobile menu trap focus, close on `Esc` and restore focus when they close.
- `prefers-reduced-motion`: reveals, the canvas field, the marquee, the auto-playing visuals and the custom cursor are all disabled.
- The custom cursor only appears on fine pointers (mouse/trackpad).
- Visuals show project mechanics with invented data and are labelled **Illustrative**. They're never presented as results.
