import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {SCENES} from './scenes';
import {END, PT} from './timing';
import {SceneDur, fontCss} from './ui';

export const FPS = 30;
const FADE = 15; // fondu enchaîné doux entre les scènes (0,5 s)

const FadeIn: React.FC<{children: React.ReactNode; first: boolean}> = ({children, first}) => {
  const f = useCurrentFrame();
  const o = first ? 1 : interpolate(f, [0, FADE], [0, 1], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

export type SebProps = {voice: string | null; mix: string | null};

export const SebXV: React.FC<SebProps> = ({voice, mix}) => {
  // Chaque scène commence un peu avant sa phrase (le fondu se termine quand la voix démarre)
  const starts = PT.map((t, i) => (i === 0 ? 0 : Math.max(0, Math.round(t * FPS) - FADE)));
  const total = Math.round(END * FPS);
  return (<AbsoluteFill style={{background: '#0E0F0E'}}>
    <style>{fontCss}</style>
    {SCENES.map((Scene, i) => {
      const from = starts[i]; const to = i + 1 < SCENES.length ? starts[i + 1] + FADE : total;
      return (<Sequence key={i} from={from} durationInFrames={to - from} name={`Scène ${i + 1}`}>
        <SceneDur.Provider value={to - from}><FadeIn first={i === 0}><Scene /></FadeIn></SceneDur.Provider>
      </Sequence>);
    })}
    {mix ? <Audio src={staticFile(mix)} /> : voice ? <Audio src={staticFile(voice)} /> : null}
  </AbsoluteFill>);
};
