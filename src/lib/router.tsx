import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react';

/**
 * A ~60-line history router — the site has two route shapes (`/` and
 * `/work/:slug`), which doesn't justify a routing dependency.
 */
const listeners = new Set<() => void>();

/** Path used while prerendering (no window on the server). */
let ssrPath = '/';
export const setSsrPath = (p: string) => {
  ssrPath = p;
};
const emit = () => listeners.forEach((l) => l());

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', emit);
}

export function usePathname() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => window.location.pathname,
    () => (typeof window === 'undefined' ? ssrPath : window.location.pathname),
  );
}

export function scrollToHash(hash: string, smooth = true) {
  const id = hash.replace(/^#/, '');
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: smooth && !reduce ? 'smooth' : 'auto', block: 'start' });
  // Move focus for keyboard / screen-reader users without a second scroll.
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

/** Navigate to `/path`, `/path#hash` or `#hash`. */
export function navigate(to: string) {
  const url = new URL(to, window.location.href);
  const samePath = url.pathname === window.location.pathname;
  if (samePath && url.hash) {
    history.pushState(null, '', url.hash);
    scrollToHash(url.hash);
    return;
  }
  history.pushState(null, '', url.pathname + url.hash);
  emit();
  if (url.hash) {
    // Wait for the new route to render before scrolling.
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToHash(url.hash, false)));
  } else {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** Internal link: client-side navigation with normal <a> semantics. */
export function Link({ href, onClick, ...rest }: LinkProps) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(href);
  };
  return <a href={href} onClick={handle} {...rest} />;
}
