import { useState } from 'react';
import Balk from '../volumeBerekenen/componenten/Balk';
import { VoorwerpIcoon } from '../volumeBerekenen/componenten/Voorwerp';
import { leesGetal } from '../volumeBerekenen/volumeLogic';
import {
  beoordeelUitkomst, EENHEID_VAN, f, FORMULE_DELEN, FORMULES, fRho, KIJK_DRIEHOEK, maakDriehoekOpgaven, NAAM,
  reken, stof, SYMBOOL, UITKOMST_FEEDBACK
} from './dichtheidLogic';
import Formuledriehoek from './componenten/Formuledriehoek';
import OpgaveSpeler from './OpgaveSpeler';

const VOORAF = {
  A: ['rhoBoek', 'hand', 'invullen', 'uitkomst'],
  B: ['rhoBoek', 'hand', 'eenheid'],
  C: [],
  D: []
};

const TEKEN = { m: '×', V: ':', rho: ':' };

// De waarden die de leerling kent: gegeven, plus ρ uit het boekje als hij die heeft opgezocht.
const bekend = (opgave, w) => ({ m: opgave.m, V: opgave.V, rho: opgave.stof ? w.rhoBoek : undefined });

function vraagTekst(opgave) {
  const ding = opgave.voorwerp?.naam || 'blokje';
  // "Een blokje lood", maar "Een sleutel van messing".
  const naam = !opgave.stof ? 'Een blokje'
    : ['sleutel', 'klompje'].includes(ding) ? `Een ${ding} van ${stof(opgave.stof).naam}` : `Een ${ding} ${stof(opgave.stof).naam}`;
  if (opgave.gezocht === 'm') return `${naam} heeft een volume van ${f(opgave.V)} cm³. Hoe groot is de massa?`;
  if (opgave.gezocht === 'V') return `${naam} heeft een massa van ${f(opgave.m)} g. Hoe groot is het volume?`;
  return `${naam} heeft een massa van ${f(opgave.m)} g en een volume van ${f(opgave.V)} cm³. Hoe groot is de dichtheid?`;
}

function maakStappenVoor(opgave, niveau) {
  const vooraf = VOORAF[niveau] || [];
  const g = opgave.gezocht;
  return (w) => {
    const waarden = bekend(opgave, w);
    const stappen = [];
    if (opgave.stof) {
      stappen.push({
        id: 'rhoBoek', soort: 'getal', regel: 'gegeven', vooraf: vooraf.includes('rhoBoek'),
        opdracht: `Zoek de dichtheid van ${stof(opgave.stof).naam} op in het boekje (rechtsboven).`,
        tip: 'Klik rechtsboven op het boekje en zoek de stof op naam.',
        velden: [{ key: 'rhoBoek', label: 'ρ =', eenheid: 'g/cm³', juist: stof(opgave.stof).rho, fout: `Kijk nog eens in het boekje bij ${stof(opgave.stof).naam}.` }],
        oplossing: () => `In het boekje staat: ${stof(opgave.stof).naam} heeft ρ = ${fRho(stof(opgave.stof).rho)} g/cm³.`
      });
    }
    stappen.push({
      id: 'hand', soort: 'hand', regel: 'formule', juist: g, vooraf: vooraf.includes('hand'),
      opdracht: `Je zoekt de ${NAAM[g]}. Leg de hand op ${SYMBOOL[g]} in de driehoek.`,
      tip: 'Wat je zoekt, dek je af. Wat overblijft is de formule.',
      foutTekst: () => `Je zoekt de ${NAAM[g]}. Welke letter hoort daarbij?`,
      oplossing: () => `Hand op ${SYMBOOL[g]}. Wat overblijft: ${FORMULES[g].tekst}.`
    });
    const [a, b] = FORMULE_DELEN[g];
    stappen.push({
      id: 'invullen', soort: 'getal', regel: 'invullen', vooraf: vooraf.includes('invullen'),
      opdracht: `Vul de formule in: ${FORMULES[g].tekst}.`,
      tip: `Zet ${NAAM[a]} voor het teken en ${NAAM[b]} erachter.`,
      velden: [
        { key: 'invulA', label: `${SYMBOOL[g]} =`, juist: waarden[a], fout: `Op de eerste plek hoort de ${NAAM[a]}.` },
        { key: 'invulB', label: TEKEN[g], juist: waarden[b], fout: `Op de tweede plek hoort de ${NAAM[b]}.` }
      ],
      oplossing: () => `${SYMBOOL[g]} = ${f(waarden[a])} ${TEKEN[g]} ${f(waarden[b])}`
    });
    const exact = waarden[a] !== undefined && waarden[b] !== undefined ? reken(g, waarden) : 0;
    stappen.push({
      id: 'uitkomst', soort: 'getal', regel: 'berekenen', rekenmachine: true, vooraf: vooraf.includes('uitkomst'),
      opdracht: g === 'rho' ? 'Reken uit en rond af op één decimaal.' : 'Reken uit met de rekenmachine.',
      tip: `Tik ${f(waarden[a] ?? 0)} ${TEKEN[g]} ${f(waarden[b] ?? 0)} = in.`,
      velden: [{
        key: 'uitkomst', label: `${SYMBOOL[g]} =`, juist: g === 'rho' ? Math.round(exact * 10) / 10 : Math.round(exact * 1000) / 1000,
        beoordeel: (invoer) => {
          if (g === 'rho') {
            const uitslag = beoordeelUitkomst(invoer, exact);
            return { goed: uitslag.goed, tekst: UITKOMST_FEEDBACK[uitslag.soort] };
          }
          return { goed: Math.abs((leesGetal(invoer) ?? -1) - exact) < 0.001, tekst: 'Nog niet goed. Reken het nog eens na met de rekenmachine.' };
        }
      }],
      oplossing: () => `${SYMBOOL[g]} = ${f(waarden[a])} ${TEKEN[g]} ${f(waarden[b])} = ${g === 'rho' ? fRho(exact) : f(exact)}`
    });
    stappen.push({
      id: 'eenheid', soort: 'eenheid', regel: 'eenheid', juist: EENHEID_VAN[g], vooraf: vooraf.includes('eenheid'),
      opdracht: `Kies de eenheid van de ${NAAM[g]}.`,
      tip: { m: 'Massa is in gram.', V: 'Volume is in cm³.', rho: 'Dichtheid is gram per cm³.' }[g],
      foutTekst: () => `Welke eenheid hoort bij de ${NAAM[g]}?`,
      oplossing: () => `De ${NAAM[g]} is in ${EENHEID_VAN[g]}.`
    });
    return stappen;
  };
}

function kladbladVoor(opgave) {
  const g = opgave.gezocht;
  return (w) => {
    const waarden = bekend(opgave, w);
    const gegeven = ['m', 'rho', 'V']
      .filter((letter) => letter !== g)
      .map((letter) => `${SYMBOOL[letter]} = ${waarden[letter] !== undefined ? (letter === 'rho' ? fRho(waarden[letter]) : f(waarden[letter])) : '…'} ${EENHEID_VAN[letter]}`)
      .join('    ');
    return {
      gegeven,
      gevraagd: `${SYMBOOL[g]} = ? ${EENHEID_VAN[g]}`,
      formule: w.hand ? FORMULES[w.hand].tekst : '',
      invullen: w.invulA !== undefined ? `${SYMBOOL[g]} = ${f(w.invulA)} ${TEKEN[g]} ${f(w.invulB)}` : '',
      berekenen: w.uitkomst !== undefined ? `${SYMBOOL[g]} = ${f(w.uitkomst)}` : '',
      eenheid: w.eenheid ? `${SYMBOOL[g]} = ${f(w.uitkomst)} ${w.eenheid}` : ''
    };
  };
}

function Voorwerp({ opgave }) {
  const kleur = opgave.stof ? stof(opgave.stof).kleur : 'koper';
  const vorm = opgave.voorwerp?.vorm;
  const bijschrift = [opgave.stof ? stof(opgave.stof).naam : null, opgave.m !== undefined ? `m = ${f(opgave.m)} g` : null, opgave.V !== undefined ? `V = ${f(opgave.V)} cm³` : null].filter(Boolean).join(', ');
  return (
    <div className="flex flex-col items-center gap-1">
      {vorm ? <VoorwerpIcoon vorm={vorm} className="h-28 w-28" /> : (
        <div className={opgave.voorwerp?.naam === 'staafje' ? 'w-44' : 'w-32'}>
          <Balk l={opgave.voorwerp?.naam === 'staafje' ? 5 : 2} b={1.5} h={opgave.voorwerp?.naam === 'staafje' ? 1 : 2} kleur={kleur} />
        </div>
      )}
      <p className="rounded-lg border-2 border-[#0B0D0F] bg-white px-2 py-0.5 text-sm font-extrabold">{bijschrift}</p>
    </div>
  );
}

function Opgave({ opgave, niveau, telt, kop, knopTekst, onKlaar }) {
  const [maakStappen] = useState(() => maakStappenVoor(opgave, niveau));
  const [kladblad] = useState(() => kladbladVoor(opgave));
  const g = opgave.gezocht;
  return (
    <OpgaveSpeler
      maakStappen={maakStappen}
      kladblad={kladblad}
      niveau={niveau}
      telt={telt}
      kop={<>{kop}<span className="mt-1 block text-lg normal-case tracking-normal text-[#0B0D0F]">{vraagTekst(opgave)}</span></>}
      knopTekst={knopTekst}
      beeld={({ stap, w, kies }) => (
        <div className="flex w-full flex-wrap items-center justify-center gap-6">
          <Voorwerp opgave={opgave} />
          <Formuledriehoek handOp={w.hand || null} onLeg={stap?.soort === 'hand' ? kies : null} />
        </div>
      )}
      samenvatting={(w) => ({
        groot: `${SYMBOOL[g]} = ${g === 'rho' ? fRho(w.uitkomst) : f(w.uitkomst)} ${EENHEID_VAN[g]}`,
        klein: `${FORMULES[g].tekst}, dus ${SYMBOOL[g]} = ${f(w.invulA)} ${TEKEN[g]} ${f(w.invulB)}.`
      })}
      onKlaar={onKlaar}
    />
  );
}

export function KijkDriehoek({ onKlaar }) {
  const [index, setIndex] = useState(0);
  const opgave = KIJK_DRIEHOEK[index];
  const uitleg = { A: 'Alles staat klaar. Kies alleen de eenheid.', B: 'Vul de formule in en reken uit.', C: 'Nu doe je alles zelf, met tips.' }[opgave.niveau];
  return (
    <Opgave
      key={opgave.id}
      opgave={opgave}
      niveau={opgave.niveau}
      telt={false}
      kop={`Voorbeeld ${index + 1} van ${KIJK_DRIEHOEK.length}. ${uitleg}`}
      knopTekst={index + 1 >= KIJK_DRIEHOEK.length ? 'Zelf rekenen' : 'Volgend voorbeeld'}
      onKlaar={() => (index + 1 >= KIJK_DRIEHOEK.length ? onKlaar() : setIndex(index + 1))}
    />
  );
}

export function DoeDriehoek({ onOpgave }) {
  const [opgaven] = useState(() => maakDriehoekOpgaven());
  const [index, setIndex] = useState(0);
  const opgave = opgaven[index];
  const klaar = (uitslag) => {
    onOpgave({ id: `driehoek-${index + 1}-${opgave.gezocht}-${opgave.stof}`, punten: uitslag.punten, fouten: uitslag.fouten, onderdelen: uitslag.onderdelen, minpunten: uitslag.minpunten });
    if (index + 1 < opgaven.length) setIndex(index + 1);
  };
  return (
    <Opgave
      key={opgave.id}
      opgave={opgave}
      niveau="D"
      telt
      kop={`Opgave ${index + 1} van ${opgaven.length}`}
      knopTekst={index + 1 >= opgaven.length ? 'Naar het oefenblad' : 'Volgende opgave'}
      onKlaar={klaar}
    />
  );
}
