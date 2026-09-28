import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { seo } from './build/seo.ts';

export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // The SSR build only feeds scripts/prerender.mjs — no SEO files needed there.
    plugins: [react(), !isSsrBuild && seo(env.SITE_URL)],
    build: {
      target: 'es2022',
      cssCodeSplit: true,
      // Never inline assets as data: URIs — keeps fonts cacheable and CSP strict.
      assetsInlineLimit: 0,
    },
  };
});
