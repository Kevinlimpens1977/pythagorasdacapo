import { useRef, useState } from 'react';
import Maatcilinder, { Loep } from './componenten/Maatcilinder';
import { GEOMETRIE, yVoorWaarde } from './componenten/cilinderGeometrie';
import { CheckGoed, FoutKaart, GetalVeld, Keuzes, Knop, Opdracht, Split, Stappen } from './componenten/Ui';
import {
  AFLEESFEEDBACK, AFLEESFOUTEN, beoordeelAflezing, beoordeelVerschil, DOMPEL_PUNTEN, DOMPELFEEDBACK,
  DOMPELFOUTEN, formatVolume, leesGetal, maakDompelReeks, rondAf, SCHALEN, VALKUILEN, VOORWERPEN
} from './volumeLogic';
import { speelFout, speelGoed, speelPlons } from './volumeSounds';

const DUUR = 900;

// Laat het water in `DUUR` ms van `van` naar `naar` stijgen.
function useStijgen() {
  const [niveau, setNiveau] = useState(null);
  const frame = useRef(null);
  const start = (van, naar, klaar) => {
    if (typeof window === 'undefined' || !window.requestAnimationFrame) {
      setNiveau(naar);
      klaar?.();
      return;
    }
    const begin = performance.now();
    const stap = (nu) => {
      const t = Math.min(1, (nu - begin) / DUUR);
      const zacht = 1 - (1 - t) * (1 - t);
      setNiveau(van + (naar - van) * zacht);
      if (t < 1) frame.current = window.requestAnimationFrame(stap);
      else klaar?.();
    };
    window.cancelAnimationFrame(frame.current);
    frame.current = window.requestAnimationFrame(stap);
  };
  return [niveau, setNiveau, start];
}

// Positie van het voorwerp: boven de cilinder, of erin (op de bodem of drijvend).
function voorwerpProps({ vorm, erin, drijfNiveau, schaal }) {
  const bodem = GEOMETRIE.yNul;
  const boven = GEOMETRIE.yMax - 50;
  let y = bodem;
  if (erin && vorm === 'kurk') y = yVoorWaarde(drijfNiveau, schaal) + 10;
  return {
    vorm,
    x: 110,
    y,
    schaal: vorm === 'poppetje' ? 0.8 : 0.95,
    stijl: {
      transform: `translate(0px, ${erin ? 0 : boven - y}px)`,
      transition: `transform ${DUUR * 0.7}ms cubic-bezier(.55,0,.8,.4)`
    }
  };
}

// ---------- KIJK: de vier stappen van dia 7 ----------

const KIJK_STAPPEN = [
  'Lees het beginvolume af: 15 ml.',
  'Laat de steen helemaal in het water zakken.',
  'Lees het eindvolume af: 25 ml.',
  'Trek af: V = V eind - V begin = 25 - 15 = 10 ml = 10 cm³.'
];

export function KijkDompel({ onKlaar }) {
  const schaal = SCHALEN.ml50;
  const [stap, setStap] = useState(0);
  const [deel, setDeel] = useState(0);
  const [niveau, setNiveau, stijgen] = useStijgen();

  const volgende = () => {
    if (stap === 0) {
      setStap(1);
      speelPlons();
      stijgen(15, 25, () => setStap(2));
      return;
    }
    setStap(Math.min(3, stap + 1));
  };

  if (deel === 1) {
    return (
      <Split
        beeld={<Maatcilinder schaal={schaal} niveau={niveau ?? 28} voorwerp={{ vorm: 'blokje', x: 110, y: GEOMETRIE.yNul, schaal: 0.9 }} />}
        paneel={(
          <>
            <p className="text-sm font-extrabold uppercase tracking-wide text-[#066A99]">Voorbeeld 2 van 2</p>
            <Opdracht>Een blokje is 2 cm × 2 cm × 2 cm = 8 cm³.</Opdracht>
            <p className="text-[15px] font-bold">Het water stond op 20 ml. Met het blokje erin staat het op 28 ml.</p>
            <p className="rounded-xl bg-[#FFF0B8] px-3 py-2 font-bold">28 - 20 = 8 ml. Hetzelfde getal: 1 cm³ = 1 ml.</p>
            <Knop onClick={onKlaar} autoFocus>Zelf onderdompelen</Knop>
          </>
        )}
      />
    );
  }

  const erin = stap >= 1;
  const huidig = niveau ?? 15;
  return (
    <Split
      beeld={(
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Maatcilinder schaal={schaal} niveau={huidig} voorwerp={voorwerpProps({ vorm: 'steen', erin, schaal })} />
          <Loep schaal={schaal} niveau={huidig} className="hidden w-52 sm:block" />
        </div>
      )}
      paneel={(
        <>
          <p className="text-sm font-extrabold uppercase tracking-wide text-[#066A99]">Voorbeeld 1 van 2: de onderdompelmethode</p>
          <Stappen stappen={KIJK_STAPPEN} actief={stap} />
          {stap < 3 ? (
            <Knop onClick={volgende} disabled={stap === 1} autoFocus>{stap === 0 ? 'Laat de steen zakken' : 'Volgende stap'}</Knop>
          ) : (
            <Knop onClick={() => { setDeel(1); setNiveau(28); }} autoFocus>Verder</Knop>
          )}
        </>
      )}
    />
  );
}

// ---------- DOE: zes voorwerpen ----------

export function DoeDompel({ onOpgave }) {
  const [reeks] = useState(() => maakDompelReeks());
  const [index, setIndex] = useState(0);
  const opgave = reeks[index];
  const schaal = SCHALEN[opgave.schaal];
  const voorwerp = VOORWERPEN[opgave.voorwerp];
  const [stap, setStap] = useState('begin');
  const [invoer, setInvoer] = useState('');
  const [poging, setPoging] = useState(1);
  const [punten, setPunten] = useState(0);
  const [fouten, setFouten] = useState([]);
  const [melding, setMelding] = useState(null);
  const [keuze, setKeuze] = useState(null);
  const [niveau, setNiveau, stijgen] = useStijgen();
  // Per invulveld: in één keer goed of niet (voor het cijfer).
  const [telling, setTelling] = useState({ onderdelen: 0, minpunten: 0 });
  const registreer = (eersteKeer) => setTelling((oud) => ({ onderdelen: oud.onderdelen + 1, minpunten: oud.minpunten + (eersteKeer ? 0 : 1) }));

  const huidigNiveau = niveau ?? opgave.begin;
  const erin = stap !== 'begin' && stap !== 'zakken';
  const verschil = rondAf(opgave.eind - opgave.begin, 3);

  const naar = (nieuw) => {
    setStap(nieuw);
    setInvoer('');
    setPoging(1);
    setMelding(null);
  };

  const telOp = (vol, half) => setPunten((p) => p + (poging === 1 ? vol : half));

  const leesAf = (juist, punt, volgende) => {
    const uitslag = beoordeelAflezing({ invoer, eenheid: 'ml', juist, schaal });
    if (uitslag.soort === AFLEESFOUTEN.LEEG) { setMelding({ tekst: AFLEESFEEDBACK.leeg }); return; }
    if (uitslag.soort === AFLEESFOUTEN.GOED) {
      speelGoed();
      telOp(punt, 1);
      registreer(poging === 1);
      naar(volgende);
      return;
    }
    speelFout();
    setFouten((oud) => [...oud, uitslag.soort]);
    if (poging === 1) {
      setPoging(2);
      setMelding({ tekst: AFLEESFEEDBACK[uitslag.soort] });
    } else {
      registreer(false);
      setMelding({ tekst: `Het goede antwoord is ${formatVolume(juist, schaal)} ml.`, verder: volgende });
    }
  };

  const laatZakken = () => {
    setStap('zakken');
    speelPlons();
    const doel = opgave.valkuil === 'drijft' ? opgave.eind : opgave.eind;
    stijgen(opgave.begin, doel, () => naar(opgave.valkuil ? 'valkuil' : 'eind'));
  };

  const controleer = () => {
    if (stap === 'begin') { leesAf(opgave.begin, DOMPEL_PUNTEN.begin, 'zakken'); return; }
    if (stap === 'eind') { leesAf(opgave.eind, DOMPEL_PUNTEN.eind, 'verschil'); return; }
    if (stap === 'verschil') {
      const uitslag = beoordeelVerschil({ invoer, begin: opgave.begin, eind: opgave.eind });
      if (uitslag === DOMPELFOUTEN.LEEG) { setMelding({ tekst: DOMPELFEEDBACK.leeg }); return; }
      if (uitslag === DOMPELFOUTEN.GOED) { speelGoed(); telOp(DOMPEL_PUNTEN.verschil, 2); registreer(poging === 1); naar('cm3'); return; }
      speelFout();
      setFouten((oud) => [...oud, uitslag]);
      if (poging === 1) { setPoging(2); setMelding({ tekst: DOMPELFEEDBACK[uitslag] }); }
      else { registreer(false); setMelding({ tekst: `V = ${formatVolume(opgave.eind, schaal)} - ${formatVolume(opgave.begin, schaal)} = ${formatVolume(verschil, schaal)} ml.`, verder: 'cm3' }); }
      return;
    }
    if (stap === 'cm3') {
      const getal = leesGetal(invoer);
      if (getal === null) { setMelding({ tekst: 'Vul een getal in.' }); return; }
      if (Math.abs(getal - verschil) < 0.001) { speelGoed(); telOp(DOMPEL_PUNTEN.eenheid, 1); registreer(poging === 1); naar('klaar'); return; }
      speelFout();
      setFouten((oud) => [...oud, 'omrekenen']);
      if (poging === 1) { setPoging(2); setMelding({ tekst: '1 ml = 1 cm³. Het getal blijft hetzelfde.' }); }
      else { registreer(false); setMelding({ tekst: `${formatVolume(verschil, schaal)} ml = ${formatVolume(verschil, schaal)} cm³.`, verder: 'klaar' }); }
    }
  };

  const kiesValkuil = (id) => {
    if (stap !== 'valkuil') return;
    setKeuze(id);
    const valkuil = VALKUILEN[opgave.valkuil];
    if (id === valkuil.goed) {
      speelGoed();
      setPunten((p) => p + (poging === 1 ? 8 : 4));
      registreer(poging === 1);
      setStap('valkuilKlaar');
    } else {
      speelFout();
      setFouten((oud) => [...oud, `valkuil-${opgave.valkuil}`]);
      if (poging === 1) setPoging(2);
      else {
        registreer(false);
        setStap('valkuilKlaar');
      }
    }
  };

  const volgendeVoorwerp = () => {
    onOpgave({ id: `${index + 1}-${voorwerp.id}`, punten: Math.min(10, punten), fouten, ...telling });
    setTelling({ onderdelen: 0, minpunten: 0 });
    if (index + 1 >= reeks.length) return;
    setIndex(index + 1);
    setPunten(0);
    setFouten([]);
    setKeuze(null);
    setNiveau(null);
    naar('begin');
  };

  const laatste = index + 1 >= reeks.length;
  const beeld = (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Maatcilinder
        schaal={schaal}
        niveau={huidigNiveau}
        titel={`${schaal.naam} met ${voorwerp.naam.toLowerCase()}`}
        voorwerp={voorwerpProps({ vorm: voorwerp.vorm, erin, drijfNiveau: huidigNiveau, schaal })}
      />
      <Loep schaal={schaal} niveau={huidigNiveau} className="w-52" />
    </div>
  );

  let paneel;
  if (stap === 'klaar') {
    paneel = (
      <CheckGoed
        groot={`${formatVolume(verschil, schaal)} ml = ${formatVolume(verschil, schaal)} cm³`}
        klein={`V = ${formatVolume(opgave.eind, schaal)} - ${formatVolume(opgave.begin, schaal)}. Dit is het volume van de ${voorwerp.naam.toLowerCase()}.`}
        punten={Math.min(10, punten)}
        onVolgende={volgendeVoorwerp}
        knopTekst={laatste ? 'Naar het oefenblad' : 'Volgend voorwerp'}
      />
    );
  } else if (stap === 'valkuil' || stap === 'valkuilKlaar') {
    const valkuil = VALKUILEN[opgave.valkuil];
    const goed = keuze === valkuil.goed;
    paneel = (
      <>
        <p className="text-sm font-extrabold uppercase tracking-wide text-[#B4520E]">Pas op: valkuil</p>
        <Opdracht>{valkuil.vraag}</Opdracht>
        <Keuzes opties={valkuil.opties} gekozen={keuze} goed={valkuil.goed} disabled={stap === 'valkuilKlaar'} onKies={kiesValkuil} />
        {stap === 'valkuil' && keuze && !goed && <FoutKaart titel="Probeer het nog een keer" tekst="Denk aan de regel: het voorwerp moet helemaal onder water." />}
        {stap === 'valkuilKlaar' && (
          <>
            <p className={`rounded-xl px-3 py-2 font-bold ${goed ? 'bg-[#DFF2E7] text-[#237A4D]' : 'bg-[#FADDDA] text-[#B42F25]'}`}>{valkuil.uitleg}</p>
            <Knop onClick={volgendeVoorwerp} autoFocus>{laatste ? 'Naar het oefenblad' : 'Volgend voorwerp'}</Knop>
          </>
        )}
      </>
    );
  } else {
    paneel = (
      <>
        <p className="text-sm font-extrabold uppercase tracking-wide text-[#066A99]">Voorwerp {index + 1} van {reeks.length}: {voorwerp.naam}</p>
        <Stappen
          stappen={['Lees het beginvolume af.', `Laat de ${voorwerp.naam.toLowerCase()} in het water zakken.`, 'Lees het eindvolume af.', 'Trek af: V eind - V begin.']}
          actief={{ begin: 0, zakken: 1, eind: 2, verschil: 3, cm3: 3 }[stap]}
        />
        {stap === 'begin' && <GetalVeld waarde={invoer} onChange={setInvoer} label="V begin =" eenheid="ml" onEnter={controleer} autoFocus />}
        {stap === 'zakken' && <Knop onClick={laatZakken} disabled={niveau !== null} autoFocus>Laat zakken</Knop>}
        {stap === 'eind' && <GetalVeld waarde={invoer} onChange={setInvoer} label="V eind =" eenheid="ml" onEnter={controleer} autoFocus />}
        {stap === 'verschil' && (
          <>
            <p className="rounded-xl bg-[#FFF0B8] px-3 py-2 font-bold">V = {formatVolume(opgave.eind, schaal)} - {formatVolume(opgave.begin, schaal)}</p>
            <GetalVeld waarde={invoer} onChange={setInvoer} label="V =" eenheid="ml" onEnter={controleer} autoFocus />
          </>
        )}
        {stap === 'cm3' && (
          <>
            <Opdracht>Hoeveel cm³ is {formatVolume(verschil, schaal)} ml?</Opdracht>
            <GetalVeld waarde={invoer} onChange={setInvoer} label="V =" eenheid="cm³" onEnter={controleer} autoFocus />
          </>
        )}
        {melding && <FoutKaart titel={melding.verder ? 'Zo zit het' : poging === 2 ? 'Probeer het nog een keer' : 'Let op'} tekst={melding.tekst} />}
        {stap !== 'zakken' && (
          <div className="mt-auto flex flex-wrap gap-2">
            {melding?.verder ? (
              <Knop onClick={() => naar(melding.verder)} autoFocus>Verder</Knop>
            ) : (
              <Knop onClick={controleer}>Controleer</Knop>
            )}
          </div>
        )}
      </>
    );
  }

  return <Split beeld={beeld} paneel={paneel} />;
}
