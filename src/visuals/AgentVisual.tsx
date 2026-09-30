import { useEffect, useState } from 'react';
import { VisualFrame } from './VisualFrame';

const ROLES = ['Goal', 'Planner', 'Executor', 'Evaluator', 'Memory', 'Result'];
const GOAL = 'Research agent-architecture papers and summarise the top 3';
const PLAN = [
  { step: 'search recent papers', tool: 'web_search' },
  { step: 'fetch the top results', tool: 'http_get' },
  { step: 'write the summary', tool: 'file_write' },
];

/** Walks the loop once in view; reduced-motion users get the final frame. */
function useStep(active: boolean) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(ROLES.length - 1);
      return;
    }
    let s = 0;
    setStep(0);
    const id = window.setInterval(() => {
      s = s >= ROLES.length + 2 ? 0 : s + 1;
      setStep(Math.min(s, ROLES.length - 1));
    }, 1100);
    return () => window.clearInterval(id);
  }, [active]);
  return step;
}

function Body({ inView }: { inView: boolean }) {
  const step = useStep(inView);
  return (
    <div className="ds ag">
      <ol className="ds__rail">
        {ROLES.map((r, i) => (
          <li key={r} className={i < step ? 'is-done' : i === step ? 'is-on' : ''}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            {r}
          </li>
        ))}
      </ol>

      <div className="ds__term">
        <div className={`ds__msg ds__msg--user ${step >= 0 ? 'is-on' : ''}`}>
          <span className="ds__who">goal</span>
          <p>{GOAL}</p>
        </div>

        <div className={`ds__msg ${step >= 1 ? 'is-on' : ''}`}>
          <span className="ds__who ds__who--agent">planner → plan</span>
          <ol className="ag__plan">
            {PLAN.map((p, i) => {
              const state = step >= 3 ? 'done' : step === 2 ? (i === 0 ? 'done' : i === 1 ? 'run' : 'wait') : 'wait';
              return (
                <li key={p.step} className={`is-${state}`}>
                  <span className="ag__mark">{state === 'done' ? '✓' : state === 'run' ? '●' : '○'}</span>
                  <span className="ag__step">{p.step}</span>
                  <code>{p.tool}</code>
                </li>
              );
            })}
          </ol>
          <div className={`ds__guards ${step >= 2 ? 'is-on' : ''}`}>
            {['Validated', 'Timeout', 'Retry ×3', 'Traced'].map((g) => (
              <span key={g}>✓ {g}</span>
            ))}
          </div>
        </div>

        <div className={`ds__msg ${step >= 3 ? 'is-on' : ''}`}>
          <span className="ds__who ds__who--agent">evaluator</span>
          <p className="ag__eval">goal met · 3/3 subtasks · summary written</p>
          <div className={`ag__mem ${step >= 4 ? 'is-on' : ''}`}>
            <span>short-term · task state</span>
            <span>long-term · vector store</span>
          </div>
          <p className={`ds__insight ${step >= 5 ? 'is-on' : ''}`}>→ Result returned with a full trace.</p>
        </div>
      </div>
    </div>
  );
}

export function AgentVisual() {
  return (
    <VisualFrame
      file="agentic-core · agent loop · fig.07"
      note="Design walkthrough"
      label="The agent loop: a goal becomes a three-step plan, tools run with validation, timeouts and retries, an evaluator checks the result, and memory stores task state and long-term context"
    >
      {(inView) => <Body inView={inView} />}
    </VisualFrame>
  );
}
