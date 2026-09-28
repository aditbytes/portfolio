import { useMemo, type CSSProperties } from 'react';
import { Portrait } from '../components/Portrait';
import { Reveal } from '../components/Reveal';
import { signalKeywords } from '../content/profile';
import { useInView } from '../hooks/useInView';
import './signal.css';

/** Deterministic pseudo-random so the "mess" is stable across renders. */
function scatter(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function MessyWord({ text }: { text: string }) {
  const letters = useMemo(
    () =>
      text.split('').map((ch, i) => ({
        ch,
        r: (scatter(i + 1) - 0.5) * 36,
        y: (scatter(i + 7) - 0.5) * 0.5,
        x: (scatter(i + 13) - 0.5) * 0.18,
      })),
    [text],
  );
  return (
    <span className="messy">
      <span className="sr-only">{text}</span>
      {letters.map((l, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{ '--r': `${l.r}deg`, '--y': `${l.y}em`, '--x': `${l.x}em`, '--i': i } as CSSProperties}
        >
          {l.ch === ' ' ? ' ' : l.ch}
        </span>
      ))}
    </span>
  );
}

export function Signal() {
  const [ref, inView] = useInView<HTMLHeadingElement>({ threshold: 0.4 });

  return (
    <section className="section signal" aria-labelledby="signal-title">
      <div className="container">
        <Reveal className="section-head__meta label">
          <span className="section-head__index">[01]</span>
          <span>The Signal</span>
        </Reveal>

        <div className="signal__grid">
          <div className="signal__statement">
            <h2 id="signal-title" ref={ref} className={`signal__title ${inView ? 'is-in' : ''}`}>
              <span className="signal__row">I like turning</span>
              <span className="signal__row">
                <MessyWord text="messy data" />
              </span>
              <span className="signal__row">
                into systems<span className="signal__lime">.</span>
              </span>
            </h2>
            <Reveal as="p" className="signal__body" i={2}>
              Most of what I build sits where models meet decisions: a regime classifier that decides how capital is
              allocated, a forecaster that decides how much stock to reorder, an agent that decides which Python to run
              against a dataset. The model is one step. The system around it — data, evaluation, deployment, feedback —
              is the work.
            </Reveal>
          </div>

          <Reveal className="signal__figure" i={1}>
            <figure>
              <div className="signal__frame">
                <Portrait
                  name="profile"
                  widths={[480, 864]}
                  sizes="(max-width: 900px) 70vw, 30vw"
                  width={864}
                  height={1080}
                  alt="Black-and-white side profile of Aditya against a dark wall, eyes closed, holding a glass."
                />
              </div>
              <svg className="signal__scribble" viewBox="0 0 220 120" aria-hidden="true">
                <path d="M8 96 C 40 20, 110 8, 168 40" />
                <path d="M156 28 L170 41 L152 48" />
              </svg>
              <figcaption className="label">
                <span>Fig. 01</span>
                <span>Signal / noise</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <ul className="keywords" aria-label="Areas I work across">
          {signalKeywords.map((k, i) => (
            <Reveal as="li" className="keyword" key={k.word} i={i}>
              <span className="keyword__num label">0{i + 1}</span>
              <span className="keyword__word">{k.word}</span>
              <span className="keyword__note">{k.note}</span>
              <span className="keyword__tag label">{k.tag}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
