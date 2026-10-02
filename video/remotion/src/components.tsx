import React from 'react';
import { AbsoluteFill, Freeze, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, CLIP_FRAMES, F, easeInOut, easeOut, tw } from './theme';

/* ------------------------------------------------------------------ */
/* Paper background: off-white with a quiet technical grid.            */
/* ------------------------------------------------------------------ */
export const Paper: React.FC = () => {
  const f = useCurrentFrame();
  const drift = (f * 0.15) % 64;
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          backgroundPosition: `${drift}px 0px`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(rgba(17,18,20,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(17,18,20,0.05) 1px, transparent 1px)`,
          backgroundSize: '256px 256px',
          backgroundPosition: `${drift}px 0px`,
        }}
      />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.55) 0%, rgba(244,243,239,0) 60%, rgba(214,212,204,0.35) 100%)' }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Small typographic primitives                                        */
/* ------------------------------------------------------------------ */
export const Mono: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 16, color = C.mute, style }) => (
  <div style={{ fontFamily: F.mono, fontSize: size, letterSpacing: '0.14em', textTransform: 'uppercase', color, ...style }}>{children}</div>
);

/** Mask reveal: content slides up from behind a clip edge. */
export const Rise: React.FC<{ at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties; dist?: number; out?: number }> = ({ at, dur = 22, children, style, dist = 110, out }) => {
  const f = useCurrentFrame();
  const y = tw(f, at, at + dur, dist, 0);
  const o = out !== undefined ? tw(f, out, out + 12, 1, 0, easeInOut) : 1;
  return (
    <div style={{ overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em', ...style }}>
      <div style={{ transform: `translateY(${y}%)`, opacity: o }}>{children}</div>
    </div>
  );
};

/** Fade + slight lift. */
export const Fade: React.FC<{ at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties; dy?: number; out?: number; outDur?: number }> = ({ at, dur = 18, children, style, dy = 16, out, outDur = 12 }) => {
  const f = useCurrentFrame();
  let o = tw(f, at, at + dur, 0, 1);
  if (out !== undefined) o *= tw(f, out, out + outDur, 1, 0, easeInOut);
  const y = tw(f, at, at + dur, dy, 0);
  return <div style={{ opacity: o, transform: `translateY(${y}px)`, ...style }}>{children}</div>;
};

/** Lime highlighter swept behind text. */
export const Marker: React.FC<{ at: number; children: React.ReactNode; dur?: number; color?: string }> = ({ at, children, dur = 16, color = C.lime }) => {
  const f = useCurrentFrame();
  const s = tw(f, at, at + dur, 0, 1, easeInOut);
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ position: 'absolute', left: '-0.06em', right: '-0.06em', top: '52%', bottom: '2%', background: color, transformOrigin: 'left center', transform: `scaleX(${s})`, zIndex: 0 }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </span>
  );
};

export const Chip: React.FC<{ children: React.ReactNode; at?: number; dark?: boolean; style?: React.CSSProperties }> = ({ children, at = -999, dark, style }) => {
  const f = useCurrentFrame();
  const o = tw(f, at, at + 12, 0, 1);
  const s = tw(f, at, at + 14, 0.9, 1);
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', fontFamily: F.mono, fontSize: 15, letterSpacing: '0.04em',
        padding: '7px 13px', borderRadius: 999, border: `1px solid ${dark ? C.ink : C.line}`,
        background: dark ? C.ink : 'rgba(255,255,255,0.75)', color: dark ? '#fff' : C.ink2,
        opacity: o, transform: `scale(${s})`, marginRight: 8, marginBottom: 8, whiteSpace: 'nowrap', ...style,
      }}
    >
      {children}
    </span>
  );
};

/** Count-up for numbers that exist in the sources. */
export const Counter: React.FC<{ at: number; to: number; dur?: number; decimals?: number; prefix?: string; suffix?: string; comma?: boolean }> = ({ at, to, dur = 36, decimals = 0, prefix = '', suffix = '', comma }) => {
  const f = useCurrentFrame();
  const v = tw(f, at, at + dur, 0, to);
  let s = v.toFixed(decimals);
  if (comma) s = Math.round(v).toLocaleString('en-US');
  return <>{prefix}{s}{suffix}</>;
};

/* ------------------------------------------------------------------ */
/* Clip: a recorded screen capture, re-timed via Freeze.               */
/* ------------------------------------------------------------------ */
export const clipFrame = (name: string, f: number, from = 0, rate = 1) =>
  Math.max(0, Math.min(CLIP_FRAMES[name] - 1, Math.round(from + f * rate)));

export const Clip: React.FC<{ name: string; from?: number; rate?: number; style?: React.CSSProperties }> = ({ name, from = 0, rate = 1, style }) => {
  const f = useCurrentFrame();
  return (
    <Freeze frame={clipFrame(name, f, from, rate)}>
      <OffthreadVideo muted src={staticFile(`clips/${name}.mp4`)} style={{ width: 1920, height: 1080, display: 'block', ...style }} />
    </Freeze>
  );
};

export type Cam = { s: number; cx: number; cy: number };

/* ------------------------------------------------------------------ */
/* Browser window on paper. Children render in clip pixel coordinates  */
/* (1920x1080) and follow the camera.                                  */
/* ------------------------------------------------------------------ */
export const Browser: React.FC<{
  x: number; y: number; w: number; url: string; cam?: Cam; children?: React.ReactNode; overlay?: React.ReactNode;
  style?: React.CSSProperties; dark?: boolean; opacity?: number; scale?: number;
}> = ({ x, y, w, url, cam = { s: 1, cx: 960, cy: 540 }, children, overlay, style, opacity = 1, scale = 1, dark = true }) => {
  const k = w / 1920;
  const h = w * 9 / 16;
  const bar = Math.max(30, 44 * k * 1.25);
  const s = cam.s;
  const cx = Math.min(1920 - 960 / s, Math.max(960 / s, cam.cx));
  const cy = Math.min(1080 - 540 / s, Math.max(540 / s, cam.cy));
  return (
    <div
      style={{
        position: 'absolute', left: x - w / 2, top: y - (h + bar) / 2, width: w, height: h + bar, borderRadius: 14 * Math.max(0.7, k * 1.4),
        overflow: 'hidden', background: '#fff', opacity, transform: `scale(${scale})`,
        boxShadow: '0 50px 90px -30px rgba(20,20,15,0.28), 0 18px 36px -18px rgba(20,20,15,0.22), 0 0 0 1px rgba(17,18,20,0.10)',
        ...style,
      }}
    >
      <div style={{ height: bar, background: '#F7F6F2', borderBottom: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', padding: `0 ${bar * 0.45}px`, gap: bar * 0.18 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: bar * 0.26, height: bar * 0.26, borderRadius: 99, background: '#D3D1CA' }} />
        ))}
        <div
          style={{
            marginLeft: bar * 0.5, flex: 1, maxWidth: w * 0.52, height: bar * 0.58, borderRadius: 99, background: '#fff', border: `1px solid ${C.line}`,
            display: 'flex', alignItems: 'center', gap: 8, padding: `0 ${bar * 0.4}px`, fontFamily: F.mono, fontSize: Math.max(11, bar * 0.3), color: C.ink2, whiteSpace: 'nowrap', overflow: 'hidden',
          }}
        >
          <svg width={bar * 0.28} height={bar * 0.28} viewBox="0 0 16 16"><path d="M4 7V5a4 4 0 0 1 8 0v2h1v8H3V7h1zm2 0h4V5a2 2 0 0 0-4 0v2z" fill={C.mute} /></svg>
          {url}
        </div>
      </div>
      <div style={{ position: 'relative', width: w, height: h, overflow: 'hidden', background: dark ? '#050505' : '#fff' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `scale(${k}) translate(960px, 540px) scale(${s}) translate(${-cx}px, ${-cy}px)` }}>
          {children}
        </div>
        {overlay}
      </div>
    </div>
  );
};

/** Callout box drawn in clip coordinates (place inside <Browser>). */
export const Callout: React.FC<{ at: number; x: number; y: number; w: number; h: number; label: string; s?: number; side?: 'top' | 'bottom' | 'right'; out?: number }> = ({ at, x, y, w, h, label, s = 1, side = 'top', out }) => {
  const f = useCurrentFrame();
  const p = tw(f, at, at + 20, 0, 1, easeInOut);
  let o = tw(f, at, at + 8, 0, 1);
  if (out !== undefined) o *= tw(f, out, out + 10, 1, 0, easeInOut);
  const per = 2 * (w + h);
  const sw = 3 / s;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, opacity: o }}>
      <svg width={w} height={h} style={{ position: 'absolute', overflow: 'visible' }}>
        <rect x={0} y={0} width={w} height={h} rx={10 / s} fill="none" stroke={C.lime} strokeWidth={sw} strokeDasharray={per} strokeDashoffset={per * (1 - p)} />
      </svg>
      <div
        style={{
          position: 'absolute',
          ...(side === 'right' ? { left: `calc(100% + ${14 / s}px)`, top: 0 } : { left: 0, [side === 'top' ? 'bottom' : 'top']: `calc(100% + ${10 / s}px)` }),
          transform: `scale(${1 / s})`, transformOrigin: side === 'bottom' ? 'top left' : side === 'right' ? 'top left' : 'bottom left',
          background: C.lime, color: C.ink, fontFamily: F.mono, fontSize: 22, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
          padding: '8px 14px', borderRadius: 6, whiteSpace: 'nowrap', opacity: tw(f, at + 10, at + 22, 0, 1),
        }}
      >
        {label}
      </div>
    </div>
  );
};

/** Synthesised pointer for recordings without a visible cursor (Streamlit). */
export const CursorOverlay: React.FC<{ name: string; from?: number; rate?: number; data: { mouse: { t: number; x: number; y: number; click?: boolean }[] } }> = ({ name, from = 0, rate = 1, data }) => {
  const f = useCurrentFrame();
  const t = clipFrame(name, f, from, rate) / 30;
  const m = data.mouse;
  if (!m.length || t < m[0].t - 0.0) {
    // before first logged move: use first position
  }
  let i = 0;
  while (i + 1 < m.length && m[i + 1].t <= t) i++;
  const a = m[i], b = m[Math.min(m.length - 1, i + 1)];
  const k = b.t > a.t ? Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t))) : 0;
  const x = (a.x + (b.x - a.x) * k) * 1920, y = (a.y + (b.y - a.y) * k) * 1080;
  const clicks = m.filter((p) => p.click);
  return (
    <>
      {clicks.map((c, j) => {
        const dt = t - c.t;
        if (dt < 0 || dt > 0.6) return null;
        const r = 10 + dt * 120;
        return <div key={j} style={{ position: 'absolute', left: c.x * 1920 - r, top: c.y * 1080 - r, width: 2 * r, height: 2 * r, borderRadius: 999, border: `3px solid ${C.ink}`, opacity: 1 - dt / 0.6 }} />;
      })}
      <svg width={34} height={46} viewBox="0 0 24 32" style={{ position: 'absolute', left: x - 3, top: y - 2, filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.25))' }}>
        <path d="M2 2 L2 25 L8 19.5 L12.2 29 L16 27.3 L11.9 18 L20 18 Z" fill={C.ink} stroke="#fff" strokeWidth={1.8} strokeLinejoin="round" />
      </svg>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Code card with light syntax colouring and an animated line highlight */
/* ------------------------------------------------------------------ */
const KW = new Set(['def', 'return', 'for', 'in', 'if', 'None', 'import', 'from', 'as', 'and', 'or', 'not', 'is', 'True', 'False', 'with', 'class', 'else', 'elif']);
const tokenize = (line: string) => {
  const out: { t: string; c: string; i?: boolean }[] = [];
  const re = /(#.*$)|("""[^"]*"""|"[^"]*"|'[^']*'|f"[^"]*")|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|(.)/g;
  let m: RegExpExecArray | null;
  let prev = '';
  while ((m = re.exec(line))) {
    if (m[1]) out.push({ t: m[1], c: C.mute, i: true });
    else if (m[2]) out.push({ t: m[2], c: '#3F7A12' });
    else if (m[3]) out.push({ t: m[3], c: '#B4531A' });
    else if (m[4]) {
      const w = m[4];
      if (KW.has(w)) out.push({ t: w, c: C.violet });
      else if (prev === 'def') out.push({ t: w, c: C.cyan });
      else if (/^[A-Z][A-Z0-9_]+$/.test(w)) out.push({ t: w, c: '#9A3B82' });
      else out.push({ t: w, c: C.ink });
      prev = w;
      continue;
    } else out.push({ t: m[0], c: C.ink2 });
    if (!/^\s+$/.test(m[0])) prev = m[0];
  }
  return out;
};

export const CodeCard: React.FC<{
  file: string; repo: string; rows: [number | null, string][]; hl: { line: number; at: number }[]; at?: number; w?: number; size?: number; style?: React.CSSProperties;
}> = ({ file, repo, rows, hl, at = 0, w = 760, size = 19, style }) => {
  const f = useCurrentFrame();
  const lh = size * 1.62;
  return (
    <div style={{ width: w, background: C.card, borderRadius: 16, overflow: 'hidden', boxShadow: '0 40px 70px -30px rgba(20,20,15,0.25), 0 0 0 1px rgba(17,18,20,0.08)', ...style }}>
      <div style={{ height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: `1px solid ${C.line}`, background: '#FAFAF7' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: F.mono, fontSize: 15, color: C.ink }}>
          <span style={{ width: 9, height: 9, borderRadius: 9, background: C.lime, boxShadow: `0 0 0 1px ${C.olive}` }} />
          {file}
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 13, color: C.mute, letterSpacing: '0.06em' }}>{repo}</div>
      </div>
      <div style={{ position: 'relative', padding: '16px 0' }}>
        {rows.map(([n, ln], i) => {
          if (n === null) return (
            <div key={i} style={{ height: lh, display: 'flex', alignItems: 'center', fontFamily: F.mono, fontSize: size * 0.8, color: C.faint, opacity: tw(f, at + i * 1.6, at + i * 1.6 + 10, 0, 1) }}>
              <span style={{ width: 58, textAlign: 'right', paddingRight: 18 }}>⋮</span><span>{ln}</span>
            </div>
          );
          const h = hl.find((x) => x.line === n);
          const hp = h ? tw(f, h.at, h.at + 14, 0, 1, easeInOut) : 0;
          const o = tw(f, at + i * 1.6, at + i * 1.6 + 10, 0, 1);
          const dim = hl.length && hl.some((x) => f >= x.at) && !h ? 0.45 : 1;
          return (
            <div key={i} style={{ position: 'relative', height: lh, display: 'flex', alignItems: 'center', opacity: o * (h ? 1 : dim), fontFamily: F.mono, fontSize: size, whiteSpace: 'pre' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, background: 'rgba(183,255,0,0.42)', transformOrigin: 'left', transform: `scaleX(${hp})` }} />
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.olive, opacity: hp }} />
              <span style={{ position: 'relative', width: 58, textAlign: 'right', paddingRight: 18, color: C.faint, fontSize: size * 0.82 }}>{n}</span>
              <span style={{ position: 'relative' }}>
                {tokenize(ln).map((t, j) => (
                  <span key={j} style={{ color: t.c, fontStyle: t.i ? 'italic' : 'normal' }}>{t.t}</span>
                ))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Pipeline / flow diagram                                             */
/* ------------------------------------------------------------------ */
export const Flow: React.FC<{ steps: { t: string; s?: string }[]; at: number; x: number; y: number; w: number; per?: number; size?: number; highlight?: number[]; offset?: number }> = ({ steps, at, x, y, w, per = 9, size = 22, highlight = [], offset = 0 }) => {
  const f = useCurrentFrame();
  const n = steps.length;
  const gap = 34;
  const bw = (w - gap * (n - 1)) / n;
  const pulse = ((f - at - n * per) / 50) % 1;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: 140 }}>
      {steps.map((st, i) => {
        const a = at + i * per;
        const o = tw(f, a, a + 14, 0, 1);
        const sy = tw(f, a, a + 18, 18, 0);
        const lp = tw(f, a + 6, a + 6 + per, 0, 1, easeInOut);
        const hot = highlight.includes(i);
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute', left: i * (bw + gap), top: 0, width: bw, minHeight: 92, opacity: o, transform: `translateY(${sy}px)`,
                background: hot ? C.ink : '#fff', color: hot ? '#fff' : C.ink, borderRadius: 12, border: `1px solid ${hot ? C.ink : C.line}`,
                boxShadow: '0 14px 30px -18px rgba(20,20,15,0.3)', padding: '16px 16px', boxSizing: 'border-box',
              }}
            >
              <div style={{ fontFamily: F.mono, fontSize: 12, letterSpacing: '0.12em', color: hot ? C.lime : C.mute, marginBottom: 8 }}>{String(i + 1 + offset).padStart(2, '0')}</div>
              <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: size, lineHeight: 1.15 }}>{st.t}</div>
              {st.s && <div style={{ fontFamily: F.body, fontSize: size * 0.68, color: hot ? '#C9C9C9' : C.mute, marginTop: 6, lineHeight: 1.3 }}>{st.s}</div>}
            </div>
            {i < n - 1 && (
              <div style={{ position: 'absolute', left: i * (bw + gap) + bw + 4, top: 44, width: gap - 8, height: 2, background: C.ink, transformOrigin: 'left', transform: `scaleX(${lp})` }}>
                <div style={{ position: 'absolute', right: -1, top: -4, width: 0, height: 0, borderLeft: `7px solid ${C.ink}`, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', opacity: lp }} />
              </div>
            )}
          </React.Fragment>
        );
      })}
      {f > at + n * per && (
        <div style={{ position: 'absolute', left: pulse * (w - 12), top: 128, width: 12, height: 12, borderRadius: 12, background: C.lime, boxShadow: `0 0 0 3px rgba(183,255,0,0.3)`, opacity: Math.sin(pulse * Math.PI) }} />
      )}
    </div>
  );
};

/** Scene wrapper: crossfade in/out with a small push. */
export const Scene: React.FC<{ dur: number; children: React.ReactNode; fadeIn?: number; fadeOut?: number; push?: number }> = ({ dur, children, fadeIn = 12, fadeOut = 12, push = 0.015 }) => {
  const f = useCurrentFrame();
  const o = Math.min(tw(f, 0, fadeIn, 0, 1, easeInOut), tw(f, dur - fadeOut, dur, 1, 0, easeInOut));
  const s = tw(f, 0, fadeIn + 10, 1 + push, 1) * tw(f, dur - fadeOut, dur, 1, 1 - push, easeInOut);
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${s})` }}>{children}</AbsoluteFill>;
};

export const useW = () => useVideoConfig().width;
