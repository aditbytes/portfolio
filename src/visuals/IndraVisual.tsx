import { useMemo, type CSSProperties } from 'react';
import { gauss, rng } from './rng';
import { VisualFrame } from './VisualFrame';

/**
 * Left: illustrative report clusters with event boundaries.
 * Right: the Verification Receipt from INDRA's recorded demo (README, 27 Sep 2026) —
 * these numbers are real output, not invented.
 */
const RECEIPT: { factor: string; weight: number; score: number | null; note?: string }[] = [
  { factor: 'Weather station', weight: 0.2, score: 0, note: 'contradicted' },
  { factor: 'Official warning', weight: 0.1, score: 0 },
  { factor: 'Report density', weight: 0.2, score: 0.55, note: '5 witnesses' },
  { factor: 'Spatial coherence', weight: 0.15, score: 1 },
  { factor: 'Computer vision', weight: 0.15, score: null },
  { factor: 'Source reliability', weight: 0.15, score: 0.6 },
  { factor: 'Anomaly detection', weight: 0.05, score: null },
];

function ClusterMap() {
  const pts = useMemo(() => {
    const r = rng(19);
    const cloud = (cx: number, cy: number, n: number, s: number, kind: string) =>
      Array.from({ length: n }, () => ({ x: cx + gauss(r) * s, y: cy + gauss(r) * s * 0.8, kind }));
    return [
      ...cloud(92, 78, 9, 13, 'flood'),
      ...cloud(206, 138, 6, 10, 'heat'),
      ...Array.from({ length: 9 }, () => ({ x: 20 + r() * 260, y: 20 + r() * 170, kind: 'noise' })),
    ];
  }, []);
  return (
    <svg viewBox="0 0 300 210" className="indra__map">
      {Array.from({ length: 7 }, (_, i) => (
        <line key={`g${i}`} x1={0} x2={300} y1={i * 35} y2={i * 35} className="indra__grid" />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`v${i}`} y1={0} y2={210} x1={i * 37.5} x2={i * 37.5} className="indra__grid" />
      ))}
      <path d="M62 60 L84 50 L116 58 L124 84 L110 104 L78 106 L60 88 Z" className="indra__hull indra__hull--flood" />
      <path d="M190 124 L214 118 L226 136 L218 156 L196 158 L186 142 Z" className="indra__hull indra__hull--heat" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.kind === 'noise' ? 1.8 : 2.6} className={`indra__pt indra__pt--${p.kind}`} style={{ '--i': i } as CSSProperties} />
      ))}
      <g transform="translate(236 104)" className="indra__metar">
        <rect x="-5" y="-5" width="10" height="10" transform="rotate(45)" />
        <text x="10" y="4">METAR</text>
      </g>
      <text x="64" y="44" className="indra__tag indra__tag--flood">
        FLOOD · 9
      </text>
      <text x="170" y="178" className="indra__tag indra__tag--heat">
        HEAT · 6
      </text>
    </svg>
  );
}

export function IndraVisual() {
  return (
    <VisualFrame
      file="indra · verification receipt v2 · fig.01"
      note="Receipt: recorded demo · map: illustrative"
      className="vframe--wide"
      label="Report clusters with event boundaries beside INDRA's verification receipt: seven weighted factors, two offline, total confidence 0.4369 at coverage 0.80, verdict contradicted and routed to human review"
    >
      {() => (
        <div className="indra">
          <div className="ie__col">
            <p className="ie__head">
              <span>01</span> Cluster · DBSCAN + H3
            </p>
            <ClusterMap />
            <div className="ie__legend">
              <span>
                <i className="indra__key indra__key--flood" /> Flood reports
              </span>
              <span>
                <i className="indra__key indra__key--heat" /> Heat reports
              </span>
              <span>
                <i className="indra__key" /> Noise
              </span>
            </div>
          </div>

          <div className="ie__col indra__receipt">
            <p className="ie__head">
              <span>02</span> Verification receipt
            </p>
            <ul className="indra__rows">
              {RECEIPT.map((row, i) => (
                <li key={row.factor} className={row.score === null ? 'is-off' : ''} style={{ '--i': i } as CSSProperties}>
                  <span className="indra__factor">
                    {row.factor} <em>{Math.round(row.weight * 100)}%</em>
                  </span>
                  <span className="indra__bar">
                    <span style={{ '--w': row.score ?? 0 } as CSSProperties} className={row.score === 0 ? 'is-zero' : ''} />
                  </span>
                  <span className="indra__score">{row.score === null ? 'offline' : row.score.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="indra__total">
              <span>0.3495 / coverage 0.80</span>
              <b>confidence 0.4369</b>
            </div>
            <pre className="indra__formula">
              {'online     = factors that reported\nconfidence = Σ(w × s) / Σ w   over online\ncoverage   = Σ w          over online'}
            </pre>
          </div>

          <div className="ie__insight indra__verdict">
            <span className="ie__insight-label">03 · Verdict ▸</span>
            <span className="indra__chip indra__chip--warm">Contradicted</span>
            <span className="indra__arrow">→</span>
            <span className="ie__chip">Pending human review</span>
            <span className="indra__why">never auto-rejected</span>
          </div>
        </div>
      )}
    </VisualFrame>
  );
}
