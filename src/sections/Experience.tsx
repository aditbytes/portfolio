import { useEffect, useRef } from 'react';
import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';
import { experience } from '../content/profile';
import { site } from '../content/site';
import './experience.css';

/** Draws the timeline spine as the visitor scrolls through it. */
function useDrawProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--p', '1');
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = (window.innerHeight * 0.65 - r.top) / r.height;
      el.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(3));
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
  }, []);
  return ref;
}

export function Experience() {
  const lineRef = useDrawProgress<HTMLOListElement>();
  return (
    <section className="section experience" id="experience" aria-labelledby="exp-title">
      <div className="container">
        <SectionHead index="04" label="Experience" id="exp-title" title={['Where I’ve', <span className="outline" key="b">built</span>]} />

        <ol className="timeline" ref={lineRef}>
          {experience.map((e) => (
            <li className="timeline__item" key={e.org}>
              <Reveal className="timeline__when">
                <span className="timeline__year">{e.year}</span>
                <span className="label">{e.period}</span>
              </Reveal>
              <span className="timeline__node" aria-hidden="true" />
              <Reveal className="timeline__body" i={1}>
                <div className="timeline__head">
                  <h3 className="timeline__org">{e.org}</h3>
                  <span className="label">{e.location}</span>
                </div>
                <p className="timeline__role">{e.role}</p>
                <ul className="timeline__points">
                  {e.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <ul className="timeline__tags" aria-label="Focus areas">
                  {e.tags.map((t) => (
                    <li key={t} className={e.org.includes('WorldQuant') ? 'is-quant' : ''}>
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
          <li className="timeline__item timeline__item--origin">
            <Reveal className="timeline__when">
              <span className="timeline__year">2025</span>
              <span className="label">{site.education.periodLong}</span>
            </Reveal>
            <span className="timeline__node" aria-hidden="true" />
            <Reveal className="timeline__body" i={1}>
              <div className="timeline__head">
                <h3 className="timeline__org">{site.education.school}</h3>
                <span className="label">Patna, Bihar</span>
              </div>
              <p className="timeline__role">{site.education.degree}</p>
              <p className="timeline__cert label">
                <span className="label--lime">Certification</span> · {site.certifications[0]}
              </p>
            </Reveal>
          </li>
        </ol>
      </div>
    </section>
  );
}
