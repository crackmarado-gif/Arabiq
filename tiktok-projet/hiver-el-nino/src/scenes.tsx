import React from 'react';
import {AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, Chip, Kicker, Para, Source, Title, Tower, clamp, useAt, useIn, useLin} from './ui';

const W = 1080, H = 1920;
const Svg: React.FC<{children: React.ReactNode}> = ({children}) => <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}>{children}</svg>;
const BLUE = '#3B82C4', OCEAN = '#9CCBE8';

// ── petites icônes ──
const Snow: React.FC<{x: number; y: number; s?: number; c?: string; o?: number}> = ({x, y, s = 1, c = BLUE, o = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} stroke={c} strokeWidth={7} strokeLinecap="round" fill="none">
    {[0, 60, 120].map((a) => <g key={a} transform={`rotate(${a})`}><line x1={0} y1={-46} x2={0} y2={46} /><path d="M-14 -34 L0 -22 L14 -34 M-14 34 L0 22 L14 34" /></g>)}
  </g>
);
const Sun: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <circle r={26} fill={C.orange} />
    {Array.from({length: 8}).map((_, i) => <line key={i} x1={0} y1={-38} x2={0} y2={-52} stroke={C.orange} strokeWidth={7} strokeLinecap="round" transform={`rotate(${i * 45})`} />)}
  </g>
);
const Cloud: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 1}) => {
  const f = useCurrentFrame();
  return (<g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d="M-50 10 a28 28 0 0 1 10 -50 a36 36 0 0 1 66 8 a26 26 0 0 1 24 42 Z" fill="#B9C3CC" />
    {[-30, 0, 30].map((dx, i) => { const k = ((f / 18 + i * 0.33) % 1); return <line key={i} x1={dx} y1={22 + k * 40} x2={dx - 6} y2={36 + k * 40} stroke={BLUE} strokeWidth={6} strokeLinecap="round" opacity={1 - k} />; })}
  </g>);
};

// 0. Ouverture : clic → une fenêtre s'ouvre → l'extrait vidéo (avec son)
const CLICK = 28, OPEN = 32, PLAY = 44; // images (30 i/s)
export const S0: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const at = useAt();
  const thumb = spring({frame: f, fps, config: {damping: 200}});
  const cur = interpolate(f, [0, CLICK], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const press = f >= CLICK && f < CLICK + 5 ? 0.92 : 1;
  const open = spring({frame: f - OPEN, fps, config: {damping: 18, stiffness: 140}});
  const ripple = interpolate(f, [CLICK, CLICK + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const out = interpolate(f, [at(0.96), at(1)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // la vignette (petite) devient la fenêtre (grande)
  const w = interpolate(open, [0, 1], [380, 960]), h = interpolate(open, [0, 1], [250, 600]);
  const cx = 540, cy = interpolate(open, [0, 1], [1100, 980]);
  const cx0 = interpolate(cur, [0, 1], [900, cx + 40]), cy0 = interpolate(cur, [0, 1], [1700, 1130]);
  return (<AbsoluteFill style={{background: C.night, opacity: out}}>
    <div style={{position: 'absolute', left: 90, top: 360, fontFamily: 'Rubik', fontWeight: 700, fontSize: 30, letterSpacing: 5, color: '#9BA6D9', opacity: thumb}}>VU SUR LES RÉSEAUX…</div>
    <div style={{position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: 26, background: '#fff', overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,.45)', opacity: thumb, transform: `scale(${f < OPEN ? press : 1})`}}>
      <div style={{height: 54, background: '#ECEFF3', display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 22}}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} style={{width: 16, height: 16, borderRadius: 8, background: c, display: 'inline-block'}} />)}
        <span style={{marginLeft: 16, fontFamily: 'Rubik', fontWeight: 500, fontSize: 24, color: '#6B7280'}}>vidéo</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 54, bottom: 0, background: '#0E0F0E', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {f < PLAY && <svg width={110} height={110} viewBox="0 0 110 110" style={{opacity: 1 - open}}><circle cx={55} cy={55} r={52} fill="rgba(255,255,255,.18)" /><path d="M44 32 L80 55 L44 78 Z" fill="#fff" /></svg>}
        <Sequence from={PLAY} layout="none"><OffthreadVideo src={staticFile('extrait.mp4')} style={{width: '100%', height: '100%', objectFit: 'contain'}} /></Sequence>
      </div>
    </div>
    {f < OPEN + 6 && <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
      {ripple > 0 && ripple < 1 && <circle cx={cx + 40} cy={1130} r={20 + ripple * 60} fill="none" stroke="#fff" strokeWidth={5} opacity={1 - ripple} />}
      <path d="M0 0 L0 62 L16 48 L28 74 L40 68 L28 44 L50 44 Z" transform={`translate(${cx0} ${cy0}) scale(${press})`} fill="#fff" stroke="#111" strokeWidth={4} strokeLinejoin="round" />
    </svg>}
    <div style={{position: 'absolute', left: 90, width: 900, top: 1330, textAlign: 'center', fontFamily: 'Rubik', fontWeight: 500, fontSize: 26, color: '#9BA6D9', opacity: open}}>Extrait : @humourfilm78 sur TikTok</div>
  </AbsoluteFill>);
};

// 0 bis. « Et toi aussi, tu sens le froid qui arrive ? »
export const S0b: React.FC = () => {
  const at = useAt(); const f = useCurrentFrame();
  const a = useIn(at(0.08)), b = useIn(at(0.3));
  return (<AbsoluteFill style={{background: C.night}}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
      {Array.from({length: 40}).map((_, i) => { const x = (i * 263) % W; const y = ((i * 197 + f * (2 + (i % 3))) % (H + 40)) - 20; return <circle key={i} cx={x + Math.sin(f / 30 + i) * 14} cy={y} r={3 + (i % 3) * 2} fill="#fff" opacity={0.55} />; })}
    </svg>
    <div style={{position: 'absolute', left: 90, width: 900, top: 760, textAlign: 'center', fontFamily: 'Rubik', fontWeight: 500, fontSize: 60, color: '#E8E4F5', opacity: a, transform: `translateY(${(1 - a) * 20}px)`}}>Et toi aussi…</div>
    <div style={{position: 'absolute', left: 90, width: 900, top: 870, textAlign: 'center', fontFamily: 'Oswald', fontWeight: 700, fontSize: 104, lineHeight: 1.08, color: '#fff', textTransform: 'uppercase', opacity: b, transform: `translateY(${(1 - b) * 20}px)`}}>tu sens le froid<br /><span style={{color: '#8FC3F0'}}>qui arrive ?</span></div>
  </AbsoluteFill>);
};

// 1. Accroche : la fausse info
export const S1: React.FC = () => {
  const at = useAt();
  const card = useIn(2), stamp = useIn(at(0.55));
  return (<AbsoluteFill style={{background: C.night}}>
    <div style={{position: 'absolute', left: 90, top: 210, fontFamily: 'Rubik', fontWeight: 700, fontSize: 28, letterSpacing: 5, color: '#9BA6D9', opacity: card}}>HORS-SÉRIE · TOITS VERTS CONTRE LES 1 %</div>
    <div style={{position: 'absolute', left: 110, top: 520, width: 860, padding: '50px 54px', boxSizing: 'border-box', background: '#fff', borderRadius: 34, boxShadow: '0 30px 60px rgba(0,0,0,.35)', opacity: card, transform: `rotate(-2deg) translateY(${(1 - card) * 40}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22}}>
        <svg width={64} height={64} viewBox="-60 -60 120 120"><Snow x={0} y={0} s={1} /></svg>
        <span style={{fontFamily: 'Rubik', fontWeight: 800, fontSize: 34, letterSpacing: 4, color: '#C8102E'}}>ALERTE</span>
      </div>
      <div style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 92, lineHeight: 1.05, color: C.ink, textTransform: 'uppercase'}}>Un hiver glacial à cause d'El Niño</div>
      <div style={{fontFamily: 'Rubik', fontWeight: 500, fontSize: 32, color: '#8A8F98', marginTop: 24}}>Vu partout sur les réseaux</div>
    </div>
    <div style={{position: 'absolute', left: 0, width: W, top: 1240, textAlign: 'center', opacity: stamp}}>
      <span style={{display: 'inline-block', padding: '10px 54px', border: `10px solid ${C.orange}`, borderRadius: 22, fontFamily: 'Oswald', fontWeight: 700, fontSize: 170, color: C.orange, transform: `rotate(-8deg) scale(${1.15 - 0.15 * stamp})`}}>FAUX</span>
    </div>
  </AbsoluteFill>);
};

// 2. El Niño, c'est quoi ?
export const S2: React.FC = () => {
  const at = useAt(); const f = useCurrentFrame();
  const map = useIn(at(0.05)); const warm = useLin(at(0.15), at(0.45)); const pulse = 1 + 0.04 * Math.sin(f / 14);
  return (<AbsoluteFill style={{background: C.cream}}>
    <Kicker text="LE PHÉNOMÈNE" color={C.orange} />
    <Title lines={[{t: 'El Niño,'}, {t: "c'est quoi ?", c: C.orange}]} size={110} />
    <Svg>
      <g opacity={map}>
        <rect x={60} y={640} width={960} height={520} rx={40} fill={OCEAN} />
        <path d="M60 640 h150 q30 120 0 260 q-20 140 0 260 h-150 Z" fill={C.sand} />
        <path d="M1020 640 h-170 q-40 90 -10 200 q30 150 -20 320 h200 Z" fill={C.sand} />
        <text x={135} y={1210} textAnchor="middle" fontFamily="Rubik" fontWeight={700} fontSize={28} fill={C.ink}>ASIE · AUSTRALIE</text>
        <text x={935} y={1210} textAnchor="middle" fontFamily="Rubik" fontWeight={700} fontSize={28} fill={C.ink}>AMÉRIQUES</text>
        <line x1={60} y1={900} x2={1020} y2={900} stroke="#fff" strokeWidth={4} strokeDasharray="16 14" opacity={0.8} />
        <text x={250} y={890} fontFamily="Rubik" fontWeight={500} fontSize={26} fill="#fff">équateur</text>
        <text x={420} y={720} textAnchor="middle" fontFamily="Rubik" fontWeight={700} fontSize={34} fill="#fff" letterSpacing={6}>OCÉAN PACIFIQUE</text>
        <ellipse cx={640} cy={900} rx={230 * warm * pulse} ry={95 * warm * pulse} fill={C.orange} opacity={0.75} />
        <text x={640} y={912} textAnchor="middle" fontFamily="Rubik" fontWeight={800} fontSize={34} fill="#fff" opacity={clamp(warm * 2 - 1)}>EAU PLUS CHAUDE</text>
      </g>
    </Svg>
    <Chip text="Revient tous les 2 à 7 ans" delay={at(0.5)} top={1290} />
    <Chip text="Hiver 2026-2027 : fort à très fort" delay={at(0.72)} top={1420} bg={C.orange} color="#fff" />
    <Source text="Source : NOAA, Climate Prediction Center (ENSO, mise à jour du 2 novembre 2026)" />
  </AbsoluteFill>);
};

// 3. Où il frappe : fort ailleurs, faible en Europe
export const S3: React.FC = () => {
  const at = useAt();
  const rows: [string, number, string, number][] = [['Amériques', 0.88, C.orange, 0.08], ['Asie · Australie', 0.8, C.orange, 0.16], ['Europe', 0.12, '#9AA3AD', 0.26]];
  const y1 = useIn(at(0.5)), y2 = useIn(at(0.7)), concl = useIn(at(0.85));
  return (<AbsoluteFill style={{background: C.cream}}>
    <Kicker text="SON EFFET" color={C.orange} />
    <Title lines={[{t: 'Fort ailleurs.'}, {t: 'Faible en Europe.', c: BLUE}]} size={96} />
    {rows.map(([name, v, col, d], i) => { const k = useLin(at(d), at(d + 0.15)); return (
      <div key={i} style={{position: 'absolute', left: 90, top: 560 + i * 130, width: 900}}>
        <div style={{fontFamily: 'Rubik', fontWeight: 700, fontSize: 36, color: C.ink, marginBottom: 10}}>{name}{i === 2 && k > 0.9 ? <span style={{color: '#7A8490', fontWeight: 500}}> — faible</span> : null}</div>
        <div style={{height: 34, borderRadius: 17, background: '#E4DBCC'}}><div style={{height: 34, width: `${v * k * 100}%`, borderRadius: 17, background: col}} /></div>
      </div>); })}
    {[[y1, 'Hiver 2009-2010', 'El Niño → hiver froid en France', 'snow'], [y2, 'Hiver 2015-2016', 'El Niño → hiver doux en France', 'sun']].map(([o, a, b, ic], i) => (
      <div key={i} style={{position: 'absolute', left: 90 + i * 460, top: 990, width: 440, height: 320, boxSizing: 'border-box', padding: 30, borderRadius: 28, background: '#fff', boxShadow: '0 12px 28px rgba(58,36,16,.12)', opacity: o as number, transform: `translateY(${(1 - (o as number)) * 30}px)`}}>
        <svg width={90} height={90} viewBox="-60 -60 120 120">{ic === 'snow' ? <Snow x={0} y={0} /> : <Sun x={0} y={0} s={1.1} />}</svg>
        <div style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 46, color: C.ink, marginTop: 10}}>{a as string}</div>
        <div style={{fontFamily: 'Rubik', fontWeight: 500, fontSize: 32, lineHeight: 1.25, color: C.ink, marginTop: 6}}>{b as string}</div>
      </div>))}
    <div style={{position: 'absolute', left: 90, width: 900, top: 1400, textAlign: 'center', fontFamily: 'Oswald', fontWeight: 700, fontSize: 72, color: C.ink, opacity: concl}}>PAS DE LIEN SYSTÉMATIQUE.</div>
    <Source text="Source : Météo-France (influence d'El Niño sur l'Europe : faible et variable)" />
  </AbsoluteFill>);
};

// 4. Ce que prévoit Météo-France
export const S4: React.FC = () => {
  const at = useAt();
  const g = useLin(at(0.3), at(0.6)); const pct = Math.round(70 * Easing.out(Easing.cubic)(g)); const rain = useIn(at(0.75));
  const R = 210, L = 2 * Math.PI * R;
  return (<AbsoluteFill style={{background: C.cream}}>
    <Kicker text="MÉTÉO-FRANCE · NOVEMBRE → JANVIER" color={C.orange} />
    <Title lines={[{t: 'Plus chaud'}, {t: 'que la normale.', c: C.orange}]} size={100} />
    <Svg>
      <g transform="translate(540 900) rotate(-90)">
        <circle r={R} fill="none" stroke="#E4DBCC" strokeWidth={56} />
        <circle r={R} fill="none" stroke={C.orange} strokeWidth={56} strokeDasharray={`${L * 0.7 * Easing.out(Easing.cubic)(g)} ${L}`} strokeLinecap="round" />
      </g>
      <text x={540} y={920} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={170} fill={C.ink}>{pct} %</text>
      <text x={540} y={990} textAnchor="middle" fontFamily="Rubik" fontWeight={500} fontSize={36} fill={C.ink}>de probabilité</text>
      <Cloud x={250} y={1300} s={1.3} o={rain} />
    </Svg>
    <div style={{position: 'absolute', left: 390, top: 1250, fontFamily: 'Rubik', fontWeight: 700, fontSize: 48, color: C.ink, opacity: rain}}>+ de pluie<br /><span style={{fontWeight: 500, fontSize: 40}}>dans la moitié nord</span></div>
    <Source text="Source : Météo-France, tendances à trois mois (bulletin du 29 octobre 2026)" />
  </AbsoluteFill>);
};

// 5. La nuance : des coups de froid restent possibles
export const S5: React.FC = () => {
  const at = useAt();
  const k = useLin(at(0.05), at(0.6)); const no = useIn(at(0.62));
  const pts = Array.from({length: 61}).map((_, i) => { const u = i / 60; const v = 0.35 * Math.sin(u * 13) + 0.18 * Math.sin(u * 31 + 1) + 0.55 - (Math.exp(-Math.pow((u - 0.35) / 0.035, 2)) + Math.exp(-Math.pow((u - 0.74) / 0.03, 2))) * 0.95; return [130 + u * 820, 1020 - v * 260] as [number, number]; });
  const vis = pts.filter((_, i) => i / 60 <= k);
  return (<AbsoluteFill style={{background: C.cream}}>
    <Kicker text="LA NUANCE" color={C.orange} />
    <Title lines={[{t: 'Des coups de froid ?'}, {t: 'Possibles.', c: BLUE}]} size={82} />
    <Svg>
      <line x1={130} y1={1020} x2={950} y2={1020} stroke={C.ink} strokeWidth={4} strokeDasharray="14 12" opacity={0.6} />
      <text x={130} y={1250} textAnchor="start" fontFamily="Rubik" fontWeight={500} fontSize={30} fill={C.ink} opacity={0.7}>- - -  normale de saison</text>
      <path d={vis.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')} stroke={C.orange} strokeWidth={9} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {[0.35, 0.74].map((u, i) => k > u + 0.02 && <Snow key={i} x={130 + u * 820} y={1160} s={0.6} />)}
    </Svg>
    <div style={{position: 'absolute', left: 90, width: 900, top: 1300, textAlign: 'center', opacity: no, transform: `translateY(${(1 - no) * 24}px)`}}>
      <div style={{fontFamily: 'Rubik', fontWeight: 500, fontSize: 42, color: C.ink}}>Un hiver glacial à cause d'El Niño ?</div>
      <div style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 110, color: C.ink}}>RIEN NE L'ANNONCE.</div>
    </div>
    <Source text="Une prévision saisonnière donne des probabilités sur 3 mois, pas le temps de chaque jour." />
  </AbsoluteFill>);
};

// 6. Le vrai problème : le logement
export const S6: React.FC = () => {
  const at = useAt(); const f = useCurrentFrame();
  const a = useLin(at(0.3), at(0.5)), b = useLin(at(0.62), at(0.82));
  const blk = (o: number, n: number, col: string, top: number, label: string, sub: string, ic: React.ReactNode) => (
    <div style={{position: 'absolute', left: 90, top, width: 900, display: 'flex', alignItems: 'center', gap: 36, opacity: clamp(o * 4), transform: `translateX(${(1 - clamp(o * 4)) * -30}px)`}}>
      <svg width={150} height={150} viewBox="-75 -75 150 150"><circle r={72} fill="#fff" />{ic}</svg>
      <div>
        <div style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 160, lineHeight: 1, color: col}}>{Math.round(n * Easing.out(Easing.cubic)(o))} %</div>
        <div style={{fontFamily: 'Rubik', fontWeight: 700, fontSize: 40, color: C.ink}}>{label}</div>
        <div style={{fontFamily: 'Rubik', fontWeight: 500, fontSize: 32, color: '#7A7268'}}>{sub}</div>
      </div>
    </div>);
  return (<AbsoluteFill style={{background: C.cream}}>
    <Kicker text="LE VRAI PROBLÈME" color={C.orange} />
    <Title lines={[{t: "Ce n'est pas El Niño."}, {t: "C'est le logement.", c: C.orange}]} size={92} />
    {blk(a, 35, BLUE, 640, 'des ménages ont eu froid chez eux', 'hiver 2024-2025', <Snow x={0} y={0} s={0.95} />)}
    {blk(b, 64, C.orange, 1060, 'ont eu trop chaud chez eux', 'été 2025', <Sun x={0} y={0} s={1.1} />)}
    <Source text="Source : Médiateur national de l'énergie, baromètre énergie-info 2025 (froid ou chaleur subis au moins 24 h)" />
    {f < 0 && null}
  </AbsoluteFill>);
};

// 7. Les mêmes appartements : four l'été, frigo l'hiver
export const S7: React.FC = () => {
  const at = useAt();
  const hot = useIn(at(0.3)), cold = useIn(at(0.6));
  return (<AbsoluteFill style={{background: C.cream}}>
    <Title lines={[{t: 'Les mêmes'}, {t: 'appartements.', c: C.orange}]} size={110} top={220} />
    <Svg>
      <rect x={0} y={1560} width={W} height={H - 1560} fill={C.sand} />
      <Tower x={290} w={500} h={900} base={1560} seed={7} />
      <rect x={290} y={660} width={250} height={900} fill={C.orange} opacity={0.38 * hot} />
      <rect x={540} y={660} width={250} height={900} fill={BLUE} opacity={0.38 * cold} />
      <Sun x={180} y={760} s={1.4} o={hot} />
      <Snow x={900} y={760} s={1.1} o={cold} />
    </Svg>
    <div style={{position: 'absolute', left: 60, top: 1620, width: 460, textAlign: 'center', fontFamily: 'Oswald', fontWeight: 700, fontSize: 66, color: C.orange, opacity: hot}}>UN FOUR<br />L'ÉTÉ</div>
    <div style={{position: 'absolute', left: 560, top: 1620, width: 460, textAlign: 'center', fontFamily: 'Oswald', fontWeight: 700, fontSize: 66, color: BLUE, opacity: cold}}>UN FRIGO<br />L'HIVER</div>
  </AbsoluteFill>);
};

// 8. Fin
export const S8: React.FC = () => {
  const at = useAt();
  const a = useIn(at(0.05)), b = useIn(at(0.3)), c = useIn(at(0.6));
  return (<AbsoluteFill style={{background: C.night}}>
    <div style={{position: 'absolute', left: 90, width: 900, top: 620, textAlign: 'center', fontFamily: 'Rubik', fontWeight: 500, fontSize: 52, lineHeight: 1.3, color: '#E8E4F5', opacity: a}}>Avant de partager un titre qui fait peur…</div>
    <div style={{position: 'absolute', left: 90, width: 900, top: 800, textAlign: 'center', fontFamily: 'Oswald', fontWeight: 700, fontSize: 140, color: C.green, opacity: b, transform: `translateY(${(1 - b) * 20}px)`}}>VÉRIFIE LA SOURCE.</div>
    <div style={{position: 'absolute', left: 0, width: W, top: 1250, textAlign: 'center', opacity: c}}>
      <span style={{display: 'inline-block', padding: '20px 44px', borderRadius: 26, background: C.orange, fontFamily: 'Rubik', fontWeight: 800, fontSize: 44, color: '#fff'}}>Abonne-toi pour la suite</span>
      <div style={{fontFamily: 'Rubik', fontWeight: 700, fontSize: 28, letterSpacing: 5, color: '#9BA6D9', marginTop: 40}}>TOITS VERTS CONTRE LES 1 %</div>
    </div>
  </AbsoluteFill>);
};

export const SCENES = [S0, S0b, S1, S2, S3, S4, S5, S6, S7, S8];
void interpolate; void Para;
