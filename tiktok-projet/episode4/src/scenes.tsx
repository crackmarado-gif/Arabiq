import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, interpolateColors, staticFile, useCurrentFrame} from 'remotion';
import {C, Chip, Drift, Icon, Kicker, Para, Source, Thermo, Title, Tower, clamp, hash, useAt, useIn, useLin} from './ui';

const W = 1080, H = 1920;
const Svg: React.FC<{children: React.ReactNode}> = ({children}) => <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}>{children}</svg>;
const Ground: React.FC<{y?: number; fill?: string}> = ({y = 1500, fill = C.sand}) => <rect x={0} y={y} width={W} height={H - y} fill={fill} />;

// 1. Accroche : « Lève les yeux. Juste au-dessus de ta tête, il y a une solution… et personne ne s'en sert. »
export const S1: React.FC = () => {
  const at = useAt();
  const ring = useIn(at(0.45));
  return (<AbsoluteFill style={{background: C.cream}}>
    <Drift y={180} from={1.06} to={1} origin="540px 1500px">
      <Svg>
        <Ground y={1640} />
        <Tower x={-40} w={300} h={720} base={1640} seed={1} />
        <Tower x={300} w={340} h={980} base={1640} seed={2} />
        <Tower x={690} w={320} h={800} base={1640} seed={3} />
        <rect x={286} y={640} width={368} height={44} rx={22} fill="none" stroke={C.green} strokeWidth={6} strokeDasharray="18 14" opacity={ring} transform={`translate(0 ${(1 - ring) * 20})`} />
      </Svg>
    </Drift>
    <Title lines={[{t: 'Lève les yeux.'}]} delay={1} size={128} top={230} />
    <Title lines={[{t: 'La solution est'}, {t: 'au-dessus de toi.', c: C.greenD}]} delay={at(0.22)} size={84} top={400} />
    <Para top={1730} delay={at(0.68)} color={C.ink} weight={700}>…et personne ne s'en sert.</Para>
  </AbsoluteFill>);
};

// 2. « Si le changement ne vient pas d'en haut, il doit venir d'en bas. Et pourtant, la réponse est tout en haut… sur les toits. »
export const S2: React.FC = () => {
  const at = useAt(); const f = useCurrentFrame();
  const a1 = useIn(at(0.08)), x1 = useIn(at(0.2)), a2 = useIn(at(0.28));
  const out = interpolate(f, [at(0.52), at(0.6)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rise = useIn(at(0.56)), roof = useLin(at(0.66), at(0.82));
  return (<AbsoluteFill style={{background: C.cream}}>
    <Kicker text="ÉPISODE 4" />
    <Title lines={[{t: 'Comment'}, {t: 'on fait ?', c: C.greenD}]} delay={2} size={130} />
    <Svg>
      <g opacity={out}>
        <g opacity={a1} transform={`translate(300 ${720 + (1 - a1) * -40})`}>
          <path d="M0 0 L0 380 M-60 320 L0 390 L60 320" stroke={C.grey} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <text x={0} y={470} textAnchor="middle" fontFamily="Rubik" fontWeight={700} fontSize={40} fill={C.grey}>d'en haut</text>
          <g opacity={x1} stroke={C.orange} strokeWidth={18} strokeLinecap="round"><line x1={-80} y1={110} x2={80} y2={270} /><line x1={80} y1={110} x2={-80} y2={270} /></g>
        </g>
        <g opacity={a2} transform={`translate(780 ${720 + (1 - a2) * 40})`}>
          <path d="M0 390 L0 10 M-60 70 L0 0 L60 70" stroke={C.green} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <text x={0} y={470} textAnchor="middle" fontFamily="Rubik" fontWeight={700} fontSize={40} fill={C.greenD}>d'en bas</text>
        </g>
      </g>
      <g transform={`translate(0 ${(1 - rise) * 900})`} opacity={rise}>
        <Ground y={1640} />
        <Tower x={330} w={420} h={900} base={1640} seed={4} green={roof} />
      </g>
    </Svg>
    <Para top={1700} delay={at(0.72)} weight={700} size={50}>…sur les <span style={{color: C.greenD}}>toits</span>.</Para>
  </AbsoluteFill>);
};

// 3. « Un toit végétalisé […] jusqu'à dix degrés de moins sur le toit. »
export const S3: React.FC = () => {
  const at = useAt(); const f = useCurrentFrame();
  const g = useLin(at(0.15), at(0.45));
  const cool = useLin(at(0.62), at(0.88));
  const n = Math.round(interpolate(f, [at(0.62), at(0.88)], [80, 29], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
  const hot = useIn(at(0.3)), big = useIn(at(0.58));
  const waves = (x: number, o: number) => [0, 1, 2].map((i) => {
    const y = 1000 - ((f * 1.2 + i * 40) % 120);
    return <path key={i} d={`M${x + i * 70} ${y} q15 -20 0 -40 q-15 -20 0 -40`} stroke={C.orange} strokeWidth={8} fill="none" strokeLinecap="round" opacity={o * 0.8 * Math.sin(((f * 1.2 + i * 40) % 120) / 120 * Math.PI)} />;
  });
  return (<AbsoluteFill style={{background: C.cream}}>
    <Kicker text="UN TOIT VÉGÉTALISÉ" />
    <div style={{position: 'absolute', top: 300, left: 30, width: 500, textAlign: 'center', fontFamily: 'Oswald', fontWeight: 700, fontSize: 170, color: '#E8321E', opacity: hot, transform: `translateY(${(1 - hot) * 30}px)`}}>80 °C</div>
    <div style={{position: 'absolute', top: 300, left: 550, width: 500, textAlign: 'center', fontFamily: 'Oswald', fontWeight: 700, fontSize: 170, color: interpolateColors(cool, [0, 1], ['#E8321E', C.greenD]), opacity: big, transform: `translateY(${(1 - big) * 30}px)`}}>{n} °C</div>
    <Para top={530} delay={at(0.3)} center size={40}>en surface, au soleil</Para>
    <Svg>
      <Ground y={1500} />
      {/* Bitume */}
      <rect x={70} y={1090} width={420} height={410} fill={C.wall} /><rect x={372} y={1090} width={118} height={410} fill={C.wallD} />
      <rect x={60} y={1070} width={440} height={26} rx={6} fill={C.ink} />
      {waves(170, 1)}
      <Thermo x={280} y={720} level={0.85} color="#E8321E" />
      {/* Toit vert */}
      <rect x={590} y={1090} width={420} height={410} fill={C.wall} /><rect x={892} y={1090} width={118} height={410} fill={C.wallD} />
      <rect x={580} y={1070} width={440} height={26} rx={6} fill={interpolateColors(g, [0, 1], [C.ink, C.leaf])} />
      {Array.from({length: 13}).map((_, i) => { const k = Easing.out(Easing.cubic)(clamp(g * 1.6 - i / 13 * 0.6)); return <circle key={i} cx={596 + i * 33} cy={1070} r={(14 + hash(i + 9) * 10) * k} fill={i % 2 ? C.leaf : C.leaf2} />; })}
      {waves(690, 1 - g)}
      <Thermo x={800} y={720} level={0.85 - 0.5 * cool} color={interpolateColors(cool, [0, 1], ['#E8321E', '#5BB8E0'])} />
      <text x={280} y={1580} textAnchor="middle" fontFamily="Rubik" fontWeight={700} fontSize={40} fill={C.ink}>Bitume</text>
      <text x={800} y={1580} textAnchor="middle" fontFamily="Rubik" fontWeight={700} fontSize={40} fill={C.greenD}>Toit végétalisé</text>
    </Svg>
    <Source text="Source : étude réalisée pour l'ADEME, « Rafraîchir les villes » (d'après Fischetti, 2005)" />
  </AbsoluteFill>);
};

// 4. Biodiversité : 36 toits, 292 espèces de plantes, 70 % venues seules, 611 espèces d'invertébrés
export const S4: React.FC = () => {
  const at = useAt(); const f = useCurrentFrame();
  const rows: {n: number; pre: string; label: string; icon: 'roof' | 'leaf' | 'seed' | 'bug'; t: number}[] = [
    {n: 36, pre: '', label: 'toits verts étudiés', icon: 'roof', t: 0.2},
    {n: 400, pre: '≈ ', label: 'espèces de plantes,\nbeaucoup venues toutes seules', icon: 'leaf', t: 0.42},
    {n: 611, pre: '', label: "espèces d'invertébrés", icon: 'bug', t: 0.8},
  ];
  return (<AbsoluteFill style={{background: '#E6F1E0'}}>
    <Kicker text="LA NATURE S'INVITE" />
    <Title lines={[{t: 'Elle s\'installe'}, {t: 'toute seule.', c: C.greenD}]} size={96} delay={2} />
    {rows.map((r, i) => {
      const s = useIn(at(r.t));
      const v = Math.round(interpolate(f, [at(r.t), at(r.t) + 30], [0, r.n], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
      return (<div key={i} style={{position: 'absolute', left: 90, top: 600 + i * 340, display: 'flex', alignItems: 'center', gap: 40, opacity: s, transform: `translateX(${(1 - s) * -40}px)`}}>
        <Icon kind={r.icon} size={150} />
        <div>
          <div style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 120, lineHeight: 1, color: C.greenD}}>{r.pre}{v}</div>
          <div style={{fontFamily: 'Rubik', fontWeight: 500, fontSize: 42, lineHeight: 1.25, whiteSpace: 'pre-line', color: C.ink}}>{r.label}</div>
        </div>
      </div>);
    })}
    <Source text="Source : ARB Île-de-France, étude GROOVES 2017-2019 · Institut Paris Region, Note rapide n° 890 (2021)" />
  </AbsoluteFill>);
};

// 5. Ferme sur le toit : Nature Urbaine, 14 000 m², Paris
export const S5: React.FC = () => {
  const at = useAt(); const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [at(0.1), at(0.45)], [0, 14000], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
  const big = useIn(at(0.08));
  const rowsY = [1190, 1250, 1315, 1385, 1460];
  return (<AbsoluteFill style={{background: 'linear-gradient(180deg,#DCEFF2 0%,#F3EDE2 60%)'}}>
    <Kicker text="UNE FERME SUR LE TOIT" />
    <div style={{position: 'absolute', left: 90, top: 260, fontFamily: 'Oswald', fontWeight: 700, fontSize: 200, lineHeight: 1, color: C.greenD, opacity: big}}>{n.toLocaleString('fr-FR').replace(/ | /g, ' ')} m²</div>
    <Para top={500} delay={at(0.3)} size={46}><b>de toit, à Paris</b>… où l'on cultive des fruits et des légumes.</Para>
    <Drift from={1} to={1.05} origin="540px 1350px">
      <Svg>
        <path d="M842 1120 L888 860 L896 760 L900 700 L904 760 L912 860 L958 1120 L935 1120 Q900 1040 865 1120 Z" fill="#C9BBA6" />
        <rect x={866} y={950} width={68} height={10} fill="#C9BBA6" /><rect x={884} y={840} width={32} height={8} fill="#C9BBA6" />
        <polygon points="90,1140 990,1140 1060,1560 20,1560" fill="#B9A58A" />
        <rect x={20} y={1560} width={1040} height={360} fill={C.wall} />
        {[0, 1, 2, 3, 4, 5, 6].map((c) => <rect key={c} x={70 + c * 140} y={1630} width={60} height={80} rx={8} fill={C.win} />)}
        {rowsY.map((y, i) => {
          const k = useLin(at(0.2 + i * 0.1), at(0.35 + i * 0.1));
          const p = (y - 1140) / 420; const x0 = 90 - 70 * p + 30, x1 = 990 + 70 * p - 30;
          const cx = (x0 + x1) / 2, half = (x1 - x0) / 2 * 0.62 * k;
          return (<g key={i}>
            <rect x={cx - half} y={y - 18 - p * 6} width={half * 2} height={30 + p * 12} rx={16} fill={i % 2 ? C.leaf : C.leaf2} />
            {Array.from({length: 12}).map((_, j) => { const dx = x0 + 30 + j * ((x1 - x0 - 60) / 11); const on = Math.abs(dx - cx) < half - 10;
              return on && (i % 2 === 0) ? <circle key={j} cx={dx} cy={y - 18} r={8 + p * 4} fill={j % 3 ? '#E8321E' : C.orange} /> : null; })}
          </g>);
        })}
      </Svg>
    </Drift>
    <Source text="Source : Chambre d'agriculture d'Île-de-France, fiche Nature Urbaine (2023)" />
  </AbsoluteFill>);
};

// 6. « Maintenant, imagine ça sur les cités. […] qui pourraient devenir verts. »
// Avant / après sur une même vue de cité (images créées avec Canva, à afficher comme SIMULATION)
export const S6: React.FC = () => {
  const at = useAt(); const f = useCurrentFrame();
  const k = interpolate(f, [at(0.38), at(0.88)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const zoom = interpolate(f, [0, at(1)], [1.0, 1.07]);
  const x = W * k; const lab = useIn(at(0.2)); const lab2 = useIn(at(0.5));
  const img: React.CSSProperties = {position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover', transform: `scale(${zoom})`, transformOrigin: '540px 1100px'};
  return (<AbsoluteFill style={{background: C.ink}}>
    <Img src={staticFile('cite-avant.png')} style={img} />
    <AbsoluteFill style={{clipPath: `inset(0 ${W - x}px 0 0)`}}><Img src={staticFile('cite-apres.png')} style={img} /></AbsoluteFill>
    {k > 0 && k < 1 && <div style={{position: 'absolute', left: x - 3, top: 0, width: 6, height: H, background: '#fff', boxShadow: '0 0 18px rgba(0,0,0,.35)'}}>
      <div style={{position: 'absolute', left: -32, top: 1080, width: 70, height: 70, borderRadius: 35, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Rubik', fontWeight: 800, fontSize: 30, color: C.ink}}>‹ ›</div></div>}
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(243,237,226,.95) 0%, rgba(243,237,226,.85) 22%, rgba(243,237,226,0) 36%)'}} />
    <Title lines={[{t: 'Imagine ça'}, {t: 'sur les cités.', c: C.greenD}]} size={110} delay={2} />
    <div style={{position: 'absolute', left: 90, top: 1560, padding: '10px 22px', borderRadius: 14, background: 'rgba(27,30,28,.75)', color: '#fff', fontFamily: 'Rubik', fontWeight: 700, fontSize: 30, letterSpacing: 4, opacity: lab * (1 - lab2)}}>AVANT</div>
    <div style={{position: 'absolute', right: 90, top: 1560, padding: '10px 22px', borderRadius: 14, background: C.greenD, color: '#fff', fontFamily: 'Rubik', fontWeight: 700, fontSize: 30, letterSpacing: 4, opacity: lab2}}>APRÈS ?</div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 200, background: 'linear-gradient(0deg, rgba(27,30,28,.7), rgba(27,30,28,0))'}} />
    <div style={{position: 'absolute', left: 90, top: 1760, padding: '8px 18px', borderRadius: 10, background: C.orange, color: '#fff', fontFamily: 'Rubik', fontWeight: 800, fontSize: 26, letterSpacing: 3}}>SIMULATION</div>
    <Source text="Images illustratives créées avec l'IA (Canva) : ce n'est pas une vraie cité." color="#fff" delay={10} />
  </AbsoluteFill>);
};

// 7. Limite 1 : le toit appartient au bailleur ; la loi Climat ne vise pas les logements
export const S7: React.FC = () => {
  const at = useAt();
  const lock = useIn(at(0.15)), sign = useIn(at(0.25)), card = useIn(at(0.52));
  const items: [string, boolean, number][] = [['Centres commerciaux', true, 0.6], ['Bureaux', true, 0.66], ['Logements', false, 0.76]];
  return (<AbsoluteFill style={{background: C.cream}}>
    <Kicker text="ATTENTION" color={C.orange} />
    <Title lines={[{t: 'Ce n\'est pas'}, {t: 'magique.', c: C.orange}]} size={100} delay={2} />
    <Svg>
      <rect x={110} y={760} width={440} height={340} fill={C.wall} /><rect x={427} y={760} width={123} height={340} fill={C.wallD} />
      {[0, 1].map((r) => [0, 1, 2, 3].map((c) => <rect key={r + '' + c} x={140 + c * 100} y={820 + r * 120} width={44} height={60} rx={6} fill={C.win} />))}
      <rect x={100} y={740} width={460} height={24} rx={6} fill={C.grey} />
      <g opacity={lock} transform={`translate(330 ${640 + (1 - lock) * 20})`}>
        <path d="M-38 0 V-30 A38 38 0 0 1 38 -30 V0" stroke={C.ink} strokeWidth={14} fill="none" />
        <rect x={-58} y={-4} width={116} height={92} rx={16} fill={C.orange} /><circle cx={0} cy={36} r={12} fill={C.ink} /><rect x={-5} y={40} width={10} height={26} fill={C.ink} />
      </g>
      <g opacity={sign} transform={`translate(${620 + (1 - sign) * 30} 600)`}>
        <rect x={150} y={150} width={16} height={350} fill={C.ink} />
        <rect x={0} y={60} width={360} height={170} rx={16} fill="#fff" stroke={C.ink} strokeWidth={6} />
        <text x={180} y={130} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={44} fill={C.ink}>TOIT PRIVÉ</text>
        <text x={180} y={190} textAnchor="middle" fontFamily="Rubik" fontWeight={500} fontSize={30} fill={C.ink}>Décision : le bailleur</text>
      </g>
    </Svg>
    <div style={{position: 'absolute', left: 90, top: 1200, width: 900, padding: '36px 44px', boxSizing: 'border-box', borderRadius: 28, background: '#fff', boxShadow: '0 14px 30px rgba(58,36,16,.14)', opacity: card, transform: `translateY(${(1 - card) * 40}px)`}}>
      <div style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 52, color: C.ink, marginBottom: 6}}>LOI CLIMAT · TOIT VÉGÉTALISÉ OU SOLAIRE OBLIGATOIRE ?</div>
      <div style={{fontFamily: 'Rubik', fontWeight: 500, fontSize: 28, color: '#7A7268', marginBottom: 12}}>Pour les bâtiments neufs ou très rénovés</div>
      {items.map(([t, ok, d]) => { const s = useIn(at(d)); return (
        <div key={t} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderTop: '2px solid #EEE6D8', fontFamily: 'Rubik', fontWeight: ok ? 500 : 800, fontSize: 44, color: ok ? C.ink : C.orange, opacity: s}}>
          <span>{t}</span><span style={{fontFamily: 'Oswald', fontSize: 56, color: ok ? C.greenD : C.orange}}>{ok ? 'OUI' : 'NON'}</span>
        </div>); })}
    </div>
    <Source text="Source : loi Climat et Résilience (2021), art. 101 (art. L. 171-4 du Code de la construction et de l'habitation)" />
  </AbsoluteFill>);
};

// 8. Limite 2 : surtout le dernier étage ; eau, entretien ; murs végétalisés pour le bas
export const S8: React.FC = () => {
  const at = useAt();
  const cool = useLin(at(0.08), at(0.3)); const vine = useLin(at(0.66), at(0.95));
  const floors = 5, fh = 150, x0 = 300, x1 = 860, top = 640;
  return (<AbsoluteFill style={{background: C.cream}}>
    <Kicker text="ATTENTION" color={C.orange} />
    <Title lines={[{t: 'Surtout au'}, {t: 'dernier étage.', c: C.orange}]} size={96} delay={2} />
    <Svg>
      <Ground y={top + floors * fh} />
      <rect x={x0 - 12} y={top - 26} width={x1 - x0 + 24} height={26} rx={6} fill={C.leaf} />
      {Array.from({length: 14}).map((_, i) => <circle key={i} cx={x0 + i * 42} cy={top - 26} r={14 + hash(i + 3) * 8} fill={i % 2 ? C.leaf : C.leaf2} />)}
      {Array.from({length: floors}).map((_, i) => (<g key={i}>
        <rect x={x0} y={top + i * fh} width={x1 - x0} height={fh} fill={i === 0 ? interpolateColors(cool, [0, 1], [C.warm, C.cool]) : C.warm} stroke={C.wall} strokeWidth={10} />
        <text x={x1 - 26} y={top + i * fh + 92} textAnchor="end" fontFamily="Oswald" fontWeight={700} fontSize={56} fill={i === 0 ? interpolateColors(cool, [0, 1], ['#C2552A', C.blue]) : '#C2552A'}>{i === 0 ? (cool > 0.5 ? 'plus frais' : 'chaud') : 'chaud'}</text>
      </g>))}
      {/* Mur végétalisé qui grimpe le long de la façade */}
      <line x1={x0 - 14} y1={top + floors * fh} x2={x0 - 14} y2={top + floors * fh - vine * (floors - 1) * fh} stroke={C.leaf} strokeWidth={8} strokeLinecap="round" />
      {Array.from({length: 18}).map((_, i) => { const y = top + floors * fh - 20 - i * 34; const k = clamp(vine * 18 - i); const side = i % 2 ? 1 : -1;
        return <ellipse key={i} cx={x0 - 14 + side * 20} cy={y} rx={20 * k} ry={12 * k} fill={i % 3 ? C.leaf2 : C.leaf} transform={`rotate(${side * 30} ${x0 - 14 + side * 20} ${y})`} />; })}
    </Svg>
    <Chip text="De l'eau, de l'entretien" delay={at(0.42)} top={1530} icon={<Icon kind="drop" size={64} />} />
    <Chip text="Pour le bas : des murs végétalisés" delay={at(0.68)} top={1660} bg={C.leaf} color="#fff" />
  </AbsoluteFill>);
};

// 9. Limite 3 : la gentrification verte (Anguelovski et al. 2022)
export const S9: React.FC = () => {
  const at = useAt();
  const trees = useLin(at(0.12), at(0.4)); const tag = useIn(at(0.46)); const up = useLin(at(0.5), at(0.68));
  const go = useLin(at(0.72), at(0.98));
  return (<AbsoluteFill style={{background: C.cream}}>
    <Kicker text="LE PIÈGE" color={C.orange} />
    <Title lines={[{t: 'La gentrification'}, {t: 'verte.', c: C.greenD}]} size={100} delay={2} />
    <Svg>
      <Ground y={1460} />
      {[{x: 60, w: 260, h: 520}, {x: 400, w: 280, h: 640}, {x: 760, w: 260, h: 560}].map((t, i) => <Tower key={i} {...t} base={1460} seed={20 + i} green={1} />)}
      {[340, 720].map((x, i) => { const k = Easing.out(Easing.cubic)(clamp(trees * 1.4 - i * 0.4)); return (<g key={x}>
        <rect x={x + 10} y={1460 - 150 * k} width={20} height={150 * k} fill="#7A5A3A" />
        <circle cx={x + 20} cy={1460 - 170 * k} r={70 * k} fill={C.leaf} /><circle cx={x - 20} cy={1460 - 130 * k} r={44 * k} fill={C.leaf2} />
      </g>); })}
      <g opacity={tag} transform={`translate(560 ${640 - up * 90})`}>
        <path d="M0 0 H260 L320 60 L260 120 H0 Z" fill={C.orange} /><circle cx={262} cy={60} r={12} fill={C.cream} />
        <text x={120} y={80} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={56} fill="#fff">LOYER</text>
        <path d="M-60 120 V20 M-90 50 L-60 15 L-30 50" stroke={C.orange} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={up} />
      </g>
      {[0, 1, 2].map((i) => { const x = 220 + i * 120 + go * 900; return (<g key={i} opacity={(1 - go) * clamp(go * 8)} transform={`translate(${x} ${i === 1 ? 1500 : 1560})`}>
        <rect x={0} y={0} width={110} height={90} rx={6} fill="#C99A5E" /><rect x={45} y={0} width={20} height={90} fill="#E3C79A" />
      </g>); })}
    </Svg>
    <Para top={1680} delay={at(0.74)} size={42}>Les loyers montent… les plus modestes partent.</Para>
    <Source text="Source : Anguelovski et al. (2022)" />
  </AbsoluteFill>);
};

// 10. « Ces toits doivent se faire avec les habitants. Pas à leur place. »
export const S10: React.FC = () => {
  const at = useAt();
  const lit = useLin(at(0.05), at(0.6)); const signs = useIn(at(0.45));
  return (<AbsoluteFill style={{background: '#F6E4CF'}}>
    <Title lines={[{t: 'Avec'}, {t: 'les habitants.', c: C.greenD}]} size={110} delay={2} />
    <Para top={560} delay={at(0.5)} size={52} weight={700}>Pas à leur place.</Para>
    <Svg>
      <Ground y={1640} />
      <Tower x={230} w={620} h={820} base={1640} seed={33} green={1} lit={lit} />
      {[330, 540, 750].map((x, i) => (<g key={x} opacity={signs} transform={`translate(${x} ${820 - 10 + (1 - signs) * 20})`}>
        <rect x={-5} y={-10} width={10} height={70} fill={C.ink} />
        <rect x={-95} y={-80} width={190} height={74} rx={10} fill="#fff" stroke={C.ink} strokeWidth={5} />
        <text x={0} y={-33} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={30} fill={C.greenD}>{['NOTRE TOIT', 'ON DÉCIDE', 'ENSEMBLE'][i]}</text>
      </g>))}
    </Svg>
  </AbsoluteFill>);
};

// 11. Conclusion
export const S11: React.FC = () => {
  const at = useAt();
  const qa: [string, string, string, number, number][] = [
    ['Qui pollue ?', 'Les plus riches.', C.orange, 0.0, 0.1],
    ['Qui souffre ?', 'Les plus pauvres.', C.cream, 0.22, 0.32],
    ['Qui agit ?', 'Peut-être nous.', C.green, 0.45, 0.62],
  ];
  const end = useIn(at(0.85));
  return (<AbsoluteFill style={{background: C.night}}>
    {qa.map(([q, a, c, tq, ta], i) => (<React.Fragment key={i}>
      <Title lines={[{t: q, c: 'rgba(243,237,226,.6)'}]} delay={at(tq) + 2} size={74} top={360 + i * 380} />
      <Title lines={[{t: a, c}]} delay={at(ta)} size={100} top={450 + i * 380} />
    </React.Fragment>))}
    <div style={{position: 'absolute', top: 1560, width: W, textAlign: 'center', fontFamily: 'Rubik', fontWeight: 700, fontSize: 30, letterSpacing: 5, color: C.green, opacity: end}}>TOITS VERTS CONTRE LES 1 %</div>
    <div style={{position: 'absolute', top: 1610, width: W, textAlign: 'center', fontFamily: 'Rubik', fontWeight: 500, fontSize: 30, color: 'rgba(243,237,226,.6)', opacity: end}}>Épisode 4/4</div>
  </AbsoluteFill>);
};

export const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11];
