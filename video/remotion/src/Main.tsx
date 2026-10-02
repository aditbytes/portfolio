import React, { useEffect, useState } from 'react';
import { AbsoluteFill, Sequence, continueRender, delayRender, useCurrentFrame } from 'remotion';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import '@fontsource-variable/space-grotesk';
import { Mono, Paper, Scene } from './components';
import { About, Keywords, Open, Signal, Stack, WorkIntro } from './scenes1';
import { DemandIQ, End, Experience, IndiEye, Indra, More, Regime, Whoami } from './scenes2';
import { C, F, easeInOut, tw } from './theme';

export const TOTAL = 4500;
const X = 10; // tail overlap: previous scene fades out while the next fades in

export const TIMELINE: { id: string; from: number; to: number; label?: string; C: React.FC }[] = [
  { id: 'open', from: 0, to: 300, C: Open },
  { id: 'signal', from: 300, to: 525, label: '01 · Who', C: Signal },
  { id: 'keywords', from: 525, to: 750, label: '01 · Who', C: Keywords },
  { id: 'about', from: 750, to: 975, label: '01 · About', C: About },
  { id: 'stack', from: 975, to: 1350, label: '02 · Stack', C: Stack },
  { id: 'workintro', from: 1350, to: 1425, label: '03 · Selected work', C: WorkIntro },
  { id: 'indra', from: 1425, to: 1950, label: '03 · Selected work', C: Indra },
  { id: 'regime', from: 1950, to: 2550, label: '03 · Selected work', C: Regime },
  { id: 'demandiq', from: 2550, to: 3030, label: '03 · Selected work', C: DemandIQ },
  { id: 'indieye', from: 3030, to: 3375, label: '03 · Selected work', C: IndiEye },
  { id: 'more', from: 3375, to: 3600, label: '03 · Also built', C: More },
  { id: 'experience', from: 3600, to: 3900, label: '04 · Experience', C: Experience },
  { id: 'whoami', from: 3900, to: 4125, label: '05 · whoami', C: Whoami },
  { id: 'end', from: 4125, to: 4500, C: End },
];

const Hud: React.FC = () => {
  const f = useCurrentFrame();
  const vis = Math.min(tw(f, 160, 200, 0, 1, easeInOut), tw(f, 4125, 4150, 1, 0, easeInOut));
  const seg = TIMELINE.find((s) => f >= s.from && f < s.to);
  const label = seg?.label ?? '';
  return (
    <AbsoluteFill style={{ opacity: vis, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 120, top: 46, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 24, letterSpacing: '0.08em', color: C.ink }}>ADITYA</span>
        <span style={{ width: 9, height: 9, borderRadius: 9, background: C.lime, boxShadow: `0 0 0 1.5px ${C.olive}` }} />
      </div>
      <div style={{ position: 'absolute', right: 120, top: 50 }}>
        <Mono size={14} color={C.ink2}>{label}</Mono>
      </div>
      <div style={{ position: 'absolute', left: 120, right: 120, bottom: 40, height: 2, background: 'rgba(17,18,20,0.08)' }}>
        <div style={{ width: `${(f / TOTAL) * 100}%`, height: 2, background: C.ink }} />
      </div>
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all([
      document.fonts.load('700 100px "Space Grotesk Variable"'),
      document.fonts.load('500 100px "Space Grotesk Variable"'),
      document.fonts.load('400 20px "Inter Variable"'),
      document.fonts.load('400 20px "JetBrains Mono Variable"'),
      document.fonts.load('700 20px "JetBrains Mono Variable"'),
    ]).then(() => document.fonts.ready).then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Paper />
      {TIMELINE.map((s, i) => {
        const start = s.from;
        const end = Math.min(TOTAL, s.to + (i < TIMELINE.length - 1 ? X : 0));
        const Comp = s.C;
        return (
          <Sequence key={s.id} from={start} durationInFrames={end - start} name={s.id}>
            <Scene dur={end - start} fadeIn={i ? 2 * X : 1} fadeOut={i < TIMELINE.length - 1 ? 2 * X : 1}>
              <Comp />
            </Scene>
          </Sequence>
        );
      })}
      <Hud />
    </AbsoluteFill>
  );
};
