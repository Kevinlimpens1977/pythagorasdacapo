import { useState } from 'react';
import Balk from './componenten/Balk';
import MeetPaneel from './componenten/MeetPaneel';
import { CheckGoed, FoutKaart, GetalVeld, HintKaart, Knop, Opdracht, Split, Stappen } from './componenten/Ui';
import {
  BALK_PUNTEN, beoordeelOmrekening, beoordeelVolume, formatGetal, leesGetal, maakBalken, maatGoed,
  REKENFEEDBACK, REKENFOUTEN, rondAf
} from './volumeLogic';
import { speelFout, speelGoed } from './volumeSounds';

const MAATNAAM = { l: 'lengte', b: 'breedte', h: 'hoogte' };

// ---------- KIJK: kubusjes, formule, omrekenen ----------

export function KijkBalk({ onKlaar }) {
  const [stap, setStap] = useState(0);

  const delen = [
    {
      titel: 'Voorbeeld 1 van 3',
      tekst: 'Een blokje is 5 cm lang, 3 cm breed en 2 cm hoog. Vul het met kubusjes van 1 cm³.',
      beeld: <Balk l={5} b={3} h={2} lagen={1} />,
      uitleg: ['De bodem: 5 × 3 = 15 kubusjes.']
    },
    {
      titel: 'Voorbeeld 1 van 3',
      tekst: 'Er passen 2 lagen op elkaar.',
      beeld: <Balk l={5} b={3} h={2} lagen={2} />,
      uitleg: ['De bodem: 5 × 3 = 15 kubusjes.', '2 lagen: 15 × 2 = 30 kubusjes.', 'V = 5 × 3 × 2 = 30 cm³.']
    },
    {
      titel: 'Voorbeeld 2 van 3',
      tekst: 'Een rechthoekig blok heeft een vaste vorm. Gebruik de formule.',
      beeld: <Balk l={6} b={2} h={3} toonMaten kleur="hout" />,
      uitleg: ['V = lengte × breedte × hoogte', 'Invullen: V = 6 × 2 × 3', 'V = 36 cm³']
    },
    {
      titel: 'Voorbeeld 3 van 3',
      tekst: 'Een doosje is 8 cm lang, 4 cm breed en 3 cm hoog. Hoeveel ml past erin?',
      beeld: <Balk l={8} b={4} h={3} toonMaten kleur="hout" />,
      uitleg: ['V = 8 × 4 × 3 = 96 cm³', '1 cm³ = 1 ml', 'Er past 96 ml in.']
    }
  ];
  const deel = delen[stap];

  return (
    <Split
      beeld={<div className="w-full max-w-xl">{deel.beeld}</div>}
      paneel={(
        <>
          <p className="text-sm font-extrabold uppercase tracking-wide text-[#066A99]">{deel.titel}</p>
          <Opdracht>{deel.tekst}</Opdracht>
          <Stappen stappen={deel.uitleg} actief={deel.uitleg.length - 1} />
          {stap < delen.length - 1 ? (
            <Knop onClick={() => setStap(stap + 1)} autoFocus>Volgende</Knop>
          ) : (
            <Knop onClick={onKlaar} autoFocus>Zelf meten en rekenen</Knop>
          )}
        </>
      )}
    />
  );
}

// ---------- DOE: zes blokken ----------

function beginStap(balk) {
  return balk.gegeven ? 'volume' : 'l';
}

export function DoeBalk({ onOpgave }) {
  const [balken] = useState(() => maakBalken());
  const [index, setIndex] = useState(0);
  const balk = balken[index];
  const [stap, setStap] = useState(() => beginStap(balken[0]));
  const [invoer, setInvoer] = useState('');
  const [poging, setPoging] = useState(1);
  const [maten, setMaten] = useState({});
  const [volume, setVolume] = useState(null);
  const [punten, setPunten] = useState(0);
  const [fouten, setFouten] = useState([]);
  const [melding, setMelding] = useState(null);
  const [toonJuist, setToonJuist] = useState(false);
  const [hint, setHint] = useState(false);

  const gegeven = Boolean(balk.gegeven);
  const puntenVolume = gegeven ? 5 : BALK_PUNTEN.volume;
  const puntenOmrekenen = gegeven ? 5 : BALK_PUNTEN.omrekenen;
  const eigen = gegeven ? { l: balk.l, b: balk.b, h: balk.h } : maten;
  const eigenVolume = eigen.l !== undefined && eigen.b !== undefined && eigen.h !== undefined
    ? rondAf(eigen.l * eigen.b * eigen.h, 3)
    : null;

  const volgendeStap = (huidig) => ({ l: 'b', b: 'h', h: 'volume', volume: 'omrekenen', omrekenen: 'klaar' }[huidig]);

  const naar = (nieuweStap) => {
    setStap(nieuweStap);
    setInvoer('');
    setPoging(1);
    setMelding(null);
    setToonJuist(false);
    setHint(false);
  };

  const controleer = () => {
    if (stap === 'klaar') return;
    if (leesGetal(invoer) === null) {
      setMelding({ tekst: 'Vul een getal in.' });
      return;
    }

    if (['l', 'b', 'h'].includes(stap)) {
      const juist = balk[stap];
      if (maatGoed(invoer, juist)) {
        speelGoed();
        setPunten((p) => p + (poging === 1 ? BALK_PUNTEN.maat : 1));
        setMaten((oud) => ({ ...oud, [stap]: leesGetal(invoer) }));
        naar(volgendeStap(stap));
        return;
      }
      speelFout();
      const getal = leesGetal(invoer);
      const vanafEen = Math.abs(getal - (juist + 1)) < 0.11;
      const tekst = vanafEen
        ? 'Je zit 1 cm te hoog. Leg de 0 van de liniaal precies tegen de rand.'
        : 'Nog niet goed. Leg de 0 tegen het begin van de gele rand en lees af waar de rand ophoudt.';
      setFouten((oud) => [...oud, vanafEen ? 'liniaalVanafEen' : 'meten']);
      if (poging === 1) {
        setPoging(2);
        setMelding({ tekst });
      } else {
        setToonJuist(true);
        setMaten((oud) => ({ ...oud, [stap]: juist }));
        setMelding({ tekst: `De ${MAATNAAM[stap]} is ${formatGetal(juist)} cm. Kijk hoe de liniaal moet liggen.`, verder: true });
      }
      return;
    }

    if (stap === 'volume') {
      const uitslag = beoordeelVolume({ invoer, ...eigen });
      if (uitslag === REKENFOUTEN.GOED) {
        speelGoed();
        setPunten((p) => p + (poging === 1 && !hint ? puntenVolume : Math.floor(puntenVolume / 2)));
        setVolume(eigenVolume);
        naar('omrekenen');
        return;
      }
      speelFout();
      setFouten((oud) => [...oud, uitslag]);
      if (poging === 1) {
        setPoging(2);
        setMelding({ tekst: REKENFEEDBACK[uitslag] || REKENFEEDBACK.anders });
      } else {
        setVolume(eigenVolume);
        setMelding({
          tekst: `${REKENFEEDBACK[uitslag] || ''} V = ${formatGetal(eigen.l)} × ${formatGetal(eigen.b)} × ${formatGetal(eigen.h)} = ${formatGetal(eigenVolume)} cm³.`,
          verder: 'omrekenen'
        });
      }
      return;
    }

    if (stap === 'omrekenen') {
      const cm3 = volume ?? eigenVolume;
      if (beoordeelOmrekening({ invoer, volumeCm3: cm3, doel: balk.doel })) {
        speelGoed();
        setPunten((p) => p + (poging === 1 ? puntenOmrekenen : Math.floor(puntenOmrekenen / 2)));
        naar('klaar');
        return;
      }
      speelFout();
      setFouten((oud) => [...oud, 'omrekenen']);
      const uitleg = balk.doel === 'l'
        ? '1 liter = 1 dm³ = 1000 cm³. Deel door 1000.'
        : '1 cm³ = 1 ml. Het getal blijft hetzelfde.';
      if (poging === 1) {
        setPoging(2);
        setMelding({ tekst: uitleg });
      } else {
        const antwoord = balk.doel === 'l' ? `${formatGetal(cm3 / 1000)} l` : `${formatGetal(cm3)} ml`;
        setMelding({ tekst: `${uitleg} Het antwoord is ${antwoord}.`, verder: 'klaar' });
      }
    }
  };

  const verderNaFout = () => {
    if (melding?.verder === true) naar(volgendeStap(stap));
    else if (melding?.verder) naar(melding.verder);
  };

  const volgendeBalk = () => {
    onOpgave({ id: balk.id, punten: Math.min(10, punten), fouten });
    if (index + 1 >= balken.length) return;
    const nieuw = balken[index + 1];
    setIndex(index + 1);
    setMaten({});
    setVolume(null);
    setPunten(0);
    setFouten([]);
    naar(beginStap(nieuw));
  };

  const meetStap = ['l', 'b', 'h'].includes(stap);
  const meetInstelling = {
    l: { maatCm: balk.l, andereCm: balk.h, richting: 'horizontaal' },
    b: { maatCm: balk.b, andereCm: balk.h, richting: 'horizontaal' },
    h: { maatCm: balk.h, andereCm: balk.l, richting: 'verticaal' }
  }[stap];

  const beeld = (
    <div className="flex w-full flex-col items-center gap-3">
      <div className={meetStap ? 'w-full max-w-[260px]' : 'w-full max-w-lg'}>
        <Balk l={balk.l} b={balk.b} h={balk.h} accent={meetStap ? stap : null} toonMaten={gegeven || stap === 'klaar'} kleur={balk.id === 'aquarium' ? 'blauw' : 'hout'} />
      </div>
      {meetStap && (
        <div className="w-full max-w-2xl">
          <MeetPaneel key={`${index}-${stap}`} {...meetInstelling} kleur="#D9A066" toonJuist={toonJuist} />
        </div>
      )}
    </div>
  );

  const bekend = ['l', 'b', 'h'].filter((m) => eigen[m] !== undefined);
  const somRegel = `V = ${['l', 'b', 'h'].map((m) => (eigen[m] !== undefined ? formatGetal(eigen[m]) : '?')).join(' × ')}`;

  let paneel;
  if (stap === 'klaar') {
    const cm3 = volume ?? eigenVolume;
    paneel = (
      <CheckGoed
        groot={balk.doel === 'l' ? `${formatGetal(cm3 / 1000)} l` : `${formatGetal(cm3)} cm³`}
        klein={balk.doel === 'l' ? `${somRegel} = ${formatGetal(cm3)} cm³` : `${somRegel} = ${formatGetal(cm3)} cm³ = ${formatGetal(cm3)} ml`}
        punten={Math.min(10, punten)}
        onVolgende={volgendeBalk}
        knopTekst={index + 1 >= balken.length ? 'Naar de uitslag' : 'Volgend blok'}
      />
    );
  } else {
    paneel = (
      <>
        <p className="text-sm font-extrabold uppercase tracking-wide text-[#066A99]">Blok {index + 1} van {balken.length}: {balk.naam}</p>
        {meetStap && (
          <>
            <Opdracht>Meet de {MAATNAAM[stap]}. Sleep de liniaal tegen de gele rand.</Opdracht>
            <p className="text-[15px] font-semibold text-[#5B5648]">Leg de 0 precies aan het begin van de rand. Met de pijltjestoetsen schuift de liniaal 1 mm.</p>
            <GetalVeld waarde={invoer} onChange={setInvoer} label={MAATNAAM[stap]} eenheid="cm" onEnter={controleer} autoFocus />
          </>
        )}
        {stap === 'volume' && (
          <>
            <Opdracht>{gegeven ? `Het ${balk.naam.toLowerCase()} is ${formatGetal(balk.l)} cm lang, ${formatGetal(balk.b)} cm breed en ${formatGetal(balk.h)} cm hoog. Bereken het volume.` : 'Bereken het volume met jouw maten.'}</Opdracht>
            <p className="rounded-xl bg-[#FFF0B8] px-3 py-2 font-bold">V = lengte × breedte × hoogte<br />{somRegel}</p>
            <GetalVeld waarde={invoer} onChange={setInvoer} label="V =" eenheid="cm³" onEnter={controleer} autoFocus breed />
          </>
        )}
        {stap === 'omrekenen' && (
          <>
            <Opdracht>{balk.doel === 'l' ? 'Hoeveel liter water past erin?' : 'Hoeveel ml past erin?'}</Opdracht>
            <p className="rounded-xl bg-[#FFF0B8] px-3 py-2 font-bold">{formatGetal(volume ?? eigenVolume)} cm³ = ?</p>
            <GetalVeld waarde={invoer} onChange={setInvoer} label="" eenheid={balk.doel === 'l' ? 'l' : 'ml'} onEnter={controleer} autoFocus breed />
          </>
        )}
        {bekend.length > 0 && meetStap && (
          <p className="text-sm font-bold text-[#5B5648]">Gemeten: {bekend.map((m) => `${MAATNAAM[m]} ${formatGetal(eigen[m])} cm`).join(', ')}</p>
        )}
        {melding && <FoutKaart titel={melding.verder ? 'Zo zit het' : poging === 2 ? 'Probeer het nog een keer' : 'Let op'} tekst={melding.tekst} />}
        {hint && stap === 'volume' && <HintKaart stappen={['Reken eerst de bodem uit: lengte × breedte.', 'Doe dat keer de hoogte.']} />}
        <div className="mt-auto flex flex-wrap gap-2">
          {melding?.verder ? (
            <Knop onClick={verderNaFout} autoFocus>Verder</Knop>
          ) : (
            <>
              <Knop onClick={controleer}>Controleer</Knop>
              {stap === 'volume' && !hint && <Knop variant="hulp" onClick={() => setHint(true)}>Hint</Knop>}
            </>
          )}
        </div>
      </>
    );
  }

  return <Split beeld={beeld} paneel={paneel} />;
}
