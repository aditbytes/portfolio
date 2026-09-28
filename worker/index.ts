/**
 * Cloudflare Worker — serves the static site (Workers Static Assets) and one
 * tiny API route:
 *
 *   GET /api/github  → public, non-fork repos for the GitHub section,
 *                      edge-cached for an hour.
 *
 * Everything else is handled by the assets binding (with SPA fallback
 * configured in wrangler.jsonc). No secrets ever reach the browser: the
 * optional GITHUB_TOKEN lives only here, as a Worker secret.
 */
export interface Env {
  ASSETS: Fetcher;
  GITHUB_USER?: string;
  /** Optional. `wrangler secret put GITHUB_TOKEN` — raises the API rate limit. */
  GITHUB_TOKEN?: string;
}

interface GhRepo {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

const TTL = 60 * 60; // seconds

const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'x-content-type-options': 'nosniff',
      ...extra,
    },
  });

async function github(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const cache = caches.default;
  const cacheKey = new Request(new URL('/api/github', request.url).toString(), { method: 'GET' });
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  const user = env.GITHUB_USER || 'aditbytes';
  const headers: Record<string, string> = {
    accept: 'application/vnd.github+json',
    'user-agent': 'aditya-portfolio-worker',
    'x-github-api-version': '2022-11-28',
  };
  if (env.GITHUB_TOKEN) headers.authorization = `Bearer ${env.GITHUB_TOKEN}`;

  let upstream: Response;
  try {
    upstream = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=pushed&type=owner`, { headers });
  } catch {
    return json({ error: 'upstream_unreachable' }, 502, { 'cache-control': 'no-store' });
  }
  if (!upstream.ok) {
    return json({ error: 'upstream_error', status: upstream.status }, 502, { 'cache-control': 'no-store' });
  }

  const repos = ((await upstream.json()) as GhRepo[])
    .filter((r) => !r.fork && !r.archived)
    .map((r) => ({
      name: r.name,
      description: r.description,
      language: r.language,
      url: r.html_url,
      stars: r.stargazers_count,
      pushedAt: r.pushed_at,
    }));

  const res = json({ user, repos, fetchedAt: new Date().toISOString() }, 200, {
    'cache-control': `public, max-age=${TTL}, s-maxage=${TTL}`,
  });
  ctx.waitUntil(cache.put(cacheKey, res.clone()));
  return res;
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/github') {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return json({ error: 'method_not_allowed' }, 405, { allow: 'GET, HEAD' });
      }
      return github(request, env, ctx);
    }
    if (url.pathname.startsWith('/api/')) {
      return json({ error: 'not_found' }, 404);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
