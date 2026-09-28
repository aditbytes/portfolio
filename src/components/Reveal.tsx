import { createElement, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { useInView } from '../hooks/useInView';

interface RevealProps {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  /** stagger index → transition-delay: i × 80ms */
  i?: number;
  style?: CSSProperties;
  id?: string;
  [key: string]: unknown;
}

/** Fades/slides children in the first time they enter the viewport. */
export function Reveal({ as = 'div', children, className = '', i = 0, style, ...rest }: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>();
  return createElement(
    as,
    {
      ...rest,
      ref,
      className: `reveal ${inView ? 'is-in' : ''} ${className}`.trim(),
      style: { ...style, '--i': i } as CSSProperties,
    },
    children,
  );
}

/** Splits a heading into masked lines that slide up when in view. */
export function MaskedLines({ lines, className = '' }: { lines: ReactNode[]; className?: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  return (
    <span ref={ref} className={`${className} ${inView ? 'is-in' : ''}`}>
      {lines.map((line, i) => (
        <span className="line-mask" key={i} style={{ '--i': i } as CSSProperties}>
          <span>{line}</span>
        </span>
      ))}
    </span>
  );
}
