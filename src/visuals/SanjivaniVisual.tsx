import { useMemo, type CSSProperties } from 'react';
import { rng } from './rng';
import { VisualFrame } from './VisualFrame';

const POSTS = [
  { text: 'family stranded on roof, water rising', urgency: 'High', need: 'Rescue boat' },
  { text: 'no drinking water in the relief camp', urgency: 'Med', need: 'Water' },
  { text: 'road to the block office cut off', urgency: 'Low', need: 'Access' },
];

const RESOURCES = [
  { k: 'Boats', v: 0.82 },
  { k: 'Food kits', v: 0.64 },
  { k: 'Medical', v: 0.48 },
  { k: 'Water', v: 0.71 },
];

/** A river-shaped flood mask on a coarse "satellite" grid (illustrative). */
function FloodMask() {
  const cells = useMemo(() => {
    const r = rng(23);
    const cols = 14;
    const rows = 9;
    return Array.from({ length: cols * rows }, (_, i) => {
      const x = i % cols;
      const y = Math.floor(i / cols);
      const river = 4 + Math.sin(x / 2.2) * 1.8;
      const d = Math.abs(y - river);
      const water = d < 1.1 || (d < 2.3 && r() < 0.55);
      return { water, delay: x * 55 + y * 20 };
    });
  }, []);
  return (
    <div className="sj__grid">
      {cells.map((c, i) => (
        <span key={i} className={c.water ? 'is-water' : ''} style={{ '--d': `${c.delay}ms` } as CSSProperties} />
      ))}
    </div>
  );
}

export function SanjivaniVisual() {
  return (
    <VisualFrame
      file="sanjivani · crisis pipeline · fig.06"
      label="Three modalities: distress posts triaged by urgency and need, a satellite tile with a segmented flood mask, and forecast resource bars feeding a district view"
    >
      {() => (
        <div className="ie sj">
          <div className="ie__col">
            <p className="ie__head">
              <span>01</span> Posts → triage
            </p>
            <ul className="ie__sources">
              {POSTS.map((p, i) => (
                <li key={p.text} className="ie__source" style={{ animationDelay: `${i * 0.6}s` }}>
                  <div className="ie__source-top">
                    <b>{p.need}</b>
                    <span className={`ie__score ${p.urgency === 'High' ? 'ie__score--neg' : 'ie__score--pos'}`}>{p.urgency}</span>
                  </div>
                  <span className="ie__sub">“{p.text}”</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="ie__col">
            <p className="ie__head">
              <span>02</span> Satellite → flood mask
            </p>
            <FloodMask />
            <p className="ie__model">
              <span className="dot" /> U-Net segmentation
            </p>
          </div>

          <div className="ie__col">
            <p className="ie__head">
              <span>03</span> Forecast → need
            </p>
            <div className="ds__bars sj__bars">
              {RESOURCES.map((b) => (
                <div key={b.k} className="ds__bar is-top">
                  <span className="ds__bar-k">{b.k}</span>
                  <span className="ds__bar-track">
                    <span style={{ '--v': b.v } as CSSProperties} />
                  </span>
                </div>
              ))}
            </div>
            <p className="ie__model">
              <span className="dot" /> XGBoost per resource
            </p>
          </div>

          <div className="ie__insight">
            <span className="ie__insight-label">04 · District view ▸</span>
            <span className="ie__skel ie__skel--wide" />
            <span className="ie__chip">Priority: rescue</span>
            <span className="ie__caret" />
          </div>
        </div>
      )}
    </VisualFrame>
  );
}
