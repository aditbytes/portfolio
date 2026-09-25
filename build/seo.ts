import type { Plugin } from 'vite';
import { projects } from '../src/content/projects.ts';
import { site } from '../src/content/site.ts';

/**
 * Injects URL-dependent SEO tags and emits robots.txt / sitemap.xml.
 *
 * Everything that needs an absolute URL (canonical, og:url, sitemap) is only
 * produced when SITE_URL is set at build time, so nothing ever points at
 * localhost or a guessed domain.
 */
export function seo(siteUrl: string | undefined): Plugin {
  const base = siteUrl?.replace(/\/+$/, '') || '';
  const abs = (p: string) => (base ? `${base}${p}` : p);
  const routes = ['/', ...projects.map((p) => `/work/${p.slug}`)];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': abs('/#person'),
        name: site.name,
        jobTitle: 'AI/ML Engineer & Quant Researcher',
        description: site.description,
        email: `mailto:${site.email}`,
        ...(base && { url: `${base}/`, image: abs('/og.jpg') }),
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: site.education.school,
        },
        knowsAbout: ['Machine Learning', 'Quantitative Research', 'Data Engineering', 'Cloud Systems'],
        sameAs: [site.github.url, site.linkedin.url],
      },
      {
        '@type': 'WebSite',
        '@id': abs('/#website'),
        name: `${site.name} — Portfolio`,
        ...(base && { url: `${base}/` }),
        author: { '@id': abs('/#person') },
      },
    ],
  };

  return {
    name: 'portfolio-seo',
    transformIndexHtml(html) {
      const tags = [
        base && `<link rel="canonical" href="${base}/" />`,
        base && `<meta property="og:url" content="${base}/" />`,
        `<meta property="og:image" content="${abs('/og.jpg')}" />`,
        `<meta name="twitter:image" content="${abs('/og.jpg')}" />`,
        `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
      ]
        .filter(Boolean)
        .join('\n    ');
      return html.replace('<!-- seo:url -->', tags);
    },
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /', 'Disallow: /api/', base && `Sitemap: ${base}/sitemap.xml`]
        .filter(Boolean)
        .join('\n');
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots}\n` });

      if (!base) {
        this.warn('SITE_URL is not set — skipping canonical URL and sitemap.xml. See README › Environment Variables.');
        return;
      }
      const urls = routes
        .map((r) => `  <url><loc>${base}${r}</loc><changefreq>monthly</changefreq></url>`)
        .join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
    },
  };
}
