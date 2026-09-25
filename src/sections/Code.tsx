import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, GitHub, Star } from '../components/Icons';
import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';
import { site } from '../content/site';
import { useInView } from '../hooks/useInView';
import { loadRepos, relativeTime, snapshot, type RepoResult } from '../lib/github';
import './code.css';

export function Code() {
  const [data, setData] = useState<RepoResult>(snapshot);
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const started = useRef(false);
  // Only hit the network once the section is close to the viewport.
  const [ref, near] = useInView<HTMLDivElement>({ rootMargin: '600px 0px' });

  useEffect(() => {
    if (!near || started.current) return;
    started.current = true;
    setState('loading');
    loadRepos().then((d) => {
      setData(d);
      setState('done');
    });
  }, [near]);

  return (
    <section className="section code" id="code" aria-labelledby="code-title">
      <div className="container">
        <SectionHead
          index="08"
          label="Open Source / Code"
          id="code-title"
          title={['Read the', <span className="outline" key="c">source</span>]}
          lede="The public half of the work lives on GitHub. Some projects — like the regime framework and IndiEye’s core — are private for now."
        />

        <div ref={ref}>
        <Reveal className="term">
          <div className="term__bar">
            <span className="term__prompt">
              <span className="label--lime">~/{site.github.handle}</span> $ ls --sort=featured
            </span>
            <span className={`term__status ${data.live ? 'is-live' : ''}`} role="status">
              {state === 'loading' ? 'fetching…' : data.live ? `● live · ${data.total} public repos` : '○ snapshot · live stats unavailable'}
            </span>
          </div>
          <ul className="term__list">
            {data.repos.map((r) => (
              <li key={r.name}>
                <a className="repo" href={r.url} target="_blank" rel="noopener noreferrer">
                  <span className="repo__name">
                    {r.name}
                    <ArrowUpRight />
                  </span>
                  <span className="repo__desc">{r.description}</span>
                  <span className="repo__meta">
                    <span className="repo__lang">
                      <i data-lang={r.language} /> {r.language}
                    </span>
                    {r.stars !== null && (
                      <span className="repo__stars" aria-label={`${r.stars} stars`}>
                        <Star /> {r.stars}
                      </span>
                    )}
                    {r.pushedAt && <span className="repo__time">pushed {relativeTime(r.pushedAt)}</span>}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
        </div>

        <Reveal className="code__cta" i={1}>
          <a className="btn btn--primary" href={site.github.url} target="_blank" rel="noopener noreferrer">
            <GitHub /> Explore GitHub <ArrowUpRight />
          </a>
          <span className="label">github.com/{site.github.handle}</span>
        </Reveal>
      </div>
    </section>
  );
}
