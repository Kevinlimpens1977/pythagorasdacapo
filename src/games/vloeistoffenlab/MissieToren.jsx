import { useState } from 'react';
import { Info, RotateCcw } from 'lucide-react';
import { CheckGoed, FoutKaart, Keuzes, Knop, Split } from '../volumeBerekenen/componenten/Ui';
import { VoorwerpIcoon } from '../volumeBerekenen/componenten/Voorwerp';
import { speelFout, speelGoed, speelPlons } from '../volumeBerekenen/volumeSounds';
import Sleepbaar from '../dichtheid/componenten/Sleepbaar';
import Fles from './componenten/Fles';
import Toren from './componenten/Toren';
import { vakInProcent } from './componenten/torenGeometrie';
import { fRho2, plekInToren, plekKeuzes, TOREN, TOREN_VOORWERPEN, vloeistof } from './vloeistofLogic';

// Deel A: zet de vijf vloeistoffen in de goede volgorde (sleep een fles naar een vak).
// Deel B: voorspel per voorwerp waar het in de toren blijft; daarna valt het erin.

// Leerlingen vragen terecht: afwasmiddel lost toch op in water? (Kevin, 30 sep 2026)
function MengenUitleg() {
  return (
    <div className="flex items-start gap-2 rounded-xl border-2 border-[#087EB5] bg-[#E1F0F8] px-3 py-2 text-[15px] font-semibold">
      <Info size={20} className="mt-0.5 shrink-0 text-[#066A99]" aria-hidden="true" />
      <p>
        <strong>Mengen ze niet?</strong> Honing, afwasmiddel en water mengen wel, maar heel langzaam. Daarom zie je eerst lagen.
        Roer je, dan mengen ze. Olie mengt echt niet met water: die laag houdt het water en de spiritus uit elkaar.
      </p>
    </div>
  );
}

function Volgorde({ onKlaar }) {
  const [flessen] = useState(() => [...TOREN].sort(() => Math.random() - 0.5));
  const [vakken, setVakken] = useState([null, null, null, null, null]);
  const [poging, setPoging] = useState(1);
  const [melding, setMelding] = useState(null);
  const [klaar, setKlaar] = useState(false);
  // Vaste neerzetvakken; de ref-objecten krijgen hun element via een callback.
  const [doelen] = useState(() => [0, 1, 2, 3, 4].map((i) => ({ id: i, ref: { current: null } })));

  const leg = (id, vak) => setVakken((oud) => {
    const nieuw = oud.map((x) => (x === id ? null : x));
    const doel = vak ?? nieuw.findIndex((x) => x === null);
    if (doel < 0) return oud;
    nieuw[doel] = id;
    return nieuw;
  });
  const vol = vakken.every(Boolean);

  const controleer = () => {
    const goed = vakken.every((id, i) => id === TOREN[i]);
    if (goed) {
      speelGoed();
      speelPlons();
      setKlaar(true);
      setMelding(null);
      return;
    }
    speelFout();
    if (poging === 1) {
      setPoging(2);
      setMelding({ tekst: 'Nog niet goed. Kijk naar de dichtheden: de grootste dichtheid hoort onderop, in vak 1.' });
    } else {
      setVakken([...TOREN]);
      setKlaar(true);
      setMelding({ tekst: 'Zo hoort het: honing (1,42) onderop, dan afwasmiddel (1,06), water (1,00), olie (0,92) en spiritus (0,79) bovenop.', verder: true });
    }
  };

  const punten = klaar && !melding?.verder ? (poging === 1 ? 10 : 5) : 0;
  return (
    <Split
      beeld={(
        <div className="flex w-full flex-wrap items-end justify-center gap-4">
          <div className="relative">
            <Toren lagen={klaar ? TOREN : []} vakken={!klaar} namen={klaar} />
            {!klaar && vakken.map((id, i) => (
              <div key={`vak-${i}`} ref={(el) => { doelen[i].ref.current = el; }} className="absolute flex items-center justify-center" style={vakInProcent(i)}>
                {id && (
                  <button type="button" onClick={() => setVakken((oud) => oud.map((x, j) => (j === i ? null : x)))} className="rounded-lg border-2 border-[#0B0D0F] px-2 py-0.5 text-xs font-extrabold" style={{ background: vloeistof(id).kleur }} aria-label={`${vloeistof(id).naam} uit vak ${i + 1} halen`}>
                    {vloeistof(id).naam}
                  </button>
                )}
              </div>
            ))}
          </div>
          {!klaar && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-2">
              {flessen.filter((id) => !vakken.includes(id)).map((id) => (
                <Sleepbaar key={id} doelen={doelen.filter((doel) => vakken[doel.id] === null)} onDrop={(vak) => leg(id, vak)} label={`Fles ${vloeistof(id).naam}. Sleep naar een vak.`}>
                  <div className="flex flex-col items-center">
                    <Fles kleur={vloeistof(id).kleur} label={fRho2(vloeistof(id).rho)} className="h-24 w-14" />
                    <span className="text-xs font-extrabold">{vloeistof(id).naam}</span>
                  </div>
                </Sleepbaar>
              ))}
            </div>
          )}
        </div>
      )}
      paneel={(
        <>
          <p className="text-sm font-extrabold uppercase tracking-wide text-[#066A99]">Dichtheidstoren, deel 1: de lagen</p>
          {klaar && !melding?.verder ? (
            <>
              <CheckGoed groot="Goed gestapeld" klein="De grootste dichtheid ligt onderop, de kleinste bovenop." punten={punten} onVolgende={() => onKlaar(punten)} knopTekst="Nu de voorwerpen" />
              <MengenUitleg />
            </>
          ) : (
            <>
              <p className="text-lg font-bold leading-snug">Je schenkt vijf vloeistoffen voorzichtig in één glas. Dan mengen ze niet meteen en vormen ze lagen. In welke volgorde? Sleep elke fles naar een vak. Vak 1 is onderop.</p>
              <p className="text-[15px] font-semibold text-[#5B5648]">Op elke fles staat de dichtheid in g/cm³. Tik op een naam in het glas om hem terug te halen.</p>
              {melding && <FoutKaart titel={melding.verder ? 'Zo zit het' : 'Probeer het nog een keer'} tekst={melding.tekst} />}
              {melding?.verder && <MengenUitleg />}
              <div className="mt-auto flex flex-wrap gap-2">
                {melding?.verder ? (
                  <Knop onClick={() => onKlaar(0)} autoFocus>Nu de voorwerpen</Knop>
                ) : (
                  <>
                    <Knop onClick={controleer} disabled={!vol}>Schenk en controleer</Knop>
                    <Knop variant="rustig" onClick={() => setVakken([null, null, null, null, null])}><RotateCcw size={18} aria-hidden="true" />Opnieuw</Knop>
                  </>
                )}
              </div>
            </>
          )}
        </>
      )}
    />
  );
}

const XPOS = { kurk: 80, ijs: 160, druif: 95, gum: 150, knikker: 120 };

function Voorwerpen({ onKlaar }) {
  const [index, setIndex] = useState(0);
  const [keuzes] = useState(() => Object.fromEntries(TOREN_VOORWERPEN.map((v) => [v.id, plekKeuzes(v)])));
  const [gekozen, setGekozen] = useState(null);
  const [poging, setPoging] = useState(1);
  const [erin, setErin] = useState([]);
  const [score, setScore] = useState(0);
  const voorwerp = TOREN_VOORWERPEN[index];
  const k = keuzes[voorwerp?.id];
  const af = gekozen === k?.goed || poging > 2;

  const kies = (id) => {
    if (af) return;
    setGekozen(id);
    if (id === k.goed) {
      speelGoed();
      speelPlons();
      setScore((s) => s + (poging === 1 ? 1 : 0.5));
      setErin((oud) => [...oud, voorwerp.id]);
    } else {
      speelFout();
      if (poging === 2) setErin((oud) => [...oud, voorwerp.id]);
      setPoging(poging + 1);
    }
  };
  const volgende = () => {
    if (index + 1 >= TOREN_VOORWERPEN.length) {
      onKlaar(Math.round((10 * score) / TOREN_VOORWERPEN.length));
      return;
    }
    setIndex(index + 1);
    setGekozen(null);
    setPoging(1);
  };

  const inGlas = erin.map((id) => {
    const v = TOREN_VOORWERPEN.find((x) => x.id === id);
    return { vorm: v.vorm, x: XPOS[id], plek: plekInToren(v.rho) };
  });
  const uitleg = () => {
    const plek = plekInToren(voorwerp.rho);
    if (plek.id === 'bodem') return `ρ = ${fRho2(voorwerp.rho)}: groter dan alle vloeistoffen. Het zakt naar de bodem.`;
    const laag = vloeistof(TOREN[plek.laag]);
    if (plek.soort === 'zweeft') return `ρ = ${fRho2(voorwerp.rho)}: precies even groot als ${laag.lidwoord} ${laag.naam} (${fRho2(laag.rho)}). Het zweeft daarin.`;
    return `ρ = ${fRho2(voorwerp.rho)}: het zakt door de lichtere lagen en blijft liggen op ${laag.lidwoord} ${laag.naam} (${fRho2(laag.rho)}), want die laag is zwaarder.`;
  };

  return (
    <Split
      beeld={(
        <div className="flex w-full flex-wrap items-end justify-center gap-6">
          <Toren lagen={TOREN} voorwerpen={inGlas} namen />
          {voorwerp && !erin.includes(voorwerp.id) && (
            <div className="flex flex-col items-center gap-1">
              <VoorwerpIcoon vorm={voorwerp.vorm} className="h-24 w-24" />
              <span className="rounded-lg border-2 border-[#0B0D0F] bg-white px-2 text-sm font-extrabold">{voorwerp.naam}: ρ = {fRho2(voorwerp.rho)}</span>
            </div>
          )}
        </div>
      )}
      paneel={(
        <>
          <p className="text-sm font-extrabold uppercase tracking-wide text-[#066A99]">Dichtheidstoren, deel 2: voorwerp {index + 1} van {TOREN_VOORWERPEN.length}</p>
          <p className="text-lg font-bold leading-snug">Je laat een {voorwerp.naam} (ρ = {fRho2(voorwerp.rho)} g/cm³) in de toren vallen. Waar blijft het?</p>
          <Keuzes opties={k.opties} gekozen={gekozen} goed={af ? k.goed : null} disabled={af} onKies={kies} />
          {!af && gekozen && gekozen !== k.goed && <FoutKaart titel="Probeer het nog een keer" tekst="Vergelijk de dichtheid van het voorwerp met elke laag, van boven naar beneden." />}
          {af && (
            <p className={`rounded-xl px-3 py-2 font-bold ${gekozen === k.goed ? 'bg-[#DFF2E7] text-[#237A4D]' : 'bg-[#FADDDA] text-[#B42F25]'}`}>{uitleg()}</p>
          )}
          {af && (
            <div className="mt-auto">
              <Knop onClick={volgende} autoFocus>{index + 1 >= TOREN_VOORWERPEN.length ? 'Naar het oefenblad' : 'Volgend voorwerp'}</Knop>
            </div>
          )}
        </>
      )}
    />
  );
}

export default function MissieToren({ onOpgave, onKlaar }) {
  const [deel, setDeel] = useState('volgorde');
  if (deel === 'volgorde') {
    return (
      <Volgorde onKlaar={(punten) => {
        onOpgave({ id: 'toren-volgorde', punten, fouten: punten === 10 ? [] : ['toren'], onderdelen: 1, minpunten: punten === 10 ? 0 : 1 });
        setDeel('voorwerpen');
      }} />
    );
  }
  return (
    <Voorwerpen onKlaar={(punten) => {
      onOpgave({ id: 'toren-voorwerpen', punten, fouten: punten === 10 ? [] : ['toren-voorwerpen'], onderdelen: TOREN_VOORWERPEN.length, minpunten: 0 });
      onKlaar();
    }} />
  );
}
