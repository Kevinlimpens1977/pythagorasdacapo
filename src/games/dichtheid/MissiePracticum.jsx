import { useEffect, useRef, useState } from 'react';
import { Loep } from '../volumeBerekenen/componenten/Maatcilinder';
import { GEOMETRIE, yVoorWaarde } from '../volumeBerekenen/componenten/cilinderGeometrie';
import { VoorwerpIcoon } from '../volumeBerekenen/componenten/Voorwerp';
import { leesGetal, SCHALEN } from '../volumeBerekenen/volumeLogic';
import { speelPlons } from '../volumeBerekenen/volumeSounds';
import {
  beginGoed, DRIJF_VRAAG, f, FORMULES, fRho, KURK_METHODES, maakKurk, maakPracticum, PRACTICUM_SCHAAL, stof
} from './dichtheidLogic';
import Formuledriehoek from './componenten/Formuledriehoek';
import KraanScene, { Cilinder } from './componenten/Kraan';
import Sleepbaar from './componenten/Sleepbaar';
import { wilMinderBeweging } from './componenten/beweging';
import Weegschaal from './componenten/Weegschaal';
import { kladbladRho, rekenStappenRho } from './rekenStappen';
import OpgaveSpeler from './OpgaveSpeler';

const SCHAAL = SCHALEN[PRACTICUM_SCHAAL];
const VOORGEVULD = 50;
const ZINKER = 10;
const NAAM_VORM = { steen: 'steen', sleutel: 'sleutel', schroef: 'schroef', kurk: 'kurk' };

// Het water stijgt rustig naar een nieuw niveau (zonder animatie bij reduced motion).
function useNiveau(doel) {
  const [niveau, setNiveau] = useState(doel);
  const vorige = useRef(doel);
  useEffect(() => {
    const van = vorige.current;
    vorige.current = doel;
    if (van === doel) return undefined;
    const duur = wilMinderBeweging() ? 0 : 900;
    const begin = performance.now();
    let frame = null;
    const stap = (nu) => {
      const t = duur === 0 ? 1 : Math.min(1, (nu - begin) / duur);
      setNiveau(van + (doel - van) * (1 - (1 - t) * (1 - t)));
      if (t < 1) frame = window.requestAnimationFrame(stap);
    };
    frame = window.requestAnimationFrame(stap);
    return () => window.cancelAnimationFrame(frame);
  }, [doel]);
  return niveau;
}

const ding = (vorm, y, schaal = 0.95) => ({ vorm, x: 110, y, schaal });

// ---------- de drie soorten opgaven ----------

// Practicum: vullen, V begin, wegen, onderdompelen, V eind, V, en dan ρ en de stof.
function practicumStappen(p, niveau) {
  const metTips = niveau !== 'D';
  return (w) => {
    const stappen = [
      {
        id: 'begin', soort: 'actie', regel: 'gegeven',
        opdracht: 'Vul de maatcilinder. Sleep hem onder de kraan en draai de kraan open. Ongeveer half vol is genoeg.'
      },
      {
        id: 'Vbegin', soort: 'getal', regel: 'gegeven',
        opdracht: 'Lees het beginvolume af. Gebruik de loep.',
        tip: 'Lees af bij de onderkant van de meniscus. Eén streepje is 1 ml.',
        velden: [{ key: 'Vbegin', label: 'V begin =', eenheid: 'ml', juist: w.begin, fout: 'Kijk in de loep naar de onderkant van de meniscus. Eén streepje is 1 ml.' }],
        oplossing: () => `Het water staat op ${w.begin} ml.`
      },
      {
        id: 'gewogen', soort: 'actie', regel: 'gegeven',
        opdracht: `Weeg eerst de ${NAAM_VORM[p.vorm]}. Pak hem met de muis of je vinger, sleep hem naar de weegschaal en laat los. Een nat voorwerp weeg je niet.`
      },
      {
        id: 'm', soort: 'getal', regel: 'gegeven',
        opdracht: 'Lees de massa af op de weegschaal.',
        velden: [{ key: 'm', label: 'm =', eenheid: 'g', juist: p.m, fout: 'Kijk nog eens goed naar het display.' }],
        oplossing: () => `m = ${f(p.m, 1)} g.`
      },
      {
        id: 'erin', soort: 'actie', regel: 'gegeven',
        opdracht: `Pak de ${NAAM_VORM[p.vorm]} van de weegschaal, sleep hem boven de maatcilinder en laat los.`
      },
      {
        id: 'Veind', soort: 'getal', regel: 'gegeven',
        opdracht: 'Lees het eindvolume af.',
        tip: 'Weer bij de onderkant van de meniscus.',
        velden: [{ key: 'Veind', label: 'V eind =', eenheid: 'ml', juist: w.begin + p.V, fout: 'Kijk in de loep naar de onderkant van de meniscus.' }],
        oplossing: () => `Het water staat nu op ${w.begin + p.V} ml.`
      },
      {
        id: 'V', soort: 'getal', regel: 'gegeven', rekenmachine: true,
        opdracht: 'Bereken het volume van het voorwerp: V = V eind - V begin.',
        tip: '1 ml = 1 cm³.',
        velden: [{
          key: 'V', label: 'V =', eenheid: 'cm³', juist: (w.Veind ?? 0) - (w.Vbegin ?? 0),
          beoordeel: (invoer) => ({ goed: Math.abs((leesGetal(invoer) ?? -999) - ((w.Veind ?? 0) - (w.Vbegin ?? 0))) < 0.001, tekst: 'V = V eind - V begin. Het grootste getal eerst.' })
        }],
        oplossing: () => `V = ${f(w.Veind)} - ${f(w.Vbegin)} = ${f(w.Veind - w.Vbegin)} cm³.`
      }
    ];
    const reken = rekenStappenRho({ ...w, m: w.m ?? 0, V: w.V ?? 1 });
    return [...stappen, ...reken].map((stap) => (metTips ? stap : { ...stap, tip: undefined }));
  };
}

// Bonus: de stof staat erbij. Wegen, ρ opzoeken, V = m : ρ; daarna controle met water.
function bonusStappen(p) {
  const rho = stof(p.stof).rho;
  return (w) => [
    {
      id: 'gewogen', soort: 'actie', regel: 'gegeven',
      opdracht: 'Weeg de schroef. Pak hem met de muis of je vinger, sleep hem naar de weegschaal en laat los.'
    },
    {
      id: 'm', soort: 'getal', regel: 'gegeven',
      opdracht: 'Lees de massa af.',
      velden: [{ key: 'm', label: 'm =', eenheid: 'g', juist: p.m, fout: 'Kijk nog eens goed naar het display.' }],
      oplossing: () => `m = ${f(p.m, 1)} g.`
    },
    {
      id: 'rhoBoek', soort: 'getal', regel: 'gegeven',
      opdracht: `Zoek de dichtheid van ${stof(p.stof).naam} op in het boekje.`,
      velden: [{ key: 'rhoBoek', label: 'ρ =', eenheid: 'g/cm³', juist: rho, fout: `Kijk nog eens in het boekje bij ${stof(p.stof).naam}.` }],
      oplossing: () => `${stof(p.stof).naam}: ρ = ${fRho(rho)} g/cm³.`
    },
    {
      id: 'hand', soort: 'hand', regel: 'formule', juist: 'V',
      opdracht: 'Je zoekt het volume. Leg de hand op V.',
      foutTekst: () => 'Je zoekt het volume, met de letter V.',
      oplossing: () => 'Hand op V. Wat overblijft: V = m : ρ.'
    },
    {
      id: 'invullen', soort: 'getal', regel: 'invullen',
      opdracht: 'Vul de formule in: V = m : ρ.',
      velden: [
        { key: 'invulM', label: 'V =', juist: w.m, fout: 'Eerst de massa, dan de dichtheid.' },
        { key: 'invulRho', label: ':', juist: w.rhoBoek, fout: 'Eerst de massa, dan de dichtheid.' }
      ],
      oplossing: () => `V = ${f(w.m)} : ${fRho(w.rhoBoek)}`
    },
    {
      id: 'Vuit', soort: 'getal', regel: 'berekenen', rekenmachine: true,
      opdracht: 'Reken het volume uit.',
      velden: [{ key: 'Vuit', label: 'V =', juist: p.V, beoordeel: (invoer) => ({ goed: Math.abs((leesGetal(invoer) ?? -1) - (w.m ?? 0) / (w.rhoBoek ?? 1)) < 0.05, tekst: 'Reken het nog eens na: massa gedeeld door dichtheid.' }) }],
      oplossing: () => `V = ${f(w.m)} : ${fRho(w.rhoBoek)} = ${f(p.V)}`
    },
    {
      id: 'eenheid', soort: 'eenheid', regel: 'eenheid', juist: 'cm³',
      opdracht: 'Kies de eenheid van het volume.',
      foutTekst: () => 'Welke eenheid hoort bij een volume?',
      oplossing: () => 'Een volume is in cm³.'
    },
    {
      id: 'controle', soort: 'actie', regel: null,
      opdracht: `Klopt het? In de maatcilinder staat ${VOORGEVULD} ml water. Pak de schroef, sleep hem boven de maatcilinder en laat los.`
    }
  ];
}

// De kurk drijft: gewoon aflezen geeft een te klein volume.
function kurkStappen(k) {
  return (w) => {
    const stappen = [
      {
        id: 'gewogen', soort: 'actie', regel: 'gegeven',
        opdracht: 'Als laatste: een kurk. Pak hem met de muis of je vinger, sleep hem naar de weegschaal en laat los.'
      },
      {
        id: 'm', soort: 'getal', regel: 'gegeven',
        opdracht: 'Lees de massa af.',
        velden: [{ key: 'm', label: 'm =', eenheid: 'g', juist: k.m, fout: 'Kijk nog eens goed naar het display.' }],
        oplossing: () => `m = ${f(k.m, 1)} g.`
      },
      {
        id: 'Vbegin', soort: 'getal', regel: 'gegeven',
        opdracht: 'Lees het beginvolume af.',
        velden: [{ key: 'Vbegin', label: 'V begin =', eenheid: 'ml', juist: VOORGEVULD, fout: 'Kijk in de loep naar de onderkant van de meniscus.' }],
        oplossing: () => `V begin = ${VOORGEVULD} ml.`
      },
      {
        id: 'erin', soort: 'actie', regel: 'gegeven',
        opdracht: 'Pak de kurk van de weegschaal, sleep hem boven de maatcilinder en laat los.'
      },
      {
        id: 'Vdrijf', soort: 'getal', regel: 'gegeven',
        opdracht: 'Lees het eindvolume af.',
        velden: [{ key: 'Vdrijf', label: 'V eind =', eenheid: 'ml', juist: VOORGEVULD + k.drijfVerplaatsing, fout: 'Kijk in de loep naar de onderkant van de meniscus.' }],
        oplossing: () => `V eind = ${f(VOORGEVULD + k.drijfVerplaatsing)} ml.`
      },
      {
        id: 'methode', soort: 'keuze', regel: 'gegeven', juist: 'naald',
        opdracht: `Dat is maar ${f(k.drijfVerplaatsing)} ml verschil. Kijk naar de kurk: hij drijft. Hoe meet je het echte volume?`,
        opties: KURK_METHODES.map(({ id, tekst }) => ({ id, tekst })),
        isGoed: (id) => KURK_METHODES.find((m) => m.id === id)?.goed === true,
        foutTekst: (id) => KURK_METHODES.find((m) => m.id === id)?.uitleg,
        uitleg: (id) => KURK_METHODES.find((m) => m.id === id)?.uitleg
      }
    ];
    if (w.methode === 'zinker') {
      stappen.push(
        {
          id: 'zinkerIn', soort: 'actie', regel: 'gegeven', knop: 'Doe alleen de zinker in het water',
          opdracht: 'Haal de kurk eruit. Doe eerst alleen de zinker in het water.'
        },
        {
          id: 'Vzinker', soort: 'getal', regel: 'gegeven',
          opdracht: 'Lees af: water met alleen de zinker.',
          velden: [{ key: 'Vzinker', label: 'V1 =', eenheid: 'ml', juist: VOORGEVULD + ZINKER, fout: 'Kijk in de loep naar de onderkant van de meniscus.' }],
          oplossing: () => `V1 = ${VOORGEVULD + ZINKER} ml.`
        },
        {
          id: 'samenIn', soort: 'actie', regel: 'gegeven', knop: 'Maak de kurk vast aan de zinker',
          opdracht: 'Maak de kurk vast aan de zinker en laat ze samen zakken.'
        },
        {
          id: 'Vsamen', soort: 'getal', regel: 'gegeven',
          opdracht: 'Lees af: water met zinker en kurk samen.',
          velden: [{ key: 'Vsamen', label: 'V2 =', eenheid: 'ml', juist: VOORGEVULD + ZINKER + k.V, fout: 'Kijk in de loep naar de onderkant van de meniscus.' }],
          oplossing: () => `V2 = ${VOORGEVULD + ZINKER + k.V} ml.`
        },
        {
          id: 'V', soort: 'getal', regel: 'gegeven',
          opdracht: 'Het volume van de kurk is het verschil: V = V2 - V1.',
          velden: [{ key: 'V', label: 'V =', eenheid: 'cm³', juist: k.V, fout: 'V = V2 - V1.' }],
          oplossing: () => `V = ${VOORGEVULD + ZINKER + k.V} - ${VOORGEVULD + ZINKER} = ${k.V} cm³.`
        }
      );
    } else if (w.methode) {
      stappen.push(
        {
          id: 'naaldIn', soort: 'actie', regel: 'gegeven', knop: 'Duw de kurk onder water',
          opdracht: 'Duw de kurk met de naald helemaal onder water.'
        },
        {
          id: 'Vonder', soort: 'getal', regel: 'gegeven',
          opdracht: 'Lees het eindvolume opnieuw af.',
          velden: [{ key: 'Vonder', label: 'V eind =', eenheid: 'ml', juist: VOORGEVULD + k.V, fout: 'Kijk in de loep naar de onderkant van de meniscus.' }],
          oplossing: () => `V eind = ${VOORGEVULD + k.V} ml.`
        },
        {
          id: 'V', soort: 'getal', regel: 'gegeven',
          opdracht: 'Bereken het volume van de kurk: V = V eind - V begin.',
          velden: [{ key: 'V', label: 'V =', eenheid: 'cm³', juist: k.V, fout: 'V = V eind - V begin, met het nieuwe eindvolume.' }],
          oplossing: () => `V = ${VOORGEVULD + k.V} - ${VOORGEVULD} = ${k.V} cm³.`
        }
      );
    }
    if (w.V !== undefined) {
      stappen.push(...rekenStappenRho(w), {
        id: 'drijft', soort: 'keuze', regel: null, juist: DRIJF_VRAAG.goed,
        opdracht: DRIJF_VRAAG.vraag,
        opties: DRIJF_VRAAG.opties,
        foutTekst: () => 'Denk aan de dichtheid van water: 1,0 g/cm³.',
        uitleg: () => DRIJF_VRAAG.uitleg
      });
    }
    return stappen;
  };
}

// ---------- het beeld ----------

function niveauVoor(soort, p, w) {
  if (soort === 'practicum') return w.begin === undefined ? 0 : w.begin + (w.erin ? p.V : 0);
  if (soort === 'bonus') return VOORGEVULD + (w.controle ? p.V : 0);
  if (w.samenIn) return VOORGEVULD + ZINKER + p.V;
  if (w.zinkerIn) return VOORGEVULD + ZINKER;
  if (w.naaldIn) return VOORGEVULD + p.V;
  return VOORGEVULD + (w.erin ? p.drijfVerplaatsing : 0);
}

function inCilinder(soort, p, w, niveau) {
  const y = (waarde) => yVoorWaarde(waarde, SCHAAL);
  if (soort === 'practicum') return w.erin ? [ding(p.vorm, GEOMETRIE.yNul)] : null;
  if (soort === 'bonus') return w.controle ? [ding('schroef', GEOMETRIE.yNul)] : null;
  if (w.samenIn) return [ding('zinker', GEOMETRIE.yNul, 1), ding('kurk', GEOMETRIE.yNul - 24, 0.95)];
  if (w.zinkerIn) return [ding('zinker', GEOMETRIE.yNul, 1)];
  if (w.naaldIn) return [ding('kurk', y(niveau) + 60), ding('naald', y(niveau) + 22, 1)];
  if (w.erin) return [ding('kurk', y(niveau) + 10)];
  return null;
}

function PracticumBeeld({ soort, p, stap, w, klaarActie, kies }) {
  const weegRef = useRef(null);
  const cilinderRef = useRef(null);
  const doel = niveauVoor(soort, p, w);
  const niveau = useNiveau(doel);

  if (soort === 'practicum' && stap?.id === 'begin') {
    return <KraanScene controle={(begin) => beginGoed(begin, p.V)} onKlaar={(begin) => klaarActie(begin)} />;
  }

  const vorm = soort === 'kurk' ? 'kurk' : soort === 'bonus' ? 'schroef' : p.vorm;
  const gewogen = Boolean(w.gewogen);
  const inWater = w.erin || w.controle || w.zinkerIn || w.naaldIn || w.samenIn;
  const wegen = stap?.id === 'gewogen';
  const zakken = ['erin', 'controle'].includes(stap?.id);
  const laatZakken = () => { speelPlons(); klaarActie(); };
  const rekenen = ['hand', 'invullen', 'rho', 'eenheid', 'stof', 'Vuit', 'drijft'].includes(stap?.id) || !stap;

  return (
    <div className="flex w-full flex-wrap items-end justify-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <div className="flex min-h-[90px] w-28 items-end justify-center">
          {!gewogen && (
            <Sleepbaar doelen={[{ id: 'weeg', ref: weegRef }]} onDrop={() => klaarActie()} disabled={!wegen} label={`${vorm}. Sleep naar de weegschaal.`}>
              <VoorwerpIcoon vorm={vorm} className="h-20 w-20" />
            </Sleepbaar>
          )}
        </div>
        <Weegschaal ref={weegRef} massa={gewogen && !inWater ? p.m : null} actief={wegen} className="w-52">
          {gewogen && !inWater && (
            <Sleepbaar doelen={[{ id: 'cilinder', ref: cilinderRef }]} onDrop={laatZakken} disabled={!zakken} label={`${vorm}. Sleep in de maatcilinder.`}>
              <VoorwerpIcoon vorm={vorm} className="h-20 w-20" />
            </Sleepbaar>
          )}
        </Weegschaal>
        {gewogen && <p className="text-sm font-bold">m = {f(p.m, 1)} g</p>}
      </div>
      <div ref={cilinderRef} className={`rounded-2xl border-2 border-dashed p-1 ${zakken ? 'border-[#087EB5] bg-[#E1F0F8]/70' : 'border-transparent'}`}>
        <Cilinder niveau={niveau} voorwerp={inCilinder(soort, p, w, niveau)} />
      </div>
      {rekenen ? (
        <Formuledriehoek handOp={w.hand || null} onLeg={stap?.soort === 'hand' ? kies : null} klein={stap?.soort !== 'hand'} />
      ) : (
        <Loep schaal={SCHAAL} niveau={niveau} className="w-44 sm:w-52" />
      )}
    </div>
  );
}

// ---------- de opgaven ----------

// De afgelezen volumes blijven op het kladblad staan, zodat de leerling bij
// V = V eind - V begin kan terugkijken wat hij heeft afgelezen.
const afgelezen = (w, velden) => velden
  .filter(([key]) => w[key] !== undefined)
  .map(([key, label]) => `${label} = ${f(w[key])} ml`)
  .join('  ·  ');
const gegevenMetVolumes = (w, velden, vLeeg) => [
  `m = ${w.m !== undefined ? f(w.m) : '…'} g`,
  afgelezen(w, velden),
  `V = ${w.V !== undefined ? `${f(w.V)} cm³` : vLeeg}`
].filter(Boolean).join('    ');

const SOORTEN = {
  practicum: { stappen: practicumStappen, kladblad: (w) => kladbladRho(w, gegevenMetVolumes(w, [['Vbegin', 'V begin'], ['Veind', 'V eind']], 'V eind - V begin')) },
  bonus: {
    stappen: bonusStappen,
    kladblad: (w) => ({
      gegeven: `m = ${w.m !== undefined ? f(w.m) : '…'} g    ρ = ${w.rhoBoek !== undefined ? fRho(w.rhoBoek) : '…'} g/cm³`,
      gevraagd: 'V = ? cm³',
      formule: w.hand ? FORMULES[w.hand].tekst : '',
      invullen: w.invulM !== undefined ? `V = ${f(w.invulM)} : ${fRho(w.invulRho)}` : '',
      berekenen: w.Vuit !== undefined ? `V = ${f(w.Vuit)}` : '',
      eenheid: w.eenheid ? `V = ${f(w.Vuit)} ${w.eenheid}` : ''
    })
  },
  kurk: { stappen: kurkStappen, kladblad: (w) => kladbladRho(w, gegevenMetVolumes(w, [['Vbegin', 'V begin'], ['Vzinker', 'V1'], ['Vsamen', 'V2'], ['Vonder', 'V eind']], '…')) }
};

function Opgave({ soort, p, niveau, telt, kop, knopTekst, onKlaar }) {
  const [maakStappen] = useState(() => SOORTEN[soort].stappen(p, niveau));
  return (
    <OpgaveSpeler
      maakStappen={maakStappen}
      kladblad={SOORTEN[soort].kladblad}
      niveau={niveau}
      telt={telt}
      kop={kop}
      knopTekst={knopTekst}
      beeld={(ctx) => <PracticumBeeld soort={soort} p={p} {...ctx} />}
      samenvatting={(w) => (soort === 'bonus'
        ? { groot: `V = ${f(w.Vuit)} cm³`, klein: `Het water steeg van ${VOORGEVULD} naar ${VOORGEVULD + p.V} ml: ${f(p.V)} cm³. Het klopt.` }
        : { groot: `${fRho(w.rho)} g/cm³: ${stof(w.stof)?.naam}`, klein: soort === 'kurk' ? DRIJF_VRAAG.uitleg : `ρ = ${f(w.m)} : ${f(w.V)}.` })}
      onKlaar={onKlaar}
    />
  );
}

// Het voorbeeld: één practicum met tips, alleen het rekenen staat al klaar in de uitleg.
const KIJK_PRACTICUM = { stof: 'aluminium', vorm: 'steen', V: 12, m: 32.4 };

export function KijkPracticum({ onKlaar }) {
  return (
    <Opgave
      soort="practicum"
      p={KIJK_PRACTICUM}
      niveau="C"
      telt={false}
      kop="Voorbeeld: een practicum, met tips"
      knopTekst="Zelf een practicum doen"
      onKlaar={onKlaar}
    />
  );
}

export function DoePracticum({ onOpgave }) {
  const [reeks] = useState(() => {
    const eerste = maakPracticum();
    let tweede = maakPracticum();
    for (let i = 0; i < 20 && tweede.stof === eerste.stof; i += 1) tweede = maakPracticum();
    const bonus = { ...maakPracticum(Math.random, 'messing'), vorm: 'schroef' };
    return [
      { soort: 'practicum', p: eerste, kop: 'Practicum 1 van 2' },
      { soort: 'practicum', p: tweede, kop: 'Practicum 2 van 2' },
      { soort: 'bonus', p: bonus, kop: 'Bonus: deze schroef is van messing. Hoe groot is het volume?' },
      { soort: 'kurk', p: maakKurk(), kop: 'Als laatste: de kurk' }
    ];
  });
  const [index, setIndex] = useState(0);
  const huidig = reeks[index];
  const klaar = (uitslag) => {
    onOpgave({ id: `practicum-${index + 1}-${huidig.soort}`, punten: uitslag.punten, fouten: uitslag.fouten, onderdelen: uitslag.onderdelen, minpunten: uitslag.minpunten });
    if (index + 1 < reeks.length) setIndex(index + 1);
  };
  return (
    <Opgave
      key={index}
      soort={huidig.soort}
      p={huidig.p}
      niveau="D"
      telt
      kop={huidig.kop}
      knopTekst={index + 1 >= reeks.length ? 'Naar het oefenblad' : 'Volgende'}
      onKlaar={klaar}
    />
  );
}

