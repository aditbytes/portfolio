import { useEffect, useMemo, useRef, useState } from 'react';
import { gauss, rng } from './rng';
import { VisualFrame } from './VisualFrame';

const LAYERS = [6, 8, 8, 2];
const W = 640;
const H = 300;
type Method = 'magnitude' | 'random';

interface Edge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  w: number;
  magRank: number;
  randRank: number;
}

function useNetwork() {
  return useMemo(() => {
    const r = rng(3);
    const xs = LAYERS.map((_, i) => 150 + (i * (W - 210)) / (LAYERS.length - 1));
    const nodes = LAYERS.map((n, li) => Array.from({ length: n }, (_, j) => ({ x: xs[li], y: 30 + ((H - 60) * (j + 0.5)) / n })));
    const edges: Edge[] = [];
    for (let l = 0; l < LAYERS.length - 1; l++) {
      for (const a of nodes[l]) for (const b of nodes[l + 1]) edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, w: Math.abs(gauss(r)), magRank: 0, randRank: r() });
    }
    const byMag = [...edges].sort((a, b) => a.w - b.w);
    byMag.forEach((e, i) => (e.magRank = i / edges.length));
    const maxW = byMag[byMag.length - 1].w;
    const attrBase = Array.from({ length: LAYERS[0] }, () => 0.25 + r() * 0.7);
    const attrNoise = Array.from({ length: LAYERS[0] }, () => gauss(r));
    return { nodes, edges, maxW, attrBase, attrNoise };
  }, []);
}

function Net({ inView, sparsity, method, onAuto }: { inView: boolean; sparsity: number; method: Method; onAuto: (v: number) => void }) {
  const { nodes, edges, maxW, attrBase, attrNoise } = useNetwork();
  const played = useRef(false);

  // First time in view: sweep sparsity 0 → 60% to show the idea.
  useEffect(() => {
    if (!inView || played.current) return;
    played.current = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onAuto(60);
      return;
    }
    let v = 0;
    const id = window.setInterval(() => {
      v += 10;
      onAuto(v);
      if (v >= 60) window.clearInterval(id);
    }, 260);
    return () => window.clearInterval(id);
  }, [inView, onAuto]);

  const s = sparsity / 100;
  const pruned = (e: Edge) => (method === 'magnitude' ? e.magRank : e.randRank) < s;
  // Illustrative only: random pruning scrambles attributions as sparsity rises.
  const attr = attrBase.map((a, i) => (method === 'random' ? Math.min(1, Math.max(0.04, a + attrNoise[i] * s * 0.9)) : a));

  return (
    <svg className="prune" viewBox={`0 0 ${W} ${H}`}>
      {edges.map((e, i) => {
        const off = pruned(e);
        return (
          <line
            key={i}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            className={off ? 'prune__edge is-off' : 'prune__edge'}
            strokeWidth={0.4 + (e.w / maxW) * 1.8}
            style={{ opacity: off ? 0.05 : 0.18 + (e.w / maxW) * 0.6 }}
          />
        );
      })}
      {nodes.flat().map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r="5" className="prune__node" />
      ))}
      {/* attribution bars for input tokens */}
      {nodes[0].map((n, i) => (
        <g key={`a${i}`} transform={`translate(${n.x - 118} ${n.y - 5})`}>
          <rect width="96" height="10" rx="2" className="prune__attr-bg" />
          <rect width={96 * attr[i]} height="10" rx="2" className={`prune__attr prune__attr--${method}`} />
        </g>
      ))}
      <text x="32" y="16" className="prune__muted">
        φ · ATTRIBUTION
      </text>
      <text x={W - 60} y="16" textAnchor="middle" className="prune__muted">
        OUTPUT
      </text>
    </svg>
  );
}

export function PruningVisual() {
  const [sparsity, setSparsity] = useState(0);
  const [method, setMethod] = useState<Method>('magnitude');
  const touched = useRef(false);
  const onAuto = useMemo(
    () => (v: number) => {
      if (!touched.current) setSparsity(v);
    },
    [],
  );

  const readout =
    method === 'magnitude'
      ? 'Low-magnitude weights go first. Explanations stay faithful — reported up to 80% sparsity.'
      : 'Arbitrary weights go. Curvature rises (Hessian up to 14,090 vs 0.73) and SHAP’s linearity breaks.';

  return (
    <VisualFrame
      file="prune_xai · fig.05"
      note="Schematic"
      label="A small neural network with input attribution bars; edges disappear as pruning sparsity increases"
      controls={
        <div className="prune-ctl">
          <div className="prune-ctl__row">
            <label htmlFor="sparsity" className="label">
              Sparsity <b>{sparsity}%</b>
            </label>
            <input
              id="sparsity"
              type="range"
              min={0}
              max={80}
              step={10}
              value={sparsity}
              onChange={(e) => {
                touched.current = true;
                setSparsity(Number(e.target.value));
              }}
            />
          </div>
          <div className="prune-ctl__row" role="group" aria-label="Pruning method">
            {(['magnitude', 'random'] as Method[]).map((m) => (
              <button
                key={m}
                type="button"
                className={`prune-ctl__btn ${method === m ? 'is-on' : ''}`}
                aria-pressed={method === m}
                onClick={() => {
                  touched.current = true;
                  setMethod(m);
                }}
              >
                {m === 'magnitude' ? 'L1 magnitude' : 'Random'}
              </button>
            ))}
          </div>
          <p className="prune-ctl__readout" aria-live="polite">
            {readout}
          </p>
        </div>
      }
    >
      {(inView) => <Net inView={inView} sparsity={sparsity} method={method} onAuto={onAuto} />}
    </VisualFrame>
  );
}
