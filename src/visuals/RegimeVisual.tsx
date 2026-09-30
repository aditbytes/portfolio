import { useMemo, useState, type PointerEvent } from 'react';
import { gauss, pathFrom, rng } from './rng';
import { VisualFrame } from './VisualFrame';

type Regime = 'lowvol' | 'trending' | 'crisis';

const REGIMES: Record<Regime, { label: string; strategy: string; color: string; drift: number; vol: number }> = {
  lowvol: { label: 'Low-vol', strategy: 'Mean reversion', color: 'var(--cyan)', drift: 0.05, vol: 0.55 },
  trending: { label: 'Trending', strategy: 'Breakout', color: 'var(--lime)', drift: 0.42, vol: 0.9 },
  crisis: { label: 'Crisis', strategy: 'Risk-off', color: 'var(--warm)', drift: -1.35, vol: 2.3 },
};

// An invented regime sequence — the shape of the idea, not NIFTY 50 history.
const SEQUENCE: [Regime, number][] = [
  ['lowvol', 26],
  ['trending', 34],
  ['crisis', 12],
  ['lowvol', 20],
  ['trending', 30],
  ['crisis', 9],
  ['lowvol', 12],
  ['trending', 22],
];

const W = 640;
const X0 = 18;
const X1 = W - 18;
const Y0 = 44;
const Y1 = 268;

export function RegimeVisual() {
  const { path, area, bands, series } = useMemo(() => {
    const r = rng(7);
    const series: { v: number; regime: Regime }[] = [];
    let v = 100;
    for (const [regime, len] of SEQUENCE) {
      for (let i = 0; i < len; i++) {
        v += REGIMES[regime].drift + gauss(r) * REGIMES[regime].vol;
        series.push({ v, regime });
      }
    }
    const min = Math.min(...series.map((s) => s.v));
    const max = Math.max(...series.map((s) => s.v));
    const n = series.length;
    const x = (i: number) => X0 + ((X1 - X0) * i) / (n - 1);
    const y = (val: number) => Y1 - ((Y1 - Y0) * (val - min)) / (max - min);
    const pts = series.map((s, i) => [x(i), y(s.v)] as [number, number]);
    const bands: { x: number; w: number; regime: Regime }[] = [];
    let start = 0;
    series.forEach((s, i) => {
      if (i === n - 1 || series[i + 1].regime !== s.regime) {
        bands.push({ x: x(start), w: x(i) - x(start) + (X1 - X0) / (n - 1), regime: s.regime });
        start = i + 1;
      }
    });
    return {
      series,
      path: pathFrom(pts),
      area: `${pathFrom(pts)}L${X1} ${Y1}L${X0} ${Y1}Z`,
      bands,
    };
  }, []);

  const [hover, setHover] = useState<number | null>(null);
  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - box.left) / box.width) * W;
    const i = Math.round(((px - X0) / (X1 - X0)) * (series.length - 1));
    setHover(Math.max(0, Math.min(series.length - 1, i)));
  };
  const hx = hover === null ? 0 : X0 + ((X1 - X0) * hover) / (series.length - 1);
  const hr = hover === null ? null : REGIMES[series[hover].regime];

  return (
    <VisualFrame file="regime_detector · fig.02" label="Price series with coloured bands for low-volatility, trending and crisis regimes, and the strategy each regime selects">
      {(inView) => (
        <svg className={`regime ${inView ? 'is-drawn' : ''}`} viewBox={`0 0 ${W} 360`} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
          <defs>
            <linearGradient id="regime-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f5f5f5" stopOpacity="0.12" />
              <stop offset="1" stopColor="#f5f5f5" stopOpacity="0" />
            </linearGradient>
          </defs>

          <g className="regime__legend">
            {(Object.keys(REGIMES) as Regime[]).map((k, i) => (
              <g key={k} transform={`translate(${X0 + i * 108} 18)`}>
                <rect width="8" height="8" rx="2" y="-7" fill={REGIMES[k].color} />
                <text x="14">{REGIMES[k].label}</text>
              </g>
            ))}
            <text x={X1} textAnchor="end" y="18" className="regime__muted">
              HMM + K-MEANS → XGBOOST
            </text>
          </g>

          {bands.map((b, i) => (
            <rect key={i} className="regime__band" x={b.x} y={Y0 - 6} width={b.w} height={Y1 - Y0 + 6} fill={REGIMES[b.regime].color} style={{ transitionDelay: `${i * 70}ms` }} />
          ))}

          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1={X0} x2={X1} y1={Y0 + (Y1 - Y0) * f} y2={Y0 + (Y1 - Y0) * f} className="regime__grid" />
          ))}

          <path d={area} fill="url(#regime-fill)" className="regime__area" />
          <path d={path} pathLength={1} className="regime__line" />

          {/* regime strip */}
          {bands.map((b, i) => (
            <rect key={`s${i}`} x={b.x} y={290} width={Math.max(0, b.w - 1.5)} height={10} rx={2} fill={REGIMES[b.regime].color} className="regime__strip" style={{ transitionDelay: `${400 + i * 70}ms` }} />
          ))}
          <text x={X0} y={326} className="regime__muted">
            REGIME TIMELINE
          </text>
          <text x={X1} y={326} textAnchor="end" className="regime__muted">
            ALLOCATION FOLLOWS STATE
          </text>

          {hover !== null && hr && (
            <g className="regime__cursor">
              <line x1={hx} x2={hx} y1={Y0 - 6} y2={300} />
              <g transform={`translate(${Math.min(hx + 10, X1 - 150)} ${Y0 + 6})`}>
                <rect width="140" height="44" rx="6" />
                <circle cx="14" cy="15" r="4" fill={hr.color} />
                <text x="24" y="19">
                  {hr.label}
                </text>
                <text x="12" y="35" className="regime__muted">
                  → {hr.strategy}
                </text>
              </g>
            </g>
          )}
        </svg>
      )}
    </VisualFrame>
  );
}
