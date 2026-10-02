import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Browser, Callout, Chip, Clip, Fade, Marker, Mono, Rise } from './components';
import { C, F, easeInOut, kf, tw } from './theme';

export const PORTFOLIO_URL = 'portfolio-one-hazel-4qr78e531q.vercel.app';

/* 00 — OPEN (0–300) -------------------------------------------------- */
export const Open: React.FC = () => {
  const f = useCurrentFrame();
  // browser rises, pushes in, then slides right to make room for the name
  const rise = tw(f, 4, 46, 90, 0);
  const op = tw(f, 4, 30, 0, 1);
  const w = kf(f, [[0, 1500], [150, 1500], [196, 1060]]);
  const x = kf(f, [[0, 960], [150, 960], [196, 1335]]);
  const y = kf(f, [[0, 548], [150, 548], [196, 548]]) + rise;
  const cam = { s: kf(f, [[20, 1.0], [150, 1.07], [196, 1.0], [300, 1.04]]), cx: kf(f, [[20, 960], [150, 820], [196, 960]]), cy: kf(f, [[20, 540], [150, 470], [196, 540]]) };
  const line = tw(f, 0, 30, 0, 1, easeInOut);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, top: 540, height: 1, width: 1920, background: C.ink, transformOrigin: 'center', transform: `scaleX(${line})`, opacity: tw(f, 18, 36, 0.35, 0, easeInOut) }} />
      <Browser x={x} y={y} w={w} url={PORTFOLIO_URL} cam={cam} opacity={op}>
        <Clip name="hero" from={4} />
      </Browser>
      <div style={{ position: 'absolute', left: 110, top: 300, width: 700 }}>
        <Fade at={170}><Mono size={17} color={C.ink2}>[00] &nbsp;Portfolio reel · 2026</Mono></Fade>
        <Rise at={178} dur={26} style={{ marginTop: 18 }}>
          <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 176, letterSpacing: '-0.045em', lineHeight: 0.92, color: C.ink, display: 'flex', alignItems: 'flex-end' }}>
            ADITYA<span style={{ display: 'inline-block', width: 30, height: 30, borderRadius: 30, background: C.lime, marginLeft: 8, marginBottom: 18, boxShadow: `0 0 0 2px ${C.olive}` }} />
          </div>
        </Rise>
        <div style={{ marginTop: 34 }}>
          {['AI/ML Engineer', 'Quant Researcher', 'Data/Systems Builder'].map((r, i) => (
            <Rise key={r} at={200 + i * 9} dur={20}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, fontFamily: F.display, fontSize: 40, fontWeight: 500, color: C.ink, lineHeight: 1.32, letterSpacing: '-0.01em' }}>
                <span style={{ fontFamily: F.mono, fontSize: 15, color: C.mute }}>0{i + 1}</span>{r}
              </div>
            </Rise>
          ))}
        </div>
        <Fade at={236} style={{ marginTop: 34 }}>
          <Mono size={16} color={C.ink2}>B.S. CSDA · IIT Patna · 2025–2029</Mono>
        </Fade>
      </div>
    </AbsoluteFill>
  );
};

/* 01 — SIGNAL (300–525): "I like turning messy data into systems." ---- */
export const Signal: React.FC = () => {
  const f = useCurrentFrame();
  const cam = { s: kf(f, [[0, 1], [70, 1], [150, 1.2]]), cx: kf(f, [[70, 960], [150, 760]]), cy: kf(f, [[70, 540], [150, 520]]) };
  return (
    <AbsoluteFill>
      <Browser x={960} y={545} w={1640} url={PORTFOLIO_URL} cam={cam}>
        <Clip name="signal" from={6} />
        <Callout at={96} x={280} y={432} w={712} h={118} s={cam.s} label="Messy data → systems" side="right" out={196} />
      </Browser>
      <div style={{ position: 'absolute', left: 1160, top: 610, width: 640 }}>
        <Fade at={138} out={205} style={{ background: C.card, borderRadius: 14, padding: '26px 30px', boxShadow: '0 30px 60px -28px rgba(20,20,15,0.35), 0 0 0 1px rgba(17,18,20,0.08)' }}>
          <Mono size={13} color={C.olive}>From the portfolio</Mono>
          <div style={{ fontFamily: F.display, fontSize: 30, lineHeight: 1.25, color: C.ink, marginTop: 12, letterSpacing: '-0.01em' }}>
            “The model is one step. The system around it — data, evaluation, deployment, feedback — <Marker at={160}>is the work.</Marker>”
          </div>
        </Fade>
      </div>
    </AbsoluteFill>
  );
};

/* 01 — WHAT I DO (525–750) ------------------------------------------- */
const KEYWORDS = [
  { w: 'AI / ML', n: 'Agents, fine-tuned LLMs, gradient boosting, explainability.', t: 'DataScout · IndiEye' },
  { w: 'Quantitative Research', n: 'Regimes, alphas, backtests that respect time.', t: 'Regimes · WorldQuant BRAIN' },
  { w: 'Data Systems', n: 'Streaming pipelines from raw reports to verified decisions.', t: 'INDRA · DemandIQ' },
  { w: 'Cloud Infrastructure', n: 'Serverless AWS — Lambda, S3, API Gateway, DynamoDB.', t: 'DataScout' },
];
export const Keywords: React.FC = () => {
  const f = useCurrentFrame();
  const active = Math.min(3, Math.max(0, Math.floor((f - 70) / 34)));
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 120, top: 150 }}>
        <Fade at={4}><Mono size={17} color={C.ink2}>[01] &nbsp;What I work on</Mono></Fade>
      </div>
      {KEYWORDS.map((k, i) => {
        const y = 230 + i * 158;
        const on = f >= 70 && active === i;
        return (
          <div key={k.w} style={{ position: 'absolute', left: 120, top: y, width: 1680, height: 140, borderTop: `1px solid ${C.line}` }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: 1, width: '100%', background: C.ink, transformOrigin: 'left', transform: `scaleX(${tw(f, 8 + i * 8, 40 + i * 8, 0, 1, easeInOut)})` }} />
            <div style={{ position: 'absolute', left: 0, top: 30, fontFamily: F.mono, fontSize: 15, color: C.mute }}><Fade at={14 + i * 8}>0{i + 1}</Fade></div>
            <Rise at={14 + i * 8} dur={24} style={{ position: 'absolute', left: 70, top: 18 }}>
              <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 82, letterSpacing: '-0.035em', color: C.ink, lineHeight: 1 }}>
                {on ? <Marker at={70 + i * 34}>{k.w}</Marker> : k.w}
              </div>
            </Rise>
            <Fade at={30 + i * 8} style={{ position: 'absolute', left: 1080, top: 32, width: 600 }}>
              <div style={{ fontFamily: F.body, fontSize: 24, color: f >= 70 && !on ? C.mute : C.ink2, lineHeight: 1.35 }}>{k.n}</div>
              <Mono size={13} color={C.olive} style={{ marginTop: 10 }}>{k.t}</Mono>
            </Fade>
          </div>
        );
      })}
      <Fade at={60} style={{ position: 'absolute', left: 120, top: 878, width: 1680, borderTop: `1px solid ${C.line}`, paddingTop: 22 }}>
        <Mono size={15} color={C.mute}>Learning now &nbsp;→&nbsp; MLOps &amp; inference engineering</Mono>
      </Fade>
    </AbsoluteFill>
  );
};

/* 01 — ABOUT (750–975) ----------------------------------------------- */
const FACTS = [
  { k: 'Education', v: 'Indian Institute of Technology Patna', s: 'B.S. Computer Science & Data Analytics · 2025–2029' },
  { k: 'Certification', v: 'NISM Series VIII', s: 'Equity Derivatives Certification Examination' },
  { k: 'Based', v: 'Patna, Bihar, India', s: 'Seeking AI/ML, data science, quant research and backend internships' },
];
export const About: React.FC = () => {
  const f = useCurrentFrame();
  const cam = { s: kf(f, [[0, 1], [80, 1], [150, 1.42]]), cx: kf(f, [[80, 960], [150, 1290]]), cy: kf(f, [[80, 540], [150, 360]]) };
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 110, top: 220, width: 520 }}>
        <Fade at={4}><Mono size={17} color={C.ink2}>[01] &nbsp;About</Mono></Fade>
        {FACTS.map((x, i) => (
          <Fade key={x.k} at={30 + i * 14} style={{ marginTop: i ? 34 : 44, paddingTop: 22, borderTop: `1px solid ${C.line}` }}>
            <Mono size={13} color={C.olive}>{x.k}</Mono>
            <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 34, color: C.ink, marginTop: 10, letterSpacing: '-0.015em', lineHeight: 1.12 }}>{x.v}</div>
            <div style={{ fontFamily: F.body, fontSize: 20, color: C.mute, marginTop: 8, lineHeight: 1.35 }}>{x.s}</div>
          </Fade>
        ))}
      </div>
      <Browser x={1250} y={540} w={1180} url={`${PORTFOLIO_URL}/#about`} cam={cam}>
        <Clip name="about" from={0} />
      </Browser>
    </AbsoluteFill>
  );
};

/* 02 — STACK (975–1350) ---------------------------------------------- */
const LANES = [
  { k: 'ML & AI', items: ['XGBoost', 'Scikit-learn', 'TensorFlow', 'HMM', 'K-Means', 'Prophet', 'Llama 3', 'SHAP'] },
  { k: 'Quant research', items: ['Alpha research', 'WorldQuant BRAIN', 'Backtesting', 'Regime detection', 'Sharpe / drawdown'] },
  { k: 'Backend & data', items: ['FastAPI', 'PostgreSQL', 'PostGIS', 'Redis', 'Redpanda / Kafka', 'H3', 'Docker', 'Pandas'] },
  { k: 'Cloud', items: ['AWS', 'S3', 'Lambda', 'API Gateway', 'Bedrock', 'IAM', 'DynamoDB'] },
  { k: 'Web & MLOps', items: ['Next.js', 'React', 'Streamlit', 'MLflow'] },
];
const SYSTEM = ['Data', 'Signal', 'Model', 'Evaluation', 'Deployment', 'Feedback'];
export const Stack: React.FC = () => {
  const f = useCurrentFrame();
  const shrink = tw(f, 262, 300, 0, 1, easeInOut);
  const rootX = 120, rootY = 470;
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 120, top: 130 }}>
        <Fade at={4}><Mono size={17} color={C.ink2}>[02] &nbsp;Toolchain</Mono></Fade>
        <Rise at={10} dur={24} style={{ marginTop: 16 }}>
          <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 64, letterSpacing: '-0.035em', color: C.ink }}>Data → Signal → Model → Decision</div>
        </Rise>
      </div>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: '50% 30%', transform: `translateY(${-24 * shrink}px) scale(${1 - 0.07 * shrink})`, opacity: 1 - 0.25 * shrink }}>
        {/* root */}
        <Fade at={24} style={{ position: 'absolute', left: rootX, top: rootY, width: 380, background: C.ink, color: '#fff', borderRadius: 18, padding: '28px 30px', boxShadow: '0 30px 60px -30px rgba(0,0,0,0.5)' }}>
          <Mono size={13} color={C.lime}>Languages</Mono>
          <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 64, letterSpacing: '-0.03em', marginTop: 6 }}>Python</div>
          <div style={{ fontFamily: F.mono, fontSize: 18, color: '#BDBDBD', marginTop: 8 }}>SQL · C++ · JavaScript · Rust</div>
        </Fade>
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
          {LANES.map((l, i) => {
            const y1 = 312 + i * 128 + 22;
            const x0 = rootX + 380, y0 = rootY + 95, x1 = 690;
            const d = `M ${x0} ${y0} C ${x0 + 110} ${y0}, ${x1 - 110} ${y1}, ${x1} ${y1}`;
            const p = tw(f, 40 + i * 9, 70 + i * 9, 0, 1, easeInOut);
            return <path key={i} d={d} fill="none" stroke={C.ink} strokeWidth={1.6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
          })}
        </svg>
        {LANES.map((l, i) => {
          const y = 312 + i * 128;
          return (
            <div key={l.k} style={{ position: 'absolute', left: 700, top: y, width: 1120 }}>
              <div style={{ position: 'absolute', left: -14, top: 16, width: 12, height: 12, borderRadius: 12, background: C.lime, boxShadow: `0 0 0 1.5px ${C.ink}`, opacity: tw(f, 66 + i * 9, 74 + i * 9, 0, 1) }} />
              <Fade at={66 + i * 9} style={{ marginLeft: 14 }}>
                <Mono size={14} color={C.ink}>{l.k}</Mono>
              </Fade>
              <div style={{ marginTop: 12, marginLeft: 14, display: 'flex', flexWrap: 'wrap' }}>
                {l.items.map((it, j) => <Chip key={it} at={76 + i * 9 + j * 3} style={{ fontSize: 18, padding: '8px 15px' }}>{it}</Chip>)}
              </div>
            </div>
          );
        })}
      </div>
      {/* system strip */}
      <div style={{ position: 'absolute', left: 120, top: 905, width: 1680 }}>
        <Fade at={278}><Mono size={14} color={C.olive}>How I think about systems</Mono></Fade>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 16 }}>
          {SYSTEM.map((s, i) => (
            <React.Fragment key={s}>
              <Fade at={286 + i * 7} dy={10}>
                <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 40, letterSpacing: '-0.02em', color: C.ink, padding: '10px 22px', border: `1px solid ${i === 5 ? C.ink : C.line}`, borderRadius: 999, background: i === 5 ? C.lime : '#fff' }}>{s}</div>
              </Fade>
              {i < SYSTEM.length - 1 && <div style={{ width: 46, height: 2, background: C.ink, margin: '0 8px', transformOrigin: 'left', transform: `scaleX(${tw(f, 290 + i * 7, 302 + i * 7, 0, 1)})` }} />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* 03 — SELECTED WORK (1350–1425) ------------------------------------- */
export const WorkIntro: React.FC = () => {
  const f = useCurrentFrame();
  const names = ['INDRA', 'Market Regime Detection', 'DemandIQ', 'IndiEye'];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', paddingLeft: 120 }}>
      <Fade at={0}><Mono size={17} color={C.ink2}>[03] &nbsp;Selected work</Mono></Fade>
      <Rise at={4} dur={22} style={{ marginTop: 16 }}>
        <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 210, letterSpacing: '-0.05em', lineHeight: 0.9, color: C.ink }}>SELECTED</div>
      </Rise>
      <Rise at={10} dur={22}>
        <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 210, letterSpacing: '-0.05em', lineHeight: 0.95, color: 'transparent', WebkitTextStroke: `2.5px ${C.ink}` }}>WORK</div>
      </Rise>
      <div style={{ display: 'flex', gap: 34, marginTop: 40 }}>
        {names.map((n, i) => (
          <Fade key={n} at={22 + i * 6} dy={10}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: F.mono, fontSize: 15, color: C.mute }}>0{i + 1}</span>
              <span style={{ fontFamily: F.display, fontSize: 30, fontWeight: 500, color: C.ink }}>{n}</span>
            </div>
          </Fade>
        ))}
      </div>
      <div style={{ position: 'absolute', right: 120, bottom: 140, width: tw(f, 20, 60, 0, 520, easeInOut), height: 2, background: C.ink }} />
    </AbsoluteFill>
  );
};
