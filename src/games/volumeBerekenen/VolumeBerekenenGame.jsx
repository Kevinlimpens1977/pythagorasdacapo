import { useRef, useState } from 'react';
import { CheckCircle2, Lightbulb, Timer, Trophy } from 'lucide-react';
import Balk from './componenten/Balk';
import Maatcilinder from './componenten/Maatcilinder';
import { VoorwerpIcoon } from './componenten/Voorwerp';
import { Knop, Schil, Split } from './componenten/Ui';
import { DoeBalk, KijkBalk } from './MissieBalk';
import { DoeDompel, KijkDompel } from './MissieDompel';
import { DoeMaatcilinder, KijkMaatcilinder } from './MissieMaatcilinder';
import Snelronde from './Snelronde';
import { AANTAL_OPGAVEN, maakResultaat, maxScore, MISSIES, SCHALEN, telScore, vaaksteFout } from './volumeLogic';
import { speelKlaar } from './volumeSounds';
import { markeerVoorbeeldenGezien, voorbeeldenGezien } from './volumeVoortgang';

const INFO = {
  [MISSIES.MAATCILINDER]: {
    titel: 'Lees de maatcilinder',
    doel: 'Je leest een maatcilinder precies af. Je werkt van een cilinder van 100 ml naar 10 ml en 1 liter.',
    geleerd: [
      'Je zoekt twee getallen en rekent uit hoeveel ml één streepje is.',
      'Je leest af bij de onderkant van de meniscus.',
      'Je schrijft altijd de eenheid erbij: ml of cm³.'
    ],
    beeld: <Maatcilinder schaal={SCHALEN.ml50} niveau={35} />
  },
  [MISSIES.BALK]: {
    titel: 'Meet en bereken de balk',
    doel: 'Je meet een blok met de liniaal en berekent het volume: lengte × breedte × hoogte.',
    geleerd: [
      'Je legt de 0 van de liniaal precies tegen de rand.',
      'V = lengte × breedte × hoogte, in cm³.',
      '1 cm³ = 1 ml en 1000 cm³ = 1 liter.'
    ],
    beeld: <div className="w-full max-w-md"><Balk l={5} b={3} h={2} lagen={2} /></div>
  },
  [MISSIES.ONDERDOMPELEN]: {
    titel: 'Dompel onder',
    doel: 'Je meet het volume van een steen, sleutel of knikker met water: de onderdompelmethode.',
    geleerd: [
      'Je leest het beginvolume en het eindvolume af.',
      'V voorwerp = V eind - V begin.',
      'Het voorwerp moet helemaal onder water zitten.'
    ],
    beeld: (
      <div className="flex flex-wrap items-end justify-center gap-2">
        {['steen', 'sleutel', 'knikker', 'dobbelsteen'].map((vorm) => <VoorwerpIcoon key={vorm} vorm={vorm} className="h-24 w-24" />)}
      </div>
    )
  }
};

const TIPS = {
  bovenkant: 'Lees altijd af bij de onderkant van de meniscus.',
  streepjeswaarde: 'Reken eerst uit hoeveel ml één streepje is.',
  streepjesvraag: 'Reken eerst uit hoeveel ml één streepje is.',
  eenheid: 'Schrijf altijd de goede eenheid erbij.',
  label: 'Kijk goed welke getallen op de schaal staan.',
  vullen: 'Tel de streepjes vanaf het dichtstbijzijnde getal.',
  meten: 'Leg de 0 van de liniaal precies tegen het begin van de rand.',
  liniaalVanafEen: 'Begin bij 0 op de liniaal, niet bij 1.',
  opgeteld: 'Volume is vermenigvuldigen: lengte × breedte × hoogte.',
  bodem: 'Vergeet de hoogte niet: bodem × hoogte.',
  omrekenen: '1 cm³ = 1 ml, en 1000 cm³ = 1 liter.',
  negatief: 'V = V eind - V begin. Het grootste getal eerst.',
  eindvolume: 'Trek het beginvolume van het eindvolume af.'
};

const FASEN = { START: 'start', KIJK: 'kijk', DOE: 'doe', KLAAR: 'klaar', SNEL: 'snel' };

export default function VolumeBerekenenGame({ missie = MISSIES.MAATCILINDER, onStart, onComplete }) {
  const info = INFO[missie] || INFO[MISSIES.MAATCILINDER];
  const [fase, setFase] = useState(FASEN.START);
  const [startedAt, setStartedAt] = useState(null);
  const [opgaven, setOpgaven] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const afgerond = useRef(false);
  const [kanOverslaan] = useState(() => voorbeeldenGezien(missie));
  const [snelFase, setSnelFase] = useState('uitleg');
  const aantal = AANTAL_OPGAVEN[missie];

  const start = (metVoorbeelden) => {
    const nu = new Date().toISOString();
    setStartedAt(nu);
    onStart?.(nu);
    setFase(metVoorbeelden ? FASEN.KIJK : FASEN.DOE);
  };

  const kijkKlaar = () => {
    markeerVoorbeeldenGezien(missie);
    setFase(FASEN.DOE);
  };

  const opgaveKlaar = (opgave) => {
    const nieuw = [...opgaven, opgave];
    setOpgaven(nieuw);
    if (nieuw.length >= aantal) {
      speelKlaar();
      setFase(FASEN.KLAAR);
    }
  };

  const rondAf = () => {
    if (afgerond.current || isFinished) return;
    afgerond.current = true;
    setIsFinished(true);
    onComplete?.(maakResultaat({
      missie,
      opgaven,
      startedAt: startedAt || new Date().toISOString(),
      completedAt: new Date().toISOString(),
      extra: { voorbeeldenOvergeslagen: kanOverslaan && fase !== FASEN.KIJK }
    }));
  };

  const voortgang = fase === FASEN.DOE ? `${Math.min(opgaven.length + 1, aantal)} van ${aantal}` : null;
  const faseLabel = { start: null, kijk: 'KIJK', doe: 'DOE', klaar: 'KLAAR', snel: { uitleg: 'KIJK', bezig: 'DOE', check: 'CHECK' }[snelFase] }[fase];

  let inhoud;
  if (fase === FASEN.START) {
    inhoud = (
      <Split
        beeld={info.beeld}
        paneel={(
          <>
            <p className="text-sm font-extrabold uppercase tracking-wide text-[#066A99]">Binask 2.2 Volume</p>
            <p className="text-xl font-extrabold leading-snug">{info.doel}</p>
            <ol className="grid grid-cols-2 gap-2 text-sm font-extrabold sm:grid-cols-4">
              {['KIJK', 'DOE', 'CHECK', 'KLAAR'].map((stap, i) => (
                <li key={stap} className="rounded-lg border-2 border-[#0B0D0F] bg-[#FFF0B8] px-2 py-1 text-center">{i + 1}. {stap}</li>
              ))}
            </ol>
            <p className="text-[15px] font-semibold text-[#5B5648]">Eerst voorbeelden, dan {aantal} opgaven. Na elke opgave zie je direct of het goed is.</p>
            <div className="mt-auto flex flex-wrap gap-2">
              <Knop onClick={() => start(true)} autoFocus>Start met voorbeelden</Knop>
              {kanOverslaan && <Knop variant="rustig" onClick={() => start(false)}>Voorbeelden overslaan</Knop>}
            </div>
          </>
        )}
      />
    );
  } else if (fase === FASEN.KIJK) {
    inhoud = missie === MISSIES.BALK
      ? <KijkBalk onKlaar={kijkKlaar} />
      : missie === MISSIES.ONDERDOMPELEN
        ? <KijkDompel onKlaar={kijkKlaar} />
        : <KijkMaatcilinder onKlaar={kijkKlaar} />;
  } else if (fase === FASEN.DOE) {
    inhoud = missie === MISSIES.BALK
      ? <DoeBalk onOpgave={opgaveKlaar} />
      : missie === MISSIES.ONDERDOMPELEN
        ? <DoeDompel onOpgave={opgaveKlaar} />
        : <DoeMaatcilinder aantal={aantal} onOpgave={opgaveKlaar} />;
  } else if (fase === FASEN.SNEL) {
    inhoud = <Snelronde missie={missie} onFase={setSnelFase} onStop={() => { setSnelFase('uitleg'); setFase(FASEN.KLAAR); }} />;
  } else {
    const score = Math.min(maxScore(missie), telScore(opgaven));
    const resultaat = maakResultaat({ missie, opgaven });
    const fout = vaaksteFout(resultaat.details.fouten);
    inhoud = (
      <Split
        beeld={(
          <div className="flex flex-col items-center gap-3 text-center">
            <Trophy size={88} className="text-[#0B0D0F]" aria-hidden="true" />
            <p className="text-[46px] font-extrabold leading-none text-[#237A4D] [text-shadow:0_0_18px_#bff0d4]">{score} van {maxScore(missie)}</p>
            <p className="text-lg font-bold">punten</p>
          </div>
        )}
        paneel={(
          <>
            <p className="ds-display text-[28px]">Wat heb je geleerd?</p>
            <ul className="flex flex-col gap-2">
              {info.geleerd.map((regel) => (
                <li key={regel} className="flex items-start gap-2 font-bold">
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#237A4D]" aria-hidden="true" />
                  {regel}
                </li>
              ))}
            </ul>
            {fout && TIPS[fout.soort] && (
              <p className="flex items-start gap-2 rounded-xl border-2 border-[#F47A20] bg-[#FDE7D6] px-3 py-2 font-bold text-[#0B0D0F]">
                <Lightbulb size={20} className="mt-0.5 shrink-0 text-[#B4520E]" aria-hidden="true" />
                Tip: {TIPS[fout.soort]}
              </p>
            )}
            <div className="mt-auto">
              {isFinished ? (
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-[#237A4D]">Je resultaat is opgeslagen.</p>
                  <p className="text-[15px] font-semibold text-[#5B5648]">Wil je nog sneller worden? Doe de snelronde. Die telt niet mee voor tokens.</p>
                  <Knop variant="rustig" onClick={() => setFase(FASEN.SNEL)}><Timer size={18} aria-hidden="true" />Snelronde: 60 seconden</Knop>
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
    <Schil titel={fase === FASEN.KLAAR ? 'Klaar!' : fase === FASEN.SNEL ? 'Snelronde' : info.titel} fase={faseLabel} voortgang={voortgang}>
      {inhoud}
    </Schil>
  );
}
