import { useEffect, useRef, type CSSProperties } from 'react';
import { ArrowDown, ArrowUpRight, GitHub } from '../components/Icons';
import { Portrait } from '../components/Portrait';
import { SignalField } from '../components/SignalField';
import { site } from '../content/site';
import { Link } from '../lib/router';
import './hero.css';

const TAPE = [
  'Hidden Markov Models',
  'K-Means',
  'XGBoost',
  'Prophet',
  'Llama 3',
  'Amazon Bedrock',
  'FastAPI',
  'MLflow',
  'SHAP',
  'Integrated Gradients',
  'PostgreSQL',
  'AWS Lambda',
  'Streamlit',
  'Fast Expression',
];

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  // Pointer parallax for floating labels + scroll parallax for the portrait.
  // Both write CSS variables / transforms directly: no React re-renders.
  useEffect(() => {
    const root = rootRef.current;
    const visual = visualRef.current;
    if (!root || !visual) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    let raf = 0;
    let mx = 0;
    let my = 0;
    const onMove = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const apply = () => {
      raf = 0;
      const y = Math.min(window.scrollY, window.innerHeight * 1.2);
      root.style.setProperty('--mx', mx.toFixed(3));
      root.style.setProperty('--my', my.toFixed(3));
      visual.style.transform = `translate3d(0, ${(y * 0.12).toFixed(1)}px, 0)`;
    };
    if (fine) window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="hero" id="top" ref={rootRef} aria-labelledby="hero-title">
      <SignalField className="hero__field" />
      <div className="hero__glow" aria-hidden="true" />

      <div className="container hero__grid">
        <div className="hero__copy">
          <div className="hero__kicker">
            <p className="label hero__eyebrow">
              <span className="label--lime">{site.name}</span> / AI × Systems × Quant
            </p>
            <p className="label hero__status">
              <span className="dot" aria-hidden="true" />
              Building / Researching
            </p>
          </div>

          <h1 className="hero__title" id="hero-title">
            <span className="hero__line" style={{ '--i': 0 } as CSSProperties}>
              <span>I build</span>
            </span>
            <span className="hero__line" style={{ '--i': 1 } as CSSProperties}>
              <span className="hero__outline">intelligent</span>
            </span>
            <span className="hero__line" style={{ '--i': 2 } as CSSProperties}>
              <span>
                systems<span className="hero__period">.</span>
              </span>
            </span>
          </h1>

          <p className="hero__sub">
            Computer Science &amp; Data Analytics student at <strong>IIT Patna</strong> building AI/ML systems, quantitative
            research pipelines, and production-grade data applications.
          </p>

          <div className="hero__ctas">
            <Link href="/#work" className="btn btn--primary">
              Explore my work <ArrowDown />
            </Link>
            <a className="btn" href={site.github.url} target="_blank" rel="noopener noreferrer">
              <GitHub /> GitHub <ArrowUpRight />
            </a>
            <a className="btn btn--ghost" href={site.resumeUrl} target="_blank" rel="noopener">
              Resume <ArrowDown />
            </a>
          </div>
        </div>

        <div className="hero__visual" ref={visualRef}>
          <figure className="hero__figure">
            <div className="hero__frame">
              <Portrait
                name="hero"
                widths={[420, 620]}
                sizes="(max-width: 767px) 80vw, (max-width: 1100px) 40vw, 34vw"
                width={620}
                height={810}
                priority
                alt="Aditya seated in a woven chair on a high-rise balcony, working on a laptop, with a waterfront skyline behind him."
                className="hero__img"
              />
              <span className="hero__scan" aria-hidden="true" />
              <span className="hero__corner hero__corner--tl" aria-hidden="true" />
              <span className="hero__corner hero__corner--br" aria-hidden="true" />
            </div>
            <figcaption className="hero__caption label">
              <span>Fig. 00</span>
              <span>Subject — Aditya</span>
            </figcaption>
          </figure>

          <ul className="hero__tags" aria-hidden="true">
            <li className="hero__tag hero__tag--a" style={{ '--d': 18 } as CSSProperties}>
              <span className="dot" /> Aditya
            </li>
            <li className="hero__tag hero__tag--b" style={{ '--d': -14 } as CSSProperties}>
              IIT Patna
            </li>
            <li className="hero__tag hero__tag--c" style={{ '--d': 24 } as CSSProperties}>
              AI / ML
            </li>
            <li className="hero__tag hero__tag--d" style={{ '--d': -20 } as CSSProperties}>
              Quant
            </li>
            <li className="hero__coords" style={{ '--d': 8 } as CSSProperties}>
              25.53°N · 84.85°E
            </li>
          </ul>
        </div>
      </div>

      <div className="container hero__meta">
        <dl>
          <div>
            <dt className="label">Education</dt>
            <dd>
              {site.education.short} · {site.education.schoolShort} ’29
            </dd>
          </div>
          <div>
            <dt className="label">Now</dt>
            <dd>
              Building <Link href="/work/indieye" className="u-link">IndiEye</Link>
            </dd>
          </div>
          <div>
            <dt className="label">Based</dt>
            <dd>Patna, India</dd>
          </div>
        </dl>
        <ol className="hero__stages label" aria-label="How the background field flows">
          <li>Data</li>
          <li>Signal</li>
          <li>Model</li>
          <li>Decision</li>
        </ol>
      </div>

      <div className="tape" aria-hidden="true">
        <div className="tape__track">
          {[0, 1].map((k) => (
            <ul key={k}>
              {TAPE.map((t) => (
                <li key={t}>
                  {t}
                  <span>/</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
