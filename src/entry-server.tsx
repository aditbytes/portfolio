import { StrictMode } from 'react';
import { prerender } from 'react-dom/static';
import App from './App';
import { setSsrPath } from './lib/router';

/** Renders one route to static HTML (used by scripts/prerender.mjs at build time). */
export async function render(path: string): Promise<string> {
  setSsrPath(path);
  const { prelude } = await prerender(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  return new Response(prelude).text();
}

export { projects } from './content/projects';
export { site } from './content/site';
