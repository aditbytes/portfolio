import { useEffect, useRef } from 'react';

/**
 * DATA → SIGNAL → MODEL → DECISION, as a particle flow.
 *
 * Particles enter on the left as noise, snap onto feature "lanes", converge on
 * three model nodes and leave as a single rising decision line. The cursor
 * pushes nearby particles aside. 2D canvas only; pauses offscreen / in hidden
 * tabs; renders one static frame for reduced-motion users.
 */

interface Particle {
  x: number;
  speed: number;
  noiseY: number;
  lane: number;
  node: number;
  phase: number;
  push: number;
  size: number;
}

const LANES = 6;
const NODES = 3;
// Stage boundaries as a fraction of width.
const S = { signalIn: 0.2, signal: 0.3, modelIn: 0.5, model: 0.58, decisionIn: 0.72, decision: 0.8 };

const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// stage colours: noise → cyan → violet → lime
const COLORS: [number, number, number][] = [
  [113, 113, 122],
  [33, 212, 253],
  [124, 60, 255],
  [183, 255, 0],
];
function colorAt(p: number, alpha: number) {
  const seg = p < S.signal ? lerp(0, 1, smooth(S.signalIn, S.signal, p)) : p < S.model ? 1 + smooth(S.modelIn, S.model, p) : 2 + smooth(S.decisionIn, S.decision, p);
  const i = Math.min(2, Math.floor(seg));
  const t = seg - i;
  const a = COLORS[i];
  const b = COLORS[i + 1];
  return `rgba(${Math.round(lerp(a[0], b[0], t))},${Math.round(lerp(a[1], b[1], t))},${Math.round(lerp(a[2], b[2], t))},${alpha})`;
}

export function SignalField({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return; // No canvas support: the hero simply has no field.

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.matchMedia('(max-width: 767px)').matches;
    const count = small ? 70 : window.matchMedia('(max-width: 1100px)').matches ? 140 : 230;
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1 : 1.5);

    let W = 0;
    let H = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let running = false;
    let visible = true;
    let ready = false;
    const mouse = { x: -9999, y: -9999, active: false };

    const make = (x: number): Particle => ({
      x,
      speed: 0.35 + Math.random() * 0.55,
      noiseY: Math.random() * H,
      lane: Math.floor(Math.random() * LANES),
      node: Math.floor(Math.random() * NODES),
      phase: Math.random() * Math.PI * 2,
      push: 0,
      size: 0.8 + Math.random() * 1.1,
    });

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: count }, () => make(Math.random() * W));
    };

    const yFor = (p: Particle, t: number) => {
      const u = p.x / W;
      const noise = p.noiseY + Math.sin(t * 0.0006 + p.phase) * 10;
      const laneY = H * (0.22 + (0.56 * p.lane) / (LANES - 1)) + Math.sin(p.x * 0.018 + p.phase) * 5;
      const nodeY = H * (0.34 + (0.32 * p.node) / (NODES - 1));
      const decisionY = H * 0.5 - (u - S.decision) * H * 0.55 + Math.sin(p.phase) * 2.5;
      let y = lerp(noise, laneY, smooth(S.signalIn, S.signal, u));
      y = lerp(y, nodeY, smooth(S.modelIn, S.model, u));
      y = lerp(y, decisionY, smooth(S.decisionIn, S.decision, u));
      return y;
    };

    const drawNodes = () => {
      const nx = W * ((S.model + S.decisionIn) / 2);
      for (let i = 0; i < NODES; i++) {
        const ny = H * (0.34 + (0.32 * i) / (NODES - 1));
        ctx.beginPath();
        ctx.arc(nx, ny, 5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(124,60,255,0.55)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // stage dividers
      ctx.setLineDash([2, 6]);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      for (const f of [S.signalIn, S.modelIn, S.decisionIn]) {
        ctx.beginPath();
        ctx.moveTo(W * f, H * 0.12);
        ctx.lineTo(W * f, H * 0.88);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    };

    const frame = (t: number, fade: boolean) => {
      if (fade) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,0.22)';
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'source-over';
      } else {
        ctx.clearRect(0, 0, W, H);
      }
      for (const p of particles) {
        const u = p.x / W;
        let y = yFor(p, t);
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = y - mouse.y;
          const d = Math.hypot(dx, dy);
          const target = d < 120 ? (1 - d / 120) * 34 * (dy >= 0 ? 1 : -1) : 0;
          p.push += (target - p.push) * 0.12;
        } else {
          p.push *= 0.92;
        }
        y += p.push;
        const alpha = 0.25 + 0.6 * smooth(0, 0.12, u) * (1 - smooth(0.94, 1, u));
        ctx.fillStyle = colorAt(u, alpha);
        ctx.fillRect(p.x, y, p.size + u * 0.8, p.size + u * 0.8);
      }
      if (!fade) drawNodes();
    };

    const step = (t: number) => {
      raf = 0;
      if (!running) return;
      for (const p of particles) {
        p.x += p.speed * (1 + (p.x / W) * 0.8);
        if (p.x > W) Object.assign(p, make(-2));
      }
      frame(t, true);
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (!ready || running || reduce || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    frame(0, false);
    // Let first paint and hydration finish before animating.
    const begin = () => {
      ready = true;
      start();
    };
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(begin, { timeout: 2000 })
      : window.setTimeout(begin, 1200);

    const ro = new ResizeObserver(() => {
      resize();
      frame(performance.now(), false);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = mouse.y > 0 && mouse.y < r.height;
    };
    const onLeave = () => (mouse.active = false);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      stop();
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
