import { useEffect, useRef, useState } from 'react';

/**
 * Sets `inView` once the element enters the viewport (and keeps it).
 * Falls back to visible when IntersectionObserver is unavailable.
 */
export function useInView<T extends Element>(options: { rootMargin?: string; threshold?: number; once?: boolean } = {}) {
  const { rootMargin = '0px 0px -12% 0px', threshold = 0.12, once = true } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold, once]);

  return [ref, inView] as const;
}
