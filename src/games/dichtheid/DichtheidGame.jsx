import { useRef, useState } from 'react';
import { CheckCircle2, FlaskConical, Ruler, Timer, Triangle, Trophy } from 'lucide-react';
import Balk from '../volumeBerekenen/componenten/Balk';
import { Knop, Split } from '../volumeBerekenen/componenten/Ui';
import Oefenblad from '../volumeBerekenen/Oefenblad';
import { telCijferOnderdelen, telScore } from '../volumeBerekenen/volumeLogic';
import { speelKlaar } from '../volumeBerekenen/volumeSounds';
import { MISSIE_TITELS, MISSIES } from './dichtheidLogic';
import { AANTAL_OEFENVRAGEN, maakOefenblad, oefenAntwoordGoed, toonAntwoord } from './dichtheidOefenblad';
import {
  bewaarMissie, gestartOp, leesMissies, markeerVoorbeeldenGezien, voorbeeldenGezien, wisVoortgang
} from './dichtheidVoortgang';
import { Binasboek, BoekKnop, BoekProvider } from './componenten/Binasboek';
import Formuledriehoek from './componenten/Formuledriehoek';
import { DoeDriehoek, KijkDriehoek } from './MissieDriehoek';
import { DoeMeten, KijkMeten } from './MissieMeten';
import { DoePracticum, KijkPracticum } from './MissiePracticum';
import Snelronde from './Snelronde';

// Dichtheid (Binask 2.3): één spel, drie missies met een menu (SPELOPZET-DICHTHEID.md).
// Elke missie: START, KIJK, DOE, OEFEN. Wat af is, onthoudt de browser. Als alle
// drie af zijn, volgt één uitslag en één onComplete.

const AANTAL_OPGAVEN = { meten: 3, driehoek: 4, practicum: 4 };
const MAX_SCORE = MISSIES.reduce((som, missie) => som + (AANTAL_OPGAVEN[missie] + AANTAL_OEFENVRAGEN) * 10, 0);

const INFO = {
  meten: {
    icoon: Ruler,
    doel: 'Je meet een blokje, weegt het en rekent de dichtheid uit: ρ = m : V. Daarna zoek je op van welke stof het is.',
    geleerd: 'Dichtheid = massa : volume, in g/cm³.'
  },
  driehoek: {
    icoon: Triangle,
    doel: 'Met de formuledriehoek reken je de massa of het volume uit. De dichtheid zoek je op in het boekje.',
    geleerd: 'Hand op wat je zoekt: m = ρ × V, V = m : ρ, ρ = m : V.'
  },
  practicum: {
    icoon: FlaskConical,
    doel: 'Een echt practicum: vul een maatcilinder, weeg een voorwerp, dompel het onder en ontdek van welke stof het is. Als laatste een kurk die drijft.',
    geleerd: 'Een stof met een kleinere dichtheid dan water (1,0 g/cm³) drijft.'
  }
};

const FASE_KLEUR = { KIJK: 'bg-[#087EB5] text-white', DOE: 'bg-[#0B0D0F] text-[#FFD33D]', OEFEN: 'bg-[#F47A20] text-white', KLAAR: 'bg-[#2E9D63] text-white' };

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

const alleOpgaven = (missies) => MISSIES.flatMap((missie) => missies[missie]?.opgaven || []);

export default function DichtheidGame({ onStart, onComplete }) {
  const [missies, setMissies] = useState(() => leesMissies());
  const [scherm, setScherm] = useState('menu');
  const [missie, setMissie] = useState(null);
  const [opgaven, setOpgaven] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const gestart = useRef(false);
  const afgerond = useRef(false);

  const alleAf = MISSIES.every((id) => missies[id]);
  const volgende = MISSIES.find((id) => !missies[id]) || null;

  const kiesMissie = (id) => {
    setMissie(id);
    setOpgaven([]);
    setScherm('start');
  };

  const begin = (metVoorbeelden) => {
    if (!gestart.current) {
      gestart.current = true;
      onStart?.(gestartOp() || new Date().toISOString());
    }
    setScherm(metVoorbeelden ? 'kijk' : 'doe');
  };

  const opgaveKlaar = (opgave) => {
    const nieuw = [...opgaven, opgave];
    setOpgaven(nieuw);
    if (nieuw.length >= AANTAL_OPGAVEN[missie]) setScherm('oefen');
  };

  const oefenbladKlaar = (oefen) => {
    const alles = [...opgaven, ...oefen.map((vraag) => ({ ...vraag, id: `${missie}-${vraag.id}` }))];
    bewaarMissie(missie, alles);
    setMissies(leesMissies());
    speelKlaar();
    setScherm('missieKlaar');
    setOpgaven(alles);
  };

  const rondAf = () => {
    if (afgerond.current) return;
    afgerond.current = true;
    const lijst = alleOpgaven(missies);
    const fouten = {};
    for (const opgave of lijst) for (const fout of opgave.fouten || []) fouten[fout] = (fouten[fout] || 0) + 1;
    onComplete?.({
      score: Math.min(MAX_SCORE, telScore(lijst)),
      maxScore: MAX_SCORE,
      startedAt: gestartOp() || new Date().toISOString(),
      completedAt: new Date().toISOString(),
      details: {
        missies: MISSIES.map((id) => ({ missie: id, punten: telScore(missies[id]?.opgaven || []) })),
        opgaven: lijst.map((o) => ({ id: o.id, punten: o.punten, fouten: o.fouten || [], onderdelen: o.onderdelen || 0, minpunten: o.minpunten || 0 })),
        fouten,
        cijferTelling: telCijferOnderdelen(lijst)
      }
    });
    wisVoortgang();
    setIsFinished(true);
  };

  const info = missie ? INFO[missie] : null;
  let titel = 'Dichtheid';
  let fase = null;
  let voortgang = null;
  let inhoud;

  if (scherm === 'menu') {
    const score = telScore(alleOpgaven(missies));
    inhoud = (
      <Split
        beeld={(
          <div className="flex w-full flex-wrap items-center justify-center gap-6">
            <div className="w-40"><Balk l={2} b={2} h={2} kleur="koper" /></div>
            <Formuledriehoek handOp="rho" />
          </div>
        )}
        paneel={(
          <>
            <p className="text-sm font-extrabold uppercase tracking-wide text-[#066A99]">Binask 2.3 Dichtheid</p>
            <p className="text-xl font-extrabold leading-snug">Drie missies. Wat af is, krijgt een vinkje: je kunt later verder waar je was.</p>
            <ol className="flex flex-col gap-2">
              {MISSIES.map((id, index) => {
                const af = Boolean(missies[id]);
                const Icoon = INFO[id].icoon;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => kiesMissie(id)}
                      className={`flex min-h-[56px] w-full items-center gap-3 rounded-xl border-[2.5px] border-[#0B0D0F] px-3 py-2 text-left font-extrabold shadow-[3px_3px_0_#0B0D0F] ${af ? 'bg-[#DFF2E7]' : id === volgende ? 'bg-[#FFF0B8]' : 'bg-white'}`}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#0B0D0F] bg-[#FFD33D]">{index + 1}</span>
                      <Icoon size={20} aria-hidden="true" />
                      <span className="flex-1">{MISSIE_TITELS[id]}</span>
                      {af && <CheckCircle2 size={22} className="text-[#237A4D]" aria-label="af" />}
                    </button>
                  </li>
                );
              })}
            </ol>
            {score > 0 && <p className="font-bold">Tot nu toe: {score} van {MAX_SCORE} punten.</p>}
            <div className="mt-auto flex flex-wrap gap-2">
              {alleAf ? (
                <Knop variant="goed" onClick={() => setScherm('klaar')} autoFocus>Naar de uitslag</Knop>
              ) : (
                <Knop onClick={() => kiesMissie(volgende)} autoFocus>{Object.keys(missies).length ? 'Verder met missie ' : 'Start met missie '}{MISSIES.indexOf(volgende) + 1}</Knop>
              )}
            </div>
          </>
        )}
      />
    );
  } else if (scherm === 'start') {
    titel = MISSIE_TITELS[missie];
    const kanOverslaan = voorbeeldenGezien(missie);
    inhoud = (
      <Split
        beeld={<Formuledriehoek handOp={missie === 'driehoek' ? 'm' : 'rho'} />}
        paneel={(
          <>
            <p className="text-sm font-extrabold uppercase tracking-wide text-[#066A99]">Missie {MISSIES.indexOf(missie) + 1} van 3</p>
            <p className="text-xl font-extrabold leading-snug">{info.doel}</p>
            <ol className="grid grid-cols-2 gap-2 text-sm font-extrabold sm:grid-cols-4">
              {['KIJK', 'DOE', 'OEFEN', 'KLAAR'].map((stap, i) => (
                <li key={stap} className="rounded-lg border-2 border-[#0B0D0F] bg-[#FFF0B8] px-2 py-1 text-center">{i + 1}. {stap}</li>
              ))}
            </ol>
            <p className="text-[15px] font-semibold text-[#5B5648]">Eerst voorbeelden, dan {AANTAL_OPGAVEN[missie]} opgaven en een oefenblad met {AANTAL_OEFENVRAGEN} sommen. Het boekje met dichtheden zit rechtsboven.</p>
            <div className="mt-auto flex flex-wrap gap-2">
              <Knop onClick={() => begin(true)} autoFocus>Start met voorbeelden</Knop>
              {kanOverslaan && <Knop variant="rustig" onClick={() => begin(false)}>Voorbeelden overslaan</Knop>}
              <Knop variant="rustig" onClick={() => setScherm('menu')}>Terug naar het menu</Knop>
            </div>
          </>
        )}
      />
    );
  } else if (scherm === 'kijk') {
    titel = MISSIE_TITELS[missie];
    fase = 'KIJK';
    const klaar = () => { markeerVoorbeeldenGezien(missie); setScherm('doe'); };
    inhoud = missie === 'meten' ? <KijkMeten onKlaar={klaar} /> : missie === 'driehoek' ? <KijkDriehoek onKlaar={klaar} /> : <KijkPracticum onKlaar={klaar} />;
  } else if (scherm === 'doe') {
    titel = MISSIE_TITELS[missie];
    fase = 'DOE';
    voortgang = `${Math.min(opgaven.length + 1, AANTAL_OPGAVEN[missie])} van ${AANTAL_OPGAVEN[missie]}`;
    inhoud = missie === 'meten' ? <DoeMeten onOpgave={opgaveKlaar} /> : missie === 'driehoek' ? <DoeDriehoek onOpgave={opgaveKlaar} /> : <DoePracticum onOpgave={opgaveKlaar} />;
  } else if (scherm === 'oefen') {
    titel = MISSIE_TITELS[missie];
    fase = 'OEFEN';
    inhoud = (
      <Oefenblad
        missie={missie}
        onKlaar={oefenbladKlaar}
        maakVragen={(id) => maakOefenblad(id)}
        antwoordGoed={oefenAntwoordGoed}
        toonAntwoord={toonAntwoord}
      />
    );
  } else if (scherm === 'missieKlaar') {
    titel = MISSIE_TITELS[missie];
    fase = 'KLAAR';
    const punten = telScore(opgaven);
    const max = (AANTAL_OPGAVEN[missie] + AANTAL_OEFENVRAGEN) * 10;
    inhoud = (
      <Split
        beeld={(
          <div className="flex flex-col items-center gap-3 text-center">
            <Trophy size={80} aria-hidden="true" />
            <p className="text-[42px] font-extrabold leading-none text-[#237A4D]">{punten} van {max}</p>
            <p className="text-lg font-bold">punten voor deze missie</p>
          </div>
        )}
        paneel={(
          <>
            <p className="ds-display text-[26px]">Missie {MISSIES.indexOf(missie) + 1} af</p>
            <p className="flex items-start gap-2 font-bold"><CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#237A4D]" aria-hidden="true" />{info.geleerd}</p>
            <div className="mt-auto flex flex-wrap gap-2">
              {alleAf ? (
                <Knop variant="goed" onClick={() => setScherm('klaar')} autoFocus>Naar de uitslag</Knop>
              ) : (
                <Knop onClick={() => kiesMissie(volgende)} autoFocus>Door naar missie {MISSIES.indexOf(volgende) + 1}</Knop>
              )}
              <Knop variant="rustig" onClick={() => setScherm('menu')}>Naar het menu</Knop>
            </div>
          </>
        )}
      />
    );
  } else if (scherm === 'snel') {
    titel = 'Snelronde';
    inhoud = <Snelronde onStop={() => setScherm('klaar')} />;
  } else {
    titel = 'Klaar!';
    fase = 'KLAAR';
    const lijst = alleOpgaven(missies);
    const score = Math.min(MAX_SCORE, telScore(lijst));
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
              {MISSIES.map((id) => (
                <li key={id} className="flex items-start gap-2 font-bold">
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#237A4D]" aria-hidden="true" />
                  {INFO[id].geleerd}
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              {isFinished ? (
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-[#237A4D]">Je resultaat is opgeslagen.</p>
                  <p className="text-[15px] font-semibold text-[#5B5648]">Nog sneller worden met de formuledriehoek? Doe de snelronde. Die telt niet mee voor tokens.</p>
                  <Knop variant="rustig" onClick={() => setScherm('snel')}><Timer size={18} aria-hidden="true" />Snelronde: 60 seconden</Knop>
                </div>
              ) : (
                <Knop variant="goed" onClick={rondAf} autoFocus>Afronden</Knop>
              )}
            </div>
          </>
        )}
      />
    );
  }

  return (
    <BoekProvider>
      <Schil titel={titel} fase={fase} voortgang={voortgang}>{inhoud}</Schil>
      <Binasboek />
    </BoekProvider>
  );
}
