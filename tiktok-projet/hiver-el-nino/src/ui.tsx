import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Easing, interpolate, interpolateColors, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

// Palette du PowerPoint (voir README)
export const C = {
  cream: '#F3EDE2', ink: '#1B1E1C', orange: '#FF6B35', green: '#3CC47C', greenD: '#2A9A5E', night: '#1E2440',
  sand: '#D9CBB7', wall: '#D2C1AA', wallD: '#C3AF95', win: '#3C4250', grey: '#9A9087', leaf: '#5E9E4E', leaf2: '#6CB85A',
  warm: '#FFB38A', cool: '#BFE3F0', lamp: '#FFD27A', blue: '#3A4A7A',
};

export const fontCss = ['oswald-latin-500-normal', 'oswald-latin-700-normal', 'rubik-latin-400-normal', 'rubik-latin-500-normal', 'rubik-latin-700-normal', 'rubik-latin-800-normal']
  .map((n) => { const [fam, , w] = n.split('-'); return `@font-face{font-family:${fam[0].toUpperCase() + fam.slice(1)};font-weight:${w};src:url(${staticFile(n + '.woff2')})}`; })
  .join('\n');

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const hash = (n: number) => { const x = Math.sin(n * 127.1 + 0.3) * 43758.5453; return x - Math.floor(x); };

// Durée de la scène courante (en images), pour placer les animations en fraction de scène :
// ainsi elles restent calées quand on remplace les temps estimés par les vrais temps de la voix.
export const SceneDur = createContext(300);
export const useAt = () => { const d = useContext(SceneDur); return (fr: number) => Math.round(fr * d); };

// Ressort doux (pas de rebond) : rythme posé
export const useIn = (delay: number, damping = 200, stiffness = 100) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: {damping, stiffness}});
};
export const useLin = (from: number, to: number) => {
  const f = useCurrentFrame();
  return interpolate(f, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
};

export const Kicker: React.FC<{text: string; color?: string; delay?: number; top?: number}> = ({text, color = C.greenD, delay = 0, top = 210}) => {
  const s = useIn(delay);
  return <div style={{position: 'absolute', left: 90, top, fontFamily: 'Rubik', fontWeight: 700, fontSize: 30, letterSpacing: 5, color, opacity: s, transform: `translateY(${(1 - s) * 16}px)`}}>{text}</div>;
};

export const Title: React.FC<{lines: {t: string; c?: string}[]; delay?: number; top?: number; size?: number; center?: boolean; stagger?: number}> = ({lines, delay = 0, top = 260, size = 104, center = false, stagger = 5}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return (<div style={{position: 'absolute', left: 90, top, width: 900, textAlign: center ? 'center' : 'left'}}>
    {lines.map((l, i) => { const s = spring({frame: f - delay - i * stagger, fps, config: {damping: 200}});
      return <div key={i} style={{overflow: 'hidden', paddingBottom: 6}}><div style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: size, lineHeight: 1.04, textTransform: 'uppercase', color: l.c ?? C.ink, transform: `translateY(${(1 - s) * 110}%)`, textShadow: '0 6px 0 rgba(0,0,0,.08)'}}>{l.t}</div></div>; })}
  </div>);
};

export const Para: React.FC<{children: React.ReactNode; delay?: number; top: number; color?: string; size?: number; center?: boolean; weight?: number}> = ({children, delay = 0, top, color = C.ink, size = 44, center = false, weight = 500}) => {
  const s = useIn(delay);
  return <div style={{position: 'absolute', left: 90, width: 900, top, textAlign: center ? 'center' : 'left', fontFamily: 'Rubik', fontWeight: weight, fontSize: size, lineHeight: 1.3, color, opacity: s, transform: `translateY(${(1 - s) * 24}px)`}}>{children}</div>;
};

// Source en petit en bas de l'écran (même place que les épisodes 1-3)
export const Source: React.FC<{text: string; color?: string; delay?: number}> = ({text, color = C.ink, delay = 24}) => {
  const s = useIn(delay);
  return <div style={{position: 'absolute', left: 90, top: 1820, width: 920, fontFamily: 'Rubik', fontWeight: 500, fontSize: 22, color, opacity: s * 0.7}}>{text}</div>;
};

export const Chip: React.FC<{text: string; delay: number; top: number; bg?: string; color?: string; icon?: React.ReactNode}> = ({text, delay, top, bg = '#fff', color = C.ink, icon}) => {
  const s = useIn(delay);
  return <div style={{position: 'absolute', left: 90, top, display: 'flex', alignItems: 'center', gap: 22, padding: '20px 34px', borderRadius: 26, background: bg, boxShadow: '0 12px 28px rgba(58,36,16,.12)', fontFamily: 'Rubik', fontWeight: 700, fontSize: 40, color, opacity: s, transform: `translateY(${(1 - s) * 30}px)`}}>{icon}{text}</div>;
};

export const Grain: React.FC = () => <AbsoluteFill style={{pointerEvents: 'none', opacity: 0.045, backgroundImage: 'radial-gradient(#000 .8px,transparent 1px)', backgroundSize: '4px 4px'}} />;

// Lent mouvement de caméra (jamais brusque)
export const Drift: React.FC<{children: React.ReactNode; from?: number; to?: number; origin?: string; y?: number}> = ({children, from = 1, to = 1.04, origin = '540px 1200px', y = 0}) => {
  const f = useCurrentFrame(); const d = useContext(SceneDur);
  const k = interpolate(f, [0, d], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)});
  return <AbsoluteFill style={{transform: `translateY(${k * y}px) scale(${from + (to - from) * k})`, transformOrigin: origin}}>{children}</AbsoluteFill>;
};

// Immeuble de cité, toit qui verdit selon `green` (0..1), fenêtres allumées selon `lit` (0..1)
export const Tower: React.FC<{x: number; w: number; h: number; base?: number; green?: number; lit?: number; seed?: number; body?: string; side?: string}> = ({x, w, h, base = 1500, green = 0, lit = 0, seed = 1, body = C.wall, side = C.wallD}) => {
  const top = base - h;
  const cols = Math.max(2, Math.floor((w - 40) / 80)); const rows = Math.max(1, Math.floor((h - 90) / 100));
  const cw = (w - 40) / cols; const nP = Math.floor(w / 34);
  return (<g>
    <rect x={x} y={top} width={w} height={h} fill={body} />
    <rect x={x + w * 0.72} y={top} width={w * 0.28} height={h} fill={side} />
    {Array.from({length: rows}).map((_, r) => Array.from({length: cols}).map((__, c) => {
      const on = lit > hash(seed * 31 + r * 7 + c * 3);
      return <rect key={r + '-' + c} x={x + 20 + c * cw + (cw - 44) / 2} y={top + 50 + r * 100} width={44} height={60} rx={6} fill={on ? C.lamp : C.win} />;
    }))}
    <rect x={x - 8} y={top - 18} width={w + 16} height={22} rx={6} fill={interpolateColors(clamp(green), [0, 1], [C.grey, C.leaf])} />
    {Array.from({length: nP}).map((_, i) => {
      const k = Easing.out(Easing.cubic)(clamp(green * 1.6 - (i / nP) * 0.6));
      return <circle key={i} cx={x + 14 + i * ((w - 12) / nP)} cy={top - 18} r={(13 + hash(seed + i) * 11) * k} fill={i % 2 ? C.leaf : C.leaf2} />;
    })}
  </g>);
};

export const Thermo: React.FC<{x: number; y: number; level: number; color: string}> = ({x, y, level, color}) => (
  <g>
    <rect x={x - 22} y={y} width={44} height={250} rx={22} fill="#fff" stroke={C.ink} strokeWidth={6} />
    <rect x={x - 9} y={y + 240 - 215 * level} width={18} height={215 * level} rx={9} fill={color} />
    <circle cx={x} cy={y + 270} r={40} fill={color} stroke={C.ink} strokeWidth={6} />
    {[0.25, 0.5, 0.75].map((k) => <line key={k} x1={x + 22} x2={x + 40} y1={y + 240 - 215 * k} y2={y + 240 - 215 * k} stroke={C.ink} strokeWidth={5} strokeLinecap="round" />)}
  </g>
);

// Petites icônes (viewBox 120)
export const Icon: React.FC<{kind: 'roof' | 'leaf' | 'seed' | 'bug' | 'drop'; size?: number}> = ({kind, size = 120}) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <circle cx={60} cy={60} r={58} fill="#fff" />
    {kind === 'roof' && <g><rect x={30} y={50} width={60} height={48} fill={C.wall} /><rect x={26} y={40} width={68} height={12} rx={4} fill={C.leaf} /><circle cx={38} cy={40} r={9} fill={C.leaf2} /><circle cx={58} cy={38} r={11} fill={C.leaf} /><circle cx={80} cy={40} r={9} fill={C.leaf2} />{[0, 1].map((r) => [0, 1, 2].map((c) => <rect key={r + '' + c} x={37 + c * 17} y={60 + r * 18} width={10} height={12} rx={2} fill={C.win} />))}</g>}
    {kind === 'leaf' && <g><path d="M60 18 C100 36 100 84 60 104 C20 84 20 36 60 18 Z" fill={C.leaf2} /><path d="M60 30 L60 98 M60 55 L44 44 M60 72 L76 60 M60 86 L46 76" stroke={C.leaf} strokeWidth={5} strokeLinecap="round" fill="none" /></g>}
    {kind === 'seed' && <g><path d="M60 100 L60 58" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />{Array.from({length: 9}).map((_, i) => { const a = (-160 + i * 17.5) * Math.PI / 180; return <g key={i}><line x1={60} y1={58} x2={60 + Math.cos(a) * 36} y2={58 + Math.sin(a) * 36} stroke={C.grey} strokeWidth={3} /><circle cx={60 + Math.cos(a) * 38} cy={58 + Math.sin(a) * 38} r={4} fill={C.grey} /></g>; })}<path d="M18 90 Q40 80 52 92" stroke={C.green} strokeWidth={4} fill="none" strokeLinecap="round" /></g>}
    {kind === 'bug' && <g><circle cx={60} cy={36} r={13} fill={C.ink} /><ellipse cx={60} cy={68} rx={32} ry={34} fill="#E8321E" /><line x1={60} y1={36} x2={60} y2={102} stroke={C.ink} strokeWidth={4} /><circle cx={46} cy={58} r={6} fill={C.ink} /><circle cx={74} cy={58} r={6} fill={C.ink} /><circle cx={44} cy={82} r={6} fill={C.ink} /><circle cx={76} cy={82} r={6} fill={C.ink} /></g>}
    {kind === 'drop' && <path d="M60 20 C78 48 90 62 90 78 A30 30 0 0 1 30 78 C30 62 42 48 60 20 Z" fill="#5BB8E0" />}
  </svg>
);
