import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Kicker, Title, clamp, useAt, useIn, useLin} from './ui';
import {Arrow, B, Ball, Board, Chalk, Disc, H, Label, Line, Pitch, Svg, Testimony, W, lerp, pt} from './kit';

// ───────── PARTIE 1 — LA LÉGENDE ─────────

// 1. Ouverture
export const S1: React.FC = () => {
  const at = useAt();
  return (<AbsoluteFill style={{background: B.black}}>
    <Line text="Il y a des joueurs qu'on oublie." delay={at(0.05)} top={760} />
    <Line text="Et il y a ceux… dont on parle encore." delay={at(0.45)} top={900} color={B.gold} />
  </AbsoluteFill>);
};

// 2. Titre : Yassine… barré → PASSINE
export const S2: React.FC = () => {
  const at = useAt(); const f = useCurrentFrame();
  const y = useIn(3), strike = useLin(at(0.55), at(0.68)), p = useIn(at(0.7)), sub = useIn(at(0.82));
  const z = interpolate(f, [0, at(1)], [1, 1.05]);
  return (<Board>
    <AbsoluteFill style={{transform: `scale(${z})`}}>
      <div style={{position: 'absolute', top: 560, width: W, textAlign: 'center', fontFamily: 'Rubik', fontWeight: 700, fontSize: 30, letterSpacing: 8, color: B.xv, opacity: y}}>XV ORIGINALS · ÉPISODE 2</div>
      <div style={{position: 'absolute', top: 640, width: W, textAlign: 'center', fontFamily: 'Oswald', fontWeight: 700, fontSize: 120, color: B.dim, opacity: y}}>
        <span style={{position: 'relative'}}>YASSINE<span style={{position: 'absolute', left: 0, top: '52%', height: 10, width: `${strike * 100}%`, background: B.xv, borderRadius: 5}} /></span>
      </div>
      <div style={{position: 'absolute', top: 800, width: W, textAlign: 'center', fontFamily: 'Oswald', fontWeight: 700, fontSize: 250, lineHeight: 1.1, color: B.cream, opacity: p, letterSpacing: 10 * (1 - p) + 4}}>PASSINE</div>
      <div style={{position: 'absolute', top: 1110, width: W, textAlign: 'center', fontFamily: 'Oswald', fontWeight: 700, fontSize: 80, letterSpacing: 10, color: B.xv, opacity: sub, transform: `translateY(${(1 - sub) * 20}px)`}}>LA RECONVERSION</div>
    </AbsoluteFill>
  </Board>);
};

// 3. L'attaquant qui faisait peur : il fonce, les défenseurs reculent
export const S3: React.FC = () => {
  const at = useAt();
  const run = useLin(at(0.15), at(0.8)); const back = useLin(at(0.7), at(0.95)); const lb = useIn(at(0.7));
  const [px, py] = pt([[540, 1450], [520, 1100], [560, 800]], run);
  const D: [number, number][] = [[360, 900], [540, 760], [720, 900], [540, 560]];
  return (<Board>
    <Kicker text="PARTIE 1 — LA LÉGENDE" color={B.xv} top={130} />
    <Title lines={[{t: 'Il faisait', c: B.cream}, {t: 'peur.', c: B.xv}]} size={100} top={160} />
    <Svg>
      <g transform="translate(0 120)"><Pitch top /></g>
      {D.map(([x, y], i) => { const ny = y - back * (i === 3 ? 30 : 80 + i * 15); const nx = x + (x - 540) * back * 0.25;
        return <g key={i}><Disc x={nx} y={ny} t="adv" label={['5', '4', '2', '1'][i]} />
          {back > 0.1 && back < 0.99 && <Chalk d={`M${nx} ${ny - 50} L${nx} ${ny - 90}`} k={1} w={4} color={B.dim} />}</g>; })}
      <Ball x={px} y={py - 55} />
      <Disc x={px} y={py} t="seb" label="P" />
      <Label x={540} y={1740} text="Les défenseurs le voient arriver… et reculent." o={lb} size={40} color={B.gold} />
    </Svg>
  </Board>);
};

// 4. Le style Hazard : dos au jeu, le « bouclier arrière »
export const S4: React.FC = () => {
  const at = useAt(); const f = useCurrentFrame();
  const sh = useIn(at(0.3)); const lb = useIn(at(0.8)); const push = Math.max(0, Math.sin(f / 9)) * 18;
  return (<Board>
    <Kicker text="SA SIGNATURE" color={B.xv} top={170} />
    <Title lines={[{t: 'La technique', c: B.cream}, {t: 'Hazard', c: B.xv}]} size={110} top={200} />
    <Svg>
      <g transform="translate(540 1050) scale(2.2)">
        <Disc x={0} y={150 - push / 2.2} t="adv" label="4" />
        <path d="M-70 60 A 80 80 0 0 0 70 60" stroke={B.gold} strokeWidth={10} fill="none" strokeLinecap="round" opacity={sh} transform={`translate(0 ${-(1 - sh) * 10})`} />
        <Disc x={0} y={0} t="seb" label="P" />
        <Ball x={0} y={-62} />
        {[-40, 0, 40].map((x, i) => <path key={i} d={`M${x} 130 L${x * 1.3} 100`} stroke={B.dim} strokeWidth={3} opacity={sh * (push > 6 ? 1 : 0.3)} strokeLinecap="round" />)}
      </g>
    </Svg>
    <div style={{position: 'absolute', left: 90, width: 900, top: 1560, textAlign: 'center', fontFamily: 'Oswald', fontWeight: 700, fontSize: 92, color: B.gold, opacity: lb, transform: `translateY(${(1 - lb) * 20}px)`}}>LE BOUCLIER ARRIÈRE</div>
  </Board>);
};

// 5. Les deux maillots
const Jersey: React.FC<{x: number; y: number; id: string; a: string; b: string; name?: string; num?: string; o: number}> = ({x, y, id, a, b, name, num, o}) => {
  const d = 'M-150 -170 L-60 -205 Q0 -170 60 -205 L150 -170 L215 -55 L135 -20 L135 210 L-135 210 L-135 -20 L-215 -55 Z';
  return (<g transform={`translate(${x} ${y + (1 - o) * 30})`} opacity={o}>
    <defs><clipPath id={id}><path d={d} /></clipPath></defs>
    <g clipPath={`url(#${id})`}>
      <rect x={-220} y={-210} width={440} height={430} fill={a} />
      {Array.from({length: 5}).map((_, i) => <rect key={i} x={-198 + i * 88} y={-210} width={44} height={430} fill={b} />)}
    </g>
    <path d={d} fill="none" stroke={B.cream} strokeWidth={6} strokeLinejoin="round" />
    {name && <text y={-60} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={48} fill="#FFD84A" stroke={B.black} strokeWidth={2}>{name}</text>}
    {num && <text y={110} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={150} fill="#FFD84A" stroke={B.black} strokeWidth={3}>{num}</text>}
  </g>);
};
export const S5: React.FC = () => {
  const at = useAt();
  const j1 = useIn(at(0.48)), j2 = useIn(at(0.7));
  return (<Board>
    <Kicker text="L'UNIFORME" color={B.xv} top={200} />
    <Title lines={[{t: 'Deux maillots.', c: B.cream}, {t: 'Pas un de plus.', c: B.xv}]} size={96} top={230} />
    <Svg>
      <g transform="scale(0.85) translate(95 260)">
        <Jersey x={300} y={900} id="rs" a="#FFFFFF" b="#1C5AA6" o={j1} />
        <Jersey x={880} y={900} id="fcb" a="#A50044" b="#004D98" name="ETO'O" num="9" o={j2} />
      </g>
      <Label x={350} y={1360} text="Real Sociedad" o={j1} size={44} />
      <Label x={830} y={1360} text="Barça · Eto'o" o={j2} size={44} />
    </Svg>
  </Board>);
};

// 6. Le Vesc : face aux gars du bled
export const S6: React.FC = () => {
  const at = useAt(); const f = useCurrentFrame();
  const opp = useLin(at(0.15), at(0.45)); const stamp = useIn(at(0.85));
  return (<Board>
    <Kicker text="LE WEEK-END" color={B.xv} top={170} />
    <Title lines={[{t: 'Au Vesc.', c: B.cream}]} size={130} top={200} />
    <Line text="Là-bas, on ne joue pas pour rigoler." delay={at(0.45)} top={420} size={44} color={B.dim} />
    <Svg>
      <g transform="translate(0 140)"><Pitch top /></g>
      {[0, 1, 2, 3, 4].map((i) => { const x = 220 + i * 160; const y = lerp(560, 860 + (i % 2) * 40, opp);
        return <Disc key={i} x={x + Math.sin(f / 30 + i) * 6} y={y} t="adv" label="" o={clamp(opp * 3)} />; })}
      <Disc x={540} y={1350} t="seb" label="P" />
      <Ball x={540} y={1290} />
    </Svg>
    <div style={{position: 'absolute', left: 0, width: W, top: 1500, textAlign: 'center', opacity: stamp}}>
      <span style={{display: 'inline-block', padding: '14px 40px', border: `8px solid ${B.gold}`, borderRadius: 18, fontFamily: 'Oswald', fontWeight: 700, fontSize: 96, color: B.gold, transform: `rotate(-6deg) scale(${1.25 - 0.25 * stamp})`}}>IL TIENT TÊTE</span>
    </div>
  </Board>);
};

// 7. Le contrôle zidanesque (au ralenti)
export const S7: React.FC = () => {
  const at = useAt();
  const fall = useLin(at(0.28), at(0.5)); const hit = useIn(at(0.5)); const lb = useIn(at(0.78));
  const k = Easing.in(Easing.quad)(fall);
  const bx = lerp(820, 560, k), by = lerp(260, 1240, k);
  return (<Board>
    <Kicker text="UN SOIR, PENDANT UN FIVE" color={B.xv} top={170} />
    <div style={{position: 'absolute', right: 90, top: 162, padding: '6px 16px', borderRadius: 10, border: `3px solid ${B.dim}`, fontFamily: 'Rubik', fontWeight: 700, fontSize: 26, color: B.dim, opacity: fall > 0 && hit < 0.5 ? 1 : 0}}>RALENTI ×0,25</div>
    <Svg>
      <path d="M820 260 Q 690 700 560 1240" stroke={B.dim} strokeWidth={4} strokeDasharray="4 16" fill="none" strokeLinecap="round" opacity={fall > 0 ? 0.8 : 0} />
      <Disc x={540} y={1330} t="seb" label="P" />
      {hit > 0.01 && Array.from({length: 10}).map((_, i) => { const a = (i / 10) * Math.PI * 2; const r1 = 50 + hit * 30, r2 = 50 + hit * 90;
        return <line key={i} x1={560 + Math.cos(a) * r1} y1={1240 + Math.sin(a) * r1} x2={560 + Math.cos(a) * r2} y2={1240 + Math.sin(a) * r2} stroke={B.gold} strokeWidth={6} strokeLinecap="round" opacity={1 - hit * 0.6} />; })}
      <Ball x={hit > 0.01 ? 560 : bx} y={hit > 0.01 ? 1240 : by} />
    </Svg>
    <div style={{position: 'absolute', left: 90, width: 900, top: 1500, textAlign: 'center', opacity: lb, transform: `translateY(${(1 - lb) * 20}px)`}}>
      <div style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 110, lineHeight: 1.05, color: B.cream}}>CONTRÔLE</div>
      <div style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 110, lineHeight: 1.05, color: B.gold}}>ZIDANESQUE</div>
    </div>
  </Board>);
};

// 8. Témoignage 1
export const S8: React.FC = () => <Testimony n={1} text="Le contrôle ? On en entend parler à chaque match. Chaque. Match. Il l'a tellement raconté que dans sa version, maintenant, il y a des caméras, un public… et Zidane qui applaudit." />;

// ───────── PARTIE 2 — LA CHUTE ─────────

// 9. Le basculement
export const S9: React.FC = () => {
  const at = useAt(); const k = useIn(2);
  return (<AbsoluteFill style={{background: B.black}}>
    <div style={{position: 'absolute', top: 640, width: W, textAlign: 'center', fontFamily: 'Rubik', fontWeight: 700, fontSize: 32, letterSpacing: 8, color: B.xv, opacity: k}}>PARTIE 2 — LA CHUTE</div>
    <Line text="Passine est au sommet." delay={at(0.05)} top={760} />
    <Line text="Rien ne peut l'arrêter." delay={at(0.3)} top={850} />
    <Line text="Rien… sauf ce soir-là." delay={at(0.6)} top={980} size={72} color={B.gold} font="Oswald" />
  </AbsoluteFill>);
};

// 10. Les 33 tirs ratés : bâtons à la craie
export const S10: React.FC = () => {
  const at = useAt();
  const f = useCurrentFrame();
  const n = f < at(0.03) ? 0 : Math.round(interpolate(f, [at(0.03), at(0.16), at(0.28), at(0.33), at(0.44)], [1, 2, 10, 20, 33], {extrapolateRight: 'clamp'}));
  const eto0 = useIn(at(0.7)), eto = useIn(at(0.87));
  const marks: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const g = Math.floor(i / 5), j = i % 5; const gx = 150 + (g % 3) * 280, gy = 600 + Math.floor(g / 3) * 240;
    marks.push(j < 4 ? <Chalk key={i} d={`M${gx + j * 40} ${gy} L${gx + j * 40 + 4} ${gy + 150}`} w={9} color={B.cream} />
      : <Chalk key={i} d={`M${gx - 25} ${gy + 130} L${gx + 150} ${gy + 20}`} w={9} color={B.xv} />);
  }
  return (<Board>
    <Kicker text="CE SOIR-LÀ" color={B.xv} top={170} />
    <div style={{position: 'absolute', left: 90, top: 200, fontFamily: 'Oswald', fontWeight: 700, fontSize: 200, lineHeight: 1, color: B.cream}}>{n}<span style={{fontSize: 70, color: B.dim}}> tirs ratés</span></div>
    <div style={{position: 'absolute', left: 90, top: 420, fontFamily: 'Rubik', fontWeight: 700, fontSize: 40, letterSpacing: 4, color: B.xv, opacity: n >= 33 ? 1 : 0}}>D'AFFILÉE.</div>
    <Svg>{marks}</Svg>
    <div style={{position: 'absolute', left: 90, width: 900, top: 1560, textAlign: 'center'}}>
      <div style={{fontFamily: 'Rubik', fontWeight: 500, fontSize: 40, color: B.dim, opacity: eto0}}>Maillot porté ce soir-là : Barça, Eto'o 9</div>
      <div style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 84, color: B.gold, opacity: eto, transform: `translateY(${(1 - eto) * 20}px)`}}>ETO'O, LUI, MARQUAIT.</div>
    </div>
  </Board>);
};

// 11. Témoignage 2
export const S11: React.FC = () => <Testimony n={2} text="J'étais là ce soir-là. Au dixième tir, on rigolait. Au vingtième, on s'inquiétait. Au trentième… on priait pour lui. Le gardien d'en face, il a même pas eu besoin de bouger." />;

// 12. La reconversion : de l'attaque à sa propre cage
export const S12: React.FC = () => {
  const at = useAt();
  const go = useLin(at(0.3), at(0.75)); const s1 = useLin(at(0.22), at(0.32)); const lb = useIn(at(0.5)); const end = useIn(at(0.78));
  const py = lerp(560, 1580, go);
  return (<Board>
    <Kicker text="LE LENDEMAIN" color={B.xv} top={130} />
    <div style={{position: 'absolute', left: 90, top: 160, fontFamily: 'Oswald', fontWeight: 700, fontSize: 90, color: B.dim}}>
      <span style={{position: 'relative'}}>ATTAQUANT<span style={{position: 'absolute', left: 0, top: '50%', height: 9, width: `${s1 * 100}%`, background: B.xv, borderRadius: 5}} /></span>
    </div>
    <div style={{position: 'absolute', left: 90, top: 270, fontFamily: 'Oswald', fontWeight: 700, fontSize: 90, color: B.gold, opacity: lb}}>GARDIEN · DÉFENSEUR</div>
    <Svg>
      <Pitch />
      <Chalk d={`M600 560 L600 ${py}`} k={1} w={5} color={B.gold} />
      <Disc x={540} y={py} t="seb" label="P" />
      <Label x={640} y={1270} text="le plus loin possible" o={end} anchor="start" color={B.gold} size={36} />
      <Label x={640} y={1315} text="des cages adverses" o={end} anchor="start" color={B.gold} size={36} />
    </Svg>
  </Board>);
};

// 13. Fin
export const S13: React.FC = () => {
  const at = useAt(); const sig = useIn(at(0.85));
  return (<AbsoluteFill style={{background: B.black}}>
    <Line text="33 tirs ratés." delay={at(0.03)} top={620} size={96} font="Oswald" color={B.cream} />
    <Line text="1 contrôle réussi." delay={at(0.3)} top={760} size={96} font="Oswald" color={B.xv} />
    <Line text="Pour Passine… le compte est bon." delay={at(0.5)} top={960} size={56} color={B.gold} />
    <div style={{position: 'absolute', top: 1500, width: W, textAlign: 'center', fontFamily: 'Rubik', fontWeight: 700, fontSize: 28, letterSpacing: 7, color: B.dim, opacity: sig}}>PASSINE · LA RECONVERSION · XV ORIGINALS</div>
  </AbsoluteFill>);
};

export const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13];
// H est importé pour cohérence du kit
void H;
