// Prerenders every route to static HTML after `vite build`, so first paint
// doesn't wait for JavaScript and crawlers get real content.
//
//   /                → dist/index.html
//   /work/<slug>     → dist/work/<slug>.html   (served by Workers Static Assets
//                                               for /work/<slug>)
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = path.resolve('dist');
const ssrEntry = pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href;
const { render, projects, site } = await import(ssrEntry);

const template = await readFile(path.join(dist, 'index.html'), 'utf8');
const base = (process.env.SITE_URL || '').replace(/\/+$/, '');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const routes = [
  { path: '/', file: 'index.html' },
  ...projects.map((p) => ({
    path: `/work/${p.slug}`,
    file: `work/${p.slug}.html`,
    title: `${p.title} — Case study · ${site.name}`,
    description: p.oneLiner,
  })),
];

for (const r of routes) {
  const body = await render(r.path);
  let html = template.replace('<div id="root"></div>', `<div id="root" data-ssr-path="${r.path}">${body}</div>`);
  if (r.title) {
    const t = esc(r.title);
    const d = esc(r.description);
    html = html
      .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
      .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${d}$2`)
      .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${t}$2`)
      .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${d}$2`)
      .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${t}$2`)
      .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${d}$2`)
      .replace(/<meta property="og:type" content="profile" \/>/, '<meta property="og:type" content="article" />');
    if (base) {
      html = html
        .replace(`<link rel="canonical" href="${base}/" />`, `<link rel="canonical" href="${base}${r.path}" />`)
        .replace(`<meta property="og:url" content="${base}/" />`, `<meta property="og:url" content="${base}${r.path}" />`);
    }
  }
  if (!body.includes('<')) throw new Error(`Prerender produced no markup for ${r.path}`);
  const out = path.join(dist, r.file);
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, html);
  console.log(`prerendered ${r.path.padEnd(36)} → dist/${r.file} (${(html.length / 1024).toFixed(1)} KB)`);
}

await rm(path.resolve('dist-ssr'), { recursive: true, force: true });
