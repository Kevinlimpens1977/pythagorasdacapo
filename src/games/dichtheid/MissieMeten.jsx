import { useRef, useState } from 'react';
import Balk from '../volumeBerekenen/componenten/Balk';
import { KLEUREN } from '../volumeBerekenen/componenten/balkKleuren';
import MeetPaneel from '../volumeBerekenen/componenten/MeetPaneel';
import { leesGetal, maatGoed } from '../volumeBerekenen/volumeLogic';
import { f, fRho, KIJK_METEN, maakMeetOpgaven, stof } from './dichtheidLogic';
import Formuledriehoek from './componenten/Formuledriehoek';
import Sleepbaar from './componenten/Sleepbaar';
import Weegschaal from './componenten/Weegschaal';
import OpgaveSpeler from './OpgaveSpeler';
import { kladbladRho, rekenStappenRho } from './rekenStappen';

const MAATNAAM = { l: 'lengte', b: 'breedte', h: 'hoogte' };

// Welke stappen al klaarstaan per niveau (spelopzet §4).
const VOORAF = {
  A: ['l', 'b', 'h', 'V', 'gewogen', 'm', 'hand', 'invullen', 'rho', 'stof'],
  B: ['l', 'b', 'h', 'V', 'gewogen', 'm', 'hand', 'eenheid', 'stof'],
  C: [],
  D: []
};

function maakStappenVoor(opgave, niveau) {
  const vooraf = VOORAF[niveau] || [];
  return (w) => {
    const meet = ['l', 'b', 'h'].map((maat) => ({
      id: maat, soort: 'getal', regel: 'gegeven', vooraf: vooraf.includes(maat),
      opdracht: `Meet de ${MAATNAAM[maat]}. Sleep de liniaal tegen de gele rand.`,
      tip: 'Leg de 0 precies aan het begin van de rand. Met de pijltjestoetsen schuift de liniaal 1 mm.',
      velden: [{
        key: maat, label: `${MAATNAAM[maat]} =`, eenheid: 'cm', juist: opgave[maat],
        beoordeel: (invoer) => ({
          goed: maatGoed(invoer, opgave[maat]),
          tekst: 'Nog niet goed. Leg de 0 tegen het begin van de gele rand en lees af waar de rand ophoudt.'
        })
      }],
      oplossing: () => `De ${MAATNAAM[maat]} is ${f(opgave[maat])} cm. Kijk hoe de liniaal moet liggen.`
    }));
    const eigenV = w.l !== undefined && w.b !== undefined && w.h !== undefined ? Math.round(w.l * w.b * w.h * 1000) / 1000 : null;
    const stappen = [
      ...meet,
      {
        id: 'V', soort: 'getal', regel: 'gegeven', rekenmachine: true, vooraf: vooraf.includes('V'),
        opdracht: 'Bereken het volume van het blokje.',
        tip: 'V = lengte × breedte × hoogte.',
        velden: [{
          key: 'V', label: 'V =', eenheid: 'cm³', juist: eigenV,
          beoordeel: (invoer) => ({
            goed: eigenV !== null && Math.abs((leesGetal(invoer) ?? -1) - eigenV) < 0.001,
            tekst: 'Nog niet goed. V = lengte × breedte × hoogte, met jouw gemeten maten.'
          })
        }],
        oplossing: () => `V = ${f(w.l)} × ${f(w.b)} × ${f(w.h)} = ${f(eigenV)} cm³.`
      },
      {
        id: 'gewogen', soort: 'actie', regel: 'gegeven', vooraf: vooraf.includes('gewogen'),
        opdracht: 'Sleep het blokje naar de weegschaal.',
        knop: 'Leg het blokje op de weegschaal'
      },
      {
        id: 'm', soort: 'getal', regel: 'gegeven', vooraf: vooraf.includes('m'),
        opdracht: 'Lees de massa af op de weegschaal.',
        tip: 'Neem het getal van het display over, met de komma.',
        velden: [{ key: 'm', label: 'm =', eenheid: 'g', juist: opgave.m, fout: 'Kijk nog eens goed naar het display van de weegschaal.' }],
        oplossing: () => `Het display zegt ${f(opgave.m, 1)} g, dus m = ${f(opgave.m, 1)} g.`
      }
    ];
    if (w.m === undefined || w.V === undefined) return [...stappen, ...rekenStappenRho({ ...w, m: w.m ?? 0, V: w.V ?? 1 }, vooraf)];
    return [...stappen, ...rekenStappenRho(w, vooraf)];
  };
}

function kladbladVoor(w) {
  const V = w.V !== undefined
    ? `V = ${f(w.V)} cm³`
    : `V = ${['l', 'b', 'h'].map((maat) => (w[maat] !== undefined ? f(w[maat]) : '…')).join(' × ')}`;
  return kladbladRho(w, `m = ${w.m !== undefined ? f(w.m) : '…'} g    ${V}`);
}

// Het blokje als tekening, klein genoeg om op de weegschaal te leggen.
function Blokje({ opgave, breedte = 'w-36' }) {
  return (
    <div className={breedte}>
      <Balk l={opgave.l} b={opgave.b} h={opgave.h} kleur={stof(opgave.stof)?.kleur || 'blauw'} />
    </div>
  );
}

function MeetBeeld({ opgave, stap, w, klaarActie, kies, hulp }) {
  const weegRef = useRef(null);
  const kleur = stof(opgave.stof)?.kleur || 'blauw';
  const meetStap = stap && ['l', 'b', 'h'].includes(stap.id);

  if (meetStap) {
    const instelling = {
      l: { maatCm: opgave.l, andereCm: opgave.h, richting: 'horizontaal' },
      b: { maatCm: opgave.b, andereCm: opgave.h, richting: 'horizontaal' },
      h: { maatCm: opgave.h, andereCm: opgave.l, richting: 'verticaal' }
    }[stap.id];
    return (
      <div className="flex w-full flex-col items-center gap-3">
        <div className="w-full max-w-[240px]">
          <Balk l={opgave.l} b={opgave.b} h={opgave.h} accent={stap.id} kleur={kleur} />
        </div>
        <div className="w-full max-w-2xl">
          <MeetPaneel key={stap.id} {...instelling} kleur={(KLEUREN[kleur] || KLEUREN.blauw).voor} toonJuist={hulp} />
        </div>
      </div>
    );
  }

  const gewogen = Boolean(w.gewogen);
  const weegStap = stap?.id === 'gewogen';
  return (
    <div className="flex w-full flex-wrap items-end justify-center gap-6">
      <div className="flex min-h-[150px] w-40 items-end justify-center">
        {!gewogen && (
          <Sleepbaar doelen={[{ id: 'weegschaal', ref: weegRef }]} onDrop={() => klaarActie()} disabled={!weegStap} label="Blokje. Sleep het naar de weegschaal.">
            <Blokje opgave={opgave} />
          </Sleepbaar>
        )}
      </div>
      <Weegschaal ref={weegRef} massa={gewogen ? opgave.m : null} actief={weegStap} className="w-60">
        {gewogen && <Blokje opgave={opgave} breedte="w-28" />}
      </Weegschaal>
      {w.V !== undefined && gewogen && w.m !== undefined && (
        <Formuledriehoek handOp={w.hand || null} onLeg={stap?.soort === 'hand' ? kies : null} klein={stap?.soort !== 'hand'} />
      )}
    </div>
  );
}

function Opgave({ opgave, niveau, telt, kop, knopTekst, onKlaar }) {
  const [maakStappen] = useState(() => maakStappenVoor(opgave, niveau));
  return (
    <OpgaveSpeler
      maakStappen={maakStappen}
      kladblad={kladbladVoor}
      niveau={niveau}
      telt={telt}
      kop={kop}
      knopTekst={knopTekst}
      beeld={(ctx) => <MeetBeeld opgave={opgave} {...ctx} />}
      samenvatting={(w) => ({
        groot: `${fRho(w.rho)} g/cm³`,
        klein: `ρ = ${f(w.m)} : ${f(w.V)}. Dit blokje is van ${stof(w.stof)?.naam || stof(opgave.stof).naam}.`
      })}
      onKlaar={onKlaar}
    />
  );
}

export function KijkMeten({ onKlaar }) {
  const [index, setIndex] = useState(0);
  const opgave = KIJK_METEN[index];
  const volgende = () => (index + 1 >= KIJK_METEN.length ? onKlaar() : setIndex(index + 1));
  const uitleg = { A: 'Alles staat klaar. Kies alleen de eenheid.', B: 'Vul de formule in en reken uit.', C: 'Nu doe je alles zelf, met tips.' }[opgave.niveau];
  return (
    <Opgave
      key={opgave.id}
      opgave={{ ...opgave, V: opgave.l * opgave.b * opgave.h }}
      niveau={opgave.niveau}
      telt={false}
      kop={`Voorbeeld ${index + 1} van ${KIJK_METEN.length}: ${stof(opgave.stof).naam}. ${uitleg}`}
      knopTekst={index + 1 >= KIJK_METEN.length ? 'Zelf meten en rekenen' : 'Volgend voorbeeld'}
      onKlaar={volgende}
    />
  );
}

export function DoeMeten({ onOpgave }) {
  const [opgaven] = useState(() => maakMeetOpgaven());
  const [index, setIndex] = useState(0);
  const opgave = opgaven[index];
  const klaar = (uitslag) => {
    onOpgave({ id: `meten-${index + 1}-${opgave.stof}`, punten: uitslag.punten, fouten: uitslag.fouten, onderdelen: uitslag.onderdelen, minpunten: uitslag.minpunten });
    if (index + 1 < opgaven.length) setIndex(index + 1);
  };
  return (
    <Opgave
      key={opgave.id}
      opgave={opgave}
      niveau="D"
      telt
      kop={`Blokje ${index + 1} van ${opgaven.length}${index === opgaven.length - 1 ? ': meet in millimeters' : ''}`}
      knopTekst={index + 1 >= opgaven.length ? 'Naar het oefenblad' : 'Volgend blokje'}
      onKlaar={klaar}
    />
  );
}
