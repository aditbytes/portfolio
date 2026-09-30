import { useMemo } from 'react';
import { gauss, pathFrom, rng } from './rng';
import { VisualFrame } from './VisualFrame';

const SOURCES = [
  { name: 'News', sub: 'Financial wires', score: '+0.62', tone: 'pos' },
  { name: 'Social', sub: 'X · Reddit', score: '−0.18', tone: 'neg' },
  { name: 'Filings', sub: 'SEC · daily', score: '+0.21', tone: 'pos' },
];

function PriceChart() {
  const { line, bars } = useMemo(() => {
    const r = rng(11);
    let v = 50;
    const pts: [number, number][] = [];
    const bars: { x: number; h: number; pos: boolean }[] = [];
    let s = 0;
    for (let i = 0; i < 48; i++) {
      s = s * 0.8 + gauss(r) * 0.6;
      v += s * 0.9 + gauss(r) * 0.8 + 0.12;
      pts.push([4 + i * 6.2, v]);
      bars.push({ x: 4 + i * 6.2, h: s, pos: s >= 0 });
    }
    const min = Math.min(...pts.map((p) => p[1]));
    const max = Math.max(...pts.map((p) => p[1]));
    return {
      line: pathFrom(pts.map(([x, y]) => [x, 8 + (92 * (max - y)) / (max - min)])),
      bars,
    };
  }, []);
  return (
    <svg viewBox="0 0 300 160" className="ie__chart" preserveAspectRatio="none">
      {[30, 60, 90].map((y) => (
        <line key={y} x1="0" x2="300" y1={y} y2={y} className="ie__grid" />
      ))}
      <path d={line} pathLength={1} className="ie__line" />
      {bars.map((b, i) => (
        <rect
          key={i}
          x={b.x - 2}
          width="4"
          y={b.pos ? 134 - Math.min(22, Math.abs(b.h) * 12) : 134}
          height={Math.max(1, Math.min(22, Math.abs(b.h) * 12))}
          className={b.pos ? 'ie__bar ie__bar--pos' : 'ie__bar ie__bar--neg'}
        />
      ))}
      <line x1="0" x2="300" y1="134" y2="134" className="ie__axis" />
    </svg>
  );
}

export function IndiEyeVisual() {
  return (
    <VisualFrame
      file="indieye · market monitor · fig.04"
      note="Interface concept · illustrative"
      className="vframe--wide"
      label="Dashboard concept: news, social and filings feed an NLP model; a sentiment gauge and price chart with sentiment bars lead to an insight line"
    >
      {() => (
        <div className="ie">
          <div className="ie__col">
            <p className="ie__head">
              <span>01</span> Ingest
            </p>
            <ul className="ie__sources">
              {SOURCES.map((s, i) => (
                <li key={s.name} className="ie__source" style={{ animationDelay: `${i * 0.6}s` }}>
                  <div className="ie__source-top">
                    <b>{s.name}</b>
                    <span className={`ie__score ie__score--${s.tone}`}>{s.score}</span>
                  </div>
                  <span className="ie__sub">{s.sub}</span>
                  <span className="ie__skel" style={{ width: `${88 - i * 12}%` }} />
                  <span className="ie__skel" style={{ width: `${62 + i * 9}%` }} />
                </li>
              ))}
            </ul>
          </div>

          <div className="ie__col ie__col--nlp">
            <p className="ie__head">
              <span>02</span> NLP → Sentiment
            </p>
            <div className="ie__gauge">
              <svg viewBox="0 0 200 116">
                <defs>
                  <linearGradient id="ie-gauge" x1="0" x2="1">
                    <stop offset="0" stopColor="#ff6b35" />
                    <stop offset="0.5" stopColor="#7c3cff" />
                    <stop offset="1" stopColor="#b7ff00" />
                  </linearGradient>
                </defs>
                <path d="M20 100 A80 80 0 0 1 180 100" className="ie__arc-bg" />
                <path d="M20 100 A80 80 0 0 1 180 100" className="ie__arc" stroke="url(#ie-gauge)" />
                <g className="ie__needle">
                  <line x1="100" y1="100" x2="100" y2="34" />
                  <circle cx="100" cy="100" r="5" />
                </g>
              </svg>
              <div className="ie__gauge-labels">
                <span>Bearish</span>
                <span>Bullish</span>
              </div>
            </div>
            <p className="ie__model">
              <span className="dot" /> Llama 3 · fine-tuned
            </p>
            <div className="ie__tokens">
              {['guidance', 'earnings', 'outflows', 'upgrade'].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>

          <div className="ie__col ie__col--price">
            <p className="ie__head">
              <span>03</span> Price action × sentiment
            </p>
            <PriceChart />
            <div className="ie__legend">
              <span>
                <i className="ie__key ie__key--line" /> Price
              </span>
              <span>
                <i className="ie__key ie__key--bar" /> Sentiment
              </span>
            </div>
          </div>

          <div className="ie__insight">
            <span className="ie__insight-label">04 · Insight ▸</span>
            <span className="ie__skel ie__skel--wide" />
            <span className="ie__chip">Regime: trending</span>
            <span className="ie__caret" />
          </div>
        </div>
      )}
    </VisualFrame>
  );
}
