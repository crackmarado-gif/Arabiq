import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Kicker, Title, clamp, useAt, useIn, useLin} from './ui';
import {Arrow, B, Ball, Board, Chalk, Disc, Label, Line, Pitch, Svg, Testimony, W, lerp, pt} from './kit';

const GREY: React.CSSProperties = {filter: 'grayscale(1) contrast(1.05)'};

// Bandeau « ÉDITION SPÉCIALE » (reste en couleur)
const Breaking: React.FC<{o?: number}> = ({o = 1}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 120, height: 86, background: '#C8102E', opacity: o, display: 'flex', alignItems: 'center', paddingLeft: 90, gap: 26}}>
    <span style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 50, color: '#fff', letterSpacing: 3}}>ÉDITION SPÉCIALE</span>
    <span style={{fontFamily: 'Rubik', fontWeight: 500, fontSize: 30, color: 'rgba(255,255,255,.8)'}}>· le duo Seb–Lucas</span>
  </div>
);

// Bougie à la craie
const Candle: React.FC<{x: number; y: number; o: number}> = ({x, y, o}) => {
  const f = useCurrentFrame(); const fl = 1 + 0.08 * Math.sin(f / 3 + x);
  return (<g opacity={o} transform={`translate(${x} ${y})`}>
    <rect x={-22} y={0} width={44} height={120} rx={6} fill="none" stroke={B.cream} strokeWidth={5} />
    <line x1={0} y1={0} x2={0} y2={-14} stroke={B.cream} strokeWidth={4} />
    <path d="M0 -70 C 16 -46, 14 -24, 0 -16 C -14 -24, -16 -46, 0 -70 Z" fill={B.gold} transform={`scale(1 ${fl})`} style={{transformOrigin: '0px -16px'}} />
  </g>);
};

// ───────── PARTIE 1 — LE RENARD ─────────

export const S1: React.FC = () => {
  const at = useAt();
  return (<AbsoluteFill style={{background: B.black}}>
    <Line text="Certains attaquants viennent chercher le ballon." delay={at(0.05)} top={760} />
    <Line text="Lucas, lui, s'installe directement chez l'adversaire." delay={at(0.44)} top={930} color={B.gold} />
  </AbsoluteFill>);
};

export const S2: React.FC = () => {
  const at = useAt(); const f = useCurrentFrame();
  const k = useIn(3), l = useIn(at(0.1)), sub = useIn(at(0.38));
  const z = interpolate(f, [0, at(1)], [1, 1.05]);
  return (<Board>
    <AbsoluteFill style={{transform: `scale(${z})`}}>
      <div style={{position: 'absolute', top: 600, width: W, textAlign: 'center', fontFamily: 'Rubik', fontWeight: 700, fontSize: 30, letterSpacing: 8, color: B.xv, opacity: k}}>XV ORIGINALS · ÉPISODE 3</div>
      <div style={{position: 'absolute', top: 640, width: W, textAlign: 'center', fontFamily: 'Oswald', fontWeight: 700, fontSize: 300, lineHeight: 1.1, color: B.cream, opacity: l, letterSpacing: 10 * (1 - l) + 6}}>LUCAS</div>
      <div style={{position: 'absolute', top: 1010, width: W, textAlign: 'center', fontFamily: 'Oswald', fontWeight: 700, fontSize: 64, letterSpacing: 6, color: B.gold, opacity: sub, transform: `translateY(${(1 - sub) * 20}px)`}}>LE RETOUR DU SUPER SAIYAN</div>
    </AbsoluteFill>
  </Board>);
};

// 3. Le renard : il campe dans la défense adverse
export const S3: React.FC = () => {
  const at = useAt(); const f = useCurrentFrame();
  const tent = useIn(at(0.45)); const lb = useIn(at(0.8));
  const D: [number, number, string][] = [[300, 760, '5'], [450, 720, '4'], [630, 720, '3'], [780, 760, '2'], [540, 520, '1']];
  return (<Board>
    <Kicker text="PARTIE 1 — LE RENARD" color={B.xv} top={130} />
    <Title lines={[{t: 'Son poste :', c: B.cream}, {t: 'la défense adverse.', c: B.xv}]} size={86} top={160} />
    <Svg>
      <g transform="translate(0 120)"><Pitch top /></g>
      {D.map(([x, y, l], i) => <Disc key={i} x={x + Math.sin(f / 35 + i) * 6} y={y} t="adv" label={l} />)}
      <Disc x={540} y={760} t="seb" label="L" />
      <g opacity={tent} transform="translate(660 900)">
        <path d="M-70 60 L0 -50 L70 60 Z" fill="none" stroke={B.gold} strokeWidth={6} strokeLinejoin="round" />
        <path d="M0 -50 L0 60 M-18 60 L0 18 L18 60" stroke={B.gold} strokeWidth={5} fill="none" />
      </g>
      <Arrow d="M660 1030 Q 600 1000 560 830" k={tent} end={[560, 830]} ang={-100} color={B.gold} w={5} />
      <Label x={540} y={1240} text="Domicile déclaré : défense adverse" o={lb} size={40} color={B.gold} />
      <Label x={540} y={1300} text="« On pensait qu'il jouait avec nous. »" o={lb} size={34} color={B.dim} />
    </Svg>
  </Board>);
};

// 4. Malte
export const S4: React.FC = () => {
  const at = useAt(); const f = useCurrentFrame();
  const map = useLin(0, at(0.2)); const fly = useLin(at(0.12), at(0.3)); const cnt = useLin(at(0.32), at(0.7)); const lb = useIn(at(0.74));
  const n = Math.round(Easing.out(Easing.cubic)(cnt) * 27);
  const [px, py] = pt([[160, 520], [420, 400], [700, 660]], fly);
  return (<Board>
    <Kicker text="LE DÉPART" color={B.xv} top={170} />
    <Title lines={[{t: 'Direction', c: B.cream}, {t: 'Malte.', c: B.xv}]} size={110} top={200} />
    <Svg>
      <g transform="translate(0 180)">
        <Chalk d="M610 640 C 650 590, 760 600, 800 640 C 840 690, 790 760, 720 750 C 660 745, 600 700, 610 640 Z" k={map} w={6} />
        <Label x={705} y={700} text="MALTE" o={map} size={36} />
        <path d="M160 520 Q 420 300 700 660" stroke={B.dim} strokeWidth={4} strokeDasharray="6 14" fill="none" opacity={fly > 0 ? 0.9 : 0} />
        {fly > 0 && fly < 1 && <circle cx={px} cy={py} r={14} fill={B.gold} />}
      </g>
    </Svg>
    <div style={{position: 'absolute', left: 90, width: 900, top: 1150, textAlign: 'center', opacity: clamp(cnt * 4)}}>
      <div style={{fontFamily: 'Rubik', fontWeight: 700, fontSize: 34, letterSpacing: 6, color: B.dim}}>DÉFENSEURS MALTAIS FRACASSÉS</div>
      <div style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 220, lineHeight: 1, color: B.gold}}>{n}{cnt >= 1 && Math.floor(f / 8) % 2 ? '+' : ''}</div>
    </div>
    <Line text="Les défenseurs de l'île en parlent encore." delay={at(0.74)} top={1560} size={42} color={lb ? B.cream : B.cream} />
  </Board>);
};

// 5. Super Saiyan 3 : aura, buts en rafale, niveau de puissance
export const S5: React.FC = () => {
  const at = useAt(); const f = useCurrentFrame();
  const aura = useIn(at(0.33)); const goals = [0.52, 0.575, 0.63, 0.69, 0.75];
  const p = useLin(at(0.8), at(0.94)); const lvl = Math.round(lerp(1200, 9001, Easing.in(Easing.quad)(p)));
  return (<Board>
    <Kicker text="LE RETOUR" color={B.xv} top={150} />
    <Title lines={[{t: 'Super Saiyan', c: B.cream}, {t: '3', c: B.gold}]} size={120} top={180} />
    <Svg>
      <g transform="translate(540 820)">
        {Array.from({length: 14}).map((_, i) => { const a = (i / 14) * Math.PI * 2 - Math.PI / 2; const r1 = 70, r2 = (150 + (i % 2) * 60 + Math.sin(f / 4 + i) * 12) * aura;
          const a1 = a - 0.18, a2 = a + 0.18;
          return <path key={i} d={`M${Math.cos(a1) * r1} ${Math.sin(a1) * r1} L${Math.cos(a) * r2} ${Math.sin(a) * r2} L${Math.cos(a2) * r1} ${Math.sin(a2) * r1} Z`} fill={B.gold} opacity={0.85} />; })}
        <g transform="scale(2.2)"><Disc x={0} y={0} t="seb" label="L" /></g>
      </g>
    </Svg>
    <div style={{position: 'absolute', left: 90, width: 900, top: 1120, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 26px'}}>
      {goals.map((g, i) => { const s = useIn(at(g)); return <span key={i} style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 96, color: B.cream, opacity: s, transform: `translateY(${(1 - s) * 20}px)`, display: 'inline-block'}}>BUT.</span>; })}
    </div>
    <div style={{position: 'absolute', left: 90, width: 900, top: 1480, textAlign: 'center', opacity: clamp(p * 5)}}>
      <div style={{fontFamily: 'Rubik', fontWeight: 700, fontSize: 32, letterSpacing: 6, color: B.dim}}>NIVEAU DE PUISSANCE</div>
      <div style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 150, lineHeight: 1, color: p >= 1 ? B.gold : B.cream}}>{lvl.toLocaleString('fr-FR').replace(/ | /g, ' ')}</div>
    </div>
  </Board>);
};

// 6. Témoignage 1
export const S6: React.FC = () => <Testimony n={1} text="" />;

// ───────── PARTIE 2 — LA TRAGÉDIE (noir et blanc) ─────────

export const S7: React.FC = () => {
  const at = useAt(); const b = useIn(2);
  return (<AbsoluteFill style={{background: B.black}}>
    <Breaking o={b} />
    <div style={{position: 'absolute', top: 600, width: W, textAlign: 'center', fontFamily: 'Rubik', fontWeight: 700, fontSize: 32, letterSpacing: 8, color: B.dim, opacity: b}}>PARTIE 2 — LA TRAGÉDIE</div>
    <Line text="Il y a des jours qui marquent une génération." delay={at(0.05)} top={720} />
    <Line text="Des jours où le temps s'arrête." delay={at(0.3)} top={860} />
    <Line text="Le duo Seb–Lucas." delay={at(0.76)} top={1040} size={110} font="Oswald" color={B.cream} />
  </AbsoluteFill>);
};

export const S8: React.FC = () => {
  const at = useAt(); const f = useCurrentFrame();
  const lb1 = useIn(at(0.24)), lb2 = useIn(at(0.41)), vide = useIn(at(0.63)), ball = useIn(at(0.7));
  return (<AbsoluteFill>
    <AbsoluteFill style={GREY}>
      <Board>
        <div style={{position: 'absolute', left: 90, top: 250, fontFamily: 'Rubik', fontWeight: 700, fontSize: 28, letterSpacing: 5, color: B.dim}}>IMAGES D'ARCHIVES</div>
        <Svg>
          <Pitch />
          {[[300, 560], [460, 520], [620, 520], [780, 560]].map(([x, y], i) => <Disc key={i} x={x} y={y} t="adv" label="" />)}
          <Disc x={540} y={610} t="seb" label="L" o={lb1} />
          <Label x={540} y={700} text="installé chez l'adversaire" o={lb1} size={30} />
          <Disc x={900} y={330} t="seb" label="S" o={lb2} />
          <Label x={900} y={270} text="3 s d'avance" o={lb2} size={30} />
          <rect x={150} y={800} width={780} height={480} rx={30} fill="none" stroke={B.cream} strokeWidth={4} strokeDasharray="14 14" opacity={vide * 0.7} />
          <text x={540} y={1060} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={130} fill={B.cream} opacity={vide * 0.5}>LE VIDE</text>
          <Ball x={540 + Math.sin(f / 50) * 4} y={1180} o={ball} />
          <Label x={540} y={1240} text="ballon abandonné · jamais récupéré" o={ball} size={30} color={B.cream} />
        </Svg>
      </Board>
    </AbsoluteFill>
    <Breaking />
  </AbsoluteFill>);
};

export const S9: React.FC = () => {
  const at = useAt();
  const c = useLin(at(0.02), at(0.3)); const cell = useIn(at(0.22)); const plaque = useIn(at(0.66)); const never = useIn(at(0.85));
  return (<AbsoluteFill>
    <AbsoluteFill style={GREY}>
      <Board>
        <div style={{position: 'absolute', right: 90, top: 260, padding: '10px 22px', border: `4px solid ${B.cream}`, borderRadius: 12, fontFamily: 'Rubik', fontWeight: 700, fontSize: 30, color: B.cream, opacity: cell}}>CELLULE DE SOUTIEN PSYCHOLOGIQUE →</div>
        <Svg>
          {[200, 340, 480, 600, 740, 880].map((x, i) => <Candle key={i} x={x} y={1420 + (i % 2) * 30} o={clamp(c * 6 - i)} />)}
        </Svg>
        <div style={{position: 'absolute', left: 140, width: 800, top: 560, padding: '50px 40px', boxSizing: 'border-box', border: `6px double ${B.cream}`, borderRadius: 16, textAlign: 'center', opacity: plaque, transform: `translateY(${(1 - plaque) * 20}px)`}}>
          <div style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 52, lineHeight: 1.25, color: B.cream}}>ICI, DEUX ATTAQUANTS<br />ONT JOUÉ ENSEMBLE.</div>
          <div style={{fontFamily: 'Rubik', fontWeight: 500, fontSize: 32, color: B.dim, marginTop: 20}}>L'XV se souvient.</div>
        </div>
        <div style={{position: 'absolute', left: 90, width: 900, top: 1080, textAlign: 'center', fontFamily: 'Oswald', fontWeight: 700, fontSize: 110, color: B.cream, opacity: never}}>PLUS JAMAIS ÇA.</div>
      </Board>
    </AbsoluteFill>
    <Breaking />
  </AbsoluteFill>);
};

// ───────── PARTIE 3 — LA CHUTE ET LA RENAISSANCE ─────────

// Courbe de forme (krach puis remontée)
const FORM: [number, number][] = [[0, 0.62], [0.12, 0.7], [0.22, 0.86], [0.32, 0.9], [0.42, 0.88], [0.5, 0.3], [0.58, 0.08], [0.66, 0.1], [0.74, 0.22], [0.84, 0.6], [0.94, 0.88], [1, 0.95]];
const curve = (upto: number) => {
  const X = (u: number) => 130 + u * 820, Y = (v: number) => 1400 - v * 700;
  const pts = FORM.filter(([u]) => u <= upto);
  return pts.map(([u, v], i) => `${i ? 'L' : 'M'}${X(u)} ${Y(v)}`).join(' ');
};
const Chart: React.FC<{upto: number; color?: string}> = ({upto, color = B.gold}) => (
  <g>
    <Chalk d="M130 680 L130 1400 L950 1400" k={1} w={5} color={B.dim} />
    <Label x={140} y={660} text="forme" o={1} size={28} color={B.dim} anchor="start" />
    <path d={curve(upto)} stroke={color} strokeWidth={9} fill="none" strokeLinejoin="round" strokeLinecap="round" />
  </g>
);

export const S10: React.FC = () => {
  const at = useAt();
  const k = useLin(at(0.2), at(0.66)); const cata = useIn(at(0.68)); const dep = useIn(at(0.79));
  return (<Board>
    <Kicker text="PARTIE 3 — LA CHUTE" color={B.xv} top={170} />
    <Title lines={[{t: 'Début de', c: B.cream}, {t: 'saison dernière.', c: B.xv}]} size={96} top={200} />
    <Svg><Chart upto={lerp(0.42, 0.62, k)} /></Svg>
    <div style={{position: 'absolute', right: 110, top: 1420, fontFamily: 'Oswald', fontWeight: 700, fontSize: 80, color: B.xv, opacity: cata, transform: `rotate(-6deg) scale(${1.2 - 0.2 * cata})`}}>CATACLYSMIQUE</div>
    <Line text="Les experts parlent de la Grande Dépression." delay={at(0.79)} top={1600} size={42} color={dep ? B.cream : B.cream} />
  </Board>);
};

export const S11: React.FC = () => <Testimony n={2} text="" />;

export const S12: React.FC = () => {
  const at = useAt();
  return (<AbsoluteFill style={{background: B.black}}>
    <Line text="Mais les grands joueurs ne restent jamais à terre." delay={at(0.03)} top={640} size={46} color={B.dim} />
    <Line text="Doute." delay={at(0.45)} top={820} size={110} font="Oswald" />
    <Line text="Remise en question." delay={at(0.62)} top={960} size={90} font="Oswald" color={B.xv} />
    <Line text="Travail." delay={at(0.82)} top={1100} size={110} font="Oswald" color={B.gold} />
  </AbsoluteFill>);
};

export const S13: React.FC = () => {
  const at = useAt();
  const k = useLin(at(0.1), at(0.6)); const pr = useIn(at(0.62));
  return (<Board>
    <Kicker text="LE RETOUR" color={B.xv} top={170} />
    <Title lines={[{t: 'Le renard', c: B.cream}, {t: 'est revenu.', c: B.gold}]} size={110} top={200} />
    <Svg><Chart upto={lerp(0.62, 1, k)} /></Svg>
    <div style={{position: 'absolute', left: 0, width: W, top: 1500, textAlign: 'center', opacity: pr}}>
      <span style={{display: 'inline-block', padding: '14px 40px', border: `8px solid ${B.gold}`, borderRadius: 18, fontFamily: 'Oswald', fontWeight: 700, fontSize: 90, color: B.gold, transform: `rotate(-5deg) scale(${1.2 - 0.2 * pr})`}}>PRIME RETROUVÉ</span>
    </div>
  </Board>);
};

export const S14: React.FC = () => {
  const at = useAt(); const sig = useIn(at(0.86));
  return (<AbsoluteFill style={{background: B.black}}>
    <Line text="Lucas." delay={at(0.03)} top={600} size={130} font="Oswald" />
    <Line text="Un buteur. Un renard." delay={at(0.2)} top={800} size={64} font="Oswald" color={B.xv} />
    <Line text="Et surtout… un bon gars." delay={at(0.5)} top={960} size={64} color={B.gold} />
    <div style={{position: 'absolute', top: 1500, width: W, textAlign: 'center', fontFamily: 'Rubik', fontWeight: 700, fontSize: 28, letterSpacing: 7, color: B.dim, opacity: sig}}>LUCAS · LE RETOUR DU SUPER SAIYAN · XV ORIGINALS</div>
  </AbsoluteFill>);
};

export const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14];
