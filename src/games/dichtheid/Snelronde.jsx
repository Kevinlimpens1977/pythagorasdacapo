import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Pause, Play, Timer, Trophy, XCircle } from 'lucide-react';
import { GetalVeld, Knop, Opdracht, Split } from '../volumeBerekenen/componenten/Ui';
import { formatKlok, SNELRONDE_MS } from '../volumeBerekenen/volumeSnelronde';
import { speelFout, speelGoed, speelKlaar } from '../volumeBerekenen/volumeSounds';
import { EENHEID_VAN, SYMBOOL } from './dichtheidLogic';
import { beoordeelSnel, juistTekst, maakSnelOpgave } from './dichtheidSnelronde';
import { besteSnelronde, bewaarSnelronde } from './dichtheidVoortgang';
import Formuledriehoek from './componenten/Formuledriehoek';

// 60 seconden sommen met de formuledriehoek. Telt niet mee voor tokens.
export default function Snelronde({ onStop }) {
  const [fase, setFase] = useState('uitleg');
  const [restMs, setRestMs] = useState(SNELRONDE_MS);
  const [loopt, setLoopt] = useState(false);
  const [opgave, setOpgave] = useState(() => maakSnelOpgave());
  const [invoer, setInvoer] = useState('');
  const [goed, setGoed] = useState(0);
  const [totaal, setTotaal] = useState(0);
  const [flits, setFlits] = useState(null);
  const [record, setRecord] = useState(false);
  const [beste, setBeste] = useState(() => besteSnelronde());
  const restRef = useRef(SNELRONDE_MS);
  const goedRef = useRef(0);

  useEffect(() => {
    if (!loopt) return undefined;
    let vorige = Date.now();
    const id = window.setInterval(() => {
      const nu = Date.now();
      restRef.current -= nu - vorige;
      vorige = nu;
      if (restRef.current > 0) { setRestMs(restRef.current); return; }
      window.clearInterval(id);
      restRef.current = 0;
      setRestMs(0);
      setLoopt(false);
      setFase('check');
      speelKlaar();
      setRecord(bewaarSnelronde(goedRef.current));
      setBeste(besteSnelronde());
    }, 200);
    return () => window.clearInterval(id);
  }, [loopt]);

  const start = () => {
    restRef.current = SNELRONDE_MS;
    goedRef.current = 0;
    setRestMs(SNELRONDE_MS);
    setGoed(0);
    setTotaal(0);
    setFlits(null);
    setRecord(false);
    setInvoer('');
    setOpgave(maakSnelOpgave());
    setFase('bezig');
    setLoopt(true);
  };

  const beantwoord = () => {
    if (!loopt) return;
    const uitslag = beoordeelSnel(opgave, invoer);
    if (uitslag === null) return;
    setTotaal((t) => t + 1);
    if (uitslag) {
      speelGoed();
      goedRef.current += 1;
      setGoed(goedRef.current);
    } else {
      speelFout();
    }
    setFlits({ goed: uitslag, tekst: juistTekst(opgave) });
    setOpgave(maakSnelOpgave(Math.random, opgave));
    setInvoer('');
  };

  if (fase === 'uitleg' || fase === 'check') {
    return (
      <Split
        beeld={fase === 'uitleg' ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <Timer size={96} aria-hidden="true" />
            <p className="font-mono text-[56px] font-extrabold">01:00</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <Trophy size={80} aria-hidden="true" />
            <p className="text-[46px] font-extrabold leading-none text-[#237A4D]">{goed} goed</p>
            <p className="text-lg font-bold">van {totaal}</p>
            {record && <p className="rounded-full border-2 border-[#0B0D0F] bg-[#FFD33D] px-4 py-1 font-extrabold">Nieuw record</p>}
          </div>
        )}
        paneel={(
          <>
            <p className="text-sm font-extrabold uppercase tracking-wide text-[#066A99]">Snelronde, telt niet mee voor tokens</p>
            <Opdracht>{fase === 'uitleg' ? 'Reken in 60 seconden zoveel mogelijk sommen uit met de formuledriehoek. Rond de dichtheid af op één decimaal.' : 'Tijd is op.'}</Opdracht>
            {Math.max(beste, fase === 'check' ? goed : 0) > 0 && <p className="font-bold">Jouw record: {Math.max(beste, fase === 'check' ? goed : 0)} goed.</p>}
            <div className="mt-auto flex flex-wrap gap-2">
              <Knop onClick={start} autoFocus>{fase === 'uitleg' ? 'Start de timer' : 'Nog een keer'}</Knop>
              <Knop variant="rustig" onClick={onStop}>Terug</Knop>
            </div>
          </>
        )}
      />
    );
  }

  return (
    <Split
      beeld={<div className={loopt ? '' : 'opacity-30 blur-sm'}><Formuledriehoek handOp={opgave.gezocht} /></div>}
      paneel={(
        <>
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-lg font-extrabold"><CheckCircle2 size={22} className="text-[#237A4D]" aria-hidden="true" /> {goed} goed</p>
            <div className="flex items-center gap-2 rounded-xl border-[3px] border-[#0B0D0F] bg-white px-3 py-1" role="timer">
              <span className={`font-mono text-[30px] font-extrabold tabular-nums ${restMs <= 10_000 ? 'text-[#B42F25]' : ''}`}>{formatKlok(restMs)}</span>
              <button type="button" onClick={() => setLoopt((oud) => !oud)} className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#0B0D0F]" aria-label={loopt ? 'Pauze' : 'Verder'}>
                {loopt ? <Pause size={16} /> : <Play size={16} />}
              </button>
            </div>
          </div>
          <p className="rounded-xl bg-[#FFF0B8] px-3 py-2 text-lg font-bold">{opgave.gegeven.join(' en ')}</p>
          <GetalVeld
            waarde={invoer}
            onChange={setInvoer}
            label={`${SYMBOOL[opgave.gezocht]} =`}
            eenheid={EENHEID_VAN[opgave.gezocht]}
            onEnter={beantwoord}
            autoFocus
            breed
            disabled={!loopt}
          />
          {flits && (
            <p className={`flex items-center gap-2 rounded-xl px-3 py-2 font-bold ${flits.goed ? 'bg-[#DFF2E7] text-[#237A4D]' : 'bg-[#FADDDA] text-[#B42F25]'}`}>
              {flits.goed ? <CheckCircle2 size={20} aria-hidden="true" /> : <XCircle size={20} aria-hidden="true" />}
              {flits.goed ? `Goed: ${flits.tekst}` : `Het was ${flits.tekst}`}
            </p>
          )}
          <div className="mt-auto"><Knop onClick={beantwoord} disabled={!loopt}>Controleer</Knop></div>
        </>
      )}
    />
  );
}
