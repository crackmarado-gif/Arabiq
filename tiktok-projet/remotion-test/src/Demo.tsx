import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, staticFile, interpolateColors, Easing} from 'remotion';
import {TransitionSeries, linearTiming, springTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {wipe} from '@remotion/transitions/wipe';

const fontCss = `
@font-face{font-family:Oswald;font-weight:700;src:url(${staticFile('oswald-latin-700-normal.woff2')})}
@font-face{font-family:Rubik;font-weight:500;src:url(${staticFile('rubik-latin-500-normal.woff2')})}
@font-face{font-family:Rubik;font-weight:700;src:url(${staticFile('rubik-latin-700-normal.woff2')})}`;

const Title: React.FC<{lines: {t: string; c: string}[]; delay?: number; top?: number}> = ({lines, delay = 0, top = 260}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return (<div style={{position: 'absolute', left: 90, top, width: 920}}>
    {lines.map((l, i) => { const s = spring({frame: f - delay - i * 4, fps, config: {damping: 200}});
      return <div key={i} style={{overflow: 'hidden'}}><div style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 104, lineHeight: 1.04, textTransform: 'uppercase', color: l.c, transform: `translateY(${(1 - s) * 110}%)`}}>{l.t}</div></div>;})}
  </div>);
};

const Roof: React.FC<{x: number; w: number; h: number; d: number}> = ({x, w, h, d}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const g = spring({frame: f - d, fps, config: {damping: 14, stiffness: 90}});
  const plants = Array.from({length: Math.floor(w / 36)});
  return (<g>
    <rect x={x} y={1500 - h} width={w} height={h} rx={12} fill="#D2C1AA" />
    <rect x={x + w * 0.72} y={1500 - h} width={w * 0.28} height={h} rx={12} fill="#C3AF95" />
    {Array.from({length: Math.floor((h - 80) / 100)}).map((_, r) => Array.from({length: Math.floor((w - 40) / 80)}).map((__, c) =>
      <rect key={r + '-' + c} x={x + 26 + c * 80} y={1500 - h + 50 + r * 100} width={44} height={60} rx={6} fill="#3C4250" />))}
    <rect x={x - 6} y={1500 - h - 16} width={(w + 12)} height={20} rx={8} fill={interpolateColors(g, [0, 1], ['#A8998A', '#5E9E4E'])} />
    {plants.map((_, i) => { const k = spring({frame: f - d - 4 - i * 2, fps, config: {damping: 10, stiffness: 120}});
      const px = x + 18 + i * 36; const r = 16 + (i % 3) * 5;
      return <circle key={i} cx={px} cy={1500 - h - 16} r={r * k} fill={i % 2 ? '#4F9A4A' : '#6CB85A'} />;})}
  </g>);
};

const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const sky = interpolateColors(f, [0, 100], ['#F3EDE2', '#DCEFF2']);
  const zoom = interpolate(f, [0, 130], [1, 1.08], {easing: Easing.inOut(Easing.cubic)});
  return (<AbsoluteFill style={{background: sky}}>
    <svg width={1080} height={1920} style={{transform: `scale(${zoom})`, transformOrigin: '540px 1300px'}}>
      <rect x={0} y={1500} width={1080} height={420} fill="#D9CBB7" />
      <Roof x={40} w={300} h={620} d={30} /><Roof x={380} w={320} h={900} d={42} /><Roof x={740} w={300} h={700} d={54} />
    </svg>
    <div style={{position: 'absolute', left: 90, top: 210, fontFamily: 'Rubik', fontWeight: 700, fontSize: 30, letterSpacing: 5, color: '#2A9A5E'}}>ÉPISODE 4</div>
    <Title lines={[{t: 'Et si la solution', c: '#1B1E1C'}, {t: 'était sur le toit ?', c: '#2A9A5E'}]} delay={10} />
  </AbsoluteFill>);
};

const Scene2: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const n = Math.round(interpolate(f, [10, 50], [0, 10], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
  const s = spring({frame: f - 8, fps, config: {damping: 12}});
  return (<AbsoluteFill style={{background: 'linear-gradient(170deg,#4FB884,#2E8A5C)'}}>
    <div style={{position: 'absolute', left: 90, top: 220, fontFamily: 'Rubik', fontWeight: 700, fontSize: 30, letterSpacing: 5, color: '#FFE07A'}}>UN TOIT VÉGÉTALISÉ</div>
    <div style={{position: 'absolute', width: 1080, top: 640, textAlign: 'center', fontFamily: 'Oswald', fontWeight: 700, fontSize: 300, color: '#fff', transform: `scale(${s})`}}>–{n} °C</div>
    <div style={{position: 'absolute', width: 1080, top: 1000, textAlign: 'center', fontFamily: 'Rubik', fontWeight: 500, fontSize: 46, color: '#F3EDE2'}}>par rapport à un toit en bitume noir</div>
  </AbsoluteFill>);
};

export const Demo: React.FC = () => (
  <AbsoluteFill><style>{fontCss}</style>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={140}><Scene1 /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({direction: 'from-bottom'})} timing={springTiming({config: {damping: 200}, durationInFrames: 24})} />
      <TransitionSeries.Sequence durationInFrames={124}><Scene2 /></TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
