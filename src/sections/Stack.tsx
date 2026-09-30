import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';
import { stack } from '../content/profile';
import './stack.css';

export function Stack() {
  const total = stack.reduce((n, g) => n + g.items.length, 0);
  return (
    <section className="section stack" id="stack" aria-labelledby="stack-title">
      <div className="container">
        <SectionHead
          index="07"
          label="Stack"
          id="stack-title"
          title={['The', <span className="outline" key="t">toolchain</span>]}
          lede={`${stack.length} groups, ${total} tools — the ones that show up in the work above, plus the two I’m going deep on now (marked).`}
        />
        <div className="stack__grid">
          {stack.map((g, i) => (
            <Reveal as="section" className={`stack__group ${g.status ? 'is-learning' : ''}`} key={g.id} i={i} aria-labelledby={`stack-${g.id}`}>
              <header className="stack__head">
                <span className="label label--lime">{g.id}</span>
                <h3 id={`stack-${g.id}`}>{g.label}</h3>
                <span className="label">{String(g.items.length).padStart(2, '0')}</span>
              </header>
              {g.status && (
                <p className="stack__status label">
                  <span className="dot" aria-hidden="true" /> {g.status}
                </p>
              )}
              <ul className="stack__items">
                {g.items.map((it, j) => (
                  <li key={it} style={{ transitionDelay: `${i * 80 + j * 40 + 200}ms` }}>
                    {it}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
