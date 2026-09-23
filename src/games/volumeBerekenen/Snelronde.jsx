import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Pause, Play, Plus, Timer, Trophy, XCircle } from 'lucide-react';
import Balk from './componenten/Balk';
import Maatcilinder, { Loep } from './componenten/Maatcilinder';
import { GetalVeld, Knop, Opdracht, Split } from './componenten/Ui';
import { MISSIES, SCHALEN } from './volumeLogic';
import { beoordeelSnel, formatKlok, juistTekst, maakSnelOpgave, SNELRONDE_MS, VERLENGING_MS } from './volumeSnelronde';
import { speelFout, speelGoed, speelKlaar } from './volumeSounds';
import { besteSnelronde, bewaarSnelronde } from './volumeVoortgang';

// Timer volgens design system p.16: vaste zone rechtsboven, mm:ss, pauze en
// verlenging zonder layoutwissel, bij nul volgt CHECK.
function TimerZone({ restMs, loopt, onPauze, onVerleng }) {
  const bijnaOp = restMs <= 10_000;
  return (
    <div className="flex items-center gap-2 self-end rounded-xl border-[3px] border-[#0B0D0F] bg-white px-3 py-1.5 shadow-[3px_3px_0_#0B0D0F]" role="timer" aria-live="off">
      <Timer size={22} aria-hidden="true" />
      <div className="flex flex-col leading-none">
        <span className="text-xs font-extrabold uppercase tracking-wide text-[#5B5648]">Tijd</span>
        <span className={`font-mono text-[34px] font-extrabold tabular-nums ${bijnaOp ? 'text-[#B42F25]' : 'text-[#0B0D0F]'}`}>{formatKlok(restMs)}</span>
      </div>
      <button type="button" onClick={onPauze} className="ml-1 flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[#0B0D0F] bg-[#FFF7E8]" aria-label={loopt ? 'Pauze' : 'Verder'}>
        {loopt ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <button type="button" onClick={onVerleng} className="flex h-10 items-center gap-1 rounded-lg border-2 border-[#0B0D0F] bg-[#FFF7E8] px-2 text-sm font-extrabold" aria-label="30 seconden erbij">
        <Plus size={16} />30 s
      </button>
    </div>
  );
}

const UITLEG = {
  [MISSIES.MAATCILINDER]: 'Lees zoveel mogelijk maatcilinders af in 60 seconden. Typ alleen het getal in ml.',
  [MISSIES.BALK]: 'Reken zoveel mogelijk volumes uit in 60 seconden. Typ alleen het getal in cm³.',
  [MISSIES.ONDERDOMPELEN]: 'Lees begin en eind af en reken het volume uit. Zoveel mogelijk in 60 seconden. Typ alleen het getal in ml.'
};

export default function Snelronde({ missie, onStop, onFase }) {
  const [fase, zetFaseIntern] = useState('uitleg');
  const setFase = (nieuw) => {
    zetFaseIntern(nieuw);
    onFase?.(nieuw);
  };
  const [restMs, setRestMs] = useState(SNELRONDE_MS);
  const [loopt, setLoopt] = useState(false);
  const [opgave, setOpgave] = useState(() => maakSnelOpgave(missie));
  const [invoer, setInvoer] = useState('');
  const [goed, setGoed] = useState(0);
  const [totaal, setTotaal] = useState(0);
  const [flits, setFlits] = useState(null);
  const [fouten, setFouten] = useState([]);
  const [record, setRecord] = useState(false);
  const [beste, setBeste] = useState(() => besteSnelronde(missie));
  const invoerRef = useRef(null);
  const goedRef = useRef(0);

  const restRef = useRef(SNELRONDE_MS);

  useEffect(() => {
    if (!loopt) return undefined;
    let vorige = Date.now();
    const id = window.setInterval(() => {
      const nu = Date.now();
      restRef.current -= nu - vorige;
      vorige = nu;
      if (restRef.current > 0) {
        setRestMs(restRef.current);
        return;
      }
      window.clearInterval(id);
      restRef.current = 0;
      setRestMs(0);
      setLoopt(false);
      setFase('check');
      speelKlaar();
      setRecord(bewaarSnelronde(missie, goedRef.current));
      setBeste(besteSnelronde(missie));
    }, 200);
    return () => window.clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- setFase roept alleen setters aan
  }, [loopt, missie]);

  const start = () => {
    setFase('bezig');
    restRef.current = SNELRONDE_MS;
    setRestMs(SNELRONDE_MS);
    setGoed(0);
    goedRef.current = 0;
    setTotaal(0);
    setFouten([]);
    setFlits(null);
    setRecord(false);
    setInvoer('');
    setOpgave(maakSnelOpgave(missie));
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
      setFlits({ goed: true, tekst: juistTekst(opgave) });
    } else {
      speelFout();
      setFlits({ goed: false, tekst: `Het was ${juistTekst(opgave)}` });
      setFouten((oud) => [...oud, { vraag: opgave, jij: invoer }].slice(-5));
    }
    setOpgave(maakSnelOpgave(missie, { vorige: opgave }));
    setInvoer('');
    invoerRef.current?.focus();
  };

  if (fase === 'uitleg') {
    return (
      <Split
        beeld={(
          <div className="flex flex-col items-center gap-3 text-center">
            <Timer size={96} aria-hidden="true" />
            <p className="font-mono text-[56px] font-extrabold">01:00</p>
          </div>
        )}
        paneel={(
          <>
            <p className="text-sm font-extrabold uppercase tracking-wide text-[#066A99]">Snelronde, telt niet mee voor tokens</p>
            <Opdracht>{UITLEG[missie]}</Opdracht>
            <p className="text-[15px] font-semibold text-[#5B5648]">Druk op Enter om je antwoord te geven. Fout is niet erg: je ziet meteen het goede antwoord. Pauzeren mag.</p>
            {beste > 0 && <p className="font-bold">Jouw record: {beste} goed.</p>}
            <div className="mt-auto flex flex-wrap gap-2">
              <Knop onClick={start} autoFocus>Start de timer</Knop>
              <Knop variant="rustig" onClick={onStop}>Terug</Knop>
            </div>
          </>
        )}
      />
    );
  }

  if (fase === 'check') {
    return (
      <Split
        beeld={(
          <div className="flex flex-col items-center gap-3 text-center">
            <Trophy size={80} aria-hidden="true" />
            <p className="text-[46px] font-extrabold leading-none text-[#237A4D] [text-shadow:0_0_18px_#bff0d4]">{goed} goed</p>
            <p className="text-lg font-bold">van {totaal} {totaal === 1 ? 'opgave' : 'opgaven'}</p>
            {record && <p className="rounded-full border-2 border-[#0B0D0F] bg-[#FFD33D] px-4 py-1 font-extrabold">Nieuw record</p>}
          </div>
        )}
        paneel={(
          <>
            <p className="ds-display text-[28px]">Tijd is op</p>
            <p className="font-bold">Jouw record: {Math.max(beste, goed)} goed.</p>
            {fouten.length > 0 && (
              <div>
                <p className="font-extrabold">Kijk nog even naar:</p>
                <ul className="mt-1 flex flex-col gap-1 text-[15px] font-semibold">
                  {fouten.map((fout, i) => (
                    <li key={`${fout.vraag.sleutel}-${i}`} className="flex items-start gap-2">
                      <XCircle size={18} className="mt-0.5 shrink-0 text-[#B42F25]" aria-hidden="true" />
                      <span>Jij: {fout.jij}, goed: {juistTekst(fout.vraag)}{fout.vraag.soort === 'balk' ? ` (${fout.vraag.vraag})` : ''}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-auto flex flex-wrap gap-2">
              <Knop onClick={start} autoFocus>Nog een keer</Knop>
              <Knop variant="rustig" onClick={onStop}>Terug</Knop>
            </div>
          </>
        )}
      />
    );
  }

  const schaal = opgave.schaal ? SCHALEN[opgave.schaal] : null;
  let beeld;
  if (opgave.soort === 'balk') {
    beeld = <div className="w-full max-w-lg"><Balk l={opgave.l} b={opgave.b} h={opgave.h} toonMaten kleur="hout" /></div>;
  } else if (opgave.soort === 'dompel') {
    beeld = (
      <div className="flex flex-wrap items-end justify-center gap-6">
        <div className="flex flex-col items-center"><Maatcilinder schaal={schaal} niveau={opgave.begin} titel="Begin" /><span className="font-extrabold">begin</span></div>
        <div className="flex flex-col items-center"><Maatcilinder schaal={schaal} niveau={opgave.eind} voorwerp={{ vorm: 'steen', x: 110, y: 470, schaal: 0.95 }} titel="Eind" /><span className="font-extrabold">eind</span></div>
      </div>
    );
  } else {
    beeld = (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Maatcilinder schaal={schaal} niveau={opgave.juist} titel={schaal.naam} />
        <Loep schaal={schaal} niveau={opgave.juist} className="w-52" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-lg font-extrabold">
          <CheckCircle2 size={22} className="text-[#237A4D]" aria-hidden="true" /> {goed} goed
        </p>
        <TimerZone
          restMs={restMs}
          loopt={loopt}
          onPauze={() => setLoopt((l) => !l)}
          onVerleng={() => { restRef.current += VERLENGING_MS; setRestMs(restRef.current); }}
        />
      </div>
      <Split
        beeld={<div className={loopt ? '' : 'opacity-30 blur-sm'}>{beeld}</div>}
        paneel={(
          <>
            <p className="text-sm font-extrabold uppercase tracking-wide text-[#066A99]">{schaal ? schaal.naam : 'Balk'}</p>
            <Opdracht>{opgave.soort === 'balk' ? 'Bereken het volume.' : opgave.soort === 'dompel' ? 'Hoeveel ml is het voorwerp? Reken: V eind - V begin.' : 'Hoeveel ml zit erin?'}</Opdracht>
            {opgave.soort === 'balk' && <p className="rounded-xl bg-[#FFF0B8] px-3 py-2 text-lg font-bold">{opgave.vraag}</p>}
            <div ref={(el) => { invoerRef.current = el?.querySelector('input') || null; }}>
              <GetalVeld waarde={invoer} onChange={setInvoer} label="Antwoord" eenheid={opgave.eenheid} onEnter={beantwoord} autoFocus breed disabled={!loopt} />
            </div>
            {!loopt && <p className="font-bold text-[#B4520E]">Pauze. Druk op de knop bij de tijd om verder te gaan.</p>}
            {flits && (
              <p className={`flex items-center gap-2 rounded-xl px-3 py-2 font-bold ${flits.goed ? 'bg-[#DFF2E7] text-[#237A4D]' : 'bg-[#FADDDA] text-[#B42F25]'}`}>
                {flits.goed ? <CheckCircle2 size={20} aria-hidden="true" /> : <XCircle size={20} aria-hidden="true" />}
                {flits.goed ? `Goed: ${flits.tekst}` : flits.tekst}
              </p>
            )}
            <div className="mt-auto flex flex-wrap gap-2">
              <Knop onClick={beantwoord} disabled={!loopt}>Controleer</Knop>
            </div>
          </>
        )}
      />
    </div>
  );
}
