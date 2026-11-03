import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Kicker, Title, clamp, hash, useAt, useIn, useLin} from './ui';

// Palette « tableau tactique »
export const B = {board: '#1D3A2E', chalk: 'rgba(243,237,226,.78)', cream: '#F3EDE2', xv: '#FF6B35', gold: '#FFD84A', black: '#0E0F0E', dim: 'rgba(243,237,226,.55)'};
export const W = 1080, H = 1920;
export const ease = Easing.inOut(Easing.cubic);
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const pt = (p: [number, number][], k: number): [number, number] => {
  const n = p.length - 1; const s = clamp(k) * n; const i = Math.min(n - 1, Math.floor(s)); const t = s - i;
  return [lerp(p[i][0], p[i + 1][0], t), lerp(p[i][1], p[i + 1][1], t)];
};

export const Board: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, #24473A 0%, ${B.board} 60%, #142A21 100%)`}}>
    {children}
    <AbsoluteFill style={{pointerEvents: 'none', opacity: 0.06, backgroundImage: 'radial-gradient(#fff .7px,transparent 1px)', backgroundSize: '5px 5px'}} />
  </AbsoluteFill>
);
export const Svg: React.FC<{children: React.ReactNode}> = ({children}) => <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>{children}</svg>;

// Trait de craie qui se dessine (k : 0 → 1)
export const Chalk: React.FC<{d: string; k?: number; w?: number; color?: string}> = ({d, k = 1, w = 5, color = B.chalk}) => (
  <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(k)} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
);
export const Arrow: React.FC<{d: string; k: number; end: [number, number]; ang: number; color?: string; w?: number}> = ({d, k, end, ang, color = B.chalk, w = 7}) => (
  <g>
    <Chalk d={d} k={k} w={w} color={color} />
    {k > 0.97 && <path d="M-26 -16 L0 0 L-26 16" transform={`translate(${end[0]} ${end[1]}) rotate(${ang})`} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
  </g>
);

// Terrain vertical (on attaque vers le haut)
export const X0 = 90, X1 = 990, Y0 = 420, Y1 = 1660, MY = (Y0 + Y1) / 2;
export const Pitch: React.FC<{k?: number; top?: boolean}> = ({k = 1, top = false}) => (
  <g>
    <Chalk d={top ? `M${X0} ${MY} V${Y0} H${X1} V${MY}` : `M${X0} ${Y0} H${X1} V${Y1} H${X0} Z`} k={k} />
    {!top && <Chalk d={`M${X0} ${MY} H${X1}`} k={k} />}
    {!top && <circle cx={540} cy={MY} r={110} stroke={B.chalk} strokeWidth={5} fill="none" opacity={k} />}
    <Chalk d={`M290 ${Y0} V${Y0 + 200} H790 V${Y0}`} k={k} />
    <Chalk d={`M410 ${Y0} V${Y0 + 70} H670 V${Y0}`} k={k} />
    <Chalk d={`M470 ${Y0} V${Y0 - 26} H610 V${Y0}`} k={k} w={7} />
    {!top && <Chalk d={`M290 ${Y1} V${Y1 - 200} H790 V${Y1}`} k={k} />}
  </g>
);

export const Disc: React.FC<{x: number; y: number; t: 'xv' | 'adv' | 'seb' | 'ghost'; label?: string; o?: number}> = ({x, y, t, label = '', o = 1}) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    {t === 'seb' && <circle r={50} fill="none" stroke={B.gold} strokeWidth={6} />}
    {t === 'ghost' ? <circle r={36} fill="none" stroke={B.cream} strokeWidth={4} strokeDasharray="10 8" opacity={0.7} />
      : <circle r={36} fill={t === 'adv' ? 'none' : B.xv} stroke={t === 'adv' ? B.cream : 'none'} strokeWidth={6} />}
    <text y={14} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={40} fill={t === 'ghost' ? B.dim : B.cream}>{t === 'seb' || t === 'ghost' ? (label || 'P') : label}</text>
  </g>
);
export const Ball: React.FC<{x: number; y: number; o?: number}> = ({x, y, o = 1}) => <g opacity={o}><circle cx={x} cy={y} r={15} fill="#fff" /><circle cx={x} cy={y} r={15} fill="none" stroke={B.black} strokeWidth={3} /></g>;
export const Label: React.FC<{x: number; y: number; text: string; o: number; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end'}> = ({x, y, text, o, size = 34, color = B.cream, anchor = 'middle'}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily="Rubik" fontWeight={500} fontSize={size} fill={color} opacity={o}>{text}</text>
);

// Les autres joueurs, avec un léger mouvement
export const Crowd: React.FC<{o?: number}> = ({o = 1}) => {
  const f = useCurrentFrame();
  const P: [number, number, 'xv' | 'adv', string][] = [[260, 1450, 'xv', '4'], [820, 1420, 'xv', '2'], [400, 1180, 'xv', '8'], [690, 1120, 'xv', '10'], [320, 860, 'xv', '7'], [760, 820, 'xv', '9'],
    [300, 1300, 'adv', '6'], [720, 1280, 'adv', '5'], [540, 980, 'adv', '8'], [430, 700, 'adv', '3'], [700, 660, 'adv', '4'], [540, 520, 'adv', '1']];
  return <g opacity={o}>{P.map(([x, y, t, l], i) => <Disc key={i} x={x + Math.sin(f / 40 + i) * 12} y={y + Math.cos(f / 47 + i * 2) * 10} t={t} label={l} />)}</g>;
};

export const Line: React.FC<{text: string; delay: number; top: number; size?: number; color?: string; font?: 'Rubik' | 'Oswald'}> = ({text, delay, top, size = 56, color = B.cream, font = 'Rubik'}) => {
  const s = useIn(delay);
  return <div style={{position: 'absolute', left: 90, width: 900, top, textAlign: 'center', fontFamily: font, fontWeight: font === 'Oswald' ? 700 : 500, fontSize: size, lineHeight: 1.25, color, opacity: s, transform: `translateY(${(1 - s) * 18}px)`, textTransform: font === 'Oswald' ? 'uppercase' : 'none'}}>{text}</div>;
};

// 7 & 11. Témoignages (voix déformée)
export const Testimony: React.FC<{text: string; n: number}> = ({text, n}) => {
  const at = useAt(); const f = useCurrentFrame(); const s = useIn(at(0.08)); const talk = f > at(0.05) && f < at(0.92);
  return (<AbsoluteFill style={{background: B.black}}>
    <Kicker text={`TÉMOIGNAGE ${n}`} color={B.xv} top={420} />
    <div style={{position: 'absolute', left: 90, top: 470, fontFamily: 'Rubik', fontWeight: 500, fontSize: 34, color: B.dim}}>Coéquipier · anonyme · voix modifiée</div>
    <Svg>{Array.from({length: 33}).map((_, i) => { const h = talk ? 20 + 160 * Math.abs(Math.sin(f / 3.1 + i * 0.7) * hash(i + Math.floor(f / 3))) : 8;
      return <rect key={i} x={110 + i * 26} y={880 - h / 2} width={14} height={h} rx={7} fill={i % 5 === 0 ? B.xv : B.cream} opacity={0.85} />; })}</Svg>
    <div style={{position: 'absolute', left: 90, width: 900, top: 1150, textAlign: 'center', fontFamily: 'Rubik', fontWeight: 700, fontSize: 46, lineHeight: 1.3, color: B.cream, opacity: s}}>{text ? `« ${text} »` : null}</div>
  </AbsoluteFill>);
};
