import { featuredRepos } from '../content/profile';
import { site } from '../content/site';

export interface RepoView {
  name: string;
  description: string;
  language: string;
  url: string;
  stars: number | null;
  pushedAt: string | null;
}

export interface RepoResult {
  repos: RepoView[];
  /** Number of public, non-fork repositories — null when offline. */
  total: number | null;
  live: boolean;
}

interface ApiRepo {
  name: string;
  description: string | null;
  language: string | null;
  html_url?: string;
  url?: string;
  stargazers_count?: number;
  stars?: number;
  pushed_at?: string;
  pushedAt?: string;
  fork?: boolean;
}

const CACHE_KEY = 'gh-repos-v1';
const CACHE_MS = 30 * 60 * 1000;

/** The curated list with no live numbers — always renders, even offline. */
export function snapshot(): RepoResult {
  return {
    repos: featuredRepos.map((r) => ({
      ...r,
      url: `${site.github.url}/${r.name}`,
      stars: null,
      pushedAt: null,
    })),
    total: null,
    live: false,
  };
}

async function getJson(url: string, ms: number): Promise<unknown> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

function merge(list: ApiRepo[]): RepoResult {
  const own = list.filter((r) => !r.fork);
  const byName = new Map(own.map((r) => [r.name.toLowerCase(), r]));
  const repos = featuredRepos.map((f) => {
    const live = byName.get(f.name.toLowerCase());
    return {
      name: f.name,
      description: f.description,
      language: live?.language || f.language,
      url: live?.html_url || live?.url || `${site.github.url}/${f.name}`,
      stars: live ? (live.stargazers_count ?? live.stars ?? 0) : null,
      pushedAt: live ? (live.pushed_at ?? live.pushedAt ?? null) : null,
    };
  });
  return { repos, total: own.length, live: true };
}

/**
 * 1. Same-origin Worker endpoint (edge-cached, optional token) — production.
 * 2. Public GitHub API straight from the browser — local dev / worker down.
 * 3. Curated snapshot — the section never breaks.
 */
export async function loadRepos(): Promise<RepoResult> {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { at, data } = JSON.parse(cached) as { at: number; data: RepoResult };
      if (Date.now() - at < CACHE_MS) return data;
    }
  } catch {
    /* storage unavailable — ignore */
  }

  const sources = ['/api/github', `https://api.github.com/users/${site.github.handle}/repos?per_page=100&sort=pushed`];
  for (const url of sources) {
    try {
      const json = (await getJson(url, 6000)) as ApiRepo[] | { repos: ApiRepo[] };
      const list = Array.isArray(json) ? json : json.repos;
      if (!Array.isArray(list) || !list.length) continue;
      const data = merge(list);
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
      } catch {
        /* ignore */
      }
      return data;
    } catch {
      /* try next source */
    }
  }
  return snapshot();
}

export function relativeTime(iso: string | null) {
  if (!iso) return '—';
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return 'today';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}
