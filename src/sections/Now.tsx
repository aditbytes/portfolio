import { ArrowRight } from '../components/Icons';
import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';
import { nowTracks } from '../content/profile';
import { Link } from '../lib/router';
import './now.css';

export function Now() {
  return (
    <section className="section now" id="now" aria-labelledby="now-title">
      <div className="container">
        <SectionHead
          index="05"
          label="Now"
          id="now-title"
          title={['Right', <span className="outline" key="n">now.</span>]}
          lede="Building one system in production, and going deeper on how models get shipped, served and run efficiently."
        />
        <div className="now__grid">
          {nowTracks.map((t, i) => (
            <Reveal as="article" className={`now__card ${i === 0 ? 'is-building' : ''}`} key={t.title} i={i} aria-labelledby={`now-${i}`}>
              <p className="now__status label">
                <span className="dot" aria-hidden="true" /> {t.status}
              </p>
              <h3 className="now__title" id={`now-${i}`}>
                {t.title}
              </h3>
              <p className="now__body">{t.body}</p>
              <ul className="now__items">
                {t.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              {t.href && (
                <Link href={t.href} className="note__link u-link now__link">
                  Case study <ArrowRight />
                </Link>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
