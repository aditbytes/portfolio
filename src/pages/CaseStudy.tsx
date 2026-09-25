import type { CSSProperties } from 'react';
import { ArrowLeft, ArrowRight } from '../components/Icons';
import { MaskedLines, Reveal } from '../components/Reveal';
import { projects, type Project } from '../content/projects';
import { site } from '../content/site';
import { Link } from '../lib/router';
import { usePageMeta } from '../lib/meta';
import { ProjectLinks } from '../sections/Work';
import { projectVisuals } from '../visuals';
import './case.css';

export default function CaseStudy({ project }: { project: Project }) {
  usePageMeta(`${project.title} — Case study · ${site.name}`, project.oneLiner);
  const Visual = projectVisuals[project.slug];
  const idx = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(idx + 1) % projects.length];
  const { caseStudy: cs } = project;

  return (
    <article className="case" data-accent={project.accent} aria-labelledby="case-title">
      <div className="container">
        <Reveal className="case__back">
          <Link href="/#work" className="btn btn--ghost">
            <ArrowLeft /> All work
          </Link>
        </Reveal>

        <header className="case__head">
          <p className="label case__meta">
            <span className="case__num">
              {project.index} / {String(projects.length).padStart(2, '0')}
            </span>
            <span>{project.category}</span>
            <span>{project.year}</span>
            {project.context && <span>{project.context}</span>}
          </p>
          <h1 className="case__title" id="case-title">
            <MaskedLines lines={[project.title]} />
          </h1>
          <Reveal as="p" className="case__subtitle" i={1}>
            {project.subtitle}
          </Reveal>
          <Reveal as="p" className="case__lede" i={2}>
            {project.oneLiner}
          </Reveal>
          <Reveal className="case__actions" i={3}>
            <ProjectLinks project={project} />
          </Reveal>
        </header>

        <Reveal className="case__visual">{Visual && <Visual />}</Reveal>

        <dl className="case__details">
          {cs.details.map((d, i) => (
            <Reveal key={d.label} i={i}>
              <dt className="label">{d.label}</dt>
              <dd>{d.value}</dd>
            </Reveal>
          ))}
        </dl>

        <section className="case__block" aria-labelledby="case-problem">
          <p className="label case__block-label" id="case-problem">
            <span className="label--lime">01</span> Problem
          </p>
          <Reveal as="p" className="case__problem">
            {cs.problem}
          </Reveal>
        </section>

        <section className="case__block" aria-labelledby="case-approach">
          <p className="label case__block-label" id="case-approach">
            <span className="label--lime">02</span> Approach
          </p>
          <ol className="case__steps">
            {cs.approach.map((s, i) => (
              <Reveal as="li" key={s.title} i={i} style={{ '--n': `"${String(i + 1).padStart(2, '0')}"` } as CSSProperties}>
                <h2 className="case__step-title">{s.title}</h2>
                <p>{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </section>

        <section className="case__block" aria-labelledby="case-results">
          <p className="label case__block-label" id="case-results">
            <span className="label--lime">03</span> Results
          </p>
          <div>
            <dl className="case__metrics">
              {project.metrics.map((m, i) => (
                <Reveal key={m.label} i={i}>
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </Reveal>
              ))}
            </dl>
            <ul className="case__results">
              {cs.results.map((r, i) => (
                <Reveal as="li" key={r} i={i}>
                  {r}
                </Reveal>
              ))}
            </ul>
            {cs.resultsNote && <p className="case__note label">{cs.resultsNote}</p>}
          </div>
        </section>

        <section className="case__block" aria-labelledby="case-stack">
          <p className="label case__block-label" id="case-stack">
            <span className="label--lime">04</span> Stack
          </p>
          <ul className="chips">
            {project.tech.map((t) => (
              <li className="chip" key={t}>
                {t}
              </li>
            ))}
          </ul>
        </section>

        <Link href={`/work/${next.slug}`} className="case__next" data-cursor="view">
          <span className="label">Next case study · {next.index}</span>
          <span className="case__next-title">
            {next.title} <ArrowRight />
          </span>
        </Link>
      </div>
    </article>
  );
}
