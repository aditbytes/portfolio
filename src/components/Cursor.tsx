import { useEffect, useRef } from 'react';
import { useFinePointer, useReducedMotion } from '../hooks/useMedia';
import './cursor.css';

const INTERACTIVE = 'a, button, [role="button"], input, label, select, summary';

/**
 * Dot + trailing ring. Mouse/trackpad only, off for reduced motion.
 * Links expand the ring; elements with data-cursor="view" show "VIEW".
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const enabled = fine && !reduce;
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const root = document.documentElement;
    root.classList.add('has-cursor');

    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;
    let raf = 0;
    let shown = false;

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.2 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (!shown) {
        shown = true;
        rx = x;
        ry = y;
        root.classList.add('cursor-on');
      }
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onOver = (e: Event) => {
      const t = e.target as Element | null;
      if (!t || !t.closest) return;
      const text = t.closest('input[type="text"], input[type="search"], textarea');
      const hit = t.closest(INTERACTIVE);
      const view = !hit && t.closest('[data-cursor="view"]');
      ring.dataset.state = text ? 'text' : hit ? 'link' : view ? 'view' : '';
    };
    const onLeave = () => {
      shown = false;
      root.classList.remove('cursor-on');
    };
    const onDown = () => ring.classList.add('is-down');
    const onUp = () => ring.classList.remove('is-down');

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove('has-cursor', 'cursor-on');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor__ring" ref={ringRef}>
        <span>View</span>
      </div>
      <div className="cursor__dot" ref={dotRef} />
    </div>
  );
}
