import { useCallback, useEffect, useState } from 'react';
import { BadgeCheck, CheckCircle2, Clock, Coins, Loader2, Ticket, X, XCircle } from 'lucide-react';
import { getMijnPrivileges, vraagPrivilegeAan } from '../../services/privilegeService';

// Privileges in de tokenshop (fase 4). Aanvragen schrijft de tokens meteen af;
// de docent keurt goed of wijst af, en dan komen ze terug.

const STATUS = {
  aangevraagd: { label: 'Aangevraagd', Icoon: Clock, klasse: 'bg-[#FFF0B8] text-[#0B0D0F]' },
  goedgekeurd: { label: 'Goedgekeurd', Icoon: CheckCircle2, klasse: 'bg-[var(--color-green-soft)] text-[var(--color-green-ink)]' },
  ingewisseld: { label: 'Ingewisseld', Icoon: BadgeCheck, klasse: 'bg-[var(--helix-surface-soft)] text-[var(--helix-muted)]' },
  afgewezen: { label: 'Afgewezen, tokens terug', Icoon: XCircle, klasse: 'bg-[var(--color-red-soft)] text-[var(--color-red-ink)]' }
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
    <section>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <h2 className="ds-display text-[26px]">Privileges</h2>
        <p className="text-sm font-bold text-[var(--helix-muted)]">Echt iets mogen in de les. Eén per week; je docent keurt het goed.</p>
      </div>
      {melding && <p className="mb-3 rounded-xl border-2 border-[var(--color-green-ink)] bg-[var(--color-green-soft)] px-4 py-2 font-bold text-[var(--color-green-ink)]">{melding}</p>}
      {fout && <p className="mb-3 rounded-xl border-2 border-[#D83A2E] bg-[var(--color-red-soft)] px-4 py-2 font-bold text-[var(--color-red-ink)]">{fout}</p>}

      <div className="grid gap-3 sm:grid-cols-2">
        {stand.privileges.map((privilege) => {
          const genoeg = saldo >= privilege.prijs;
          return (
            <article key={privilege.id} className="flex flex-col gap-2 rounded-2xl border-2 border-[#0B0D0F] bg-white p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#0B0D0F] bg-[#FFD33D]">
                  <Ticket size={22} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-black text-[var(--helix-navy)]">{privilege.titel}</h3>
                  {privilege.beschrijving && <p className="text-sm text-[var(--helix-muted)]">{privilege.beschrijving}</p>}
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-full border border-[#0B0D0F] bg-[#FFF0B8] px-2 py-0.5 text-sm font-black"><Coins size={14} aria-hidden="true" />{privilege.prijs}</span>
              </div>
              <p className="text-xs font-bold text-[var(--helix-muted)]">
                {privilege.overDezeWeek !== null && `Nog ${privilege.overDezeWeek} van ${privilege.voorraadPerWeek} deze week in je klas. `}
                {privilege.maxPerSchooljaar > 0 && `Jij: ${privilege.gebruiktDitSchooljaar} van ${privilege.maxPerSchooljaar} dit schooljaar.`}
              </p>
              <button
                type="button"
                onClick={() => setBevestig(privilege)}
                disabled={!privilege.mag || !genoeg || bezig}
                className="mt-auto flex items-center justify-center gap-1.5 rounded-lg border-2 border-[#0B0D0F] bg-[#087EB5] px-3 py-2 text-sm font-extrabold text-white disabled:bg-[var(--helix-surface-soft)] disabled:text-[var(--helix-muted)]"
              >
                {bezig ? <Loader2 size={16} className="animate-spin" /> : <Ticket size={16} aria-hidden="true" />}
                {!privilege.mag ? 'Nu niet' : genoeg ? 'Aanvragen' : `Nog ${privilege.prijs - saldo}`}
              </button>
              {!privilege.mag && <p className="text-xs text-[var(--helix-muted)]">{privilege.reden}</p>}
            </article>
          );
        })}
      </div>

      {stand.verzoeken.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {stand.verzoeken.map((verzoek) => {
            const status = STATUS[verzoek.status] || STATUS.aangevraagd;
            return (
              <li key={verzoek.id} className="flex flex-wrap items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm">
                <span className="font-bold">{verzoek.titel}</span>
                <span className="text-xs text-[var(--helix-muted)]">{verzoek.week}</span>
                <span className={`ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-extrabold ${status.klasse}`}>
                  <status.Icoon size={12} aria-hidden="true" /> {status.label}
                </span>
                {verzoek.reden && <span className="w-full text-xs text-[var(--helix-muted)]">Reden: {verzoek.reden}</span>}
              </li>
            );
          })}
        </ul>
      )}

      {bevestig && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#0B0D0F]/40 p-4" onClick={() => setBevestig(null)}>
          <div role="dialog" aria-modal="true" aria-label={`${bevestig.titel} aanvragen`} onClick={(event) => event.stopPropagation()} className="w-full max-w-sm overflow-hidden rounded-2xl border-[3px] border-[#0B0D0F] bg-[#FFF7E8] shadow-[6px_6px_0_#0B0D0F]">
            <div className="ds-anchor flex items-center justify-between px-4 py-2">
              <p className="ds-display text-[24px]">Aanvragen?</p>
              <button type="button" onClick={() => setBevestig(null)} aria-label="Sluiten"><X size={18} /></button>
            </div>
            <div className="space-y-3 p-5 text-center">
              <p className="text-lg font-black">{bevestig.titel}</p>
              <p className="text-sm">Voor <strong>{bevestig.prijs} tokens</strong>. Die gaan er nu af. Wijst je docent het af, dan krijg je ze terug.</p>
              <div className="flex justify-center gap-2">
                <button type="button" onClick={() => setBevestig(null)} className="rounded-xl border-[2.5px] border-[#0B0D0F] bg-white px-4 py-2 font-extrabold">Toch niet</button>
                <button type="button" onClick={() => vraag(bevestig)} autoFocus className="rounded-xl border-[2.5px] border-[#0B0D0F] bg-[#2E9D63] px-4 py-2 font-extrabold text-white shadow-[3px_3px_0_#0B0D0F]">Aanvragen</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
