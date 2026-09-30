import { useEffect, useRef, useState } from 'react';
import { Loep } from '../volumeBerekenen/componenten/Maatcilinder';
import { leesGetal, SCHALEN } from '../volumeBerekenen/volumeLogic';
import { speelPlons } from '../volumeBerekenen/volumeSounds';
import { beoordeelUitkomst, f, FORMULES, UITKOMST_FEEDBACK } from '../dichtheid/dichtheidLogic';
import Formuledriehoek from '../dichtheid/componenten/Formuledriehoek';
import { Cilinder } from '../dichtheid/componenten/Kraan';
import Sleepbaar from '../dichtheid/componenten/Sleepbaar';
import Weegschaal from '../dichtheid/componenten/Weegschaal';
import { wilMinderBeweging } from '../dichtheid/componenten/beweging';
import OpgaveSpeler from '../dichtheid/OpgaveSpeler';
import Fles from './componenten/Fles';
import { f2, KIJK_OPGAVE, maakWeegOpgaven, vloeistof, zoekVloeistof } from './vloeistofLogic';

const SCHAAL = SCHALEN.ml100;

// Het vloeistofniveau stijgt rustig tijdens het schenken.
function useNiveau(doel) {
  const [niveau, setNiveau] = useState(doel);
  const vorige = useRef(doel);
  useEffect(() => {
    const van = vorige.current;
    vorige.current = doel;
    if (van === doel) return undefined;
    const duur = wilMinderBeweging() ? 0 : 1100;
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

const ρtekst = (rho) => (rho === undefined ? '…' : f2(rho));

// De stappen voor één vloeistof. Doorrekenen met de eigen (goede) getallen van de leerling.
function maakStappenVoor(o, niveau) {
  const tips = niveau !== 'D';
  return (w) => {
    const stappen = [
      { id: 'leegOp', soort: 'actie', regel: 'gegeven', opdracht: 'Pak de lege maatcilinder, sleep hem naar de weegschaal en laat los.' }
    ];
    if (o.methode === 'aftrekken') {
      stappen.push({
        id: 'mLeeg', soort: 'getal', regel: 'gegeven', opdracht: 'Lees de massa van de lege maatcilinder af.',
        tip: 'Neem het getal van het display over, met de komma.',
        velden: [{ key: 'mLeeg', label: 'm leeg =', eenheid: 'g', juist: o.mLeeg, fout: 'Kijk nog eens goed naar het display.' }],
        oplossing: () => `m leeg = ${f(o.mLeeg, 1)} g.`
      });
    } else {
      stappen.push({
        id: 'nul', soort: 'actie', regel: 'gegeven',
        opdracht: 'Druk op NUL. Zo haal je de massa van de lege maatcilinder eraf (tarra).',
        tip: 'Na NUL staat het scherm op 0,0 g, terwijl de maatcilinder erop staat.'
      });
    }
    stappen.push(
      { id: 'geschonken', soort: 'actie', regel: 'gegeven', opdracht: 'Pak de fles, sleep hem boven de maatcilinder en laat los. Je schenkt dan de vloeistof erin.' },
      {
        id: 'V', soort: 'getal', regel: 'gegeven', opdracht: 'Lees het volume af. Gebruik de loep.',
        tip: 'Lees af bij de onderkant van de meniscus. Eén streepje is 1 ml. 1 ml = 1 cm³.',
        velden: [{ key: 'V', label: 'V =', eenheid: 'cm³', juist: o.V, fout: 'Kijk in de loep naar de onderkant van de meniscus. Eén streepje is 1 ml.' }],
        oplossing: () => `V = ${o.V} ml = ${o.V} cm³.`
      }
    );
    if (o.methode === 'aftrekken') {
      stappen.push(
        {
          id: 'mVol', soort: 'getal', regel: 'gegeven', opdracht: 'Lees de massa af: maatcilinder met vloeistof.',
          velden: [{ key: 'mVol', label: 'm vol =', eenheid: 'g', juist: o.mVol, fout: 'Kijk nog eens goed naar het display.' }],
          oplossing: () => `m vol = ${f(o.mVol, 1)} g.`
        },
        {
          id: 'm', soort: 'getal', regel: 'gegeven', rekenmachine: true, opdracht: 'Bereken de massa van alleen de vloeistof.',
          tip: 'Massa vloeistof = m vol - m leeg.',
          velden: [{
            key: 'm', label: 'm =', eenheid: 'g', juist: (w.mVol ?? o.mVol) - (w.mLeeg ?? o.mLeeg),
            beoordeel: (invoer) => ({ goed: Math.abs((leesGetal(invoer) ?? -999) - ((w.mVol ?? 0) - (w.mLeeg ?? 0))) < 0.05, tekst: 'Massa vloeistof = m vol - m leeg.' })
          }],
          oplossing: () => `m = ${f(w.mVol)} - ${f(w.mLeeg)} = ${f(Math.round((w.mVol - w.mLeeg) * 10) / 10)} g.`
        }
      );
    } else {
      stappen.push({
        id: 'm', soort: 'getal', regel: 'gegeven', opdracht: 'Lees de massa van de vloeistof af. Door de tarra zie je alleen de vloeistof.',
        velden: [{ key: 'm', label: 'm =', eenheid: 'g', juist: o.m, fout: 'Kijk nog eens goed naar het display.' }],
        oplossing: () => `m = ${f(o.m, 1)} g.`
      });
    }
    const m = w.m ?? 0;
    const V = w.V || 1;
    const exact = m / V;
    stappen.push(
      {
        id: 'hand', soort: 'hand', regel: 'formule', juist: 'rho',
        opdracht: 'Je zoekt de dichtheid. Leg de hand op ρ.',
        foutTekst: () => 'Je zoekt de dichtheid, en die heeft de letter ρ (rho).',
        oplossing: () => 'Hand op ρ. Wat overblijft: ρ = m : V.'
      },
      {
        id: 'invullen', soort: 'getal', regel: 'invullen', opdracht: 'Vul de formule in: ρ = m : V.',
        velden: [
          { key: 'invulM', label: 'ρ =', juist: m, fout: 'Eerst de massa van de vloeistof, dan het volume.' },
          { key: 'invulV', label: ':', juist: V, fout: 'Eerst de massa van de vloeistof, dan het volume.' }
        ],
        oplossing: () => `ρ = ${f(m)} : ${f(V)}`
      },
      {
        id: 'rho', soort: 'getal', regel: 'berekenen', rekenmachine: true,
        opdracht: 'Reken uit. Rond af op twee decimalen (één mag ook).',
        tip: 'Bij vloeistoffen liggen de dichtheden dicht bij elkaar. Twee decimalen is dan handiger.',
        velden: [{
          key: 'rho', label: 'ρ =', juist: Math.round(exact * 100) / 100,
          beoordeel: (invoer) => {
            const uitslag = beoordeelUitkomst(invoer, exact);
            return { goed: uitslag.goed, tekst: UITKOMST_FEEDBACK[uitslag.soort] };
          }
        }],
        oplossing: () => `ρ = ${f(m)} : ${f(V)} ≈ ${f2(Math.round(exact * 100) / 100)}`
      },
      {
        id: 'eenheid', soort: 'eenheid', regel: 'eenheid', juist: 'g/cm³',
        opdracht: 'Kies de eenheid van de dichtheid.',
        foutTekst: () => 'Gram gedeeld door cm³: welke eenheid hoort daarbij?',
        oplossing: () => 'De eenheid is g/cm³.'
      },
      {
        id: 'stof', soort: 'stof', regel: 'eenheid',
        juist: (waarden) => zoekVloeistof(waarden.rho)?.id || o.vloeistof,
        isGoed: (id, waarden) => id === (zoekVloeistof(waarden.rho)?.id || o.vloeistof),
        opdracht: `Welke vloeistof is het? Zoek ρ = ${ρtekst(w.rho)} g/cm³ op in het boekje.`,
        foutTekst: () => 'Die vloeistof heeft een andere dichtheid. Zoek de dichtstbijzijnde waarde.',
        oplossing: (waarden) => `ρ = ${ρtekst(waarden.rho)} g/cm³ hoort bij ${zoekVloeistof(waarden.rho)?.naam || vloeistof(o.vloeistof).naam}.`
      }
    );
    return stappen.map((stap) => (tips ? stap : { ...stap, tip: undefined }));
  };
}

function kladbladVoor(o) {
  return (w) => ({
    gegeven: o.methode === 'aftrekken'
      ? `m = ${w.m !== undefined ? f(w.m) : `${w.mVol !== undefined ? f(w.mVol) : '…'} - ${w.mLeeg !== undefined ? f(w.mLeeg) : '…'}`} g    V = ${w.V !== undefined ? f(w.V) : '…'} cm³`
      : `m = ${w.m !== undefined ? f(w.m) : '…'} g (na NUL)    V = ${w.V !== undefined ? f(w.V) : '…'} cm³`,
    gevraagd: 'ρ = ? g/cm³',
    formule: w.hand ? FORMULES[w.hand].tekst : '',
    invullen: w.invulM !== undefined ? `ρ = ${f(w.invulM)} : ${f(w.invulV)}` : '',
    berekenen: w.rho !== undefined ? `ρ = ${f(w.rho)}` : '',
    eenheid: w.eenheid ? `ρ = ${f(w.rho)} ${w.eenheid}${w.stof ? `  (${vloeistof(w.stof)?.naam || ''})` : ''}` : ''
  });
}

function Beeld({ o, stap, w, klaarActie, kies }) {
  const weegRef = useRef(null);
  const cilRef = useRef(null);
  const v = vloeistof(o.vloeistof);
  const niveau = useNiveau(w.geschonken ? o.V : 0);
  const op = Boolean(w.leegOp);
  const massa = op ? o.mLeeg + (w.geschonken ? o.m : 0) : null;
  const tarra = w.nul ? o.mLeeg : 0;
  const reken = ['hand', 'invullen', 'rho', 'eenheid', 'stof'].includes(stap?.id) || !stap;
  const schenken = () => { speelPlons(); klaarActie(); };

  const cilinder = <Cilinder niveau={niveau} hoogte="h-[220px]" idPrefix={`lab-${o.vloeistof}`} vloeistofKleur={v.kleur} />;
  return (
    <div className="flex w-full flex-wrap items-end justify-center gap-5">
      <div className="flex min-h-[230px] w-24 flex-col items-center justify-end gap-2">
        {!op && (
          <Sleepbaar doelen={[{ id: 'weeg', ref: weegRef }]} onDrop={() => klaarActie()} disabled={stap?.id !== 'leegOp'} label="Lege maatcilinder. Sleep naar de weegschaal.">
            {cilinder}
          </Sleepbaar>
        )}
        {op && !w.geschonken && (
          <Sleepbaar doelen={[{ id: 'cil', ref: cilRef }]} onDrop={schenken} disabled={stap?.id !== 'geschonken'} label="Fles. Sleep boven de maatcilinder.">
            <Fles kleur={v.kleur} label="?" />
          </Sleepbaar>
        )}
      </div>
      <Weegschaal
        ref={weegRef}
        massa={massa}
        tarra={tarra}
        onNul={stap?.id === 'nul' ? () => klaarActie() : null}
        nulActief={stap?.id === 'nul'}
        actief={stap?.id === 'leegOp'}
        className="w-60"
      >
        {op && <div ref={cilRef} className={`rounded-xl ${stap?.id === 'geschonken' ? 'outline-dashed outline-2 outline-[#087EB5]' : ''}`}>{cilinder}</div>}
      </Weegschaal>
      {reken ? (
        <Formuledriehoek handOp={w.hand || null} onLeg={stap?.soort === 'hand' ? kies : null} klein={stap?.soort !== 'hand'} />
      ) : w.geschonken ? (
        <Loep schaal={SCHAAL} niveau={niveau} vloeistofKleur={v.kleur} className="w-44 sm:w-52" />
      ) : null}
    </div>
  );
}

function Opgave({ o, niveau, telt, kop, knopTekst, onKlaar }) {
  const [maakStappen] = useState(() => maakStappenVoor(o, niveau));
  const [kladblad] = useState(() => kladbladVoor(o));
  return (
    <OpgaveSpeler
      maakStappen={maakStappen}
      kladblad={kladblad}
      niveau={niveau}
      telt={telt}
      kop={kop}
      knopTekst={knopTekst}
      beeld={(ctx) => <Beeld o={o} {...ctx} />}
      samenvatting={(w) => ({
        groot: `${f2(Math.round((w.rho ?? 0) * 100) / 100)} g/cm³: ${vloeistof(w.stof)?.naam || ''}`,
        klein: o.methode === 'tarra' ? `Met tarra zag je meteen de massa van de vloeistof: ${f(w.m)} g.` : `m = ${f(w.mVol)} - ${f(w.mLeeg)} = ${f(w.m)} g.`
      })}
      onKlaar={onKlaar}
    />
  );
}

export function KijkWegen({ onKlaar }) {
  return (
    <Opgave o={KIJK_OPGAVE} niveau="C" telt={false} kop="Voorbeeld: olie wegen door af te trekken, met tips" knopTekst="Zelf wegen" onKlaar={onKlaar} />
  );
}

export function DoeWegen({ onOpgave }) {
  const [opgaven] = useState(() => maakWeegOpgaven());
  const [index, setIndex] = useState(0);
  const o = opgaven[index];
  const klaar = (uitslag) => {
    onOpgave({ id: `wegen-${index + 1}-${o.vloeistof}`, punten: uitslag.punten, fouten: uitslag.fouten, onderdelen: uitslag.onderdelen, minpunten: uitslag.minpunten });
    if (index + 1 < opgaven.length) setIndex(index + 1);
  };
  return (
    <Opgave
      key={index}
      o={o}
      niveau="D"
      telt
      kop={`Vloeistof ${index + 1} van ${opgaven.length}: ${o.methode === 'tarra' ? 'weeg met tarra (NUL)' : 'weeg door af te trekken'}`}
      knopTekst={index + 1 >= opgaven.length ? 'Naar de dichtheidstoren' : 'Volgende vloeistof'}
      onKlaar={klaar}
    />
  );
}
