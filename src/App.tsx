import { useEffect } from 'react';
import { Cursor } from './components/Cursor';
import { Nav } from './components/Nav';
import { PaletteHost } from './components/PaletteHost';
import { Marker } from './components/SectionHead';
import { getProject } from './content/projects';
import { scrollToHash, usePathname } from './lib/router';
import { About } from './sections/About';
import { Code } from './sections/Code';
import { Contact, Footer } from './sections/Contact';
import { Experience } from './sections/Experience';
import { Hero } from './sections/Hero';
import { Now } from './sections/Now';
import { Research } from './sections/Research';
import { Signal } from './sections/Signal';
import { Stack } from './sections/Stack';
import { SystemMap } from './sections/SystemMap';
import { Work } from './sections/Work';
// Imported eagerly (they're tiny) so prerendered pages need no Suspense boundary.
import CaseStudy from './pages/CaseStudy';
import NotFound from './pages/NotFound';


function Home() {
  return (
    <>
      <Hero />
      <Signal />
      <Marker step="01 → 02" text="Signal detected" />
      <Work />
      <Marker step="02 → 03" text="Model loaded" />
      <SystemMap />
      <Experience />
      <Now />
      <Research />
      <Stack />
      <About />
      <Code />
      <Marker step="09 → 10" text="System ready" />
      <Contact />
    </>
  );
}

function Route({ path }: { path: string }) {
  if (path === '/' || path === '/index.html') return <Home />;
  const m = path.match(/^\/work\/([\w-]+)\/?$/);
  const project = m && getProject(m[1]);
  return project ? <CaseStudy project={project} key={project.slug} /> : <NotFound />;
}

export default function App() {
  const path = usePathname();

  // Deep links like /#research: scroll once the page has rendered.
  useEffect(() => {
    if (window.location.hash) requestAnimationFrame(() => scrollToHash(window.location.hash, false));
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main" className="page" tabIndex={-1}>
        <Route path={path} />
      </main>
      <Footer />
      <Cursor />
      <PaletteHost />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
