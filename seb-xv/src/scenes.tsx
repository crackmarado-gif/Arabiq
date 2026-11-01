import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Kicker, Title, clamp, hash, useAt, useIn, useLin} from './ui';

// Palette « tableau tactique »
export const B = {board: '#1D3A2E', chalk: 'rgba(243,237,226,.78)', cream: '#F3EDE2', xv: '#FF6B35', gold: '#FFD84A', black: '#0E0F0E', dim: 'rgba(243,237,226,.55)'};
const W = 1080, H = 1920;
const ease = Easing.inOut(Easing.cubic);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const pt = (p: [number, number][], k: number): [number, number] => {
  const n = p.length - 1; const s = clamp(k) * n; const i = Math.min(n - 1, Math.floor(s)); const t = s - i;
  return [lerp(p[i][0], p[i + 1][0], t), lerp(p[i][1], p[i + 1][1], t)];
};

const Board: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, #24473A 0%, ${B.board} 60%, #142A21 100%)`}}>
    {children}
    <AbsoluteFill style={{pointerEvents: 'none', opacity: 0.06, backgroundImage: 'radial-gradient(#fff .7px,transparent 1px)', backgroundSize: '5px 5px'}} />
  </AbsoluteFill>
);
const Svg: React.FC<{children: React.ReactNode}> = ({children}) => <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>{children}</svg>;

// Trait de craie qui se dessine (k : 0 → 1)
const Chalk: React.FC<{d: string; k?: number; w?: number; color?: string}> = ({d, k = 1, w = 5, color = B.chalk}) => (
  <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(k)} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
);
const Arrow: React.FC<{d: string; k: number; end: [number, number]; ang: number; color?: string; w?: number}> = ({d, k, end, ang, color = B.chalk, w = 7}) => (
  <g>
    <Chalk d={d} k={k} w={w} color={color} />
    {k > 0.97 && <path d="M-26 -16 L0 0 L-26 16" transform={`translate(${end[0]} ${end[1]}) rotate(${ang})`} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
  </g>
);

// Terrain vertical (on attaque vers le haut)
const X0 = 90, X1 = 990, Y0 = 420, Y1 = 1660, MY = (Y0 + Y1) / 2;
const Pitch: React.FC<{k?: number; top?: boolean}> = ({k = 1, top = false}) => (
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

const Disc: React.FC<{x: number; y: number; t: 'xv' | 'adv' | 'seb' | 'ghost'; label?: string; o?: number}> = ({x, y, t, label = '', o = 1}) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    {t === 'seb' && <circle r={50} fill="none" stroke={B.gold} strokeWidth={6} />}
    {t === 'ghost' ? <circle r={36} fill="none" stroke={B.cream} strokeWidth={4} strokeDasharray="10 8" opacity={0.7} />
      : <circle r={36} fill={t === 'adv' ? 'none' : B.xv} stroke={t === 'adv' ? B.cream : 'none'} strokeWidth={6} />}
    <text y={14} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={40} fill={t === 'ghost' ? B.dim : B.cream}>{t === 'seb' || t === 'ghost' ? 'S' : label}</text>
  </g>
);
const Ball: React.FC<{x: number; y: number; o?: number}> = ({x, y, o = 1}) => <g opacity={o}><circle cx={x} cy={y} r={15} fill="#fff" /><circle cx={x} cy={y} r={15} fill="none" stroke={B.black} strokeWidth={3} /></g>;
const Label: React.FC<{x: number; y: number; text: string; o: number; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end'}> = ({x, y, text, o, size = 34, color = B.cream, anchor = 'middle'}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily="Rubik" fontWeight={500} fontSize={size} fill={color} opacity={o}>{text}</text>
);

// Les autres joueurs, avec un léger mouvement
const Crowd: React.FC<{o?: number}> = ({o = 1}) => {
  const f = useCurrentFrame();
  const P: [number, number, 'xv' | 'adv', string][] = [[260, 1450, 'xv', '4'], [820, 1420, 'xv', '2'], [400, 1180, 'xv', '8'], [690, 1120, 'xv', '10'], [320, 860, 'xv', '7'], [760, 820, 'xv', '9'],
    [300, 1300, 'adv', '6'], [720, 1280, 'adv', '5'], [540, 980, 'adv', '8'], [430, 700, 'adv', '3'], [700, 660, 'adv', '4'], [540, 520, 'adv', '1']];
  return <g opacity={o}>{P.map(([x, y, t, l], i) => <Disc key={i} x={x + Math.sin(f / 40 + i) * 12} y={y + Math.cos(f / 47 + i * 2) * 10} t={t} label={l} />)}</g>;
};

const Line: React.FC<{text: string; delay: number; top: number; size?: number; color?: string; font?: 'Rubik' | 'Oswald'}> = ({text, delay, top, size = 56, color = B.cream, font = 'Rubik'}) => {
  const s = useIn(delay);
  return <div style={{position: 'absolute', left: 90, width: 900, top, textAlign: 'center', fontFamily: font, fontWeight: font === 'Oswald' ? 700 : 500, fontSize: size, lineHeight: 1.25, color, opacity: s, transform: `translateY(${(1 - s) * 18}px)`, textTransform: font === 'Oswald' ? 'uppercase' : 'none'}}>{text}</div>;
};

// 1. Ouverture
export const S1: React.FC = () => {
  const at = useAt();
  return (<AbsoluteFill style={{background: B.black}}>
    <Line text="Certains joueurs, on les remarque tout de suite." delay={at(0.05)} top={760} />
    <Line text="D'autres… on met des années à les comprendre." delay={at(0.5)} top={960} color={B.gold} />
  </AbsoluteFill>);
};

// 2. Titre
export const S2: React.FC = () => {
  const at = useAt(); const f = useCurrentFrame();
  const s = useIn(4), t = useIn(at(0.35)), k = useIn(2);
  const z = interpolate(f, [0, at(1)], [1, 1.06]);
  return (<Board>
    <AbsoluteFill style={{transform: `scale(${z})`}}>
      <div style={{position: 'absolute', top: 620, width: W, textAlign: 'center', fontFamily: 'Rubik', fontWeight: 700, fontSize: 30, letterSpacing: 8, color: B.xv, opacity: k}}>UN DOCUMENTAIRE XV</div>
      <div style={{position: 'absolute', top: 650, width: W, textAlign: 'center', fontFamily: 'Oswald', fontWeight: 700, fontSize: 380, lineHeight: 1.1, color: B.cream, opacity: s, letterSpacing: 10 * (1 - s) + 6}}>SEB</div>
      <div style={{position: 'absolute', top: 1090, width: W, textAlign: 'center', fontFamily: 'Oswald', fontWeight: 700, fontSize: 110, letterSpacing: 14, color: B.xv, opacity: t, transform: `translateY(${(1 - t) * 20}px)`}}>L'INCOMPRIS</div>
    </AbsoluteFill>
  </Board>);
};

// 3. Où est Seb ?
export const S3: React.FC = () => {
  const at = useAt(); const f = useCurrentFrame();
  const draw = useLin(0, at(0.35)); const q = useIn(at(0.55)); const here = useIn(at(0.75));
  const [bx, by] = pt([[400, 1180], [690, 1120], [760, 820], [540, 980]], (f % 150) / 150);
  return (<Board>
    <Title lines={[{t: 'Où est', c: B.cream}, {t: 'Seb ?', c: B.xv}]} size={110} top={150} />
    <Svg>
      <Pitch k={draw} />
      <Crowd o={draw} />
      <Ball x={bx} y={by} o={draw} />
      <text x={540} y={1140} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={300} fill={B.gold} opacity={q * 0.85}>?</text>
      <g opacity={here}>
        <Disc x={1040} y={1820} t="seb" />
        <Arrow d="M820 1760 Q900 1800 975 1812" k={here} end={[975, 1812]} ang={12} color={B.gold} />
        <Label x={800} y={1748} text="…ici ?" o={here} anchor="end" color={B.gold} size={40} />
      </g>
    </Svg>
  </Board>);
};

// 4. Trois secondes d'avance
export const S4: React.FC = () => {
  const at = useAt();
  const big = useIn(at(0.35)); const go = useLin(at(0.3), at(0.5)); const ball = useLin(at(0.45), at(0.75)); const gh = useIn(at(0.5));
  const [sx, sy] = pt([[540, 980], [760, 640]], go); const [bx, by] = pt([[220, 1500], [540, 980]], ball);
  return (<Board>
    <Kicker text="LA THÉORIE" color={B.xv} top={90} />
    <div style={{position: 'absolute', left: 90, top: 120, fontFamily: 'Oswald', fontWeight: 700, fontSize: 150, lineHeight: 1, color: B.xv, opacity: big}}>+3 s</div>
    <div style={{position: 'absolute', left: 90, top: 300, fontFamily: 'Rubik', fontWeight: 500, fontSize: 40, color: B.cream, opacity: big}}>d'avance sur le jeu</div>
    <Svg>
      <Pitch />
      <Chalk d="M220 1500 L540 980" k={ball} w={4} color={B.dim} />
      <Ball x={bx} y={by} />
      <Disc x={540} y={980} t="ghost" o={gh} />
      <Label x={540} y={1070} text="Seb, il y a 3 s" o={gh} size={30} color={B.dim} />
      <Disc x={sx} y={sy} t="seb" />
      <Label x={sx + 60} y={sy + 14} text="Seb, maintenant" anchor="start" o={gh} size={30} color={B.gold} />
    </Svg>
  </Board>);
};

// 5. Analyse tactique
export const S5: React.FC = () => {
  const at = useAt();
  const a = useLin(at(0.1), at(0.4)); const sb = useLin(at(0.5), at(0.8)); const lb = useIn(at(0.78));
  const others: [number, number][] = [[260, 1450], [820, 1420], [690, 1120], [320, 860]];
  return (<Board>
    <Kicker text="ANALYSE TACTIQUE" color={B.xv} top={130} />
    <Svg>
      <Pitch />
      <Crowd />
      {others.map(([x, y], i) => { const ex = lerp(x, 420, 0.82), ey = lerp(y, 1110, 0.82); const ang = Math.atan2(ey - y, ex - x) * 180 / Math.PI;
        return <Arrow key={i} d={`M${x} ${y} L${ex} ${ey}`} k={clamp(a * 1.4 - i * 0.12)} end={[ex, ey]} ang={ang} />; })}
      <Ball x={420} y={1110} />
      <Disc x={860} y={1000} t="seb" />
      <Arrow d="M860 950 C 900 700, 960 450, 930 250" k={sb} end={[930, 250]} ang={-95} color={B.gold} w={9} />
      <Label x={890} y={290} text="action de la semaine prochaine" o={lb} anchor="end" color={B.gold} size={36} />
    </Svg>
  </Board>);
};

// 6. Les passes
export const S6: React.FC = () => {
  const at = useAt();
  const p = useLin(at(0.42), at(0.62)); const mate = useLin(at(0.7), at(0.95)); const lb = useIn(at(0.65));
  const [bx, by] = pt([[300, 1300], [760, 700]], p); const [mx, my] = pt([[980, 1500], [800, 760]], mate);
  return (<Board>
    <Title lines={[{t: 'Les passes', c: B.cream}]} size={100} top={170} />
    <Svg>
      <Pitch />
      <Disc x={300} y={1300} t="seb" />
      <Chalk d="M300 1300 L760 700" k={p} w={4} color={B.dim} />
      <Ball x={bx} y={by} />
      <circle cx={760} cy={700} r={60} fill="none" stroke={B.gold} strokeWidth={4} strokeDasharray="12 10" opacity={lb} />
      <Label x={590} y={610} text="coéquipier pas encore démarqué" o={lb} color={B.gold} size={36} />
      <Disc x={mx} y={my} t="xv" label="9" o={clamp(mate * 4)} />
    </Svg>
  </Board>);
};

// 7 & 11. Témoignages (voix déformée)
const Testimony: React.FC<{text: string; n: number}> = ({text, n}) => {
  const at = useAt(); const f = useCurrentFrame(); const s = useIn(at(0.08)); const talk = f > at(0.05) && f < at(0.92);
  return (<AbsoluteFill style={{background: B.black}}>
    <Kicker text={`TÉMOIGNAGE ${n}`} color={B.xv} top={420} />
    <div style={{position: 'absolute', left: 90, top: 470, fontFamily: 'Rubik', fontWeight: 500, fontSize: 34, color: B.dim}}>Coéquipier · anonyme · voix modifiée</div>
    <Svg>{Array.from({length: 33}).map((_, i) => { const h = talk ? 20 + 160 * Math.abs(Math.sin(f / 3.1 + i * 0.7) * hash(i + Math.floor(f / 3))) : 8;
      return <rect key={i} x={110 + i * 26} y={880 - h / 2} width={14} height={h} rx={7} fill={i % 5 === 0 ? B.xv : B.cream} opacity={0.85} />; })}</Svg>
    <div style={{position: 'absolute', left: 90, width: 900, top: 1150, textAlign: 'center', fontFamily: 'Rubik', fontWeight: 700, fontSize: 46, lineHeight: 1.3, color: B.cream, opacity: s}}>« {text} »</div>
  </AbsoluteFill>);
};
export const S7: React.FC = () => <Testimony n={1} text="Je l'ai jamais vu toucher le ballon. Jamais. Au début, je me disais qu'il était perdu… Et puis j'ai compris. Le ballon, c'est pour ceux qui ont besoin de preuves. Seb, il joue un niveau au-dessus." />;
export const S11: React.FC = () => <Testimony n={2} text="Depuis le doublé, on attend le troisième. Il dit qu'il le garde pour un grand match. On lui a demandé lequel… Il a juste répondu : « Vous verrez. » Franchement ? Je crois que ce match-là n'existe pas encore." />;

// 8. Statistiques
export const S8: React.FC = () => {
  const at = useAt();
  const rows: [string, string, number][] = [['Distance parcourue', 'impossible à mesurer', 0.3], ['Ballons touchés', 'confidentiel', 0.6], ['Déplacements visibles', '0 (trop rapides)', 0.82]];
  return (<Board>
    <Kicker text="LES CHIFFRES" color={B.xv} top={300} />
    <Title lines={[{t: 'Fiche stats', c: B.cream}, {t: 'Seb', c: B.xv}]} size={120} top={340} />
    {rows.map(([k, v, d], i) => { const s = useIn(at(d)); return (
      <div key={i} style={{position: 'absolute', left: 90, width: 900, top: 760 + i * 260, borderTop: `4px solid ${B.chalk}`, paddingTop: 26, opacity: s, transform: `translateY(${(1 - s) * 20}px)`}}>
        <div style={{fontFamily: 'Rubik', fontWeight: 500, fontSize: 40, color: B.dim}}>{k}</div>
        <div style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 84, color: i === 2 ? B.gold : B.cream, textTransform: 'uppercase'}}>{v}</div>
      </div>); })}
  </Board>);
};

// 9. Le doublé du Vesque
export const S9: React.FC = () => {
  const at = useAt();
  const draw = useLin(0, at(0.12));
  const c1 = useLin(at(0.28), at(0.38)), h1 = useLin(at(0.38), at(0.43));
  const c2 = useLin(at(0.46), at(0.55)), h2 = useLin(at(0.55), at(0.6));
  const goals = (h1 >= 1 ? 1 : 0) + (h2 >= 1 ? 1 : 0); const g = useIn(at(0.4));
  const arc = (x0: number, y0: number, x1: number, y1: number, k: number): [number, number] => [lerp(x0, x1, k), lerp(y0, y1, k) - Math.sin(k * Math.PI) * 140];
  let ball: [number, number] = [930, 900];
  if (c1 > 0 && h1 < 1) ball = h1 > 0 ? pt([[560, 640], [520, 400]], h1) : arc(930, 900, 560, 640, c1);
  if (h1 >= 1 && c2 === 0) ball = [520, 400];
  if (c2 > 0) ball = h2 > 0 ? pt([[520, 640], [590, 400]], h2) : arc(150, 900, 520, 640, c2);
  const sx = c2 > 0 ? lerp(560, 520, c2) : 560;
  return (<Board>
    <Kicker text="LE JOUR OÙ" color={B.xv} top={120} />
    <Title lines={[{t: 'Le doublé', c: B.cream}, {t: 'du Vesque', c: B.xv}]} size={96} top={150} />
    <Svg>
      <g transform="translate(0 300)">
        <Pitch k={draw} top />
        <Disc x={930} y={900} t="xv" label="7" o={draw} />
        <Disc x={150} y={900} t="xv" label="11" o={draw} />
        <Disc x={480} y={540} t="adv" label="5" o={draw} />
        <Disc x={640} y={560} t="adv" label="4" o={draw} />
        <Disc x={540} y={440} t="adv" label="1" o={draw} />
        <Disc x={sx} y={660} t="seb" o={draw} />
        <Ball x={ball[0]} y={ball[1]} o={draw} />
      </g>
    </Svg>
    <div style={{position: 'absolute', left: 90, width: 900, top: 1380, textAlign: 'center', opacity: g}}>
      <div style={{fontFamily: 'Rubik', fontWeight: 700, fontSize: 34, letterSpacing: 6, color: B.dim}}>BUTS DE LA TÊTE</div>
      <div style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 200, lineHeight: 1, color: B.gold}}>{goals}</div>
    </div>
    <Line text="Pour une fois… le football avait rattrapé Seb." delay={at(0.65)} top={1680} size={42} />
  </Board>);
};

// 10. Son propre public
export const S10: React.FC = () => {
  const at = useAt();
  const draw = useLin(0, at(0.25)); const one = useIn(at(0.35)); const st = useIn(at(0.6)); const st2 = useIn(at(0.78));
  return (<Board>
    <Kicker text="LES SUPPORTERS" color={B.xv} top={170} />
    <Title lines={[{t: 'Son propre', c: B.cream}, {t: 'public', c: B.xv}]} size={110} top={200} />
    <Svg>
      {Array.from({length: 5}).map((_, r) => (<g key={r}>
        <Chalk d={`M${120 + r * 20} ${700 + r * 110} H${960 - r * 20}`} k={clamp(draw * 1.5 - r * 0.1)} />
        {Array.from({length: 10 - r}).map((__, c) => { const x = 160 + r * 20 + c * ((760 - r * 40) / (9 - r)); const isHer = r === 2 && c === 4;
          return <rect key={c} x={x - 26} y={650 + r * 110} width={52} height={44} rx={10} fill={isHer ? B.xv : 'none'} stroke={isHer ? B.xv : B.dim} strokeWidth={4} opacity={isHer ? one : draw} />; })}
      </g>))}
      <path d="M0 -14 C-8 -30 -34 -26 -34 -6 C-34 12 -10 24 0 34 C10 24 34 12 34 -6 C34 -26 8 -30 0 -14 Z" transform={`translate(${160 + 40 + 4 * (680 / 7)} ${590 + 2 * 110}) scale(${one})`} fill={B.gold} />
    </Svg>
    <div style={{position: 'absolute', left: 90, top: 1340, fontFamily: 'Oswald', fontWeight: 700, fontSize: 90, color: B.cream, opacity: st, textTransform: 'uppercase'}}>Supportrices : 1</div>
    <div style={{position: 'absolute', left: 90, top: 1470, fontFamily: 'Oswald', fontWeight: 700, fontSize: 90, color: B.gold, opacity: st2, textTransform: 'uppercase'}}>Kop : 100 %</div>
  </Board>);
};

// 12. Fin
export const S12: React.FC = () => {
  const at = useAt(); const sig = useIn(at(0.86));
  return (<AbsoluteFill style={{background: B.black}}>
    <Line text="Seb n'est pas sous-coté." delay={at(0.03)} top={640} size={70} font="Oswald" />
    <Line text="Il est en avance." delay={at(0.3)} top={790} size={110} font="Oswald" color={B.xv} />
    <Line text="Le football… n'était pas prêt." delay={at(0.55)} top={1000} size={56} color={B.gold} />
    <div style={{position: 'absolute', top: 1500, width: W, textAlign: 'center', fontFamily: 'Rubik', fontWeight: 700, fontSize: 30, letterSpacing: 8, color: B.dim, opacity: sig}}>SEB · L'INCOMPRIS · UN DOCUMENTAIRE XV</div>
  </AbsoluteFill>);
};

export const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12];
