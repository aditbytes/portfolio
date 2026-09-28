import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/misc.css';
import App from './App';

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Pages are prerendered at build time (scripts/prerender.mjs). Hydrate when the
// markup was rendered for this exact path; otherwise (e.g. SPA fallback for an
// unknown URL) render from scratch.
const normalize = (p: string) => p.replace(/\/+$/, '').replace(/\.html$/, '') || '/';
if (root.dataset.ssrPath && normalize(root.dataset.ssrPath) === normalize(location.pathname)) {
  hydrateRoot(root, app);
} else {
  root.textContent = '';
  createRoot(root).render(app);
}
