import { ArrowRight } from '../components/Icons';
import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';
import { researchNotes } from '../content/profile';
import { Link } from '../lib/router';
import './research.css';

export function Research() {
  return (
    <section className="section research" id="research" aria-labelledby="research-title">
      <div className="container">
        <SectionHead
          index="05"
          label="Research / Thinking"
          id="research-title"
          title={['Beyond', <span className="outline" key="s">shipping.</span>]}
          lede="Shipping a model is half the job. The other half is knowing when it’s right, why it works, and where it breaks."
        />

        <div className="notes">
          {researchNotes.map((n, i) => (
            <Reveal as="article" className="note" key={n.id} i={i} aria-labelledby={`note-${n.id}`}>
              <header className="note__head">
                <span className="label label--lime">{n.id}</span>
                <span className="label">{n.kind}</span>
              </header>
              <h3 className="note__title" id={`note-${n.id}`}>
                {n.title}
              </h3>
              <p className="note__q">
                <span className="label">Question</span>
                {n.question}
              </p>
              <dl className="note__fields">
                {n.fields.map((f) => (
                  <div key={f.label}>
                    <dt className="label">{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="note__finding">
                <span className="label">Result</span>
                <p>{n.finding}</p>
              </div>
              <footer className="note__foot">
                <code className="note__formula" aria-hidden="true">
                  {n.formula}
                </code>
                {n.href && (
                  <Link href={n.href} className="note__link u-link" aria-label={`Read the case study: ${n.title}`}>
                    Case study <ArrowRight />
                  </Link>
                )}
              </footer>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
