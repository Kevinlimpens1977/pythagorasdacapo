import { useState } from 'react';
import { BookOpen, CheckCircle2, Lightbulb } from 'lucide-react';
import { CheckGoed, EenheidKeuze, FoutKaart, GetalVeld, Keuzes, Knop, Split } from '../volumeBerekenen/componenten/Ui';
import { leesGetal } from '../volumeBerekenen/volumeLogic';
import { speelFout, speelGoed } from '../volumeBerekenen/volumeSounds';
import { EENHEDEN, getalGelijk } from './dichtheidLogic';
import { useBoek } from './componenten/boekContext';
import Kladblad from './componenten/Kladblad';
import Rekenmachine from './componenten/Rekenmachine';

// Speelt één opgave af als een rij stappen. Een stap:
//   { id, soort: 'getal' | 'eenheid' | 'hand' | 'stof' | 'keuze' | 'actie', regel, opdracht, tip,
//     velden: [{ key, label, eenheid, juist, beoordeel }]   (getal)
//     juist | isGoed(waarde, w)                              (eenheid, hand, stof, keuze)
//     opties, foutTekst(waarde), uitleg(waarde)              (keuze)
//     knop                                                   (actie: de knop naast het slepen)
//     oplossing(w), vooraf, telt, rekenmachine }
// `maakStappen(w)` krijgt de waarden tot nu toe, zodat de leerling met zijn eigen
// (goed gerekende) getallen doorrekent. Een stap met `vooraf` is al ingevuld (fading).
// Per stap: in één keer goed telt 1, na verbetering een half, daarna niets.
// Na twee fouten staat het antwoord erbij en gaat de leerling door.

const sleutel = (stap) => stap.key || stap.id;

function pasToe(w, stap, waarde) {
  if (stap.soort === 'getal') {
    const nieuw = { ...w };
    for (const veld of stap.velden) nieuw[veld.key] = waarde[veld.key];
    return nieuw;
  }
  return { ...w, [sleutel(stap)]: waarde };
}

function juisteWaarde(stap, w) {
  if (stap.soort === 'getal') return Object.fromEntries(stap.velden.map((veld) => [veld.key, veld.juist]));
  if (stap.soort === 'actie') return true;
  return typeof stap.juist === 'function' ? stap.juist(w) : stap.juist;
}

function vooruit(maakStappen, w, index) {
  let waarden = w;
  let i = index;
  let stappen = maakStappen(waarden);
  while (i < stappen.length && stappen[i].vooraf) {
    waarden = pasToe(waarden, stappen[i], juisteWaarde(stappen[i], waarden));
    i += 1;
    stappen = maakStappen(waarden);
  }
  return { w: waarden, index: i };
}

export default function OpgaveSpeler({
  maakStappen, beginWaarden = {}, kladblad = null, beeld, kop, niveau = 'D', telt = true,
  samenvatting, knopTekst = 'Volgende', onKlaar
}) {
  const [start] = useState(() => vooruit(maakStappen, beginWaarden, 0));
  const [w, setW] = useState(start.w);
  const [index, setIndex] = useState(start.index);
  const [invoer, setInvoer] = useState({});
  const [poging, setPoging] = useState(1);
  const [melding, setMelding] = useState(null);
  const [fouten, setFouten] = useState([]);
  const [score, setScore] = useState({ som: 0, aantal: 0, minpunten: 0 });
  const boek = useBoek();

  const stappen = maakStappen(w);
  const stap = stappen[index] || null;
  const klaar = !stap;
  const telStap = (s) => telt && s.telt !== false && s.soort !== 'actie';

  const naarVolgende = (nieuweW) => {
    const verder = vooruit(maakStappen, nieuweW, index + 1);
    setW(verder.w);
    setIndex(verder.index);
    setInvoer({});
    setPoging(1);
    setMelding(null);
  };

  const registreer = (waarde) => {
    if (!telStap(stap)) return;
    setScore((oud) => ({ som: oud.som + waarde, aantal: oud.aantal + 1, minpunten: oud.minpunten + (waarde === 1 ? 0 : 1) }));
  };

  // Goed: door (of eerst de uitleg laten zien). Fout: tip, tweede kans, dan het antwoord.
  const verwerk = (goed, waarde, foutTekst, uitleg = null) => {
    if (goed) {
      speelGoed();
      registreer(poging === 1 ? 1 : 0.5);
      const nieuweW = pasToe(w, stap, waarde);
      if (uitleg) {
        setW(nieuweW);
        setMelding({ goed: true, tekst: uitleg, verder: true, w: nieuweW });
      } else {
        naarVolgende(nieuweW);
      }
      return;
    }
    speelFout();
    setFouten((oud) => [...oud, stap.id]);
    if (poging === 1) {
      setPoging(2);
      setMelding({ tekst: foutTekst });
      return;
    }
    registreer(0);
    const juist = juisteWaarde(stap, w);
    const nieuweW = pasToe(w, stap, juist);
    setW(nieuweW);
    setMelding({ tekst: stap.oplossing ? stap.oplossing(nieuweW) : foutTekst, verder: true, w: nieuweW, hulp: true });
  };

  const controleer = () => {
    if (!stap || stap.soort !== 'getal' || melding?.verder) return;
    const waarden = {};
    for (const veld of stap.velden) {
      const getal = leesGetal(invoer[veld.key]);
      if (getal === null) { setMelding({ tekst: 'Vul een getal in. Een komma mag.' }); return; }
      waarden[veld.key] = getal;
    }
    const fout = stap.velden
      .map((veld) => {
        const uitslag = veld.beoordeel ? veld.beoordeel(invoer[veld.key], w) : { goed: getalGelijk(invoer[veld.key], veld.juist) };
        return uitslag.goed ? null : (uitslag.tekst || veld.fout || 'Nog niet goed. Kijk nog eens goed.');
      })
      .find(Boolean);
    verwerk(!fout, waarden, fout);
  };

  const kies = (waarde) => {
    if (!stap || melding?.verder) return;
    const goed = stap.isGoed ? stap.isGoed(waarde, w) : waarde === stap.juist;
    verwerk(goed, waarde, stap.foutTekst?.(waarde) || 'Nog niet goed. Probeer het nog een keer.', goed && stap.uitleg ? stap.uitleg(waarde) : null);
  };

  const klaarActie = (waarde = true) => {
    if (!stap || stap.soort !== 'actie') return;
    naarVolgende(pasToe(w, stap, waarde));
  };

  const gebruik = (tekst) => {
    if (!stap?.velden) return;
    const leeg = stap.velden.find((veld) => !String(invoer[veld.key] || '').trim()) || stap.velden[stap.velden.length - 1];
    setInvoer((oud) => ({ ...oud, [leeg.key]: tekst }));
  };

  const rondAf = () => {
    const punten = score.aantal ? Math.round((10 * score.som) / score.aantal) : 10;
    onKlaar?.({ punten, fouten, onderdelen: score.aantal, minpunten: score.minpunten, w });
  };

  const hulp = Boolean(melding?.hulp);
  const beeldInhoud = beeld({ stap, w, klaarActie, kies, hulp, klaar });
  const toonTip = niveau !== 'D' && stap?.tip && !melding;

  let paneel;
  if (klaar) {
    const tekst = samenvatting ? samenvatting(w) : { groot: 'Klaar' };
    const punten = score.aantal ? Math.round((10 * score.som) / score.aantal) : 10;
    paneel = (
      <>
        {kop && <p className="text-sm font-extrabold uppercase tracking-wide text-[#066A99]">{kop}</p>}
        {kladblad && <Kladblad regels={kladblad(w)} />}
        <CheckGoed groot={tekst.groot} klein={tekst.klein} punten={telt ? punten : undefined} onVolgende={rondAf} knopTekst={knopTekst} />
      </>
    );
  } else {
    paneel = (
      <>
        {kop && <p className="text-sm font-extrabold uppercase tracking-wide text-[#066A99]">{kop}</p>}
        <p className="text-lg font-bold leading-snug">{stap.opdracht}</p>
        {toonTip && (
          <p className="flex items-start gap-2 rounded-xl border-2 border-[#F47A20] bg-[#FDE7D6] px-3 py-1.5 text-[15px] font-bold">
            <Lightbulb size={18} className="mt-0.5 shrink-0 text-[#B4520E]" aria-hidden="true" /> {stap.tip}
          </p>
        )}
        {kladblad && <Kladblad regels={kladblad(w)} actief={stap.regel} />}

        {stap.soort === 'getal' && !melding?.verder && (
          <div className={stap.velden.length > 1 ? 'flex flex-wrap items-center gap-2 text-lg font-bold' : 'flex flex-col gap-2'}>
            {stap.velden.length > 1 ? stap.velden.map((veld, i) => (
              <span key={`${stap.id}-${veld.key}`} className="flex items-center gap-2">
                <span>{veld.label}</span>
                <GetalVeld
                  waarde={invoer[veld.key] || ''}
                  onChange={(waarde) => setInvoer((oud) => ({ ...oud, [veld.key]: waarde }))}
                  onEnter={controleer}
                  autoFocus={i === 0}
                />
              </span>
            )) : stap.velden.map((veld, i) => (
              <GetalVeld
                key={`${stap.id}-${veld.key}`}
                waarde={invoer[veld.key] || ''}
                onChange={(waarde) => setInvoer((oud) => ({ ...oud, [veld.key]: waarde }))}
                label={veld.label}
                eenheid={veld.eenheid}
                onEnter={controleer}
                autoFocus={i === 0}
                breed
              />
            ))}
          </div>
        )}
        {stap.soort === 'eenheid' && !melding?.verder && <EenheidKeuze waarde={null} onChange={kies} eenheden={EENHEDEN} />}
        {stap.soort === 'stof' && !melding?.verder && (
          <Knop onClick={() => boek.open(kies)} autoFocus><BookOpen size={18} aria-hidden="true" />Open het boekje en kies</Knop>
        )}
        {stap.soort === 'keuze' && (
          <Keuzes opties={stap.opties} gekozen={w[sleutel(stap)] ?? null} goed={melding?.verder ? w[sleutel(stap)] : null} disabled={Boolean(melding?.verder)} onKies={kies} />
        )}
        {stap.soort === 'actie' && stap.knop && <Knop onClick={() => klaarActie()} autoFocus>{stap.knop}</Knop>}
        {stap.soort === 'hand' && !melding?.verder && <p className="text-[15px] font-semibold text-[#5B5648]">Sleep de hand in de driehoek, of kies een letter onder de driehoek.</p>}

        {melding && (melding.goed ? (
          <p className="flex items-start gap-2 rounded-xl border-2 border-[#2E9D63] bg-[#DFF2E7] px-3 py-2 font-bold text-[#0B0D0F]">
            <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#237A4D]" aria-hidden="true" /> {melding.tekst}
          </p>
        ) : (
          <FoutKaart titel={melding.verder ? 'Zo zit het' : poging === 2 ? 'Probeer het nog een keer' : 'Let op'} tekst={melding.tekst} />
        ))}

        {stap.rekenmachine && !melding?.verder && <Rekenmachine onGebruik={gebruik} />}

        <div className="mt-auto flex flex-wrap gap-2">
          {melding?.verder ? (
            <Knop onClick={() => naarVolgende(melding.w || w)} autoFocus>Verder</Knop>
          ) : stap.soort === 'getal' ? (
            <Knop onClick={controleer}>Controleer</Knop>
          ) : null}
        </div>
      </>
    );
  }

  return <Split beeld={beeldInhoud} paneel={paneel} />;
}
