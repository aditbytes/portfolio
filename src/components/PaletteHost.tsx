import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { PALETTE_EVENT } from './paletteBus';

const CommandPalette = lazy(() => import('./CommandPalette'));

const isTyping = (el: EventTarget | null) => {
  const t = el as HTMLElement | null;
  return !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
};

/** Keyboard entry points (⌘K / Ctrl+K / ~) — the palette itself is code-split. */
export function PaletteHost() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const show = () => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setLoaded(true);
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) setOpen(false);
        else show();
        return;
      }
      if (e.key === '~' && !open && !isTyping(e.target)) {
        e.preventDefault();
        show();
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener(PALETTE_EVENT, show);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(PALETTE_EVENT, show);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    returnFocus.current?.focus?.();
  };

  if (!loaded) return null;
  return (
    <Suspense fallback={null}>
      <CommandPalette open={open} onClose={close} />
    </Suspense>
  );
}
