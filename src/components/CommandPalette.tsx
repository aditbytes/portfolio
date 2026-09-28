import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { site } from '../content/site';
import { navigate } from '../lib/router';
import './palette.css';

interface Cmd {
  name: string;
  hint: string;
  run: () => ReactNode[] | 'close';
}

type Line = { kind: 'in' | 'out' | 'err'; text: ReactNode };

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState(0);
  const [log, setLog] = useState<Line[]>([{ kind: 'out', text: 'Type a command, or `help`. Esc to close.' }]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const commands: Cmd[] = useMemo(() => {
    const go = (to: string) => () => {
      navigate(to);
      return 'close' as const;
    };
    const open = (href: string) => () => {
      window.open(href, '_blank', 'noopener,noreferrer');
      return 'close' as const;
    };
    const list: Cmd[] = [
      { name: '/work', hint: 'Selected work', run: go('/#work') },
      { name: '/about', hint: 'About me', run: go('/#about') },
      { name: '/research', hint: 'Research notes', run: go('/#research') },
      { name: '/system', hint: 'System map', run: go('/#systems') },
      { name: '/stack', hint: 'Toolchain', run: go('/#stack') },
      { name: '/github', hint: `github.com/${site.github.handle} ↗`, run: open(site.github.url) },
      { name: '/contact', hint: 'Get in touch', run: go('/#contact') },
      { name: '/resume', hint: 'Resume (PDF) ↗', run: open(site.resumeUrl) },
      {
        name: '/email',
        hint: site.email,
        run: () => {
          window.location.href = `mailto:${site.email}`;
          return 'close';
        },
      },
      {
        name: 'whoami',
        hint: 'Print identity',
        run: () => [site.name, site.shortIdentity, `${site.education.schoolShort} · ${site.education.short} · ${site.education.period}`],
      },
      {
        name: 'help',
        hint: 'List commands',
        run: () => list.map((c) => `${c.name.padEnd(10, ' ')} ${c.hint}`),
      },
      {
        name: 'clear',
        hint: 'Clear output',
        run: () => {
          setLog([]);
          return [];
        },
      },
    ];
    return list;
  }, []);

  const q = query.trim().toLowerCase();
  const matches = q ? commands.filter((c) => c.name.includes(q) || c.hint.toLowerCase().includes(q)) : commands;

  useEffect(() => setSel(0), [query]);
  useEffect(() => {
    if (open) {
      setQuery('');
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [log]);

  const exec = (cmd: Cmd | undefined, raw: string) => {
    if (!raw && !cmd) return;
    if (!cmd) {
      setLog((l) => [...l, { kind: 'in', text: raw }, { kind: 'err', text: `command not found: ${raw} — try help` }]);
      setQuery('');
      return;
    }
    const out = cmd.run();
    if (out === 'close') {
      setQuery('');
      onClose();
      return;
    }
    if (cmd.name !== 'clear') {
      setLog((l) => [...l, { kind: 'in', text: cmd.name }, ...out.map((t) => ({ kind: 'out' as const, text: t }))]);
    }
    setQuery('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSel((s) => Math.min(matches.length - 1, s + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSel((s) => Math.max(0, s - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const exact = commands.find((c) => c.name === q || c.name === `/${q}`);
      exec(exact ?? matches[sel], query.trim());
    } else if (e.key === 'Tab') {
      // Keep focus inside the dialog.
      const items = dialogRef.current?.querySelectorAll<HTMLElement>('input, button');
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  if (!open) return null;
  const activeId = matches[sel] ? `cmd-${matches[sel].name.replace('/', '')}` : undefined;

  return (
    <div className="palette" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="palette__dialog" role="dialog" aria-modal="true" aria-label="Command palette" ref={dialogRef} onKeyDown={onKeyDown}>
        <div className="palette__bar">
          <span className="palette__prompt" aria-hidden="true">
            aditya@portfolio ~ %
          </span>
          <input
            ref={inputRef}
            type="text"
            className="palette__input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="type a command…"
            aria-label="Command"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={activeId}
            autoComplete="off"
            spellCheck={false}
          />
          <button type="button" className="palette__esc" onClick={onClose} aria-label="Close command palette">
            esc
          </button>
        </div>

        {log.length > 0 && (
          <div className="palette__log" ref={logRef} aria-live="polite">
            {log.map((l, i) => (
              <p key={i} className={`palette__line palette__line--${l.kind}`}>
                {l.kind === 'in' ? <span aria-hidden="true">› </span> : null}
                {l.text}
              </p>
            ))}
          </div>
        )}

        <ul className="palette__list" id="palette-list" role="listbox" aria-label="Commands">
          {matches.map((c, i) => (
            <li
              key={c.name}
              id={`cmd-${c.name.replace('/', '')}`}
              role="option"
              aria-selected={i === sel}
              className={i === sel ? 'is-sel' : ''}
              onMouseEnter={() => setSel(i)}
              onClick={() => exec(c, c.name)}
            >
              <span className="palette__name">{c.name}</span>
              <span className="palette__hint">{c.hint}</span>
            </li>
          ))}
          {!matches.length && <li className="palette__empty">No match — press Enter to run anyway.</li>}
        </ul>
        <div className="palette__foot label">
          <span>↑↓ navigate</span>
          <span>↵ run</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
