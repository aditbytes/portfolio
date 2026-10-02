import { Easing, interpolate } from 'remotion';

export const FPS = 30;

export const C = {
  paper: '#F4F3EF',
  paper2: '#ECEBE5',
  card: '#FFFFFF',
  ink: '#111214',
  ink2: '#3B3C41',
  mute: '#7D7E84',
  faint: '#B9B8B1',
  line: '#DAD8D0',
  grid: 'rgba(17,18,20,0.045)',
  lime: '#B7FF00',
  limeSoft: 'rgba(183,255,0,0.55)',
  olive: '#4E6B00',
  warm: '#E4572E',
  cyan: '#1597C4',
  violet: '#6B3FD8',
};

export const F = {
  display: "'Space Grotesk Variable', 'Space Grotesk', sans-serif",
  body: "'Inter Variable', 'Inter', sans-serif",
  mono: "'JetBrains Mono Variable', 'JetBrains Mono', monospace",
};

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** Clamp-interpolate with an easing curve. */
export const tw = (f: number, f0: number, f1: number, v0: number, v1: number, ease = easeOut) =>
  interpolate(f, [f0, f1], [v0, v1], { easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/** Piecewise keyframes [[frame, value], ...] with in-out easing between keys. */
export const kf = (f: number, keys: [number, number][], ease = easeInOut) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [a, va] = keys[i];
    const [b, vb] = keys[i + 1];
    if (f <= b) return interpolate(f, [a, b], [va, vb], { easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  }
  return keys[keys.length - 1][1];
};

/** Clip frame counts (30 fps CFR, produced by tocfr.py). */
export const CLIP_FRAMES: Record<string, number> = {
  hero: 287,
  signal: 424,
  about: 212,
  stack: 249,
  work_indra: 459,
  indieye: 311,
  more: 378,
  experience: 269,
  palette: 183,
  regime: 312,
  diq: 309,
};
