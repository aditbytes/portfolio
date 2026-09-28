import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { navLinks, site } from '../content/site';
import { Link, usePathname } from '../lib/router';
import { GitHub, LinkedIn } from './Icons';
import { useIsMac } from '../hooks/useMedia';
import { openPalette } from './paletteBus';
import './nav.css';

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const isMac = useIsMac();

  // Scroll state + progress bar (written straight to the DOM — no re-render per frame).
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // Highlight the section currently in view.
  useEffect(() => {
    if (pathname !== '/' || typeof IntersectionObserver === 'undefined') {
      setActive(null);
      return;
    }
    const els = navLinks.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // Mobile menu: lock scroll, Esc to close, keep focus inside.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const first = menuRef.current?.querySelector<HTMLElement>('a, button');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === 'Tab' && menuRef.current) {
        const items = Array.from(menuRef.current.querySelectorAll<HTMLElement>('a, button'));
        const all = [toggleRef.current!, ...items];
        const idx = all.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && idx <= 0) {
          e.preventDefault();
          all[all.length - 1].focus();
        } else if (!e.shiftKey && idx === all.length - 1) {
          e.preventDefault();
          all[0].focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
        <div className="nav__progress" ref={progressRef} aria-hidden="true" />
        <div className="nav__inner container">
          <Link href="/" className="nav__logo">
            <span className="nav__mark" aria-hidden="true">
              A<i>.</i>
            </span>
            <span className="nav__name">ADITYA</span>
            <span className="sr-only">— home</span>
          </Link>

          <nav className="nav__links" aria-label="Primary">
            <ul>
              {navLinks.map((l, i) => (
                <li key={l.id}>
                  <Link href={`/#${l.id}`} className="nav__link" aria-current={active === l.id ? 'true' : undefined}>
                    <span className="nav__num">0{i + 1}</span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav__right">
            <a className="nav__icon" href={site.github.url} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)">
              <GitHub />
            </a>
            <a className="nav__icon" href={site.linkedin.url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)">
              <LinkedIn />
            </a>
            <button type="button" className="nav__cmd" onClick={() => openPalette()} aria-keyshortcuts="Control+K Meta+K">
              <span className="dot" aria-hidden="true" />
              <span className="nav__cmd-text">Building</span>
              <span className="sr-only">— open command palette</span>
              <kbd>{isMac ? '⌘K' : 'Ctrl K'}</kbd>
            </button>
            <button
              type="button"
              ref={toggleRef}
              className="nav__toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" ref={menuRef} className={`menu ${open ? 'is-open' : ''}`} hidden={!open} role="dialog" aria-modal="true" aria-label="Menu">
        <div className="menu__inner container">
          <p className="label">
            <span className="label--lime">●</span> Navigation
          </p>
          <ul className="menu__links">
            {navLinks.map((l, i) => (
              <li key={l.id} style={{ '--i': i } as CSSProperties}>
                <Link href={`/#${l.id}`} onClick={() => setOpen(false)}>
                  <span className="menu__num">0{i + 1}</span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="menu__foot">
            <a href={`mailto:${site.email}`} className="menu__email">
              {site.email}
            </a>
            <div className="menu__socials">
              <a href={site.github.url} target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
              <a href={site.linkedin.url} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
              <a href={site.resumeUrl} target="_blank" rel="noopener">
                Resume ↓
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
