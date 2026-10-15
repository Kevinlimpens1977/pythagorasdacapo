import React from 'react';
import {
  AbsoluteFill, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { Audio } from '@remotion/media';
import { TEKSTFONT } from './fonts';

// Rondleidingsvideo voor collega's en MT (okt 2026). Stijl: de HELIX-leeromgeving
// (src/styles/leeromgeving.css), niet het slide-designsysteem. Script en stemmen
// staan in public/rondleiding/script.json en public/rondleiding/audio/.

const FPS = 30;
const LO = {
  papier: '#FFFBF4',
  papier2: '#FFF3DC',
  kaart: '#FFFFFF',
  inkt: '#0B0D0F',
  grijs: '#5B5648',
  lijn: '#EADFC9',
  geel: '#FFD33D',
  geelZacht: '#FFF1B8',
  blauw: '#087EB5',
  blauwZacht: '#E1F0F8',
  groen: '#2E9D63',
  groenZacht: '#DFF2E7',
  oranje: '#F47A20',
};

// Duur van elke opname in seconden (ffprobe).
const DUUR: Record<string, number> = {
  s1: 14.32, s2: 9.68, s3: 17.84, s4: 11.6, s5: 9.6, s5b: 9.04,
  s6a: 3.36, s6b: 1.12, s6c: 1.92, s6d: 3.68,
  s7: 10.64, s8: 9.6, s8b: 8.08, s9: 14.96, s10: 13.6,
};

type Regel = { id: string; tekst: string; ondertitel?: string; spreker?: string };
const REGELS: Record<string, Regel> = {
  s1: { id: 's1', tekst: 'Dit is HELIX: de digitale leeromgeving die ik zelf bouw. Geen boek, maar lessen en feedback op maat. Ik laat zien hoe ik er elke dag mee differentieer: in twee vakken, op verschillende niveaus, en in klassen waar leerlingen nog Nederlands leren.' },
  s2: { id: 's2', tekst: 'Ik geef Digitale vaardigheden aan de vmbo-brugklassen, van basis en kader tot TL en de inclusieklas. En BiNaSk in EOA leerroute 3.' },
  s3: { id: 's3', tekst: 'Digitale vaardigheden volgt de SLO-kerndoelen. Alle domeinen komen aan bod: hoe je computer werkt, informatie checken, data, AI, veiligheid, programmeren, en wat technologie met jou en de samenleving doet. Ik ontwikkel de lessen zelf. Een lesboek heb ik niet nodig.' },
  s4: { id: 's4', tekst: 'Ik schrijf de lesstof voor onze vmbo-leerlingen. Lastige techniek koppel ik aan iets wat ze kennen: een computer werkt als een keuken. De kok is de processor, het aanrecht het werkgeheugen.' },
  s5: { id: 's5', tekst: 'Voor de inclusieklas maak ik een eigen versie: kortere zinnen, minder tekst, meer korte filmpjes, en vaker waar of niet waar in plaats van open vragen.' },
  s5b: { id: 's5b', tekst: 'Practica bouw ik als spel. De leerling weegt een voorwerp, dompelt het onder, rekent de dichtheid uit en zoekt in een tabel op welke stof het is.' },
  s6a: { id: 's6a', tekst: 'Met de taalknop lees ik alles ook in mijn eigen taal.', spreker: 'Sami' },
  s6b: { id: 's6b', tekst: 'Я теж!', ondertitel: 'Ik ook!', spreker: 'Klasgenoot uit Oekraïne' },
  s6c: { id: 's6c', tekst: 'نعم، هذا صحيح!', ondertitel: 'Ja, dat klopt!', spreker: 'Klasgenoot, Arabisch' },
  s6d: { id: 's6d', tekst: 'Kesinlikle! Hem Felemenkçe hem de fen öğreniyorum.', ondertitel: 'Inderdaad! Ik leer Nederlands, en ook BiNaSk.', spreker: 'Klasgenoot uit Turkije' },
  s7: { id: 's7', tekst: 'Per klas zet ik klaar wat zichtbaar is, tot op één leerling. Zo werkt iedereen op zijn eigen niveau en in zijn eigen tempo. Wie vastloopt krijgt herhaling, wie klaar is gaat een stap verder.' },
  s8: { id: 's8', tekst: 'Ik beloon beheersing, niet tijd: met XP, met tokens voor hun avatar en hun maatje, en met complimentjes van klasgenoten. Er is geen ranglijst.' },
  s8b: { id: 's8b', tekst: 'Oefenen mag ook als spel: typen, begrippen, en in KlimBit klimmen ze langs echte opdrachten, zoals de juiste stekker kiezen.' },
  s9: { id: 's9', tekst: 'In Voortgang zie ik per leerling hoe ver hij is en waar hij vastloopt. Dan vraag ik de AI: zet voor deze leerling zijn foute vragen uit hoofdstuk 1 tot en met 5 klaar. Hij krijgt een herhaalblad met de theorie erbij, en een oefenspel, alleen voor hem.' },
  s10: { id: 's10', tekst: 'De lessen bouw ik samen met AI: wij bedenken, de AI bouwt in mijn vaste opbouw, en ik controleer. Zo leren mijn leerlingen niet alleen digitale vaardigheden, maar ook samenwerken, kritisch denken en zelfstandig werken.' },
};

type SceneDef = { id: string; regels: string[]; voor?: number; na?: number; vast?: number };
const SCENES: SceneDef[] = [
  { id: 'intro', regels: [], vast: 7.2 },
  { id: 'opening', regels: ['s1'] },
  { id: 'vakken', regels: ['s2'] },
  { id: 'kerndoelen', regels: ['s3'] },
  { id: 'keuken', regels: ['s4'] },
  { id: 'inclusie', regels: ['s5'] },
  { id: 'dichtheid', regels: ['s5b'], na: 1.2 },
  { id: 'taal', regels: ['s6a', 's6b', 's6c', 's6d'], na: 1.4 },
  { id: 'klaarzetten', regels: ['s7'] },
  { id: 'belonen', regels: ['s8'] },
  { id: 'spellen', regels: ['s8b'], na: 1.2 },
  { id: 'voortgang', regels: ['s9'], na: 2.4 },
  { id: 'bouwen', regels: ['s10'], na: 1.6 },
  { id: 'outro', regels: [], vast: 8 },
];

type Geplande = { id: string; start: number; duur: number; regels: { id: string; start: number; duur: number }[] };
const f = (s: number) => Math.round(s * FPS);

export function bouwPlanning() {
  let t = 0;
  const scenes: Geplande[] = [];
  for (const s of SCENES) {
    const start = t;
    const regels: Geplande['regels'] = [];
    if (s.vast) {
      t += f(s.vast);
    } else {
      t += f(s.voor ?? 0.5);
      s.regels.forEach((id, i) => {
        if (i > 0) t += f(id.startsWith('s6') ? 0.35 : 0.5);
        regels.push({ id, start: t - start, duur: f(DUUR[id]) });
        t += f(DUUR[id]);
      });
      t += f(s.na ?? 0.9);
    }
    scenes.push({ id: s.id, start, duur: t - start, regels });
  }
  return { scenes, totaal: t };
}

export const RONDLEIDING_DUUR = bouwPlanning().totaal;

// ---------- bouwstenen ----------

const schaduw = '0 2px 0 rgba(11,13,15,0.04), 0 18px 40px rgba(60,40,10,0.12)';

function useIn(vanaf = 0, duur = 18) {
  const frame = useCurrentFrame();
  return interpolate(frame, [vanaf, vanaf + duur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
}

function Veer({ vanaf = 0, children, style, van = 30 }: { vanaf?: number; children: React.ReactNode; style?: React.CSSProperties; van?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - vanaf, fps, config: { damping: 16, stiffness: 120 } });
  return (
    <div style={{ ...style, opacity: Math.min(1, Math.max(0, p * 1.4)), transform: `translateY(${(1 - p) * van}px) ${style?.transform ?? ''}` }}>
      {children}
    </div>
  );
}

function HBlok({ tekst, maat = 56, kleur = LO.geel }: { tekst: string; maat?: number; kleur?: string }) {
  return (
    <div style={{
      width: maat, height: maat, borderRadius: maat * 0.24, background: kleur, border: `${Math.max(3, maat * 0.06)}px solid ${LO.inkt}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: maat * 0.42, color: LO.inkt, flex: 'none',
    }}>{tekst}</div>
  );
}

function Pil({ children, kleur = 'geel', style }: { children: React.ReactNode; kleur?: 'geel' | 'groen' | 'blauw' | 'wit'; style?: React.CSSProperties }) {
  const k = {
    geel: { bg: LO.geelZacht, fg: LO.inkt, rand: '#E9C94A' },
    groen: { bg: LO.groenZacht, fg: '#1E6B43', rand: '#A9DABF' },
    blauw: { bg: LO.blauwZacht, fg: '#065E88', rand: '#A8D3EA' },
    wit: { bg: LO.kaart, fg: LO.inkt, rand: LO.lijn },
  }[kleur];
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 12, padding: '14px 26px', borderRadius: 999, background: k.bg, color: k.fg,
      border: `2px solid ${k.rand}`, fontWeight: 700, fontSize: 32, whiteSpace: 'nowrap', boxShadow: '0 6px 16px rgba(60,40,10,0.08)', ...style,
    }}>{children}</div>
  );
}

function Vinkje({ maat = 40, aan = 1 }: { maat?: number; aan?: number }) {
  return (
    <svg width={maat} height={maat} viewBox="0 0 40 40" style={{ flex: 'none', transform: `scale(${0.6 + 0.4 * aan})`, opacity: aan }}>
      <circle cx="20" cy="20" r="19" fill={LO.groen} />
      <path d="M11 20.5 L17.5 27 L29 14" stroke="#fff" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Kop({ nummer, titel, vanaf = 0 }: { nummer: string; titel: string; vanaf?: number }) {
  const p = useIn(vanaf, 16);
  return (
    <div style={{ position: 'absolute', left: 96, top: 64, display: 'flex', alignItems: 'center', gap: 22, opacity: p, transform: `translateX(${(1 - p) * -30}px)` }}>
      <HBlok tekst={nummer} maat={64} />
      <div style={{ fontSize: 46, fontWeight: 700, color: LO.inkt, letterSpacing: -0.5 }}>{titel}</div>
    </div>
  );
}

// Een echt scherm in een venster, met een rustige zoom (Ken Burns).
type Kader = { s: number; x: number; y: number };
function Scherm({
  src, x, y, w, van = { s: 1, x: 0.5, y: 0.5 }, naar, vanaf = 0, duur = 300, verschijn = 0, maskers = [], label, children,
}: {
  src: string; x: number; y: number; w: number; van?: Kader; naar?: Kader; vanaf?: number; duur?: number; verschijn?: number;
  maskers?: { x: number; y: number; w: number; h: number }[]; label?: string; children?: React.ReactNode;
}) {
  const frame = useCurrentFrame();
  const h = (w * 9) / 16;
  const t = interpolate(frame, [vanaf, vanaf + duur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const doel = naar ?? van;
  const s = van.s + (doel.s - van.s) * t;
  const cx = van.x + (doel.x - van.x) * t;
  const cy = van.y + (doel.y - van.y) * t;
  const p = spring({ frame: frame - verschijn, fps: FPS, config: { damping: 18, stiffness: 110 } });
  const tx = -(cx * w * s - w / 2);
  const ty = -(cy * h * s - h / 2);
  const klem = (v: number, min: number) => Math.min(0, Math.max(min, v));
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 22, overflow: 'hidden', background: LO.kaart,
      border: `2px solid ${LO.lijn}`, boxShadow: schaduw, opacity: Math.min(1, p * 1.3), transform: `translateY(${(1 - p) * 40}px) scale(${0.96 + 0.04 * p})`,
    }}>
      <div style={{ position: 'absolute', left: klem(tx, w - w * s), top: klem(ty, h - h * s), width: w * s, height: h * s }}>
        <Img src={staticFile(`rondleiding/schermen/${src}`)} style={{ width: '100%', height: '100%', display: 'block' }} />
        {maskers.map((m, i) => (
          <div key={i} style={{ position: 'absolute', left: `${(m.x / 1920) * 100}%`, top: `${(m.y / 1080) * 100}%`, width: `${(m.w / 1920) * 100}%`, height: `${(m.h / 1080) * 100}%`, background: LO.papier }} />
        ))}
        {children}
      </div>
      {label && (
        <div style={{ position: 'absolute', left: 18, top: 18 }}><Pil kleur="wit" style={{ fontSize: 26, padding: '8px 18px' }}>{label}</Pil></div>
      )}
    </div>
  );
}

// ---------- ondertitels ----------

function knip(tekst: string, max = 64) {
  const woorden = tekst.split(' ');
  const delen: string[] = [];
  let huidig = '';
  for (const w of woorden) {
    const kandidaat = huidig ? `${huidig} ${w}` : w;
    const eindeZin = /[.:!?]$/.test(huidig) && huidig.length > max * 0.45;
    if ((kandidaat.length > max && huidig) || eindeZin) {
      delen.push(huidig);
      huidig = w;
    } else {
      huidig = kandidaat;
    }
  }
  if (huidig) delen.push(huidig);
  return delen;
}

function Ondertitel({ regel, duur }: { regel: Regel; duur: number }) {
  const frame = useCurrentFrame();
  const vreemd = Boolean(regel.ondertitel);
  const delen = vreemd ? [regel.tekst] : knip(regel.tekst);
  const totaal = delen.reduce((n, d) => n + d.length, 0);
  let acc = 0;
  let actief = delen[delen.length - 1];
  for (const d of delen) {
    const eind = ((acc + d.length) / totaal) * duur;
    if (frame < eind) { actief = d; break; }
    acc += d.length;
  }
  const op = interpolate(frame, [0, 5, duur - 2, duur + 6], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 46, display: 'flex', justifyContent: 'center', opacity: op }}>
      <div style={{
        maxWidth: 1500, padding: '14px 30px', borderRadius: 18, background: 'rgba(11,13,15,0.82)', color: '#fff', textAlign: 'center',
        fontSize: 38, lineHeight: 1.3, fontWeight: 700,
      }}>
        {vreemd ? (
          <>
            <div style={{ fontSize: 30, fontWeight: 400, opacity: 0.85, direction: /[؀-ۿ]/.test(regel.tekst) ? 'rtl' : 'ltr' }}>{regel.tekst}</div>
            <div>{regel.ondertitel}</div>
          </>
        ) : actief}
      </div>
    </div>
  );
}

// ---------- logo ----------

const PAD_H = 'M180 188H296V288H392V188H510V506H392V408H296V506H180Z';
const LETTERS = [
  'M659 172H908V258H774V316H878V394H774V454H908V539H659Z',
  'M944 172H1069V447H1192V539H944Z',
  'M1231 172H1356V539H1231Z',
  'M1392 172H1533L1580 262L1638 172H1774L1661 355L1771 539H1632L1580 451L1528 539H1384L1496 355Z',
];

function Logo({ frame, breed = 1100, samensmelten = false, statisch = false }: { frame: number; breed?: number; samensmelten?: boolean; statisch?: boolean }) {
  if (statisch) {
    return (
      <svg viewBox="55 60 1890 562" width={breed}>
        <rect x="62" y="68" width="566" height="547" rx="86" fill={LO.inkt} />
        <rect x="103" y="110" width="484" height="465" rx="50" fill={LO.geel} />
        <path d={PAD_H} fill={LO.inkt} />
        {LETTERS.map((d) => <path key={d} d={d} fill={LO.inkt} stroke={LO.inkt} strokeWidth={8} strokeLinejoin="round" />)}
        <circle cx="1855" cy="470" r="83" fill={LO.blauw} />
      </svg>
    );
  }
  const blok = spring({ frame, fps: FPS, config: { damping: 9, stiffness: 140, mass: 0.8 } });
  const letter = (i: number) => spring({ frame: frame - 18 - i * 5, fps: FPS, config: { damping: 14, stiffness: 140 } });
  const stipStart = 48;
  const smelt = samensmelten ? interpolate(frame, [95, 125], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) }) : 0;
  const stippen = [1852, 1966, 2080].map((cx, i) => {
    const p = interpolate(frame, [stipStart + i * 4, stipStart + 10 + i * 4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const golf = Math.sin(((frame - stipStart) / 26) * Math.PI * 2 - i * 0.9);
    const dy = frame > stipStart + 12 ? Math.min(0, golf) * 34 * (1 - smelt) : 0;
    const x = cx + (1855 - cx) * smelt;
    const y = 495 + (470 - 495) * smelt + dy;
    const r = 46 + (83 - 46) * smelt;
    return <circle key={cx} cx={x} cy={y} r={r * p} fill={LO.blauw} opacity={0.6 + 0.4 * Math.max(-golf, 0) + 0.4 * smelt} />;
  });
  return (
    <svg viewBox="55 60 2080 562" width={breed} style={{ overflow: 'visible' }}>
      <g style={{ transformOrigin: '345px 342px', transformBox: 'view-box' }} transform={`translate(345 342) scale(${blok}) translate(-345 -342)`}>
        <rect x="62" y="68" width="566" height="547" rx="86" fill={LO.inkt} />
        <rect x="103" y="110" width="484" height="465" rx="50" fill={LO.geel} />
        <path d={PAD_H} fill={LO.inkt} />
      </g>
      {LETTERS.map((d, i) => {
        const p = letter(i);
        return <path key={i} d={d} fill={LO.inkt} stroke={LO.inkt} strokeWidth={8} strokeLinejoin="round" opacity={Math.min(1, p * 1.5)} transform={`translate(${(1 - p) * -60} 0)`} />;
      })}
      {stippen}
    </svg>
  );
}

// ---------- scènes ----------

function Intro() {
  const frame = useCurrentFrame();
  const uit = interpolate(frame, [180, 216], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: uit }}>
      <Logo frame={frame} breed={1150} />
      <div style={{ marginTop: 40, fontSize: 40, color: LO.grijs, opacity: useIn(70, 20) }}>Zo bied ik elke dag maatwerk</div>
    </AbsoluteFill>
  );
}

function BoekIcoon({ maat = 160, streep = 0 }: { maat?: number; streep?: number }) {
  return (
    <svg width={maat} height={maat} viewBox="0 0 24 24" fill="none" stroke={LO.inkt} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z" fill={LO.geelZacht} />
      <path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z" fill={LO.geelZacht} />
      {streep > 0 && <path d={`M3 3 L${3 + 18 * streep} ${3 + 18 * streep}`} stroke="#D83A2E" strokeWidth={2.4} />}
    </svg>
  );
}

function Opening({ duur }: { duur: number }) {
  const frame = useCurrentFrame();
  const boekWeg = interpolate(frame, [90, 130], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 96, top: 50, opacity: useIn(0, 14) }}><Logo frame={200} breed={300} statisch /></div>
      <div style={{ position: 'absolute', left: 96, top: 250, width: 640 }}>
        <Veer vanaf={10}><div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.08, color: LO.inkt }}>Geen boek, maar lessen en feedback op maat</div></Veer>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 44, alignItems: 'flex-start' }}>
          <Veer vanaf={250}><Pil kleur="blauw">Twee vakken</Pil></Veer>
          <Veer vanaf={275}><Pil kleur="blauw">Verschillende niveaus</Pil></Veer>
          <Veer vanaf={305}><Pil kleur="blauw">Klassen die Nederlands leren</Pil></Veer>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1190, top: 330, opacity: 1 - boekWeg, transform: `translateX(${boekWeg * 500}px) rotate(${boekWeg * 18}deg)` }}>
        <Veer vanaf={40}><BoekIcoon maat={260} streep={interpolate(frame, [60, 85], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} /></Veer>
      </div>
      <Scherm src="leerling-start.png" x={800} y={230} w={1030} verschijn={120} vanaf={130} duur={duur - 130}
        van={{ s: 1, x: 0.5, y: 0.5 }} naar={{ s: 1.35, x: 0.38, y: 0.45 }} maskers={[{ x: 340, y: 196, w: 600, h: 36 }]} label="Leerling" />
    </AbsoluteFill>
  );
}

function Vakken() {
  const labels = ['Basis', 'Kader', 'TL', 'Inclusie'];
  return (
    <AbsoluteFill>
      <Kop nummer="1" titel="Twee vakken, alle niveaus" />
      <Veer vanaf={6} style={{ position: 'absolute', left: 96, top: 230, width: 1000, height: 560 }}>
        <div style={{ background: LO.kaart, borderRadius: 28, padding: 56, boxShadow: schaduw, border: `2px solid ${LO.lijn}`, height: 560, boxSizing: 'border-box' }}>
          <div style={{ fontSize: 30, color: LO.blauw, fontWeight: 700, letterSpacing: 2 }}>VMBO-BRUGKLASSEN</div>
          <div style={{ fontSize: 76, fontWeight: 700, marginTop: 12 }}>Digitale vaardigheden</div>
          <div style={{ display: 'flex', gap: 18, marginTop: 60, flexWrap: 'wrap' }}>
            {labels.map((l, i) => <Veer key={l} vanaf={40 + i * 22}><Pil kleur={l === 'Inclusie' ? 'groen' : 'geel'} style={{ fontSize: 40, padding: '18px 34px' }}>{l}</Pil></Veer>)}
          </div>
        </div>
      </Veer>
      <Veer vanaf={190} style={{ position: 'absolute', left: 1140, top: 230, width: 684 }}>
        <div style={{ background: LO.kaart, borderRadius: 28, padding: 56, boxShadow: schaduw, border: `2px solid ${LO.lijn}`, height: 560, boxSizing: 'border-box' }}>
          <div style={{ fontSize: 30, color: LO.blauw, fontWeight: 700, letterSpacing: 2 }}>EOA</div>
          <div style={{ fontSize: 76, fontWeight: 700, marginTop: 12 }}>BiNaSk</div>
          <div style={{ marginTop: 60 }}><Pil kleur="blauw" style={{ fontSize: 40, padding: '18px 34px' }}>EOA leerroute 3</Pil></div>
        </div>
      </Veer>
    </AbsoluteFill>
  );
}

function Kerndoelen({ duur }: { duur: number }) {
  const frame = useCurrentFrame();
  const domeinen = ['Digitale systemen', 'Media en informatie', 'Data', 'AI', 'Creëren', 'Programmeren', 'Veiligheid en privacy', 'Jezelf en de ander', 'Samenleving en wereld'];
  const vinkStart = 120;
  const stap = Math.max(14, Math.floor((duur - vinkStart - 150) / 9));
  return (
    <AbsoluteFill>
      <Kop nummer="2" titel="Alle SLO-kerndoelen, zelf ontwikkeld" />
      <div style={{ position: 'absolute', left: 96, top: 210, width: 1300, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
        {domeinen.map((d, i) => {
          const aan = interpolate(frame, [vinkStart + i * stap, vinkStart + i * stap + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <Veer key={d} vanaf={8 + i * 5}>
              <div style={{
                height: 170, borderRadius: 24, background: aan > 0.5 ? LO.groenZacht : LO.kaart, border: `2px solid ${aan > 0.5 ? '#A9DABF' : LO.lijn}`,
                boxShadow: schaduw, padding: '0 30px', display: 'flex', alignItems: 'center', gap: 22, boxSizing: 'border-box',
              }}>
                <HBlok tekst={String(i + 1)} maat={58} />
                <div style={{ fontSize: 36, fontWeight: 700, flex: 1 }}>{d}</div>
                <Vinkje maat={46} aan={aan} />
              </div>
            </Veer>
          );
        })}
      </div>
      <Veer vanaf={duur - 140} style={{ position: 'absolute', left: 1440, top: 330, width: 384 }}>
        <div style={{ background: LO.kaart, borderRadius: 28, padding: 40, boxShadow: schaduw, border: `2px solid ${LO.lijn}`, textAlign: 'center' }}>
          <BoekIcoon maat={150} streep={1} />
          <div style={{ fontSize: 40, fontWeight: 700, marginTop: 14 }}>Zelf ontwikkeld</div>
          <div style={{ fontSize: 32, color: LO.grijs, marginTop: 6 }}>geen lesboek</div>
        </div>
      </Veer>
    </AbsoluteFill>
  );
}

function Keuken({ duur }: { duur: number }) {
  const koppels = [['Kok', 'processor'], ['Aanrecht', 'werkgeheugen'], ['Voorraadkast', 'opslag']];
  return (
    <AbsoluteFill>
      <Kop nummer="3" titel="Geschreven voor vmbo-leerlingen" />
      <Scherm src="les-keuken.png" x={96} y={200} w={1180} vanaf={20} duur={duur - 20} van={{ s: 1, x: 0.5, y: 0.5 }} naar={{ s: 1.45, x: 0.6, y: 0.33 }} label="Les H2 · basis" />
      <div style={{ position: 'absolute', left: 1330, top: 260, display: 'flex', flexDirection: 'column', gap: 26 }}>
        {koppels.map(([a, b], i) => (
          <Veer key={a} vanaf={150 + i * 40}>
            <div style={{ background: LO.kaart, borderRadius: 24, padding: '24px 30px', boxShadow: schaduw, border: `2px solid ${LO.lijn}`, width: 494, boxSizing: 'border-box' }}>
              <div style={{ fontSize: 42, fontWeight: 700 }}>{a}</div>
              <div style={{ fontSize: 34, color: LO.blauw, fontWeight: 700 }}>= {b}</div>
            </div>
          </Veer>
        ))}
      </div>
    </AbsoluteFill>
  );
}

function Inclusie({ duur }: { duur: number }) {
  const frame = useCurrentFrame();
  const labels = ['Kortere zinnen', 'Minder tekst', 'Korte filmpjes', 'Waar of niet waar'];
  const wissel = interpolate(frame, [duur * 0.62, duur * 0.62 + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <Kop nummer="4" titel="Dezelfde les, eigen versie voor inclusie" />
      <Scherm src="les-keuken.png" x={96} y={200} w={850} label="Basis" van={{ s: 1.25, x: 0.6, y: 0.35 }} />
      <div style={{ opacity: 1 - wissel }}>
        <Scherm src="les-keuken-inclusie.png" x={974} y={200} w={850} verschijn={20} label="Inclusie" van={{ s: 1.25, x: 0.6, y: 0.35 }} />
      </div>
      <div style={{ opacity: wissel }}>
        <Scherm src="les-inclusie-check.png" x={974} y={200} w={850} label="Inclusie" van={{ s: 1.25, x: 0.6, y: 0.4 }} />
      </div>
      <div style={{ position: 'absolute', left: 96, right: 96, top: 720, display: 'flex', gap: 22, justifyContent: 'center' }}>
        {labels.map((l, i) => <Veer key={l} vanaf={60 + i * 26}><Pil kleur="groen">{l}</Pil></Veer>)}
      </div>
    </AbsoluteFill>
  );
}

function Dichtheid({ duur }: { duur: number }) {
  const frame = useCurrentFrame();
  const stappen = [
    ['dichtheid-1-wegen.png', 'Wegen'],
    ['dichtheid-2-onderdompelen.png', 'Onderdompelen'],
    ['dichtheid-3-rekenen.png', 'Uitrekenen'],
    ['dichtheid-4-tabel.png', 'Opzoeken'],
  ];
  const deel = (duur - 40) / 4;
  const huidig = Math.min(3, Math.floor(Math.max(0, frame - 10) / deel));
  return (
    <AbsoluteFill>
      <Kop nummer="5" titel="Practica als spel · BiNaSk" />
      {stappen.map(([src], i) => {
        const op = interpolate(frame, [10 + i * deel - 8, 10 + i * deel + 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return <div key={src} style={{ opacity: i === 0 ? 1 : op }}><Scherm src={src} x={96} y={200} w={1300} van={{ s: 1.08, x: 0.4, y: 0.4 }} /></div>;
      })}
      <div style={{ position: 'absolute', left: 1440, top: 230, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {stappen.map(([, naam], i) => (
          <Veer key={naam} vanaf={6 + i * 8}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 20, padding: '20px 26px', borderRadius: 22, width: 384, boxSizing: 'border-box',
              background: i === huidig ? LO.geelZacht : LO.kaart, border: `2px solid ${i === huidig ? LO.inkt : LO.lijn}`, boxShadow: schaduw,
            }}>
              <HBlok tekst={String(i + 1)} maat={54} />
              <div style={{ fontSize: 36, fontWeight: 700, flex: 1 }}>{naam}</div>
              {i < huidig && <Vinkje maat={38} />}
            </div>
          </Veer>
        ))}
      </div>
    </AbsoluteFill>
  );
}

function Vlag({ soort }: { soort: 'nl' | 'ua' | 'tr' | 'ar' }) {
  const w = 72; const h = 48;
  const rand = { borderRadius: 8, overflow: 'hidden' as const, border: `2px solid ${LO.inkt}`, width: w, height: h, display: 'flex', flexDirection: 'column' as const };
  if (soort === 'nl') return <div style={rand}><div style={{ flex: 1, background: '#AE1C28' }} /><div style={{ flex: 1, background: '#fff' }} /><div style={{ flex: 1, background: '#21468B' }} /></div>;
  if (soort === 'ua') return <div style={rand}><div style={{ flex: 1, background: '#0057B7' }} /><div style={{ flex: 1, background: '#FFD700' }} /></div>;
  if (soort === 'tr') {
    return (
      <div style={{ ...rand, background: '#E30A17', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="40" height="30" viewBox="0 0 40 30"><circle cx="15" cy="15" r="9" fill="#fff" /><circle cx="17.5" cy="15" r="7.2" fill="#E30A17" /><polygon points="26,15 30.5,13.4 30.5,16.6" fill="#fff" /><circle cx="28" cy="15" r="2.6" fill="#fff" /></svg>
      </div>
    );
  }
  return <div style={{ ...rand, background: LO.groen, color: '#fff', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700 }}>ع</div>;
}

function Taal({ planning }: { planning: Geplande }) {
  const frame = useCurrentFrame();
  const sprekers: { id: string; naam: string; src: string; vlag: 'nl' | 'ua' | 'tr' | 'ar'; taal: string }[] = [
    { id: 's6a', naam: 'Sami', src: 'sami/blij.png', vlag: 'nl', taal: 'Nederlands' },
    { id: 's6b', naam: 'Klasgenoot', src: 'klasgenoten/oekraiens-vrij.png', vlag: 'ua', taal: 'Oekraïens' },
    { id: 's6c', naam: 'Klasgenoot', src: 'klasgenoten/arabisch-vrij.png', vlag: 'ar', taal: 'Arabisch' },
    { id: 's6d', naam: 'Klasgenoot', src: 'klasgenoten/turks-vrij.png', vlag: 'tr', taal: 'Turks' },
  ];
  const actief = planning.regels.find((r) => frame >= r.start - 4 && frame < r.start + r.duur + 6)?.id;
  const naArabisch = planning.regels.find((r) => r.id === 's6c');
  const toonAr = naArabisch ? interpolate(frame, [naArabisch.start - 10, naArabisch.start + 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  return (
    <AbsoluteFill>
      <Kop nummer="6" titel="De taalknop: lezen in je eigen taal" />
      <Scherm src="les-taalknop-oekraiens.png" x={96} y={210} w={1000} van={{ s: 1.3, x: 0.62, y: 0.3 }} label="Українська" />
      <div style={{ opacity: toonAr }}>
        <Scherm src="les-taalknop-arabisch.png" x={96} y={210} w={1000} van={{ s: 1.3, x: 0.62, y: 0.3 }} label="العربية" />
      </div>
      <div style={{ position: 'absolute', left: 1130, top: 210, width: 694, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {sprekers.map((s, i) => {
          const is = actief === s.id;
          return (
            <Veer key={s.id} vanaf={8 + i * 8}>
              <div style={{
                height: 300, borderRadius: 26, background: is ? LO.geelZacht : LO.kaart, border: `${is ? 4 : 2}px solid ${is ? LO.inkt : LO.lijn}`,
                boxShadow: schaduw, position: 'relative', overflow: 'hidden', transform: `scale(${is ? 1.03 : 1})`,
              }}>
                <Img src={staticFile(s.src)} style={{ position: 'absolute', left: '50%', bottom: 50, height: 250, transform: 'translateX(-50%)', objectFit: 'contain' }} />
                <div style={{ position: 'absolute', left: 16, top: 16 }}><Vlag soort={s.vlag} /></div>
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 56, background: LO.kaart, borderTop: `2px solid ${LO.lijn}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700 }}>
                  {s.naam} · {s.taal}
                </div>
              </div>
            </Veer>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

function Klaarzetten({ duur }: { duur: number }) {
  return (
    <AbsoluteFill>
      <Kop nummer="7" titel="Klaarzetten, tot op één leerling" />
      <Scherm src="klaarzetten.png" x={96} y={200} w={1300} vanaf={30} duur={duur - 40} van={{ s: 1, x: 0.5, y: 0.5 }} naar={{ s: 1.55, x: 0.52, y: 0.62 }} label="Docent" />
      <div style={{ position: 'absolute', left: 1440, top: 260, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Veer vanaf={60}><Pil kleur="geel">Per klas</Pil></Veer>
        <Veer vanaf={110}><Pil kleur="geel">Per leerling</Pil></Veer>
        <Veer vanaf={170}><Pil kleur="blauw">Eigen niveau</Pil></Veer>
        <Veer vanaf={200}><Pil kleur="blauw">Eigen tempo</Pil></Veer>
        <Veer vanaf={240}><Pil kleur="groen">Herhaling of verdieping</Pil></Veer>
      </div>
    </AbsoluteFill>
  );
}

function Belonen({ duur }: { duur: number }) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Kop nummer="8" titel="Belonen voor beheersing" />
      <Scherm src="leerling-klas-levendig.png" x={96} y={200} w={1120} vanaf={0} duur={duur} van={{ s: 1.25, x: 0.5, y: 0.45 }} naar={{ s: 1.4, x: 0.5, y: 0.62 }} label="Mijn klas" />
      <div style={{ transform: `rotate(${interpolate(frame, [0, duur], [3, 1.5])}deg)` }}>
        <Scherm src="leerling-tokenshop.png" x={1250} y={190} w={574} verschijn={70} van={{ s: 1.5, x: 0.27, y: 0.6 }} label="Tokenshop" />
      </div>
      <div style={{ transform: `rotate(${interpolate(frame, [0, duur], [-2.5, -1])}deg)` }}>
        <Scherm src="leerling-profiel.png" x={1250} y={540} w={574} verschijn={110} van={{ s: 1.6, x: 0.5, y: 0.35 }} label="XP en badges" />
      </div>
      <Veer vanaf={duur - 90} style={{ position: 'absolute', left: 1360, top: 860 }}><Pil kleur="groen" style={{ fontSize: 36 }}>Geen ranglijst</Pil></Veer>
    </AbsoluteFill>
  );
}

function Spellen() {
  const tegels = [
    ['dichtheid-5-uitkomst.png', 'Dichtheid · BiNaSk'],
    ['spel-turbo.png', 'Turbo Typen'],
    ['spel-dvlingo.png', 'DVLingo'],
    ['spel-paco.png', 'PacoPacMan'],
    ['klimbit-usbc.png', 'KlimBit · de juiste stekker'],
    ['klimbit-ai.png', 'KlimBit · AI controleren'],
  ];
  const w = 560;
  return (
    <AbsoluteFill>
      <Kop nummer="9" titel="Oefenen als spel" />
      {tegels.map(([src, label], i) => (
        <Scherm key={src} src={src} x={96 + (i % 3) * (w + 24)} y={190 + Math.floor(i / 3) * ((w * 9) / 16 + 30)} w={w} verschijn={6 + i * 10} label={label}
          van={{ s: 1.05, x: 0.5, y: 0.5 }} naar={{ s: 1.18, x: 0.5, y: 0.5 }} duur={240} />
      ))}
    </AbsoluteFill>
  );
}

const PROMPT = 'Zet voor Leerling A een pdf klaar in zijn account met alle fout beantwoorde vragen uit H1 t/m H5 van Digitale vaardigheden, de verdiepende theorie die erbij hoort, en maak er een didactisch oefenspel van. Gebruik voor opmaak en inhoud mijn HELIX-skill.';

function Voortgang({ duur }: { duur: number }) {
  const frame = useCurrentFrame();
  const typStart = 150;
  const typEind = typStart + 170;
  const tekens = Math.floor(interpolate(frame, [typStart, typEind], [0, PROMPT.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const kaartIn = useIn(typStart - 20, 20);
  const schermWeg = interpolate(frame, [typStart - 30, typStart], [1, 0.25], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const resultaat = typEind + 20;
  return (
    <AbsoluteFill>
      <Kop nummer="10" titel="Analyse per leerling, herstel op maat" />
      <div style={{ opacity: schermWeg }}>
        <Scherm src="voortgang-paragrafen-er3.png" x={96} y={200} w={1300} vanaf={10} duur={130} van={{ s: 1, x: 0.5, y: 0.5 }} naar={{ s: 1.5, x: 0.72, y: 0.35 }} label="Voortgang" />
      </div>
      <div style={{ position: 'absolute', left: 160, top: 260, width: 1600, opacity: kaartIn, transform: `translateY(${(1 - kaartIn) * 30}px)` }}>
        <div style={{ background: LO.kaart, borderRadius: 28, padding: '40px 48px', boxShadow: schaduw, border: `2px solid ${LO.lijn}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <HBlok tekst="AI" maat={56} kleur={LO.blauwZacht} />
            <div style={{ fontSize: 30, color: LO.blauw, fontWeight: 700, letterSpacing: 2 }}>OPDRACHT AAN DE AI</div>
          </div>
          <div style={{ fontSize: 40, lineHeight: 1.4, marginTop: 22, minHeight: 230 }}>
            {PROMPT.slice(0, tekens)}
            <span style={{ opacity: frame % 30 < 15 && tekens < PROMPT.length ? 1 : 0, color: LO.blauw }}>|</span>
          </div>
        </div>
      </div>
      {[['PDF', 'Fouten en verdiepende theorie'], ['Spel', 'Oefenspel met zijn eigen fouten']].map(([kop, uitleg], i) => {
        const p = spring({ frame: frame - resultaat - i * 14, fps: FPS, config: { damping: 15, stiffness: 120 } });
        const vink = interpolate(frame, [resultaat + 40 + i * 14, resultaat + 52 + i * 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <div key={kop} style={{ position: 'absolute', left: 300 + i * 680, top: 700, width: 640, opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 40}px)` }}>
            <div style={{ background: LO.kaart, borderRadius: 24, padding: '26px 30px', boxShadow: schaduw, border: `2px solid ${vink > 0.5 ? '#A9DABF' : LO.lijn}`, display: 'flex', alignItems: 'center', gap: 22 }}>
              <HBlok tekst={kop === 'PDF' ? 'P' : 'S'} maat={60} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 36, fontWeight: 700 }}>{uitleg}</div>
                <div style={{ fontSize: 28, color: LO.groen, fontWeight: 700, opacity: vink }}>Klaargezet voor Leerling A</div>
              </div>
              <Vinkje maat={50} aan={vink} />
            </div>
          </div>
        );
      })}
      <div style={{ display: 'none' }}>{duur}</div>
    </AbsoluteFill>
  );
}

function Bouwen({ duur }: { duur: number }) {
  const frame = useCurrentFrame();
  const stappen = ['Brainstormen', 'Lesplan', 'AI bouwt', 'Ik controleer', 'Klaarzetten'];
  const slot = duur - 120;
  return (
    <AbsoluteFill>
      <Kop nummer="11" titel="Samen met AI bouwen" />
      <div style={{ position: 'absolute', left: 96, right: 96, top: 300, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {stappen.map((s, i) => {
          const aan = interpolate(frame, [30 + i * 40, 42 + i * 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <React.Fragment key={s}>
              <Veer vanaf={6 + i * 10}>
                <div style={{ width: 300, background: aan > 0.5 ? LO.groenZacht : LO.kaart, borderRadius: 26, padding: '30px 20px', boxShadow: schaduw, border: `2px solid ${aan > 0.5 ? '#A9DABF' : LO.lijn}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
                  <HBlok tekst={String(i + 1)} maat={76} />
                  <div style={{ fontSize: 34, fontWeight: 700, textAlign: 'center' }}>{s}</div>
                  <Vinkje maat={44} aan={aan} />
                </div>
              </Veer>
              {i < stappen.length - 1 && <div style={{ fontSize: 50, color: LO.grijs, opacity: useIn(20 + i * 10, 10) }}>›</div>}
            </React.Fragment>
          );
        })}
      </div>
      <Veer vanaf={slot} style={{ position: 'absolute', left: 0, right: 0, top: 700, display: 'flex', justifyContent: 'center', gap: 20 }}>
        <Pil kleur="blauw">Samenwerken</Pil><Pil kleur="blauw">Kritisch denken</Pil><Pil kleur="blauw">Zelfstandig werken</Pil>
      </Veer>
    </AbsoluteFill>
  );
}

function Outro() {
  const frame = useCurrentFrame();
  const stappen = 6;
  const balk = interpolate(frame, [0, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const balkWeg = interpolate(frame, [62, 78], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const logoFrame = Math.max(0, frame - 70);
  const ondertekst = useIn(135, 20);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', top: 470, display: 'flex', gap: 26, opacity: balkWeg }}>
        {Array.from({ length: stappen }, (_, i) => {
          const aan = balk * stappen > i ? 1 : 0;
          return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}><HBlok tekst={String(i + 1)} maat={70} /><Vinkje maat={44} aan={aan} /></div>;
        })}
      </div>
      {frame >= 70 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Logo frame={logoFrame} breed={1100} samensmelten />
          <div style={{ marginTop: 44, fontSize: 44, fontWeight: 700, color: LO.inkt, opacity: ondertekst }}>Elke dag lessen en feedback op maat</div>
        </div>
      )}
    </AbsoluteFill>
  );
}

// ---------- muziek ----------

function muziekVolume(frame: number, planning: ReturnType<typeof bouwPlanning>) {
  const spraak = planning.scenes.flatMap((s) => s.regels.map((r) => [s.start + r.start, s.start + r.start + r.duur]));
  let duck = 0;
  for (const [a, b] of spraak) {
    const v = interpolate(frame, [a - 12, a, b, b + 18], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    duck = Math.max(duck, v);
  }
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const fadeUit = interpolate(frame, [planning.totaal - 60, planning.totaal], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (0.55 - 0.44 * duck) * fadeIn * fadeUit;
}

// ---------- compositie ----------

export const HelixRondleiding: React.FC<{ metMuziek?: boolean }> = ({ metMuziek = true }) => {
  const planning = bouwPlanning();
  return (
    <AbsoluteFill style={{ background: LO.papier, fontFamily: TEKSTFONT, color: LO.inkt }}>
      {metMuziek && <Audio src={staticFile('rondleiding/muziek.mp3')} volume={(f) => muziekVolume(f, planning)} />}
      {planning.scenes.map((s) => (
        <Sequence key={s.id} from={s.start} durationInFrames={s.duur} name={s.id}>
          <SceneInhoud scene={s} />
          {s.regels.map((r) => (
            <Sequence key={r.id} from={r.start} durationInFrames={r.duur + 10} name={r.id}>
              <Audio src={staticFile(`rondleiding/audio/${r.id}.mp3`)} />
              <Ondertitel regel={REGELS[r.id]} duur={r.duur} />
            </Sequence>
          ))}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

function SceneInhoud({ scene }: { scene: Geplande }) {
  const frame = useCurrentFrame();
  const op = scene.id === 'intro' || scene.id === 'outro'
    ? 1
    : interpolate(frame, [0, 10, scene.duur - 10, scene.duur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const d = scene.duur;
  const inhoud = {
    intro: <Intro />,
    opening: <Opening duur={d} />,
    vakken: <Vakken />,
    kerndoelen: <Kerndoelen duur={d} />,
    keuken: <Keuken duur={d} />,
    inclusie: <Inclusie duur={d} />,
    dichtheid: <Dichtheid duur={d} />,
    taal: <Taal planning={scene} />,
    klaarzetten: <Klaarzetten duur={d} />,
    belonen: <Belonen duur={d} />,
    spellen: <Spellen />,
    voortgang: <Voortgang duur={d} />,
    bouwen: <Bouwen duur={d} />,
    outro: <Outro />,
  }[scene.id];
  return <AbsoluteFill style={{ opacity: op }}>{inhoud}</AbsoluteFill>;
}
