import { useSyncExternalStore } from 'react';

function subscribe(query: string) {
  return (cb: () => void) => {
    if (typeof window === 'undefined' || !window.matchMedia) return () => {};
    const mql = window.matchMedia(query);
    mql.addEventListener('change', cb);
    return () => mql.removeEventListener('change', cb);
  };
}

export function useMediaQuery(query: string, fallback = false) {
  return useSyncExternalStore(
    subscribe(query),
    () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : fallback),
    () => fallback,
  );
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
/** True for a mouse / trackpad user — gates cursor & hover-only effects. */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');

const noop = () => () => {};
/** Platform check that renders identically on the server and during hydration. */
export const useIsMac = () =>
  useSyncExternalStore(
    noop,
    () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent),
    () => false,
  );
