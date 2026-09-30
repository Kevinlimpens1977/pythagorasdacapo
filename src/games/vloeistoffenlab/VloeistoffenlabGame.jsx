import { useRef, useState } from 'react';
import { CheckCircle2, Trophy } from 'lucide-react';
import { Knop, Split } from '../volumeBerekenen/componenten/Ui';
import Oefenblad from '../volumeBerekenen/Oefenblad';
import { telCijferOnderdelen, telScore } from '../volumeBerekenen/volumeLogic';
import { speelKlaar } from '../volumeBerekenen/volumeSounds';
import { Binasboek, BoekKnop, BoekProvider } from '../dichtheid/componenten/Binasboek';
import Toren from './componenten/Toren';
import { DoeWegen, KijkWegen } from './MissieWegen';
import MissieToren from './MissieToren';
import { AANTAL_OEFENVRAGEN, maakOefenblad, oefenAntwoordGoed, toonAntwoord } from './vloeistofOefenblad';
import { BOEKJE, TOREN } from './vloeistofLogic';

// Vloeistoffenlab (Binask 2.6, uitdaging, niet verplicht): vloeistoffen wegen
// met aftrekken en met tarra, een dichtheidstoren bouwen en voorspellen waar
// voorwerpen blijven. Daarna een oefenblad. Eén onComplete aan het eind.

const AANTAL_WEGEN = 3;
const MAX_SCORE = (AANTAL_WEGEN + 2 + AANTAL_OEFENVRAGEN) * 10;
const FASE_KLEUR = { KIJK: 'bg-[#087EB5] text-white', DOE: 'bg-[#0B0D0F] text-[#FFD33D]', OEFEN: 'bg-[#F47A20] text-white', KLAAR: 'bg-[#2E9D63] text-white' };

const GELEERD = [
  'Een vloeistof weeg je door af te trekken (vol - leeg) of met tarra (NUL).',
  'In een dichtheidstoren ligt de grootste dichtheid onderop.',
  'Een voorwerp drijft op een laag die zwaarder is, en zweeft in een laag die even zwaar is.'
];

function Schil({ titel, fase, voortgang, children }) {
  return (
    <div className="flex min-h-[560px] flex-col overflow-hidden rounded-2xl border-[3px] border-[#0B0D0F] bg-[#FFF7E8] text-[#0B0D0F] shadow-[6px_6px_0_#0B0D0F]">
      <header className="ds-anchor flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <h2 className="ds-display text-[24px] sm:text-[32px]">{titel}</h2>
        <div className="flex items-center gap-3">
          {voortgang && <span className="text-sm font-bold">{voortgang}</span>}
          {fase && <span className={`rounded-full border-2 border-[#0B0D0F] px-3 py-1 text-sm font-extrabold tracking-wide ${FASE_KLEUR[fase] || ''}`}>{fase}</span>}
          <BoekKnop />
        </div>
      </header>
      <div className="flex-1 p-3 sm:p-5">{children}</div>
    </div>
  );
}

export default function VloeistoffenlabGame({ onStart, onComplete }) {
  const [scherm, setScherm] = useState('start');
  const [opgaven, setOpgaven] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const startedAt = useRef(null);
  const afgerond = useRef(false);

  const begin = () => {
    startedAt.current = new Date().toISOString();
    onStart?.(startedAt.current);
    setScherm('kijk');
  };
  const erbij = (opgave) => setOpgaven((oud) => [...oud, opgave]);
  const wegenKlaar = (opgave) => {
    const nieuw = [...opgaven, opgave];
    setOpgaven(nieuw);
    if (nieuw.filter((o) => o.id.startsWith('wegen')).length >= AANTAL_WEGEN) setScherm('toren');
  };
  const oefenbladKlaar = (oefen) => {
    setOpgaven((oud) => [...oud, ...oefen]);
    speelKlaar();
    setScherm('klaar');
  };
  const rondAf = () => {
    if (afgerond.current) return;
    afgerond.current = true;
    const fouten = {};
    for (const o of opgaven) for (const fout of o.fouten || []) fouten[fout] = (fouten[fout] || 0) + 1;
    onComplete?.({
      score: Math.min(MAX_SCORE, telScore(opgaven)),
      maxScore: MAX_SCORE,
      startedAt: startedAt.current || new Date().toISOString(),
      completedAt: new Date().toISOString(),
      details: {
        opgaven: opgaven.map((o) => ({ id: o.id, punten: o.punten, fouten: o.fouten || [], onderdelen: o.onderdelen || 0, minpunten: o.minpunten || 0 })),
        fouten,
        cijferTelling: telCijferOnderdelen(opgaven)
      }
    });
    setIsFinished(true);
  };

  let titel = 'Vloeistoffenlab';
  let fase = null;
  let voortgang = null;
  let inhoud;

  if (scherm === 'start') {
    inhoud = (
      <Split
        beeld={<Toren lagen={TOREN} />}
        paneel={(
          <>
            <p className="text-sm font-extrabold uppercase tracking-wide text-[#066A99]">Binask 2.6 Uitdaging, niet verplicht</p>
            <p className="text-xl font-extrabold leading-snug">Je weegt vloeistoffen, je bouwt een dichtheidstoren en je voorspelt waar voorwerpen blijven drijven.</p>
            <ol className="grid grid-cols-2 gap-2 text-sm font-extrabold sm:grid-cols-4">
              {['KIJK', 'DOE: wegen', 'DOE: toren', 'OEFEN'].map((stap, i) => (
                <li key={stap} className="rounded-lg border-2 border-[#0B0D0F] bg-[#FFF0B8] px-2 py-1 text-center">{i + 1}. {stap}</li>
              ))}
            </ol>
            <p className="text-[15px] font-semibold text-[#5B5648]">Eerst een voorbeeld, dan {AANTAL_WEGEN} vloeistoffen wegen, de toren en een oefenblad met {AANTAL_OEFENVRAGEN} sommen. Het boekje met dichtheden zit rechtsboven.</p>
            <div className="mt-auto"><Knop onClick={begin} autoFocus>Start het lab</Knop></div>
          </>
        )}
      />
    );
  } else if (scherm === 'kijk') {
    fase = 'KIJK';
    titel = 'Vloeistof wegen';
    inhoud = <KijkWegen onKlaar={() => setScherm('wegen')} />;
  } else if (scherm === 'wegen') {
    fase = 'DOE';
    titel = 'Vloeistof wegen';
    voortgang = `${Math.min(opgaven.length + 1, AANTAL_WEGEN)} van ${AANTAL_WEGEN}`;
    inhoud = <DoeWegen onOpgave={wegenKlaar} />;
  } else if (scherm === 'toren') {
    fase = 'DOE';
    titel = 'De dichtheidstoren';
    inhoud = <MissieToren onOpgave={erbij} onKlaar={() => setScherm('oefen')} />;
  } else if (scherm === 'oefen') {
    fase = 'OEFEN';
    titel = 'Oefenblad';
    inhoud = <Oefenblad missie="lab" onKlaar={oefenbladKlaar} maakVragen={() => maakOefenblad()} antwoordGoed={oefenAntwoordGoed} toonAntwoord={toonAntwoord} />;
  } else {
    fase = 'KLAAR';
    titel = 'Klaar!';
    const score = Math.min(MAX_SCORE, telScore(opgaven));
    inhoud = (
      <Split
        beeld={(
          <div className="flex flex-col items-center gap-3 text-center">
            <Trophy size={88} aria-hidden="true" />
            <p className="text-[46px] font-extrabold leading-none text-[#237A4D] [text-shadow:0_0_18px_#bff0d4]">{score} van {MAX_SCORE}</p>
            <p className="text-lg font-bold">punten</p>
          </div>
        )}
        paneel={(
          <>
            <p className="ds-display text-[28px]">Wat heb je geleerd?</p>
            <ul className="flex flex-col gap-2">
              {GELEERD.map((regel) => (
                <li key={regel} className="flex items-start gap-2 font-bold">
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#237A4D]" aria-hidden="true" />{regel}
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              {isFinished ? <p className="font-bold text-[#237A4D]">Je resultaat is opgeslagen.</p> : <Knop variant="goed" onClick={rondAf} autoFocus>Afronden</Knop>}
            </div>
          </>
        )}
      />
    );
  }

  return (
    <BoekProvider stoffen={BOEKJE} decimalen={2} titel="Dichtheid van vloeistoffen en voorwerpen">
      <Schil titel={titel} fase={fase} voortgang={voortgang}>{inhoud}</Schil>
      <Binasboek />
    </BoekProvider>
  );
}
