import type { CSSProperties, MouseEvent } from 'react';
import { ArrowRight, ArrowUpRight, Lock } from '../components/Icons';
import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';
import { moreBuilds } from '../content/profile';
import { projects, type Project } from '../content/projects';
import { Link, navigate } from '../lib/router';
import { projectVisuals } from '../visuals';
import './work.css';

export function ProjectLinks({ project }: { project: Project }) {
  return (
    <>
      {project.links.map((l) => (
        <a key={l.href} className="btn btn--ghost" href={l.href} target="_blank" rel="noopener noreferrer">
          {l.label} <ArrowUpRight />
        </a>
      ))}
      {project.sourceNote && (
        <span className="project__private label">
          <Lock /> {project.sourceNote}
        </span>
      )}
    </>
  );
}

function ProjectRow({ project, flip }: { project: Project; flip: boolean }) {
  const Visual = projectVisuals[project.slug];
  const href = `/work/${project.slug}`;

  // The whole card opens the case study; real links/controls inside keep their own behaviour.
  const onClick = (e: MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest('a, button, input, label, select, textarea')) return;
    if (window.getSelection()?.toString()) return;
    navigate(href);
  };

  return (
    <article
      className={`project ${project.flagship ? 'project--flagship' : ''} ${flip ? 'is-flip' : ''}`}
      data-accent={project.accent}
      data-cursor="view"
      onClick={onClick}
      aria-labelledby={`p-${project.slug}`}
    >
      <Reveal className="project__info">
        <div className="project__top label">
          {project.flagship && project.badge && <span className="project__badge">{project.badge}</span>}
          <span className="project__num">
            <b>{project.index}</b> / {String(projects.length).padStart(2, '0')}
          </span>
          <span className="project__cat">{project.category}</span>
          <span className="project__year">{project.year}</span>
        </div>

        <h3 className="project__title" id={`p-${project.slug}`}>
          <Link href={href}>{project.title}</Link>
        </h3>
        <p className="project__subtitle">{project.subtitle}</p>
        <p className="project__line">{project.oneLiner}</p>

        <ol className="project__flow label" aria-label="System flow">
          {project.flow.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ol>

        <ul className="chips project__chips" aria-label="Technologies">
          {project.tech.map((t) => (
            <li className="chip" key={t}>
              {t}
            </li>
          ))}
        </ul>

        <dl className="project__metrics">
          {project.metrics.map((m, i) => (
            <div key={m.label} style={{ '--i': i } as CSSProperties}>
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>

        <div className="project__actions">
          <Link href={href} className="btn">
            Case study <ArrowRight />
          </Link>
          <ProjectLinks project={project} />
        </div>
      </Reveal>

      <Reveal className="project__visual" i={1}>
        {Visual && <Visual />}
      </Reveal>
    </article>
  );
}

export function Work() {
  let flip = false;
  return (
    <section className="section work" id="work" aria-labelledby="work-title">
      <div className="container">
        <SectionHead
          index="02"
          label="Selected Work"
          id="work-title"
          title={['Selected', <span className="outline" key="w">work</span>]}
          lede="Eight systems across data platforms, quant research, ML platforms, agentic AI and interpretability. Each one is a pipeline, not a notebook — click through for the case study."
        />
        <div className="work__list">
          {projects.map((p) => {
            const row = <ProjectRow key={p.slug} project={p} flip={flip} />;
            if (!p.flagship) flip = !flip;
            return row;
          })}
        </div>

        <div className="more">
          <Reveal className="section-head__meta label">
            <span className="section-head__index" id="more-title">
              More builds
            </span>
            <span>{String(moreBuilds.length).padStart(2, '0')}</span>
          </Reveal>
          <ul className="more__list">
            {moreBuilds.map((b, i) => (
              <Reveal as="li" key={b.name} i={i}>
                <a className="more__row" href={b.href} target="_blank" rel="noopener noreferrer">
                  <span className="more__name">
                    {b.name} <ArrowUpRight />
                  </span>
                  <span className="more__desc">{b.description}</span>
                  <span className="more__tags">
                    {b.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
