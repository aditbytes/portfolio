import type { ReactNode } from 'react';
import { useInView } from '../hooks/useInView';
import './visuals.css';

interface Props {
  file: string;
  note?: string;
  children: (inView: boolean) => ReactNode;
  className?: string;
  /** Accessible description of what the visual depicts. */
  label: string;
  /** Interactive controls, rendered outside the decorative image region. */
  controls?: ReactNode;
}

/**
 * Chrome for every project visual. Always states that the data is
 * illustrative — these are drawings of how a system works, not results.
 */
export function VisualFrame({ file, note = 'Illustrative data', children, className = '', label, controls }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.25 });
  return (
    <div ref={ref} className={`vframe ${inView ? 'is-in' : ''} ${className}`}>
      <div className="vframe__bar" aria-hidden="true">
        <span className="vframe__file">
          <i />
          {file}
        </span>
        <span className="vframe__note">{note}</span>
      </div>
      <div className="vframe__body" role="img" aria-label={`${label} (illustrative visualization)`}>
        {children(inView)}
      </div>
      {controls && <div className="vframe__controls">{controls}</div>}
    </div>
  );
}
