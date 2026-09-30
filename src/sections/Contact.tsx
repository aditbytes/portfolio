import { useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Copy, GitHub, LinkedIn, Mail } from '../components/Icons';
import { MaskedLines, Reveal } from '../components/Reveal';
import { navLinks, site } from '../content/site';
import { Link } from '../lib/router';
import { openPalette } from '../components/paletteBus';
import { useIsMac } from '../hooks/useMedia';
import './contact.css';

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };
  return (
    <button type="button" className="contact__copy" onClick={copy} aria-label={copied ? 'Email address copied' : 'Copy email address'}>
      {copied ? <Check /> : <Copy />}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

export function Contact() {
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <Reveal className="section-head__meta label">
          <span className="section-head__index">[10]</span>
          <span>Contact</span>
        </Reveal>

        <div className="contact__grid">
          <h2 className="contact__title" id="contact-title">
            <MaskedLines lines={['Build something', <span className="outline" key="w">worth shipping.</span>]} />
          </h2>

          <Reveal className="contact__side" i={1}>
            <p>
              I’m most interested in problems where data, models and markets meet — research collaborations, messy
              datasets, or a system that needs to get from a notebook to production. Email is the fastest way to reach
              me.
            </p>
            <div className="contact__email">
              <a href={`mailto:${site.email}`} className="u-link">
                {site.email}
              </a>
              <CopyEmail />
            </div>
            <div className="contact__actions">
              <a className="btn btn--primary" href={`mailto:${site.email}`}>
                <Mail /> Send an email
              </a>
              <a className="btn" href={site.github.url} target="_blank" rel="noopener noreferrer">
                <GitHub /> GitHub <ArrowUpRight />
              </a>
              <a className="btn" href={site.linkedin.url} target="_blank" rel="noopener noreferrer">
                <LinkedIn /> LinkedIn <ArrowUpRight />
              </a>
              <a className="btn btn--ghost" href={site.resumeUrl} target="_blank" rel="noopener">
                Resume <ArrowDown />
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal className="finale" i={1}>
          <p className="label">System ready</p>
          <a href={`mailto:${site.email}`} className="finale__link">
            <span className="finale__line">The next</span>
            <span className="finale__line finale__line--accent">system</span>
            <span className="finale__line">could be yours.</span>
            <span className="finale__cta">
              Let’s talk <ArrowRight />
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const isMac = useIsMac();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div>
            <p className="footer__word" aria-hidden="true">
              {site.wordmark.slice(0, -1)}
              <span>.</span>
            </p>
            <p className="label footer__tag">AI / ML / Quant / Systems</p>
          </div>
          <nav aria-label="Footer">
            <ul className="footer__nav">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <Link href={`/#${l.id}`} className="u-link">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={site.github.url} target="_blank" rel="noopener noreferrer" className="u-link">
                  GitHub ↗
                </a>
              </li>
              <li>
                <a href={site.linkedin.url} target="_blank" rel="noopener noreferrer" className="u-link">
                  LinkedIn ↗
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="footer__bottom label">
          <span suppressHydrationWarning>© {new Date().getFullYear()} {site.name}</span>
          <span className="footer__quip">Built with curiosity, caffeine and a questionable amount of debugging.</span>
          <button type="button" className="footer__kbd" onClick={() => openPalette()}>
            Press <kbd>~</kbd> or <kbd>{isMac ? '⌘K' : 'Ctrl K'}</kbd>
          </button>
        </div>
      </div>
    </footer>
  );
}
