import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';
import { systemNodes } from '../content/profile';
import { useInView } from '../hooks/useInView';
import './system.css';

const R = 38;
const pos = (i: number) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / systemNodes.length;
  return { x: 50 + R * Math.cos(a), y: 50 + R * Math.sin(a) };
};

export function SystemMap() {
  const [active, setActive] = useState(0);
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.35 });
  const interacted = useRef(false);

  // Walk the loop on its own until the visitor takes over.
  useEffect(() => {
    if (!inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      if (!interacted.current) setActive((a) => (a + 1) % systemNodes.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [inView]);

  const select = (i: number) => {
    interacted.current = true;
    setActive(i);
  };
  const node = systemNodes[active];

  return (
    <section className="section system" id="systems" aria-labelledby="system-title">
      <div className="container">
        <SectionHead
          index="03"
          label="System Map"
          id="system-title"
          title={['How I think', <span className="outline" key="s">about systems</span>]}
          lede="Every project on this page is the same loop with different data. Hover, tap or tab through the nodes."
        />

        <div className="system__grid">
          <div className={`system__map ${inView ? 'is-in' : ''}`} ref={ref}>
            <svg viewBox="0 0 100 100" aria-hidden="true" className="system__svg">
              <circle cx="50" cy="50" r={R} className="system__ring" />
              <circle cx="50" cy="50" r={R - 9} className="system__ring system__ring--inner" />
              {systemNodes.map((_, i) => {
                const a = pos(i);
                const b = pos((i + 1) % systemNodes.length);
                return (
                  <path
                    key={i}
                    d={`M${a.x} ${a.y} A${R} ${R} 0 0 1 ${b.x} ${b.y}`}
                    className={`system__edge ${i === active ? 'is-active' : ''} ${i === systemNodes.length - 1 ? 'is-feedback' : ''}`}
                  />
                );
              })}
              {Array.from({ length: 36 }, (_, i) => {
                const a = (i * Math.PI * 2) / 36;
                return <line key={i} x1={50 + 45 * Math.cos(a)} y1={50 + 45 * Math.sin(a)} x2={50 + 46.4 * Math.cos(a)} y2={50 + 46.4 * Math.sin(a)} className="system__tick" />;
              })}
            </svg>

            <div className="system__center" aria-hidden="true">
              <span className="label">
                {String(active + 1).padStart(2, '0')} / {String(systemNodes.length).padStart(2, '0')}
              </span>
              <span className="system__center-word" key={node.id}>
                {node.label}
              </span>
            </div>

            {systemNodes.map((n, i) => {
              const p = pos(i);
              return (
                <button
                  key={n.id}
                  type="button"
                  className={`system__node ${i === active ? 'is-active' : ''}`}
                  style={{ left: `${p.x}%`, top: `${p.y}%`, '--i': i } as CSSProperties}
                  aria-pressed={i === active}
                  aria-controls="system-detail"
                  onMouseEnter={() => select(i)}
                  onFocus={() => select(i)}
                  onClick={() => select(i)}
                >
                  <span className="system__node-num">0{i + 1}</span>
                  {n.label}
                </button>
              );
            })}
          </div>

          <Reveal className="system__detail" i={1}>
            <div id="system-detail" aria-live="polite" key={node.id} className="system__detail-inner">
              <p className="label label--lime">
                Node 0{active + 1} · {node.label}
              </p>
              <h3 className="system__detail-title">{node.caption}</h3>
              <ul className="system__examples">
                {node.examples.map((e) => (
                  <li key={e}>
                    <span aria-hidden="true">→</span> {e}
                  </li>
                ))}
              </ul>
              <p className="label system__seen">Seen in</p>
              <ul className="chips">
                {node.projects.map((p) => (
                  <li className="chip" key={p}>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
