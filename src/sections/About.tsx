import type { CSSProperties } from 'react';
import { Portrait } from '../components/Portrait';
import { MaskedLines, Reveal } from '../components/Reveal';
import { site } from '../content/site';
import { Link } from '../lib/router';
import './about.css';

const INTERESTS = ['AI / ML', 'Quantitative Research', 'Data Infrastructure', 'Cloud Systems', 'Applied Research'];

export function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="container about__grid">
        <Reveal className="about__visual">
          <figure className="about__figure">
            <div className="about__frame">
              <Portrait
                name="about"
                widths={[480, 864]}
                sizes="(max-width: 900px) 88vw, 40vw"
                width={864}
                height={1080}
                alt="Portrait of Aditya in a charcoal three-piece suit and paisley tie against a clear sky."
              />
            </div>
            <ul className="about__labels" aria-hidden="true">
              <li style={{ '--i': 0 } as CSSProperties}>{site.education.short}</li>
              <li style={{ '--i': 1 } as CSSProperties}>{site.education.schoolShort}</li>
              <li style={{ '--i': 2 } as CSSProperties}>{site.education.period}</li>
            </ul>
            <figcaption className="label">
              <span>Fig. 07</span>
              <span>Identity</span>
            </figcaption>
          </figure>
        </Reveal>

        <div className="about__copy">
          <Reveal className="section-head__meta label">
            <span className="section-head__index">[07]</span>
            <span>About</span>
          </Reveal>
          <h2 className="about__title" id="about-title">
            <MaskedLines
              lines={[
                'I build at the intersection of',
                <>
                  <em>machine learning</em>, <em>data</em>,
                </>,
                <>
                  <em>markets</em> and <em>production systems</em>.
                </>,
              ]}
            />
          </h2>

          <Reveal className="about__bio" i={1}>
            <p>
              I’m a Computer Science &amp; Data Analytics undergraduate at IIT Patna. My work sits where models meet
              real decisions — detecting market regimes, forecasting retail demand, extracting sentiment from news and
              filings, and building agents that compute answers instead of guessing them.
            </p>
            <p>
              I care about the unglamorous parts: features that don’t leak the future, evaluation that matches how a
              model will actually be used, and interfaces that let someone act on the output. Right now that means
              building <Link href="/work/indieye" className="u-link about__link">IndiEye</Link>, an open research
              platform for market intelligence.
            </p>
          </Reveal>

          <Reveal className="about__cards" i={2}>
            <div className="about__card">
              <span className="label">Education</span>
              <p className="about__degree">{site.education.degree}</p>
              <p>{site.education.school}</p>
              <p className="label label--lime">{site.education.periodLong}</p>
            </div>
            <div className="about__card">
              <span className="label">Interests</span>
              <ul className="chips">
                {INTERESTS.map((t) => (
                  <li className="chip" key={t}>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
