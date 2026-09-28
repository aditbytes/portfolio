import { useEffect, useState } from 'react';
import { VisualFrame } from './VisualFrame';

const STEPS = ['User', 'Natural language', 'AI agent', 'Python execution', 'Analysis', 'Insight'];
const QUESTION = 'Which region grew fastest quarter-on-quarter?';
const CODE = [
  'df = load("sales.csv")',
  'q = df.groupby(["region", "quarter"])["revenue"].sum()',
  'growth = q.groupby(level=0).pct_change()',
  'growth.groupby(level=0).last().idxmax()',
];
const BARS = [
  { k: 'North', v: 0.42 },
  { k: 'East', v: 0.58 },
  { k: 'South', v: 0.91 },
  { k: 'West', v: 0.36 },
];

/** Plays the agent loop once in view; reduced-motion users get the final frame. */
function useStep(active: boolean) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(STEPS.length - 1);
      return;
    }
    let s = 0;
    setStep(0);
    const id = window.setInterval(() => {
      s = s >= STEPS.length + 2 ? 0 : s + 1; // hold on the result for a few beats
      setStep(Math.min(s, STEPS.length - 1));
    }, 1100);
    return () => window.clearInterval(id);
  }, [active]);
  return step;
}

function Body({ inView }: { inView: boolean }) {
  const step = useStep(inView);
  return (
    <div className="ds">
      <ol className="ds__rail">
        {STEPS.map((s, i) => (
          <li key={s} className={i < step ? 'is-done' : i === step ? 'is-on' : ''}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            {s}
          </li>
        ))}
      </ol>

      <div className="ds__term">
        <div className={`ds__msg ds__msg--user ${step >= 1 ? 'is-on' : ''}`}>
          <span className="ds__who">you</span>
          <p>{QUESTION}</p>
        </div>

        <div className={`ds__msg ${step >= 2 ? 'is-on' : ''}`}>
          <span className="ds__who ds__who--agent">agent · bedrock</span>
          <pre className="ds__code">
            <code>
              {CODE.map((line, i) => (
                <span key={i} className={step >= 3 ? 'is-on' : ''} style={{ transitionDelay: `${i * 120}ms` }}>
                  {line}
                  {'\n'}
                </span>
              ))}
            </code>
          </pre>
          <div className={`ds__guards ${step >= 3 ? 'is-on' : ''}`}>
            {['IAM role', 'AES-256', 'Audit log', 'Sandbox'].map((g) => (
              <span key={g}>✓ {g}</span>
            ))}
          </div>
        </div>

        <div className={`ds__msg ds__result ${step >= 4 ? 'is-on' : ''}`}>
          <span className="ds__who ds__who--agent">result</span>
          <div className="ds__bars">
            {BARS.map((b) => (
              <div key={b.k} className={`ds__bar ${b.k === 'South' ? 'is-top' : ''}`}>
                <span className="ds__bar-k">{b.k}</span>
                <span className="ds__bar-track">
                  <span style={{ transform: `scaleX(${step >= 4 ? b.v : 0})` }} />
                </span>
              </div>
            ))}
          </div>
          <p className={`ds__insight ${step >= 5 ? 'is-on' : ''}`}>→ South leads — computed, not guessed. Code attached.</p>
        </div>
      </div>
    </div>
  );
}

export function DataScoutVisual() {
  return (
    <VisualFrame
      file="datascout · agent session · fig.04"
      note="Illustrative session"
      label="An agent session: a plain-English question, generated pandas code running in a sandbox with IAM, encryption, audit log and sandbox checks, and a bar-chart answer"
    >
      {(inView) => <Body inView={inView} />}
    </VisualFrame>
  );
}
