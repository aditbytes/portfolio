import React from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame } from 'remotion';
import { Browser, Callout, Chip, Clip, CodeCard, Counter, CursorOverlay, Fade, Flow, Marker, Mono, Rise } from './components';
import { PORTFOLIO_URL } from './scenes1';
import { C, F, easeInOut, kf, tw } from './theme';
import diqMouse from '../public/clips/diq.json';

/* ------------------------------------------------------------------ */
/* Shared project layout: spec rail on the left, stage on the right.   */
/* ------------------------------------------------------------------ */
const STAGE = { x: 1225, y: 560, w: 1200 };

const Shell: React.FC<{
  dur: number; idx: string; cat: string; title: string; titleSize?: number; sub: string; ctx: string; chips: string[]; children: React.ReactNode;
}> = ({ dur, idx, cat, title, titleSize = 96, sub, ctx, chips, children }) => {
  const f = useCurrentFrame();
  const out = tw(f, dur - 16, dur, 0, 1, easeInOut);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 110, top: 190, width: 470, opacity: 1 - out, transform: `translateX(${-40 * out}px)` }}>
        <Fade at={0}><Mono size={16} color={C.ink2}>{idx} / 04 &nbsp;·&nbsp; {cat}</Mono></Fade>
        <div style={{ height: 2, background: C.ink, marginTop: 18, width: tw(f, 2, 30, 0, 470, easeInOut) }} />
        <Rise at={6} dur={26} style={{ marginTop: 26 }}>
          <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: titleSize, letterSpacing: '-0.045em', lineHeight: 0.95, color: C.ink }}>{title}</div>
        </Rise>
        <Fade at={18} style={{ marginTop: 22 }}>
          <div style={{ fontFamily: F.body, fontSize: 24, color: C.ink2, lineHeight: 1.35 }}>{sub}</div>
        </Fade>
        <Fade at={26} style={{ marginTop: 22 }}>
          <Mono size={14} color={C.olive} style={{ lineHeight: 1.6 }}>{ctx}</Mono>
        </Fade>
        <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap' }}>
          {chips.map((c, i) => <Chip key={c} at={32 + i * 3}>{c}</Chip>)}
        </div>
      </div>
      <AbsoluteFill style={{ opacity: 1 - out, transform: `translateX(${-60 * out}px) scale(${1 - 0.08 * out})`, transformOrigin: '30% 50%' }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** A stage segment that crossfades in and out. */
const Seg: React.FC<{ from: number; to: number; children: React.ReactNode; first?: boolean }> = ({ from, to, children, first }) => {
  const f = useCurrentFrame();
  if (f < from - 1 || f > to + 1) return null;
  const inP = first ? tw(f, from, from + 26, 0, 1) : tw(f, from, from + 16, 0, 1, easeInOut);
  const outP = tw(f, to - 12, to, 0, 1, easeInOut);
  const s = first ? tw(f, from, from + 30, 0.86, 1) : tw(f, from, from + 20, 1.03, 1);
  return <AbsoluteFill style={{ opacity: inP * (1 - outP), transform: `scale(${s * (1 - 0.03 * outP)})`, transformOrigin: `${STAGE.x}px ${STAGE.y}px` }}>{children}</AbsoluteFill>;
};

const Caption: React.FC<{ at: number; children: React.ReactNode; y?: number }> = ({ at, children, y = 948 }) => (
  <Fade at={at} style={{ position: 'absolute', left: STAGE.x - STAGE.w / 2, top: y, width: STAGE.w, display: 'flex', alignItems: 'center', gap: 10 }}>
    <span style={{ width: 8, height: 8, borderRadius: 8, background: C.mute }} />
    <Mono size={13} color={C.mute}>{children}</Mono>
  </Fade>
);

const Stat: React.FC<{ at: number; value: React.ReactNode; label: string; big?: boolean }> = ({ at, value, label, big }) => (
  <Fade at={at} style={{ borderTop: `2px solid ${C.ink}`, paddingTop: 18 }}>
    <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: big ? 150 : 104, letterSpacing: '-0.05em', lineHeight: 0.95, color: C.ink }}>{value}</div>
    <Mono size={14} color={C.ink2} style={{ marginTop: 14, lineHeight: 1.5 }}>{label}</Mono>
  </Fade>
);

/* 01 — INDRA (1425–1950, 525f) --------------------------------------- */
export const Indra: React.FC = () => {
  const f = useCurrentFrame();
  const lf = f - 40; // stage A local
  const cam = {
    s: kf(lf, [[0, 1], [100, 1], [128, 1.5], [168, 1.5], [190, 1.5]]),
    cx: kf(lf, [[100, 960], [128, 660], [168, 660], [190, 1230]]),
    cy: kf(lf, [[100, 540], [128, 390], [168, 390], [190, 380]]),
  };
  return (
    <Shell dur={525} idx="01" cat="Data platform" title="INDRA" titleSize={120}
      sub="Intelligent National Disaster & Weather Platform — verified, explainable weather events for emergency operations centres."
      ctx="Smart India Hackathon 2026 · Team Sixth Sense · Core Platform Engineer (Backend)"
      chips={['Python', 'FastAPI', 'PostGIS', 'Redpanda', 'Redis', 'H3', 'DBSCAN', 'Docker']}>
      <Seg from={34} to={258} first>
        <Browser x={STAGE.x} y={STAGE.y - 20} w={STAGE.w} url={`${PORTFOLIO_URL}/#work`} cam={cam}>
          <div style={{ position: 'absolute', inset: 0 }}><Clip name="work_indra" from={150} /></div>
          <Callout at={40 + 118} x={360} y={140} w={556} h={466} s={cam.s} label="DBSCAN + H3 · space-time clusters" side="top" out={40 + 168} />
          <Callout at={40 + 192} x={922} y={140} w={636} h={466} s={cam.s} label="7-factor verification receipt" side="top" />
        </Browser>
        <Caption at={60} y={938}>Portfolio · INDRA card · receipt from the recorded demo, map illustrative</Caption>
      </Seg>
      <Seg from={252} to={408}>
        <div style={{ position: 'absolute', left: 625, top: 220 }}>
          <Mono size={15} color={C.ink2}>What I built · core platform, layers 1–3 and 5–8a</Mono>
        </div>
        <Flow at={262} x={625} y={270} w={1200} per={7} size={24}
          steps={[{ t: 'Reports + feeds', s: 'NDMA SACHET · METAR · Open-Meteo' }, { t: 'Redpanda', s: 'Outbox · DLQ · data lake' }, { t: 'Clean · geocode', s: '737-district gazetteer' }, { t: 'DBSCAN + H3', s: 'One event per incident' }]} highlight={[3]} />
        <Flow at={292} x={625} y={450} w={1200} per={7} size={24}
          steps={[{ t: 'Evidence', s: 'METAR · IMD / CWC / SDMA' }, { t: 'Verification receipt', s: '7 deterministic factors' }, { t: 'Human review', s: 'Hash-chained audit ledger' }, { t: 'Verified event', s: 'REST + WebSocket push' }]} highlight={[1]} offset={4} />
        <Fade at={330} style={{ position: 'absolute', left: 625, top: 650, width: 1200 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            {[['CORROBORATED', C.lime, C.ink], ['CONTRADICTED', C.warm, '#fff'], ['UNCONFIRMED', '#fff', C.ink]].map(([t, bg, fg], i) => (
              <span key={t} style={{ fontFamily: F.mono, fontSize: 18, fontWeight: 600, letterSpacing: '0.08em', padding: '10px 16px', borderRadius: 8, background: bg as string, color: fg as string, border: `1px solid ${C.ink}`, opacity: tw(f, 330 + i * 6, 342 + i * 6, 0, 1) }}>{t}</span>
            ))}
          </div>
          <div style={{ fontFamily: F.display, fontSize: 32, color: C.ink, marginTop: 28, letterSpacing: '-0.015em', lineHeight: 1.25, maxWidth: 1100 }}>
            Same cluster + same evidence → <Marker at={352}>a byte-identical receipt.</Marker> Absent signals are marked offline, never invented.
          </div>
        </Fade>
      </Seg>
      <Seg from={402} to={525}>
        <div style={{ position: 'absolute', left: 625, top: 250, width: 1200, display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 60, rowGap: 56 }}>
          <Stat at={410} value={<Counter at={410} to={691} dur={40} />} label="Commits · #1 contributor" />
          <Stat at={416} value={<Counter at={416} to={1788} dur={44} comma />} label="Tests passing · latest recorded run" />
          <Stat at={422} value={<Counter at={422} to={16} dur={30} />} label="Hazard types tagged" />
          <Stat at={428} value={<Counter at={428} to={7} dur={24} />} label="Factor verification receipt" />
        </div>
        <Caption at={440} y={900}>Source: INDRA README (run of 27 Sep 2026) and GitHub contributor insights, as cited on the portfolio</Caption>
      </Seg>
    </Shell>
  );
};

/* 02 — MARKET REGIME DETECTION (1950–2550, 600f) ---------------------- */
const RegimeBox: React.FC<{ at: number; x: number; y: number; w: number; label: string; sub?: string; dark?: boolean; children?: React.ReactNode }> = ({ at, x, y, w, label, sub, dark, children }) => (
  <Fade at={at} style={{ position: 'absolute', left: x, top: y, width: w, background: dark ? C.ink : '#fff', color: dark ? '#fff' : C.ink, borderRadius: 14, border: `1px solid ${dark ? C.ink : C.line}`, padding: '18px 20px', boxSizing: 'border-box', boxShadow: '0 16px 34px -20px rgba(20,20,15,0.35)' }}>
    <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 28, letterSpacing: '-0.02em' }}>{label}</div>
    {sub && <div style={{ fontFamily: F.body, fontSize: 18, color: dark ? '#C8C8C8' : C.mute, marginTop: 6, lineHeight: 1.35 }}>{sub}</div>}
    {children}
  </Fade>
);
const Arrow: React.FC<{ at: number; x: number; y: number; w?: number; h?: number }> = ({ at, x, y, w = 0, h = 0 }) => {
  const f = useCurrentFrame();
  const p = tw(f, at, at + 14, 0, 1, easeInOut);
  const vertical = h > 0;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: vertical ? 2 : w * p, height: vertical ? h * p : 2, background: C.ink }}>
      <div style={{ position: 'absolute', [vertical ? 'bottom' : 'right']: -6, [vertical ? 'left' : 'top']: -5, width: 0, height: 0, opacity: p,
        ...(vertical ? { borderTop: `7px solid ${C.ink}`, borderLeft: '6px solid transparent', borderRight: '6px solid transparent' } : { borderLeft: `7px solid ${C.ink}`, borderTop: '6px solid transparent', borderBottom: '6px solid transparent' }) }} />
    </div>
  );
};
const Bars: React.FC<{ at: number; x: number; y: number; title: string; a: number; b: number; max: number; unit?: string; down?: boolean; la: string; lb: string }> = ({ at, x, y, title, a, b, max, unit = '%', down, la, lb }) => {
  const f = useCurrentFrame();
  const H = 300, BW = 120;
  const ha = tw(f, at + 8, at + 44, 0, a / max * H), hb = tw(f, at + 14, at + 50, 0, b / max * H);
  const bar = (h: number, color: string, xx: number, v: number, lab: string, d: number) => (
    <div style={{ position: 'absolute', left: xx, top: down ? 40 : 40 + H - h, width: BW, height: h, background: color, border: `1.5px solid ${C.ink}`, borderRadius: 4 }}>
      <div style={{ position: 'absolute', left: 0, width: BW, textAlign: 'center', [down ? 'bottom' : 'top']: -48, fontFamily: F.display, fontWeight: 700, fontSize: 38, color: C.ink, letterSpacing: '-0.03em', opacity: tw(f, at + d + 30, at + d + 42, 0, 1) }}>
        {down ? '−' : ''}<Counter at={at + d} to={v} dur={36} decimals={v % 1 ? 1 : 0} />{unit}
      </div>
      <div style={{ position: 'absolute', left: -20, width: BW + 40, textAlign: 'center', [down ? 'top' : 'bottom']: down ? -34 : -34, fontFamily: F.mono, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.ink2 }} />
    </div>
  );
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 330, height: H + 140 }}>
      <Fade at={at}><Mono size={15} color={C.ink}>{title}</Mono></Fade>
      <div style={{ position: 'absolute', left: 0, top: down ? 40 : 40 + H, width: 330, height: 2, background: C.ink, transformOrigin: 'left', transform: `scaleX(${tw(f, at, at + 16, 0, 1)})` }} />
      {bar(ha, C.lime, 30, a, la, 8)}
      {bar(hb, '#D9D7CF', 180, b, lb, 14)}
      <div style={{ position: 'absolute', left: 0, top: down ? H + 104 : H + 66, width: 330, display: 'flex', fontFamily: F.mono, fontSize: 13, letterSpacing: '0.06em', color: C.ink2, textTransform: 'uppercase', opacity: tw(f, at + 20, at + 32, 0, 1) }}>
        <div style={{ width: 180, paddingLeft: 30 - 6 }}>{la}</div><div style={{ width: 150 }}>{lb}</div>
      </div>
    </div>
  );
};

export const Regime: React.FC = () => {
  const f = useCurrentFrame();
  const lf = f - 36;
  const cam = { s: kf(lf, [[0, 1], [120, 1], [160, 1.32]]), cx: kf(lf, [[120, 960], [160, 840]]), cy: kf(lf, [[120, 540], [160, 430]]) };
  return (
    <Shell dur={600} idx="02" cat="Quant research" title={'Market Regime Detection Framework'} titleSize={70}
      sub="Hybrid HMM + K-Means regimes on 15 years of NIFTY 50; XGBoost predicts the regime, the strategy follows it."
      ctx="Research paper (IEEE format)"
      chips={['Python', 'HMM', 'K-Means', 'XGBoost', 'MLflow', 'Streamlit']}>
      <Seg from={30} to={240} first>
        <Browser x={STAGE.x} y={STAGE.y - 20} w={STAGE.w} url={`${PORTFOLIO_URL}/work/market-regime-detection`} cam={cam}>
          <Clip name="regime" from={34} />
          <Callout at={36 + 150} x={334} y={290} w={1010} h={526} s={cam.s} label="Regime timeline → allocation follows state" side="top" />
        </Browser>
        <Caption at={60} y={938}>Portfolio case study · chart labelled “illustrative data” on the site</Caption>
      </Seg>
      <Seg from={234} to={426}>
        <div style={{ position: 'absolute', left: 625, top: 190 }}><Mono size={15} color={C.ink2}>How it works</Mono></div>
        <RegimeBox at={244} x={625} y={240} w={330} label="NIFTY 50 · 15 years" sub="28 engineered features — realized vol, VIX dynamics, skew" />
        <Arrow at={256} x={962} y={300} w={56} />
        <RegimeBox at={262} x={1028} y={240} w={380} label="HMM + K-Means" sub="Hybrid, unsupervised regime labelling" dark>
          <div style={{ fontFamily: F.mono, fontSize: 20, color: C.lime, marginTop: 12 }}>P(sₜ | sₜ₋₁) · P(xₜ | sₜ)</div>
        </RegimeBox>
        <Arrow at={272} x={1415} y={300} w={56} />
        <RegimeBox at={278} x={1481} y={240} w={340} label="XGBoost" sub="Predicts the regime · sample weighting for rare crisis periods" />
        <Arrow at={292} x={1217} y={430} h={70} />
        <div style={{ position: 'absolute', left: 625, top: 520, width: 1196, display: 'flex', gap: 16 }}>
          {[['Low-volatility', 'Mean reversion', '#E5E3DC'], ['Trending', 'Breakout', C.lime], ['Crisis', 'Risk-off', C.warm]].map(([r, s, col], i) => (
            <Fade key={r} at={300 + i * 8} style={{ flex: 1, borderRadius: 14, border: `1.5px solid ${C.ink}`, overflow: 'hidden', background: '#fff' }}>
              <div style={{ height: 14, background: col as string, borderBottom: `1.5px solid ${C.ink}` }} />
              <div style={{ padding: '18px 22px' }}>
                <Mono size={13} color={C.mute}>Regime 0{i + 1}</Mono>
                <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 34, color: C.ink, marginTop: 6, letterSpacing: '-0.02em' }}>{r}</div>
                <div style={{ fontFamily: F.body, fontSize: 20, color: C.ink2, marginTop: 8 }}>→ {s}</div>
              </div>
            </Fade>
          ))}
        </div>
        <Fade at={336} style={{ position: 'absolute', left: 625, top: 790, width: 1196 }}>
          <div style={{ fontFamily: F.display, fontSize: 34, color: C.ink, letterSpacing: '-0.015em' }}>
            The first question isn’t what to trade — <Marker at={350}>it’s what kind of market this is.</Marker>
          </div>
        </Fade>
      </Seg>
      <Seg from={420} to={600}>
        <div style={{ position: 'absolute', left: 625, top: 200 }}><Mono size={15} color={C.ink2}>Results · as reported in the project write-up</Mono></div>
        <div style={{ position: 'absolute', left: 625, top: 262, width: 400 }}>
          <Stat at={430} big value={<Counter at={430} to={78} dur={40} suffix="%" />} label="Regime prediction accuracy · XGBoost with sample weighting" />
        </div>
        <Bars at={440} x={1100} y={250} title="CAGR" a={14.2} b={10.8} max={16} la="Regime" lb="Buy & hold" />
        <Bars at={458} x={1480} y={250} title="Max drawdown" a={18} b={50} max={52} down la="Regime" lb="Buy & hold" />
        <Fade at={500} style={{ position: 'absolute', left: 625, top: 690, width: 420 }}>
          <div style={{ fontFamily: F.display, fontSize: 30, color: C.ink, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
            Exited before the <Marker at={512}>2020 COVID crash.</Marker>
          </div>
        </Fade>
        <Caption at={480} y={900}>Backtest results as reported in the project write-up · historical, not a forecast</Caption>
      </Seg>
    </Shell>
  );
};

/* 03 — DEMANDIQ (2550–3030, 480f) ------------------------------------ */
export const DemandIQ: React.FC = () => {
  const f = useCurrentFrame();
  const lf = f - 34;
  const RATE = 1.12, FROM = 12;
  const cam = {
    s: kf(lf, [[0, 1], [112, 1], [146, 1.38], [215, 1.38], [250, 1.38]]),
    cx: kf(lf, [[112, 960], [146, 1040], [215, 1040], [250, 1260]]),
    cy: kf(lf, [[112, 540], [146, 700], [215, 700], [250, 760]]),
  };
  return (
    <Shell dur={480} idx="03" cat="ML platform" title="DemandIQ" titleSize={104}
      sub="Retail demand forecasting & replenishment — from sales history to a reorder quantity and a risk alert."
      ctx="Capstone-I · IIT Patna · Led model training"
      chips={['Prophet', 'XGBoost', 'FastAPI', 'Streamlit', 'MLflow', 'Walmart M5']}>
      <Seg from={30} to={300} first>
        <Browser x={STAGE.x} y={STAGE.y - 20} w={STAGE.w} url="DemandIQ · Streamlit dashboard" cam={cam} dark={false}>
          <Clip name="diq" from={FROM} rate={RATE} />
          <CursorOverlay name="diq" from={FROM} rate={RATE} data={diqMouse as any} />
          <Callout at={34 + 150} x={440} y={560} w={940} h={440} s={cam.s} label="14-day forecast" side="top" out={34 + 214} />
        </Browser>
        <Caption at={60} y={938}>Real dashboard from github.com/aditbytes/Demand_IQ, run locally · demo-mode sample data</Caption>
      </Seg>
      <Seg from={294} to={480}>
        <CodeCard at={300} w={760} size={19} style={{ position: 'absolute', left: 625, top: 200 }}
          file="inventory/safety_stock.py" repo="aditbytes/Demand_IQ"
          rows={[
            [43, 'def calculate_safety_stock(df, store_id, sku, lead_time=DEFAULT_LEAD_TIME):'.slice(0, 55) + '…'],
            [null, 'docstring'],
            [53, '    # Get demand standard deviation'],
            [54, '    sigma = calculate_demand_std(df, store_id, sku)'],
            [55, ''],
            [56, '    if sigma is None:'],
            [57, '        return None'],
            [58, ''],
            [59, '    # Safety stock formula'],
            [60, '    safety_stock = Z_SCORE * sigma * np.sqrt(lead_time)'],
            [61, ''],
            [62, '    return max(0, safety_stock)  # Cannot be negative'],
          ]}
          hl={[{ line: 60, at: 330 }]} />
        <Fade at={348} style={{ position: 'absolute', left: 1420, top: 210, width: 420 }}>
          <Mono size={14} color={C.olive}>Reorder decision</Mono>
          <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 50, color: C.ink, marginTop: 14, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            SS = Z × σ × √L
          </div>
          <div style={{ fontFamily: F.body, fontSize: 21, color: C.ink2, marginTop: 14, lineHeight: 1.4 }}>
            95% service level → Z ≈ 1.65. Inventory classified LOW / MED / HIGH risk; HIGH triggers a Telegram alert.
          </div>
        </Fade>
        <div style={{ position: 'absolute', left: 625, top: 700 }}><Fade at={366}><Mono size={14} color={C.ink2}>6-layer pipeline</Mono></Fade></div>
        <Flow at={372} x={625} y={736} w={1200} per={6} size={21}
          steps={[{ t: 'Ingest' }, { t: 'Clean' }, { t: 'Features', s: '7·14·28-day lags' }, { t: 'Forecast', s: 'Prophet · XGBoost' }, { t: 'Inventory risk', s: 'Safety stock' }, { t: 'Alert', s: 'Telegram' }]} highlight={[3]} />
      </Seg>
    </Shell>
  );
};

/* 04 — INDIEYE (3030–3375, 345f) ------------------------------------- */
export const IndiEye: React.FC = () => {
  const f = useCurrentFrame();
  const lf = f - 30;
  const cam = { s: kf(lf, [[0, 1], [70, 1], [110, 1.22]]), cx: kf(lf, [[70, 960], [110, 960]]), cy: kf(lf, [[70, 540], [110, 560]]) };
  return (
    <Shell dur={345} idx="04" cat="AI system · open source" title="IndiEye" titleSize={110}
      sub="Market intelligence: news, X/Reddit chatter and SEC filings, read by a fine-tuned Llama 3 and lined up against price action."
      ctx="Open source · 2026 – present"
      chips={['Next.js', 'FastAPI', 'PostgreSQL', 'Llama 3', 'AWS']}>
      <Seg from={28} to={168} first>
        <Browser x={STAGE.x} y={STAGE.y - 20} w={STAGE.w} url={`${PORTFOLIO_URL}/#work`} cam={cam}>
          <Clip name="indieye" from={62} rate={1.1} />
        </Browser>
        <Caption at={50} y={938}>Portfolio · interface concept, labelled illustrative on the site</Caption>
      </Seg>
      <Seg from={162} to={345}>
        <CodeCard at={168} w={800} size={18} style={{ position: 'absolute', left: 625, top: 190 }}
          file="training/train_regime.py" repo="aditbytes/Indieye-ml"
          rows={[
            [63, '    # ── Walk-Forward Cross-Validation ──'],
            [65, '    splits = walk_forward_split(X, y_encoded, n_splits=5)'],
            [66, '    cv_accuracies = []'],
            [67, ''],
            [68, '    for i, (train_idx, test_idx) in enumerate(splits):'],
            [69, '        X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]'],
            [null, 'scale per fold'],
            [78, '        model = XGBClassifier(**REGIME_PARAMS)'],
            [79, '        model.fit('],
            [80, '            X_train_s, y_train,'],
            [81, '            eval_set=[(X_test_s, y_test)],'],
            [82, '            verbose=False,'],
            [83, '        )'],
          ].map(([n, t]) => [n, t] as [number | null, string]).filter(([n]) => n !== 63) as [number | null, string][]}
          hl={[{ line: 65, at: 196 }, { line: 78, at: 214 }]} />
        <Fade at={226} style={{ position: 'absolute', left: 1460, top: 200, width: 380 }}>
          <Mono size={14} color={C.olive}>indieye-ml · FastAPI service</Mono>
          <div style={{ marginTop: 18 }}>
            {['/api/ml/regime', '/api/ml/strategy', '/api/ml/key-levels', '/api/ml/market-radar', '/api/ml/backtest'].map((p, i) => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: `1px solid ${C.line}`, opacity: tw(f, 232 + i * 6, 244 + i * 6, 0, 1) }}>
                <span style={{ fontFamily: F.mono, fontSize: 13, fontWeight: 700, color: C.ink, background: C.lime, padding: '3px 8px', borderRadius: 5 }}>GET</span>
                <span style={{ fontFamily: F.mono, fontSize: 19, color: C.ink }}>{p}</span>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: F.body, fontSize: 19, color: C.ink2, marginTop: 20, lineHeight: 1.4 }}>
            Walk-forward validation — every fold trains on the past and tests on the future.
          </div>
        </Fade>
        <Caption at={240} y={900}>Real code · public repositories Indieye-ml and Indieye-news-sentiment</Caption>
      </Seg>
    </Shell>
  );
};

/* 03 — ALSO BUILT (3375–3600, 225f) ---------------------------------- */
const MORE = [
  { t: 'DataScout', s: 'Agentic AI data analyst on Amazon Bedrock — writes Python, runs it in a sandbox.', c: ['Bedrock', 'Lambda', 'Team lead · 4'], clip: 84 },
  { t: 'Sanjivani AI', s: 'Multimodal crisis intelligence for Bihar floods — text, satellite and tabular.', c: ['DistilBERT', 'U-Net', 'YOLOv8', '34/34 tests'], clip: 180 },
  { t: 'LLM Pruning & Explainability', s: 'Magnitude pruning keeps explanations faithful up to 80% sparsity.', c: ['SHAP', 'Integrated Gradients', 'RoBERTa'], clip: 369 },
  { t: 'CNN Candlestick Recognizer', s: 'OHLC windows → 64×64 chart images → 2D CNN, with live inference over WebSocket.', c: ['TensorFlow', 'TA-Lib', 'WebSocket'], clip: -1 },
];
export const More: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 120, top: 120 }}>
        <Fade at={0}><Mono size={17} color={C.ink2}>[03] &nbsp;Also built</Mono></Fade>
      </div>
      {MORE.map((m, i) => {
        const col = i % 2, row = Math.floor(i / 2);
        const x = 120 + col * 860, y = 180 + row * 420;
        const a = 6 + i * 7;
        return (
          <div key={m.t} style={{ position: 'absolute', left: x, top: y, width: 820, height: 390, opacity: tw(f, a, a + 16, 0, 1), transform: `translateY(${tw(f, a, a + 22, 30, 0)}px)`, background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 30px 60px -34px rgba(20,20,15,0.35), 0 0 0 1px rgba(17,18,20,0.08)' }}>
            <div style={{ position: 'relative', width: 820, height: 230, overflow: 'hidden', background: '#060606' }}>
              {m.clip >= 0 ? (
                <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `scale(${820 / 1360}) translate(${-280}px, ${-118 - tw(f, a, a + 120, 0, 40, easeInOut)}px)` }}>
                  <Clip name="more" from={m.clip} rate={0} />
                </div>
              ) : (
                <div style={{ position: 'absolute', inset: 0, background: C.paper2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                  {['OHLC · 20 candles', '64×64 image', '2D CNN', 'Pattern'].map((s, j) => (
                    <React.Fragment key={s}>
                      <div style={{ fontFamily: F.mono, fontSize: 17, color: j === 2 ? '#fff' : C.ink, background: j === 2 ? C.ink : '#fff', border: `1px solid ${C.ink}`, borderRadius: 8, padding: '12px 14px', opacity: tw(f, a + 10 + j * 6, a + 20 + j * 6, 0, 1) }}>{s}</div>
                      {j < 3 && <span style={{ fontFamily: F.mono, fontSize: 20, color: C.ink }}>→</span>}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: '18px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 32, color: C.ink, letterSpacing: '-0.02em' }}>{m.t}</div>
                <div style={{ display: 'flex' }}>{m.c.map((c) => <Chip key={c} style={{ fontSize: 12, padding: '5px 10px', marginBottom: 0 }}>{c}</Chip>)}</div>
              </div>
              <div style={{ fontFamily: F.body, fontSize: 19, color: C.ink2, marginTop: 8 }}>{m.s}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* 04 — EXPERIENCE (3600–3900, 300f) ---------------------------------- */
const EXP = [
  { p: 'Sep 2026 – Present', o: 'Smart India Hackathon 2026', r: 'Core Platform Engineer (Backend) · INDRA', at: 0 },
  { p: 'Feb – Mar 2026', o: 'AI for Bharat', r: 'AI Engineer / Developer · DataScout', at: 120 },
  { p: 'Jan – Feb 2026', o: 'WorldQuant BRAIN', r: 'Alpha Research Trainee · US TOP3000', at: 185 },
  { p: '2025 – 2029', o: 'IIT Patna', r: 'B.S. Computer Science & Data Analytics', at: 245 },
];
export const Experience: React.FC = () => {
  const f = useCurrentFrame();
  const cur = EXP.reduce((acc, e, i) => (f >= e.at ? i : acc), 0);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 110, top: 200, width: 560 }}>
        <Fade at={0}><Mono size={17} color={C.ink2}>[04] &nbsp;Where I’ve built</Mono></Fade>
        <div style={{ position: 'relative', marginTop: 40 }}>
          <div style={{ position: 'absolute', left: 6, top: 10, width: 2, height: tw(f, 6, 60, 0, 520, easeInOut), background: C.line }} />
          {EXP.map((e, i) => {
            const on = i === cur;
            return (
              <Fade key={e.o} at={8 + i * 8} style={{ position: 'relative', paddingLeft: 40, marginBottom: 38 }}>
                <div style={{ position: 'absolute', left: 0, top: 8, width: 14, height: 14, borderRadius: 14, background: on ? C.lime : '#fff', border: `2px solid ${C.ink}` }} />
                <Mono size={13} color={on ? C.olive : C.mute}>{e.p}</Mono>
                <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 34, color: on ? C.ink : C.mute, marginTop: 6, letterSpacing: '-0.02em' }}>{e.o}</div>
                <div style={{ fontFamily: F.body, fontSize: 19, color: on ? C.ink2 : C.faint, marginTop: 4 }}>{e.r}</div>
              </Fade>
            );
          })}
        </div>
      </div>
      <Browser x={1255} y={540} w={1160} url={`${PORTFOLIO_URL}/#experience`} cam={{ s: 1.08, cx: 900, cy: 560 }}>
        <Clip name="experience" from={0} />
      </Browser>
    </AbsoluteFill>
  );
};

/* 05 — WHOAMI (3900–4125, 225f) -------------------------------------- */
export const Whoami: React.FC = () => {
  const f = useCurrentFrame();
  const cam = { s: kf(f, [[0, 1], [26, 1], [70, 1.75], [225, 1.82]]), cx: kf(f, [[26, 960], [70, 960]]), cy: kf(f, [[26, 540], [70, 300]]) };
  const w = kf(f, [[0, 1560], [180, 1560], [225, 1300]]);
  return (
    <AbsoluteFill>
      <Browser x={960} y={545} w={w} url={PORTFOLIO_URL} cam={cam}>
        <Clip name="palette" from={8} />
      </Browser>
      <Fade at={6} style={{ position: 'absolute', left: 330, top: 50 }}><Mono size={15} color={C.ink2}>[05] &nbsp;⌘K / Ctrl+K anywhere on the site</Mono></Fade>
    </AbsoluteFill>
  );
};

/* END (4125–4500, 375f) ---------------------------------------------- */
const LINKS = [
  ['Portfolio', 'https://portfolio-one-hazel-4qr78e531q.vercel.app/'],
  ['GitHub', 'https://github.com/aditbytes/portfolio'],
  ['LinkedIn', 'https://www.linkedin.com/in/sinhaaditya5'],
  ['Email', 'kraditya9241@gmail.com'],
];
export const End: React.FC = () => {
  const f = useCurrentFrame();
  const phrase = tw(f, 78, 104, 0, 1, easeInOut);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: 1 - phrase, transform: `translateY(${-60 * phrase}px)` }}>
        <Rise at={8} dur={28}>
          <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 128, letterSpacing: '-0.045em', color: C.ink }}>
            Explore <Marker at={34} dur={20}>the work.</Marker>
          </div>
        </Rise>
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 120, top: 170, width: 1680 }}>
        <Fade at={96}><Mono size={16} color={C.ink2}>[06] &nbsp;Contact</Mono></Fade>
        <Rise at={100} dur={30} style={{ marginTop: 16 }}>
          <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 250, letterSpacing: '-0.055em', lineHeight: 0.88, color: C.ink, display: 'flex', alignItems: 'flex-end' }}>
            ADITYA<span style={{ display: 'inline-block', width: 44, height: 44, borderRadius: 44, background: C.lime, marginLeft: 12, marginBottom: 26, boxShadow: `0 0 0 2.5px ${C.olive}` }} />
          </div>
        </Rise>
        <Fade at={116} style={{ marginTop: 26 }}>
          <div style={{ fontFamily: F.display, fontSize: 38, color: C.ink2, letterSpacing: '-0.015em' }}>AI/ML Engineer · Quant Researcher · Data/Systems Builder</div>
        </Fade>
        <div style={{ height: 2, background: C.ink, marginTop: 44, width: tw(f, 120, 160, 0, 1680, easeInOut) }} />
        <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '220px 1fr', rowGap: 22 }}>
          {LINKS.map(([k, v], i) => (
            <React.Fragment key={k}>
              <Fade at={134 + i * 8}><Mono size={16} color={C.olive} style={{ paddingTop: 8 }}>{k}</Mono></Fade>
              <Fade at={134 + i * 8}><div style={{ fontFamily: F.mono, fontSize: 32, color: C.ink, letterSpacing: '-0.01em' }}>{v}</div></Fade>
            </React.Fragment>
          ))}
        </div>
      </div>
      <Fade at={176} style={{ position: 'absolute', right: 120, bottom: 70 }}>
        <Mono size={14} color={C.mute}>IIT Patna · B.S. CSDA · Patna, India</Mono>
      </Fade>
    </AbsoluteFill>
  );
};

export const _unused = staticFile;
