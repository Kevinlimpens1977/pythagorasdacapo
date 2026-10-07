import { useCallback, useEffect, useState } from 'react';
import { BadgeCheck, CheckCircle2, Clock, Coins, Loader2, Ticket, X, XCircle } from 'lucide-react';
import { getMijnPrivileges, vraagPrivilegeAan } from '../../services/privilegeService';
import { Kaart, KaartKop, Label } from '../leeromgeving';

// Privileges in de tokenshop (fase 4). Aanvragen schrijft de tokens meteen af;
// de docent keurt goed of wijst af, en dan komen ze terug.

const STATUS = {
  aangevraagd: { label: 'Aangevraagd', Icoon: Clock, kleur: 'oranje' },
  goedgekeurd: { label: 'Goedgekeurd', Icoon: CheckCircle2, kleur: 'groen' },
  ingewisseld: { label: 'Ingewisseld', Icoon: BadgeCheck, kleur: 'blauw' },
  afgewezen: { label: 'Afgewezen, tokens terug', Icoon: XCircle, kleur: 'rood' }
};

export default function PrivilegesSectie({ saldo, uit = false }) {
  const [stand, setStand] = useState(null);
  const [bevestig, setBevestig] = useState(null);
  const [bezig, setBezig] = useState(false);
  const [melding, setMelding] = useState('');
  const [fout, setFout] = useState('');

  const laad = useCallback(async () => {
    try {
      setStand(await getMijnPrivileges());
    } catch (error) {
      console.warn('Privileges niet geladen:', error);
    }
  }, []);

  useEffect(() => {
    if (uit) return;
    Promise.resolve().then(laad);
  }, [laad, uit]);

  if (!stand || stand.privileges.length === 0) return null;

  const vraag = async (privilege) => {
    setBevestig(null);
    setBezig(true);
    try {
      await vraagPrivilegeAan(privilege.id);
      setMelding(`${privilege.titel} is aangevraagd. Je docent keurt het goed.`);
      setFout('');
      await laad();
    } catch (error) {
      setFout(error?.message || 'Aanvragen is mislukt.');
      setMelding('');
    } finally {
      setBezig(false);
    }
  };

  return (
    <Kaart>
      <KaartKop titel="Privileges" uitleg="Echt iets mogen in de les. Eén per week; je docent keurt het goed." />
      {melding && <p className="lo-melding bg-[var(--lo-groen-zacht)] text-[var(--lo-groen-inkt)]">{melding}</p>}
      {fout && <p className="lo-melding lo-melding--fout">{fout}</p>}

      <div className="grid gap-3 sm:grid-cols-2">
        {stand.privileges.map((privilege) => {
          const genoeg = saldo >= privilege.prijs;
          return (
            <article key={privilege.id} className="flex flex-col gap-2 rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] bg-[var(--lo-kaart)] p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--lo-hoek-m)] bg-[var(--lo-geel-zacht)] text-[var(--lo-inkt)]">
                  <Ticket size={22} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="lo-rij-titel">{privilege.titel}</h3>
                  {privilege.beschrijving && <p className="text-sm text-[var(--lo-grijs)]">{privilege.beschrijving}</p>}
                </div>
                <Label kleur="oranje" icoon={Coins}>{privilege.prijs}</Label>
              </div>
              <p className="lo-onderregel">
                {privilege.overDezeWeek !== null && `Nog ${privilege.overDezeWeek} van ${privilege.voorraadPerWeek} deze week in je klas. `}
                {privilege.maxPerSchooljaar > 0 && `Jij: ${privilege.gebruiktDitSchooljaar} van ${privilege.maxPerSchooljaar} dit schooljaar.`}
              </p>
              <button
                type="button"
                onClick={() => setBevestig(privilege)}
                disabled={!privilege.mag || !genoeg || bezig}
                className="lo-knop mt-auto justify-center px-3 py-2 text-sm"
              >
                {bezig ? <Loader2 size={16} className="animate-spin" /> : <Ticket size={16} aria-hidden="true" />}
                {!privilege.mag ? 'Nu niet' : genoeg ? 'Aanvragen' : `Nog ${privilege.prijs - saldo}`}
              </button>
              {!privilege.mag && <p className="lo-onderregel">{privilege.reden}</p>}
            </article>
          );
        })}
      </div>

      {stand.verzoeken.length > 0 && (
        <ul className="lo-lijst">
          {stand.verzoeken.map((verzoek) => {
            const status = STATUS[verzoek.status] || STATUS.aangevraagd;
            return (
              <li key={verzoek.id} className="lo-rij text-sm">
                <span className="lo-rij-titel">{verzoek.titel}</span>
                <span className="lo-onderregel">{verzoek.week}</span>
                <Label kleur={status.kleur} icoon={status.Icoon} className="ml-auto">{status.label}</Label>
                {verzoek.reden && <span className="lo-onderregel w-full">Reden: {verzoek.reden}</span>}
              </li>
            );
          })}
        </ul>
      )}

      {bevestig && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[var(--lo-inkt)]/40 p-4" onClick={() => setBevestig(null)}>
          <div role="dialog" aria-modal="true" aria-label={`${bevestig.titel} aanvragen`} onClick={(event) => event.stopPropagation()} className="lo-kaart w-full max-w-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="lo-kaart-titel">Aanvragen?</p>
              <button type="button" onClick={() => setBevestig(null)} aria-label="Sluiten" className="rounded-[var(--lo-hoek-s)] p-1 text-[var(--lo-grijs)] hover:text-[var(--lo-inkt)]"><X size={18} /></button>
            </div>
            <div className="flex flex-col gap-3 text-center">
              <p className="text-lg font-extrabold">{bevestig.titel}</p>
              <p className="text-sm">Voor <strong>{bevestig.prijs} tokens</strong>. Die gaan er nu af. Wijst je docent het af, dan krijg je ze terug.</p>
              <div className="flex flex-wrap justify-center gap-2">
                <button type="button" onClick={() => setBevestig(null)} className="lo-knop-tweede">Toch niet</button>
                <button type="button" onClick={() => vraag(bevestig)} autoFocus className="lo-knop">Aanvragen</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Kaart>
  );
}
