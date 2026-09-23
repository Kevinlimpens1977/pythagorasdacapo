import { useState } from 'react';
import { Eye, Minus, Plus } from 'lucide-react';
import Maatcilinder, { Loep } from './componenten/Maatcilinder';
import { meniscusHoogte } from './componenten/cilinderGeometrie';
import {
  CheckGoed, EenheidKeuze, FoutKaart, GetalVeld, HintKaart, Keuzes, Knop, Opdracht, Split, Stappen
} from './componenten/Ui';
import {
  AFLEESFEEDBACK, AFLEESFOUTEN, afleesRoute, beoordeelAflezing, formatGetal, formatVolume, kiesStreepje,
  leesGetal, naarMl, PUNTEN_GOED, PUNTEN_HALF, SCHAALVOLGORDE, SCHALEN, streepjesKeuzes, streepjeVan,
  volgendeSchaalIndex, waardeVanStreepje, zijnGelijk
} from './volumeLogic';
import { speelFout, speelGoed } from './volumeSounds';

const GROEN = '#2E9D63';
const ROOD = '#D83A2E';

// ---------- KIJK: drie voorbeelden ----------

const VOORBEELD_ROUTE = [
  'Zoek twee getallen op de schaal: 30 en 40.',
  'Tel de stappen ertussen: 10 stappen.',
  'Eén streepje is (40 - 30) : 10 = 1 ml.',
  'Lees af bij de onderkant van de meniscus: 35 ml. Dat is ook 35 cm³.'
];

export function KijkMaatcilinder({ onKlaar }) {
  const [deel, setDeel] = useState(0);
  const [stap, setStap] = useState(0);
  const [keuze, setKeuze] = useState(null);
  const schaal = SCHALEN.ml50;

  if (deel === 0) {
    return (
      <Split
        beeld={(
          <div className="flex items-center gap-4">
            <Maatcilinder schaal={schaal} niveau={35} labelAccenten={[30, 40]} markers={stap >= 3 ? [{ waarde: 35, kleur: GROEN, label: '35 ml' }] : []} />
            <Loep schaal={schaal} niveau={35} className="hidden w-52 sm:block" />
          </div>
        )}
        paneel={(
          <>
            <p className="text-sm font-extrabold uppercase tracking-wide text-[#066A99]">Voorbeeld 1 van 3</p>
            <Opdracht>Hoeveel water zit er in de maatcilinder? Volg de vier stappen.</Opdracht>
            <Stappen stappen={VOORBEELD_ROUTE} actief={stap} />
            {stap < 3 ? (
              <Knop onClick={() => setStap(stap + 1)} autoFocus>Volgende stap</Knop>
            ) : (
              <Knop onClick={() => { setDeel(1); setKeuze(null); }} autoFocus>Verder</Knop>
            )}
          </>
        )}
      />
    );
  }

  if (deel === 1) {
    const m = meniscusHoogte(SCHALEN.ml10);
    const opties = [
      { id: 'a', tekst: 'Lijn A, bij de bovenrand van het water' },
      { id: 'b', tekst: 'Lijn B, halverwege' },
      { id: 'c', tekst: 'Lijn C, bij de onderkant van de meniscus' }
    ];
    return (
      <Split
        beeld={(
          <Loep
            schaal={SCHALEN.ml10}
            niveau={6.4}
            lijnen={[
              { id: 'a', dy: -m, kleur: '#0B0D0F' },
              { id: 'b', dy: -m / 2, kleur: '#0B0D0F' },
              { id: 'c', dy: 0, kleur: '#0B0D0F' }
            ]}
            zoom={2.2}
            className="w-full max-w-xl"
          />
        )}
        paneel={(
          <>
            <p className="text-sm font-extrabold uppercase tracking-wide text-[#066A99]">Voorbeeld 2 van 3</p>
            <Opdracht>Het water is een beetje krom. Dat heet de meniscus. Bij welke lijn lees je af?</Opdracht>
            <Keuzes opties={opties} gekozen={keuze} goed="c" disabled={keuze === 'c'} onKies={setKeuze} />
            {keuze && keuze !== 'c' && <FoutKaart tekst="Kijk nog eens. Je leest altijd af bij de onderkant van de meniscus." />}
            {keuze === 'c' && (
              <>
                <p className="font-bold text-[#237A4D]">Goed. Deze maatcilinder geeft 6,4 ml aan.</p>
                <Knop onClick={() => { setDeel(2); setKeuze(null); }} autoFocus>Verder</Knop>
              </>
            )}
          </>
        )}
      />
    );
  }

  const opties = [
    { id: 'a', tekst: 'Oog A, boven het water' },
    { id: 'b', tekst: 'Oog B, gelijk met de onderkant van de meniscus' },
    { id: 'c', tekst: 'Oog C, onder het water' }
  ];
  return (
    <Split
      beeld={(
        <div className="relative flex items-center">
          <Maatcilinder schaal={SCHALEN.ml100} niveau={62} />
          <div className="absolute -right-24 top-0 flex h-full flex-col justify-between py-[14%]">
            {['A', 'B', 'C'].map((letter, index) => (
              <div key={letter} className={`flex items-center gap-2 ${index === 1 ? 'mt-[18%]' : ''}`}>
                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0B0D0F] bg-[#FFD33D] text-sm font-extrabold">{letter}</span>
                <Eye size={36} className="text-[#0B0D0F]" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      )}
      paneel={(
        <>
          <p className="text-sm font-extrabold uppercase tracking-wide text-[#066A99]">Voorbeeld 3 van 3</p>
          <Opdracht>Waar moet je oog zijn als je afleest?</Opdracht>
          <Keuzes opties={opties} gekozen={keuze} goed="b" disabled={keuze === 'b'} onKies={setKeuze} />
          {keuze && keuze !== 'b' && <FoutKaart tekst="Van boven of van onder lees je een verkeerd getal af. Ga op ooghoogte zitten." />}
          {keuze === 'b' && (
            <>
              <p className="font-bold text-[#237A4D]">Goed. Buk zodat je oog gelijk is met de onderkant van de meniscus.</p>
              <Knop onClick={onKlaar} autoFocus>Zelf oefenen</Knop>
            </>
          )}
        </>
      )}
    />
  );
}

// ---------- DOE: tien opgaven, de schaal past zich aan ----------

function nieuweOpgave(nr, schaalIndex, vorigeK) {
  const schaal = SCHALEN[SCHAALVOLGORDE[schaalIndex]];
  const vorm = nr === 3 || nr === 7 ? 'vullen' : 'aflezen';
  const k = kiesStreepje(schaal, { vorigeK });
  const startK = vorm === 'vullen' ? kiesStreepje(schaal, { vorigeK: k }) : k;
  return { nr, schaalId: schaal.id, vorm, k, niveau: waardeVanStreepje(startK, schaal) };
}

export function DoeMaatcilinder({ aantal, onOpgave }) {
  const [ladder, setLadder] = useState({ index: 0, reeksGoed: 0, reeksFout: 0 });
  const [opgave, setOpgave] = useState(() => nieuweOpgave(0, 0, null));
  const [invoer, setInvoer] = useState('');
  const [eenheid, setEenheid] = useState('ml');
  const [poging, setPoging] = useState(1);
  const [hint, setHint] = useState(false);
  const [status, setStatus] = useState('vraag');
  const [melding, setMelding] = useState(null);
  const [fouten, setFouten] = useState([]);
  const [punten, setPunten] = useState(0);
  const [gevraagd, setGevraagd] = useState(() => new Set());
  const [streepjeKeuze, setStreepjeKeuze] = useState(null);

  const schaal = SCHALEN[opgave.schaalId];
  const juist = waardeVanStreepje(opgave.k, schaal);
  const juistTekst = formatVolume(juist, schaal);
  const vraagStreepje = opgave.vorm === 'aflezen' && !gevraagd.has(schaal.id);
  const route = afleesRoute(juist, schaal);

  const zetNiveau = (waarde) => {
    if (status !== 'vraag') return;
    const k = streepjeVan(waarde, schaal);
    if (k === null) return;
    setOpgave((oud) => ({ ...oud, niveau: waarde }));
  };
  const schuif = (richting) => {
    const k = Math.max(0, Math.min(Math.round(schaal.max / schaal.stap), Math.round(opgave.niveau / schaal.stap) + richting));
    zetNiveau(waardeVanStreepje(k, schaal));
  };

  const rondAf = (verdiend, nieuweFouten, goedInEenKeer) => {
    setPunten(verdiend);
    setFouten(nieuweFouten);
    setLadder((oud) => ({
      index: oud.index,
      reeksGoed: goedInEenKeer ? oud.reeksGoed + 1 : 0,
      reeksFout: verdiend === 0 ? oud.reeksFout + 1 : 0
    }));
  };

  const controleer = () => {
    if (status !== 'vraag') return;
    if (opgave.vorm === 'vullen') {
      const goed = zijnGelijk(opgave.niveau, juist);
      if (goed) {
        speelGoed();
        const verdiend = poging === 1 && !hint ? PUNTEN_GOED : PUNTEN_HALF;
        rondAf(verdiend, fouten, verdiend === PUNTEN_GOED);
        setStatus('goed');
        return;
      }
      speelFout();
      const tekst = opgave.niveau > juist ? 'Te hoog. Zet het water lager.' : 'Te laag. Zet het water hoger.';
      if (poging === 1) {
        setPoging(2);
        setFouten([...fouten, 'vullen']);
        setMelding({ tekst, stappen: route.slice(0, 3) });
      } else {
        rondAf(0, [...fouten, 'vullen'], false);
        setStatus('fout');
        setMelding({ tekst: `Het goede niveau is ${juistTekst} ml.`, stappen: route });
      }
      return;
    }

    const uitslag = beoordeelAflezing({ invoer, eenheid, juist, schaal });
    if (uitslag.soort === AFLEESFOUTEN.LEEG) {
      setMelding({ tekst: AFLEESFEEDBACK.leeg });
      return;
    }
    if (uitslag.soort === AFLEESFOUTEN.GOED || uitslag.soort === AFLEESFOUTEN.EENHEID) {
      speelGoed();
      const nieuweFouten = uitslag.soort === AFLEESFOUTEN.EENHEID ? [...fouten, 'eenheid'] : fouten;
      const verdiend = uitslag.soort === AFLEESFOUTEN.GOED && poging === 1 && !hint ? PUNTEN_GOED : PUNTEN_HALF;
      rondAf(verdiend, nieuweFouten, verdiend === PUNTEN_GOED);
      setStatus('goed');
      setMelding(uitslag.soort === AFLEESFOUTEN.EENHEID ? { tekst: 'Het getal klopt, maar let op de eenheid.' } : null);
      return;
    }
    speelFout();
    const nieuweFouten = [...fouten, uitslag.soort];
    if (poging === 1) {
      setPoging(2);
      setFouten(nieuweFouten);
      setMelding({ tekst: AFLEESFEEDBACK[uitslag.soort], stappen: uitslag.soort === 'streepjeswaarde' ? route.slice(0, 3) : null });
    } else {
      rondAf(0, nieuweFouten, false);
      setStatus('fout');
      setMelding({ tekst: `${AFLEESFEEDBACK[uitslag.soort]} Het goede antwoord is ${juistTekst} ml.`, stappen: route });
    }
  };

  const volgende = () => {
    onOpgave({ id: opgave.nr + 1, schaal: schaal.id, punten, fouten });
    const nieuweIndex = volgendeSchaalIndex(ladder);
    const verschoven = nieuweIndex !== ladder.index;
    setLadder(verschoven ? { index: nieuweIndex, reeksGoed: 0, reeksFout: 0 } : ladder);
    if (opgave.nr + 1 >= aantal) return;
    setOpgave(nieuweOpgave(opgave.nr + 1, nieuweIndex, opgave.k));
    setInvoer('');
    setEenheid('ml');
    setPoging(1);
    setHint(false);
    setStatus('vraag');
    setMelding(null);
    setFouten([]);
    setPunten(0);
    setStreepjeKeuze(null);
  };

  const kiesStreepjeWaarde = (id) => {
    setStreepjeKeuze(id);
    if (zijnGelijk(Number(id), schaal.stap)) {
      setGevraagd(new Set([...gevraagd, schaal.id]));
    } else if (!fouten.includes('streepjesvraag')) {
      setFouten([...fouten, 'streepjesvraag']);
    }
  };

  const eigenWaarde = naarMl(leesGetal(invoer), eenheid);
  const markers = [];
  if (status === 'fout') {
    const eigen = opgave.vorm === 'vullen' ? opgave.niveau : eigenWaarde;
    if (eigen !== null && eigen >= 0 && eigen <= schaal.max && !zijnGelijk(eigen, juist)) {
      markers.push({ waarde: eigen, kleur: ROOD, label: 'jij', gestippeld: true });
    }
    markers.push({ waarde: juist, kleur: GROEN, label: 'goed' });
  }
  const niveau = opgave.vorm === 'vullen' ? opgave.niveau : juist;

  const beeld = (
    <div
      className="flex flex-wrap items-center justify-center gap-4 outline-none"
      tabIndex={opgave.vorm === 'vullen' ? 0 : -1}
      onKeyDown={(event) => {
        if (opgave.vorm !== 'vullen') return;
        if (event.key === 'ArrowUp') { event.preventDefault(); schuif(1); }
        if (event.key === 'ArrowDown') { event.preventDefault(); schuif(-1); }
        if (event.key === 'Enter') controleer();
      }}
    >
      <Maatcilinder
        schaal={schaal}
        niveau={niveau}
        markers={markers}
        titel={schaal.naam}
        onKies={opgave.vorm === 'vullen' && status === 'vraag' ? zetNiveau : undefined}
      />
      <div className="flex w-56 flex-col gap-3">
        <Loep schaal={schaal} niveau={niveau} markers={markers} />
        {opgave.vorm === 'vullen' && (
          <div className="flex items-center justify-center gap-3">
            <Knop variant="rustig" onClick={() => schuif(-1)} disabled={status !== 'vraag'}><Minus size={20} aria-label="Eén streepje lager" /></Knop>
            <span className="text-sm font-bold">1 streepje</span>
            <Knop variant="rustig" onClick={() => schuif(1)} disabled={status !== 'vraag'}><Plus size={20} aria-label="Eén streepje hoger" /></Knop>
          </div>
        )}
      </div>
    </div>
  );

  let paneel;
  if (status === 'goed') {
    paneel = (
      <>
        <CheckGoed
          groot={`${juistTekst} ml`}
          klein={`= ${juistTekst} cm³${schaal.max >= 1000 ? ` = ${formatGetal(juist / 1000, 2)} l` : ''}`}
          punten={punten}
          onVolgende={volgende}
          knopTekst={opgave.nr + 1 >= aantal ? 'Naar de uitslag' : 'Volgende'}
        />
        {melding && <p className="font-bold text-[#B4520E]">{melding.tekst}</p>}
      </>
    );
  } else if (status === 'fout') {
    paneel = (
      <>
        <FoutKaart tekst={melding?.tekst} stappen={melding?.stappen} />
        <Knop onClick={volgende} autoFocus>{opgave.nr + 1 >= aantal ? 'Naar de uitslag' : 'Begrepen, volgende'}</Knop>
      </>
    );
  } else {
    paneel = (
      <>
        <p className="text-sm font-extrabold uppercase tracking-wide text-[#066A99]">{schaal.naam}</p>
        {opgave.vorm === 'vullen' ? (
          <>
            <Opdracht>Vul de {schaal.soort === 'spuit' ? 'maatspuit' : 'maatcilinder'} tot precies {juistTekst} ml.</Opdracht>
            <p className="text-[15px] font-semibold text-[#5B5648]">Klik op de hoogte in de cilinder. Stel bij met plus en min, of met de pijltjestoetsen.</p>
          </>
        ) : vraagStreepje ? (
          <>
            <Opdracht>Eerst dit: hoeveel ml is één streepje op deze {schaal.soort === 'spuit' ? 'maatspuit' : 'maatcilinder'}?</Opdracht>
            <Keuzes
              opties={streepjesKeuzes(schaal).map((waarde) => ({ id: String(waarde), tekst: `${formatGetal(waarde)} ml` }))}
              gekozen={streepjeKeuze}
              goed={String(schaal.stap)}
              disabled={false}
              onKies={kiesStreepjeWaarde}
            />
            {streepjeKeuze && !zijnGelijk(Number(streepjeKeuze), schaal.stap) && (
              <FoutKaart tekst="Zoek twee getallen en tel de stappen ertussen. Deel het verschil door het aantal stappen." />
            )}
          </>
        ) : (
          <>
            <Opdracht>Lees de {schaal.soort === 'spuit' ? 'maatspuit' : 'maatcilinder'} af. Kies ook de eenheid.</Opdracht>
            <GetalVeld waarde={invoer} onChange={setInvoer} label="Volume" onEnter={controleer} autoFocus breed />
            <EenheidKeuze waarde={eenheid} onChange={setEenheid} />
          </>
        )}
        {melding && <FoutKaart titel={poging === 2 ? 'Probeer het nog een keer' : 'Let op'} tekst={melding.tekst} stappen={melding.stappen} />}
        {hint && <HintKaart stappen={route.slice(0, 3)} />}
        {!vraagStreepje || opgave.vorm === 'vullen' ? (
          <div className="mt-auto flex flex-wrap gap-2">
            <Knop onClick={controleer}>Controleer</Knop>
            {!hint && <Knop variant="hulp" onClick={() => setHint(true)}>Hint</Knop>}
          </div>
        ) : null}
      </>
    );
  }

  return <Split beeld={beeld} paneel={paneel} />;
}
