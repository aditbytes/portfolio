import type { ReactNode } from 'react';
import { MaskedLines, Reveal } from './Reveal';

interface Props {
  index: string;
  label: string;
  title: ReactNode[];
  lede?: ReactNode;
  id?: string;
}

export function SectionHead({ index, label, title, lede, id }: Props) {
  return (
    <header className="section-head">
      <Reveal className="section-head__meta label">
        <span className="section-head__index">[{index}]</span>
        <span>{label}</span>
      </Reveal>
      <h2 className="section-head__title" id={id}>
        <MaskedLines lines={title} />
      </h2>
      {lede && (
        <Reveal as="p" className="section-head__lede" i={2}>
          {lede}
        </Reveal>
      )}
    </header>
  );
}

/** Tiny contextual transition between sections, e.g. SIGNAL DETECTED. */
export function Marker({ step, text }: { step: string; text: string }) {
  return (
    <Reveal className="marker label" aria-hidden="true">
      <span className="marker__text">
        <b>{step}</b>
        <span>{text}</span>
      </span>
    </Reveal>
  );
}
