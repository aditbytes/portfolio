import { useMemo } from 'react';
import { gauss, pathFrom, rng } from './rng';
import { VisualFrame } from './VisualFrame';

const STAGES = ['Data', 'Features', 'Forecast', 'Inv. risk', 'Alert'];
const X0 = 18;
const XS = 440; // forecast start
const X1 = 622;
const Y0 = 104;
const Y1 = 292;
const HIST = 30;
const FC = 8;

export function DemandVisual() {
  const d = useMemo(() => {
    const r = rng(42);
    const val = (i: number) => 38 + 11 * Math.sin(i / 3.1) + 4 * Math.sin(i / 1.3);
    const hist = Array.from({ length: HIST }, (_, i) => val(i) + gauss(r) * 3.2);
    const fc = Array.from({ length: FC + 1 }, (_, k) => val(HIST - 1 + k));
    const inv = Array.from({ length: FC + 1 }, (_, k) => 84 - k * 5.4);
    const safety = 58;
    const y = (v: number) => Y1 - ((Y1 - Y0) * (v - 10)) / (100 - 10);
    const hx = (i: number) => X0 + ((XS - X0) * i) / (HIST - 1);
    const fx = (k: number) => XS + ((X1 - XS) * k) / FC;
    const cross = inv.findIndex((v) => v < safety);
    return {
      hist: pathFrom(hist.map((v, i) => [hx(i), y(v)])),
      fc: pathFrom(fc.map((v, k) => [fx(k), y(v)])),
      band:
        pathFrom(fc.map((v, k) => [fx(k), y(v + 3 + k * 1.4)])) +
        fc
          .map((v, k) => [fx(k), y(v - 3 - k * 1.4)] as [number, number])
          .reverse()
          .map(([x, yy]) => `L${x.toFixed(1)} ${yy.toFixed(1)}`)
          .join('') +
        'Z',
      inv: inv
        .map((v, k) => {
          const x = fx(k);
          const yy = y(v);
          return k === 0 ? `M${x} ${yy}` : `H${x}V${yy}`;
        })
        .join(''),
      safetyY: y(safety),
      riskX: fx(cross),
      riskY: y(inv[cross]),
      invLabel: [fx(1) + 8, y(inv[0]) - 8] as [number, number],
    };
  }, []);

  return (
    <VisualFrame file="demandiq · fig.02" label="Pipeline from data to alert above a chart of weekly sales, a forecast with a confidence band, and inventory falling below safety stock to trigger a high-risk alert">
      {(inView) => (
        <svg className={`demand ${inView ? 'is-drawn' : ''}`} viewBox="0 0 640 360">
          {/* pipeline */}
          <line x1="40" x2="600" y1="40" y2="40" className="demand__rail" />
          <line x1="40" x2="600" y1="40" y2="40" className="demand__flow" />
          {STAGES.map((s, i) => {
            const x = 40 + i * 140;
            return (
              <g key={s} className="demand__stage" style={{ transitionDelay: `${i * 90}ms` }}>
                <circle cx={x} cy="40" r="6" className={i === STAGES.length - 1 ? 'is-alert' : ''} />
                <text x={x} y="66" textAnchor="middle">
                  {s.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* chart */}
          <line x1={XS} x2={XS} y1={Y0 - 8} y2={Y1} className="demand__now" />
          <text x={XS + 6} y={Y0 - 10} className="demand__muted">
            FORECAST →
          </text>
          <text x={X0} y={Y0 - 10} className="demand__muted">
            WEEKLY UNITS · SKU-0417 / STORE-03
          </text>

          <path d={d.band} className="demand__band" />
          <path d={d.hist} pathLength={1} className="demand__hist" />
          <path d={d.fc} pathLength={1} className="demand__fc" />

          <line x1={X0} x2={X1} y1={d.safetyY} y2={d.safetyY} className="demand__safety" />
          <text x={X0} y={d.safetyY - 8} className="demand__safety-label">
            SAFETY STOCK = Z · σ · √L  (95%)
          </text>

          <path d={d.inv} pathLength={1} className="demand__inv" />
          <text x={d.invLabel[0]} y={d.invLabel[1]} className="demand__inv-label">
            INVENTORY
          </text>

          <g className="demand__risk" transform={`translate(${d.riskX} ${d.riskY})`}>
            <circle r="14" className="demand__pulse" />
            <circle r="4.5" />
          </g>

          {/* alert toast */}
          <g className="demand__toast" transform="translate(372 306)">
            <rect width="250" height="40" rx="8" />
            <circle cx="16" cy="20" r="4" />
            <text x="30" y="17">
              TELEGRAM · RISK: HIGH
            </text>
            <text x="30" y="31" className="demand__muted">
              reorder before stockout
            </text>
          </g>

          <g className="demand__pills" transform="translate(18 314)">
            {['LOW', 'MED', 'HIGH'].map((l, i) => (
              <g key={l} transform={`translate(${i * 58} 0)`}>
                <rect width="50" height="22" rx="11" className={l === 'HIGH' ? 'is-on' : ''} />
                <text x="25" y="15" textAnchor="middle">
                  {l}
                </text>
              </g>
            ))}
          </g>
        </svg>
      )}
    </VisualFrame>
  );
}
